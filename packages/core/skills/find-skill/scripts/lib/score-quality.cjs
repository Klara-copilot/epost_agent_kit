'use strict';

/**
 * Score a skill's documentation quality on a 0–10 scale.
 *
 * Scoring is based on ePost CSO (Cognitive Skill Optimization) principles:
 *   - Description should be a trigger condition ("Use when…"), not a summary
 *   - Metadata fields (keywords, triggers) improve model routing accuracy
 *   - references/ and evals/ indicate a mature, validated skill
 *
 * @param {object} meta - SkillMeta from scan-skills.cjs
 * @returns {{ score: number, max: number, breakdown: object }}
 */
function scoreQuality(meta) {
  const desc = meta.description || '';

  const checks = {
    // Core completeness (2 pts)
    hasName:            Boolean(meta.name),
    hasDescription:     Boolean(desc),

    // CSO: trigger-condition format is the most important signal (2 pts)
    triggerFormat:      /use when/i.test(desc),

    // Model routing metadata (2 pts)
    hasKeywords:        meta.keywords.length > 0,
    hasTriggers:        meta.triggers.length > 0,

    // Maturity indicators (2 pts)
    hasReferences:      meta.hasReferences,
    hasEvals:           meta.hasEvals,

    // Invocability declared (1 pt)
    userInvocableSet:   meta.userInvocable !== null,

    // Description is appropriately sized — not a one-liner, not a novel (1 pt)
    descriptionLength:  desc.length >= 30 && desc.length <= 250,
  };

  // Weight overrides: triggerFormat counts double (handled by giving it 2 in weighted sum)
  const weights = {
    hasName: 1, hasDescription: 1, triggerFormat: 2,
    hasKeywords: 1, hasTriggers: 1, hasReferences: 1,
    hasEvals: 1, userInvocableSet: 1, descriptionLength: 1,
  };

  const score = Object.entries(checks)
    .reduce((sum, [key, passed]) => sum + (passed ? (weights[key] ?? 1) : 0), 0);

  return { score, max: 10, breakdown: checks };
}

module.exports = { scoreQuality };
