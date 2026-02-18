#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOPIC_TAXONOMY = [
  { id: 'ekonomia', label: 'Ekonomia', keywords: ['ekonomi', 'biznes', 'investim', 'treg', 'buxhet', 'tatim'] },
  { id: 'arsimi', label: 'Arsimi', keywords: ['arsim', 'shkoll', 'universitet', 'student', 'mësim', 'profesor'] },
  { id: 'shendetesia', label: 'Shendetesia', keywords: ['shëndet', 'spital', 'mjek', 'pacient', 'klinik', 'barn'] },
  { id: 'drejtesia', label: 'Drejtesia', keywords: ['drejtësi', 'gjykat', 'prokurori', 'ligj', 'korrupsion', 'sundim'] },
  { id: 'infrastruktura', label: 'Infrastruktura', keywords: ['rrug', 'infrastruktur', 'ndërtim', 'transport', 'hekurudh', 'energji'] },
  { id: 'siguria', label: 'Siguria', keywords: ['siguri', 'polici', 'forc', 'mbrojt', 'ushtri', 'kufi'] },
  { id: 'integrimi-evropian', label: 'Integrimi Evropian', keywords: ['evrop', 'integrim', 'bashkimi', 'anëtarësim', 'partneritet'] },
  { id: 'mireqenia-sociale', label: 'Mireqenia Sociale', keywords: ['social', 'mirëqenie', 'pension', 'ndihm', 'punësim', 'familj'] },
];

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
          row: `${fileName}:${index + 1}`,
        });
      });
    }
  }

  return entries;
};

const countWord = (text, keyword) => {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\b${escaped}`, 'g');
  const matches = normalize(text).match(pattern);
  return matches ? matches.length : 0;
};

const classifyTopics = (text) =>
  TOPIC_TAXONOMY.map((topic) => {
    const mentions = topic.keywords.reduce((sum, keyword) => sum + countWord(text, keyword), 0);
    return {
      topicId: topic.id,
      label: topic.label,
      mentions,
    };
  });

const getWordCount = (text) => normalize(text).split(' ').filter(Boolean).length;

const build = async () => {
  const deputies = await loadDeputies();
  const transcriptEntries = await loadTranscriptEntries();
  const deputyByName = new Map(deputies.map((deputy) => [deputy.normalizedName, deputy]));
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

