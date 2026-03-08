# epost-planner: Update epost-code-reviewer Agent and Related Code

**Date**: 2026-03-07 12:15
**Agent**: epost-planner
**Plan**: `plans/260307-1159-update-code-reviewer/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Evaluated the epost-code-reviewer agent (289 lines) and its associated skills. Agent is bloated with duplicated content — full OWASP list, severity tables, report templates all repeated from `code-review` SKILL.md. Contains stale references to non-existent files/agents. Plan created: 2 phases to slim agent to <80 lines and clean up skill files.

---

## Plan Details

- **Directory**: `plans/260307-1159-update-code-reviewer/`
- **Phases**: 2 phases
- **Effort**: 2h
- **Platforms**: all (kit authoring)

## Sources Analyzed

- `packages/core/agents/epost-code-reviewer.md` — agent source of truth (289 lines)
- `packages/core/skills/code-review/SKILL.md` — code-review skill (123 lines)
- `packages/core/skills/code-review/references/report-template.md` — report template
- `packages/core/skills/code-review/references/receiving.md` — receiving review skill
- `packages/core/skills/review/SKILL.md` — unified review command
- `packages/core/skills/review/references/code.md` — review-code workflow
- `packages/core/skills/review/references/improvements.md` — review-improvements
- `core/references/workflow-code-review.md` — workflow definition

## Files to Touch

| File | Action | Phase |
|------|--------|-------|
| `packages/core/agents/epost-code-reviewer.md` | Rewrite (289->~70 lines) | Phase 1 |
| `packages/core/skills/code-review/SKILL.md` | Update routing table, add OWASP ref | Phase 2 |
| `packages/core/skills/review/references/code.md` | Fix `epost-git-manager` ref | Phase 2 |

## Key Dependencies

- Must edit in `packages/` not `.claude/` (source of truth)
- Run `epost-kit init` after changes to regenerate `.claude/`

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent loses context it needs at runtime | Med | Verify all removed content exists in skill files |
| Stale skill-index after changes | Low | Regenerate via init |

---

## Verdict

**READY** — Plan is complete, all issues verified, files identified. Ready for implementation.

---

*Unresolved questions:*
- None
