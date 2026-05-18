// Dev-only HTTP middleware mounted by Vite's configureServer.
// Exposes /admin-api/* routes that read & write countries/<COUNTRY>/* files
// for the in-browser editor at /admin.
//
// Never runs in production builds: vite.config.ts only registers this
// inside `configureServer`, which Vite skips for `vite build`. We also
// hard-refuse when NODE_ENV === 'production' as defense in depth.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fetchHtml } from '../agent/src/tools/fetch-html.mjs';

const ALLOWED_ENTITIES = new Set(['promises', 'government', 'deputies', 'sources']);

const readBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });

const send = (res, status, payload, contentType = 'application/json') => {
  res.statusCode = status;
  res.setHeader('content-type', contentType);
  res.setHeader('cache-control', 'no-store');
  res.end(typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2));
};

const sendError = (res, status, message) => send(res, status, { error: message });

const ensureWithin = (filePath, rootDir) => {
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(`${path.resolve(rootDir)}${path.sep}`) && resolved !== path.resolve(rootDir)) {
    throw new Error(`Refusing to write outside ${rootDir}: ${resolved}`);
  }
  return resolved;
};

const writeAtomic = async (target, content) => {
  const tmp = `${target}.tmp.${process.pid}.${Date.now()}`;
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(tmp, content, 'utf8');
  await fs.rename(tmp, target);
};

const readJson = async (file) => {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw);
};

const readText = async (file) => fs.readFile(file, 'utf8');

const handleCountryInfo = async (countryDir, country) => {
  const configFile = path.join(countryDir, 'config.json');
  const config = await readJson(configFile);
  return { country, countryDir, config };
};

const handleGet = async (entity, countryDir) => {
  switch (entity) {
    case 'promises':
      return readJson(path.join(countryDir, 'promises.json'));
    case 'government':
      return readJson(path.join(countryDir, 'government.json'));
    case 'deputies':
      return readText(path.join(countryDir, 'deputies.csv'));
    case 'sources':
      return readText(path.join(countryDir, 'sources.yaml'));
    default:
      throw new Error(`Unknown entity: ${entity}`);
  }
};

const handlePost = async (entity, countryDir, body) => {
  switch (entity) {
    case 'promises': {
      const data = JSON.parse(body);
      if (!Array.isArray(data)) throw new Error('promises must be a JSON array');
      const file = ensureWithin(path.join(countryDir, 'promises.json'), countryDir);
      await writeAtomic(file, `${JSON.stringify(data, null, 2)}\n`);
      return { written: 'promises.json', count: data.length };
    }
    case 'government': {
      const data = JSON.parse(body);
      if (!data?.primeMinister || !Array.isArray(data?.ministries)) {
        throw new Error('government must be { primeMinister, ministries[] }');
      }
      const file = ensureWithin(path.join(countryDir, 'government.json'), countryDir);
      await writeAtomic(file, `${JSON.stringify(data, null, 2)}\n`);
      return { written: 'government.json', ministries: data.ministries.length };
    }
    case 'deputies': {
      if (typeof body !== 'string' || !body.trim().includes(',')) {
        throw new Error('deputies expects CSV body with at least one comma-separated row');
      }
      const file = ensureWithin(path.join(countryDir, 'deputies.csv'), countryDir);
      await writeAtomic(file, body.endsWith('\n') ? body : `${body}\n`);
      return { written: 'deputies.csv', rows: body.trim().split(/\r?\n/).length - 1 };
    }
    case 'sources': {
      if (typeof body !== 'string' || !body.includes('sources:')) {
        throw new Error('sources expects a YAML body containing a `sources:` key');
      }
      const file = ensureWithin(path.join(countryDir, 'sources.yaml'), countryDir);
      await writeAtomic(file, body.endsWith('\n') ? body : `${body}\n`);
      return { written: 'sources.yaml' };
    }
    default:
      throw new Error(`Unknown entity: ${entity}`);
  }
};

const handleSourceFetch = async (body) => {
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new Error('source-fetch body must be JSON: { url: string }');
  }
  const url = String(payload?.url || '').trim();
  if (!/^https?:\/\//i.test(url)) {
    throw new Error('source-fetch requires an http(s) url');
  }
  const document = await fetchHtml(url, { maxChars: 4000 });
  return {
    url: document.url,
    title: document.title,
    fetchedAt: document.fetchedAt,
    cached: document.cached === true,
    excerpt: document.text.slice(0, 600),
  };
};

export const createAdminMiddleware = ({ countryDir, country }) => async (req, res, next) => {
  if (!req.url || !req.url.startsWith('/admin-api/')) {
    return next();
  }

  if (process.env.NODE_ENV === 'production') {
    return sendError(res, 403, 'Admin API is disabled in production');
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const segments = url.pathname.split('/').filter(Boolean);
    // segments[0] === 'admin-api'
    const route = segments[1];

    if (route === 'country-info' && req.method === 'GET') {
      return send(res, 200, await handleCountryInfo(countryDir, country));
    }

    if (route === 'source-fetch' && req.method === 'POST') {
      const body = await readBody(req);
      return send(res, 200, await handleSourceFetch(body));
    }

    if (!ALLOWED_ENTITIES.has(route)) {
      return sendError(res, 404, `Unknown admin route: ${route}`);
    }

    if (req.method === 'GET') {
      const data = await handleGet(route, countryDir);
      if (typeof data === 'string') return send(res, 200, data, 'text/plain; charset=utf-8');
      return send(res, 200, data);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = await readBody(req);
      return send(res, 200, await handlePost(route, countryDir, body));
    }

    return sendError(res, 405, `Method ${req.method} not allowed on ${route}`);
  } catch (error) {
    return sendError(res, 400, error?.message || String(error));
  }
};
