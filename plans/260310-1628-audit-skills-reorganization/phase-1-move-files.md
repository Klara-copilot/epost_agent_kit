---
phase: 1
title: "Create directories, move and rename files"
effort: 20m
depends: []
---

# Phase 1: Create Directories, Move + Rename Files

All paths relative to `packages/core/skills/audit/references/`.

## Step 1: Create subdirectories

```bash
mkdir -p packages/core/skills/audit/references/ui
mkdir -p packages/core/skills/audit/references/a11y
```

## Step 2: Move + rename files

| Source | Destination | Action |
|--------|------------|--------|
| `ui.md` | `ui/workflow.md` | move+rename |
| `checklist-web.md` | `ui/checklist-web-atoms.md` | move+rename |
| `checklist-web-organism.md` | `ui/checklist-web-organisms.md` | move+rename |
| `ui-known-findings-schema.md` | `ui/findings-schema.md` | move+rename |
| `close-ui.md` | `ui/close.md` | move |
| `a11y.md` | `a11y/workflow.md` | move+rename |
| `ios-audit-mode.md` | `a11y/checklist-ios.md` | move+rename |
| `android-audit-mode.md` | `a11y/checklist-android.md` | move+rename |
| `close-a11y.md` | `a11y/close.md` | move |
| `audit-report-schema.md` | `finding-schema.md` | rename (stays top-level) |

## Step 3: Files that stay unchanged (no move)

- `output-contract.md`
- `delegation-templates.md`
- `report-template.md`
- `session-json-schema.md`

## Validation

```bash
# Verify all files moved
ls packages/core/skills/audit/references/ui/    # 5 files
ls packages/core/skills/audit/references/a11y/   # 4 files
ls packages/core/skills/audit/references/         # 5 top-level files + 2 dirs
# Verify no old files remain
test ! -f packages/core/skills/audit/references/ui.md
test ! -f packages/core/skills/audit/references/a11y.md
test ! -f packages/core/skills/audit/references/close-ui.md
test ! -f packages/core/skills/audit/references/close-a11y.md
test ! -f packages/core/skills/audit/references/audit-report-schema.md
```
