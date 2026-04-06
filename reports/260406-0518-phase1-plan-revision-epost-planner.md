---
date: 2026-04-06
agent: epost-planner
plan: plans/260405-1934-audit-review-phase1-consolidation/plan.md
status: READY
---

# Plan Revision: Platform-Aware Code Review

## Executive Summary

Rewrote PLAN-0098 from "consolidate all rules into one file" to "split rules by platform, make code-review a platform-aware orchestrator." 3 old phases replaced with 5 new phases. Key architectural decision: **Option A (flag injection)** — code-review stays as subagent, platform rules passed via caller prompt. No subagent constraint violation.

## Plan Details

| Aspect | Old Plan | New Plan |
|--------|----------|----------|
| Phases | 3 (all parallel) | 5 (P1 sequential, then P2-P5 parallel) |
| Effort | 6h | 8h |
| Architecture | Monolithic standards file | Platform-distributed rules + orchestrator |
| code-review role | Passive rule consumer | Platform-aware rule loader |
| Subagent model | Unchanged | Unchanged (Option A — flag injection) |

### Phases

1. **Cross-cutting extraction** (1.5h) — strip PERF/TS/STATE from code-review-standards.md → 22 rules remain
2. **Platform dispatch skeleton** (2h) — rewrite code-review/SKILL.md with platform detection + rule loading
3. **Web rules file** (1.5h) — new `web-frontend/references/code-review-rules.md` with 16 rules
4. **Backend/iOS/Android stubs** (1h) — 3 new files, 8/6/6 rules each
5. **Entry points + output contract** (2h) — routing clarity, verdict formula, cross-DB dedup

### Key Decision: Option A

code-review stays as subagent. Platform dispatch via flag injection — caller detects platform from file extensions and passes `Platform: {name}` + `Platform rules: {path}` in the Agent tool prompt. code-review reads the referenced file and applies rules.

**Why not Option B** (inline orchestrator): Would require changing code-review's execution model, audit's dispatch logic, and violate the principle that code-review is a focused reviewer, not an orchestrator.

## Verdict

**READY** — plan activated, all 5 phase files written. Run `/cook` to begin.

## Unresolved Questions

1. **Klara-theme rules**: Currently in `ui-lib-dev/references/audit-standards.md` (muji-owned). Should the web code-review-rules.md include a subset, or always defer to muji? Current plan: pointer only, no duplication.
2. **Multi-platform files**: If a PR has both `.tsx` and `.java` files, code-review loads both web + backend rules. Is the merged report sufficient, or should there be per-platform sections?
3. **Existing lightweight/escalated split**: The 50%/100% rule split is web-centric. Backend/iOS/Android stubs don't have enough rules to justify a split yet. Should stubs have a simplified "all rules always" model?
