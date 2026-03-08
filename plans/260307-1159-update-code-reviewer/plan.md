---
title: "Update epost-code-reviewer agent and related code"
status: active
created: 2026-03-07
updated: 2026-03-07
effort: 2h
phases: 2
platforms: [all]
breaking: false
---

# Update epost-code-reviewer Agent and Related Code

## Summary

Clean up stale references, reduce duplication between agent prompt and skills, and modernize the epost-code-reviewer agent. The agent prompt is 289 lines — most content duplicates `code-review` SKILL.md or `review/references/code.md`. Agent should be thin (delegate to skills) not thick (embed all knowledge).

## Key Issues Found

1. **Stale references**: `Explore agent (via Task tool)` (line 42), `.claude/rules/development-rules.md` (line 282, dir doesn't exist), `review-code` / `review-improvements` sub-skill names (line 102-103 in SKILL.md — these are now reference files under `review/`)
2. **Massive duplication**: Agent embeds full OWASP list, severity table, report template — all already in `code-review/SKILL.md` and `code-review/references/report-template.md`
3. **Conflicting report templates**: Agent has inline report format (lines 214-263) AND references `code-review/references/report-template.md` (line 267) — two competing templates
4. **`review/references/code.md` stale ref**: Line 134 references `epost-git-manager` for commit — should reference git commands directly
5. **Agent too verbose**: 289 lines vs recommended thin agent pattern (delegate to skills)

## Key Dependencies

- `packages/core/agents/epost-code-reviewer.md` — source of truth (NOT `.claude/agents/`)
- `packages/core/skills/code-review/SKILL.md` — skill source of truth
- `packages/core/skills/review/references/code.md` — review-code workflow source

## Execution Strategy

Phase 1: Slim down agent, fix stale refs. Phase 2: Clean up skill files.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Slim agent, fix stale references | 1h | pending | [phase-1](./phase-01-slim-agent.md) |
| 2 | Clean up skill files | 1h | pending | [phase-2](./phase-02-clean-skills.md) |

## Success Criteria

- [ ] Agent < 80 lines, delegates all detail to skills
- [ ] No stale references to non-existent files/agents
- [ ] Single report template (in skill reference, not agent)
- [ ] No duplicated OWASP/severity/report content between agent and skill
