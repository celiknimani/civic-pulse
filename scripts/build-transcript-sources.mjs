#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { countryPath, publicDataPath, readArg, resolveCountry } from './lib/country.mjs';

const argv = process.argv.slice(2);
const country = resolveCountry(argv);

const transcriptsDir = path.resolve(readArg(argv, '--transcripts', countryPath(country, 'transcripts')));
const outputPath = path.resolve(readArg(argv, '--out', publicDataPath('transcript-sources.json')));
const locale = readArg(argv, '--locale', null);

const parseTimestamp = (value) => {
  const timestamp = Date.parse(String(value || '').trim());
  return Number.isNaN(timestamp) ? null : timestamp;
};

const formatLocalDate = (value, dateLocale) => {
  const timestamp = parseTimestamp(value);
  if (timestamp === null) return String(value || '').trim();

  const formatted = new Intl.DateTimeFormat(dateLocale, {
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

const stripGeneratedAt = (manifest) => {
  const { generatedAt: _generatedAt, ...rest } = manifest || {};
  return rest;
};

const writeManifestIfChanged = async (absolutePath, manifest) => {
  try {
    const existing = JSON.parse(await fs.readFile(absolutePath, 'utf8'));
    if (JSON.stringify(stripGeneratedAt(existing)) === JSON.stringify(stripGeneratedAt(manifest))) {
      return false;
    }
  } catch (_error) {
    // Missing or invalid output should be regenerated.
  }

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, JSON.stringify(manifest, null, 2), 'utf8');
  return true;
};

const loadCountryConfig = async () => {
  try {
    const raw = await fs.readFile(countryPath(country, 'config.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const build = async () => {
  const config = await loadCountryConfig();
  const dateLocale = locale || config.dateLocale || config.locale || 'en-US';
  const transcriptLabels = config.transcriptLabels || {};
  const fallbackLabel = transcriptLabels.fallback || 'Parliament session transcript';
  const officialLabel = transcriptLabels.officialPdf || 'Official PDF';
  const sourceDomainMatchers = config.transcriptSourceMatchers || [];

  let files = [];
  try {
    files = (await fs.readdir(transcriptsDir))
      .filter((fileName) => fileName.endsWith('.json'))
      .sort((left, right) => left.localeCompare(right));
  } catch {
    files = [];
  }

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

  const getSourceType = (url) => {
    for (const matcher of sourceDomainMatchers) {
      try {
        if (new RegExp(matcher.pattern, 'i').test(url)) return matcher.label;
      } catch {
        // Skip invalid regex
      }
    }
    return officialLabel;
  };

  const sources = [...groups.values()]
    .map((group) => {
      const dates = sortIsoDates([...group.dates]);
      const sourceLabels = [...group.sources].sort((left, right) => left.localeCompare(right, dateLocale));
      const baseName =
        sourceLabels.find((label) => /transcript|transkript|protokoll|sitzung/i.test(label)) ||
        sourceLabels[0] ||
        fallbackLabel;
      const dateLabel = dates.map((date) => formatLocalDate(date, dateLocale)).join(', ');
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
      return left.name.localeCompare(right.name, dateLocale);
    })
    .map(({ latestTimestamp, ...source }) => source);

  const manifest = {
    generatedAt: new Date().toISOString(),
    country,
    sourceCount: sources.length,
    sources,
  };

  const wroteOutput = await writeManifestIfChanged(outputPath, manifest);

  console.log(`[${country}] ${wroteOutput ? 'Saved' : 'Unchanged'} ${sources.length} transcript sources at ${outputPath}`);
};

build().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
