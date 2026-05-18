#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { countryPath, projectRoot, readArg, resolveCountry } from './lib/country.mjs';

const argv = process.argv.slice(2);
const country = resolveCountry(argv);
const distDir = path.resolve(projectRoot, readArg(argv, '--dist', 'dist'));

const loadJson = async (absolutePath, fallback = null) => {
  try {
    const raw = await fs.readFile(absolutePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const config = (await loadJson(countryPath(country, 'config.json'), {})) || {};
const meta = (await loadJson(countryPath(country, 'prerender-meta.json'), {})) || {};

const SITE_URL = (process.env.SITE_URL || config.siteUrl || 'http://localhost:3000').replace(/\/$/, '');
const BRAND = meta.brand || config.name || 'civic-pulse';
const DEFAULT_TITLE = meta.defaultTitle || `${BRAND} - government accountability`;
const DEFAULT_DESCRIPTION =
  meta.defaultDescription ||
  `${BRAND} tracks government promises and institutional activity from official sources.`;

const fillTemplate = (template, vars) =>
  String(template || '').replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? String(vars[key]) : ''));

const toCanonicalUrl = (routePath) => {
  if (routePath === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${routePath}/`;
};

const escapeAttr = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getDisplayTitle = (title) => {
  if (!BRAND) return title;
  const prefix = `${BRAND} - `;
  if (title.toLowerCase().startsWith(prefix.toLowerCase())) {
    return title.slice(prefix.length).trim();
  }
  return title;
};

const getFallbackLinks = (routePath) => {
  const links = Array.isArray(meta.navLinks) && meta.navLinks.length
    ? meta.navLinks
    : [
        { href: '/', label: 'Home' },
        { href: '/methodology/', label: 'Methodology' },
        { href: '/about/', label: 'About' },
      ];
  return links.filter((link) => toCanonicalUrl(routePath) !== `${SITE_URL}${link.href}`);
};

const buildFallbackBody = (title, description, routePath) => {
  const heading = escapeHtml(getDisplayTitle(title));
  const summary = escapeHtml(description);
  const leadLabel = escapeHtml(meta.fallbackLeadLabel || BRAND);
  const noticeText = escapeHtml(meta.fallbackNoticeText || 'The full interactive content loads after JavaScript executes; this page preserves the key information for search indexing.');
  const navAriaLabel = escapeAttr(meta.fallbackNavAriaLabel || 'Primary navigation');
  const navLinks = getFallbackLinks(routePath)
    .map(
      (link) =>
        `<a href="${escapeAttr(link.href)}" style="display:inline-block;margin:0 12px 12px 0;color:#102949;font-weight:700;text-decoration:none;">${escapeHtml(link.label)}</a>`
    )
    .join('');

  return `<div id="root"><main class="prerender-fallback" style="max-width:960px;margin:0 auto;padding:48px 24px 64px;"><p style="margin:0 0 12px;color:#8a7345;font-size:12px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;">${leadLabel}</p><h1 style="margin:0 0 20px;color:#102949;font-size:clamp(2.5rem,6vw,4.5rem);line-height:0.95;font-weight:900;">${heading}</h1><p style="max-width:760px;margin:0 0 28px;color:#42536a;font-size:1.125rem;line-height:1.7;">${summary}</p><nav aria-label="${navAriaLabel}" style="margin:0 0 28px;">${navLinks}</nav><p style="margin:0;color:#5b6b82;font-size:0.95rem;line-height:1.6;">${noticeText}</p></main></div>`;
};

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

const parsePromises = async () => {
  const jsonPath = countryPath(country, 'promises.json');
  try {
    const json = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(json);
    const list = Array.isArray(data) ? data : Array.isArray(data.promises) ? data.promises : [];
    return list.map((entry) => ({
      id: String(entry.id),
      title: String(entry.title || ''),
      description: String(entry.description || ''),
    }));
  } catch {
    return [];
  }

  // Legacy fallback (kept dead code in comments for reference; promises.json is canonical):
  // Parse the .ts source by regex when promises.json is missing.
  const rows = [];

  return rows;
};

const parseMinistries = async () => {
  const jsonPath = countryPath(country, 'government.json');
  try {
    const raw = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(raw);
    const list = Array.isArray(data?.ministries) ? data.ministries : [];
    return list
      .filter((entry) => entry && entry.id && entry.portfolio && entry.minister)
      .map((entry) => ({
        id: String(entry.id),
        portfolio: String(entry.portfolio),
        minister: String(entry.minister),
      }));
  } catch {
    return [];
  }
};

const parseDeputies = async () => {
  const candidates = [
    countryPath(country, 'deputies.csv'),
    path.resolve(projectRoot, 'deputies.csv'),
  ];
  let csv = '';
  for (const candidate of candidates) {
    try {
      csv = await fs.readFile(candidate, 'utf8');
      if (csv) break;
    } catch (_error) {
      // Continue to next candidate.
    }
  }

  if (!csv) return [];

  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = safeSplitCsvLine(lines[0]).map((header) => normalize(header));
  const nameIndex = headers.findIndex(
    (header) => header === 'name' || header === 'emri' || header === 'nimi' || header === 'nombre' || header === 'imie',
  );
  if (nameIndex < 0) return [];

  return lines.slice(1).flatMap((line) => {
    const cells = safeSplitCsvLine(line);
    const name = cells[nameIndex];
    if (!name) return [];
    const id = normalize(name).replace(/\s+/g, '-');
    if (!id) return [];
    return [{ id, name }];
  });
};

const buildMetaPage = (baseHtml, title, description, canonicalPath) => {
  const canonicalUrl = toCanonicalUrl(canonicalPath);
  const safeTitle = escapeAttr(title);
  const safeDescription = escapeAttr(description);
  const safeCanonical = escapeAttr(canonicalUrl);
  const fallbackBody = buildFallbackBody(title, description, canonicalPath);

  return baseHtml
    .replace(/<title>[^<]*<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?content="[^"]*"[\s\S]*?>/i, `<meta name="description" content="${safeDescription}">`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${safeCanonical}" />`)
    .replace(/<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="${safeCanonical}">`)
    .replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${safeTitle}">`)
    .replace(/<meta\s+property="og:description"[\s\S]*?content="[^"]*"[\s\S]*?>/i, `<meta property="og:description" content="${safeDescription}">`)
    .replace(/<meta name="twitter:url" content="[^"]*">/i, `<meta name="twitter:url" content="${safeCanonical}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${safeTitle}">`)
    .replace(/<meta\s+name="twitter:description"[\s\S]*?content="[^"]*"[\s\S]*?>/i, `<meta name="twitter:description" content="${safeDescription}">`)
    .replace(/<div id="root"><\/div>/i, fallbackBody);
};

const buildSitemapXml = (routes) => {
  const today = new Date().toISOString().slice(0, 10);
  const uniqueRoutes = Array.from(new Set(routes.map((route) => route.path)));
  const rows = uniqueRoutes
    .sort((a, b) => a.localeCompare(b))
    .map((routePath) => {
      const url = toCanonicalUrl(routePath);
      const priority = routePath === '/' ? '1.0' : routePath.startsWith('/promise/') ? '0.7' : '0.8';
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`;
};

const ensureDirAndWrite = async (absolutePath, content) => {
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, content, 'utf8');
};

const main = async () => {
  const indexPath = path.resolve(distDir, 'index.html');
  const baseHtml = await fs.readFile(indexPath, 'utf8');

  const promises = await parsePromises();
  const ministries = await parseMinistries();
  const deputies = await parseDeputies();

  const routeMetaConfig = meta.routes || {};
  const templates = meta.templates || {};

  const buildRoute = (routePath, fallbackTitle, fallbackDescription) => {
    const entry = routeMetaConfig[routePath] || {};
    return {
      path: routePath,
      title: entry.title || fallbackTitle || DEFAULT_TITLE,
      description: entry.description || fallbackDescription || DEFAULT_DESCRIPTION,
    };
  };

  const routes = [
    buildRoute('/', DEFAULT_TITLE, DEFAULT_DESCRIPTION),
    buildRoute('/deputetet'),
    buildRoute('/qeveria'),
    buildRoute('/methodology'),
    buildRoute('/about'),
    buildRoute('/privacy'),
    buildRoute('/contact'),
  ];

  promises.forEach((promise) => {
    routes.push({
      path: `/promise/${promise.id}`,
      title: fillTemplate(templates.promiseTitle, { id: promise.id, title: promise.title, brand: BRAND }) ||
        `${BRAND} - #${promise.id}: ${promise.title}`,
      description:
        promise.description && promise.description.length > 155
          ? `${promise.description.slice(0, 152).trim()}...`
          : promise.description || DEFAULT_DESCRIPTION,
    });
  });

  ministries.forEach((ministry) => {
    routes.push({
      path: `/qeveria/${ministry.id}`,
      title: fillTemplate(templates.ministryTitle, {
        portfolio: ministry.portfolio,
        minister: ministry.minister,
        brand: BRAND,
      }) || `${BRAND} - ${ministry.portfolio}: ${ministry.minister}`,
      description:
        fillTemplate(templates.ministryDescription, {
          portfolio: ministry.portfolio,
          portfolioLower: ministry.portfolio.toLowerCase(),
          minister: ministry.minister,
        }) || `${ministry.portfolio} - ${ministry.minister}`,
    });
  });

  deputies.forEach((deputy) => {
    routes.push({
      path: `/deputet/${deputy.id}`,
      title: fillTemplate(templates.deputyTitle, { name: deputy.name, brand: BRAND }) ||
        `${BRAND} - ${deputy.name}`,
      description:
        fillTemplate(templates.deputyDescription, { name: deputy.name }) ||
        `${deputy.name}`,
    });
  });

  for (const route of routes) {
    const routeHtml = buildMetaPage(baseHtml, route.title, route.description, route.path);
    if (route.path === '/') {
      await ensureDirAndWrite(indexPath, routeHtml);
      continue;
    }

    const outputPath = path.resolve(distDir, route.path.replace(/^\//, ''), 'index.html');
    await ensureDirAndWrite(outputPath, routeHtml);
  }

  const sitemapXml = buildSitemapXml(routes);
  await ensureDirAndWrite(path.resolve(distDir, 'sitemap.xml'), sitemapXml);

  console.log(`[${country}] Prerendered ${routes.length} route shells with route-specific meta tags.`);
  console.log(`[${country}] Generated sitemap with ${new Set(routes.map((route) => route.path)).size} routes.`);
};

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
