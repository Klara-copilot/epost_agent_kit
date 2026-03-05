---
name: docs
description: "(ePost) Documentation workflow — auto-detects init, update, or component"
user-invocable: true
context: fork
agent: epost-documenter
metadata:
  argument-hint: "[--migrate | --scan | --verify | --batch [category]]"
  connections:
    enhances: []
    requires: [knowledge-retrieval]
---

# Docs — Unified Documentation Command

Auto-detect and execute the appropriate documentation workflow.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--migrate`: load `references/init.md`, execute in migrate mode.
If `$ARGUMENTS` starts with `--scan`: load `references/update.md`, execute in scan mode.
If `$ARGUMENTS` starts with `--verify`: load `references/update.md`, execute in verify mode.
If `$ARGUMENTS` starts with `--batch`: load `references/component.md`, execute in batch mode. Pass remaining args as category filter.
Otherwise: continue to Auto-Detection.

## Aspect Files

| File | Purpose |
|------|---------|
| `references/init.md` | Scan codebase and generate structured KB documentation |
| `references/update.md` | Update existing documentation or scan for staleness |
| `references/component.md` | Document a klara-theme component (Figma data + prop mapping) |

## Auto-Detection

1. Check if `docs/index.json` exists in the project root
2. Check if args reference a specific component key
3. Check if `libs/klara-theme/` exists (for component docs eligibility)

### Decision Matrix

| Condition | Load Reference |
|-----------|---------------|
| `docs/index.json` absent | `references/init.md` — initialize documentation |
| Args match a component key AND `libs/klara-theme/` exists | `references/component.md` — document that component |
| `docs/index.json` present (default) | `references/update.md` — update existing docs |

## Execution

Load the reference file and execute its workflow.
