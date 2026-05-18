import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

const run = async (command, args, options = {}) => {
  const { stdout, stderr } = await exec(command, args, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  });
  if (stderr && process.env.AGENT_DEBUG === 'true') {
    console.error(stderr);
  }
  return stdout.trim();
};

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

export const openAgentPullRequest = async ({ context, result, titlePrefix = 'agent' }) => {
  const repository = requireEnv('GITHUB_REPOSITORY');
  const token = requireEnv('GITHUB_TOKEN');

  const domainSlug = (result.domains || ['ingestion']).join('-');
  const branch = `agent/${context.country}/${domainSlug}/${result.runId}`;

  await run('git', ['checkout', '-b', branch]);

  const stagedPaths = [`countries/${context.country}/pending`];
  if (result.domains?.includes('deputies')) {
    stagedPaths.push(`countries/${context.country}/transcripts`, 'public/data/deputies-analytics.json');
  }
  await run('git', ['add', '--', ...stagedPaths]);

  const commitMessage = `${titlePrefix}: ${context.country} ${result.runId}`;
  await run('git', ['commit', '-m', commitMessage]);

  const remoteUrl = `https://x-access-token:${token}@github.com/${repository}.git`;
  await run('git', ['push', remoteUrl, `HEAD:${branch}`]);

  const title = `${titlePrefix}: ${context.country} ${result.runId}`;
  const body = result.summary;

  const apiUrl = `https://api.github.com/repos/${repository}/pulls`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      title,
      body,
      head: branch,
      base: process.env.AGENT_PR_BASE || 'main',
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub PR creation failed: HTTP ${response.status} ${text}`);
  }

  const pr = await response.json();
  return { url: pr.html_url, number: pr.number, branch };
};
