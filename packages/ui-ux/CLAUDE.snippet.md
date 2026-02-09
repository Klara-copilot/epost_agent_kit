## UI/UX Design System (MUJI)

### Agent
- `epost-muji` — MUJI UI library agent with two flows: library development (Figma-to-code pipeline) and consumer guidance (component knowledge, integration patterns)

### Design System Ownership
MUJI team owns UI component libraries across all platforms:

| Library | Platform | Source |
|---------|----------|--------|
| klara-theme | Web (React) | Storybook, Figma |
| ios-theme | iOS (SwiftUI) | Figma |
| android-theme | Android (Compose) | Figma |

### Consumer Guidance
- Component API reference (props, variants, code examples)
- Design system guidelines (tokens, spacing, colors, typography)
- Integration patterns (theme provider, composition, state management)
- Audit consumer UI implementations against the design system
- Contributing components back to the MUJI team

### Library Development
- `/docs:component <key>` — Document klara-theme components from Figma
- `/design:fast` — Quick UI design implementation
- Figma-to-code pipeline: plan-feature → implement-component → audit-ui → fix-findings → document-component
- Figma MCP integration for design token extraction

### Skills
- `muji/klara-theme`, `muji/ios-theme`, `muji/android-theme` — Platform component knowledge
- `muji/figma-variables` — Design token architecture (semantic → component → raw)
- `web/klara-theme` — Component development pipeline
- `web/figma-integration` — Figma MCP tool patterns
