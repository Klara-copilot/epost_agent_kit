---
phase: 4
title: "Create evals/ stubs for skills missing them"
effort: 45m
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Scoring rule: `evals/` directory with eval file = +1pt

## Overview

Create `evals/eval-set.json` stubs for skills that lack evals. Skeleton JSON provides the scoring point. Actual eval cases to be authored later per skill-creator methodology.

## Files to Create

| # | Skill | File to Create |
|---|-------|----------------|
| 1 | `packages/platform-ios/skills/asana-muji/` | `evals/eval-set.json` |
| 2 | `packages/platform-android/skills/asana-muji/` | `evals/eval-set.json` |
| 3 | `packages/platform-ios/skills/theme-color-system/` | `evals/eval-set.json` |
| 4 | `packages/core/skills/skill-creator/` | `evals/eval-set.json` |
| 5 | `packages/core/skills/research/` | `evals/eval-set.json` |
| 6 | `packages/platform-web/skills/web-forms/` | `evals/eval-set.json` |
| 7 | `packages/platform-backend/skills/backend-observability/` | `evals/eval-set.json` |
| 8 | `packages/platform-backend/skills/backend-rest-standards/` | `evals/eval-set.json` |
| 9 | `packages/core/skills/deploy/` | `evals/eval-set.json` |
| 10 | `packages/core/skills/retro/` | `evals/eval-set.json` |
| 11 | `packages/platform-backend/skills/backend-auth/` | `evals/eval-set.json` |
| 12 | `packages/platform-backend/skills/backend-quarkus/` | `evals/eval-set.json` |
| 13 | `packages/domains/skills/multi-tenancy/` | `evals/eval-set.json` |
| 14 | `packages/platform-ios/skills/simulator/` | `evals/eval-set.json` |

Note: `simulator` already has evals per audit data — verify before creating. Also check `find-skill` and `whatsnew` which had no evals.

Additional skills to check:
| 15 | `packages/core/skills/find-skill/` | `evals/eval-set.json` |
| 16 | `packages/core/skills/whatsnew/` | `evals/eval-set.json` |
| 17 | `packages/core/skills/didyouknow/` | `evals/eval-set.json` |

## Stub Template

```json
{
  "skill": "{skill-name}",
  "version": "1.0.0",
  "evals": [
    {
      "id": "eval-001",
      "description": "TODO: Add eval description",
      "input": "TODO: Add test input",
      "expected": "TODO: Add expected behavior",
      "status": "stub"
    }
  ]
}
```

## TODO

- [ ] Verify which skills already have `evals/` (skip those)
- [ ] Create `evals/` directory + `eval-set.json` for each missing
- [ ] Each stub has correct skill name in `"skill"` field

## Success Criteria

- All target skills have an `evals/` directory with `eval-set.json`
- JSON files are valid (parseable)
- Skill name in each stub matches the actual skill
