#!/usr/bin/env node
/**
 * packages-guard.cjs — PreToolUse(Write|Edit) Hook
 *
 * Blocks direct writes to .claude/ in kit repos.
 * Source of truth is packages/ — .claude/ is generated output wiped on epost-kit init.
 *
 * Exit Codes:
 *   0 - Allow
 *   2 - Block (with JSON decision output)
 */

try {

const fs = require('fs');
const path = require('path');

function main() {
  let input = '';
  try {
    input = fs.readFileSync(0, 'utf-8');
  } catch {
    process.exit(0);
  }

  let hookData;
  try {
    hookData = JSON.parse(input);
  } catch {
    process.exit(0); // Invalid JSON — allow
  }

  const filePath = hookData.tool_input?.file_path || hookData.tool_input?.path || '';
  if (!filePath) process.exit(0);

  // Only applies to kit repos — packages/ dir must exist in CWD
  const packagesDir = path.join(process.cwd(), 'packages');
  if (!fs.existsSync(packagesDir)) {
    process.exit(0); // Not a kit repo — allow
  }

  // Resolve to absolute path for comparison
  const absFilePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  const absClaudeDir = path.resolve(process.cwd(), '.claude');

  // Check if target is under .claude/
  const isUnderClaudeDir = absFilePath.startsWith(absClaudeDir + path.sep) || absFilePath === absClaudeDir;

  if (isUnderClaudeDir) {
    const output = {
      decision: 'block',
      reason: '`.claude/` is generated output — wiped on next `epost-kit init`.\nEdit under `packages/` instead, then run: epost-kit init'
    };
    console.log(JSON.stringify(output));
    process.exit(2);
  }

  process.exit(0); // Allow
}

main();

} catch (e) {
  // Minimal crash logging — only Node builtins, no lib/ deps
  try {
    const fs = require('fs');
    const p = require('path');
    const logDir = p.join(__dirname, '.logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(
      p.join(logDir, 'hook-log.jsonl'),
      JSON.stringify({ ts: new Date().toISOString(), hook: p.basename(__filename, '.cjs'), status: 'crash', error: e.message }) + '\n'
    );
  } catch (_) {}
  process.exit(0); // fail-open
}
