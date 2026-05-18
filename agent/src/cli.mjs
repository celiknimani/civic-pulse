#!/usr/bin/env node

import { loadAgentContext } from './config/load.mjs';
import { listSkills } from './config/skills.mjs';
import { runIngestion } from './agents/ingestion.mjs';
import { openAgentPullRequest } from './tools/open-pull-request.mjs';

const HELP = `civic-pulse agent

Usage:
  npm run agent -- <command> [options]

Commands:
  run                Run BOTH the Promises Tracker and Deputy Performance Tracker
  promises           Run only the Promises Tracker (scans gov press / gazette / ministerials)
  deputies           Run only the Deputy Performance Tracker (ingests parliament transcripts + rebuilds analytics)
  validate           Lint sources.yaml without fetching anything
  skills             List available skills under .claude/skills/

Options:
  --country <code>      Override COUNTRY env var (default: example)
  --source <id>         Only run the named source (debug)
  --dry-run             Skip the PR step; just write pending/ files
  --max-sources <n>     Cap sources processed in this run
  --confidence <0..1>   Override AGENT_CONFIDENCE_THRESHOLD
  --force-refresh       Ignore the HTTP cache; always re-fetch each source
  -h, --help            Show this help

Required env (for 'run', 'promises', 'deputies'):
  ANTHROPIC_API_KEY     Anthropic API key
  GITHUB_TOKEN          PAT with 'repo' scope (or GITHUB_TOKEN in Actions)
  GITHUB_REPOSITORY     'owner/repo'
`;

const argv = process.argv.slice(2);
const command = argv[0];

const readFlag = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : null;
};

const hasFlag = (name) => argv.includes(name);

if (!command || hasFlag('-h') || hasFlag('--help')) {
  console.log(HELP);
  process.exit(0);
}

if (hasFlag('--force-refresh')) {
  process.env.AGENT_FORCE_REFRESH = 'true';
}

const options = {
  country: readFlag('--country'),
  source: readFlag('--source'),
  dryRun: hasFlag('--dry-run') || process.env.AGENT_DRY_RUN === 'true',
  maxSources: readFlag('--max-sources') ? Number(readFlag('--max-sources')) : null,
  confidenceThreshold: readFlag('--confidence')
    ? Number(readFlag('--confidence'))
    : process.env.AGENT_CONFIDENCE_THRESHOLD
      ? Number(process.env.AGENT_CONFIDENCE_THRESHOLD)
      : 0.5,
};

const DOMAIN_BY_COMMAND = {
  run: ['promises', 'deputies'],
  promises: ['promises'],
  deputies: ['deputies'],
};

const main = async () => {
  if (command === 'skills') {
    const skills = await listSkills();
    if (!skills.length) {
      console.log('No skills registered under .claude/skills/');
      return;
    }
    console.log('Skills:');
    skills.forEach((skill) => console.log(`  - ${skill}`));
    return;
  }

  if (command === 'validate') {
    const context = await loadAgentContext(options, { requireAnthropicKey: false });
    console.log(`[${context.country}] sources.yaml is valid — ${context.sources.length} sources defined, ${context.enabledSources.length} enabled.`);
    return;
  }

  const domains = DOMAIN_BY_COMMAND[command];
  if (!domains) {
    console.error(`Unknown command: ${command}`);
    console.error(HELP);
    process.exit(2);
  }

  const context = await loadAgentContext(options);
  const result = await runIngestion(context, { domains });

  const domainLabel = domains.join(' + ');
  console.log(`[${context.country}] (${domainLabel}) extracted ${result.totalCandidates} candidates (${result.acceptedEntries.length} above threshold) from ${result.sourcesProcessed} sources.`);

  if (result.acceptedEntries.length === 0 && !result.analyticsRebuilt) {
    console.log(`[${context.country}] Nothing to commit. Done.`);
    return;
  }

  if (options.dryRun) {
    console.log(`[${context.country}] Dry run — wrote ${result.pendingFiles.length} pending files; skipping PR.`);
    result.pendingFiles.forEach((file) => console.log(`  - ${file}`));
    if (result.analyticsRebuilt) {
      console.log(`[${context.country}] Aggregate deputy analytics rebuilt in dry-run.`);
    }
    return;
  }

  const pr = await openAgentPullRequest({
    context,
    result,
    titlePrefix: `agent(${domainLabel})`,
  });
  console.log(`[${context.country}] Opened PR: ${pr.url}`);
};

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
