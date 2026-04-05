'use strict';

/**
 * Score how relevant a skill is to the current project (0–10).
 *
 * Three dimensions:
 *   Platform match  (0–3): skill.platforms ∩ project installed platforms
 *   Keyword match   (0–4): skill.keywords  ∩ project tech terms
 *   Domain match    (0–3): words in skill description+triggers ∩ docs domain tags
 *
 * All comparisons are case-insensitive.
 *
 * @param {object} meta - SkillMeta from scan-skills.cjs
 * @param {object} ctx  - ProjectContext from project-context.cjs
 * @returns {{ score: number, max: number }}
 */
function scoreRelevance(meta, ctx) {
  // Platform: e.g. skill has ['web'] and project has ['web', 'ios'] → 1 match
  const platformScore = Math.min(
    intersectLower(meta.platforms, ctx.platforms).length,
    3
  );

  // Keywords: skill's declared keywords vs project tech terms extracted from CLAUDE.md
  const keywordScore = Math.min(
    intersectLower(meta.keywords, ctx.techTerms).length,
    4
  );

  // Domain: unstructured word-bag match of description+triggers vs KB tags
  const descText = `${meta.description} ${meta.triggers.join(' ')}`;
  const descWords = tokenize(descText);
  const domainScore = Math.min(
    intersectLower(descWords, ctx.domainTags).length,
    3
  );

  return {
    score: platformScore + keywordScore + domainScore,
    max: 10,
  };
}

/** Case-insensitive intersection of two string arrays. */
function intersectLower(a, b) {
  const setB = new Set(b.map(s => s.toLowerCase()));
  return [...new Set(a.map(s => s.toLowerCase()).filter(x => setB.has(x)))];
}

/** Split text into lowercase tokens, filtering noise. */
function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[\s,;:.!?()\[\]{}\\/|+]+/)
    .filter(t => t.length >= 2);
}

module.exports = { scoreRelevance };
