---
name: epost-documenter
description: Structured output for component documentation, API docs, and technical writing
keep-coding-instructions: true
---

# Documentation Output Style

Follow this structure for all documentation responses.

## Component Documentation Structure

When documenting UI components, use this standard format:

### Component Overview
Start with 1-2 sentences describing what the component does and when to use it.

### Props Table

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `string` | `"default"` | No | Visual variant |

Always include type, default value, and whether required.

### Variants Matrix

Present variant combinations as a matrix:

| Variant \ Size | `sm` | `md` | `lg` |
|----------------|------|------|------|
| `primary` | ... | ... | ... |
| `secondary` | ... | ... | ... |

### Design Tokens Table

| Token Name | CSS Property | Value | Layer |
|------------|-------------|-------|-------|
| `--klara-btn-bg` | `background-color` | `var(--color-primary)` | Component |

Always specify the token layer (primitive, theme, component).

### Usage Examples
Provide examples in order of complexity:
1. **Basic** — minimal props
2. **With Variants** — showing variant/size combinations
3. **Composition** — with other components
4. **Advanced** — custom styling, event handling

### Accessibility Notes
- ARIA roles and labels
- Keyboard interactions
- Focus management
- Screen reader behavior

## Figma Reference Format

When including Figma data:
- **nodeId**: Always include the Figma nodeId for traceability
- **Screenshot**: Reference with `[screenshot: nodeId]` notation
- **Variables**: Map Figma variable names to CSS variables
- **Variants**: List all Figma variant properties and their values

## JSON Documentation Format

### Component Data (`.figma.json`)
```json
{
  "componentKey": "component-name",
  "componentSetNodeId": "nodeId",
  "variants": [],
  "tokens": {},
  "extractedAt": "ISO-8601"
}
```

### Prop Mapping (`.mapping.json`)
```json
{
  "componentKey": "component-name",
  "props": {
    "propName": {
      "figmaProperty": "Figma Property Name",
      "values": {}
    }
  }
}
```

## Manifest Updates

When reporting manifest changes:
- Show before/after for `meta` counts
- List each component entry added/updated
- Report validation status

## Batch Documentation Report

For multi-component documentation:

| Component | Status | Files | Errors |
|-----------|--------|-------|--------|
| `button` | documented | 2 | 0 |
| `select` | failed | 0 | 1 |

Include:
- Total processed / succeeded / failed
- Per-component validation results
- Missing Figma refs (if any)

## General Formatting

- Use `##` headers for major sections
- Use `###` for subsections within a component
- Prefer tables for structured multi-field data
- Use inline code for all identifiers: props, tokens, file names
- Keep descriptions concise (under 150 words per section)
- Always include file paths relative to project root
