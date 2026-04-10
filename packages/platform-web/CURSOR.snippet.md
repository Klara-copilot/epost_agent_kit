## Web Platform

**Stack**: Next.js 14 (App Router) · React 18 · TypeScript 5+ · Tailwind CSS + SCSS · Redux Toolkit

This rule auto-applies when editing `.tsx`, `.ts`, `.scss`, `.css` files.

### Agent Routing

| Intent | Chat command |
|--------|-------------|
| Build / implement / add feature | `@epost-fullstack-developer [task]` |
| Fix / debug / broken behavior | `@epost-debugger [error]` |
| Plan new module / design approach | `@epost-planner [topic]` |
| Review staged changes | `@epost-code-reviewer Review staged .tsx/.ts changes` |
| Accessibility / WCAG | `@epost-a11y-specialist [issue]` |
| Design system / UI component | `@epost-muji [component]` |

### Conventions

- App Router only (`app/` dir) — no `pages/`
- State: Redux Toolkit dual-store (no Context API for global state)
- API calls: FetchBuilder pattern
- Styling: Tailwind utilities + SCSS for complex selectors
- Tests: Jest + RTL (unit), Playwright (E2E)

### Context Rules

- `.cursor/rules/platform-web.mdc` auto-applies for `.tsx`/`.ts` files
- `.cursor/rules/platform-web.mdc` contains web-specific patterns and conventions
- Cursor's Task tool may not work — delegate via chat, not programmatic dispatch
