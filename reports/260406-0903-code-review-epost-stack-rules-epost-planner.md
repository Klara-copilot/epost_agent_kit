---
date: 2026-04-06
agent: epost-planner
plan: plans/260406-0903-code-review-epost-stack-rules/plan.md
status: complete
---

# Plan Report: Code Review Phase 2 — ePost Stack-Specific Rules

## Executive Summary

Created 3-phase plan to add ePost-specific code review rules for the web stack. Extends Phase 1's platform-aware code-review with rules for FetchBuilder, NextAuth+Keycloak, B2B modules, next-intl, and Redux dual-store. 28 new rules across 5 categories (FETCH, AUTH, MOD, I18N, REDUX).

## Plan Details

- **Plan**: `plans/260406-0903-code-review-epost-stack-rules/plan.md`
- **Phases**: 3 (P1+P2 parallel, P3 sequential)
- **Effort**: 5h total
- **Platform**: web only
- **Files created**: 4 new rule files + 1 modified rule file + 1 modified SKILL.md

### Key Decisions

1. **Separate files per skill** — each skill owns its `references/code-review-rules.md`
2. **REDUX in web-frontend** — dual-store is core pattern, not separate skill
3. **Cascading detection** — file-path patterns trigger additive rule loading

### Phase Breakdown

| Phase | What | Effort | Files |
|-------|------|--------|-------|
| P1 | Create FETCH/AUTH/MOD/I18N rule files (4 new files) | 2h | 4 new |
| P2 | Add REDUX section to web-frontend rules | 1h | 1 modified |
| P3 | Update code-review/SKILL.md cascading detection | 2h | 1 modified |

## Verdict

**READY** — all source material exists in skill SKILL.md files. No research needed.

## Unresolved Questions

None — all 3 design questions resolved in plan.
