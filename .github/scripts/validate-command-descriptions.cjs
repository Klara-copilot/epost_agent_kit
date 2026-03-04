#!/usr/bin/env node
/**
 * Validate Command Descriptions — ensures all command .md files have (ePost) prefix
 *
 * Scans command .md files in packages and .claude for frontmatter `description:` field.
 * Fails with exit code 1 if any command is missing the `(ePost)` prefix.
 *
 * Usage:
 *   node packages/core/scripts/validate-command-descriptions.cjs
 *   node packages/core/scripts/validate-command-descriptions.cjs --fix  # auto-add prefix
 *
 * Also runs against .claude/commands/ if present.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PREFIX = '(ePost)';
const FIX_MODE = process.argv.includes('--fix');

/**
 * Find all command .md files in packages/ and .claude/
 */
function findCommandFiles() {
  const dirs = ['packages/*/commands', '.claude/commands'];
  const files = [];

  for (const pattern of dirs) {
    try {
      const result = execSync(`find ${pattern} -name "*.md" 2>/dev/null`, {
        encoding: 'utf-8',
        cwd: process.cwd()
      }).trim();
      if (result) files.push(...result.split('\n'));
    } catch { /* dir may not exist */ }
  }

  return files;
}

/**
 * Extract frontmatter description from a markdown file
 * Returns { desc, line, startIndex, endIndex } or null
 */
function extractDescription(content) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return null;

  const fm = fmMatch[1];
  const lines = fm.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^description:\s*(.+)/);
    if (match) {
      return {
        desc: match[1].trim().replace(/^["']|["']$/g, ''),
        line: i + 2, // +2 for 1-indexed and the opening ---
        raw: lines[i]
      };
    }
  }

  return null;
}

function main() {
  const files = findCommandFiles();
  const missing = [];
  let fixed = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const info = extractDescription(content);
    if (!info) continue;

    if (!info.desc.includes(PREFIX)) {
      if (FIX_MODE) {
        // Auto-add prefix
        const newRaw = info.raw.replace(
          /^(description:\s*["']?)(.+)/,
          (_, pre, rest) => {
            // Handle quoted descriptions
            const cleanRest = rest.replace(/["']$/, '');
            const quote = rest.endsWith('"') ? '"' : rest.endsWith("'") ? "'" : '';
            return `${pre}${PREFIX} ${cleanRest}${quote}`;
          }
        );
        const newContent = content.replace(info.raw, newRaw);
        fs.writeFileSync(file, newContent);
        console.log(`  Fixed: ${file}:${info.line}`);
        fixed++;
      } else {
        missing.push({ file, line: info.line, desc: info.desc });
      }
    }
  }

  if (FIX_MODE) {
    console.log(`\n${fixed} file(s) fixed.`);
    process.exit(0);
  }

  if (missing.length > 0) {
    console.error(`\n  Missing "${PREFIX}" prefix in ${missing.length} command description(s):\n`);
    for (const m of missing) {
      console.error(`    ${m.file}:${m.line}`);
      console.error(`      description: ${m.desc}`);
      console.error(`      expected:    ${PREFIX} ${m.desc}\n`);
    }
    console.error(`  Run with --fix to auto-add the prefix.\n`);
    process.exit(1);
  }

  console.log(`  All ${files.length} command descriptions have "${PREFIX}" prefix.`);
  process.exit(0);
}

main();
