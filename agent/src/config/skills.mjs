import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '..', '..', '..');
const skillsDir = path.resolve(projectRoot, '.claude', 'skills');

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };
  const yaml = match[1];
  const body = match[2];

  const frontmatter = {};
  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (/^(true|false)$/i.test(value)) value = /^true$/i.test(value);
    frontmatter[key] = value;
  }
  return { frontmatter, body: body.trim() };
};

export const loadSkill = async (skillName) => {
  const file = path.join(skillsDir, skillName, 'SKILL.md');
  let raw;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch (error) {
    throw new Error(`Skill "${skillName}" not found at ${file}: ${error.message}`);
  }
  const { frontmatter, body } = parseFrontmatter(raw);
  return {
    name: frontmatter.name || skillName,
    description: frontmatter.description || '',
    allowedTools: frontmatter['allowed-tools'] || '',
    body,
    path: file,
  };
};

export const listSkills = async () => {
  try {
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
};
