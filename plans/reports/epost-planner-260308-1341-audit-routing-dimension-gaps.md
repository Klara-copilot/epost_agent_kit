---
date: 2026-03-08
agent: epost-planner
plan: 260308-1339-audit-routing-dimension-gaps
status: READY
---

# Plan Report: Fix Audit Routing, Missing Dimensions, and Pre-Audit KB Load

## Executive Summary

Three systemic gaps found during smart-letter-composer audit (80+ files). Plan addresses: (1) binary delegation rule needs complexity gate for feature modules, (2) audit-standards.md lacks SEC/PERF/LDRY for library mode, (3) no pre-audit KB doc load for component-specific conventions.

## Plan Details

| Phase | Description | Effort | Files Changed |
|-------|------------|--------|---------------|
| 1 | Complexity-gated routing + Template A+ | 1h | `packages/core/agents/epost-code-reviewer.md`, `packages/core/skills/audit/references/delegation-templates.md`, `packages/design-system/agents/epost-muji.md` |
| 2 | Library mode SEC/PERF/LDRY dimensions | 1h | `packages/design-system/skills/ui-lib-dev/references/audit-standards.md`, `packages/core/skills/audit/references/ui.md` |
| 3 | Pre-audit KB doc load | 1h | `packages/core/agents/epost-code-reviewer.md`, `packages/design-system/agents/epost-muji.md` |

**Total effort**: 3h
**All phases independent** -- can execute in parallel.

## Key Changes

- **12 new rules**: SEC-001..005, PERF-001..004, LDRY-001..003
- **1 new template**: Template A+ for scoped UI-standards delegation
- **2 agent updates**: code-reviewer gets complexity gate + KB load; muji gets feature module routing + KB load
- **1 workflow update**: ui.md gets Steps 3b/3c/3d for library mode

## Verdict

**READY** -- all source files read, changes are precise edits to existing files, no new dependencies.

## Unresolved Questions

1. Should PERF rules also apply in Consumer mode? Currently set to both modes but consumer code may have different LOC thresholds.
2. Should SEC activation gate also trigger for components using `dangerouslySetInnerHTML`? Not in current spec but related attack surface.
