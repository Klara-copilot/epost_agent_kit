---
phase: 1
title: "Create ePost Rule Files (FETCH, AUTH, MOD, I18N)"
effort: 2h
depends: []
---

# Phase 1: ePost Rule Files

## Context

- Plan: [plan.md](./plan.md)
- Format reference: `packages/platform-web/skills/web-frontend/references/code-review-rules.md`
- Source skills: `web-api-routes`, `web-auth`, `web-modules`, `web-i18n`

## Overview

Create 4 new `code-review-rules.md` reference files, one per ePost-specific web skill. Each file: frontmatter + scope note + rule table. 5-8 rules per file.

## Requirements

### File 1: FETCH rules — `packages/platform-web/skills/web-api-routes/references/code-review-rules.md`

Rules derived from `web-api-routes/SKILL.md`:

| Rule ID | Rule | Severity | Source |
|---------|------|----------|--------|
| FETCH-001 | All app-level HTTP calls use FetchBuilder — never raw `fetch()` (except route.ts proxies) | high | SKILL.md rule |
| FETCH-002 | Always check `response.error` — FetchBuilder never throws | high | FetchBuilder types |
| FETCH-003 | Use API URL constants from shared utils — never hardcode URLs | medium | API-urls.ts pattern |
| FETCH-004 | Use `:placeholder` convention with builder methods (`.withTenantId()`) — never string interpolation | medium | Placeholder convention |
| FETCH-005 | Caller files begin with `'use server'` — no client-side FetchBuilder calls | high | Caller pattern |
| FETCH-006 | Route handlers use raw `fetch()` only for binary proxying — not for app logic | medium | Route handler scope |

### File 2: AUTH rules — `packages/platform-web/skills/web-auth/references/code-review-rules.md`

Rules derived from `web-auth/SKILL.md`:

| Rule ID | Rule | Severity | Source |
|---------|------|----------|--------|
| AUTH-001 | Use extended session type — never raw `DefaultSession` | high | Session extension |
| AUTH-002 | Correct session API per context: `getServerSession` (SC), `useSession` (CC), `getAuthSession` (actions) | high | Session access table |
| AUTH-003 | Provider nesting order: Redux → Auth → NextIntl | high | Provider nesting |
| AUTH-004 | Feature flags checked via `isFeatureFlagEnabled()` — never manual JWT parsing | medium | Feature flags |
| AUTH-005 | No manual token refresh — JWT callback handles it automatically | medium | Token refresh |
| AUTH-006 | Protected routes have auth guard in middleware — not in component | high | Route protection |

### File 3: MOD rules — `packages/platform-web/skills/web-modules/references/code-review-rules.md`

Rules derived from `web-modules/SKILL.md`:

| Rule ID | Rule | Severity | Source |
|---------|------|----------|--------|
| MOD-001 | Module follows scaffold order: types → service → actions → hooks → store → components → page | medium | module-scaffold.md |
| MOD-002 | UI models in `_ui-models/`, services in `_services/`, hooks in `_hooks/` — no flat dumping | medium | Directory convention |
| MOD-003 | Component → Hook → Action → Service layering — no direct service calls from components | high | api-binding.md |
| MOD-004 | Feature store scoped to feature layout Provider — not in global store | high | Store pattern |
| MOD-005 | Run consistency checklist before completing module integration | medium | consistency-checklist.md |

### File 4: I18N rules — `packages/platform-web/skills/web-i18n/references/code-review-rules.md`

Rules derived from `web-i18n/SKILL.md`:

| Rule ID | Rule | Severity | Source |
|---------|------|----------|--------|
| I18N-001 | No hardcoded user-facing strings — all text via `useTranslations` / `getTranslations` | high | Core i18n rule |
| I18N-002 | Import navigation from `navigation.ts` — never `next/link` or `next/navigation` directly | high | Key rule |
| I18N-003 | New translations added to ALL locale files — not just `en` | high | Locale completeness |
| I18N-004 | Use dot notation for nested namespaces: `useTranslations('Feature.Sub')` | medium | Namespace convention |
| I18N-005 | Server Components use `getTranslations` (async), Client Components use `useTranslations` | medium | Context API matching |

### Frontmatter template (all 4 files)

```yaml
---
name: {skill}-code-review-rules
description: "ePost {domain}-specific code review rules — {CATEGORY} category"
user-invocable: false
disable-model-invocation: true
---
```

## Files to Create

- `packages/platform-web/skills/web-api-routes/references/code-review-rules.md`
- `packages/platform-web/skills/web-auth/references/code-review-rules.md`
- `packages/platform-web/skills/web-modules/references/code-review-rules.md`
- `packages/platform-web/skills/web-i18n/references/code-review-rules.md`

## Files to Read (context)

- `packages/platform-web/skills/web-frontend/references/code-review-rules.md` (format reference)
- Each skill's SKILL.md (rule source material)

## TODO

- [ ] Create FETCH rules file with 6 rules
- [ ] Create AUTH rules file with 6 rules
- [ ] Create MOD rules file with 5 rules
- [ ] Create I18N rules file with 5 rules
- [ ] Verify each file < 80 lines
- [ ] Verify frontmatter correct

## Success Criteria

- 4 files created, each with correct frontmatter + rule table
- Each file self-contained — loadable independently
- Rule IDs unique across all ePost files (FETCH-*, AUTH-*, MOD-*, I18N-*)
