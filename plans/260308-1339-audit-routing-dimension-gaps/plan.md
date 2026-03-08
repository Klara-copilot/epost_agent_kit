---
title: "Fix audit routing, missing dimensions, pre-audit KB load, and report consolidation"
status: done
created: 2026-03-08
updated: 2026-03-08
effort: 3.5h
phases: 4
platforms: [all]
breaking: false
---

# Fix Audit Routing, Missing Dimensions, and Pre-Audit KB Load

## Problem

A smart-letter-composer audit (80+ files) exposed 3 systemic gaps:
1. Code-reviewer delegation rule is binary — no complexity gate for feature modules
2. Library mode audit-standards.md lacks SEC/PERF/LDRY dimensions
3. No pre-audit KB doc load — agents skip `docs/index.json` component entries

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Complexity-gated routing + Template A+ | 1h | done | [phase-1](./phase-01-routing-template.md) |
| 2 | Library mode SEC/PERF/LDRY dimensions | 1h | done | [phase-2](./phase-02-lib-dimensions.md) |
| 3 | Pre-audit KB doc load | 1h | done | [phase-3](./phase-03-kb-load.md) |
| 4 | Single consolidated report output | 0.5h | done | [phase-4](./phase-04-single-report-output.md) |

## Dependencies

- Phase 1, 2, 3, 4 are independent — can execute in parallel
- No new files except additions to delegation-templates.md

## Success Criteria

- [ ] Code-reviewer routes feature modules (20+ files OR multi-subdir) to hybrid mode
- [ ] Template A+ exists in delegation-templates.md for scoped UI-standards delegation
- [ ] audit-standards.md has SEC (5 rules), PERF (4 rules), LDRY (3 rules) with mode applicability
- [ ] ui.md Library mode has Steps 3b/3c/3d after existing Step 3
- [ ] Both code-reviewer and muji agents have Pre-Audit KB Load step
- [ ] muji Task-Type Routing table has feature module row
- [ ] code-review SKILL.md explicitly prohibits separate `.json` output files
- [ ] audit ui.md changes dual-output to single `.md` with embedded JSON block
- [ ] Orchestrator consolidation rule: sub-reports are source material, not deliverables
