// Deduplicate freshly extracted entries against existing committed data so the
// agent doesn't open PRs full of stuff humans already merged.
//
// Match strategy:
//   * promise_update    → existing promise.updates[].description / source URL
//   * minister_statement → fuzzy match minister + sourceQuote against any prior
//     update in the same promise category (best-effort; signals only)
//   * deputy_activity   → match speaker + verbatim text against the existing
//     transcripts/*.json
//
// All matches are by normalized text, not exact equality, so trivial whitespace
// changes still dedupe.

import fs from 'node:fs/promises';
import path from 'node:path';

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const truncated = (value, max = 80) => normalize(value).slice(0, max);

const buildPromiseSignatures = (promisesIndex) => {
  const seen = new Set();
  (promisesIndex || []).forEach((promise) => {
    (promise.updates || []).forEach((update) => {
      const description = truncated(update.description || '');
      if (description) seen.add(`${promise.id}::${description}`);
      const url = (update.sourceUrl || '').trim();
      if (url) seen.add(`${promise.id}::${url}`);
    });
  });
  return seen;
};

const buildDeputySignatures = async (countryRoot) => {
  const signatures = new Set();
  const dir = path.join(countryRoot, 'transcripts');
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch {
    return signatures;
  }
  for (const file of entries) {
    if (!file.endsWith('.json')) continue;
    try {
      const raw = await fs.readFile(path.join(dir, file), 'utf8');
      const rows = JSON.parse(raw);
      if (!Array.isArray(rows)) continue;
      rows.forEach((row) => {
        const speaker = normalize(row?.speaker);
        const text = truncated(row?.text || '');
        if (speaker && text) signatures.add(`${speaker}::${text}`);
      });
    } catch {
      // Skip malformed transcripts.
    }
  }
  return signatures;
};

export const buildDedupeIndex = async ({ context, domains }) => {
  const promiseSigs = domains.includes('promises')
    ? buildPromiseSignatures(context.promisesIndex)
    : new Set();
  const deputySigs = domains.includes('deputies')
    ? await buildDeputySignatures(context.countryRoot)
    : new Set();
  return { promiseSigs, deputySigs };
};

export const isDuplicate = (entry, index) => {
  if (!entry) return false;

  if (entry.kind === 'promise_update' || entry.kind === 'minister_statement') {
    if (!entry.promiseId) return false;
    const description = truncated(entry.summary || entry.sourceQuote || '');
    if (description && index.promiseSigs.has(`${entry.promiseId}::${description}`)) return true;
    const url = (entry.sourceUrl || '').trim();
    if (url && index.promiseSigs.has(`${entry.promiseId}::${url}`)) return true;
    return false;
  }

  if (entry.kind === 'deputy_activity') {
    const speaker = normalize(entry.deputyName);
    const text = truncated(entry.sourceQuote || '');
    if (speaker && text && index.deputySigs.has(`${speaker}::${text}`)) return true;
    return false;
  }

  return false;
};

export const partitionDuplicates = (entries, index) => {
  const kept = [];
  const skipped = [];
  for (const entry of entries) {
    if (isDuplicate(entry, index)) skipped.push(entry);
    else kept.push(entry);
  }
  return { kept, skipped };
};
