---
name: docs-update
description: "(ePost) Update existing documentation or scan for staleness"
user-invocable: true
context: fork
agent: epost-documenter
metadata:
  argument-hint: "[what to update | --scan]"
  keywords:
    - docs-update
    - documentation
    - stale-docs
    - refresh-docs
  platforms:
    - all
---

# Docs Update

Update existing documentation to reflect code changes, or scan for staleness.

## Usage

```
/docs-update [what needs updating]    # update specific sections
/docs-update --scan                   # scan freshness, suggest updates
```

## Mode Detection

- `$ARGUMENTS` contains `--scan` or `scan` or `status` → **Scan Mode**
- Otherwise → **Update Mode**

## Scan Mode

Check docs/ freshness and suggest targeted updates:

1. **List docs/**: `Glob("docs/**/*.md")`
2. **Check staleness** for each file:
   ```bash
   git log -1 --format="%ci" -- {file}
   ```
   - **< 30 days**: current
   - **30-90 days**: STALE
   - **> 90 days**: OUTDATED
3. **Cross-reference with code changes**: compare doc topics against recent git activity
   ```bash
   git log --since="30 days ago" --name-only --format="" | sort -u | head -30
   ```
4. **Report**:
   ```markdown
   ## Documentation Status

   | File | Last Updated | Status | Suggested Action |
   |------|-------------|--------|-----------------|
   | docs/api-routes.md | 45 days ago | STALE | API files changed recently |
   | docs/codebase-summary.md | 12 days ago | Current | — |
   ```
5. **Ask user**: which files to update, or offer to update all stale ones

## Update Mode

Update specific documentation:

1. Identify what changed in code (from `$ARGUMENTS` or `git diff`)
2. Find relevant documentation files in `docs/`
3. Read both code and docs to understand the gap
4. Update docs to match current code
5. Verify examples still work
6. Report what was updated

## Examples

- `/docs-update API changes for user service`
- `/docs-update Add new component examples`
- `/docs-update --scan` — check all docs freshness

## Rules

- Only update `docs/` files — never modify source code
- Preserve existing structure and formatting
- If `docs/` doesn't exist, suggest `/docs-init` instead
- Keep files under 800 LOC (docs.maxLoc)
