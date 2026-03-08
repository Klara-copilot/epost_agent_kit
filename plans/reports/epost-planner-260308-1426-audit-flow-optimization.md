# epost-planner: Optimize Audit & Code-Review Flows

**Date**: 2026-03-08 14:26
**Agent**: epost-planner
**Plan**: `plans/260308-1426-audit-flow-optimization/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Created 4-phase plan to fix 6 gaps in audit/code-review flows: duplicated report template sections, consumer rules mixed into workflow, wrong agent skill lists, vague escalation instructions, undocumented lightweight review scope. One gap (missing close-a11y.md) was already resolved.

---

## Methodology

| | |
|--|--|
| **Files Scanned** | `packages/core/skills/code-review/references/report-template.md`, `packages/core/skills/audit/references/audit-report-schema.md`, `packages/core/skills/audit/references/ui.md`, `packages/design-system/skills/ui-lib-dev/references/audit-standards.md`, `packages/design-system/agents/epost-muji.md`, `packages/core/agents/epost-code-reviewer.md`, `packages/core/skills/code-review/SKILL.md`, `packages/core/skills/audit/SKILL.md`, `packages/core/skills/core/references/report-standard.md`, `packages/core/skills/audit/references/close-a11y.md` |
| **KB Layers** | L4 Grep/Glob (file discovery) |
| **Standards Source** | User-provided gap analysis, existing skill files |
| **Coverage Gaps** | None |

---

## Plan Details

| # | Phase | Effort | Files Modified | Parallel |
|---|-------|--------|----------------|----------|
| 1 | Shared report schema | 1h | report-standard.md, report-template.md, audit-report-schema.md, ui.md | Yes |
| 2 | Consumer audit standards extraction | 45m | ui.md (refactor steps 1a-1h to reference audit-standards.md) | Yes |
| 3 | Agent skill lists + scope docs | 45m | epost-muji.md, epost-code-reviewer.md, code-review/SKILL.md | Yes |
| 4 | Verify close-a11y.md | 5m | None (already resolved) | Yes |

**Key finding**: Gap 7 (close-a11y.md missing) is already resolved -- file exists with complete workflow content.

**Key finding**: Gap 2 originally called for creating `consumer-audit-standards.md`. Analysis shows consumer rules already exist in `audit-standards.md` (PLACE, REUSE, TW, DRY, REACT, POC sections). The fix is to remove duplication from `ui.md`, not create a new file.

---

## Verdict

**READY** -- all gaps have clear, surgical fixes; no research needed; all phases independent.

---

*Unresolved questions:*
- None
