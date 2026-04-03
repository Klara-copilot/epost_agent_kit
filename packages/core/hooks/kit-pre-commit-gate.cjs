#!/usr/bin/env node
/**
 * kit-pre-commit-gate.cjs — PreToolUse(Bash) hook
 *
 * Intercepts `git commit` commands and runs the kit validation pipeline:
 *   1. Build   — generate-skill-index.cjs (ensures index is fresh)
 *   2. Verify  — verify.cjs structural checks (frontmatter, naming, pkg, agent-refs, eval-coverage, index-sync)
 *   3. Audit   — CSO static checks on all SKILL.md in packages/
 *   4. Validate— quick_validate.py batch on all SKILL.md in packages/ (if python available)
 *
 * Kit-repo guard: only runs when packages/core/scripts/verify.cjs exists.
 * This file is unique to the kit development repo — installed projects won't have it.
 *
 * Exit codes:
 *   0 = allow (all checks pass, warnings only, or non-kit repo)
 *   2 = block (hard errors found — commit blocked)
 *
 * Bypass:
 *   --skip-kit-gate in the git commit command
 *   EPOST_SKIP_KIT_GATE=1 environment variable
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findRepoRoot() {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'packages')) && fs.existsSync(path.join(dir, '.claude'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

function isKitDevRepo(root) {
  return root && fs.existsSync(path.join(root, 'packages', 'core', 'scripts', 'verify.cjs'));
}

function findPython() {
  for (const bin of ['python3', 'python']) {
    try { execSync(`${bin} --version`, { stdio: 'pipe', timeout: 3000 }); return bin; } catch { /* try next */ }
  }
  return null;
}

/** Collect all SKILL.md paths under packages/ */
function findSkillMds(root) {
  const results = [];
  const pkgsDir = path.join(root, 'packages');
  for (const pkg of fs.readdirSync(pkgsDir)) {
    const skillsDir = path.join(pkgsDir, pkg, 'skills');
    if (!fs.existsSync(skillsDir)) continue;
    for (const skill of fs.readdirSync(skillsDir)) {
      const md = path.join(skillsDir, skill, 'SKILL.md');
      if (fs.existsSync(md)) results.push({ pkg, skill, path: md, dir: path.dirname(md) });
    }
  }
  return results;
}

// ─── CSO batch check ──────────────────────────────────────────────────────────

const TRIGGER_PATTERNS = [/\buse when\b/i, /\btriggers? when\b/i, /\binvoke when\b/i];

function csoCheck(descriptionRaw) {
  const desc = (descriptionRaw || '').trim();
  const issues = [];
  const lead = desc.slice(0, 250);
  if (!TRIGGER_PATTERNS.some(p => p.test(lead))) {
    issues.push('missing trigger phrasing ("Use when...") in first 250 chars');
  }
  const quoted = desc.match(/["'][^"']{3,}["']/g) || [];
  const useWhenIdx = desc.search(/use when\b/i);
  const afterUW = useWhenIdx >= 0 ? desc.slice(useWhenIdx) : '';
  const commas = (afterUW.match(/,/g) || []).length;
  if (quoted.length < 2 && commas < 1) {
    issues.push('no concrete trigger phrases (add ≥2 quoted examples or comma-listed triggers)');
  }
  return issues;
}

function extractDescription(skillMdPath) {
  try {
    const content = fs.readFileSync(skillMdPath, 'utf8');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) return null;
    const m = fm[1].match(/^description:\s*["']?([\s\S]*?)["']?\s*(?=\n\w|\n$|$)/m);
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
  } catch { return null; }
}

function isUserInvocable(skillMdPath) {
  try {
    return !/^user-invocable:\s*false/m.test(fs.readFileSync(skillMdPath, 'utf8'));
  } catch { return true; }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

try {
  // Parse stdin
  let data;
  try {
    const input = fs.readFileSync(0, 'utf-8');
    data = JSON.parse(input);
  } catch { process.exit(0); }

  if (data.tool_name !== 'Bash') process.exit(0);

  const command = (data.tool_input && data.tool_input.command) || '';
  if (!/\bgit\s+commit\b/.test(command)) process.exit(0);

  // Bypass flags
  if (/--skip-kit-gate/.test(command) || process.env.EPOST_SKIP_KIT_GATE === '1') {
    process.stderr.write('kit-pre-commit-gate: skipped\n');
    process.exit(0);
  }

  // Kit-repo guard
  const root = findRepoRoot();
  if (!isKitDevRepo(root)) process.exit(0);

  process.stderr.write('kit-pre-commit-gate: running kit validation pipeline...\n');

  const errors   = [];
  const warnings = [];

  // ── Step 1: Build — regenerate skill index ─────────────────────────────────
  process.stderr.write('  [1/4] build: regenerating skill index...\n');
  try {
    execSync(`node "${path.join(root, '.claude', 'scripts', 'generate-skill-index.cjs')}"`, {
      cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 30000,
    });
  } catch (e) {
    warnings.push(`build: generate-skill-index failed — ${(e.stderr || e.message || '').slice(0, 100)}`);
  }

  // ── Step 2: Verify — structural checks ─────────────────────────────────────
  process.stderr.write('  [2/4] verify: running verify.cjs...\n');
  const verifyResult = spawnSync('node', [path.join(root, '.claude', 'scripts', 'verify.cjs')], {
    cwd: root, encoding: 'utf8', timeout: 30000,
  });
  const verifyOutput = (verifyResult.stdout || '') + (verifyResult.stderr || '');
  if (verifyResult.status !== 0) {
    // verify.cjs exits 1 only for hard errors
    const errLines = verifyOutput.split('\n').filter(l => l.includes('✗'));
    for (const l of errLines) errors.push(`verify: ${l.trim()}`);
  }
  const warnLines = verifyOutput.split('\n').filter(l => l.includes('⚠'));
  for (const l of warnLines) warnings.push(`verify: ${l.trim()}`);

  // ── Step 3: Audit — CSO static checks ──────────────────────────────────────
  process.stderr.write('  [3/4] audit: CSO checks on all SKILL.md...\n');
  const skills = findSkillMds(root);
  for (const { pkg, skill, path: mdPath } of skills) {
    if (!isUserInvocable(mdPath)) continue; // skip passive reference skills
    const desc = extractDescription(mdPath);
    if (!desc) continue;
    const issues = csoCheck(desc);
    for (const issue of issues) warnings.push(`audit: ${pkg}/skills/${skill} — ${issue}`);
  }

  // ── Step 4: Validate — quick_validate.py batch ─────────────────────────────
  process.stderr.write('  [4/4] validate: quick_validate.py on all SKILL.md...\n');
  const python = findPython();
  const validateScript = path.join(root, '.claude', 'skills', 'skill-creator', 'scripts', 'quick_validate.py');
  if (python && fs.existsSync(validateScript)) {
    for (const { pkg, skill, dir: skillDir } of skills) {
      const result = spawnSync(python, [validateScript, skillDir], {
        encoding: 'utf8', timeout: 8000,
      });
      if (result.status !== 0) {
        const msg = (result.stdout || result.stderr || '').trim();
        // Only hard errors block — unexpected ePost fields are expected (classified as info/warning)
        if (/Missing '(name|description)'|No YAML frontmatter|Invalid YAML|SKILL\.md not found/i.test(msg)) {
          errors.push(`validate: ${pkg}/skills/${skill} — ${msg}`);
        } else if (!/Unexpected key/i.test(msg)) {
          // Unknown error type
          warnings.push(`validate: ${pkg}/skills/${skill} — ${msg}`);
        }
        // Unexpected keys from ePost extensions → silently skip (expected)
      }
    }
  } else {
    warnings.push('validate: quick_validate.py skipped (python3 or script not found)');
  }

  // ── Result ──────────────────────────────────────────────────────────────────
  if (errors.length > 0) {
    process.stderr.write('\n❌ kit-pre-commit-gate: COMMIT BLOCKED — fix errors before committing:\n');
    for (const e of errors) process.stderr.write(`  ✗ ${e}\n`);
    if (warnings.length > 0) {
      process.stderr.write('\nWarnings (non-blocking):\n');
      for (const w of warnings) process.stderr.write(`  ⚠ ${w}\n`);
    }
    process.stderr.write('\nTo bypass: add --skip-kit-gate or set EPOST_SKIP_KIT_GATE=1\n');
    process.exit(2);
  }

  if (warnings.length > 0) {
    process.stderr.write('\n⚠ kit-pre-commit-gate: warnings (commit allowed):\n');
    for (const w of warnings) process.stderr.write(`  ⚠ ${w}\n`);
  }

  process.stderr.write(`\n✓ kit-pre-commit-gate: all checks passed (${skills.length} skills)\n`);
  process.exit(0);

} catch (e) {
  // Fail-open — never block commit due to hook crash
  try {
    const logDir = path.join(__dirname, '.logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(
      path.join(logDir, 'hook-log.jsonl'),
      JSON.stringify({ ts: new Date().toISOString(), hook: 'kit-pre-commit-gate', status: 'crash', error: e.message }) + '\n'
    );
  } catch (_) {}
  process.stderr.write(`kit-pre-commit-gate: hook crashed (fail-open) — ${e.message}\n`);
  process.exit(0);
}
