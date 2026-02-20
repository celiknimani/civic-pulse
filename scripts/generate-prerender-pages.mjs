#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

const SITE_URL = 'https://zotimi.com';
const DEFAULT_TITLE = 'zotimi.com - Monitorimi i progresit te zotimeve per 2026 - 2030';
const DEFAULT_DESCRIPTION =
  'Platforma zotimi monitoron premtimet dhe aktivitetin e kryeministrit, ministrave dhe deputeteve me logjike te dokumentuar, burime zyrtare dhe metrika te riprodhueshme.';

const escapeAttr = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

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

const parsePromises = async () => {
  const file = await fs.readFile(path.resolve(projectRoot, 'data.ts'), 'utf8');
  const blocks = file.split(/\n\s*\{\n\s*id:\s*'/).slice(1);
  const rows = [];

  blocks.forEach((block) => {
    const idMatch = block.match(/^([^']+)'/);
    const titleMatch = block.match(/\n\s*title:\s*'([^']+)'/);
    const descriptionMatch = block.match(/\n\s*description:\s*'([^']+)'/);
    if (!idMatch || !titleMatch) return;
    rows.push({
      id: idMatch[1],
      title: titleMatch[1],
      description: descriptionMatch ? descriptionMatch[1] : '',
    });
  });

  return rows;
};

const parseMinistries = async () => {
  const file = await fs.readFile(path.resolve(projectRoot, 'components/qeveriaData.ts'), 'utf8');
  const sectionMatch = file.match(/export const MINISTRIES:[\s\S]*?=\s*\[([\s\S]*?)\n\];/);
  if (!sectionMatch) return [];

  const section = sectionMatch[1];
  const blocks = section.split(/\n\s*\{\n\s*id:\s*'/).slice(1);
  const rows = [];

  blocks.forEach((block) => {
    const idMatch = block.match(/^([^']+)'/);
    const portfolioMatch = block.match(/\n\s*portfolio:\s*'([^']+)'/);
    const ministerMatch = block.match(/\n\s*minister:\s*'([^']+)'/);
    if (!idMatch || !portfolioMatch || !ministerMatch) return;
    rows.push({
      id: idMatch[1],
      portfolio: portfolioMatch[1],
      minister: ministerMatch[1],
    });
  });

  return rows;
};

const parseDeputies = async () => {
  const candidates = [path.resolve(projectRoot, 'datasets/deputies.csv'), path.resolve(projectRoot, 'deputies.csv')];
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
  const nameIndex = headers.findIndex((header) => header === 'name' || header === 'emri');
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
  const canonicalUrl = canonicalPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${canonicalPath}`;
  const safeTitle = escapeAttr(title);
  const safeDescription = escapeAttr(description);
  const safeCanonical = escapeAttr(canonicalUrl);

  return baseHtml
    .replace(/<title>[^<]*<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${safeDescription}">`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${safeCanonical}" />`)
    .replace(/<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="${safeCanonical}">`)
    .replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${safeTitle}">`)
    .replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${safeDescription}">`)
    .replace(/<meta name="twitter:url" content="[^"]*">/i, `<meta name="twitter:url" content="${safeCanonical}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${safeTitle}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="${safeDescription}">`);
};

const buildSitemapXml = (routes) => {
  const today = new Date().toISOString().slice(0, 10);
  const uniqueRoutes = Array.from(new Set(routes.map((route) => route.path)));
  const rows = uniqueRoutes
    .sort((a, b) => a.localeCompare(b))
    .map((routePath) => {
      const url = routePath === '/' ? `${SITE_URL}/` : `${SITE_URL}${routePath}`;
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

  const routes = [
    {
      path: '/',
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
    {
      path: '/deputetet',
      title: 'zotimi.com - Deputetet dhe aktiviteti parlamentar 2026 - 2030',
      description: 'Lista e deputeteve me metrika te aktivitetit parlamentar, temat e diskutuara dhe historikun e nderhyrjeve me burime zyrtare.',
    },
    {
      path: '/qeveria',
      title: 'zotimi.com - Qeveria dhe performanca e ministrive',
      description: 'Organogrami i qeverise dhe rezultati i ministrive sipas kartave te zotimeve te lidhura me secilin portofol.',
    },
    {
      path: '/methodology',
      title: 'zotimi.com - Metodologjia e monitorimit',
      description: 'Metodologjia e platformes zotimi: burimet, logjika e vleresimit dhe metrikat e riprodhueshme per monitorimin e zotimeve.',
    },
  ];

  promises.forEach((promise) => {
    routes.push({
      path: `/promise/${promise.id}`,
      title: `zotimi.com - Zotimi #${promise.id}: ${promise.title}`,
      description:
        promise.description && promise.description.length > 155
          ? `${promise.description.slice(0, 152).trim()}...`
          : promise.description || DEFAULT_DESCRIPTION,
    });
  });

  ministries.forEach((ministry) => {
    routes.push({
      path: `/qeveria/${ministry.id}`,
      title: `zotimi.com - ${ministry.portfolio}: ${ministry.minister}`,
      description: `Profili i ${ministry.portfolio.toLowerCase()} (${ministry.minister}) me kartat e zotimeve te lidhura, progresin dhe perditesimet e fundit.`,
    });
  });

  deputies.forEach((deputy) => {
    routes.push({
      path: `/deputet/${deputy.id}`,
      title: `zotimi.com - Deputeti: ${deputy.name}`,
      description: `Profili i deputetit ${deputy.name}, temat e diskutuara dhe historiku i aktivitetit parlamentar me burime zyrtare.`,
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

  console.log(`Prerendered ${routes.length} route shells with route-specific meta tags.`);
  console.log(`Generated sitemap with ${new Set(routes.map((route) => route.path)).size} routes.`);
};

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
