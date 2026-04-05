#!/usr/bin/env node
/**
 * post-edit-simplify-reminder.cjs — PostToolUse: Edit, Write, MultiEdit
 *
 * Fires after code edits. Suggests simplification if a source file exceeds 200 LOC.
 * NEVER blocks — soft reminder only.
 */

const fs = require('fs');
const path = require('path');

let input = {};
try {
  const raw = fs.readFileSync('/dev/stdin').toString();
  input = JSON.parse(raw);
} catch {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

const filePath = input?.tool_input?.file_path || input?.tool_result?.file_path || '';
if (!filePath) {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

// Only check source files (not docs, not config)
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.swift', '.kt', '.java', '.py']);
const ext = path.extname(filePath);
if (!sourceExtensions.has(ext)) {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

// Count lines
let lineCount = 0;
try {
  const content = fs.readFileSync(filePath, 'utf8');
  lineCount = content.split('\n').length;
} catch {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

if (lineCount > 200) {
  const filename = path.basename(filePath);
  const message = `[simplify] "${filename}" is ${lineCount} LOC — consider modularization if logic can be separated cleanly`;
  process.stdout.write(JSON.stringify({ continue: true, stdout: message }));
} else {
  process.stdout.write(JSON.stringify({ continue: true }));
}

process.exit(0);
