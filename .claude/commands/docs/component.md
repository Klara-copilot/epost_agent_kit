---
title: Document Component
description: Document a klara-theme component (Figma data + prop mapping)
agent: epost-documenter
argumentHint: "<componentKey> [nodeId]"
---

# /docs:component

Document a klara-theme component by extracting Figma data and creating prop mappings.

## Usage

```
/docs:component <componentKey> [nodeId]
```

## Arguments

- `componentKey` (required): Component identifier (e.g., `button`, `select`, `dialog`)
- `nodeId` (optional): Figma node ID. If not provided, will be looked up from manifest or user will be prompted.

## Examples

```bash
# Document a component (nodeId from manifest)
/docs:component button

# Document with explicit Figma node ID
/docs:component select 207:134939

# Batch document all pending components
/docs:component --batch

# Batch document components in a category
/docs:component --batch forms
```

## Process

1. **Route**: Command routes to `epost-documenter`
2. **Detect**: Documenter detects klara-theme context
3. **Delegate**: Delegates to `epost-web-developer` with:
   - `componentKey`: The component to document
   - `workflow`: `document-component`
4. **Execute**: Web developer follows `.claude/workflows/web/klara-theme/document-component.md`:
   - Extract Figma data via `extract-figma.md`
   - Cross-reference with codebase
   - Write `<componentKey>.figma.json`
   - Write `<componentKey>.mapping.json`
   - Update manifest status
   - Validate against schemas

## Output

- `libs/klara-theme/figma-data/components/<componentKey>.figma.json` — Figma component data
- `libs/klara-theme/figma-data/mappings/<componentKey>.mapping.json` — Prop mappings
- `libs/klara-theme/figma-data/manifest.json` — Updated status

## Related

- Workflow: `.claude/workflows/web/klara-theme/document-component.md`
- Extraction: `.claude/workflows/web/klara-theme/extract-figma.md`
- Manifest: `libs/klara-theme/figma-data/manifest.json`
- Schemas: `libs/klara-theme/figma-data/schema/`
