---
name: web-prototype-convert
description: "(ePost) Use when: \"convert prototype\", \"migrate mockup\", \"turn this into production code\", \"prototype to code\", \"migrate from codepen\", \"convert design to module\". Converts external prototypes, mockups, or PoC codebases into production-ready ePost code."
argument-hint: "[prototype-path or description]"
user-invocable: false
metadata:
  keywords: [prototype, convert, migrate, mockup, production, klara-theme, tokens]
  triggers:
    - "convert prototype"
    - "migrate mockup"
    - "prototype to code"
    - "turn into production"
    - "convert design"
  platforms: [web]
  connections:
    requires: [web-frontend, web-ui-lib, web-modules]
    enhances: [ui-lib-dev]
---

# Web Prototype Convert

> **Note**: References not yet written. This skill is disabled until reference files are created.

Convert external prototypes, mockups, or PoC codebases into production-ready ePost code using klara-theme components, semantic design tokens, and proper module architecture.

## Conversion Workflow

### Step 1 — Analyze

Inventory the prototype:
- Framework and dependencies used
- Component list and count
- State management approach
- API calls and data shapes
- Style system (inline, CSS modules, Tailwind, etc.)

See `references/analysis-checklist.md` for full inventory template.

### Step 2 — Map Components

Map each prototype component to its klara-theme equivalent.

See `references/component-mapping.md` for the mapping table (buttons, inputs, layouts, modals, etc.).

### Step 3 — Map Tokens

Replace all hardcoded values with klara-theme design tokens:
- Colors → `bg-base-background`, `text-base-foreground`, etc.
- Spacing → `p-200`, `gap-100`, `m-400`, etc.
- Typography → theme typography classes

See `references/token-mapping.md` for the full token mapping table.

### Step 4 — Migrate Styles

Convert the style system to klara-theme + Tailwind.

See `references/style-migration.md` for migration patterns (CSS modules → Tailwind, inline styles → tokens, etc.).

### Step 5 — Integrate Data

Replace all mock/hardcoded data with real API integration using FetchBuilder callers.

Data flow: **Component → Hook → Action → Service → API**

See `references/data-migration.md` for API integration patterns.

### Step 6 — Place in Module

Place converted code in the correct B2B module following ePost module structure:
- `_components/` — UI components
- `_hooks/` — custom hooks
- `_actions/` — server actions
- `_services/` — API callers
- `_ui-models/` — view models

## Quick Reference

- Import: `@luz-next/klara-theme`
- Props: `styling` (not `variant`), `size`, `mode`, `radius`
- Tokens: `bg-base-background`, `p-200`, `gap-100`

## Reference Files

| File | Purpose |
|------|---------|
| `references/analysis-checklist.md` | Prototype inventory and framework detection |
| `references/component-mapping.md` | Map common patterns to klara-theme equivalents |
| `references/token-mapping.md` | Map hardcoded values to klara-theme tokens |
| `references/style-migration.md` | Migrate style systems to klara-theme |
| `references/data-migration.md` | Replace mock data with real API integration |
