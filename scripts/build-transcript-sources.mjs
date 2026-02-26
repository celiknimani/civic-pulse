#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);

const readArg = (name, fallback) => {
  const index = args.findIndex((arg) => arg === name);
  if (index < 0) return fallback;
  return args[index + 1] || fallback;
};

const transcriptsDir = path.resolve(projectRoot, readArg('--transcripts', 'datasets/transcripts'));
const outputPath = path.resolve(projectRoot, readArg('--out', 'public/data/transcript-sources.json'));

const parseTimestamp = (value) => {
  const timestamp = Date.parse(String(value || '').trim());
  return Number.isNaN(timestamp) ? null : timestamp;
};

const formatDateSq = (value) => {
  const timestamp = parseTimestamp(value);
  if (timestamp === null) return String(value || '').trim();

  const formatted = new Intl.DateTimeFormat('sq-AL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(timestamp);

  return formatted ? `${formatted.charAt(0).toUpperCase()}${formatted.slice(1)}` : String(value || '').trim();
};

const sortIsoDates = (dates) =>
  [...new Set(dates.map((value) => String(value || '').trim()).filter(Boolean))].sort((left, right) => {
    const leftTimestamp = parseTimestamp(left);
    const rightTimestamp = parseTimestamp(right);
    const safeLeft = leftTimestamp === null ? -1 : leftTimestamp;
    const safeRight = rightTimestamp === null ? -1 : rightTimestamp;

    if (safeLeft !== safeRight) return safeLeft - safeRight;
    return left.localeCompare(right);
  });

const getSourceType = (url) =>
  /kuvendikosoves\.org/i.test(String(url || '')) ? 'Kuvendi i Kosoves - PDF zyrtar' : 'Dokument zyrtar - PDF';

const build = async () => {
  const files = (await fs.readdir(transcriptsDir))
    .filter((fileName) => fileName.endsWith('.json'))
    .sort((left, right) => left.localeCompare(right));

  const groups = new Map();

  for (const fileName of files) {
    const absolutePath = path.join(transcriptsDir, fileName);
    const content = await fs.readFile(absolutePath, 'utf8');
    const payload = JSON.parse(content);
    const rows = Array.isArray(payload) ? payload : [];

    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;

      const url = typeof row.sourceUrl === 'string' ? row.sourceUrl.trim() : '';
      if (!url) continue;

      const source = typeof row.source === 'string' ? row.source.trim() : '';
      const date = typeof row.date === 'string' ? row.date.trim() : '';
      const sessionId = typeof row.sessionId === 'string' ? row.sessionId.trim() : '';

      if (!groups.has(url)) {
        groups.set(url, {
          url,
          sources: new Set(),
          dates: new Set(),
          sessionIds: new Set(),
          files: new Set(),
        });
      }

      const group = groups.get(url);
      if (source) group.sources.add(source);
      if (date) group.dates.add(date);
      if (sessionId) group.sessionIds.add(sessionId);
      group.files.add(fileName);
    }
  }

  const sources = [...groups.values()]
    .map((group) => {
      const dates = sortIsoDates([...group.dates]);
      const sourceLabels = [...group.sources].sort((left, right) => left.localeCompare(right, 'sq-AL'));
      const baseName = sourceLabels.find((label) => /transkript/i.test(label)) || sourceLabels[0] || 'Transkripti zyrtar i seances plenare';
      const dateLabel = dates.map((date) => formatDateSq(date)).join(', ');
      const latestDate = dates[dates.length - 1] || '';
      const latestTimestamp = parseTimestamp(latestDate) || 0;

      return {
        name: dateLabel ? `${baseName} (${dateLabel})` : baseName,
        url: group.url,
        type: getSourceType(group.url),
        dates,
        sessionIds: [...group.sessionIds].sort((left, right) => left.localeCompare(right)),
        files: [...group.files].sort((left, right) => left.localeCompare(right)),
        latestDate,
        latestTimestamp,
      };
    })
    .sort((left, right) => {
      if (right.latestTimestamp !== left.latestTimestamp) {
        return right.latestTimestamp - left.latestTimestamp;
      }
      return left.name.localeCompare(right.name, 'sq-AL');
    })
    .map(({ latestTimestamp, ...source }) => source);

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceCount: sources.length,
    sources,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`Saved ${sources.length} transcript sources to ${outputPath}`);
};

build().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
