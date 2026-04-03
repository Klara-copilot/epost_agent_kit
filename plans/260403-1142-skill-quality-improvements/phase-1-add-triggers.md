---
phase: 1
title: "Add metadata.triggers to all 33 target skills"
effort: 1h
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Scoring rule: `metadata.triggers` with content = +1pt

## Overview

Add `triggers:` array with realistic user phrases to every target skill missing them. For skills that already have an empty `triggers:` key, populate it. For skills with no `triggers:` key at all, add it under `metadata:`.

## Requirements

Each `triggers:` array needs 2-5 entries: slash commands and/or natural language phrases that would activate the skill.

## Files to Modify

### Priority tier (≤6/10) — 12 skills

| # | File | Triggers to Add |
|---|------|-----------------|
| 1 | `packages/core/skills/journal/SKILL.md` | `/journal`, `log this decision`, `write journal entry` |
| 2 | `packages/platform-ios/skills/asana-muji/SKILL.md` | `/asana`, `create asana task`, `update asana status` |
| 3 | `packages/platform-android/skills/asana-muji/SKILL.md` | `/asana`, `create asana task`, `update asana status` |
| 4 | `packages/platform-ios/skills/theme-color-system/SKILL.md` | `set background color`, `UIView color`, `apply theme color` |
| 5 | `packages/core/skills/skill-creator/SKILL.md` | `/skill-creator`, `create a skill`, `validate skill`, `write evals` |
| 6 | `packages/a11y/skills/a11y/SKILL.md` | `accessibility audit`, `WCAG check`, `a11y score` |
| 7 | `packages/core/skills/get-started/SKILL.md` | `/get-started`, `onboard me`, `I'm new to this project` |
| 8 | `packages/core/skills/repomix/SKILL.md` | `/repomix`, `pack this repo`, `bundle codebase` |
| 9 | `packages/core/skills/research/SKILL.md` | Already has triggers — SKIP |
| 10 | `packages/core/skills/thinking/SKILL.md` | `think deeply`, `extended thinking`, `step by step` |
| 11 | `packages/platform-web/skills/web-forms/SKILL.md` | Already has triggers — SKIP |
| 12 | `packages/platform-backend/skills/backend-observability/SKILL.md` | Already has triggers — SKIP |
| 13 | `packages/platform-backend/skills/backend-rest-standards/SKILL.md` | Already has triggers — SKIP |

### Standard tier (7/10) — 19 skills needing triggers

| # | File | Triggers to Add |
|---|------|-----------------|
| 14 | `packages/core/skills/cook/SKILL.md` | `/cook`, `implement this`, `build the feature`, `continue the plan` |
| 15 | `packages/core/skills/debug/SKILL.md` | Already has triggers — SKIP |
| 16 | `packages/core/skills/docs/SKILL.md` | `/docs`, `document this`, `update docs`, `init knowledge base` |
| 17 | `packages/core/skills/fix/SKILL.md` | `/fix`, `fix this bug`, `apply the fix`, `patch this` |
| 18 | `packages/core/skills/git/SKILL.md` | `/git`, `commit this`, `push`, `create PR`, `ship it` |
| 19 | `packages/core/skills/plan/SKILL.md` | Already has triggers — SKIP |
| 20 | `packages/core/skills/test/SKILL.md` | `/test`, `run tests`, `add test coverage`, `write tests for` |
| 21 | `packages/core/skills/loop/SKILL.md` | `/loop`, `keep iterating`, `run until target met` |
| 22 | `packages/core/skills/retro/SKILL.md` | `/retro`, `sprint retrospective`, `how did we do` |
| 23 | `packages/platform-ios/skills/simulator/SKILL.md` | `boot simulator`, `list simulators`, `open simulator` |
| 24 | `packages/platform-backend/skills/backend-auth/SKILL.md` | Already has triggers — SKIP |
| 25 | `packages/platform-backend/skills/backend-databases/SKILL.md` | `database query`, `postgres schema`, `mongodb collection` |
| 26 | `packages/platform-backend/skills/backend-quarkus/SKILL.md` | Already has triggers — SKIP |
| 27 | `packages/platform-backend/skills/backend-javaee/SKILL.md` | `jakarta ee`, `wildfly deploy`, `jax-rs endpoint` |
| 28 | `packages/domains/skills/multi-tenancy/SKILL.md` | Already has triggers — SKIP |
| 29 | `packages/core/skills/core/SKILL.md` | `check rules`, `what are the boundaries`, `core rules` |
| 30 | `packages/kit/skills/kit/SKILL.md` | `/kit`, `scaffold agent`, `create skill`, `manage hooks` |
| 31 | `packages/core/skills/error-recovery/SKILL.md` | `add retry`, `circuit breaker`, `graceful degradation` |
| 32 | `packages/core/skills/subagents-driven/SKILL.md` | `parallel tasks`, `dispatch subagents`, `multi-task execution` |
| 33 | `packages/core/skills/tdd/SKILL.md` | `/tdd`, `test first`, `red green refactor` |

Also add triggers to these additional skills missing them (from audit output):
- `packages/core/skills/clean-code/SKILL.md` — `clean up code`, `naming conventions`, `refactor for clarity`
- `packages/core/skills/preview/SKILL.md` — `/preview`, `visualize this`, `draw a diagram`
- `packages/core/skills/deploy/SKILL.md` — `/deploy`, `deploy this`, `push to production`
- `packages/core/skills/code-review/SKILL.md` — `/review`, `review this code`, `check before commit`
- `packages/a11y/skills/android-a11y/SKILL.md` — `android accessibility`, `talkback fix`, `compose semantics`
- `packages/a11y/skills/ios-a11y/SKILL.md` — `voiceover fix`, `ios accessibility`, `dynamic type`
- `packages/a11y/skills/web-a11y/SKILL.md` — `aria fix`, `keyboard navigation`, `web accessibility`
- `packages/platform-web/skills/web-ui-lib/SKILL.md` — `klara component`, `theme variant`, `ui-lib usage`
- `packages/platform-ios/skills/ios-ui-lib/SKILL.md` — `ios component`, `swiftui token`, `theme mapping`
- `packages/platform-android/skills/android-ui-lib/SKILL.md` — `android component`, `compose token`, `material mapping`
- `packages/domains/skills/domain-b2c/SKILL.md` — `consumer app`, `b2c feature`, `mobile mail`

## TODO

- [ ] Add triggers to each skill listed above (skip those marked SKIP)
- [ ] Verify no empty `triggers:` arrays remain
- [ ] Each triggers entry is a realistic activation phrase

## Success Criteria

- All 33 target skills have populated `metadata.triggers` arrays
- Each array has 2-5 entries
- Triggers are specific to the skill's actual purpose
