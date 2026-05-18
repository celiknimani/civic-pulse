// Minimal deep-diff for two JSON-serializable values, used to preview admin edits
// before they're written to disk. Output is a list of paths with old/new values.

export interface DiffEntry {
  path: string;
  kind: 'added' | 'removed' | 'changed';
  before?: unknown;
  after?: unknown;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const diff = (before: unknown, after: unknown, basePath = '$'): DiffEntry[] => {
  if (Object.is(before, after)) return [];

  if (Array.isArray(before) && Array.isArray(after)) {
    const result: DiffEntry[] = [];
    const max = Math.max(before.length, after.length);
    for (let i = 0; i < max; i += 1) {
      const childPath = `${basePath}[${i}]`;
      if (i >= before.length) result.push({ path: childPath, kind: 'added', after: after[i] });
      else if (i >= after.length) result.push({ path: childPath, kind: 'removed', before: before[i] });
      else result.push(...diff(before[i], after[i], childPath));
    }
    return result;
  }

  if (isObject(before) && isObject(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    const result: DiffEntry[] = [];
    for (const key of keys) {
      const childPath = `${basePath}.${key}`;
      if (!(key in before)) result.push({ path: childPath, kind: 'added', after: after[key] });
      else if (!(key in after)) result.push({ path: childPath, kind: 'removed', before: before[key] });
      else result.push(...diff(before[key], after[key], childPath));
    }
    return result;
  }

  if (before === undefined) return [{ path: basePath, kind: 'added', after }];
  if (after === undefined) return [{ path: basePath, kind: 'removed', before }];
  if (before !== after) return [{ path: basePath, kind: 'changed', before, after }];
  return [];
};

const truncate = (value: unknown, max = 80): string => {
  const str = typeof value === 'string' ? value : JSON.stringify(value);
  if (str === undefined) return '';
  return str.length > max ? `${str.slice(0, max)}…` : str;
};

export const summarize = (entries: DiffEntry[]): string => {
  if (entries.length === 0) return 'No changes.';
  return entries
    .map((entry) => {
      switch (entry.kind) {
        case 'added':
          return `+ ${entry.path}: ${truncate(entry.after)}`;
        case 'removed':
          return `- ${entry.path}: ${truncate(entry.before)}`;
        case 'changed':
          return `~ ${entry.path}: ${truncate(entry.before)} → ${truncate(entry.after)}`;
      }
    })
    .join('\n');
};
