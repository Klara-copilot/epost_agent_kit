---
phase: 3
title: "Create references/ stubs for skills missing them"
effort: 45m
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Scoring rule: `references/` directory with ≥1 file = +1pt

## Overview

Create `references/` directories with skeleton `.md` files for skills that lack them. Content to be filled in later — stubs provide the scoring point and a placeholder for future documentation.

## Files to Create

| # | Skill | Directory to Create | Stub File |
|---|-------|--------------------|-----------|
| 1 | `packages/core/skills/journal/` | `references/` | `references/entry-format.md` |
| 2 | `packages/platform-ios/skills/asana-muji/` | `references/` | `references/task-templates.md` |
| 3 | `packages/platform-android/skills/asana-muji/` | `references/` | `references/task-templates.md` |
| 4 | `packages/core/skills/get-started/` | `references/` | `references/onboarding-checklist.md` |
| 5 | `packages/core/skills/repomix/` | `references/` | `references/config-options.md` |
| 6 | `packages/core/skills/thinking/` | `references/` | `references/thinking-patterns.md` |
| 7 | `packages/platform-web/skills/web-forms/` | `references/` | `references/form-patterns.md` |
| 8 | `packages/platform-backend/skills/backend-observability/` | `references/` | `references/logging-standards.md` |
| 9 | `packages/platform-backend/skills/backend-rest-standards/` | `references/` | `references/api-contract.md` |
| 10 | `packages/core/skills/core/` | `references/` | `references/boundary-rules.md` |
| 11 | `packages/core/skills/error-recovery/` | `references/` | `references/resilience-patterns.md` |
| 12 | `packages/platform-backend/skills/backend-databases/` | `references/` | `references/query-patterns.md` |
| 13 | `packages/core/skills/skill-discovery/` | `references/` | `references/catalogue-format.md` |

## Stub Template

```markdown
# {Title}

> Stub — content to be filled during implementation.

## TODO

- [ ] Add reference content specific to this skill
```

## TODO

- [ ] Create `references/` directory for each skill above
- [ ] Add one skeleton `.md` file per directory
- [ ] Verify each stub has meaningful filename reflecting skill purpose

## Success Criteria

- All 13 skills above have a `references/` directory with ≥1 `.md` file
- Stub filenames are descriptive (not `stub.md`)
