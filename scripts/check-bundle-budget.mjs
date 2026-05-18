#!/usr/bin/env node
// Performance budget guard: fails the build (and CI) if the main JS or CSS
// chunk exceeds the budget. Lazy chunks are reported but don't count toward
// the main budget.

import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '..');

// 1.0 readiness target: initial JS gzipped < 100 KB on the largest reference
// dataset. Promises are fetched at runtime (`/data/promises.json`) so the main
// bundle no longer scales with promise count.
const BUDGETS = {
  mainJsGzip: 100 * 1024,
  cssGzip: 50 * 1024,
};

// Match Vite's gzip-size reporting (default compression level) so the numbers
// here track the build-output banner. CDNs (Cloudflare, Vercel, Netlify) also
// default to level 6.
const gzipped = async (file) => {
  const raw = await fs.readFile(file);
  return new Promise((resolve, reject) => {
    zlib.gzip(raw, { level: 6 }, (err, buf) => {
      if (err) reject(err);
      else resolve(buf.length);
    });
  });
};

const main = async () => {
  const assetsDir = path.resolve(projectRoot, 'dist', 'assets');
  let entries;
  try {
    entries = await fs.readdir(assetsDir);
  } catch (error) {
    console.error(`No dist/assets directory found at ${assetsDir}. Run \`npm run build\` first.`);
    process.exit(1);
  }

  const jsFiles = entries.filter((name) => name.endsWith('.js'));
  const cssFiles = entries.filter((name) => name.endsWith('.css'));

  const mainJs = jsFiles.find((name) => /^index-[^/]+\.js$/.test(name));
  if (!mainJs) {
    console.error('Could not identify main JS chunk (expected dist/assets/index-*.js).');
    process.exit(1);
  }

  const mainJsSize = await gzipped(path.join(assetsDir, mainJs));
  const cssSize = cssFiles.length ? await gzipped(path.join(assetsDir, cssFiles[0])) : 0;

  const lazy = await Promise.all(
    jsFiles
      .filter((name) => name !== mainJs)
      .map(async (name) => ({ name, size: await gzipped(path.join(assetsDir, name)) })),
  );

  console.log('Bundle gzipped sizes:');
  console.log(`  main JS  ${mainJs} → ${(mainJsSize / 1024).toFixed(1)} KB (budget: ${BUDGETS.mainJsGzip / 1024} KB)`);
  if (cssFiles.length) {
    console.log(`  CSS      ${cssFiles[0]} → ${(cssSize / 1024).toFixed(1)} KB (budget: ${BUDGETS.cssGzip / 1024} KB)`);
  }
  if (lazy.length) {
    console.log('  Lazy chunks (not counted toward main budget):');
    lazy
      .sort((a, b) => b.size - a.size)
      .forEach(({ name, size }) => console.log(`    ${name} → ${(size / 1024).toFixed(2)} KB`));
  }

  const violations = [];
  if (mainJsSize > BUDGETS.mainJsGzip) violations.push(`main JS ${(mainJsSize / 1024).toFixed(1)} KB > ${BUDGETS.mainJsGzip / 1024} KB`);
  if (cssSize > BUDGETS.cssGzip) violations.push(`CSS ${(cssSize / 1024).toFixed(1)} KB > ${BUDGETS.cssGzip / 1024} KB`);

  if (violations.length) {
    console.error('\nPerformance budget exceeded:');
    violations.forEach((message) => console.error(`  ✗ ${message}`));
    process.exit(2);
  }

  console.log('\nPerformance budget OK ✓');
};

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
