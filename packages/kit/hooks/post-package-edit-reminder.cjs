#!/usr/bin/env node
/**
 * post-package-edit-reminder.cjs — PostToolUse(Edit|Write|MultiEdit) Hook
 *
 * After editing package-level files under packages/ (package.yaml, agent .md, hook .cjs),
 * reminds that .claude/ won't reflect the change until re-initialized.
 *
 * Throttled: only fires once per 10 minutes via /tmp tmpfile to avoid spam
 * during multi-file operations like epost-kit init.
 *
 * Exit Codes:
 *   0 - Always (non-blocking)
 */

try {

const fs = require('fs');
const path = require('path');

const THROTTLE_FILE = '/tmp/epost-pkg-edit-reminded.json';
const THROTTLE_MS = 10 * 60 * 1000; // 10 minutes

function isThrottled() {
  try {
    const data = JSON.parse(fs.readFileSync(THROTTLE_FILE, 'utf-8'));
    if (Date.now() - data.ts < THROTTLE_MS) return true;
  } catch { /* no file or parse error — not throttled */ }
  return false;
}

function setThrottle() {
  try {
    fs.writeFileSync(THROTTLE_FILE, JSON.stringify({ ts: Date.now() }));
  } catch { /* non-critical */ }
}

function isPackageLevelFile(filePath) {
  if (!filePath.includes('/packages/')) return false;
  if (path.basename(filePath) === 'package.yaml') return true;
  if (filePath.includes('/agents/') && filePath.endsWith('.md')) return true;
  if (filePath.includes('/hooks/') && filePath.endsWith('.cjs')) return true;
  return false;
}

function main() {
  // Guard: only active when packages/ dir exists (kit repo context)
  const packagesDir = path.resolve(process.cwd(), 'packages');
  try {
    const stat = fs.statSync(packagesDir);
    if (!stat.isDirectory()) process.exit(0);
  } catch {
    process.exit(0);
  }

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
    process.exit(0);
  }

  const filePath = (hookData.tool_input || {}).file_path || '';

  if (!isPackageLevelFile(filePath)) process.exit(0);

  // Check throttle before firing
  if (isThrottled()) process.exit(0);

  setThrottle();

  const response = {
    hookSpecificOutput: {
      additionalContext: [
        '[Kit Dev] packages/ file edited. .claude/ won\'t reflect this until re-initialized.',
        'Run: epost-kit init'
      ].join('\n')
    }
  };
  process.stdout.write(JSON.stringify(response) + '\n');
  process.exit(0);
}

main();

} catch (e) {
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
