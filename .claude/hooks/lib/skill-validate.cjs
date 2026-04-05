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

// --- CSO checks (ePost layer, applied after quick_validate.py passes) --------

// Trigger phrase patterns — match anywhere in first 250 chars (descriptions may start with "(ePost) ...")
const TRIGGER_PATTERNS = [
  /\buse when\b/i,
  /\btriggers? when\b/i,
  /\binvoke when\b/i,
  /\bload when\b/i,
];

// Workflow summary patterns — only fire when description clearly describes what the skill DOES, not when to use it
const WORKFLOW_KEYWORDS = [
  /\bgenerates? a report\b/i,
  /\bexecutes? the following steps?\b/i,
  /\bperforms? the following steps?\b/i,
  /\bautomatically runs? .{5,} and (then|then outputs?)\b/i,
];

/**
 * Extract description string from a SKILL.md file.
 * Returns null if not found.
 * @param {string} skillMdPath
 * @returns {string|null}
 */
function extractDescription(skillMdPath) {
  try {
    const content = require('fs').readFileSync(skillMdPath, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;
    // Match multi-line description: description: "..." or description: >- or description: |-
    const descMatch = match[1].match(/^description:\s*["']?([\s\S]*?)["']?\s*(?=\n\w|\n---$|$)/m);
    if (!descMatch) return null;
    return descMatch[1].trim().replace(/^["']|["']$/g, '');
  } catch {
    return null;
  }
}

/**
 * Run ePost CSO checks on a skill description.
 * Returns array of warning strings (empty = pass).
 * @param {string} description
 * @returns {string[]}
 */
function checkCso(description) {
  const warnings = [];

  // Check 1: trigger phrasing in first 250 chars
  const lead = description.slice(0, 250);
  const hasTriggerPhrase = TRIGGER_PATTERNS.some(p => p.test(lead));
  if (!hasTriggerPhrase) {
    warnings.push('Description should start with trigger phrasing ("Use when...") in first 250 chars');
  }

  // Check 2: concrete trigger phrases — either ≥2 quoted phrases OR "use when" with comma-separated items
  const quotedPhrases = description.match(/["'][^"']{3,}["']/g) || [];
  const useWhenIdx = description.search(/use when\b/i);
  const afterUseWhen = useWhenIdx >= 0 ? description.slice(useWhenIdx) : '';
  const commaCount = (afterUseWhen.match(/,/g) || []).length;
  if (quotedPhrases.length < 2 && commaCount < 1) {
    warnings.push('Description lacks concrete trigger phrases — add ≥2 quoted examples (e.g., "fix bug") or list specific triggers after "Use when"');
  }

  // Check 3: warn if description is short enough that 250-char truncation cuts the key use case
  if (description.length > 250) {
    const truncated = description.slice(0, 250);
    if (!TRIGGER_PATTERNS.some(p => p.test(truncated))) {
      warnings.push('Key use case may be buried — descriptions truncate at 250 chars in skill listing; front-load the trigger');
    }
  }

  // Check 4: workflow summary detection (heuristic — soft warning)
  const hasWorkflowSummary = WORKFLOW_KEYWORDS.some(p => p.test(description));
  if (hasWorkflowSummary) {
    warnings.push('Description may summarize workflow steps (Description Trap) — keep description as trigger conditions only');
  }

  return warnings;
}

/**
 * Run CSO checks on a skill directory. Returns null if SKILL.md unreadable.
 * @param {string} skillDir
 * @returns {{ warnings: string[] }|null}
 */
function validateSkillCso(skillDir) {
  const skillMd = require('path').join(skillDir, 'SKILL.md');
  const description = extractDescription(skillMd);
  if (!description) return null;
  return { warnings: checkCso(description) };
}

module.exports = { validateSkill, validateSkillCso, findPython, findValidateScript };
