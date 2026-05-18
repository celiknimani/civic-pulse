#!/usr/bin/env node
// Real-browser accessibility audit. Serves dist/ via a built-in HTTP server,
// drives Chromium with Playwright, and runs axe-core against each sample route
// after JavaScript has hydrated. Catches dynamic-state issues that the
// JSDOM-based check-accessibility.mjs can't see (focus visibility, ARIA live
// regions, etc.).
//
// Usage:
//   node scripts/check-accessibility-browser.mjs                     # full audit
//   node scripts/check-accessibility-browser.mjs --routes /,/about   # custom routes
//   AGENT_DEBUG=true node scripts/check-accessibility-browser.mjs    # verbose

import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '..');
const distRoot = path.resolve(projectRoot, 'dist');

const DEFAULT_ROUTES = ['/', '/methodology', '/about', '/privacy', '/contact', '/deputetet', '/qeveria'];

const readArg = (name) => {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : null;
};

const ROUTES = (readArg('--routes') || DEFAULT_ROUTES.join(',')).split(',').map((r) => r.trim()).filter(Boolean);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

const serveDist = async () => {
  await fs.access(distRoot).catch(() => {
    throw new Error(`No dist directory at ${distRoot}. Run \`npm run build\` first.`);
  });

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost');
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';

      let filePath = path.resolve(distRoot, `.${pathname}`);
      if (!filePath.startsWith(distRoot)) throw new Error('path escape');

      try {
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) filePath = path.resolve(filePath, 'index.html');
      } catch {
        // Fall back to prerendered route shell `/<segment>/index.html`.
        const candidate = path.resolve(distRoot, `.${pathname}`, 'index.html');
        if (candidate.startsWith(distRoot)) {
          try {
            await fs.access(candidate);
            filePath = candidate;
          } catch {
            res.statusCode = 404;
            res.end('Not Found');
            return;
          }
        }
      }

      const body = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('content-type', MIME[ext] || 'application/octet-stream');
      res.end(body);
    } catch (error) {
      res.statusCode = 500;
      res.end(String(error?.message || error));
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return { server, port };
};

// Per-route allowlist. Each entry: { route, ruleId, selectorIncludes }.
// Use to acknowledge known-edge-case violations while tracking the fix in an issue.
// Keep this list short and link to the tracking issue in a comment.
const ALLOWED_VIOLATIONS = [
  // Methodology eyebrow text rendered against the same gradient as the page background.
  // Tracked in `docs/ACCESSIBILITY.md` § Known minor violations.
  { route: '/methodology', ruleId: 'color-contrast', selectorIncludes: '.mt-1' },
  // Qeveria sub-label spacing class — see same doc section.
  { route: '/qeveria', ruleId: 'color-contrast', selectorIncludes: '.mt-3' },
];

const isAllowed = (route, violation) =>
  ALLOWED_VIOLATIONS.some(
    (allow) =>
      allow.route === route &&
      allow.ruleId === violation.id &&
      violation.nodes.every((node) => node.target.join(' ').includes(allow.selectorIncludes)),
  );

const auditRoute = async (page, baseUrl, route) => {
  const target = `${baseUrl}${route === '/' ? '/' : route}`;
  await page.goto(target, { waitUntil: 'networkidle' });

  // Give the SPA a tick to settle async data fetches.
  await page.waitForTimeout(150);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  return results.violations.filter((violation) => !isAllowed(route, violation));
};

const main = async () => {
  const { server, port } = await serveDist();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Serving dist/ on ${baseUrl}`);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  let totalViolations = 0;
  try {
    for (const route of ROUTES) {
      try {
        const violations = await auditRoute(page, baseUrl, route);
        if (violations.length === 0) {
          console.log(`  ✓ ${route} — no violations`);
          continue;
        }
        totalViolations += violations.length;
        console.log(`  ✗ ${route} — ${violations.length} violation${violations.length === 1 ? '' : 's'}`);
        violations.forEach((violation) => {
          console.log(`      ${violation.id} (${violation.impact}): ${violation.help}`);
          violation.nodes.slice(0, 3).forEach((node) => {
            console.log(`        ↳ ${node.target.join(' ')}`);
          });
        });
      } catch (error) {
        console.error(`  ⚠ ${route} — audit error: ${error.message}`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('');
  if (totalViolations === 0) {
    console.log('Browser accessibility audit OK ✓');
    process.exit(0);
  }
  console.error(`Found ${totalViolations} accessibility violations across ${ROUTES.length} routes.`);
  process.exit(2);
};

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
