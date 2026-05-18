// Split a long document into overlapping windows so we can run extraction on each
// chunk without exceeding model context limits.
//
// We split on paragraph boundaries when possible. Each chunk has an overlap region
// (default 2k chars) with the next chunk so an entry that straddles a boundary still
// has its full sourceQuote visible in at least one window.

const DEFAULT_WINDOW = 50000;
const DEFAULT_OVERLAP = 2000;
const SOFT_BOUNDARY_BACKSCAN = 1500;

const findSoftBoundary = (text, targetEnd) => {
  if (targetEnd >= text.length) return text.length;
  const start = Math.max(targetEnd - SOFT_BOUNDARY_BACKSCAN, 0);
  const slice = text.slice(start, targetEnd);

  const paragraphIndex = slice.lastIndexOf('\n\n');
  if (paragraphIndex > 0) return start + paragraphIndex + 2;

  const sentenceMatch = slice.lastIndexOf('. ');
  if (sentenceMatch > 0) return start + sentenceMatch + 2;

  return targetEnd;
};

export const chunkDocument = (text, { windowSize = DEFAULT_WINDOW, overlap = DEFAULT_OVERLAP } = {}) => {
  if (typeof text !== 'string' || text.length === 0) return [];
  if (text.length <= windowSize) return [{ index: 0, total: 1, text, offset: 0 }];

  const chunks = [];
  let offset = 0;
  let index = 0;

  while (offset < text.length) {
    const desiredEnd = Math.min(offset + windowSize, text.length);
    const end = desiredEnd === text.length ? text.length : findSoftBoundary(text, desiredEnd);
    const slice = text.slice(offset, end);
    chunks.push({ index, total: 0, text: slice, offset });

    if (end >= text.length) break;
    offset = Math.max(end - overlap, offset + 1);
    index += 1;
  }

  return chunks.map((chunk) => ({ ...chunk, total: chunks.length }));
};

const dedupeKey = (entry) => {
  const quote = String(entry?.sourceQuote || '').trim().toLowerCase();
  const kind = String(entry?.kind || '').trim();
  const subject =
    entry?.deputyId ||
    entry?.deputyName ||
    entry?.ministerName ||
    entry?.promiseId ||
    '';
  return `${kind}::${subject}::${quote}`;
};

export const mergeChunkResults = (results) => {
  const seen = new Map();

  for (const result of results) {
    const entries = Array.isArray(result?.entries) ? result.entries : [];
    for (const entry of entries) {
      const key = dedupeKey(entry);
      if (!key.endsWith('::')) {
        const existing = seen.get(key);
        if (!existing || (entry.confidence || 0) > (existing.confidence || 0)) {
          seen.set(key, entry);
        }
      } else {
        // Missing quote → can't dedupe; keep with unique key.
        seen.set(`${Math.random()}`, entry);
      }
    }
  }

  return { entries: Array.from(seen.values()) };
};
