'use strict';
const fs = require('fs');
const path = require('path');

/**
 * Parse YAML frontmatter between --- delimiters.
 * Handles: strings, booleans, inline arrays [a, b, c], block sequences (- item),
 * and one level of nesting (e.g. metadata: > keywords: > - item).
 *
 * State machine tracks 3 levels:
 *   L0  top-level key           (0 indent)
 *   L1  nested key under parent (2-space indent)
 *   L2  block-sequence item     (4-space indent OR 2-space under top-level array key)
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const lines = match[1].split(/\r?\n/);
  const result = {};

  // Cursor state
  let l0key = null;   // current top-level key
  let l1key = null;   // current nested key (under l0key)
  let arrayTarget = null; // { obj, key } pointing to the array being built by block-seq items

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.match(/^(\s*)/)[1].length;
    const trimmed = line.trim();

    // Block-sequence item: starts with "- "
    if (trimmed.startsWith('- ') && arrayTarget) {
      const item = trimmed.slice(2).replace(/^["']|["']$/g, '');
      if (!Array.isArray(arrayTarget.obj[arrayTarget.key])) {
        arrayTarget.obj[arrayTarget.key] = [];
      }
      arrayTarget.obj[arrayTarget.key].push(item);
      continue;
    }

    // Key: value line
    const colonAt = trimmed.indexOf(':');
    if (colonAt === -1) continue;
    const key = trimmed.slice(0, colonAt).trim();
    const val = trimmed.slice(colonAt + 1).trim();

    if (indent === 0) {
      // Top-level key
      l0key = key;
      l1key = null;
      arrayTarget = null;
      if (val === '') {
        if (!result[key] || typeof result[key] !== 'object' || Array.isArray(result[key])) {
          result[key] = {};
        }
        // Could be a block-seq at L0 — set arrayTarget in case next lines are "- item"
        arrayTarget = { obj: result, key };
      } else {
        result[key] = parseYamlValue(val);
        arrayTarget = null;
      }
    } else if (indent <= 3 && l0key) {
      // Nested key under l0key (e.g. "  keywords:")
      l1key = key;
      arrayTarget = null;
      const parent = result[l0key];
      if (!parent || typeof parent !== 'object' || Array.isArray(parent)) {
        result[l0key] = {};
      }
      if (val === '') {
        // Block-sequence will follow at deeper indent
        result[l0key][key] = [];
        arrayTarget = { obj: result[l0key], key };
      } else {
        result[l0key][key] = parseYamlValue(val);
      }
    }
    // Deeper nesting (indent >= 4) that isn't a block-seq item: ignore (not needed for scoring)
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
