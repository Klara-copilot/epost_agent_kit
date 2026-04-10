## Design System

**Components**: klara-theme (web) · iOS theme SwiftUI · Android Compose UI · Vien 2.0 tokens

This rule auto-applies when editing design system component files.

### Agent Routing

| Intent | Chat command |
|--------|-------------|
| Build / audit / fix UI component | `@epost-muji [component]` |
| Extract Figma tokens / Figma-to-code | `@epost-muji Extract tokens from [figma url]` |
| Implement component in codebase | `@epost-fullstack-developer [component]` |
| Accessibility audit on component | `@epost-a11y-specialist [component]` |

### Conventions

- Design tokens from Vien 2.0 (1,059 variables, 42 collections)
- Never hardcode color values — always reference design tokens
- klara-theme for web; iOS/Android theme libs for native platforms
- Maturity flag required for audits: `--poc` / `--beta` / `--stable`

### Context Rules

- `.cursor/rules/design-system.mdc` auto-applies for design system files
- Cursor's Task tool may not work — delegate via chat, not programmatic dispatch
