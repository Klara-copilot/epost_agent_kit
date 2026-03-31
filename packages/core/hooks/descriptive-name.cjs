#!/usr/bin/env node
/**
 * descriptive-name.cjs — PreToolUse: Write
 *
 * Warns when a file is being written with a non-kebab-case or non-descriptive name.
 * NEVER blocks — soft enforcement only.
 */

const input = JSON.parse(process.stdin.read ? (() => {
  const chunks = [];
  const buf = require('fs').readFileSync('/dev/stdin');
  return buf.toString();
})() : process.argv[2] || '{}');

const filePath = input?.tool_input?.file_path || '';
const filename = filePath.split('/').pop() || '';

// Skip known exceptions
const SKIP_NAMES = new Set([
  'index.md', 'index.json', 'index.ts', 'index.tsx', 'index.js', 'index.cjs',
  'README.md', 'CHANGELOG.md', 'CLAUDE.md', 'SKILL.md', 'package.json',
  'package.yaml', 'tsconfig.json', 'next.config.ts', 'next.config.js',
  'tailwind.config.ts', 'tailwind.config.js', '.env', '.env.local',
  'Makefile', 'Dockerfile',
]);

if (SKIP_NAMES.has(filename)) {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

// Skip uppercase-prefixed KB docs (ADR-0001-..., ARCH-..., FEAT-..., GUIDE-..., FINDING-...)
if (/^[A-Z]+-\d{4}-/.test(filename) || /^[A-Z]+\.md$/.test(filename)) {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

// Skip files without extension (Makefile, Dockerfile variants)
if (!filename.includes('.')) {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

// Check for camelCase (has uppercase letter not at start of known extension)
const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
const hasCamelCase = /[a-z][A-Z]/.test(nameWithoutExt);
const hasUnderscore = nameWithoutExt.includes('_');
const isKebab = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(nameWithoutExt);

if (hasCamelCase || hasUnderscore) {
  const suggested = nameWithoutExt
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
  const ext = filename.slice(filename.lastIndexOf('.'));
  const message = `[naming] "${filename}" → suggest "${suggested}${ext}" (kebab-case convention)`;
  process.stdout.write(JSON.stringify({ continue: true, stdout: message }));
  process.exit(0);
}

// Warn on single-word names for source files (not config/data)
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.swift', '.kt', '.java']);
const ext = filename.slice(filename.lastIndexOf('.'));
if (sourceExtensions.has(ext) && isKebab && !nameWithoutExt.includes('-') && nameWithoutExt.length < 20) {
  const message = `[naming] "${filename}" — single-word name. Consider a more descriptive name if it represents a specific concept.`;
  process.stdout.write(JSON.stringify({ continue: true, stdout: message }));
  process.exit(0);
}

process.stdout.write(JSON.stringify({ continue: true }));
process.exit(0);
