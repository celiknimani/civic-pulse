import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import Anthropic from '@anthropic-ai/sdk';
import { fetchHtml } from '../tools/fetch-html.mjs';
import { fetchRss } from '../tools/fetch-rss.mjs';
import { fetchPdf } from '../tools/fetch-pdf.mjs';
import { fetchSearch } from '../tools/fetch-search.mjs';
import { loadSkill } from '../config/skills.mjs';
import { buildSystemPrompt } from '../prompts/system.mjs';
import { filterValidEntries } from './extraction-schema.mjs';
import { buildChangesetSummary } from './changeset-summary.mjs';
import { chunkDocument, mergeChunkResults } from './chunk-document.mjs';
import { recordRunVerdict } from './verdict.mjs';
import { getSourceConfidenceMultiplier } from './verdict.mjs';

const CHUNK_THRESHOLD = 55000;

const FETCH_BY_MODE = {
  html: fetchHtml,
  rss: fetchRss,
  pdf: fetchPdf,
  search: fetchSearch,
};

const SKILL_BY_TRACK = {
  promises: 'extract-promise-update',
  ministerStatements: 'extract-minister-statement',
  deputyActivity: 'extract-deputy-activity',
};

// Maps a logical "domain" (the user-facing agent split) to the set of source tracks it consumes.
const TRACKS_BY_DOMAIN = {
  promises: ['promises', 'ministerStatements'],
  deputies: ['deputyActivity'],
};

const resolveDomainTracks = (domains) => {
  const list = Array.isArray(domains) && domains.length > 0 ? domains : ['promises', 'deputies'];
  const tracks = new Set();
  for (const domain of list) {
    const mapped = TRACKS_BY_DOMAIN[domain];
    if (!mapped) {
      throw new Error(`Unknown agent domain "${domain}". Valid: ${Object.keys(TRACKS_BY_DOMAIN).join(', ')}`);
    }
    mapped.forEach((track) => tracks.add(track));
  }
  return tracks;
};

const runChild = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });

const fetchSource = async (source) => {
  const fetcher = FETCH_BY_MODE[source.fetchMode];
  if (!fetcher) {
    throw new Error(`No fetcher for fetch_mode "${source.fetchMode}"`);
  }
  // For search sources, prefer the explicit query in extract.searchQuery, else fall back
  // to the configured URL (which can be a plain query string for search backends).
  if (source.fetchMode === 'search') {
    const query = source.extract?.searchQuery || source.url;
    return fetcher(query);
  }
  return fetcher(source.url);
};

const callClaude = async ({ client, model, system, user }) => {
  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock) throw new Error('Claude response had no text block');

  const raw = textBlock.text.trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end < 0) {
    throw new Error(`Claude response was not JSON: ${raw.slice(0, 200)}`);
  }
  return JSON.parse(raw.slice(start, end + 1));
};

const buildUserPayload = ({ source, document, context, skillName, chunk = null }) => {
  const payload = {
    country: context.country,
    language: source.extract?.languageHint || context.config.locale || 'en',
    trustTier: source.trustTier,
    sourceLabel: source.label,
    sourceUrl: source.url,
    categoryIds: context.categories.map((category) => category.id),
    documentText: document.text,
  };

  if (chunk) {
    payload.chunk = chunk;
  }

  if (skillName === 'extract-promise-update') {
    payload.promisesIndex = (context.promisesIndex || []).map((entry) => ({
      id: entry.id,
      title: entry.title,
      category: entry.category,
      currentStatus: entry.status,
      currentProgress: entry.progress,
    }));
  } else if (skillName === 'extract-minister-statement') {
    payload.ministers = context.ministers || [];
  } else if (skillName === 'extract-deputy-activity') {
    payload.deputies = (context.deputies || []).map((entry) => ({
      id: entry.id,
      name: entry.name,
      party: entry.party,
    }));
  }

  return `Inputs:\n${JSON.stringify(payload, null, 2)}\n\nExtract per the skill above. Return JSON only.`;
};

const writePendingFile = async ({ context, source, runId, skillName, payload }) => {
  const dir = path.join(context.countryRoot, 'pending');
  await fs.mkdir(dir, { recursive: true });
  const fileName = `${runId}-${source.id}-${skillName}.json`;
  const absolute = path.join(dir, fileName);
  await fs.writeFile(absolute, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return path.relative(context.projectRoot, absolute);
};

export const runIngestion = async (context, { domains } = {}) => {
  const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const categoryIds = new Set(context.categories.map((category) => category.id));
  const activeDomains = Array.isArray(domains) && domains.length > 0 ? domains : ['promises', 'deputies'];
  const allowedTracks = resolveDomainTracks(activeDomains);
  const dedupeIndex = await buildDedupeIndex({ context, domains: activeDomains });

  const client = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

  const acceptedEntries = [];
  const pendingFiles = [];
  let totalCandidates = 0;
  let totalDuplicates = 0;
  let sourcesProcessed = 0;

  for (const source of context.enabledSources) {
    try {
      const sourceTracks = (Array.isArray(source.extract?.tracks) && source.extract.tracks.length > 0
        ? source.extract.tracks
        : ['promises']
      ).filter((track) => allowedTracks.has(track));

      if (sourceTracks.length === 0) {
        continue;
      }

      console.log(`[${context.country}] Fetching ${source.id} (${source.fetchMode}) …`);
      const document = await fetchSource(source);

      if (document.skipped) {
        console.warn(`[${context.country}] Skipped ${source.id}: ${document.text}`);
        continue;
      }

      if (document.cached) {
        console.log(`[${context.country}] ${source.id}: cache hit (304), reusing previous extraction.`);
        sourcesProcessed += 1;
        continue;
      }

      if (!client) {
        console.warn(`[${context.country}] ANTHROPIC_API_KEY not set; skipping extraction for ${source.id}.`);
        continue;
      }

      for (const track of sourceTracks) {
        const skillName = SKILL_BY_TRACK[track];
        if (!skillName) {
          console.warn(`[${context.country}] No skill mapped for track "${track}" (source ${source.id})`);
          continue;
        }

        const skill = await loadSkill(skillName);
        const system = buildSystemPrompt({ skill, context });

        const chunks = document.text.length > CHUNK_THRESHOLD
          ? chunkDocument(document.text)
          : [{ index: 0, total: 1, text: document.text, offset: 0 }];

        if (chunks.length > 1) {
          console.log(`[${context.country}] ${source.id}/${skillName}: splitting ${document.text.length} chars into ${chunks.length} chunks.`);
        }

        const chunkResults = [];
        for (const chunk of chunks) {
          const chunkDocumentView = { ...document, text: chunk.text };
          const user = buildUserPayload({
            source,
            document: chunkDocumentView,
            context,
            skillName,
            chunk: chunks.length > 1 ? { index: chunk.index + 1, total: chunk.total, offset: chunk.offset } : null,
          });

          const response = await callClaude({
            client,
            model: context.options.model,
            system,
            user,
          });

          chunkResults.push(response);
        }

        const merged = mergeChunkResults(chunkResults);
        const rawEntries = Array.isArray(merged.entries) ? merged.entries : [];
        totalCandidates += rawEntries.length;

        const confidenceMultiplier = await getSourceConfidenceMultiplier({
          countryRoot: context.countryRoot,
          sourceId: source.id,
          skillName,
        });
        if (confidenceMultiplier !== 1) {
          rawEntries.forEach((entry) => {
            if (typeof entry.confidence === 'number') {
              entry.calibratedConfidence = Number((entry.confidence * confidenceMultiplier).toFixed(3));
            }
          });
        }

        const { accepted, rejected } = filterValidEntries(rawEntries, {
          categoryIds,
          sourceText: document.text,
        });
        const aboveThreshold = accepted.filter((entry) => {
          const score = typeof entry.calibratedConfidence === 'number' ? entry.calibratedConfidence : entry.confidence;
          return score >= context.options.confidenceThreshold;
        });

        if (rejected.length) {
          console.warn(`[${context.country}] ${source.id}/${skillName}: dropped ${rejected.length} entries failing validation.`);
        }

        const { kept: deduped, skipped: duplicates } = partitionDuplicates(aboveThreshold, dedupeIndex);
        if (duplicates.length) {
          totalDuplicates += duplicates.length;
          console.log(`[${context.country}] ${source.id}/${skillName}: skipped ${duplicates.length} duplicate entries already present in committed data.`);
        }

        if (deduped.length) {
          const payload = {
            runId,
            country: context.country,
            skill: skillName,
            source: {
              id: source.id,
              label: source.label,
              url: source.url,
              type: source.type,
              trustTier: source.trustTier,
            },
            fetchedAt: document.fetchedAt,
            confidenceThreshold: context.options.confidenceThreshold,
            entries: deduped,
          };
          const relativePath = await writePendingFile({ context, source, runId, skillName, payload });
          pendingFiles.push(relativePath);
          acceptedEntries.push(...deduped.map((entry) => ({ source: source.id, skill: skillName, ...entry })));
        }
      }

      sourcesProcessed += 1;
    } catch (error) {
      console.error(`[${context.country}] Failed source ${source.id}: ${error.message}`);
    }
  }

  // Auto-rebuild aggregate deputy analytics when the deputies domain produced any entries.
  let analyticsRebuilt = false;
  const deputyEntriesCount = acceptedEntries.filter((entry) => entry.kind === 'deputy_activity').length;
  if (activeDomains.includes('deputies') && deputyEntriesCount > 0) {
    try {
      const scriptPath = path.resolve(context.projectRoot, 'scripts', 'build-deputy-analytics.mjs');
      console.log(`[${context.country}] Rebuilding aggregate deputy analytics …`);
      await runChild(process.execPath, [scriptPath, '--country', context.country]);
      analyticsRebuilt = true;
    } catch (error) {
      console.error(`[${context.country}] Aggregate analytics rebuild failed: ${error.message}`);
    }
  }

  if (acceptedEntries.length > 0) {
    try {
      await recordRunVerdict({
        countryRoot: context.countryRoot,
        runId,
        domains: activeDomains,
        acceptedEntries,
      });
    } catch (error) {
      console.warn(`[${context.country}] Failed to record verdict registry entry: ${error.message}`);
    }
  }

  const summary = buildChangesetSummary({
    context,
    runId,
    acceptedEntries,
    pendingFiles,
    sourcesProcessed,
    analyticsRebuilt,
    duplicatesSkipped: totalDuplicates,
    domains: activeDomains,
  });

  return {
    runId,
    domains: activeDomains,
    sourcesProcessed,
    totalCandidates,
    duplicatesSkipped: totalDuplicates,
    acceptedEntries,
    pendingFiles,
    analyticsRebuilt,
    summary,
  };
};
