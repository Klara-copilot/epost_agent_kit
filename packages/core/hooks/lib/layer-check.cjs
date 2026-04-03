#!/usr/bin/env node
/**
 * layer-check.cjs — Layer 0 vs Layer 2 content checker for SKILL.md files
 *
 * Skills in epost_agent_kit are Layer 0 — org-wide standards that must apply
 * across all repos and teams. This module scans SKILL.md content for signals
 * that indicate repo-specific (Layer 2) content has leaked in.
 *
 * Used by skill-validation-gate.cjs (PostToolUse hook).
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Layer 2/3 signal detectors.
 * Each entry: { label, pattern }
 * pattern is a RegExp tested against the full SKILL.md text.
 */
const LAYER2_SIGNALS = [
  {
    label: 'absolute user path (hardcoded)',
    pattern: /\/Users\/[a-zA-Z0-9_-]+\/|\/home\/[a-zA-Z0-9_-]+\//,
  },
  {
    label: 'specific repo reference',
    // matches "epost_web", "epost-ios", "epost-android", etc. but not "epost_agent_kit" itself
    // or generic phrases — looks for named sibling repos
    pattern: /\b(epost[-_](web|ios|android|backend|mobile|api|portal|admin))\b/i,
  },
  {
    label: '"this repo" or "our codebase" phrasing',
    pattern: /\b(in this repo|our (codebase|app|project|platform|web app|mobile app)|this project's)\b/i,
  },
  {
    label: 'hardcoded file path from a specific codebase',
    // paths that start with src/, app/, lib/ followed by a named module not generic
    // e.g. src/modules/inbox/, src/features/smart-send/
    pattern: /src\/modules\/|src\/features\/|app\/screens\/|src\/pages\/[a-zA-Z]/,
  },
];

/**
 * Check a SKILL.md file for Layer 2/3 content signals.
 *
 * @param {string} skillDir — absolute path to the skill directory
 * @returns {{ hasIssues: boolean, signals: string[] }}
 */
function checkLayer(skillDir) {
  const skillFile = path.join(skillDir, 'SKILL.md');

  let content;
  try {
    content = fs.readFileSync(skillFile, 'utf8');
  } catch {
    return { hasIssues: false, signals: [] };
  }

  const signals = LAYER2_SIGNALS
    .filter(({ pattern }) => pattern.test(content))
    .map(({ label }) => label);

  return { hasIssues: signals.length > 0, signals };
}

module.exports = { checkLayer };
