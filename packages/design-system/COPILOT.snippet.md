## Design System

**Components**: klara-theme (web) · iOS theme SwiftUI · Android Compose UI · Vien 2.0 tokens

### Agent Routing

| Task | Agent |
|------|-------|
| Build / audit / fix UI component | `@epost-muji` |
| Extract Figma tokens / Figma-to-code | `@epost-muji` |
| Implement component in codebase | `@epost-fullstack-developer` |
| Accessibility audit on component | `@epost-a11y-specialist` |

### Conventions

- Design tokens from Vien 2.0 (1,059 variables, 42 collections)
- klara-theme for web components; iOS/Android theme libs for native
- Never hardcode color values — always reference design tokens
- Component maturity: `--poc` / `--beta` / `--stable` flag required for audits

### UI Component Audit

Before delegating to `@epost-muji`, specify maturity:

- `@epost-muji Audit [ComponentName] --ui --poc` (prototype)
- `@epost-muji Audit [ComponentName] --ui --beta` (in development)
- `@epost-muji Audit [ComponentName] --ui --stable` (production)

### Starter Prompts

- `@epost-muji Build a [component] component following klara-theme patterns.`
- `@epost-muji Extract design tokens from this Figma URL: [url]`
- `@epost-fullstack-developer Implement the [component] design spec in klara-theme.`
