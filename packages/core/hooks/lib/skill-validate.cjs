#!/usr/bin/env node
/**
 * skill-validate.cjs — Python bridge for quick_validate.py
 *
 * Calls the skill-creator quick_validate.py script and classifies results.
 * Designed for use in the skill-validation-gate hook (PostToolUse).
 *
 * epost skills use extra frontmatter fields (user-invocable, tier, context, agent)
 * that quick_validate.py flags as non-standard. These are classified as INFO,
 * not errors — only missing name/description are treated as hard errors.
 */

'use strict';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const TIMEOUT_MS = 10000;
const EPOST_EXTRA_KEYS = [
  'user-invocable', 'tier', 'context', 'agent', 'disable-model-invocation',
  'agent-affinity', 'keywords', 'extends', 'requires', 'conflicts',
  'connections', 'platforms', 'version', 'extends', 'author', 'tags',
];

/**
 * Find python3 or python executable, return null if neither found.
 * @returns {string|null}
 */
function findPython() {
  for (const bin of ['python3', 'python']) {
    try {
      execSync(`${bin} --version`, { stdio: 'pipe', timeout: 3000 });
      return bin;
    } catch { /* try next */ }
  }
  return null;
}

/**
 * Resolve the path to quick_validate.py relative to the project root (cwd).
 * Falls back to packages/core path.
 * @returns {string|null}
 */
function findValidateScript() {
  const candidates = [
    path.join(process.cwd(), '.claude', 'skills', 'skill-creator', 'scripts', 'quick_validate.py'),
    path.join(process.cwd(), 'packages', 'core', 'skills', 'skill-creator', 'scripts', 'quick_validate.py'),
  ];
  return candidates.find(p => fs.existsSync(p)) || null;
}

/**
 * Classify a quick_validate.py message.
 * - Missing name/description → 'error'
 * - Unexpected key(s) that are all epost-standard → 'info'
 * - Other unexpected key(s) → 'warning'
 * - Valid → 'info'
 *
 * @param {boolean} isValid
 * @param {string} message
 * @returns {'error'|'warning'|'info'}
 */
function classifyMessage(isValid, message) {
  if (isValid) return 'info';

  // Hard errors: missing required fields
  if (/Missing '(name|description)'/i.test(message)) return 'error';
  if (/No YAML frontmatter/i.test(message)) return 'error';
  if (/Invalid frontmatter format/i.test(message)) return 'error';
  if (/Invalid YAML/i.test(message)) return 'error';
  if (/SKILL\.md not found/i.test(message)) return 'error';
  if (/Frontmatter must be/i.test(message)) return 'error';

  // Unexpected keys — check if all are epost-standard
  const unexpectedMatch = message.match(/Unexpected key\(s\) in SKILL\.md frontmatter: ([^.]+)/i);
  if (unexpectedMatch) {
    const keys = unexpectedMatch[1].split(',').map(k => k.trim());
    const nonEpostKeys = keys.filter(k => !EPOST_EXTRA_KEYS.includes(k));
    return nonEpostKeys.length === 0 ? 'info' : 'warning';
  }

  return 'warning';
}

/**
 * Validate a skill directory using quick_validate.py.
 *
 * @param {string} skillDir — absolute path to the skill directory
 * @returns {{ valid: boolean, message: string, level: 'error'|'warning'|'info', skipped?: boolean }}
 */
function validateSkill(skillDir) {
  const python = findPython();
  if (!python) {
    return {
      valid: true,
      message: 'python3 not found — skill validation skipped. Install Python 3 to enable.',
      level: 'info',
      skipped: true,
    };
  }

  const script = findValidateScript();
  if (!script) {
    return {
      valid: true,
      message: 'quick_validate.py not found — skill validation skipped.',
      level: 'info',
      skipped: true,
    };
  }

  try {
    const output = execSync(`${python} "${script}" "${skillDir}"`, {
      timeout: TIMEOUT_MS,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const message = (output || 'Skill is valid!').trim();
    return { valid: true, message, level: 'info' };
  } catch (err) {
    const stdout = err.stdout ? err.stdout.trim() : '';
    const stderr = err.stderr ? err.stderr.trim() : '';

    // Timeout
    if (err.code === 'ETIMEDOUT' || (err.signal && err.signal === 'SIGTERM')) {
      return {
        valid: true,
        message: 'Skill validation timed out (>10s) — skipped.',
        level: 'info',
        skipped: true,
      };
    }

    // Python error (ImportError for PyYAML etc.)
    if (stderr.includes('ImportError') || stderr.includes('ModuleNotFoundError')) {
      const hint = stderr.includes('yaml') ? ' Run: pip install pyyaml' : '';
      return {
        valid: true,
        message: `Skill validation skipped — Python dependency missing.${hint}`,
        level: 'info',
        skipped: true,
      };
    }

    // Validation failure (exit code 1 from quick_validate.py)
    const message = stdout || stderr || 'Validation failed (unknown reason)';
    const level = classifyMessage(false, message);
    return { valid: false, message, level };
  }
}

module.exports = { validateSkill, findPython, findValidateScript };
