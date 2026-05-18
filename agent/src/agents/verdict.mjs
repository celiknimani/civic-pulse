// Verdict scoring — after the human reviewer merges an agent PR, this module
// reconstructs which proposed entries survived (accepted), were edited (modified),
// or were dropped (rejected). It aggregates by source × skill so future runs can
// calibrate confidence per source.
//
// The verdict registry lives at countries/<COUNTRY>/.verdict-history.json and is
// committed (it's audit-relevant data: which agent runs got rubber-stamped vs.
// heavily edited).

import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

const HISTORY_VERSION = 1;

const loadHistory = async (countryRoot) => {
  const file = path.join(countryRoot, '.verdict-history.json');
  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed?.version !== HISTORY_VERSION) {
      return { version: HISTORY_VERSION, runs: [], aggregates: {} };
    }
    return parsed;
  } catch {
    return { version: HISTORY_VERSION, runs: [], aggregates: {} };
  }
};

const writeHistory = async (countryRoot, history) => {
  const file = path.join(countryRoot, '.verdict-history.json');
  await fs.writeFile(file, `${JSON.stringify(history, null, 2)}\n`, 'utf8');
};

const sourceSkillKey = (source, skill) => `${source}::${skill}`;

const classifyEntry = (proposed, mergedTextByFile, prFiles) => {
  // We can't perfectly tell which fields were edited without semantic diff. The
  // heuristic: if the pending JSON file from this run still exists at HEAD, the
  // entry was accepted as-is. If the file is gone (moved into promises.json /
  // deputies-analytics.json) the entry was likely accepted in some form. If the
  // pending file is gone AND the structured data files were not touched in this
  // PR, the entry was probably dropped.
  if (!prFiles?.length) return 'unknown';
  const pendingFile = prFiles.find((f) => f.includes('pending/') && f.includes(proposed.source));
  if (pendingFile?.status === 'removed') {
    return prFiles.some((f) => /promises\.json|deputies-analytics\.json/.test(f.filename))
      ? 'accepted'
      : 'rejected';
  }
  if (pendingFile?.status === 'modified') return 'modified';
  if (pendingFile?.status === 'added') return 'pending';
  return 'unknown';
};

export const recordRunVerdict = async ({
  countryRoot,
  runId,
  domains,
  acceptedEntries,
}) => {
  const history = await loadHistory(countryRoot);
  history.runs.unshift({
    runId,
    domains,
    timestamp: new Date().toISOString(),
    proposedCount: acceptedEntries.length,
    bySourceSkill: acceptedEntries.reduce((acc, entry) => {
      const key = sourceSkillKey(entry.source, entry.skill);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
    verdicts: {}, // filled in by the post-merge scorer
  });
  history.runs = history.runs.slice(0, 200); // keep last 200 runs
  await writeHistory(countryRoot, history);
};

const fetchPrFiles = async ({ repository, prNumber, token }) => {
  const apiUrl = `https://api.github.com/repos/${repository}/pulls/${prNumber}/files?per_page=100`;
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub file listing failed: HTTP ${response.status}`);
  }
  return response.json();
};

export const scoreMergedPr = async ({
  countryRoot,
  runId,
  prNumber,
}) => {
  const repository = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;
  if (!repository || !token) {
    throw new Error('GITHUB_REPOSITORY and GITHUB_TOKEN required for verdict scoring');
  }

  const history = await loadHistory(countryRoot);
  const run = history.runs.find((entry) => entry.runId === runId);
  if (!run) throw new Error(`No verdict run recorded for runId ${runId}`);

  const prFiles = await fetchPrFiles({ repository, prNumber, token });

  const verdicts = { accepted: 0, modified: 0, rejected: 0, pending: 0, unknown: 0 };
  const perSourceSkill = {};

  for (const [key, proposedCount] of Object.entries(run.bySourceSkill || {})) {
    const [source, skill] = key.split('::');
    const verdict = classifyEntry({ source, skill }, null, prFiles);
    verdicts[verdict] = (verdicts[verdict] || 0) + proposedCount;
    perSourceSkill[key] = { proposed: proposedCount, verdict };
  }

  run.verdicts = verdicts;
  run.perSourceSkill = perSourceSkill;
  run.prNumber = prNumber;
  run.scoredAt = new Date().toISOString();

  for (const [key, entry] of Object.entries(perSourceSkill)) {
    const agg = history.aggregates[key] || { proposed: 0, accepted: 0, modified: 0, rejected: 0 };
    agg.proposed += entry.proposed;
    if (entry.verdict === 'accepted') agg.accepted += entry.proposed;
    else if (entry.verdict === 'modified') agg.modified += entry.proposed;
    else if (entry.verdict === 'rejected') agg.rejected += entry.proposed;
    history.aggregates[key] = agg;
  }

  await writeHistory(countryRoot, history);
  return { runId, verdicts, perSourceSkill };
};

export const getSourceConfidenceMultiplier = async ({ countryRoot, sourceId, skillName }) => {
  const history = await loadHistory(countryRoot);
  const agg = history.aggregates[sourceSkillKey(sourceId, skillName)];
  if (!agg || agg.proposed < 5) return 1;
  const acceptanceRate = (agg.accepted + agg.modified * 0.5) / agg.proposed;
  // Map [0..1] → [0.7..1.1]: heavily rejected sources cap lower, well-trusted sources can edge above 1.
  return 0.7 + acceptanceRate * 0.4;
};

export const cli = async (argv) => {
  const [command, ...args] = argv;
  if (command === 'score') {
    const countryRoot = args[0];
    const runId = args[1];
    const prNumber = Number(args[2]);
    const result = await scoreMergedPr({ countryRoot, runId, prNumber });
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.error('Usage: node agent/src/agents/verdict.mjs score <countryRoot> <runId> <prNumber>');
  process.exit(2);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  cli(process.argv.slice(2)).catch((error) => {
    console.error(error?.stack || error?.message || error);
    process.exit(1);
  });
}
