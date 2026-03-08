# epost-planner: Update epost-muji and epost-a11y-specialist Agents

**Date**: 2026-03-07 12:30
**Agent**: epost-planner
**Plan**: `plans/260307-1230-update-muji-a11y-agents/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Plan to wire delegation rules, task-type routing tables, and knowledge-retrieval integration into epost-muji and epost-a11y-specialist agents. Both phases are independent (parallel-safe). Changes are additive — no existing content removed.

---

## Plan Details

- **Directory**: `plans/260307-1230-update-muji-a11y-agents/`
- **Phases**: 2 phases (parallel)
- **Effort**: 1.5h (45m each)
- **Platforms**: kit

## Sources Analyzed

- `packages/design-system/agents/epost-muji.md` — Current muji agent (116 lines)
- `packages/a11y/agents/epost-a11y-specialist.md` — Current a11y agent (71 lines)
- `plans/260307-1159-update-code-reviewer/reports/epost-researcher-260307-1227-muji-a11y-agent-gaps.md` — Research report with 7 findings

## Files to Touch

| File | Action | Phase |
|------|--------|-------|
| `packages/design-system/agents/epost-muji.md` | Modify | Phase 1 |
| `packages/a11y/agents/epost-a11y-specialist.md` | Modify | Phase 2 |

## Key Dependencies

- Research report findings (all 7 addressed)
- code-review skill routing table pattern (used as reference model)
- `epost-kit init` must run after edits to regenerate `.claude/` agents

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent token budget exceeded | Med | Keep additions concise, reference skills not duplicate |
| Over-delegation loops | Low | Clear scope boundaries in each agent |

---

## Verdict

**READY** — Both files identified, changes are additive, no blockers.

---

*Unresolved questions:*
- Should muji load `code-review` skill explicitly? Plan says no — code-reviewer delegates via Task tool, muji just receives.
- Should platform-specific a11y skills be in `connections:requires`? Plan says no — skill-discovery handles lazy loading.
