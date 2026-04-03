---
phase: 2
title: "Add metadata.keywords to skills missing them"
effort: 30m
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Scoring rule: `metadata.keywords` with content = +1pt

## Overview

Some skills lack `metadata.keywords` entirely. Add skill-specific keyword arrays. This phase is independent of phase 1 — can run in parallel.

## Files to Modify

Skills confirmed missing keywords (no `keywords:` key or empty):

| # | File | Keywords to Add |
|---|------|-----------------|
| 1 | `packages/core/skills/cook/SKILL.md` | `cook`, `implement`, `build`, `feature`, `continue-plan` |
| 2 | `packages/core/skills/core/SKILL.md` | `rules`, `boundaries`, `safety`, `documentation-standards` |
| 3 | `packages/core/skills/docs/SKILL.md` | `docs`, `documentation`, `knowledge-base`, `kb-init`, `changelog` |
| 4 | `packages/core/skills/fix/SKILL.md` | `fix`, `bug`, `patch`, `hotfix`, `error-fix` |
| 5 | `packages/core/skills/git/SKILL.md` | `git`, `commit`, `push`, `pull-request`, `ship` |
| 6 | `packages/core/skills/test/SKILL.md` | `test`, `coverage`, `unit-test`, `e2e`, `test-suite` |
| 7 | `packages/core/skills/skill-creator/SKILL.md` | `skill-creator`, `eval`, `benchmark`, `skill-validation`, `quality` |
| 8 | `packages/platform-ios/skills/asana-muji/SKILL.md` | `asana`, `task-management`, `muji`, `workflow`, `ios-project` |
| 9 | `packages/platform-android/skills/asana-muji/SKILL.md` | `asana`, `task-management`, `muji`, `workflow`, `android-project` |
| 10 | `packages/platform-ios/skills/theme-color-system/SKILL.md` | `color`, `theme`, `uiview`, `uilabel`, `uibutton`, `ios-theme` |
| 11 | `packages/platform-ios/skills/simulator/SKILL.md` | `simulator`, `ios-simulator`, `boot`, `xcrun`, `device` |
| 12 | `packages/domains/skills/domain-b2c/SKILL.md` | `b2c`, `consumer`, `mobile-app`, `mail`, `notifications` |

## TODO

- [ ] Add `metadata.keywords` array to each skill above
- [ ] Keywords are specific to skill purpose (no generic terms)
- [ ] Verify `metadata:` section exists; create if missing

## Success Criteria

- All 12 skills above have populated `metadata.keywords`
- Each array has 4-6 entries derived from skill's actual functionality
