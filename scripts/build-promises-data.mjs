#!/usr/bin/env node
// Copy countries/<COUNTRY>/promises.json into public/data/promises.json so the
// React app can fetch it at runtime instead of bundling it in the main JS chunk.

import fs from 'node:fs/promises';
import { countryPath, publicDataPath, resolveCountry } from './lib/country.mjs';

const country = resolveCountry(process.argv.slice(2));
const source = countryPath(country, 'promises.json');
const target = publicDataPath('promises.json');

const main = async () => {
  let raw;
  try {
    raw = await fs.readFile(source, 'utf8');
  } catch {
    console.warn(`[${country}] no promises.json found at ${source}; writing empty array.`);
    raw = '[]\n';
  }
  // Validate it parses, then write through to enforce trailing newline.
  const parsed = JSON.parse(raw);
  await fs.mkdir(publicDataPath(), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
  console.log(`[${country}] copied ${Array.isArray(parsed) ? parsed.length : 0} promises to ${target}`);
};

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
