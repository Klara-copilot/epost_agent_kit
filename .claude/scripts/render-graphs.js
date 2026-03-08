#!/usr/bin/env node

/**
 * render-graphs.js — Render all DOT flowcharts in skill references to SVG.
 *
 * Requires: graphviz (brew install graphviz)
 * Usage: node packages/core/scripts/render-graphs.js
 */

const { execSync } = require('child_process');
const { readdirSync, existsSync } = require('fs');
const { join, basename } = require('path');
const { globSync } = require('fs').globSync ? require('fs') : { globSync: null };

// Find all .dot files under packages/core/skills/*/references/
const skillsDir = join(__dirname, '..', 'skills');
const dotFiles = [];

function findDotFiles(dir) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        findDotFiles(fullPath);
      } else if (entry.name.endsWith('.dot')) {
        dotFiles.push(fullPath);
      }
    }
  } catch (e) {
    // Skip inaccessible directories
  }
}

findDotFiles(skillsDir);

if (dotFiles.length === 0) {
  console.log('No .dot files found in skill references.');
  process.exit(0);
}

// Check graphviz is installed
try {
  execSync('which dot', { stdio: 'pipe' });
} catch {
  console.error('Error: graphviz not installed. Run: brew install graphviz');
  process.exit(1);
}

// Render each file
let rendered = 0;
let failed = 0;

for (const dotFile of dotFiles) {
  const svgFile = dotFile.replace(/\.dot$/, '.svg');
  try {
    execSync(`dot -Tsvg "${dotFile}" -o "${svgFile}"`, { stdio: 'pipe' });
    console.log(`✓ ${basename(dotFile)} → ${basename(svgFile)}`);
    rendered++;
  } catch (e) {
    console.error(`✗ ${basename(dotFile)}: ${e.message}`);
    failed++;
  }
}

console.log(`\nRendered: ${rendered}, Failed: ${failed}`);
