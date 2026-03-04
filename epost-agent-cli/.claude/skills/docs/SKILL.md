---
name: docs
description: "(ePost) Documentation workflow — auto-detects init, update, or component"
user-invocable: true
context: fork
agent: epost-documenter
metadata:
  argument-hint: "[--migrate | --scan | --verify | --batch [category]]"
  connections:
    enhances: [docs-init, docs-update, docs-component]
    requires: [knowledge-base]
---

# Docs — Unified Documentation Command

Auto-detect and execute the appropriate documentation workflow.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--migrate`: dispatch `docs-init` with migrate mode.
If `$ARGUMENTS` starts with `--scan`: dispatch `docs-update` with scan mode.
If `$ARGUMENTS` starts with `--verify`: dispatch `docs-update` with verify mode.
If `$ARGUMENTS` starts with `--batch`: dispatch `docs-component` with batch mode. Pass remaining args as category filter.
Otherwise: continue to Auto-Detection.

## Auto-Detection

1. Check if `docs/index.json` exists in the project root
2. Check if args reference a specific component key
3. Check if `libs/klara-theme/` exists (for component docs eligibility)

### Decision Matrix

| Condition | Dispatch |
|-----------|----------|
| `docs/index.json` absent | `docs-init` — initialize documentation |
| Args match a component key AND `libs/klara-theme/` exists | `docs-component` — document that component |
| `docs/index.json` present (default) | `docs-update` — update existing docs |

## Execution

Load the reference documentation for the dispatched variant and execute its workflow.
