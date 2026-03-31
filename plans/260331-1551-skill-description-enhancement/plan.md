---
title: "Enhance All Skill Descriptions to Anthropic Formula"
status: active
created: 2026-03-31
updated: 2026-03-31
effort: 2h
phases: 2
platforms: [all]
breaking: false
blocks: []
blockedBy: ["PLAN-0090"]
---

# Enhance All Skill Descriptions to Anthropic Formula

## Summary

Prepend a 1-sentence capability summary to every skill description. Current format is triggers-only (`Use when...`). Target format matches Anthropic's official pattern: `"[Capability summary]. Use when [trigger]."` — improves both model routing and human readability across all ~52 skills.

## Key Dependencies

- PLAN-0090 (fix 11 failing descriptions) should land first — those fixes become the baseline
- All edits in `packages/` (source of truth); `.claude/` mirror updated afterward
- `skill-index.json` description fields must stay in sync
- Description must stay under 1024 chars

## Execution Strategy

2 phases, ordered by blast radius. Phase 1 covers core + kit (most used, validates pattern). Phase 2 covers platform, domain, a11y, and design-system packages.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Core + Kit skills (~27 skills) | 1h | pending | [phase-1](./phase-1-core-kit.md) |
| 2 | Platform + Domain + A11y + Design skills (~25 skills) | 1h | pending | [phase-2](./phase-2-platform-domain.md) |

## Critical Constraints

- Keep existing trigger text unchanged — only prepend capability summary
- Capability summary: 1 sentence, action-oriented verb, describes what skill *does*
- `(ePost)` prefix stays
- Max 1024 chars total per description
- Update both SKILL.md frontmatter AND `skill-index.json`
- After all edits: run `node .claude/scripts/generate-skill-index.cjs` to regenerate index

## Success Criteria

- [ ] All ~52 SKILL.md descriptions follow `"[capability]. Use when [trigger]."` pattern
- [ ] `skill-index.json` descriptions match SKILL.md descriptions
- [ ] No description exceeds 1024 chars
- [ ] Existing trigger phrases unchanged
