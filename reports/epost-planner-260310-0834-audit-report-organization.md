# Plan: Audit Report Organization

**Date**: 2026-03-10 08:34
**Agent**: epost-planner
**Plan**: `plans/260310-0834-audit-report-organization/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Created a 3-phase plan to organize audit reports into dated folders and formalize the `.epost-data/{topic}/known-findings.json` store for a11y, ui, and code domains. Extends the existing audit session-folder pattern (PLAN-0064b) to cover all report types, not just audits. Known-findings schemas already exist for a11y and UI; code schema needs creation.

---

## Plan Details

| Attribute | Value |
|-----------|-------|
| Phases | 3 |
| Total effort | 3h |
| Platforms | all |
| Breaking | no |
| Mode | fast (codebase analysis only) |

### Phases

| # | Phase | Effort |
|---|-------|--------|
| 1 | Known-findings JSON store per topic (a11y/ui/code) | 1h |
| 2 | Dated report folders for all report types | 1.5h |
| 3 | Index protocol + report standard cross-refs + sync | 30m |

### Key Files to Modify

- `packages/core/skills/audit/references/output-contract.md`
- `packages/core/skills/core/references/report-standard.md`
- `packages/core/skills/core/references/index-protocol.md`
- `packages/core/skills/code-review/references/code-known-findings-schema.md` (create if missing)
- Agent system prompts (planner, researcher, code-reviewer, tester)

---

## Verdict

**READY** -- all dependencies are in place, schemas exist for 2/3 topics, clear scope.

---

*Unresolved questions:*
- Should PLAN-0064b (audit-session-folder-pattern) be archived as superseded by this plan, or kept as a narrower companion?
- Do plan-scoped reports (`plans/{dir}/reports/`) follow the same `{YYMMDD-HHMM}-{slug}/` subfolder pattern, or stay flat within the plan's reports dir?
