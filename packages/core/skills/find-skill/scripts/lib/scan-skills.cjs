'use strict';
const fs = require('fs');
const path = require('path');

/**
 * Parse YAML frontmatter between --- delimiters.
 * Handles: strings, booleans, inline arrays [a, b], one level of nesting (metadata:).
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const lines = match[1].split(/\r?\n/);
  const result = {};
  let parent = null; // tracks current nested parent key

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // Nested line (indented with spaces)
    if (/^  \S/.test(line) && parent) {
      const colonAt = line.indexOf(':');
      if (colonAt === -1) continue;
      const key = line.slice(0, colonAt).trim();
      const val = line.slice(colonAt + 1).trim();
      if (!result[parent] || typeof result[parent] !== 'object') result[parent] = {};
      result[parent][key] = parseYamlValue(val);
      continue;
    }

    // Top-level line
    const colonAt = line.indexOf(':');
    if (colonAt === -1) continue;
    const key = line.slice(0, colonAt).trim();
    const val = line.slice(colonAt + 1).trim();

    if (val === '') {
      parent = key;
      if (!result[key]) result[key] = {};
    } else {
      parent = null;
      result[key] = parseYamlValue(val);
    }
  }

  return result;
}

/** Parse a scalar YAML value: boolean, inline array, or string. */
function parseYamlValue(val) {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (val === 'null' || val === '~') return null;
  if (val.startsWith('[') && val.endsWith(']')) {
    return val.slice(1, -1)
      .split(',')
      .map(s => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
  return val;
}

/** Coerce a value to string array. */
function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') return [val];
  return [];
}

/**
 * Scan a skills/ directory and return metadata for each skill.
 * Skips entries without a SKILL.md. Never throws.
 * @param {string} skillsDir - absolute path to a directory containing skill subdirs
 * @returns {Array<object>} SkillMeta[]
 */
function scanSkills(skillsDir) {
  if (!fs.existsSync(skillsDir)) return [];

  let entries;
  try { entries = fs.readdirSync(skillsDir); } catch { return []; }

  return entries
    .filter(name => {
      try { return fs.statSync(path.join(skillsDir, name)).isDirectory(); } catch { return false; }
    })
    .map(name => {
      const skillDir = path.join(skillsDir, name);
      const skillFile = path.join(skillDir, 'SKILL.md');
      if (!fs.existsSync(skillFile)) return null;

      let fm = {};
      try {
        fm = parseFrontmatter(fs.readFileSync(skillFile, 'utf8'));
      } catch { /* keep empty fm */ }

      const meta = (fm.metadata && typeof fm.metadata === 'object') ? fm.metadata : {};

      return {
        name: fm.name || name,
        description: fm.description || '',
        keywords: toArray(meta.keywords),
        triggers: toArray(meta.triggers),
        platforms: toArray(meta.platforms),
        userInvocable: fm['user-invocable'] ?? null,
        hasReferences: fs.existsSync(path.join(skillDir, 'references')),
        hasScripts: fs.existsSync(path.join(skillDir, 'scripts')),
        hasEvals: fs.existsSync(path.join(skillDir, 'evals')),
        skillPath: skillDir,
      };
    })
    .filter(Boolean);
}

module.exports = { scanSkills };
