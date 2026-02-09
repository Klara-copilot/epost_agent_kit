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
      const skill = {
        name: metadata.name,
        description: metadata.description || '',
        keywords: metadata.keywords || [],
        platforms: metadata.platforms || ['all'],
        triggers: metadata.triggers || [],
        'agent-affinity': metadata['agent-affinity'] || [],
        path: relativePath
      };

      skills.push(skill);
    } catch (error) {
      errors.push(`Error processing ${path.relative(SKILLS_DIR, filePath)}: ${error.message}`);
    }
  }

  // Sort by name for consistency
  skills.sort((a, b) => a.name.localeCompare(b.name));

  // Write index
  const index = {
    generated: new Date().toISOString(),
    version: '1.0.0',
    count: skills.length,
    skills
  };

  // Pretty JSON for readability (still efficient for LLMs)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), 'utf-8');

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\nGenerated skill-index.json:`);
  console.log(`  - ${skills.length} skills indexed`);
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
