---
title: "Adopt Anthropic Skill-Creator Methodology"
status: archived
created: 2026-03-31
updated: 2026-03-31
effort: 4h
phases: 4
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Adopt Anthropic Skill-Creator Methodology

## Summary

Add eval infrastructure to epost_agent_kit: a `skill-creator` skill with schemas, workflow docs, and a deterministic eval runner script. Then retrofit 3 high-value skills with evals + theory-of-mind instruction style, and add trigger-evals for top 5 skills.

## Key Dependencies

- `packages/core/scripts/` — add `run-skill-eval.cjs`
- `packages/core/package.yaml` — register new skill + script
- `packages/core/skills/generate-skill-index.cjs` — add `skill-creator` to CATEGORY_MAP
- Prior art: PLAN-0043 (kit-skill-development enrichment, archived) — no overlap; that plan targeted `packages/kit/`, this targets `packages/core/`

## Execution Strategy

Sequential: Phase 1 creates tooling, Phase 2 uses it on 3 skills, Phase 3 adds trigger evals, Phase 4 wires into indexes.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Eval infrastructure + skill-creator skill | 1.5h | pending | [phase-1](./phase-1-eval-infrastructure.md) |
| 2 | Retrofit 3 skills with evals + theory-of-mind | 1.5h | pending | [phase-2](./phase-2-retrofit-skills.md) |
| 3 | Trigger evals for top 5 skills | 0.5h | pending | [phase-3](./phase-3-trigger-evals.md) |
| 4 | Register skill + update indexes | 0.5h | pending | [phase-4](./phase-4-register-indexes.md) |

## Critical Constraints

- `run-skill-eval.cjs` is deterministic — no LLM calls, no cost
- Theory-of-mind changes must not alter behavior, only instruction phrasing
- All edits in `packages/core/` (source of truth); `.claude/` is generated output
- Skill body < 500 lines per Anthropic's progressive disclosure cap

## Success Criteria

- [ ] `packages/core/skills/skill-creator/SKILL.md` exists with workflow + schemas
- [ ] `packages/core/scripts/run-skill-eval.cjs` runs and grades `evals.json` files
- [ ] 3 skills (plan, debug, code-review) each have `evals/evals.json` with 3 test cases
- [ ] 5 skills have `evals/trigger-evals.json` with 20 queries each
- [ ] `skill-index.json` includes `skill-creator` in `quality` category
- [ ] CLAUDE.md routes "create evals", "test skill", "measure skill quality" to skill-creator
