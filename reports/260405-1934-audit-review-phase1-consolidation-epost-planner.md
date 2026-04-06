---
date: 2026-04-05
agent: epost-planner
plan: plans/260405-1934-audit-review-phase1-consolidation/plan.md
status: complete
---

# Plan Report: Audit/Code-Review Phase 1 — Consolidate + Role Clarify

## Executive Summary

Created 3-phase parallel plan to consolidate fragmented audit/code-review standards (120+ rules across 7 files) into a single authoritative source, clarify `/audit` vs `/review` entry points, and unify the output contract with cross-DB dedup.

## Plan Details

| Attribute | Value |
|-----------|-------|
| Plan ID | PLAN-0098 |
| Directory | `plans/260405-1934-audit-review-phase1-consolidation/` |
| Phases | 3 (all parallelizable) |
| Effort | 6h total |
| Platforms | all (kit authoring) |
| Breaking | No |

### Phases

| # | Phase | Effort | Files | Parallelizable |
|---|-------|--------|-------|----------------|
| 1 | Unify standards (merge ui-lib-dev audit rules into code-review-standards.md) | 2.5h | 3 files | Yes |
| 2 | Clarify entry points (rewrite descriptions, deduplicate triggers) | 2h | 3 files | Yes |
| 3 | Unify output contract + cross-DB dedup | 1.5h | 4 files | Yes |

### File Ownership Matrix (no overlap)

| File | Phase |
|------|-------|
| `packages/core/skills/code-review/references/code-review-standards.md` | 1 |
| `packages/design-system/skills/ui-lib-dev/references/audit-standards.md` | 1 |
| `packages/design-system/skills/ui-lib-dev/references/audit-ui.md` | 1 |
| `packages/core/skills/audit/SKILL.md` | 2 |
| `packages/core/skills/code-review/SKILL.md` | 2 |
| `packages/core/CLAUDE.md` | 2 |
| `packages/core/skills/audit/references/report-template.md` | 3 |
| `packages/core/skills/audit/references/output-contract.md` | 3 |
| `packages/core/skills/code-review/references/report-template.md` | 3 |
| `packages/core/skills/code-review/references/report-standard.md` | 3 |

## Verdict

**READY** — all phases have clear file ownership, no blocking dependencies, all source files verified to exist.

## Unresolved Questions

1. **Line budget**: code-review-standards.md will grow from 179 to ~350 lines. Should we split into multiple reference files instead (e.g., `code-standards.md` + `klara-standards.md`) with a shared index? Current plan keeps single file.
2. **Consumer rules scope**: Consumer integration rules (INT, PL, RU, etc.) are specific to klara-theme consumers. Should they live in code-review-standards or stay closer to ui-lib-dev? Current plan: move to code-review-standards as subsection.
3. **CLAUDE.md location**: `packages/core/CLAUDE.md` may not be the only CLAUDE.md with skill catalogue entries. Root CLAUDE.md may also need updates — implementer should check both.
