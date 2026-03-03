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

const inputPath = path.resolve(projectRoot, readArg('--in', 'PROMISE_SOURCES.md'));
const outputPath = path.resolve(projectRoot, readArg('--out', 'public/data/promise-sources.json'));

const EXPECTED_COLUMNS = [
  'source_id',
  'type',
  'trust_tier',
  'promise_ids',
  'tags',
  'enabled',
  'fetch_mode',
  'url',
];

const parseBoolean = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  throw new Error(`Invalid boolean value "${value}"`);
};

const parseCsv = (value) =>
  String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const parsePromiseIds = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized || normalized === '*') return ['*'];

  const parsed = parseCsv(normalized);
  if (parsed.some((entry) => !/^\d+$/.test(entry))) {
    throw new Error(`Invalid promise_ids value "${value}"`);
  }
  return parsed;
};

const parseMarkdownTable = (content) => {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let headerIndex = -1;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith('|') || !line.endsWith('|')) continue;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (EXPECTED_COLUMNS.every((column, colIndex) => cells[colIndex] === column)) {
      headerIndex = index;
      break;
    }
  }

  if (headerIndex < 0 || headerIndex + 1 >= lines.length) {
    throw new Error(`Could not find markdown table with expected columns in ${inputPath}`);
  }

  const headerCells = lines[headerIndex]
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
  const dataLines = [];

  for (let index = headerIndex + 2; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith('|') || !line.endsWith('|')) break;
    if (/^\|\s*-+\s*(\|\s*-+\s*)+\|$/.test(line)) continue;
    dataLines.push(line);
  }

  return dataLines.map((line) => {
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length !== headerCells.length) {
      throw new Error(`Invalid table row (column mismatch): ${line}`);
    }

    return headerCells.reduce((entry, key, index) => {
      entry[key] = cells[index];
      return entry;
    }, {});
  });
};

const validateSourceType = (value) => {
  const allowed = new Set(['government_website', 'minister_social', 'trusted_news']);
  if (!allowed.has(value)) {
    throw new Error(`Invalid type "${value}"`);
  }
  return value;
};

const validateFetchMode = (value) => {
  const allowed = new Set(['html', 'rss', 'search', 'manual']);
  if (!allowed.has(value)) {
    throw new Error(`Invalid fetch_mode "${value}"`);
  }
  return value;
};

const validateUrl = (value) => {
  const normalized = String(value || '').trim();
  try {
    const parsed = new URL(normalized);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('URL must use HTTP/S');
    }
    return parsed.toString();
  } catch (error) {
    throw new Error(`Invalid url "${value}"`);
  }
};

const build = async () => {
  const markdown = await fs.readFile(inputPath, 'utf8');
  const rows = parseMarkdownTable(markdown);
  const seenIds = new Set();

  const sources = rows.map((row) => {
    const sourceId = String(row.source_id || '').trim();
    if (!sourceId) {
      throw new Error('Missing source_id');
    }
    if (!/^[a-z0-9-]+$/.test(sourceId)) {
      throw new Error(`Invalid source_id "${sourceId}". Use kebab-case.`);
    }
    if (seenIds.has(sourceId)) {
      throw new Error(`Duplicate source_id "${sourceId}"`);
    }
    seenIds.add(sourceId);

    const trustTier = Number.parseInt(String(row.trust_tier || '').trim(), 10);
    if (![1, 2, 3].includes(trustTier)) {
      throw new Error(`Invalid trust_tier "${row.trust_tier}" for source_id "${sourceId}"`);
    }

    return {
      sourceId,
      type: validateSourceType(String(row.type || '').trim()),
      trustTier,
      promiseIds: parsePromiseIds(row.promise_ids),
      tags: parseCsv(row.tags),
      enabled: parseBoolean(row.enabled),
      fetchMode: validateFetchMode(String(row.fetch_mode || '').trim()),
      url: validateUrl(row.url),
    };
  });

  const enabledSources = sources.filter((source) => source.enabled).length;
  const summary = sources.reduce(
    (acc, source) => {
      acc.byType[source.type] = (acc.byType[source.type] || 0) + 1;
      acc.byTrustTier[String(source.trustTier)] = (acc.byTrustTier[String(source.trustTier)] || 0) + 1;
      return acc;
    },
    { byType: {}, byTrustTier: {} },
  );

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceCount: sources.length,
    enabledSourceCount: enabledSources,
    summary,
    sources,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`Saved ${sources.length} promise sources to ${outputPath}`);
};

build().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
