---
date: 2026-03-11
agent: epost-planner
plan: plans/260311-1711-web-platform-to-9/plan.md
status: READY
---

# Plan Report: Web Platform DX 8/10 to 9/10

## Executive Summary

6-phase plan to upgrade web developer experience from 8/10 to 9/10. Four phases upgrade existing Medium-impact features (routing, build gate, known-findings, git manager) to High-impact. Two phases add new capabilities (visual regression testing, auto re-audit after fix).

## Plan Details

| # | Phase | Effort | Deps |
|---|-------|--------|------|
| 1 | Smart Routing reliability for web workflows | 2h | none |
| 2 | Build Gate enhancement (fix suggestions + error linking) | 2h | none |
| 3 | Known-Findings auto-surfacing in context | 2h | none |
| 4 | Git Manager consistent routing | 1h | P1 |
| 5 | Visual Regression Testing skill | 3h | none |
| 6 | Auto Re-Audit after fix | 2h | P3 |

**Total effort**: 12h across 6 phases.
**Critical path**: P1 -> P4 (3h), P3 -> P6 (4h). Phases 2 and 5 are fully independent.

## Key Files

- Routing: `packages/core/CLAUDE.snippet.md`
- Build gate: `packages/core/hooks/lib/build-gate.cjs`
- Known findings: `.epost-data/ui/known-findings.json` (new hook), `packages/core/hooks/package.yaml`
- Git manager: `packages/core/agents/epost-git-manager.md`
- Visual regression: `packages/core/skills/test/references/visual-mode.md` (new)
- Auto re-audit: `packages/core/skills/fix/references/ui-mode.md`

## Verdict

**READY** -- all phases have specific file targets, clear acceptance criteria, and no blockers.

## Dependencies

- PLAN-0067 (CLAUDE.md Natural Routing) overlaps with Phase 1 -- check status before starting
- PLAN-0070 (Build-Gate PreToolUse Hook) -- Phase 2 builds on this; already implemented

## Unresolved Questions

1. PLAN-0067 status -- is the routing rewrite done? If so, Phase 1 adapts to its output rather than the current snippet.
2. Known-findings DB adoption -- `.epost-data/` directories may not exist in most consumer projects yet. Phase 3 handles this gracefully but the feature's value depends on `/audit` usage.
3. Visual regression Storybook integration -- should this be a separate phase or part of Phase 5? Currently bundled.
