---
name: web-nextjs-code-review-rules
description: "Next.js App Router code review rules — NEXTJS category"
user-invocable: false
disable-model-invocation: true
---

# Next.js App Router Code Review Rules

**Scope**: Next.js 14 App Router pages, layouts, Server Components, and middleware in ePost web app.

**Stack note**: ePost uses Next.js 14. In Next.js 14, `cookies()`, `headers()`, `params`, and `searchParams` are synchronous. Next.js 15 makes them async (Promises). NEXTJS-001 flags synchronous access as low-severity migration debt — NOT a current bug.

---

## NEXTJS: App Router Patterns

**Activation gate**: Apply when reviewing files in `app/` directory, `middleware.ts`, or `next.config.*`.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| NEXTJS-001 | `cookies()`, `headers()`, `params`, `searchParams` accessed synchronously — correct for Next.js 14, but will break on Next.js 15 upgrade without `await`. Flag as migration debt. | low | Synchronous access with `// Next.js 14 — await required on Next.js 15 upgrade` comment | Synchronous access with no migration comment — silent future breakage when upgrading |
| NEXTJS-002 | Server Components using `cookies()` or `headers()` opt out of full-route cache — must either add `export const dynamic = 'force-dynamic'` or be intentionally uncached | medium | `export const dynamic = 'force-dynamic'` present, or developer comment explaining cache opt-out intent | `cookies()` called in page.tsx with no dynamic export — silently uncaches the route |
| NEXTJS-003 | Server Components must not import client-only packages (`window`, `document`, browser APIs) without `server-only` or `'use client'` boundary — crashes at build | high | `import 'server-only'` at top of server utility; client-only packages inside Client Components only | `import { SomeBrowserLib } from 'browser-only-lib'` at top of a Server Component |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| NEXTJS-003 | Yes | — |
| NEXTJS-001–002 | — | Yes |

**Lightweight**: Run on all App Router files. **Escalated**: Activate on new page/layout additions or Next.js version upgrade PRs.
