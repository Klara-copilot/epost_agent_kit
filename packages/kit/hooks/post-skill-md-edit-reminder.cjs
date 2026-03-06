#!/usr/bin/env node
/**
 * post-skill-md-edit-reminder.cjs — PostToolUse(Edit|Write|MultiEdit) Hook
 *
 * After editing a SKILL.md under packages/, reminds that the skill discovery
 * index is now stale and needs regenerating.
 *
 * Exit Codes:
 *   0 - Always (non-blocking)
 */

try {

const fs = require('fs');
const path = require('path');

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

  // Only trigger for SKILL.md files under packages/
  const isUnderPackages = filePath.includes('/packages/');
  const isSkillMd = path.basename(filePath) === 'SKILL.md';

  if (!isUnderPackages || !isSkillMd) process.exit(0);

  const response = {
    hookSpecificOutput: {
      additionalContext: [
        '[Kit Dev] SKILL.md edited under packages/. Skill discovery index is now stale.',
        'Run: node .claude/scripts/generate-skill-index.cjs'
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
