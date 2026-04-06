---
phase: 2
title: "Bug fixes — typo + missing frontmatter"
effort: 20m
depends: []
---

# Phase 2: Bug Fixes

## Context

- Plan: [plan.md](./plan.md)
- Depends on: none

## Files Owned

| File | Action |
|------|--------|
| `packages/platform-web/skills/web-testing/SKILL.md` | Fix typo + remove duplicate block |
| `packages/platform-web/skills/web-auth/SKILL.md` | Add `paths:` frontmatter field |

## Tasks

### B1 — web-testing

- [ ] Find `setupFilesAfterSetup` in SKILL.md and replace with `setupFilesAfterFramework`
- [ ] Find the `## Test Commands` section (~8 lines, contains `npm test`, `npx playwright test`, etc.) and remove it — duplicated from web-frontend

### B2 — web-auth

- [ ] In SKILL.md frontmatter, add `paths:` field after the existing frontmatter fields:
  ```yaml
  paths: ["**/auth-options.ts", "**/[...nextauth]/**", "**/session*.ts", "**/middleware.ts"]
  ```
  This enables file-based auto-trigger when editing auth-related files.

## Validation

```bash
grep -n "setupFilesAfterSetup" packages/platform-web/skills/web-testing/SKILL.md  # should return nothing
grep -n "setupFilesAfterFramework" packages/platform-web/skills/web-testing/SKILL.md  # should return match
grep -n "Test Commands" packages/platform-web/skills/web-testing/SKILL.md  # should return nothing
grep -n "paths:" packages/platform-web/skills/web-auth/SKILL.md  # should return match
```

## Success Criteria

- [ ] Typo fixed: `setupFilesAfterFramework` in web-testing
- [ ] Test Commands block removed from web-testing
- [ ] web-auth frontmatter contains `paths:` with 4 glob patterns
