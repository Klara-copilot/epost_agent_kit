---
title: "Skill Quality Improvements: Fix 33 Skills to ≥8/10"
status: active
created: 2026-04-03
updated: 2026-04-03
effort: 3h
phases: 4
platforms: [all]
breaking: false
---

## Scope Rationale

1. **Problem**: 33/65 skills scored ≤7/10 in quality audit — missing metadata, refs, evals
2. **Why this way**: Mechanical fixes (frontmatter additions, stub files) — no design decisions
3. **Why now**: Low scores reduce skill discoverability and routing accuracy
4. **Simplest version**: Add keywords + triggers to all 33 skills (biggest bang per edit)
5. **50% cut**: Drop evals stubs (content needs manual authoring later anyway)

## Cross-Plan Check

- PLAN-0041 (Skill Consolidation) — touches skill structure but NOT frontmatter metadata. No conflict.
- PLAN-0083 (Core Skills Consolidation) — merges skills. If a target skill gets merged before this plan runs, skip it. No blocking dependency.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Metadata: add triggers to all 33 skills | 1h | pending | [phase-1](./phase-1-add-triggers.md) |
| 2 | Metadata: add keywords to skills missing them | 30m | pending | [phase-2](./phase-2-add-keywords.md) |
| 3 | Refs stubs: create references/ for 13 skills | 45m | pending | [phase-3](./phase-3-refs-stubs.md) |
| 4 | Evals stubs: create evals/ for 14 skills | 45m | pending | [phase-4](./phase-4-evals-stubs.md) |

## Constraints

- ALL edits in `packages/` — never `.claude/`
- Keywords must be skill-specific, not generic
- Triggers must be realistic user phrases or slash commands
- After all phases: run `node .claude/scripts/generate-skill-index.cjs`
- Run quality scoring script to verify all 33 targets ≥8/10

## Success Criteria

1. All 33 target skills score ≥8/10 on re-audit
2. No skill has empty `triggers:` or `keywords:` arrays
3. `skill-index.json` regenerated and valid
4. Zero edits in `.claude/` directory
