---
name: web-frontend
description: (ePost) Builds React components, hooks, and Redux Toolkit state management patterns. Use when working with .tsx/.jsx files, React components, hooks, state management, or frontend UI
user-invocable: false
paths: ["**/*.tsx", "**/*.jsx"]

metadata:
  agent-affinity: [epost-fullstack-developer, epost-tester, epost-debugger, epost-code-reviewer]
  keywords: [react, frontend, ui, hooks, components, state, typescript, redux]
  platforms: [web]
  triggers: [".tsx", ".jsx", "react", "frontend", "ui component", "redux", "hook"]
---

# Frontend Development — React/Redux Patterns

## Purpose

React 18 + TypeScript frontend patterns. Covers Redux Toolkit (dual-store), session management, component composition, hooks, and render optimization.

## State Management — Redux Toolkit

Uses **two Redux stores**:

| Store | Location | Scope | Persistence |
|-------|----------|-------|-------------|
| Global | `libs/utils/src/redux/store.ts` | App-wide | redux-persist |
| Feature | `app/[locale]/(auth)/feature-name/_stores/feature-store.tsx` | Feature layout | No |

- Global store: `combineReducers` + `persistReducer` + `PersistGate`, mounted via `ReduxProvider`
- Feature store: own `configureStore` + `Provider`, scoped to feature layout; includes RTK Query middleware
- Use `useAppSelector` with narrow selectors — subscribe to booleans/primitives, not objects

See `references/react-patterns.md` for full store setup, slice templates, and selector memoization.

## Provider Nesting Order

See `web-auth` skill for provider nesting order.

## Component Conventions

- **`forwardRef` + `displayName`**: Always set `displayName` on forwardRef components for DevTools
- **Compound components**: See `references/composition.md` for klara-theme pattern
- **Explicit variants**: Use `cva()` variant props — not boolean props
- Keep components under 200 lines

## Hook Patterns

Three hook types: utility (no state), effect with cleanup, context hook with guard.

See `references/react-patterns.md` for hook examples including `useImperativeHandle`, cleanup, and context guard patterns.

## Sub-Skill Routing

| Intent | Route |
|--------|-------|
| Next.js patterns | `web-nextjs` skill |
| API routes | `web-api-routes` skill |
| Module integration | `web-modules` skill |
| i18n | `web-i18n` skill |
| Auth | `web-auth` skill |
| Testing | `web-testing` skill |

## Rules

- Use Redux Toolkit for state — NOT Zustand, NOT React Query
- Use `useAppSelector` with narrow selectors
- Always set `displayName` on `forwardRef` components
- Use explicit variant props (via `cva()`), not boolean props
- Keep components under 200 lines
- Mobile-first responsive design with Tailwind
- WCAG AA accessibility
- React 18 only — do NOT use React 19 features (`use()`, `<Activity>`, no-forwardRef)

## References

| File | Purpose |
|------|---------|
| `references/react-patterns.md` | Store setup, slice templates, hook examples, composition patterns |
| `references/composition.md` | Compound components, state decoupling, children composition |
| `references/render-optimization.md` | React.memo, derived state, transitions, lazy init |
| `references/typescript-standards.md` | Strict mode, no-any, Result pattern, immutability, null safety |

## Dependencies

- React 18+, TypeScript, Redux Toolkit + redux-persist
- React Testing Library, Tailwind CSS, klara-theme
