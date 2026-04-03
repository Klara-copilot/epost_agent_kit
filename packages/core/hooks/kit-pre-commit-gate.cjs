#!/usr/bin/env node
/**
 * kit-pre-commit-gate.cjs — PreToolUse(Bash) hook
 *
 * Intercepts `git commit` commands and runs the kit validation pipeline:
 *   1. Build  — generate-skill-index.cjs (ensures index is fresh before checks)
 *   2. Verify — verify.cjs (all checks: frontmatter, naming, pkg, agent-refs,
 *               skill-quality [CSO + schema], eval-coverage, index-sync)
 *
 * Kit-repo guard: only runs when packages/core/scripts/verify.cjs exists.
 * This path is unique to the kit development repo — installed projects don't have it.
 *
 * Exit codes:
 *   0 = allow (all checks pass, warnings only, or not a kit-dev repo)
 *   2 = block (hard errors — commit blocked)
 *
 * Bypass:
 *   --skip-kit-gate in the git commit command
 *   EPOST_SKIP_KIT_GATE=1 environment variable
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

function findRepoRoot() {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'packages')) && fs.existsSync(path.join(dir, '.claude'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

try {
  // Parse stdin
  let data;
  try { data = JSON.parse(fs.readFileSync(0, 'utf-8')); } catch { process.exit(0); }

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
  if (!root || !fs.existsSync(path.join(root, 'packages', 'core', 'scripts', 'verify.cjs'))) {
    process.exit(0);
  }

  process.stderr.write('kit-pre-commit-gate: running kit validation pipeline...\n');

  // ── Step 1: Build — regenerate skill index ─────────────────────────────────
  process.stderr.write('  [1/2] build: regenerating skill index...\n');
  try {
    execSync(`node "${path.join(root, '.claude', 'scripts', 'generate-skill-index.cjs')}"`, {
      cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 30000,
    });
  } catch (e) {
    process.stderr.write(`  ⚠ build: generate-skill-index failed — ${(e.stderr || e.message || '').slice(0, 100)}\n`);
    // Non-fatal — continue to verify
  }

  // ── Step 2: Verify — all structural + quality checks ──────────────────────
  process.stderr.write('  [2/2] verify: running full check suite...\n');
  const verifyResult = spawnSync('node', [path.join(root, '.claude', 'scripts', 'verify.cjs')], {
    cwd: root, encoding: 'utf8', timeout: 120000,
  });

  const output = (verifyResult.stdout || '') + (verifyResult.stderr || '');
  process.stderr.write(output);

  if (verifyResult.status !== 0) {
    process.stderr.write('\n❌ kit-pre-commit-gate: COMMIT BLOCKED — fix errors above before committing.\n');
    process.stderr.write('To bypass (WIP/draft): add --skip-kit-gate or set EPOST_SKIP_KIT_GATE=1\n');
    process.exit(2);
  }

  process.stderr.write('\n✓ kit-pre-commit-gate: all checks passed\n');
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
