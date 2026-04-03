'use strict';
const fs = require('fs');
const path = require('path');

/**
 * Extract a project profile used for skill relevance scoring.
 *
 * Sources (all optional — missing files are silently skipped):
 *   1. .epost-metadata.json  → installed platform packages  → platforms[]
 *   2. CLAUDE.md             → tech stack table values      → techTerms[]
 *   3. docs/index.json       → entry tags                   → domainTags[]
 *
 * @param {string} cwdPath - project root directory
 * @returns {{ platforms: string[], techTerms: string[], domainTags: string[] }}
 */
function extractProjectContext(cwdPath) {
  return {
    platforms: readPlatforms(cwdPath),
    techTerms: readTechTerms(cwdPath),
    domainTags: readDomainTags(cwdPath),
  };
}

/** Extract platform names from .epost-metadata.json installedPackages. */
function readPlatforms(cwd) {
  const metaPath = path.join(cwd, '.epost-metadata.json');
  if (!fs.existsSync(metaPath)) return [];
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const ignoredPackages = new Set(['core', 'a11y', 'kit', 'design-system', 'domains']);
    return (meta.installedPackages || [])
      .map(p => p.replace(/^platform-/, ''))
      .filter(p => !ignoredPackages.has(p));
  } catch { return []; }
}

/**
 * Extract tech stack terms from CLAUDE.md.
 * Looks for markdown table rows of the form: | **Label** | Value text |
 * Only scans "Tech Stack" sections (heading + following table).
 */
function readTechTerms(cwd) {
  const claudeMd = path.join(cwd, 'CLAUDE.md');
  if (!fs.existsSync(claudeMd)) return [];
  try {
    const content = fs.readFileSync(claudeMd, 'utf8');
    const terms = new Set();

    // Find all table cell values (second column) — avoids false positives from prose
    for (const match of content.matchAll(/\|\s*\*\*[^*]+\*\*\s*\|\s*([^|\n]+)\|/g)) {
      // Tokenize the cell value: split on whitespace, commas, +, parens, version numbers
      match[1].trim().split(/[\s,+()]+/).forEach(token => {
        // Strip version suffixes like "14", "18", "5+"
        const clean = token.replace(/\d+(\.\d+)*\+?$/, '').replace(/[^a-zA-Z.-]/g, '').toLowerCase();
        if (clean.length >= 2) terms.add(clean);
      });
    }
    return [...terms];
  } catch { return []; }
}

/** Flatten all tags from docs/index.json entries. */
function readDomainTags(cwd) {
  const indexPath = path.join(cwd, 'docs', 'index.json');
  if (!fs.existsSync(indexPath)) return [];
  try {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const tags = new Set();
    (index.entries || []).forEach(entry => {
      (entry.tags || []).forEach(tag => tags.add(tag.toLowerCase()));
    });
    return [...tags];
  } catch { return []; }
}

module.exports = { extractProjectContext };
