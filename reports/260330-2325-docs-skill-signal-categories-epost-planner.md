# epost-planner: Docs Skill Signal-Based KB Category Selection

**Date**: 2026-03-30 23:25
**Agent**: epost-planner
**Plan**: `plans/260330-2325-docs-skill-signal-categories/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Planned the refactoring of `docs/references/init.md` to replace its hardcoded 7-category KB structure with a signal-based category registry. Core categories (ADR, ARCH, CONV) always activate; 7 optional categories only activate when codebase signals are detected. Adds 3 missing categories: API, INFRA, INTEG.

---

## Plan Details

- **Directory**: `plans/260330-2325-docs-skill-signal-categories/`
- **Phases**: 3 phases
- **Effort**: 2h
- **Platforms**: all

## Methodology

| | |
|--|--|
| **Files Scanned** | `packages/core/skills/docs/references/init.md` — current init workflow (352 lines) |
| **Knowledge Tiers** | L1 docs/ (not applicable), L4 Grep (not needed — scope fully specified) |
| **Standards Source** | `plan/SKILL.md`, `core/references/orchestration.md` |
| **Coverage Gaps** | None — user provided complete spec |

## Files to Touch

| File | Action | Phase |
|------|--------|-------|
| `packages/core/skills/docs/references/kb-categories.json` | Create | Phase 1 |
| `packages/core/skills/docs/references/init.md` | Modify | Phase 2, 3 |

## Key Dependencies

- No external dependencies
- init.md is a reference doc consumed by epost-docs-manager agent

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agents skip category selection step | Med | Numbered step with clear heading |
| Existing repos break on re-init | Low | Additive only — existing dirs/prefixes remain valid |

---

## Verdict

**READY** — scope is well-defined, 2 files to touch, no cross-plan conflicts.

---

*Unresolved questions:*
- None
