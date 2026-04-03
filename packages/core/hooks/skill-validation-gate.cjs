#!/usr/bin/env node
/**
 * skill-validation-gate.cjs — PostToolUse(Write|Edit) Hook
 *
 * Runs quick_validate.py whenever a SKILL.md file is written or edited.
 * Never blocks the write — always exits 0. Emits warnings/errors as
 * additionalContext for the agent to see.
 *
 * Exit Codes:
 *   0 - Always (non-blocking, soft gate)
 */

try {

const fs = require('fs');
const path = require('path');
const { validateSkill } = require('./lib/skill-validate.cjs');
const { checkLayer } = require('./lib/layer-check.cjs');

function main() {
  let hookData;
  try {
    hookData = JSON.parse(fs.readFileSync(0, 'utf-8'));
  } catch {
    process.exit(0);
  }

  // Only act on Write or Edit tool events
  const toolName = hookData.tool_name || '';
  if (toolName !== 'Write' && toolName !== 'Edit') process.exit(0);

  // Extract file path from tool input
  const filePath = (hookData.tool_input || {}).file_path || '';
  if (!filePath) process.exit(0);

  // Only act on SKILL.md files
  if (!filePath.endsWith('SKILL.md')) process.exit(0);

  // Derive skill directory from file path
  const skillDir = path.dirname(filePath);

  const result = validateSkill(skillDir);

  // Skip if validation was skipped (python not found, etc.)
  if (result.skipped) {
    if (result.level !== 'info') {
      // Surface the skip warning once
      process.stdout.write(JSON.stringify({ additionalContext: `[skill-validate] ${result.message}` }) + '\n');
    }
    process.exit(0);
  }

  if (result.valid && result.level === 'info') {
    // Valid — emit a brief confirmation
    process.stdout.write(
      JSON.stringify({ additionalContext: `[skill-validate] ${path.basename(skillDir)}: ${result.message}` }) + '\n'
    );
  } else {
    // Validation issues — format by level
    const prefix = result.level === 'error' ? '[skill-validate ERROR]' :
                   result.level === 'warning' ? '[skill-validate WARN]' :
                   '[skill-validate INFO]';

    const context = `${prefix} ${path.basename(skillDir)}/SKILL.md: ${result.message}` +
      (result.level === 'info' ? '\n  (epost extra frontmatter fields are expected — not a real error)' : '');

    process.stdout.write(JSON.stringify({ additionalContext: context }) + '\n');
  }

  // Layer check — mechanical hard signals + reminder for agent to assess content layer
  const layer = checkLayer(skillDir);
  if (layer.hasIssues) {
    // Hard mechanical violation (e.g. hardcoded /Users/... path) — always wrong
    const hardContext = `[layer-check ERROR] ${path.basename(skillDir)}/SKILL.md: ${layer.signals.join(', ')}. Remove before continuing.`;
    process.stdout.write(JSON.stringify({ additionalContext: hardContext }) + '\n');
  } else {
    // Remind agent to do the content-level layer assessment — regex can't do this reliably
    const reminder = `[layer-check] Assess layer before closing: is this skill org-wide (Layer 0) or repo-specific (Layer 2)? ` +
      `Layer 2 content belongs in docs/ (CONV, ADR, FEAT, or FINDING), not in epost_agent_kit skills. ` +
      `See kit-add-skill step 2 for the full checklist.`;
    process.stdout.write(JSON.stringify({ additionalContext: reminder }) + '\n');
  }

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
