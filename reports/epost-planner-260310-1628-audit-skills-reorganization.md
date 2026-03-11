---
date: 2026-03-10
agent: epost-planner
plan: plans/260310-1628-audit-skills-reorganization/plan.md
status: READY
---

# Plan Report: Audit Skills References Reorganization

## Executive Summary

Reorganize `packages/core/skills/audit/references/` from flat 14-file dir into subdirectories: top-level (orchestration/schema), `ui/` (5 files), `a11y/` (4 files). 9 files move/rename, 5 stay. Decision: `web-wcag-reference.md` stays in `web-a11y` package (3 internal refs would break).

## Plan Details

| Phase | Description | Effort |
|-------|-------------|--------|
| 1 | Create dirs, move + rename 10 files | 20m |
| 2 | Update cross-references in 9 files across 5 packages | 1h |
| 3 | Run epost-kit init, verify zero broken refs | 20m |

**Total effort**: 2h

### Files affected by reference updates (Phase 2)

- `packages/core/skills/audit/SKILL.md` — 25 path refs
- `packages/core/skills/audit/references/` — 8 internal files have cross-refs
- `packages/design-system/agents/epost-muji.md` — 5 refs
- `packages/a11y/agents/epost-a11y-specialist.md` — 6 refs
- `packages/core/skills/core/references/report-standard.md` — 2 refs
- `packages/core/skills/fix/references/ui-mode.md` — 1 ref
- `packages/core/skills/review/references/ui-mode.md` — 1 ref

### Files NOT affected (paths unchanged)

- `output-contract.md`, `delegation-templates.md`, `report-template.md`, `session-json-schema.md`
- `packages/core/agents/epost-code-reviewer.md`
- `packages/core/skills/code-review/SKILL.md`
- `packages/core/CLAUDE.snippet.md`

## Verdict

**READY** -- no research needed, all paths mapped, no external dependencies.

## Unresolved Questions

None.
