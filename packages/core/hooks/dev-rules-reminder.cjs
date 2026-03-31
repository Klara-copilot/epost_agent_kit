#!/usr/bin/env node
/**
 * dev-rules-reminder.cjs — UserPromptSubmit
 *
 * Injects a concise dev-rules reminder before every N-th prompt.
 * Throttled to once per 10 prompts to avoid noise.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const THROTTLE_FILE = path.join(os.tmpdir(), '.epost-dev-rules-counter');
const THROTTLE_EVERY = 10;

// Read current counter
let counter = 0;
try {
  counter = parseInt(fs.readFileSync(THROTTLE_FILE, 'utf8').trim(), 10) || 0;
} catch {
  counter = 0;
}

counter += 1;
fs.writeFileSync(THROTTLE_FILE, String(counter));

if (counter % THROTTLE_EVERY !== 1) {
  // Not time yet — pass through silently
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

const rules = [
  'Dev rules:',
  'YAGNI — only build what is needed now, not for hypothetical futures.',
  'KISS — simple over clever. The least complex solution that works.',
  'DRY — no duplication. Extract only when the pattern is stable (3+ uses).',
  'Files >200 LOC → modularize if logic separates cleanly.',
  'Names: kebab-case, self-documenting, no abbreviations.',
].join(' ');

process.stdout.write(JSON.stringify({ continue: true, stdout: rules }));
process.exit(0);
