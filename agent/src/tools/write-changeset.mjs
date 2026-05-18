import fs from 'node:fs/promises';
import path from 'node:path';

export const writeChangeset = async ({ countryRoot, runId, sourceId, skillName, payload }) => {
  const dir = path.join(countryRoot, 'pending');
  await fs.mkdir(dir, { recursive: true });
  const fileName = `${runId}-${sourceId}-${skillName}.json`;
  const absolute = path.join(dir, fileName);
  await fs.writeFile(absolute, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return absolute;
};
