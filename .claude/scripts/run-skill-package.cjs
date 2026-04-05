#!/usr/bin/env node
/**
 * run-skill-package.cjs — Bridge for skill-creator package_skill.py
 *
 * Packages a skill directory into a distributable .skill file.
 *
 * Usage:
 *   node scripts/run-skill-package.cjs <skill-path> [output-dir]
 *   npm run skill:package -- <skill-path> [output-dir]
 *
 * Default output dir: dist/skills/
 * Requires: python3, pyyaml
 */

'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// --- helpers -----------------------------------------------------------------

function findPython() {
  const { execSync } = require('child_process');
  for (const bin of ['python3', 'python']) {
    try {
      execSync(`${bin} --version`, { stdio: 'pipe', timeout: 3000 });
      return bin;
    } catch { /* try next */ }
  }
  return null;
}

function findSkillCreatorDir() {
  const candidates = [
    path.join(process.cwd(), '.claude', 'skills', 'skill-creator'),
    path.join(process.cwd(), 'packages', 'core', 'skills', 'skill-creator'),
  ];
  return candidates.find(p => fs.existsSync(path.join(p, 'scripts', 'package_skill.py'))) || null;
}

function printUsage() {
  console.error('Usage: node run-skill-package.cjs <skill-path> [output-dir]');
  console.error('');
  console.error('Examples:');
  console.error('  node run-skill-package.cjs .claude/skills/cook');
  console.error('  node run-skill-package.cjs .claude/skills/plan dist/skills/');
  console.error('');
  console.error('Default output dir: dist/skills/');
  console.error('Prerequisites: python3, pyyaml (pip install pyyaml)');
}

// --- arg parsing -------------------------------------------------------------

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  printUsage();
  process.exit(args.length === 0 ? 1 : 0);
}

const skillPath = args[0];
const outputDir = args[1] || 'dist/skills/';

// --- validation --------------------------------------------------------------

const python = findPython();
if (!python) {
  console.error('Error: python3 not found on PATH.');
  console.error('Install Python 3: https://python.org/ or via homebrew: brew install python');
  process.exit(1);
}

const skillCreatorDir = findSkillCreatorDir();
if (!skillCreatorDir) {
  console.error('Error: skill-creator directory not found.');
  process.exit(1);
}

const resolvedSkillPath = path.resolve(process.cwd(), skillPath);
if (!fs.existsSync(resolvedSkillPath)) {
  console.error(`Error: skill path not found: ${resolvedSkillPath}`);
  process.exit(1);
}

const resolvedOutputDir = path.resolve(process.cwd(), outputDir);
fs.mkdirSync(resolvedOutputDir, { recursive: true });

// --- spawn -------------------------------------------------------------------

const pyArgs = ['-m', 'scripts.package_skill', resolvedSkillPath, resolvedOutputDir];

const skillName = path.basename(resolvedSkillPath);
console.log(`Packaging skill: ${skillName}`);
console.log(`Output dir: ${resolvedOutputDir}`);
console.log('');

const child = spawn(python, pyArgs, {
  cwd: skillCreatorDir,
  stdio: 'inherit',
});

child.on('error', (err) => {
  if (err.code === 'ENOENT') {
    console.error(`Error: ${python} not found`);
  } else {
    console.error(`Error: ${err.message}`);
  }
  process.exit(1);
});

child.on('close', (code) => {
  if (code === 0) {
    // Find the generated .skill file
    try {
      const files = fs.readdirSync(resolvedOutputDir)
        .filter(f => f.endsWith('.skill') && f.startsWith(skillName));
      if (files.length > 0) {
        files.sort();
        const latest = files[files.length - 1];
        console.log('');
        console.log(`Packaged: ${path.join(resolvedOutputDir, latest)}`);
      }
    } catch { /* non-fatal */ }
  }
  process.exit(code ?? 0);
});
