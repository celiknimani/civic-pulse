#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEPUTY_TOPIC_TAXONOMY } from '../categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);

const readArg = (name, fallback) => {
  const index = args.findIndex((arg) => arg === name);
  if (index < 0) return fallback;
  return args[index + 1] || fallback;
};

const deputiesPath = path.resolve(projectRoot, readArg('--deputies', 'datasets/deputies.csv'));
const transcriptsDir = path.resolve(projectRoot, readArg('--transcripts', 'datasets/transcripts'));
const outputPath = path.resolve(projectRoot, readArg('--out', 'public/data/deputies-analytics.json'));

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const TOPIC_TAXONOMY = DEPUTY_TOPIC_TAXONOMY.map((topic) => ({
  id: topic.topicId,
  label: topic.label,
  keywords: topic.keywords.map((keyword) => normalize(keyword)).filter(Boolean),
}));

const safeSplitCsvLine = (line) => {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
};

const loadDeputies = async () => {
  const csv = await fs.readFile(deputiesPath, 'utf8');
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error(`Deputies file ${deputiesPath} has no data rows.`);
  }

  const headers = safeSplitCsvLine(lines[0]).map((header) => normalize(header));
  const nameIndex = headers.findIndex((header) => header === 'name' || header === 'emri');
  const partyIndex = headers.findIndex((header) => header === 'party' || header === 'partia');
  const profileIndex = headers.findIndex((header) => header === 'profile_url' || header === 'profili');

  if (nameIndex < 0 || partyIndex < 0) {
    throw new Error('CSV must include name/emri and party/partia columns.');
  }

  return lines.slice(1).map((line, index) => {
    const cells = safeSplitCsvLine(line);
    const name = cells[nameIndex] || `Deputeti ${index + 1}`;
    const party = cells[partyIndex] || 'E pa specifikuar';
    const profileUrl = profileIndex >= 0 ? cells[profileIndex] : '';
    const id = normalize(name).replace(/\s+/g, '-');

    return {
      id: id || `deputeti-${String(index + 1).padStart(3, '0')}`,
      name,
      party,
      profileUrl: profileUrl || undefined,
      normalizedName: normalize(name),
    };
  });
};

const loadTranscriptEntries = async () => {
  const files = await fs.readdir(transcriptsDir);
  const entries = [];

  for (const fileName of files) {
    const absolutePath = path.join(transcriptsDir, fileName);
    const stat = await fs.stat(absolutePath);
    if (!stat.isFile()) continue;

    if (fileName.endsWith('.json')) {
      const content = await fs.readFile(absolutePath, 'utf8');
      const payload = JSON.parse(content);
      const rows = Array.isArray(payload) ? payload : [];
      rows.forEach((row, index) => {
        if (!row || typeof row !== 'object') return;
        if (!row.speaker || !row.text) return;

        entries.push({
          speaker: String(row.speaker),
          text: String(row.text),
          sessionId: String(row.sessionId || path.parse(fileName).name),
          date: String(row.date || ''),
          source: String(row.source || fileName),
          sourceUrl: typeof row.sourceUrl === 'string' ? row.sourceUrl : '',
          row: `${fileName}:${index + 1}`,
        });
      });
      continue;
    }

    if (fileName.endsWith('.txt')) {
      const content = await fs.readFile(absolutePath, 'utf8');
      const lines = content.split(/\r?\n/);
      lines.forEach((line, index) => {
        const divider = line.indexOf(':');
        if (divider < 0) return;
        const speaker = line.slice(0, divider).trim();
        const text = line.slice(divider + 1).trim();
        if (!speaker || !text) return;

        entries.push({
          speaker,
          text,
          sessionId: path.parse(fileName).name,
          date: '',
          source: fileName,
          sourceUrl: '',
          row: `${fileName}:${index + 1}`,
        });
      });
    }
  }

  return entries;
};

const countWordInNormalizedText = (normalizedText, normalizedKeyword) => {
  if (!normalizedKeyword) return 0;

  const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\b${escaped}`, 'g');
  const matches = normalizedText.match(pattern);
  return matches ? matches.length : 0;
};

const classifyTopics = (text) => {
  const normalizedText = normalize(text);

  return TOPIC_TAXONOMY.map((topic) => {
    const mentions = topic.keywords.reduce((sum, keyword) => sum + countWordInNormalizedText(normalizedText, keyword), 0);
    return {
      topicId: topic.id,
      label: topic.label,
      mentions,
    };
  });
};

const getWordCount = (text) => normalize(text).split(' ').filter(Boolean).length;

const stripParliamentaryPreface = (text) => {
  let value = String(text || '').replace(/\s+/g, ' ').trim();
  if (!value) return value;

  // Common formal opening that makes many entries look identical in previews.
  value = value.replace(/^faleminderit[,!\.\s]*/i, '').trim();
  value = value.replace(/^(e|i|te)\s+nderuar[^.!?]{0,140}[.!?]\s*/i, '').trim();

  return value || String(text || '').replace(/\s+/g, ' ').trim();
};

const createExcerpt = (text, maxLength = 240) => {
  const compact = stripParliamentaryPreface(text);
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength).trim()}...`;
};

const sortHistoryNewestFirst = (a, b) => {
  const aTimestamp = Date.parse(a.date || '');
  const bTimestamp = Date.parse(b.date || '');
  const safeA = Number.isNaN(aTimestamp) ? -1 : aTimestamp;
  const safeB = Number.isNaN(bTimestamp) ? -1 : bTimestamp;

  if (safeB !== safeA) return safeB - safeA;
  return String(a.reference).localeCompare(String(b.reference));
};

const speakerMarkerRegex = /([\p{Lu}\p{M}][\p{Lu}\p{M}\s.'-]{2,}):\s*/gu;

const splitEntryByEmbeddedSpeakerMarkers = (entry, isKnownDeputySpeaker) => {
  const text = String(entry.text || '').replace(/\s+/g, ' ').trim();
  if (!text) return [];

  const markers = [];

  for (const match of text.matchAll(speakerMarkerRegex)) {
    const markerSpeaker = String(match[1] || '').replace(/\s+/g, ' ').trim();
    const markerIndex = typeof match.index === 'number' ? match.index : -1;
    if (!markerSpeaker || markerIndex < 0) continue;
    if (!isKnownDeputySpeaker(markerSpeaker)) continue;

    markers.push({
      speaker: markerSpeaker,
      index: markerIndex,
      markerLength: match[0].length,
    });
  }

  if (!markers.length) {
    return [{ ...entry, text }];
  }

  const segments = [];
  let currentSpeaker = String(entry.speaker || '').trim();
  let cursor = 0;

  markers.forEach((marker) => {
    const before = text.slice(cursor, marker.index).trim();
    if (before) {
      segments.push({
        speaker: currentSpeaker,
        text: before,
      });
    }

    currentSpeaker = marker.speaker;
    cursor = marker.index + marker.markerLength;
  });

  const tail = text.slice(cursor).trim();
  if (tail) {
    segments.push({
      speaker: currentSpeaker,
      text: tail,
    });
  }

  if (segments.length <= 1) {
    return [{ ...entry, text }];
  }

  return segments.map((segment, index) => ({
    ...entry,
    speaker: segment.speaker,
    text: segment.text,
    row: `${entry.row}#${index + 1}`,
  }));
};

const build = async () => {
  const deputies = await loadDeputies();
  const transcriptEntriesRaw = await loadTranscriptEntries();
  const deputyByName = new Map(deputies.map((deputy) => [deputy.normalizedName, deputy]));
  const isKnownDeputySpeaker = (speaker) => deputyByName.has(normalize(speaker));
  const transcriptEntries = transcriptEntriesRaw.flatMap((entry) =>
    splitEntryByEmbeddedSpeakerMarkers(entry, isKnownDeputySpeaker)
  );
  const statsById = new Map();

  deputies.forEach((deputy) => {
    statsById.set(deputy.id, {
      speechCount: 0,
      wordCount: 0,
      sessions: new Set(),
      topics: TOPIC_TAXONOMY.map((topic) => ({
        topicId: topic.id,
        label: topic.label,
        mentions: 0,
      })),
      history: [],
    });
  });

  transcriptEntries.forEach((entry) => {
    const normalizedSpeaker = normalize(entry.speaker);
    const deputy = deputyByName.get(normalizedSpeaker);
    if (!deputy) return;

    const stats = statsById.get(deputy.id);
    stats.speechCount += 1;
    stats.wordCount += getWordCount(entry.text);
    stats.sessions.add(entry.sessionId || entry.row);
    stats.history.push({
      id: `${entry.sessionId || 'session'}:${entry.row}`,
      date: entry.date || '',
      sessionId: entry.sessionId || '',
      source: entry.source || entry.row.split(':')[0] || 'transcript',
      sourceUrl: entry.sourceUrl || undefined,
      reference: entry.row,
      excerpt: createExcerpt(entry.text),
    });

    const topicMentions = classifyTopics(entry.text);
    topicMentions.forEach((topicMention, index) => {
      stats.topics[index].mentions += topicMention.mentions;
    });
  });

  const dataset = {
    generatedAt: new Date().toISOString(),
    source: 'transcripts',
    deputies: deputies.map((deputy) => {
      const stats = statsById.get(deputy.id);
      const totalMentions = stats.topics.reduce((sum, topic) => sum + topic.mentions, 0);
      const topics = stats.topics.map((topic) => ({
        ...topic,
        score: totalMentions > 0 ? Number(((topic.mentions / totalMentions) * 100).toFixed(2)) : 0,
      }));

      return {
        id: deputy.id,
        name: deputy.name,
        party: deputy.party,
        profileUrl: deputy.profileUrl,
        activity: {
          speechCount: stats.speechCount,
          wordCount: stats.wordCount,
          sessionCount: stats.sessions.size,
        },
        topics,
        activityHistory: [...stats.history].sort(sortHistoryNewestFirst),
      };
    }),
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(dataset, null, 2), 'utf8');

  const activeDeputies = dataset.deputies.filter((deputy) => deputy.activity.speechCount > 0).length;
  console.log(`Done. Saved ${dataset.deputies.length} deputies to ${outputPath}`);
  console.log(`Deputies with at least one intervention: ${activeDeputies}`);
  console.log(`Processed transcript entries: ${transcriptEntries.length}`);
};

build().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
