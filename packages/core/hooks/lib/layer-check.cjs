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
 * Hard mechanical signals — unambiguous enough to detect without LLM judgment.
 * Content-level assessment (is this org-wide or repo-specific?) is left to the agent.
 */
const HARD_SIGNALS = [
  {
    label: 'hardcoded absolute user path',
    pattern: /\/Users\/[a-zA-Z0-9_-]+\/|\/home\/[a-zA-Z0-9_-]+\//,
  },
];

/**
 * Check a SKILL.md file for mechanical Layer 2/3 signals.
 * Returns hasIssues=true only for unambiguous violations (e.g. hardcoded /Users/... paths).
 * Content-level layer assessment is intentionally left to the LLM agent — regex cannot
 * reliably distinguish org-wide patterns from repo-specific ones without false positives.
 *
 * @param {string} skillDir — absolute path to the skill directory
 * @returns {{ hasIssues: boolean, signals: string[], needsReview: boolean }}
 */
function checkLayer(skillDir) {
  const skillFile = path.join(skillDir, 'SKILL.md');

  let content;
  try {
    content = fs.readFileSync(skillFile, 'utf8');
  } catch {
    return { hasIssues: false, signals: [], needsReview: false };
  }

  const signals = HARD_SIGNALS
    .filter(({ pattern }) => pattern.test(content))
    .map(({ label }) => label);

  // Always ask the agent to assess layer — content classification needs LLM judgment
  return { hasIssues: signals.length > 0, signals, needsReview: true };
}

module.exports = { checkLayer };
