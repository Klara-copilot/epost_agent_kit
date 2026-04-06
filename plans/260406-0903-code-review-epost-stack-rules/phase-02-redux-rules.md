---
phase: 2
title: "Add REDUX Section to Web Frontend Rules"
effort: 1h
depends: []
---

# Phase 2: REDUX Rules

## Context

- Plan: [plan.md](./plan.md)
- Target: `packages/platform-web/skills/web-frontend/references/code-review-rules.md`
- Source: `web-frontend/SKILL.md` dual-store architecture

## Overview

Add a REDUX section to the existing web-frontend code-review-rules.md. Rules cover the ePost dual-store pattern (Global + Feature), slice conventions, and selector hygiene.

## Requirements

### REDUX rules to add

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| REDUX-001 | App-wide state in Global store, feature state in Feature store — no cross-contamination | high | User profile in Global; feature list in Feature store scoped to layout | Feature-specific data persisted in Global store |
| REDUX-002 | Feature store has own `configureStore` + `Provider` scoped to feature layout | high | Feature store wrapped in feature layout with own Provider | Feature slices registered in Global store's `combineReducers` |
| REDUX-003 | `useAppSelector` with narrow selectors — subscribe to primitives, not objects | high | `useAppSelector(s => s.user.name)` | `useAppSelector(s => s.user)` causing re-renders on unrelated changes |
| REDUX-004 | Reducers are pure — side effects only in thunks/middleware | critical | Async logic in `createAsyncThunk`; reducer returns new state | `fetch()` or `console.log` inside reducer body |
| REDUX-005 | No direct store import in components — use hooks (`useAppSelector`, `useAppDispatch`) | medium | Component uses `useAppDispatch()` | Component imports `store` and calls `store.dispatch()` directly |
| REDUX-006 | RTK Query middleware only in Feature store — not Global | medium | `api.middleware` in feature store's middleware | RTK Query middleware registered in Global persisted store |

### Lightweight vs Escalated update

Add REDUX rules to the existing lightweight/escalated table:
- REDUX-001–003: Lightweight (default)
- REDUX-004–006: Escalated only

## Files to Modify

- `packages/platform-web/skills/web-frontend/references/code-review-rules.md` — append REDUX section + update escalated table

## Files to Read (context)

- `packages/platform-web/skills/web-frontend/SKILL.md` (store architecture)
- `packages/platform-web/skills/web-frontend/references/react-patterns.md` (slice templates)

## TODO

- [ ] Add REDUX section with 6 rules after STATE section
- [ ] Update lightweight/escalated table with REDUX rows
- [ ] Verify file stays < 100 lines total
- [ ] Verify PERF/TS/STATE sections unchanged

## Success Criteria

- REDUX section added with 6 rules in standard table format
- Existing PERF/TS/STATE rules byte-identical (no accidental edits)
- Lightweight/escalated table updated
- Total file size < 100 lines
