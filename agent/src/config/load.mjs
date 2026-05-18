import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(here, '..', '..', '..');

const countryRoot = (country) => path.resolve(projectRoot, 'countries', country);

const loadJson = async (file) => {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw);
};

// Tiny YAML reader sufficient for the sources.yaml schema we ship.
// Supports nested keys, list items, scalars (strings, numbers, booleans), and inline lists [a, b, c].
// For anything fancier add a real YAML library — this is intentionally dependency-free.
const parseYaml = (text) => {
  const lines = text.split(/\r?\n/).map((line) => line.replace(/\s+$/, ''));
  let i = 0;

  const peek = () => lines[i];
  const at = (n) => lines[n];

  const indentOf = (line) => {
    const m = line.match(/^( *)/);
    return m ? m[1].length : 0;
  };

  const stripComment = (value) => {
    let inQuote = false;
    let quote = null;
    let out = '';
    for (let j = 0; j < value.length; j += 1) {
      const ch = value[j];
      if (inQuote) {
        out += ch;
        if (ch === quote && value[j - 1] !== '\\') {
          inQuote = false;
          quote = null;
        }
      } else if (ch === '"' || ch === "'") {
        out += ch;
        inQuote = true;
        quote = ch;
      } else if (ch === '#') {
        break;
      } else {
        out += ch;
      }
    }
    return out.replace(/\s+$/, '');
  };

  const parseScalar = (raw) => {
    const value = stripComment(raw).trim();
    if (!value) return '';
    if (/^(true|false)$/i.test(value)) return /^true$/i.test(value);
    if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
    if (/^\[.*\]$/.test(value)) {
      const inner = value.slice(1, -1).trim();
      if (!inner) return [];
      return inner.split(',').map((entry) => parseScalar(entry.trim()));
    }
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    return value;
  };

  const parseNode = (parentIndent) => {
    while (i < lines.length) {
      const line = peek();
      if (line === undefined) break;
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        i += 1;
        continue;
      }
      break;
    }
    if (i >= lines.length) return null;

    const firstLine = peek();
    const firstIndent = indentOf(firstLine);
    if (firstIndent <= parentIndent) return null;

    const isList = firstLine.trim().startsWith('- ');
    if (isList) {
      const list = [];
      while (i < lines.length) {
        const line = at(i);
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          i += 1;
          continue;
        }
        if (indentOf(line) !== firstIndent || !line.trim().startsWith('- ')) break;

        const afterDash = line.replace(/^( *- )/, '');
        const itemIndent = firstIndent + 2;

        // Inline mapping after dash: "- id: foo"
        if (/^[A-Za-z_][\w-]*\s*:/.test(afterDash)) {
          // Rewrite as a virtual mapping line at itemIndent for parsing
          lines[i] = `${' '.repeat(itemIndent)}${afterDash}`;
          const mapping = parseMapping(itemIndent);
          list.push(mapping);
        } else if (afterDash.trim()) {
          i += 1;
          list.push(parseScalar(afterDash));
        } else {
          i += 1;
          const child = parseNode(firstIndent);
          list.push(child);
        }
      }
      return list;
    }

    return parseMapping(firstIndent);
  };

  const parseMapping = (mapIndent) => {
    const obj = {};
    while (i < lines.length) {
      const line = at(i);
      const trimmed = line ? line.trim() : '';
      if (!trimmed || trimmed.startsWith('#')) {
        i += 1;
        continue;
      }
      if (indentOf(line) !== mapIndent) {
        if (indentOf(line) < mapIndent) break;
        // Unexpected deeper indent without a key — skip
        i += 1;
        continue;
      }
      const match = trimmed.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
      if (!match) {
        // Not a valid mapping line at this indent; stop.
        break;
      }
      const key = match[1];
      const rest = match[2];
      i += 1;
      if (rest === '' || rest === undefined) {
        const value = parseNode(mapIndent);
        obj[key] = value === null ? null : value;
      } else if (rest.trim().startsWith('#')) {
        const value = parseNode(mapIndent);
        obj[key] = value === null ? null : value;
      } else {
        obj[key] = parseScalar(rest);
      }
    }
    return obj;
  };

  // Find the first non-blank, non-comment line and use its indent as the root.
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) { i += 1; continue; }
    break;
  }
  if (i >= lines.length) return {};
  const rootIndent = indentOf(lines[i]);
  if (lines[i].trim().startsWith('- ')) {
    // Top-level list — not used by sources.yaml but kept for completeness.
    return parseNode(rootIndent - 1);
  }
  return parseMapping(rootIndent);
};

const loadYaml = async (file) => {
  const raw = await fs.readFile(file, 'utf8');
  return parseYaml(raw);
};

const resolveCountry = (cliCountry) => {
  const value = (cliCountry || process.env.COUNTRY || 'example').toLowerCase();
  if (!/^[a-z][a-z0-9-]*$/.test(value)) {
    throw new Error(`Invalid country code "${value}"`);
  }
  return value;
};

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

export const loadAgentContext = async (options = {}, { requireAnthropicKey = true } = {}) => {
  const country = resolveCountry(options.country);
  const root = countryRoot(country);

  let config = {};
  try {
    config = await loadJson(path.join(root, 'config.json'));
  } catch (error) {
    throw new Error(`Could not read countries/${country}/config.json: ${error.message}`);
  }

  let categories = [];
  try {
    categories = await loadJson(path.join(root, 'categories.json'));
  } catch (error) {
    throw new Error(`Could not read countries/${country}/categories.json: ${error.message}`);
  }

  let sourcesDoc = null;
  try {
    sourcesDoc = await loadYaml(path.join(root, 'sources.yaml'));
  } catch (error) {
    throw new Error(`Could not read countries/${country}/sources.yaml: ${error.message}`);
  }

  const defaults = sourcesDoc?.defaults || {};
  const rawSources = Array.isArray(sourcesDoc?.sources) ? sourcesDoc.sources : [];

  const sources = rawSources.map((source, index) => {
    const merged = { ...defaults, ...source };
    if (!merged.id) throw new Error(`Source #${index + 1} is missing 'id'`);
    if (!merged.url) throw new Error(`Source "${merged.id}" is missing 'url'`);
    if (!merged.fetch_mode) throw new Error(`Source "${merged.id}" is missing 'fetch_mode'`);
    return {
      id: merged.id,
      label: merged.label || merged.id,
      url: merged.url,
      type: merged.type || 'government_website',
      fetchMode: merged.fetch_mode,
      trustTier: merged.trust_tier ?? 2,
      enabled: merged.enabled !== false,
      extract: merged.extract || {},
    };
  });

  let filteredSources = sources;
  if (options.source) {
    filteredSources = sources.filter((source) => source.id === options.source);
    if (!filteredSources.length) {
      throw new Error(`No source with id "${options.source}" in countries/${country}/sources.yaml`);
    }
  }

  const enabledSources = filteredSources.filter((source) => source.enabled);
  const cappedSources = options.maxSources ? enabledSources.slice(0, options.maxSources) : enabledSources;

  const context = {
    country,
    countryRoot: root,
    projectRoot,
    config,
    categories,
    sources,
    enabledSources: cappedSources,
    options: {
      dryRun: !!options.dryRun,
      confidenceThreshold: options.confidenceThreshold ?? 0.5,
      model: process.env.AGENT_MODEL || 'claude-sonnet-4-6',
    },
  };

  if (requireAnthropicKey && !context.options.dryRun) {
    requireEnv('ANTHROPIC_API_KEY');
  }

  return context;
};
