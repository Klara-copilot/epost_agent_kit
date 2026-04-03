'use strict';
/**
 * find-skill.cjs — entry point for /find-skill skill
 *
 * Usage:
 *   node find-skill.cjs [query]              unified: kernel + community (skills.sh)
 *   node find-skill.cjs --kernel [query]     agent-kernel only, scored
 *   node find-skill.cjs --community [query]  skills.sh only (npx skills find)
 *   node find-skill.cjs --install <name>     install from kernel or skills.sh
 *   node find-skill.cjs --refresh            force re-pull kernel cache
 *   All flags accept: --cwd <project-root>   (default: process.cwd())
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { syncKernel } = require('./lib/kernel-sync.cjs');
const { scanSkills } = require('./lib/scan-skills.cjs');
const { scoreQuality } = require('./lib/score-quality.cjs');
const { extractProjectContext } = require('./lib/project-context.cjs');
const { scoreRelevance } = require('./lib/score-relevance.cjs');

// --- Arg parsing --------------------------------------------------------
const args = process.argv.slice(2);
const has = f => args.includes(f);
const after = f => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : null; };

const cwd = after('--cwd') || process.cwd();
const forceRefresh = has('--refresh');

// First non-flag, non-value token is the query
const usedValues = new Set([after('--cwd'), after('--install')].filter(Boolean));
const query = args.find(a => !a.startsWith('--') && !usedValues.has(a)) || null;

// --- Dispatch -----------------------------------------------------------
if (has('--install')) {
  const name = after('--install');
  if (!name) { console.error('Usage: --install <name>'); process.exit(1); }
  runInstall(name, cwd);
} else if (has('--kernel')) {
  runKernel(query, cwd, forceRefresh);
} else if (has('--community')) {
  runCommunity(query);
} else {
  runUnified(query, cwd, forceRefresh);
}

// --- Flows --------------------------------------------------------------

function runKernel(query, cwd, refresh) {
  process.stderr.write(''); // flush
  const skillsDir = syncKernel(refresh);
  if (!skillsDir) {
    console.error('Kernel unavailable (SSH/network). Try: /find-skill --community <query>');
    process.exit(1);
  }

  const ctx = extractProjectContext(cwd);
  let skills = scanSkills(skillsDir);
  if (query) skills = skills.filter(s => matchesQuery(s, query));

  const results = sortByScore(skills, ctx);
  const label = query ? `matching "${query}"` : '(all)';
  console.log(`\nSkills in agent-kernel ${label}  (${results.length} found)\n`);
  printTable(results);
  if (results.length > 0) console.log('\nTo install: /find-skill --install <name>');
}

function runCommunity(query) {
  const cmd = query ? `npx skills find "${query}"` : 'npx skills find';
  console.log(`\nSearching skills.sh: ${cmd}\n`);
  try {
    execSync(cmd, { stdio: 'inherit', timeout: 30_000 });
    console.log('\nInstall with: npx skills add <owner/repo@skill-name>');
  } catch {
    console.error('skills.sh unavailable. Ensure npx is installed and network is reachable.');
    process.exit(1);
  }
}

function runUnified(query, cwd, refresh) {
  // Kernel results first (scored + ranked)
  const skillsDir = syncKernel(refresh);
  if (skillsDir) {
    const ctx = extractProjectContext(cwd);
    let skills = scanSkills(skillsDir);
    if (query) skills = skills.filter(s => matchesQuery(s, query));
    const results = sortByScore(skills, ctx);

    if (results.length > 0) {
      console.log(`\nKernel skills${query ? ` matching "${query}"` : ''}  (${results.length})\n`);
      printTable(results);
      console.log('\nTo install: /find-skill --install <name>');
    }
  } else {
    process.stderr.write('[warn] Kernel unavailable — kernel results skipped\n');
  }

  // Community (skills.sh) — only when a query is given to avoid dumping the full registry
  if (query) {
    console.log('\n--- skills.sh ---');
    runCommunity(query);
  } else {
    console.log('\nTip: provide a query to also search skills.sh — /find-skill <query>');
  }
}

function runInstall(name, cwd) {
  // Try kernel first
  const skillsDir = syncKernel(false);
  if (skillsDir) {
    const src = path.join(skillsDir, name);
    if (fs.existsSync(src)) {
      const dest = path.join(cwd, '.claude', 'skills', name);
      copyDir(src, dest);
      console.log(`\nInstalled "${name}" → .claude/skills/${name}/`);
      console.log('Active immediately in this session.');
      return;
    }
  }

  // Fall back to skills.sh
  console.log(`"${name}" not found in kernel — trying skills.sh...`);
  try {
    execSync(`npx skills add ${name} -y`, { stdio: 'inherit', timeout: 60_000 });
  } catch {
    console.error(`\nInstall failed. Search first: /find-skill --community ${name}`);
    process.exit(1);
  }
}

// --- Helpers ------------------------------------------------------------

function sortByScore(skills, ctx) {
  return skills
    .map(meta => ({
      meta,
      quality: scoreQuality(meta),
      relevance: scoreRelevance(meta, ctx),
    }))
    .sort((a, b) =>
      (b.relevance.score + b.quality.score) - (a.relevance.score + a.quality.score)
    );
}

function printTable(results) {
  const nameW = Math.max(24, ...results.map(r => r.meta.name.length)) + 2;
  console.log(`  ${'NAME'.padEnd(nameW)} QUALITY  RELEVANCE  DESCRIPTION`);
  console.log(`  ${'-'.repeat(nameW + 30)}`);
  for (const r of results) {
    const q = `${r.quality.score}/10`.padEnd(8);
    const rel = `${r.relevance.score}/10`.padEnd(10);
    const desc = truncate(r.meta.description, 55);
    console.log(`  ${r.meta.name.padEnd(nameW)} ${q} ${rel} ${desc}`);
  }
}

function matchesQuery(meta, q) {
  const lq = q.toLowerCase();
  return meta.name.toLowerCase().includes(lq)
    || (meta.description || '').toLowerCase().includes(lq)
    || meta.keywords.some(k => k.toLowerCase().includes(lq));
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name), d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}
