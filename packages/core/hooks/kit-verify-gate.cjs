#!/usr/bin/env node
/**
 * kit-verify-gate.cjs — PostToolUse(Write|Edit) Hook
 *
 * Runs verify.cjs whenever a kit structural file is modified:
 *   - packages/<pkg>/package.yaml  — skill manifest changes
 *   - packages/<pkg>/agents/<name>.md — agent frontmatter changes
 *
 * Surfaces only errors and warnings via additionalContext. Silent on clean pass.
 * Only active in kit repo context (packages/ dir must exist).
 *
 * Exit Codes:
 *   0 - Always (non-blocking, advisory only)
 */

'use strict';

try {

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function main() {
  // Parse hook input from stdin
  let hookData;
  try {
    hookData = JSON.parse(fs.readFileSync(0, 'utf-8'));
  } catch {
    process.exit(0);
  }

  // Only act on Write or Edit tool events
  const toolName = hookData.tool_name || '';
  if (toolName !== 'Write' && toolName !== 'Edit') process.exit(0);

  const filePath = (hookData.tool_input || {}).file_path || '';
  if (!filePath) process.exit(0);

  // Guard: only active in kit repo (packages/ must exist)
  const cwd = process.cwd();
  const packagesDir = path.join(cwd, 'packages');
  if (!fs.existsSync(packagesDir)) process.exit(0);

  // Trigger only on structural files: package.yaml or agents/*.md
  const isPackageManifest = filePath.endsWith('package.yaml') && filePath.includes('/packages/');
  const isAgentFile = /\/agents\/[^/]+\.md$/.test(filePath) && filePath.includes('/packages/');

  if (!isPackageManifest && !isAgentFile) process.exit(0);

  // Find verify.cjs — works from both packages/core/scripts/ and .claude/scripts/
  const verifyScript = path.join(cwd, '.claude/scripts/verify.cjs');
  if (!fs.existsSync(verifyScript)) process.exit(0);

  // Run verify.cjs --json for structured output
  let output;
  try {
    output = execFileSync(process.execPath, [verifyScript, '--json'], {
      cwd,
      timeout: 10000,
      encoding: 'utf-8',
    });
  } catch (e) {
    // Non-zero exit — output is in e.stdout
    output = e.stdout || '';
  }

  let results;
  try {
    results = JSON.parse(output);
  } catch {
    process.exit(0);
  }

  const { errors = [], warnings = [] } = results;

  // Silent on clean pass
  if (errors.length === 0 && warnings.length === 0) process.exit(0);

  // Format findings
  const trigger = isPackageManifest
    ? path.relative(cwd, filePath)
    : path.basename(filePath);

  const lines = [`[kit-verify] Issues detected after editing ${trigger}:`];
  for (const e of errors)   lines.push(`  ✗ [${e.check}] ${e.msg}`);
  for (const w of warnings) lines.push(`  ⚠ [${w.check}] ${w.msg}`);

  if (errors.length > 0) {
    lines.push('');
    lines.push('Fix with: node .claude/scripts/verify.cjs');
  }

  process.stdout.write(JSON.stringify({ additionalContext: lines.join('\n') }) + '\n');
  process.exit(0);
}

main();

} catch (e) {
  // Fail-open — never block on hook crash
  try {
    const fs = require('fs'), p = require('path');
    const logDir = p.join(__dirname, '.logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(p.join(logDir, 'hook-log.jsonl'),
      JSON.stringify({ ts: new Date().toISOString(), hook: 'kit-verify-gate', error: e.message }) + '\n');
  } catch (_) {}
  process.exit(0);
}
