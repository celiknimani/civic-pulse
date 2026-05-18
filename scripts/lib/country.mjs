import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(here, '..', '..');

export const readArg = (argv, name, fallback) => {
  const index = argv.findIndex((arg) => arg === name);
  if (index < 0) return fallback;
  return argv[index + 1] || fallback;
};

export const resolveCountry = (argv) => {
  const fromArg = readArg(argv, '--country', null);
  const fromEnv = process.env.COUNTRY;
  const country = (fromArg || fromEnv || 'example').toLowerCase();
  if (!/^[a-z][a-z0-9-]*$/.test(country)) {
    throw new Error(`Invalid country code "${country}". Use lowercase letters, digits, and hyphens.`);
  }
  return country;
};

export const countryRoot = (country) => path.resolve(projectRoot, 'countries', country);

export const countryPath = (country, ...segments) => path.resolve(countryRoot(country), ...segments);

export const publicDataPath = (...segments) => path.resolve(projectRoot, 'public', 'data', ...segments);
