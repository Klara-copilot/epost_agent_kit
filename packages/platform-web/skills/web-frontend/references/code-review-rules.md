---
name: web-code-review-rules
description: "Web-specific code review rules — PERF, TS, STATE categories"
user-invocable: false
disable-model-invocation: true
---

# Web Code Review Rules

Web platform code review rules. Loaded by code-review skill when reviewing `.tsx`/`.ts`/`.scss`/`.css` files.

**Scope**: Web rendering, bundle, React performance, TypeScript in web platform, Redux/Zustand/Context state management in web apps.

For klara-theme UI component rules (STRUCT/PROPS/TOKEN/BIZ), see `ui-lib-dev/references/audit-standards.md` — owned by epost-muji.

---

## PERF: Performance

**Scope**: Web rendering, bundle size, React performance, async handling.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| PERF-001 | No N+1 queries — related data loaded in batch or joined, not per-item | high | Single query with JOIN or batch fetch (`WHERE id IN (...)`) | Loop calling `findById(item.id)` for each item in a collection |
| PERF-002 | No unbounded queries — all list/search queries have limit/pagination | high | `LIMIT`, `take`, `pageSize` applied; cursor or offset pagination | `findAll()` with no limit on potentially large datasets |
| PERF-003 | Inefficient O(n²) or worse loops replaced with set/map lookups | medium | O(n) lookup structures for deduplication, membership tests | Nested loops for deduplication: `arr.forEach(x => result.filter(y => y.id === x.id))` |
| PERF-004 | Expensive operations behind appropriate caching layer | medium | React Query cache, SWR, or memoization applied to expensive deterministic operations | `computeExpensiveReport(userId)` called on every render with no cache |
| PERF-005 | Large library imports use named or path imports, not full barrel imports | medium | `import { specific } from 'lodash/specific'` | `import _ from 'lodash'` when only one utility is used |
| PERF-006 | Heavy modules loaded lazily where applicable | low | `React.lazy()` + `Suspense` or dynamic `import()` for large optional features | Synchronous top-level import of large library only needed in one route |

---

## TS: Type Safety

**Scope**: TypeScript files in web platform — `.ts` and `.tsx` files.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| TS-001 | No unsafe `any` — max 1 per file, documented with justification comment | high | Types are specific; `any` used sparingly with `// justification:` comment | `as any`, `: any`, `any[]` used repeatedly across file without comment |
| TS-002 | No unvalidated type casts at external boundaries | critical | Runtime validation (Zod, io-ts, type guard function) before `as MyType` on external data | `response.data as UserData` or `JSON.parse(str) as Config` with no schema validation |
| TS-003 | Type guards present at all trust boundaries — API responses, localStorage, message bus payloads | high | `isUser(data): data is User` type guard or schema parse before consuming external data | Function accepts `unknown` from API and immediately casts to domain type |
| TS-004 | Generic constraints are as tight as the usage requires | medium | `<T extends Record<string, string>>` where only string-keyed objects make sense | `<T>` (unconstrained) used when caller intent clearly requires a narrower shape |
| TS-005 | Non-null assertions (`!`) only when null is logically impossible and documented | high | `element!` annotated with comment explaining why null is impossible here | `userId!` used without comment on value that could plausibly be null/undefined |
| TS-006 | No `strict: false` or `noImplicitAny: false` suppressions added to tsconfig | critical | `tsconfig.json` maintains strict mode settings; no per-file `// @ts-nocheck` except documented legacy files | New file adds `// @ts-nocheck` or tsconfig has strict checks disabled for a new path |

---

## STATE: State Management

**Scope**: Redux slices, Zustand stores, React context, XState machines in web apps.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| STATE-001 | State machine completeness — every state has at least one defined exit transition | high | All states listed in transitions map; no terminal state without explicit `done`/`error` exit | Loading state has no transition to error or success — machine can get stuck |
| STATE-002 | Error and timeout states explicitly modelled | high | `error` state and `timeout` state present with appropriate transitions | Happy-path-only machine; network error leaves UI in loading forever |
| STATE-003 | Transition guards present where required — guarded transitions have explicit conditions | medium | `guard: (ctx, event) => ctx.retryCount < 3` on conditional transitions | Transition fires unconditionally when business rule requires a condition check |
| STATE-004 | No concurrent mutations on shared state — reducers/actions are pure; side effects isolated | critical | Reducers are pure functions; side effects in middleware (redux-thunk, redux-saga) only | Reducer directly mutates external state or calls `fetch()` inside reducer body |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| PERF-001–002 | Yes | — |
| PERF-003–006 | — | Yes |
| TS-001–003 | Yes | — |
| TS-004–006 | — | Yes |
| STATE-001–002 | Yes | — |
| STATE-003–004 | — | Yes |

**Lightweight**: Run on all web file reviews. **Escalated**: Activate on critical findings, large PRs (10+ files), or explicit `--deep` flag.
