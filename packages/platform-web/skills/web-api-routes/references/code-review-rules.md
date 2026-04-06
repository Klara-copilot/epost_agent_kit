---
name: web-api-routes-code-review-rules
description: "ePost FetchBuilder-specific code review rules — FETCH category"
user-invocable: false
disable-model-invocation: true
---

# Web API Routes Code Review Rules

**Scope**: FetchBuilder usage, API URL constants, caller conventions in ePost web apps.

---

## FETCH: FetchBuilder & API Conventions

**Scope**: All HTTP calls in ePost web app — callers, services, route handlers.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| FETCH-001 | All app-level HTTP calls use FetchBuilder — never raw `fetch()` (except route.ts binary proxies) | high | `FetchBuilder.get(URL).build()` | `fetch('/api/users')` inside a service or action |
| FETCH-002 | Always check `response.error` — FetchBuilder never throws on HTTP errors | high | `if (response.error) { return handleError(response.error) }` | `const data = (await builder.build()).data` with no error check |
| FETCH-003 | Use API URL constants from shared utils — never hardcode URL strings | medium | `import { USERS_URL } from '@/utils/api-urls'` | `FetchBuilder.get('/api/v1/users/list')` with inline string |
| FETCH-004 | Use `:placeholder` convention with builder methods — never string interpolation for path params | medium | `.withTenantId(tenantId)` or `buildUrl(USERS_URL, { id })` | `` FetchBuilder.get(`/api/users/${userId}`) `` |
| FETCH-005 | Caller files begin with `'use server'` — no client-side FetchBuilder calls | high | `'use server'` at top of caller file | Caller imported into a Client Component without server boundary |
| FETCH-006 | Route handlers (`route.ts`) use raw `fetch()` only for binary proxying — not for app business logic | medium | `route.ts` proxies file streams; all logic lives in callers | Route handler calls FetchBuilder to build domain objects before responding |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| FETCH-001–002, FETCH-005 | Yes | — |
| FETCH-003–004, FETCH-006 | — | Yes |

**Lightweight**: Run on all files touching HTTP calls. **Escalated**: Activate on large service layers or explicit `--deep` flag.
