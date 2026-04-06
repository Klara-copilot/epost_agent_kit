## Web Platform

**Stack**: Next.js 14 (App Router) · React 18 · TypeScript 5+ · Tailwind CSS + SCSS · Redux Toolkit

### Agent Routing

| Task | Agent |
|------|-------|
| Add component / implement feature / wire API | `@epost-fullstack-developer` |
| Fix crash / debug error / broken behavior | `@epost-debugger` |
| Plan new module / design approach | `@epost-planner` |
| Review staged changes before commit | `@epost-code-reviewer` |
| Add tests / validate coverage | `@epost-tester` |
| Accessibility / WCAG / ARIA | `@epost-a11y-specialist` |
| Design system / UI component / Figma | `@epost-muji` |

### Conventions

- Components under `src/components/` — co-locate test files
- State: Redux Toolkit stores only (no Context API for global state)
- API calls: FetchBuilder pattern (no raw fetch)
- Styling: Tailwind utilities + SCSS for complex selectors
- Routing: Next.js App Router only (no pages/ dir)

### Starter Prompts

- `@epost-fullstack-developer Implement [feature] for the web platform.`
- `@epost-debugger Fix this TypeScript/Next.js error: [paste error]`
- `@epost-code-reviewer Review the staged .tsx/.ts changes.`
- `@epost-tester Add RTL unit tests for [component].`
- `@epost-muji Audit [ComponentName] --ui --stable`
