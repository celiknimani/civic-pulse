import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '..', '..', '..');

const cacheRoot = process.env.AGENT_CACHE_DIR
  ? path.resolve(process.env.AGENT_CACHE_DIR)
  : path.resolve(projectRoot, 'node_modules', '.cache', 'civic-pulse');

const sha = (value) => crypto.createHash('sha1').update(value).digest('hex');

const cachePath = (url) => {
  const country = (process.env.COUNTRY || 'example').toLowerCase();
  return path.resolve(cacheRoot, country, 'sources', `${sha(url)}.json`);
};

const isDisabled = () => process.env.AGENT_CACHE === 'off' || process.env.AGENT_FORCE_REFRESH === 'true';

export const readCacheEntry = async (url) => {
  if (isDisabled()) return null;
  try {
    const raw = await fs.readFile(cachePath(url), 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const writeCacheEntry = async (url, entry) => {
  if (isDisabled()) return;
  const file = cachePath(url);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(entry, null, 2)}\n`, 'utf8');
};

export const buildConditionalHeaders = (cached) => {
  const headers = {};
  if (cached?.etag) headers['If-None-Match'] = cached.etag;
  if (cached?.lastModified) headers['If-Modified-Since'] = cached.lastModified;
  return headers;
};

export const cacheStatus = () => ({
  enabled: !isDisabled(),
  root: cacheRoot,
});
