#!/usr/bin/env node
/**
 * Kit Verify — structural health check for epost_agent_kit
 *
 * Checks:
 *   1. frontmatter   — all SKILL.md in packages/ have required name + description
 *   2. naming        — all skill dirs in packages/ are kebab-case
 *   3. pkg-declared  — every skill in package.yaml provides.skills has a real directory
 *   4. pkg-installed — every .claude/skills/ dir traces back to a packages/ source
 *   5. agent-refs    — every skill in agent skills: frontmatter exists in skill-index
 *   6. index-sync    — skill-index.json is in sync with .claude/skills/ contents
 *
 * Exit: 0 = all pass | 1 = warnings only | 2 = one or more errors
 * Usage: node .claude/scripts/verify.cjs [--json]
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Paths ─────────────────────────────────────────────────────────────────────

/**
 * Detect repo root by walking up from __dirname until we find a directory
 * containing both packages/ and .claude/ — works whether run from
 * packages/core/scripts/ or .claude/scripts/
 */
function findRepoRoot() {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'packages')) && fs.existsSync(path.join(dir, '.claude'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  throw new Error(`Cannot find repo root from ${__dirname}`);
}

const ROOT = findRepoRoot();
const PACKAGES_DIR = path.join(ROOT, 'packages');
const CLAUDE_SKILLS_DIR = path.join(ROOT, '.claude/skills');
const CLAUDE_AGENTS_DIR = path.join(ROOT, '.claude/agents');
const SKILL_INDEX_FILE = path.join(CLAUDE_SKILLS_DIR, 'skill-index.json');

const JSON_MODE = process.argv.includes('--json');

// ── Result helpers ─────────────────────────────────────────────────────────────

const results = { errors: [], warnings: [], passes: [] };

function pass(check, msg)  { results.passes.push({ check, msg }); }
function warn(check, msg)  { results.warnings.push({ check, msg }); }
function error(check, msg) { results.errors.push({ check, msg }); }

// ── Minimal YAML frontmatter parser ───────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  const meta = {};
  let currentKey = null;
  for (const line of match[1].split('\n')) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('-') && currentKey) {
      const val = t.slice(1).trim().replace(/^["']|["']$/g, '');
      if (!meta[currentKey]) meta[currentKey] = [];
      if (val) meta[currentKey].push(val);
      continue;
    }
    const ci = t.indexOf(':');
    if (ci === -1) continue;
    const key = t.slice(0, ci).trim();
    let val = t.slice(ci + 1).trim().replace(/^["']|["']$/g, '').replace(/["']\s*$/, '');
    if (val.startsWith('[') && val.endsWith(']')) {
      meta[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else if (val) {
      meta[key] = val;
    } else {
      currentKey = key;
    }
  }
  return meta;
}

// ── Loaders ────────────────────────────────────────────────────────────────────

/** Find all SKILL.md files under a directory */
function findSkillFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) findSkillFiles(full, list);
    else if (entry === 'SKILL.md') list.push(full);
  }
  return list;
}

/** Load all package.yaml files → [{ pkg, yaml }] */
function loadPackageManifests() {
  return fs.readdirSync(PACKAGES_DIR)
    .map(pkg => path.join(PACKAGES_DIR, pkg, 'package.yaml'))
    .filter(f => fs.existsSync(f))
    .map(f => ({ pkg: path.basename(path.dirname(f)), yaml: parsePackageYaml(f) }));
}

function parsePackageYaml(file) {
  const content = fs.readFileSync(file, 'utf-8');
  const skills = [];
  let inSkills = false;
  for (const line of content.split('\n')) {
    if (/^\s{2,4}skills:/.test(line)) { inSkills = true; continue; }
    if (inSkills) {
      const m = line.match(/^\s*-\s+(\S+)/);
      if (m) skills.push(m[1]);
      else if (/^\S/.test(line) || /^\s{0,1}\w/.test(line)) inSkills = false;
    }
  }
  return { skills };
}

/** Load agent frontmatter from .claude/agents/*.md → [{ agent, skills }] */
function loadAgentSkillRefs() {
  if (!fs.existsSync(CLAUDE_AGENTS_DIR)) return [];
  return fs.readdirSync(CLAUDE_AGENTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const content = fs.readFileSync(path.join(CLAUDE_AGENTS_DIR, f), 'utf-8');
      const meta = parseFrontmatter(content);
      const skills = meta?.skills || [];
      // skills can be array or inline [a,b,c] string already parsed
      return { agent: f.replace('.md', ''), skills: Array.isArray(skills) ? skills : [] };
    });
}

/** Load skill-index.json → { count, skillNames: Set } */
function loadSkillIndex() {
  if (!fs.existsSync(SKILL_INDEX_FILE)) return null;
  const idx = JSON.parse(fs.readFileSync(SKILL_INDEX_FILE, 'utf-8'));
  // Use skills.length — reliable across v1.0.0 (uses `total`) and v2.0.0 (uses `count`)
  return { count: idx.skills.length, skillNames: new Set(idx.skills.map(s => s.name)) };
}

// ── Checks ─────────────────────────────────────────────────────────────────────

/** 1. Frontmatter — all SKILL.md in packages/ have name + description */
function checkFrontmatter() {
  const files = findSkillFiles(PACKAGES_DIR);
  let bad = 0;
  for (const f of files) {
    const meta = parseFrontmatter(fs.readFileSync(f, 'utf-8'));
    const rel = path.relative(ROOT, f);
    if (!meta) { error('frontmatter', `No frontmatter: ${rel}`); bad++; continue; }
    if (!meta.name) { error('frontmatter', `Missing name: ${rel}`); bad++; }
    if (!meta.description) { warn('frontmatter', `Missing description: ${rel}`); }
  }
  if (bad === 0) pass('frontmatter', `${files.length} SKILL.md files have valid frontmatter`);
}

/** 2. Naming — skill dirs in packages/ are kebab-case */
function checkNaming() {
  const kebab = /^[a-z][a-z0-9-]*$/;
  let bad = 0;
  for (const pkg of fs.readdirSync(PACKAGES_DIR)) {
    const skillsDir = path.join(PACKAGES_DIR, pkg, 'skills');
    if (!fs.existsSync(skillsDir)) continue;
    for (const skill of fs.readdirSync(skillsDir)) {
      // Skip hidden files (.DS_Store), JSON files, and non-directories
      if (skill.startsWith('.') || skill.endsWith('.json')) continue;
      const full = path.join(skillsDir, skill);
      if (!fs.statSync(full).isDirectory()) continue;
      if (!kebab.test(skill)) {
        error('naming', `Not kebab-case: packages/${pkg}/skills/${skill}`);
        bad++;
      }
    }
  }
  if (bad === 0) pass('naming', 'All skill directory names are kebab-case');
}

/** 3. Pkg-declared — every skill in package.yaml provides.skills has a directory */
function checkPkgDeclared() {
  const manifests = loadPackageManifests();
  let missing = 0;
  for (const { pkg, yaml } of manifests) {
    for (const skill of yaml.skills) {
      const dir = path.join(PACKAGES_DIR, pkg, 'skills', skill);
      if (!fs.existsSync(dir)) {
        error('pkg-declared', `packages/${pkg}/package.yaml declares '${skill}' but packages/${pkg}/skills/${skill}/ not found`);
        missing++;
      }
    }
  }
  if (missing === 0) {
    const total = manifests.reduce((n, m) => n + m.yaml.skills.length, 0);
    pass('pkg-declared', `All ${total} declared skills have directories`);
  }
}

/** 4. Pkg-installed — every .claude/skills/ dir (except skill-index.json) has a packages/ source */
function checkPkgInstalled() {
  if (!fs.existsSync(CLAUDE_SKILLS_DIR)) { warn('pkg-installed', '.claude/skills/ not found — run epost-kit init'); return; }

  // Build a set of all skill names that exist in packages/
  const sourcedSkills = new Set();
  for (const pkg of fs.readdirSync(PACKAGES_DIR)) {
    const skillsDir = path.join(PACKAGES_DIR, pkg, 'skills');
    if (!fs.existsSync(skillsDir)) continue;
    for (const skill of fs.readdirSync(skillsDir)) sourcedSkills.add(skill);
  }

  let orphans = 0;
  for (const entry of fs.readdirSync(CLAUDE_SKILLS_DIR)) {
    if (entry === 'skill-index.json') continue; // index file, not a skill dir
    const full = path.join(CLAUDE_SKILLS_DIR, entry);
    if (!fs.statSync(full).isDirectory()) continue;
    if (!sourcedSkills.has(entry)) {
      warn('pkg-installed', `.claude/skills/${entry} has no source in packages/ — stale install?`);
      orphans++;
    }
  }
  if (orphans === 0) pass('pkg-installed', 'All .claude/skills/ dirs trace back to packages/');
}

/** 5. Agent-refs — every skill in agent skills: frontmatter exists in skill-index */
function checkAgentRefs() {
  const index = loadSkillIndex();
  if (!index) { warn('agent-refs', 'skill-index.json not found — run generate-skill-index.cjs'); return; }

  const agents = loadAgentSkillRefs();
  let bad = 0;
  for (const { agent, skills } of agents) {
    for (const skill of skills) {
      if (!index.skillNames.has(skill)) {
        error('agent-refs', `${agent}: skills[] references '${skill}' — not in skill-index`);
        bad++;
      }
    }
  }
  if (bad === 0) {
    const total = agents.reduce((n, a) => n + a.skills.length, 0);
    pass('agent-refs', `All ${total} agent skill refs resolve in skill-index`);
  }
}

/** 6. Eval-coverage — every user-invocable skill has evals/eval-set.json */
function checkEvalCoverage() {
  let missing = 0;
  let total = 0;

  for (const pkg of fs.readdirSync(PACKAGES_DIR)) {
    const skillsDir = path.join(PACKAGES_DIR, pkg, 'skills');
    if (!fs.existsSync(skillsDir)) continue;

    for (const skillName of fs.readdirSync(skillsDir)) {
      const skillDir = path.join(skillsDir, skillName);
      if (!fs.statSync(skillDir).isDirectory()) continue;
      const skillMd = path.join(skillDir, 'SKILL.md');
      if (!fs.existsSync(skillMd)) continue;

      // Only require eval-set for user-invocable skills (skip user-invocable: false)
      const content = fs.readFileSync(skillMd, 'utf8');
      if (/^user-invocable:\s*false/m.test(content)) continue;

      total++;
      const evalSet = path.join(skillDir, 'evals', 'eval-set.json');
      if (!fs.existsSync(evalSet)) {
        warn('eval-coverage', `${pkg}/skills/${skillName} missing evals/eval-set.json`);
        missing++;
      }
    }
  }

  if (missing === 0) pass('eval-coverage', `All ${total} user-invocable skills have eval-set.json`);
}

/** 7. Index-sync — skill-index.json count matches .claude/skills/ dirs */
function checkIndexSync() {
  const index = loadSkillIndex();
  if (!index) { warn('index-sync', 'skill-index.json not found'); return; }

  const claudeDirs = fs.existsSync(CLAUDE_SKILLS_DIR)
    ? fs.readdirSync(CLAUDE_SKILLS_DIR).filter(e => {
        if (e === 'skill-index.json') return false;
        return fs.statSync(path.join(CLAUDE_SKILLS_DIR, e)).isDirectory();
      })
    : [];

  if (index.count !== claudeDirs.length) {
    warn('index-sync', `skill-index.json count=${index.count} but .claude/skills/ has ${claudeDirs.length} dirs — run generate-skill-index.cjs`);
  } else {
    pass('index-sync', `skill-index.json count (${index.count}) matches .claude/skills/ dirs`);
  }

  // Check for skills in index missing from .claude/
  const claudeSet = new Set(claudeDirs);
  for (const name of index.skillNames) {
    if (!claudeSet.has(name)) {
      warn('index-sync', `skill-index references '${name}' but .claude/skills/${name}/ not found`);
    }
  }
}

// ── Runner ─────────────────────────────────────────────────────────────────────

function run() {
  checkFrontmatter();
  checkNaming();
  checkPkgDeclared();
  checkPkgInstalled();
  checkAgentRefs();
  checkEvalCoverage();
  checkIndexSync();

  if (JSON_MODE) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    const { errors: errs, warnings: warns, passes } = results;

    for (const p of passes)  console.log(`  ✓ [${p.check}] ${p.msg}`);
    for (const w of warns)   console.log(`  ⚠ [${w.check}] ${w.msg}`);
    for (const e of errs)    console.log(`  ✗ [${e.check}] ${e.msg}`);

    console.log(`\n${passes.length} passed · ${warns.length} warnings · ${errs.length} errors`);

    if (errs.length === 0 && warns.length === 0) console.log('\nKit is healthy.');
    else if (errs.length === 0) console.log('\nKit has warnings — no blockers.');
    else console.log('\nKit has errors — fix before shipping.');
  }

  // Exit 0 for clean or warnings-only (CC UI shows non-zero as red error)
  // Exit 1 only for hard errors that block shipping
  if (results.errors.length > 0) process.exit(1);
  process.exit(0);
}

run();
