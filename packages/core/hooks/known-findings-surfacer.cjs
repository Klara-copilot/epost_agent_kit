#!/usr/bin/env node
/**
 * known-findings-surfacer.cjs - PostToolUse hook for Read tool
 *
 * When a developer reads a file that has known unresolved findings,
 * injects a brief warning into tool output.
 *
 * Exit codes:
 *   0 = always (never blocks)
 *
 * Output (stdout): plain text warning message (PostToolUse context injection)
 *
 * Graceful degradation:
 *   - No DB files → silent exit (no warning)
 *   - Parse errors → silent exit
 *   - File has no findings → silent exit
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ─── DB Paths ───

const DB_PATHS = [
  'reports/known-findings/ui-components.json',
  'reports/known-findings/a11y.json',
];

// ─── In-memory cache (lives for duration of this hook invocation) ───

/** @type {Array|null} */
let findingsCache = null;

/**
 * Load all findings from known-findings DBs.
 * Returns combined array of all unresolved findings, or null if no DBs exist.
 * @param {string} cwd
 * @returns {Array|null}
 */
function loadFindings(cwd) {
  if (findingsCache !== null) return findingsCache;

  /** @type {Array} */
  const all = [];
  let anyLoaded = false;

  for (const relPath of DB_PATHS) {
    try {
      const raw = fs.readFileSync(path.join(cwd, relPath), 'utf8');
      const db = JSON.parse(raw);
      if (Array.isArray(db.findings)) {
        all.push(...db.findings);
        anyLoaded = true;
      }
    } catch {
      // Missing or malformed DB — skip silently
    }
  }

  if (!anyLoaded) return null;

  findingsCache = all;
  return all;
}

/**
 * Normalize a file path for comparison (strip leading ./ and resolve relative)
 * @param {string} filePath
 * @param {string} cwd
 * @returns {string}
 */
function normalizePath(filePath, cwd) {
  if (!filePath) return '';
  // Make relative to cwd for consistent comparison
  const abs = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  const rel = path.relative(cwd, abs);
  // Guard against path traversal — reject paths that escape cwd
  if (rel.startsWith('..') || path.isAbsolute(rel)) return '';
  return rel;
}

/**
 * Check if a finding matches the given file path.
 * Matches against `file_pattern` or `file` field.
 * @param {object} finding
 * @param {string} normalizedFilePath
 * @returns {boolean}
 */
function findingMatchesFile(finding, normalizedFilePath) {
  const pattern = finding.file_pattern || finding.file;
  if (!pattern) return false;
  const normalizedPattern = pattern.replace(/^\.\//, '');
  return normalizedFilePath === normalizedPattern || normalizedFilePath.endsWith(normalizedPattern);
}

// ─── Main ───

const chunks = [];
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => chunks.push(chunk));
process.stdin.on('end', () => run(chunks.join('')));
process.stdin.on('error', () => process.exit(0));

/**
 * @param {string} rawInput
 */
function run(rawInput) {
  try {
    if (!rawInput.trim()) {
      process.exit(0);
    }

    const hookData = JSON.parse(rawInput);
    const cwd = hookData.cwd || process.cwd();

    // Extract file path from tool input
    const toolInput = hookData.tool_input || {};
    const filePath = toolInput.file_path || toolInput.path || '';

    if (!filePath) {
      process.exit(0);
    }

    // Load findings (fast-path exit if no DBs)
    const findings = loadFindings(cwd);
    if (!findings || findings.length === 0) {
      process.exit(0);
    }

    // Normalize the file path being read
    const normalizedFile = normalizePath(filePath, cwd);

    // Filter to unresolved findings matching this file
    const matched = findings.filter(f =>
      f.resolved !== true && findingMatchesFile(f, normalizedFile)
    );

    if (matched.length === 0) {
      process.exit(0);
    }

    // Count by severity
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const f of matched) {
      const sev = f.severity || 'medium';
      if (sev in counts) counts[sev]++;
    }

    // Build severity summary (only non-zero)
    const parts = [];
    if (counts.critical > 0) parts.push(`${counts.critical}C`);
    if (counts.high > 0) parts.push(`${counts.high}H`);
    if (counts.medium > 0) parts.push(`${counts.medium}M`);
    if (counts.low > 0) parts.push(`${counts.low}L`);
    const severitySummary = parts.join('/');

    // Determine fix command hint
    const hasUi = matched.some(f => f.rule_id && /^(TOKEN|STRUCT|PROPS|COMP|ARCH)/.test(f.rule_id));
    const hasA11y = matched.some(f => f.rule_id && /^(ARIA|WCAG|COLOR|FOCUS|KBD|SCREEN)/.test(f.rule_id));
    let fixHint = '/fix';
    if (hasUi) fixHint = `/fix --ui ${matched[0].component || path.basename(filePath, path.extname(filePath))}`;
    if (hasA11y && !hasUi) fixHint = `/fix --a11y`;

    const warning = `[Known Issues] ${path.basename(filePath)}: ${matched.length} unresolved finding${matched.length !== 1 ? 's' : ''} (${severitySummary}) — run ${fixHint} or /audit --close`;

    // Output PostToolUse response: inject warning as plain text (context injection)
    console.log(warning);
    process.exit(0);

  } catch {
    // Never block on errors
    process.exit(0);
  }
}
