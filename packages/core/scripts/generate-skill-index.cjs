#!/usr/bin/env node
/**
 * Skill Index Generator
 *
 * Scans SKILL.md files for YAML frontmatter and generates compact skill-index.json
 * Usage: node generate-skill-index.cjs
 */

const fs = require('fs');
const path = require('path');

// Support multiple skill directories: pass comma-separated paths or default to ../skills
const SKILLS_DIRS = (process.argv[2] || path.join(__dirname, '../skills'))
  .split(',')
  .map(d => d.trim());
const OUTPUT_DIR = process.argv[3] || SKILLS_DIRS[0];
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'skill-index.json');

/**
 * Category taxonomy — maps skill names to categories
 *
 * 9 categories, 40 skills (as of 2026-03-27):
 *   workflow     — user-invocable action commands
 *   quality      — background discipline / code standards
 *   knowledge    — retrieval, capture, discovery
 *   web          — web platform (React, Next.js, APIs, auth, i18n, testing)
 *   accessibility — WCAG 2.1 AA cross-platform + specializations
 *   design       — design system pipeline (Figma, tokens, components)
 *   backend      — Jakarta EE + databases
 *   domain       — business domain knowledge (B2B, B2C)
 *   kit          — kit authoring tools
 */
const CATEGORY_MAP = {
  // workflow — user-invocable action skills
  'cook': 'workflow',
  'fix': 'workflow',
  'debug': 'workflow',
  'plan': 'workflow',
  'test': 'workflow',
  'audit': 'workflow',
  'docs': 'workflow',
  'git': 'workflow',
  'get-started': 'workflow',
  'launchpad': 'workflow',
  'thinking': 'workflow',
  'mermaidjs': 'knowledge',

  // quality — background discipline, always-on code standards
  'core': 'quality',
  'code-review': 'quality',
  'tdd': 'quality',
  'error-recovery': 'quality',
  'security': 'quality',
  'loop': 'workflow',

  // knowledge — retrieval, capture, discovery, orchestration
  'knowledge': 'knowledge',
  'journal': 'knowledge',
  'repomix': 'knowledge',
  'skill-discovery': 'knowledge',
  'subagent-driven-development': 'knowledge',

  // web — web platform specifics
  'web-frontend': 'web',
  'web-nextjs': 'web',
  'web-api-routes': 'web',
  'web-auth': 'web',
  'web-i18n': 'web',
  'web-modules': 'web',
  'web-testing': 'web',
  'web-ui-lib': 'web',

  // accessibility — WCAG 2.1 AA
  'a11y': 'accessibility',
  'ios-a11y': 'accessibility',
  'android-a11y': 'accessibility',
  'web-a11y': 'accessibility',

  // design — design system pipeline
  'figma': 'design',
  'design-tokens': 'design',
  'ui-lib-dev': 'design',

  // backend — Jakarta EE + databases
  'backend-javaee': 'backend',
  'backend-databases': 'backend',

  // domain — business domain knowledge
  'domain-b2b': 'domain',
  'domain-b2c': 'domain',

  // kit — kit authoring tools
  'kit': 'kit',

  // quality — skill authoring and improvement
  'skill-creator': 'quality',
};

/**
 * Connection graph — defines inter-skill relationships
 * Types: extends (specialization), requires (must co-load),
 *        enhances (optional boost), conflicts (mutually exclusive)
 *
 * Cleaned 2026-03-27: removed 13 stale refs to deleted skills
 */
const CONNECTION_MAP = {
  // A11y extends (platform specializes cross-platform base)
  'ios-a11y':     { extends: ['a11y'] },
  'android-a11y': { extends: ['a11y'] },
  'web-a11y':     { extends: ['a11y'] },

  // Web platform enhances
  'web-nextjs':     { enhances: ['web-frontend'] },
  'web-api-routes': { enhances: ['web-frontend'] },
  'web-modules':    { enhances: ['web-frontend'] },

  // Backend enhances
  'backend-databases': { enhances: ['backend-javaee'] },

  // Design system requires
  'ui-lib-dev':    { requires: ['figma'] },
  'design-tokens': { requires: ['figma'] },

  // Knowledge graph
  'repomix':     { enhances: ['docs'] },
  'knowledge':   { enhances: ['plan', 'debug'] },

  // Quality enhances
  'tdd':            { enhances: ['test'] },
  'error-recovery': { enhances: ['debug'] },
  'security':       { enhances: ['code-review'] },

  // Workflow enhances
  'cook':      { enhances: ['plan'] },
  'debug':     { enhances: ['fix'] },
  'test':      { enhances: ['code-review'] },
  'audit':     { enhances: ['code-review'] },
  'launchpad': { enhances: ['cook'] },
  'subagent-driven-development': { enhances: ['plan'] },
  'thinking':  { enhances: ['debug', 'plan'] },
  'mermaidjs': { enhances: ['docs', 'plan'] },
  'loop':          { enhances: ['test'] },
  'skill-creator': { enhances: ['cook', 'plan'] },
};

/**
 * Extract YAML frontmatter from markdown content
 * Simple regex parser (KISS principle - no external dependencies)
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return null;

  const yamlContent = match[1];
  const metadata = {};

  // Parse YAML lines (simple key: value or key: [array])
  const lines = yamlContent.split('\n');
  let currentKey = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Array item
    if (trimmed.startsWith('-') && currentKey) {
      const value = trimmed.substring(1).trim();
      if (!metadata[currentKey]) metadata[currentKey] = [];
      metadata[currentKey].push(value);
      continue;
    }

    // Key-value pair
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }

    // Strip residual trailing quotes (e.g. [a, b]" → [a, b])
    value = value.replace(/["']\s*$/, '');

    // Array notation [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      const items = value.substring(1, value.length - 1)
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, ''))
        .filter(item => item);
      metadata[key] = items;
    } else if (value) {
      metadata[key] = value;
    } else {
      currentKey = key;
    }
  }

  return metadata;
}

/**
 * Recursively find all SKILL.md files
 */
function findSkillFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findSkillFiles(filePath, fileList);
    } else if (file === 'SKILL.md') {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * Generate skill index
 */
function generateSkillIndex() {
  const startTime = Date.now();

  console.log(`Scanning ${SKILLS_DIRS.length} skill director${SKILLS_DIRS.length > 1 ? 'ies' : 'y'}...`);
  const skillFiles = [];
  for (const dir of SKILLS_DIRS) {
    if (fs.existsSync(dir)) {
      findSkillFiles(dir, skillFiles);
    } else {
      console.warn(`  Skipping missing directory: ${dir}`);
    }
  }
  console.log(`Found ${skillFiles.length} skill files`);

  const skills = [];
  const errors = [];

  for (const filePath of skillFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const metadata = extractFrontmatter(content);

      if (!metadata) {
        errors.push(`No frontmatter: ${path.relative(OUTPUT_DIR, filePath)}`);
        continue;
      }

      // Validate required fields
      if (!metadata.name) {
        errors.push(`Missing 'name': ${path.relative(OUTPUT_DIR, filePath)}`);
        continue;
      }

      // Build skill entry with relative path
      const relativePath = path.relative(OUTPUT_DIR, filePath);
      const name = metadata.name;
      const connections = CONNECTION_MAP[name] || {};

      // Compute size: SKILL.md + all files in references/ subdirectory
      const skillDir = path.dirname(filePath);
      const refsDir = path.join(skillDir, 'references');
      let totalBytes = Buffer.byteLength(content, 'utf-8');
      if (fs.existsSync(refsDir)) {
        for (const ref of fs.readdirSync(refsDir)) {
          try {
            const refStat = fs.statSync(path.join(refsDir, ref));
            if (refStat.isFile()) totalBytes += refStat.size;
          } catch { /* skip unreadable */ }
        }
      }

      const skill = {
        name,
        description: metadata.description || '',
        category: CATEGORY_MAP[name] || 'uncategorized',
        tier: metadata.tier || 'discoverable',
        keywords: metadata.keywords || [],
        platforms: metadata.platforms || ['all'],
        triggers: metadata.triggers || [],
        'agent-affinity': metadata['agent-affinity'] || [],
        connections: {
          extends: connections.extends || [],
          requires: connections.requires || [],
          enhances: connections.enhances || [],
          conflicts: connections.conflicts || [],
        },
        size: totalBytes,
        path: relativePath
      };

      skills.push(skill);
    } catch (error) {
      errors.push(`Error processing ${path.relative(OUTPUT_DIR, filePath)}: ${error.message}`);
    }
  }

  // Deduplicate by skill name — prefer shorter path (more canonical)
  const seen = new Map();
  skills.forEach(s => {
    if (!seen.has(s.name) || s.path.length < seen.get(s.name).path.length) {
      seen.set(s.name, s);
    }
  });
  const deduped = [...seen.values()];

  // Sort by name for consistency
  deduped.sort((a, b) => a.name.localeCompare(b.name));

  // Compute stats
  const categories = {};
  let connectedCount = 0;
  for (const s of deduped) {
    categories[s.category] = (categories[s.category] || 0) + 1;
    if (Object.values(s.connections).some(a => a.length > 0)) connectedCount++;
  }

  // Write index
  const index = {
    generated: new Date().toISOString(),
    version: '2.0.0',
    count: deduped.length,
    categories,
    connectedSkills: connectedCount,
    skills: deduped
  };

  // Pretty JSON for readability (still efficient for LLMs)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), 'utf-8');

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\nGenerated skill-index.json:`);
  console.log(`  - ${deduped.length} skills indexed (${skills.length - deduped.length} duplicates removed)`);
  console.log(`  - ${Object.keys(categories).length} categories`);
  console.log(`  - ${connectedCount} skills with connections`);
  console.log(`  - ${errors.length} errors/warnings`);
  console.log(`  - ${duration}s execution time`);
  console.log(`  - Output: ${OUTPUT_FILE}`);

  if (errors.length > 0) {
    console.error('\nWarnings:');
    errors.forEach(err => console.error(`  - ${err}`));
  }

  // Check file size
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`\nIndex file size: ${sizeKB} KB`);

  if (stats.size > 5 * 1024) {
    console.warn('WARNING: Index file exceeds 5KB target');
  }
}

// Run generator
try {
  generateSkillIndex();
  process.exit(0);
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}
