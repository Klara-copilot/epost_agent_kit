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
| PERF-004 | Expensive operations behind appropriate caching layer | medium | RTK Query cache, React.cache(), or useMemo applied to expensive deterministic operations | `computeExpensiveReport(userId)` called on every render with no cache |
| PERF-005 | Large library imports use named/path imports, not full barrel — flag imports adding >20KB to initial bundle | medium | `import debounce from 'lodash/debounce'`; `import { format } from 'date-fns/format'` | `import _ from 'lodash'` (70KB); `import * as datefns from 'date-fns'` (35KB); `import moment from 'moment'` (67KB when date-fns suffices) |
| PERF-006 | Modules >30KB loaded lazily when not needed on initial render — React.lazy + Suspense or dynamic import() | low | `const Chart = React.lazy(() => import('recharts'))` for chart widget only shown on dashboard tab | Top-level `import { LineChart } from 'recharts'` (45KB) on a page where chart is behind a tab; `import 'highlight.js'` (180KB) for optional code preview |
| PERF-007 | Sequential `await` in loops replaced with `Promise.all` — don't serialize N independent async ops | medium | `await Promise.all(items.map(item => fetchDetail(item.id)))` | `for (const item of items) { item.detail = await fetchDetail(item.id) }` — N serial round trips; applies to API calls, file reads, any async op not DB-queried (DB covered by PERF-001) |
| PERF-008 | Use `<Image>` from `next/image` instead of raw `<img>` — enables lazy loading, LCP optimization, automatic format conversion | medium | `import Image from 'next/image'; <Image src={url} alt="..." width={N} height={N} />` | `<img src={url} alt="..." />` in a Next.js component — skips image optimization pipeline, hurts LCP |

<!-- Bundle size delta check (PERF-007) deferred.
     Threshold for implementing: when CI pipeline reports bundle size per-PR,
     or when a PR demonstrably adds >50KB to initial bundle despite PERF-005/006.
     Current coverage: PERF-005 (import patterns) + PERF-006 (lazy loading) catch
     the most common regressions without external tooling. -->

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
| TS-007 | Components using hooks or browser APIs have `'use client'` directive — App Router runs files server-side by default | critical | `'use client'` at top of any file using `useState`, `useEffect`, `useRouter`, or DOM APIs | `useEffect` or `useRef` in a file without `'use client'` — crashes at runtime; App Router treats it as Server Component |
| TS-008 | No hardcoded hex/rgb colors in `className` — use klara-theme token classes | medium | `className="bg-base-background text-base-foreground"` | `className="bg-[#1a2b3c]"` or `style={{ color: '#ff0000' }}` — bypasses design token system, breaks theming |

---

## STATE: State Management

**Scope**: RTK slices, React context, XState machines in web apps.

**Activation gate**: Apply only when reviewing XState machine files or complex multi-step async flows with explicit states. Skip for standard RTK slice files — REDUX rules cover those.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| STATE-001 | State machine completeness — every state has at least one defined exit transition | high | All states listed in transitions map; no terminal state without explicit `done`/`error` exit | Loading state has no transition to error or success — machine can get stuck |
| STATE-002 | Error and timeout states explicitly modelled | high | `error` state and `timeout` state present with appropriate transitions | Happy-path-only machine; network error leaves UI in loading forever |
| STATE-003 | Transition guards present where required — guarded transitions have explicit conditions | medium | `guard: (ctx, event) => ctx.retryCount < 3` on conditional transitions | Transition fires unconditionally when business rule requires a condition check |
| STATE-004 | No concurrent mutations on shared state — reducers/actions are pure; side effects isolated | critical | Reducers are pure functions; side effects in middleware (redux-thunk, redux-saga) only | Reducer directly mutates external state or calls `fetch()` inside reducer body |

---

## REDUX: Redux Toolkit Dual-Store

**Scope**: ePost dual-store pattern — Global (persisted app state) + Feature (scoped per layout). Redux Toolkit slices, selectors, RTK Query.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| REDUX-001 | App-wide state in Global store, feature state in Feature store — no cross-contamination | high | User profile in Global; feature list in Feature store scoped to layout | Feature-specific data persisted in Global store |
| REDUX-002 | Feature store has own `configureStore` + `Provider` scoped to feature layout — not Global | high | Feature store wrapped in feature layout with own Provider | Feature slices registered in Global store's `combineReducers` |
| REDUX-003 | `useAppSelector` with narrow selectors — subscribe to primitives, not objects | high | `useAppSelector(s => s.user.name)` | `useAppSelector(s => s.user)` causing re-renders on unrelated user field changes |
| REDUX-004 | Reducers are pure — side effects only in thunks/middleware | critical | Async logic in `createAsyncThunk`; reducer returns new state only | `fetch()` or `console.log` inside reducer body |
| REDUX-005 | No direct store import in components — use hooks (`useAppSelector`, `useAppDispatch`) | medium | Component uses `useAppDispatch()` | Component imports `store` and calls `store.dispatch()` directly |
| REDUX-006 | RTK Query middleware registered only in Feature store — not Global persisted store | medium | `api.middleware` in feature store's middleware chain | RTK Query middleware registered in Global store alongside persist config |

---

## HOOKS: React Hooks

**Scope**: All React components and custom hooks in `.tsx`/`.ts` files.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| HOOKS-001 | `useEffect` deps array is complete — all referenced variables listed | critical | `useEffect(() => { fetch(userId) }, [userId])` | `useEffect(() => { fetch(userId) }, [])` — `userId` missing, stale closure |
| HOOKS-002 | Hooks called unconditionally at top level — never inside conditions, loops, or callbacks | critical | All `use*` calls at top of component/hook body | `if (isAdmin) { useAdminData() }` — violates Rules of Hooks, crashes on toggle |
| HOOKS-003 | No derived state via `useState` + `useEffect` chain — use `useMemo` or compute inline | high | `const sorted = useMemo(() => list.sort(), [list])` | `useEffect(() => { setSorted(list.sort()) }, [list])` — extra render pass, hook cascade |
| HOOKS-004 | `useEffect` with subscriptions/timers has cleanup return | high | `useEffect(() => { const id = setInterval(fn, 1s); return () => clearInterval(id) }, [])` | `useEffect(() => { setInterval(fn, 1000) }, [])` — timer leaks on unmount |
| HOOKS-005 | `useCallback`/`useMemo` deps array is complete — same rule as HOOKS-001 | high | `useCallback((x) => fn(x, userId), [userId])` | `useCallback((x) => fn(x, userId), [])` — stale `userId` in memoized callback |
| HOOKS-006 | No inline object/array literals in deps arrays — extract to ref or memo first | medium | `const opts = useMemo(() => ({ id }), [id]); useEffect(() => f(opts), [opts])` | `useEffect(() => f({ id }), [{ id }])` — `{}` !== `{}` causes infinite loop |
| HOOKS-007 | Custom hook has single responsibility — one concern per hook | medium | `useInboxMessages()` fetches and returns messages only | `useInboxPage()` fetches, filters, sorts, tracks selection, and manages pagination |
| HOOKS-008 | No `// eslint-disable-next-line react-hooks/exhaustive-deps` suppressions | critical | Deps array fixed; if suppression seems needed → restructure the effect | `// eslint-disable-next-line react-hooks/exhaustive-deps` above `useEffect` |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| PERF-001–002 | Yes | — |
| PERF-003–008 | — | Yes |
| TS-001–003, TS-007 | Yes | — |
| TS-004–006, TS-008 | — | Yes |
| STATE-001–002 | Yes | — |
| STATE-003–004 | — | Yes |
| REDUX-001–003 | Yes | — |
| REDUX-004–006 | — | Yes |
| HOOKS-001–002, HOOKS-008 | Yes | — |
| HOOKS-003–007 | — | Yes |

**Lightweight**: Run on all web file reviews. **Escalated**: Activate on critical findings, large PRs (10+ files), or explicit `--deep` flag.
