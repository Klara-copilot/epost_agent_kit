---
phase: 3
title: "Metadata fixes — triggers + staleness warnings"
effort: 20m
depends: []
---

# Phase 3: Metadata Fixes

## Context

- Plan: [plan.md](./plan.md)
- Depends on: none

## Files Owned

| File | Action |
|------|--------|
| `packages/platform-web/skills/web-modules/SKILL.md` | Tighten triggers, add connection |
| `packages/platform-web/skills/web-ui-lib/SKILL.md` | Add staleness warning |

## Tasks

### C1 — web-modules

- [ ] In SKILL.md description/triggers: add "B2B module" and "module screen" to trigger keywords to reduce false matches with generic web-frontend triggers
- [ ] In SKILL.md frontmatter: add `domain-b2b` to the `connections` field. If no `connections` field exists, add one:
  ```yaml
  connections:
    - domain-b2b
  ```

### C2 — web-ui-lib

- [ ] Find the hardcoded entry IDs table (FEAT-0001, CONV-0001, etc.)
- [ ] Add a warning note directly above or below the table:
  ```markdown
  > **Staleness warning**: Entry IDs are hardcoded. Verify against `libs/klara-theme/docs/index.json` before referencing — IDs may have changed.
  ```

## Validation

```bash
grep -n "domain-b2b" packages/platform-web/skills/web-modules/SKILL.md  # should match
grep -n "B2B module" packages/platform-web/skills/web-modules/SKILL.md  # should match
grep -in "staleness" packages/platform-web/skills/web-ui-lib/SKILL.md  # should match
```

## Success Criteria

- [ ] web-modules triggers include B2B-specific keywords
- [ ] web-modules connections includes `domain-b2b`
- [ ] web-ui-lib has staleness warning near entry ID table
