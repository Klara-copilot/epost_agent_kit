#!/usr/bin/env node
/**
 * run-skill-report.cjs — Bridge for skill-creator generate_report.py
 *
 * Generates an HTML evaluation report and registers it in reports/index.json.
 *
 * Usage:
 *   node scripts/run-skill-report.cjs <loop-output.json> [--skill-name <name>]
 *   npm run skill:report -- <loop-output.json> [--skill-name <name>]
 *
 * Output: reports/YYMMDD-HHMM-{skill-name}-skill-eval.html
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
  return candidates.find(p => fs.existsSync(path.join(p, 'scripts', 'generate_report.py'))) || null;
}

function timestamp() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${yy}${MM}${dd}-${HH}${mm}`;
}

function isoDate() {
  return new Date().toISOString().slice(0, 10);
}

function extractSkillNameFromJson(jsonPath) {
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(raw);
    return data.skill_name || data.skillName || null;
  } catch { return null; }
}

function appendToReportsIndex(entry) {
  const indexPath = path.join(process.cwd(), 'reports', 'index.json');
  if (!fs.existsSync(indexPath)) return;
  try {
    const raw = fs.readFileSync(indexPath, 'utf8');
    const index = JSON.parse(raw);
    index.entries = index.entries || [];
    index.entries.unshift(entry);
    index.updatedAt = isoDate();
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');
  } catch (err) {
    console.warn(`Warning: could not update reports/index.json — ${err.message}`);
  }
}

function printUsage() {
  console.error('Usage: node run-skill-report.cjs <loop-output.json> [--skill-name <name>]');
  console.error('');
  console.error('Examples:');
  console.error('  node run-skill-report.cjs /tmp/ws/iteration-2/loop_output.json --skill-name cook');
  console.error('  node run-skill-report.cjs .claude/skills/plan/optimization-output.json');
  console.error('');
  console.error('Output: reports/YYMMDD-HHMM-{skill-name}-skill-eval.html');
  console.error('Prerequisites: python3, pyyaml (pip install pyyaml)');
}

// --- arg parsing -------------------------------------------------------------

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  printUsage();
  process.exit(args.length === 0 ? 1 : 0);
}

const jsonPath = args[0];
let skillName = null;
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--skill-name' && args[i + 1]) {
    skillName = args[++i];
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
  process.exit(1);
}

const resolvedJson = path.resolve(process.cwd(), jsonPath);
if (!fs.existsSync(resolvedJson)) {
  console.error(`Error: loop output JSON not found: ${resolvedJson}`);
  process.exit(1);
}

// Resolve skill name
if (!skillName) {
  skillName = extractSkillNameFromJson(resolvedJson);
}
if (!skillName) {
  // Fall back to parent directory name
  skillName = path.basename(path.dirname(resolvedJson));
}
const safeSkillName = skillName.replace(/[^a-z0-9-]/gi, '-').toLowerCase();

// Build output path
const ts = timestamp();
const reportFilename = `${ts}-${safeSkillName}-skill-eval.html`;
const reportsDir = path.join(process.cwd(), 'reports');
const reportPath = path.join(reportsDir, reportFilename);

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// --- spawn -------------------------------------------------------------------

const pyArgs = [
  '-m', 'scripts.generate_report',
  resolvedJson,
  '--static', reportPath,
  '--skill-name', skillName,
];

console.log(`Generating report: ${safeSkillName}`);
console.log(`Output: reports/${reportFilename}`);
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
  if (code === 0 && fs.existsSync(reportPath)) {
    // Register in reports/index.json
    const entry = {
      id: `skill-eval-${ts}-${safeSkillName}`,
      type: 'skill-eval',
      agent: 'skill-creator',
      title: `${skillName} — Skill Evaluation Report`,
      verdict: 'COMPLETE',
      path: `reports/${reportFilename}`,
      created: isoDate(),
    };
    appendToReportsIndex(entry);

    console.log('');
    console.log(`Report: reports/${reportFilename}`);
    console.log('Registered in reports/index.json');
    console.log(`Open: open ${reportPath}`);
  }
  process.exit(code ?? 0);
});
