#!/usr/bin/env node
/**
 * run-skill-eval.cjs — Bridge for skill-creator run_eval.py
 *
 * Usage:
 *   node scripts/run-skill-eval.cjs <skill-path> [--model <id>]
 *   npm run skill:eval -- <skill-path> [--model <id>]
 *
 * Requires: python3, pyyaml, claude CLI on PATH
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
  return candidates.find(p => fs.existsSync(path.join(p, 'scripts', 'run_eval.py'))) || null;
}

function printUsage() {
  console.error('Usage: node run-skill-eval.cjs <skill-path> [--model <model-id>]');
  console.error('');
  console.error('Examples:');
  console.error('  node run-skill-eval.cjs .claude/skills/cook');
  console.error('  node run-skill-eval.cjs .claude/skills/plan --model claude-sonnet-4-6');
  console.error('');
  console.error('Prerequisites: python3, pyyaml (pip install pyyaml), claude CLI');
}

// --- arg parsing -------------------------------------------------------------

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  printUsage();
  process.exit(args.length === 0 ? 1 : 0);
}

const skillPath = args[0];
let model = null;
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--model' && args[i + 1]) {
    model = args[++i];
  }
}

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
  console.error('Expected at .claude/skills/skill-creator or packages/core/skills/skill-creator');
  process.exit(1);
}

const resolvedSkillPath = path.resolve(process.cwd(), skillPath);
if (!fs.existsSync(resolvedSkillPath)) {
  console.error(`Error: skill path not found: ${resolvedSkillPath}`);
  process.exit(1);
}

// --- spawn -------------------------------------------------------------------

const pyArgs = ['-m', 'scripts.run_eval', '--skill-path', resolvedSkillPath];
if (model) pyArgs.push('--model', model);

console.log(`Running skill eval: ${path.basename(resolvedSkillPath)}`);
if (model) console.log(`Model: ${model}`);
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
  process.exit(code ?? 0);
});
