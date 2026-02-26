#!/usr/bin/env node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);

const readArg = (name, fallback = '') => {
  const index = args.findIndex((arg) => arg === name);
  if (index < 0) return fallback;
  return args[index + 1] || fallback;
};

const readArgMany = (name) => {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === name && args[index + 1]) {
      values.push(args[index + 1]);
    }
  }
  return values;
};

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

const runPdftotext = (pdfPath, textPath) =>
  new Promise((resolve, reject) => {
    const child = spawn('pdftotext', ['-layout', pdfPath, textPath], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk || '');
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr.trim() || `pdftotext failed with exit code ${code}`));
    });
  });

const runNodeScript = (scriptPath, scriptArgs) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...scriptArgs], {
      stdio: ['ignore', 'inherit', 'pipe'],
      cwd: projectRoot,
    });

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk || '');
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr.trim() || `Script failed with exit code ${code}`));
    });
  });

const levenshteinDistance = (left, right) => {
  const a = String(left || '');
  const b = String(right || '');
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = new Array(b.length + 1);
  const current = new Array(b.length + 1);

  for (let j = 0; j <= b.length; j += 1) {
    previous[j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
};

const speakerAliases = new Map([
  ['jehona lushaku sariu', 'JEHONA LUSHAKU SADRIU'],
  ['adelina thaci meta', 'ADELINA THAQI META'],
  ['besa kabashi ramay', 'BESA KABASHI RAMAJ'],
]);

const speakerLineRegex = /^([\p{Lu}\p{M}][\p{Lu}\p{M}\s.'\-]+):\s*(.*)$/u;
const rolePrefixRegex =
  /^(kryetarja|kyretarja|kryearja|kryesuesi|kryeministri|ministri|deputeti|deputetja|nenkryetari|nënkryetari|nenkryetarja|nënkryetarja)\s+/iu;

const parseSwitchRules = () =>
  readArgMany('--switch-date')
    .map((raw) => {
      const divider = raw.lastIndexOf('::');
      if (divider < 0) return null;
      const pattern = raw.slice(0, divider).trim();
      const date = raw.slice(divider + 2).trim();
      if (!pattern || !date) return null;
      return { pattern: normalize(pattern), date };
    })
    .filter(Boolean);

const loadDeputies = async (deputiesPath) => {
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
  if (nameIndex < 0) {
    throw new Error('CSV must include a name/emri column.');
  }

  return lines
    .slice(1)
    .map((line) => safeSplitCsvLine(line))
    .map((cells) => String(cells[nameIndex] || '').trim())
    .filter(Boolean);
};

const createSpeakerResolver = (deputyNames) => {
  const deputies = deputyNames.map((name) => {
    const normalizedName = normalize(name);
    return {
      name,
      normalizedName,
      tokens: normalizedName.split(' ').filter(Boolean),
    };
  });
  const deputyByNormalized = new Map(deputies.map((deputy) => [deputy.normalizedName, deputy.name]));

  const resolveExactOrContains = (candidate) => {
    const normalizedCandidate = normalize(candidate);
    if (!normalizedCandidate) return null;

    if (speakerAliases.has(normalizedCandidate)) {
      return speakerAliases.get(normalizedCandidate);
    }

    const exact = deputyByNormalized.get(normalizedCandidate);
    if (exact) return exact;

    const paddedCandidate = ` ${normalizedCandidate} `;
    for (const deputy of deputies) {
      if (paddedCandidate.includes(` ${deputy.normalizedName} `)) {
        return deputy.name;
      }
    }

    return null;
  };

  return (rawSpeaker) => {
    const cleanedSpeaker = String(rawSpeaker || '').replace(/\s+/g, ' ').trim();
    if (!cleanedSpeaker) return cleanedSpeaker;

    const candidates = new Set([cleanedSpeaker]);

    let stripped = cleanedSpeaker;
    while (rolePrefixRegex.test(stripped)) {
      stripped = stripped.replace(rolePrefixRegex, '').trim();
      if (!stripped) break;
      candidates.add(stripped);
    }

    for (const candidate of candidates) {
      const resolved = resolveExactOrContains(candidate);
      if (resolved) return resolved;
    }

    let best = null;
    for (const candidate of candidates) {
      const normalizedCandidate = normalize(candidate);
      if (!normalizedCandidate) continue;

      for (const deputy of deputies) {
        const distance = levenshteinDistance(normalizedCandidate, deputy.normalizedName);
        const maxDistance = Math.max(2, Math.floor(deputy.normalizedName.length * 0.08));
        if (distance > maxDistance) continue;
        if (!best || distance < best.distance) {
          best = { name: deputy.name, distance };
        }
      }
    }

    if (best) return best.name;
    return cleanedSpeaker;
  };
};

const compactSpeechText = (value) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();

const usage = `Usage:
node scripts/ingest-transcript-pdf.mjs \
  --pdf /absolute/path/to/transcript.pdf \
  --out datasets/transcripts/2026-02-13-16-seanca.json \
  --session-id 2026-02-13-16-seanca \
  --date 2026-02-13 \
  --source "Transkripti zyrtar i Kuvendit të Kosovës" \
  --source-url "https://www.kuvendikosoves.org/Uploads/Data/SessionFiles/....pdf" \
  [--deputies datasets/deputies.csv] \
  [--switch-date "me 16. 2. 2026::2026-02-16"]

This command also refreshes public/data/transcript-sources.json for /methodology.`;

const main = async () => {
  const pdfPathArg = readArg('--pdf');
  const outputPathArg = readArg('--out');
  const sessionId = readArg('--session-id');
  const initialDate = readArg('--date');
  const source = readArg('--source', 'Transkripti zyrtar i Kuvendit të Kosovës');
  const sourceUrl = readArg('--source-url');
  const deputiesPathArg = readArg('--deputies', 'datasets/deputies.csv');
  const switchRules = parseSwitchRules();

  if (!pdfPathArg || !outputPathArg || !sessionId || !initialDate || !sourceUrl) {
    throw new Error(`${usage}\n\nMissing required arguments.`);
  }

  const pdfPath = path.resolve(pdfPathArg);
  const outputPath = path.resolve(projectRoot, outputPathArg);
  const deputiesPath = path.resolve(projectRoot, deputiesPathArg);

  const tmpTextPath = path.join(os.tmpdir(), `transcript-${Date.now()}.txt`);
  await runPdftotext(pdfPath, tmpTextPath);
  const rawText = await fs.readFile(tmpTextPath, 'utf8');
  await fs.rm(tmpTextPath, { force: true });

  const deputies = await loadDeputies(deputiesPath);
  const resolveSpeaker = createSpeakerResolver(deputies);

  let currentDate = initialDate;
  const lines = rawText.replace(/\r/g, '').split('\n');
  const rows = [];
  let currentEntry = null;

  const pushCurrentEntry = () => {
    if (!currentEntry) return;
    const text = compactSpeechText(currentEntry.text);
    if (!text) {
      currentEntry = null;
      return;
    }

    rows.push({
      speaker: resolveSpeaker(currentEntry.speaker),
      text,
      sessionId,
      date: currentEntry.date,
      source,
      sourceUrl,
    });
    currentEntry = null;
  };

  for (const rawLine of lines) {
    const line = String(rawLine || '').replace(/\f/g, '').trim();
    if (!line) continue;

    const normalizedLine = normalize(line);
    for (const switchRule of switchRules) {
      if (normalizedLine.includes(switchRule.pattern)) {
        currentDate = switchRule.date;
      }
    }

    if (/^\d+$/.test(line)) continue;

    const speakerMatch = line.match(speakerLineRegex);
    if (speakerMatch) {
      pushCurrentEntry();
      currentEntry = {
        speaker: speakerMatch[1].replace(/\s+/g, ' ').trim(),
        text: speakerMatch[2] || '',
        date: currentDate,
      };
      continue;
    }

    if (!currentEntry) continue;

    const addition = line.replace(/\s+/g, ' ').trim();
    if (!addition) continue;

    if (currentEntry.text.endsWith('-') && /^[a-zçë]/iu.test(addition)) {
      currentEntry.text = `${currentEntry.text.slice(0, -1)}${addition}`;
      continue;
    }

    currentEntry.text = `${currentEntry.text} ${addition}`.trim();
  }

  pushCurrentEntry();

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(rows, null, 2), 'utf8');

  const deputiesSeen = new Set();
  for (const row of rows) {
    if (deputies.includes(row.speaker)) {
      deputiesSeen.add(row.speaker);
    }
  }

  console.log(`Saved ${rows.length} interventions to ${outputPath}`);
  console.log(`Deputies recognized in transcript: ${deputiesSeen.size}`);

  const transcriptSourceScript = path.resolve(projectRoot, 'scripts/build-transcript-sources.mjs');
  await runNodeScript(transcriptSourceScript, []);
  console.log('Methodology source list refreshed: public/data/transcript-sources.json');
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
