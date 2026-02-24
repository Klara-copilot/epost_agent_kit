---
name: knowledge/klara-theme/components
description: "klara-theme component discovery — use RAG for current catalog"
source: dynamic
---

# klara-theme Components

## How to Find Components

> Do NOT maintain a component list here. Use RAG for current data.

### Primary: MCP query tool (web-lib-rag server)
```
query({ query: "[component name or category]", filters: { topic: "ui", file_type: "tsx" } })
query({ query: "component list", filters: { topic: "ui" }, top_k: 20 })
```

### Fallback: Codebase Search
```
Glob: libs/klara-theme/src/lib/components/**/index.ts
```

## Architecture (stable — safe to keep here)

- React 18 + TypeScript
- Tailwind CSS for styling
- CSS Variables for theming tokens
- Storybook for documentation and visual testing

## Component Categories (stable)

Layout | Navigation | Forms | Data Display | Feedback | Actions

## Usage Pattern (stable)

```tsx
import { ComponentName } from '@epost/klara-theme';
```

- All components support `className` prop
- WAI-ARIA accessibility patterns
- `variant` prop for visual variations (primary, secondary, outline, ghost)
- Theme tokens via CSS custom properties
