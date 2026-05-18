// Persistence layer abstraction for the /admin editor.
//
// `local` writes to disk via the dev-only Vite middleware (`scripts/admin-middleware.mjs`).
// `github-pr` commits to a branch and opens a PR via the GitHub REST API.
//
// Editors call `persistence.save(entity, body, contentType?)` and don't care
// which backend is active. The backend resolves at module load based on
// `import.meta.env.VITE_ADMIN_MODE`.

export type Entity = 'promises' | 'government' | 'deputies' | 'sources';

export interface PersistenceResult {
  written: string;
  prUrl?: string;
  branch?: string;
}

export interface Persistence {
  mode: 'local' | 'github-pr';
  load: (entity: Entity) => Promise<unknown>;
  save: (entity: Entity, body: unknown, options?: { contentType?: string; commitMessage?: string }) => Promise<PersistenceResult>;
  probeSource: (url: string) => Promise<{ title?: string; fetchedAt?: string; cached?: boolean; excerpt?: string }>;
  countryInfo: () => Promise<{ country: string; countryDir?: string; config: Record<string, unknown> }>;
}

const ENTITY_PATH: Record<Entity, string> = {
  promises: 'countries/$COUNTRY/promises.json',
  government: 'countries/$COUNTRY/government.json',
  deputies: 'countries/$COUNTRY/deputies.csv',
  sources: 'countries/$COUNTRY/sources.yaml',
};

const ENTITY_CONTENT_TYPE: Record<Entity, string> = {
  promises: 'application/json',
  government: 'application/json',
  deputies: 'text/plain',
  sources: 'text/plain',
};

const isJson = (entity: Entity) => ENTITY_CONTENT_TYPE[entity] === 'application/json';

const serializeBody = (entity: Entity, body: unknown): string =>
  isJson(entity)
    ? `${JSON.stringify(body, null, 2)}\n`
    : (typeof body === 'string' ? (body.endsWith('\n') ? body : `${body}\n`) : String(body));

const fileFor = (entity: Entity, country: string): string =>
  ENTITY_PATH[entity].replace('$COUNTRY', country);

const localPersistence: Persistence = {
  mode: 'local',
  async load(entity) {
    const res = await fetch(`/admin-api/${entity}`);
    if (!res.ok) throw new Error(await res.text());
    return isJson(entity) ? res.json() : res.text();
  },
  async save(entity, body) {
    const res = await fetch(`/admin-api/${entity}`, {
      method: 'POST',
      headers: { 'content-type': ENTITY_CONTENT_TYPE[entity] },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    const result = (await res.json()) as PersistenceResult;
    return result;
  },
  async probeSource(url) {
    const res = await fetch('/admin-api/source-fetch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async countryInfo() {
    const res = await fetch('/admin-api/country-info');
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

const TOKEN_KEY = 'civic-pulse:gh-pat';
const COUNTRY_KEY = 'civic-pulse:gh-country';

const getStoredToken = (): string | null => {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string | null): void => {
  if (typeof sessionStorage === 'undefined') return;
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
};

const getStoredCountry = (): string => {
  if (typeof sessionStorage === 'undefined') return 'example';
  return sessionStorage.getItem(COUNTRY_KEY) || 'example';
};

export const setStoredCountry = (country: string): void => {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(COUNTRY_KEY, country);
};

const ghHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
});

const repositorySlug = (): string => {
  const slug = (import.meta.env.VITE_GITHUB_REPOSITORY || '').trim();
  if (!slug || !/^[^/]+\/[^/]+$/.test(slug)) {
    throw new Error('VITE_GITHUB_REPOSITORY env var must be set to "owner/repo"');
  }
  return slug;
};

const baseBranch = (): string => (import.meta.env.VITE_GITHUB_BRANCH_BASE || 'main').trim();

const githubFetch = async (path: string, init: RequestInit = {}, token: string) => {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { ...ghHeaders(token), ...(init.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
};

const encodeBase64 = (input: string): string => {
  if (typeof btoa !== 'undefined') {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }
  return Buffer.from(input, 'utf8').toString('base64');
};

const ensureBranch = async (repo: string, branch: string, token: string): Promise<void> => {
  try {
    await githubFetch(`/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`, {}, token);
    return;
  } catch (error) {
    if (!(error instanceof Error) || !/404/.test(error.message)) throw error;
  }
  const base = baseBranch();
  const baseRef = await githubFetch(`/repos/${repo}/git/ref/heads/${encodeURIComponent(base)}`, {}, token);
  await githubFetch(
    `/repos/${repo}/git/refs`,
    {
      method: 'POST',
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseRef.object.sha }),
    },
    token,
  );
};

const getCurrentSha = async (repo: string, file: string, branch: string, token: string): Promise<string | null> => {
  try {
    const data = await githubFetch(
      `/repos/${repo}/contents/${file}?ref=${encodeURIComponent(branch)}`,
      {},
      token,
    );
    return data.sha || null;
  } catch (error) {
    if (error instanceof Error && /404/.test(error.message)) return null;
    throw error;
  }
};

const putFile = async ({
  repo,
  file,
  branch,
  content,
  message,
  sha,
  token,
}: {
  repo: string;
  file: string;
  branch: string;
  content: string;
  message: string;
  sha: string | null;
  token: string;
}) => {
  const body: Record<string, unknown> = {
    branch,
    message,
    content: encodeBase64(content),
  };
  if (sha) body.sha = sha;
  return githubFetch(
    `/repos/${repo}/contents/${file}`,
    { method: 'PUT', body: JSON.stringify(body) },
    token,
  );
};

const ensurePr = async (repo: string, branch: string, title: string, body: string, token: string) => {
  const base = baseBranch();
  const existing = await githubFetch(
    `/repos/${repo}/pulls?state=open&head=${encodeURIComponent(`${repo.split('/')[0]}:${branch}`)}`,
    {},
    token,
  );
  if (Array.isArray(existing) && existing.length > 0) {
    return existing[0];
  }
  return githubFetch(
    `/repos/${repo}/pulls`,
    {
      method: 'POST',
      body: JSON.stringify({ title, body, head: branch, base }),
    },
    token,
  );
};

const githubPrPersistence: Persistence = {
  mode: 'github-pr',
  async load(entity) {
    const token = getStoredToken();
    if (!token) throw new Error('Sign in to GitHub first.');
    const repo = repositorySlug();
    const country = getStoredCountry();
    const file = fileFor(entity, country);
    const data = await githubFetch(
      `/repos/${repo}/contents/${file}?ref=${encodeURIComponent(baseBranch())}`,
      {},
      token,
    );
    const decoded = typeof atob !== 'undefined'
      ? new TextDecoder().decode(Uint8Array.from(atob(data.content.replace(/\n/g, '')), (c) => c.charCodeAt(0)))
      : Buffer.from(data.content, 'base64').toString('utf8');
    return isJson(entity) ? JSON.parse(decoded) : decoded;
  },
  async save(entity, body, options = {}) {
    const token = getStoredToken();
    if (!token) throw new Error('Sign in to GitHub first.');
    const repo = repositorySlug();
    const country = getStoredCountry();
    const file = fileFor(entity, country);
    const branch = `admin/${country}/${entity}-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
    const message = options.commitMessage || `admin: ${country} ${entity}`;

    await ensureBranch(repo, branch, token);
    const sha = await getCurrentSha(repo, file, branch, token);
    await putFile({
      repo,
      file,
      branch,
      content: serializeBody(entity, body),
      message,
      sha,
      token,
    });
    const pr = await ensurePr(repo, branch, message, `${message}\n\nOpened from the in-browser admin editor.`, token);
    return { written: file, branch, prUrl: pr.html_url };
  },
  async probeSource(url) {
    const token = getStoredToken();
    if (!token) throw new Error('Sign in to GitHub first.');
    const res = await fetch(url, { headers: { Accept: 'text/html,application/xhtml+xml' } });
    if (!res.ok) throw new Error(`Fetch ${res.status} for ${url}`);
    const html = await res.text();
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 600);
    return { title, fetchedAt: new Date().toISOString(), cached: false, excerpt: text };
  },
  async countryInfo() {
    const token = getStoredToken();
    if (!token) throw new Error('Sign in to GitHub first.');
    const repo = repositorySlug();
    const country = getStoredCountry();
    const data = await githubFetch(
      `/repos/${repo}/contents/${fileFor(entity('config') as Entity, country).replace(/\/[^/]+$/, '/config.json')}?ref=${encodeURIComponent(baseBranch())}`,
      {},
      token,
    );
    const decoded = typeof atob !== 'undefined'
      ? new TextDecoder().decode(Uint8Array.from(atob(data.content.replace(/\n/g, '')), (c) => c.charCodeAt(0)))
      : Buffer.from(data.content, 'base64').toString('utf8');
    return { country, config: JSON.parse(decoded) };
  },
};

// Helper to silence the `entity('config')` shim above (the github-pr countryInfo
// reuses the file-path helper for a slightly different file).
const entity = (raw: string) => raw;

export const ADMIN_MODE: 'local' | 'github-pr' =
  (import.meta.env.VITE_ADMIN_MODE as 'github-pr' | undefined) === 'github-pr'
    ? 'github-pr'
    : 'local';

export const persistence: Persistence = ADMIN_MODE === 'github-pr' ? githubPrPersistence : localPersistence;
