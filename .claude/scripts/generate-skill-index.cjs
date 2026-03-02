#!/usr/bin/env node
/**
 * Skill Index Generator
 *
 * Scans SKILL.md files for YAML frontmatter and generates compact skill-index.json
 * Usage: node generate-skill-index.cjs
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = process.argv[2] || path.join(__dirname, '../skills');
const OUTPUT_FILE = path.join(SKILLS_DIR, 'skill-index.json');

/**
 * Category taxonomy — maps skill names to categories
 */
const CATEGORY_MAP = {
  // frontend-web
  'web-frontend': 'frontend-web',
  'web-nextjs': 'frontend-web',
  'web-api-routes': 'frontend-web',
  'web-modules': 'frontend-web',
  'web-prototype': 'frontend-web',
  'web-rag': 'frontend-web',

  // mobile-development
  'ios-development': 'mobile-development',
  'ios-ui-lib': 'mobile-development',
  'ios-rag': 'mobile-development',
  'android-development': 'mobile-development',
  'android-ui-lib': 'mobile-development',

  // backend-development
  'backend-javaee': 'backend-development',
  'backend-databases': 'backend-development',

  // design-system
  'web-figma': 'design-system',
  'web-figma-variables': 'design-system',
  'web-ui-lib': 'design-system',
  'web-ui-lib-dev': 'design-system',

  // accessibility
  'a11y': 'accessibility',
  'ios-a11y': 'accessibility',
  'android-a11y': 'accessibility',
  'web-a11y': 'accessibility',
  'audit-a11y': 'accessibility',
  'audit-close-a11y': 'accessibility',
  'fix-a11y': 'accessibility',
  'review-a11y': 'accessibility',

  // development-tools (workflow skills)
  'cook': 'development-tools',
  'cook-fast': 'development-tools',
  'cook-parallel': 'development-tools',
  'fix': 'development-tools',
  'fix-deep': 'development-tools',
  'fix-ci': 'development-tools',
  'fix-ui': 'development-tools',
  'plan': 'development-tools',
  'plan-fast': 'development-tools',
  'plan-deep': 'development-tools',
  'plan-parallel': 'development-tools',
  'plan-validate': 'development-tools',
  'test': 'development-tools',
  'debug': 'development-tools',
  'scout': 'development-tools',
  'bootstrap': 'development-tools',
  'bootstrap-fast': 'development-tools',
  'bootstrap-parallel': 'development-tools',
  'git-commit': 'development-tools',
  'git-push': 'development-tools',
  'git-pr': 'development-tools',
  'review-code': 'development-tools',
  'review-improvements': 'development-tools',
  'docs-init': 'development-tools',
  'docs-update': 'development-tools',
  'docs-component': 'development-tools',
  'convert': 'development-tools',
  'simulator': 'development-tools',
  'epost': 'development-tools',
  'auto-improvement': 'development-tools',

  // analysis-reasoning
  'core': 'analysis-reasoning',
  'code-review': 'analysis-reasoning',
  'debugging': 'analysis-reasoning',
  'planning': 'analysis-reasoning',
  'problem-solving': 'analysis-reasoning',
  'error-recovery': 'analysis-reasoning',
  'sequential-thinking': 'analysis-reasoning',
  'research': 'analysis-reasoning',
  'docs-seeker': 'analysis-reasoning',
  'doc-coauthoring': 'analysis-reasoning',
  'knowledge-base': 'analysis-reasoning',
  'knowledge-retrieval': 'analysis-reasoning',
  'knowledge-capture': 'analysis-reasoning',
  'repomix': 'analysis-reasoning',
  'hub-context': 'analysis-reasoning',
  'skill-discovery': 'analysis-reasoning',
  'data-store': 'analysis-reasoning',
  'verification-before-completion': 'analysis-reasoning',
  'receiving-code-review': 'analysis-reasoning',
  'subagent-driven-development': 'analysis-reasoning',

  // infrastructure
  'infra-cloud': 'infrastructure',
  'infra-docker': 'infrastructure',

  // kit-authoring
  'kit-agents': 'kit-authoring',
  'kit-agent-development': 'kit-authoring',
  'kit-skill-development': 'kit-authoring',
  'kit-commands': 'kit-authoring',
  'kit-hooks': 'kit-authoring',
  'kit-cli': 'kit-authoring',
  'kit-add-agent': 'kit-authoring',
  'kit-add-skill': 'kit-authoring',
  'kit-add-command': 'kit-authoring',
  'kit-add-hook': 'kit-authoring',
  'kit-optimize-skill': 'kit-authoring',
  'cli-cook': 'kit-authoring',
  'cli-doctor': 'kit-authoring',
  'cli-test': 'kit-authoring',

  // business-domains
  'domain-b2b': 'business-domains',
  'domain-b2c': 'business-domains',
};

/**
 * Connection graph — defines inter-skill relationships
 * Types: extends (specialization), requires (must co-load),
 *        enhances (optional boost), conflicts (mutually exclusive)
 */
const CONNECTION_MAP = {
  // Platform-A11y extends
  'ios-a11y':     { extends: ['a11y'] },
  'android-a11y': { extends: ['a11y'] },
  'web-a11y':     { extends: ['a11y'] },

  // Platform development enhances
  'web-nextjs':     { enhances: ['web-frontend'] },
  'web-api-routes': { enhances: ['web-frontend'] },
  'web-modules':    { enhances: ['web-frontend'] },
  'ios-ui-lib':     { enhances: ['ios-development'] },
  'android-ui-lib': { enhances: ['android-development'] },
  'backend-databases': { enhances: ['backend-javaee'] },

  // Design system requires
  'web-ui-lib-dev':     { requires: ['web-ui-lib', 'web-figma'] },
  'web-figma-variables': { requires: ['web-figma'] },
  'docs-component':     { requires: ['web-ui-lib', 'web-figma'] },

  // Knowledge enhances
  'problem-solving':     { enhances: ['debugging'] },
  'sequential-thinking': { enhances: ['debugging'] },
  'error-recovery':      { enhances: ['debugging'] },
  'docs-seeker':         { enhances: ['research'] },
  'knowledge-retrieval': { enhances: ['research', 'planning'] },
  'knowledge-capture':   { requires: ['knowledge-base'] },

  // Kit requires
  'kit-add-agent':     { requires: ['kit-agent-development'] },
  'kit-add-skill':     { requires: ['kit-skill-development'] },
  'kit-add-command':   { requires: ['kit-commands'] },
  'kit-add-hook':      { requires: ['kit-hooks'] },
  'kit-optimize-skill': { requires: ['kit-skill-development'] },

  // Workflow variant conflicts
  'cook-fast':     { conflicts: ['cook-parallel'] },
  'cook-parallel': { conflicts: ['cook-fast'] },
  'plan-fast':     { conflicts: ['plan-deep', 'plan-parallel'] },
  'plan-deep':     { conflicts: ['plan-fast', 'plan-parallel'] },
  'plan-parallel': { conflicts: ['plan-fast', 'plan-deep'] },
  'bootstrap-fast':     { conflicts: ['bootstrap-parallel'] },
  'bootstrap-parallel': { conflicts: ['bootstrap-fast'] },
  'fix':      { conflicts: ['fix-deep'] },
  'fix-deep': { conflicts: ['fix'] },

  // RAG enhances
  'web-rag': { enhances: ['web-frontend'] },
  'ios-rag': { enhances: ['ios-development'] },

  // Cross-cutting enhances
  'receiving-code-review':         { enhances: ['code-review'] },
  'subagent-driven-development':   { enhances: ['planning'] },
  'hub-context':                   { enhances: ['skill-discovery'] },
  'verification-before-completion': { enhances: ['code-review'] },
  'auto-improvement':              { enhances: ['skill-discovery'] },
  'data-store':                    { enhances: ['knowledge-base'] },
  'repomix':                       { enhances: ['research'] },
  'doc-coauthoring':               { enhances: ['planning'] },

  // Workflow → base skill enhances
  'cook':          { enhances: ['planning'] },
  'fix-ci':        { enhances: ['debugging'] },
  'fix-ui':        { enhances: ['debugging'] },
  'debug':         { enhances: ['debugging'] },
  'test':          { enhances: ['code-review'] },
  'review-code':   { enhances: ['code-review'] },
  'plan':          { enhances: ['planning'] },
  'plan-validate': { enhances: ['planning'] },
  'scout':         { enhances: ['research'] },

  // A11y workflow skills extend base
  'audit-a11y':       { extends: ['a11y'] },
  'audit-close-a11y': { extends: ['a11y'] },
  'fix-a11y':         { extends: ['a11y'] },
  'review-a11y':      { extends: ['a11y'] },
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

  console.log('Scanning for SKILL.md files...');
  const skillFiles = findSkillFiles(SKILLS_DIR);
  console.log(`Found ${skillFiles.length} skill files`);

  const skills = [];
  const errors = [];

  for (const filePath of skillFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const metadata = extractFrontmatter(content);

      if (!metadata) {
        errors.push(`No frontmatter: ${path.relative(SKILLS_DIR, filePath)}`);
        continue;
      }

      // Validate required fields
      if (!metadata.name) {
        errors.push(`Missing 'name': ${path.relative(SKILLS_DIR, filePath)}`);
        continue;
      }

      // Build skill entry with relative path
      const relativePath = path.relative(SKILLS_DIR, filePath);
      const name = metadata.name;
      const connections = CONNECTION_MAP[name] || {};
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
        path: relativePath
      };

      skills.push(skill);
    } catch (error) {
      errors.push(`Error processing ${path.relative(SKILLS_DIR, filePath)}: ${error.message}`);
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
