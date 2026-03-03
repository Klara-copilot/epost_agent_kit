---
name: web-nextjs
description: Use when working with Next.js App Router, Server Components, Server Actions, or page/layout routing
user-invocable: false

metadata:
  agent-affinity: [epost-implementer]
  keywords: [nextjs, next, app-router, server-components, server-actions, routing, middleware]
  platforms: [web]
  triggers: ["next.js", "nextjs", "app router", "server component", "middleware", "layout.tsx", "page.tsx"]
  connections:
    enhances: [web-frontend]
---

# Next.js 14 — App Router Patterns

## Purpose

Next.js 14 App Router patterns for web applications. Covers routing structure, middleware, server actions (callers), error handling, and performance optimization.

## Route Structure

Uses locale-scoped route groups with auth separation:

```
app/
├── [locale]/                      # Dynamic locale segment
│   ├── layout.tsx                 # Root: ReduxProvider > AuthProvider > NextIntlClientProvider
│   ├── global_error.tsx           # Must include <html><body> — wraps root layout
│   ├── (auth)/                    # Requires authentication session
│   │   ├── layout.tsx             # Sidebar menu, session check
│   │   ├── error.tsx              # Auth-level error boundary
│   │   ├── [...rest]/page.tsx     # Catch-all → notFound()
│   │   ├── feature-a/
│   │   │   └── [id]/detail/[detailId]/
│   │   ├── feature-b/
│   │   │   └── [category]/
│   │   ├── feature-c/
│   │   └── feature-d/
│   └── (public)/                  # No auth required
│       ├── onboarding/
│       └── error-pages/
├── api/
│   ├── auth/[...nextauth]/        # NextAuth route handler
│   ├── internal/log/              # Client→server log forwarding
│   └── proxy/                     # Proxy endpoints
```

### Conventions

- **`_prefix` folders** (`_components`, `_services`, `_actions`, `_hooks`, `_stores`, `_utils`, `_ui-models`, `_enums`, `_constants`) — private to their route segment, not routed by Next.js
- **`(auth)` / `(public)`** — route groups for layout scoping, invisible in URL
- **`[...rest]`** under `(auth)` — catch-all that calls `notFound()` for unknown paths

## Server vs Client Boundary

| Pattern | Directive | When |
|---------|-----------|------|
| Server Component | (default) | Data fetching, layout, metadata |
| Client Component | `'use client'` | Hooks, event handlers, browser APIs, Radix UI |
| Server Action | `'use server'` | Callers in `caller/` directory |

Decision tree for `'use client'`: Does it use `useState`, `useEffect`, `useContext`, event handlers, or browser APIs? → Yes = client. Otherwise leave as server component.

## Server Actions — Caller Pattern

All API calls go through `caller/` files with `'use server'`. See `web-api-routes` skill for FetchBuilder details.

See `web-api-routes/references/caller-patterns.md` for FetchBuilder caller examples.

## Error Handling

Three-level error boundary hierarchy:

| File | Scope | Pattern |
|------|-------|---------|
| `global_error.tsx` | Root layout crashes | `logger.error` + `<ErrorPage>` with `<html><body>` wrapper |
| `(auth)/error.tsx` | All auth routes | `useEffect` logger + `<ErrorPage resetFunction={reset}>` |
| Feature `error.tsx` | Module-level | Same pattern — `clientLogger.error` + `<ErrorPage>` |

Shared component: `app/[locale]/components/error-page.tsx` — uses `useTranslations`, `Button`, and an illustration component.

**FetchBuilder never throws** — returns `{ error: { status, reason } }`. Always check `response.error` or use `isErrorResponse()`.

## Metadata

See `web-i18n` skill for `generateMetadata` with translation patterns.

## Reference Files

| File | Purpose |
|------|---------|
| `references/routing.md` | Route groups, dynamic segments, `_prefix` convention |
| `references/middleware.md` | Combined intl+auth, feature flags, request tracing |
| `references/performance.md` | Parallel fetching, Suspense boundaries, dynamic imports |

## Sub-Skill Routing

When this skill is active and user intent matches a sub-skill, delegate:

| Intent | Sub-Skill | When |
|--------|-----------|------|
| API routes | `web-api-routes` | FetchBuilder, callers, route.ts handlers |
| Module integration | `web-modules` | B2B module scaffolding |
| i18n | `web-i18n` | Translations, locale routing |
| Auth | `web-auth` | Auth, sessions, protected routes |

## Rules

- All API calls through FetchBuilder — never raw `fetch()` in app code (except route.ts proxies)
- Use `caller/` pattern for server actions — explicit params or session retrieval
- Error boundaries at every route group level
- `generateMetadata()` in every layout for SEO
- Import `Link`, `redirect`, `useRouter` from `navigation.ts` — not from `next/link` or `next/navigation`
