---
title: "Web Platform DX: 8/10 to 9/10"
status: archived
created: 2026-03-11
updated: 2026-03-11
effort: 12h
phases: 6
platforms: [web]
breaking: false
---

# Web Platform DX: 8/10 to 9/10

## Summary

Six targeted improvements to close the gap from 8/10 to 9/10 for web developers. Four upgrade existing Medium-impact features to High-impact; two add new capabilities (visual regression testing, auto re-audit after fix).

## Key Dependencies

- PLAN-0067 (CLAUDE.md Natural Routing) — Phase 1 overlaps; coordinate or sequence after
- PLAN-0070 (Build-Gate PreToolUse Hook) — Phase 2 builds on existing hook implementation
- Known-findings DB schema from `audit/references/ui-findings-schema.md`
- Playwright already in web tech stack (Jest + Playwright)

## Execution Strategy

Phases 1-4 are independent improvements to existing features (can run in any order). Phase 5 (visual regression) is standalone. Phase 6 (auto re-audit) depends on Phase 3 (known-findings surfacing).

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Smart Routing reliability for web workflows | 2h | pending | [phase-1](./phase-1-smart-routing.md) |
| 2 | Build Gate enhancement — fix suggestions + error linking | 2h | pending | [phase-2](./phase-2-build-gate-enhance.md) |
| 3 | Known-Findings auto-surfacing in context | 2h | pending | [phase-3](./phase-3-known-findings-surfacing.md) |
| 4 | Git Manager consistent routing | 1h | pending | [phase-4](./phase-4-git-manager-routing.md) |
| 5 | Visual Regression Testing skill | 3h | pending | [phase-5](./phase-5-visual-regression.md) |
| 6 | Auto Re-Audit after fix | 2h | pending | [phase-6](./phase-6-auto-reaudit.md) |

## Critical Constraints

- All changes in `packages/` (never edit `.claude/` directly)
- PLAN-0067 may conflict with Phase 1 routing changes — check status before starting
- Known-findings DB may not exist yet (`reports/known-findings/` is empty) — Phase 3 must handle missing DB gracefully

## Success Criteria

- [ ] "commit and push" always routes to epost-git-manager (never handled inline)
- [ ] Build gate failure output includes top 3 error lines + suggested fix action
- [ ] Editing a file with known findings triggers a contextual warning
- [ ] Natural web prompts ("make login faster", "this page is broken") route correctly without clarification
- [ ] `/test --visual` runs Playwright screenshot comparison
- [ ] After `/fix --ui` completes, targeted re-audit runs automatically on changed files
