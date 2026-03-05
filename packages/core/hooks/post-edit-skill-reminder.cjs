#!/usr/bin/env node
/**
 * post-edit-skill-reminder.cjs — PostToolUse(Edit|Write|MultiEdit) Hook
 *
 * Reminds to regenerate skill-index.json after any SKILL.md edit.
 *
 * Exit Codes:
 *   0 - Always (non-blocking)
 */

try {

const fs = require('fs');

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
    process.exit(0);
  }

  const toolName = hookData.tool_name || '';
  const filePath = hookData.tool_input?.file_path || hookData.tool_input?.path || '';

  // Only trigger on Edit, Write, MultiEdit
  if (!['Edit', 'Write', 'MultiEdit'].includes(toolName)) {
    process.exit(0);
  }

  // Only trigger when a SKILL.md file was modified
  if (!filePath.includes('SKILL.md')) {
    process.exit(0);
  }

  const output = {
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: '[Skill Index Reminder] SKILL.md was modified. Run:\n  node .claude/scripts/generate-skill-index.cjs\n...to update skill discovery. Skipping this breaks skill routing.'
    }
  };

  console.log(JSON.stringify(output));
  process.exit(0);
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
