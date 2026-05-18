#!/usr/bin/env node
// Country-specific public overlay.
//
// At build time, after `vite build` has populated `dist/` from `public/`,
// this script copies anything under `countries/<COUNTRY>/public/` on top.
// Useful for per-country favicons, OG images, party logos, robots.txt etc.
//
// Layout:
//   public/                            -- defaults (civic-pulse branding)
//   countries/<code>/public/           -- per-country overrides (optional)
//
// The overlay is *additive*: existing files in dist/ are overwritten only when
// the country supplies an explicit replacement.

import fs from 'node:fs/promises';
import path from 'node:path';
import { countryPath, projectRoot, resolveCountry } from './lib/country.mjs';

const country = resolveCountry(process.argv.slice(2));
const overlayDir = countryPath(country, 'public');
const distDir = path.resolve(projectRoot, 'dist');

const copyRecursive = async (from, to) => {
  const stats = await fs.stat(from);
  if (stats.isDirectory()) {
    await fs.mkdir(to, { recursive: true });
    const entries = await fs.readdir(from, { withFileTypes: true });
    for (const entry of entries) {
      await copyRecursive(path.join(from, entry.name), path.join(to, entry.name));
    }
    return;
  }
  await fs.copyFile(from, to);
};

const main = async () => {
  try {
    await fs.access(overlayDir);
  } catch {
    console.log(`[${country}] no countries/${country}/public/ overlay — using defaults from public/.`);
    return;
  }
  try {
    await fs.access(distDir);
  } catch {
    console.error(`No dist/ directory yet. Run vite build first.`);
    process.exit(1);
  }
  await copyRecursive(overlayDir, distDir);
  console.log(`[${country}] overlaid countries/${country}/public/ onto dist/.`);
};

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
