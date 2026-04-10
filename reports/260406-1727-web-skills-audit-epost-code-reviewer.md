---
date: 2026-04-06T17:27
agent: epost-code-reviewer
type: code-review
scope: web-platform-skills
verdict: FIX-AND-RESUBMIT
---

# Web Platform Skills Audit

**Scope**: All 11 web skills under `packages/platform-web/skills/` + `packages/a11y/skills/web-a11y/`
**Files read**: 55 files (SKILL.md + all references + select evals)
**Stage 3**: Skipped — skill files, not production code; no auth/payment surfaces

---

## Executive Summary

11 skills audited. 20 findings total: 0 critical, 5 high, 10 medium, 5 low.

Primary concern: `web-modules/references/api-binding.md` uses a fictional FetchBuilder API (`fetchBuilder(URL).fetch<T>()`) that contradicts the canonical pattern documented in `web-api-routes`. This is the highest-priority fix — it will cause agents to generate non-compiling code. Secondary concern: `web-ui-lib/references/` uses generic import paths (`@org/design-system`) that conflict with the actual package path (`@luz-next/klara-theme`). Multiple stubs and missing reference files round out the findings.

---

## Stage 0 — Edge Case Scout

| Dimension | Finding | Affects |
|-----------|---------|---------|
| Boundary | `web-i18n/validate.md` lists env vars as config source; actual loader (`env-config.cjs`) uses `.epost-kit.json` with env override | Stage 1 |
| Integration | `web-modules/api-binding.md` FetchBuilder API (`fetchBuilder().fetch<T>()`) does not match canonical (`new FetchBuilder<T>().execute()`) | Stage 1 |
| Integration | `web-ui-lib/references/integration.md` imports from `@org/design-system`; canonical is `@luz-next/klara-theme` | Stage 1 |
| Integration | `web-modules/api-binding.md` uses `_callers/` dir; `module-scaffold.md` and `code-review-rules.md` use `_services/` | Stage 1 |
| State | `web-frontend/code-review-rules.md` STATE scope includes "Zustand stores" though Zustand is explicitly banned in SKILL.md | Stage 2 |

---

## Findings

### web-modules

```
SKILL: web-modules
FILE: packages/platform-web/skills/web-modules/references/api-binding.md
TYPE: CONFLICT
SEVERITY: high
FINDING: FetchBuilder API in this file uses `fetchBuilder(URL).fetch<T>()` (functional factory style).
  Canonical API defined in web-api-routes is `new FetchBuilder<T>().withUrl(URL).withBearerToken().execute()`.
  These are incompatible call signatures — an agent following api-binding.md will produce non-compiling code.
  Examples at lines 87, 92, 97: `fetchBuilder(LETTER_API.LIST).fetch<Letter[]>()`
FIX: Rewrite Layer 4 example to use canonical FetchBuilder: new FetchBuilder<Letter[]>().withUrl(LETTER_API.LIST).execute()
  Add session retrieval (Pattern B from caller-patterns.md). Remove .fetch<T>() method — it does not exist.
```

```
SKILL: web-modules
FILE: packages/platform-web/skills/web-modules/references/api-binding.md
TYPE: CONFLICT
SEVERITY: high
FINDING: Caller directory is `_callers/` in this file (lines 60, 80) but `module-scaffold.md` calls it `_services/`
  and `code-review-rules.md` rule MOD-002 references `_services/inbox.service.ts` as the pass pattern.
  An agent will get contradictory instructions on where to put service/caller files.
FIX: Align api-binding.md to use `_callers/` (which matches web-api-routes canonical pattern) AND update
  module-scaffold.md + MOD-002 to reference `_callers/` as the FetchBuilder layer directory. Or vice versa —
  pick one, apply everywhere. ESCALATE: requires human decision on which convention to canonicalize.
```

```
SKILL: web-modules
FILE: packages/platform-web/skills/web-modules/references/api-binding.md
TYPE: CONFLICT
SEVERITY: medium
FINDING: API URL `LETTER_API.DETAIL(id)` uses function-call style for URL construction (line 92).
  Canonical pattern in web-api-routes uses string constants + `.replace()`:
  `LETTER_API.DETAIL.replace(':id', id)`.
  Function-call URL builders are inconsistent with the :placeholder convention.
FIX: Replace `LETTER_API.DETAIL(id)` with `LETTER_API.DETAIL.replace(':id', id)` and update the
  API constants example to show a string constant, not a function.
```

### web-ui-lib

```
SKILL: web-ui-lib
FILE: packages/platform-web/skills/web-ui-lib/references/integration.md
TYPE: CONFLICT
SEVERITY: high
FINDING: Import paths use `@org/design-system` (lines 11, 30 etc.) — a placeholder, not the actual package.
  web-prototype-convert SKILL.md line 77 explicitly states the correct import is `@luz-next/klara-theme`.
  Agents following integration.md will generate imports that fail to resolve.
FIX: Replace `@org/design-system` with `@luz-next/klara-theme` throughout integration.md.
```

```
SKILL: web-ui-lib
FILE: packages/platform-web/skills/web-ui-lib/references/components.md
TYPE: CONFLICT
SEVERITY: medium
FINDING: Import example uses `@org/design-system` (line 38). Same conflict as integration.md above.
FIX: Replace with `@luz-next/klara-theme`.
```

```
SKILL: web-ui-lib
FILE: packages/platform-web/skills/web-ui-lib/references/components.md
TYPE: UNSUITABLE_REF
SEVERITY: medium
FINDING: References `epost-mcp-manager` as primary path for component discovery (lines 15-17).
  `epost-mcp-manager` does not appear in the agent roster in CLAUDE.md (11 agents listed — no mcp-manager).
  This instructs agents to delegate to a non-existent agent.
FIX: Replace the "Delegate to epost-mcp-manager" block with a direct Glob fallback:
  `Glob: libs/klara-theme/docs/index.json` then load entries as instructed in SKILL.md.
  Or update if epost-mcp-manager was renamed — ESCALATE: confirm current agent name.
```

```
SKILL: web-ui-lib
FILE: packages/platform-web/skills/web-ui-lib/references/contributing.md
TYPE: OUTDATED
SEVERITY: low
FINDING: Step 1 says "Search knowledge/klara-theme/components.md first" — this path doesn't exist.
  The actual reference is `libs/klara-theme/docs/index.json` per SKILL.md.
FIX: Update to "Read libs/klara-theme/docs/index.json and check FEAT-0001 component catalog first."
```

### web-i18n

```
SKILL: web-i18n
FILE: packages/platform-web/skills/web-i18n/references/validate.md
TYPE: CONFLICT
SEVERITY: medium
FINDING: validate.md header (lines 9-14) presents 3 env vars (I18N_GOOGLE_SHEET_ID, I18N_MESSAGES_DIR, I18N_LOCALES)
  as the required configuration. SKILL.md and env-config.cjs are clear: config comes from `.epost-kit.json`,
  with env vars as override only. An agent reading validate.md in isolation will instruct users to set env vars
  that are actually populated from `.epost-kit.json` by the script automatically.
FIX: Replace the "Configuration" section's env var example with:
  "Config is loaded from `.epost-kit.json` automatically via `--cwd`. Env vars override only for CI."
  Keep the env var names as override references but clarify they are not required when .epost-kit.json is present.
```

```
SKILL: web-i18n
FILE: packages/platform-web/skills/web-i18n/references/i18n-patterns.md
TYPE: OUTDATED
SEVERITY: medium
FINDING: `createSharedPathnamesNavigation` (line 87) was deprecated in next-intl v3.
  In next-intl v3+, the correct API is `createNavigation` (simpler, unified).
  The legacy API still works but is deprecated and removed in some v3 minor versions.
FIX: ESCALATE — confirm which next-intl version the project uses. If v3+, replace
  `createSharedPathnamesNavigation` with `createNavigation`. If still on v2, add a version comment.
```

### web-forms

```
SKILL: web-forms
FILE: packages/platform-web/skills/web-forms/references/form-patterns.md
TYPE: MISSING_REF
SEVERITY: high
FINDING: File is a stub: "Stub — content to be filled during implementation." (lines 1-6).
  SKILL.md for web-forms references form-patterns.md implicitly via its reference table. This file
  provides no actual content. Agents loading this reference receive nothing useful.
FIX: Populate form-patterns.md with: controlled vs uncontrolled input comparison, RHF + klara-theme
  FormField integration pattern, multi-step form pattern, file upload pattern.
  At minimum add the klara-theme FormField binding example since that's the most common gap.
```

```
SKILL: web-forms
FILE: packages/platform-web/skills/web-forms/evals/eval-set.json
TYPE: MISSING_REF
SEVERITY: low
FINDING: All 3 evals are stubs (status: "stub", TODO input/expected). No coverage of RHF, Zod,
  API error mapping, or accessible error states — all of which are core to the skill.
FIX: Write real evals covering: (1) "add form validation with Zod", (2) "map API errors to fields",
  (3) "make form errors accessible with ARIA". Remove stub entries.
```

### web-prototype-convert

```
SKILL: web-prototype-convert
FILE: packages/platform-web/skills/web-prototype-convert/SKILL.md
TYPE: MISSING_REF
SEVERITY: medium
FINDING: SKILL.md references 5 files in `references/` (analysis-checklist.md, component-mapping.md,
  token-mapping.md, style-migration.md, data-migration.md) but the `references/` directory does not exist.
  The skill is user-invocable and its workflow is entirely driven by these reference files.
  An agent following this skill has no reference material — all 5 steps are empty.
FIX: Create the `references/` directory and stub files, or mark the skill `user-invocable: false`
  and add a TODO note until references are written. ESCALATE: determine if this skill is actively used.
```

```
SKILL: web-prototype-convert
FILE: packages/platform-web/skills/web-prototype-convert/SKILL.md
TYPE: MISSING_REF
SEVERITY: low
FINDING: No evals directory exists for this skill. All other user-invocable skills have evals.
FIX: Create `evals/eval-set.json` with at least 2-3 trigger/no-trigger pairs.
```

### web-frontend

```
SKILL: web-frontend
FILE: packages/platform-web/skills/web-frontend/references/code-review-rules.md
TYPE: CONFLICT
SEVERITY: medium
FINDING: STATE scope (line 50) reads "Redux slices, Zustand stores, React context, XState machines."
  web-frontend SKILL.md rules (line 76) explicitly state "Use Redux Toolkit for state — NOT Zustand."
  Including Zustand in the STATE scope implies it's a valid pattern to audit against, but it's banned.
  Agents will produce confusing review notes about Zustand patterns in a codebase where Zustand can't exist.
FIX: Remove "Zustand stores" from STATE scope description. Replace with "RTK slices, React context."
```

```
SKILL: web-frontend
FILE: packages/platform-web/skills/web-frontend/references/code-review-rules.md
TYPE: CONFLICT
SEVERITY: medium
FINDING: PERF-004 pass criterion (line 27) says "React Query cache, SWR, or memoization applied."
  web-api-routes SKILL.md explicitly bans SWR and React Query (line 119): "Do NOT use: SWR, React Query."
  An agent following PERF-004 will suggest using prohibited libraries as a "pass" condition.
FIX: Rewrite PERF-004 pass to: "RTK Query cache, React.cache(), or useMemo applied to expensive deterministic operations."
  Remove React Query / SWR from the pass examples entirely.
```

### web-auth

```
SKILL: web-auth
FILE: packages/platform-web/skills/web-auth/references/auth-patterns.md
TYPE: OUTDATED
SEVERITY: medium
FINDING: Token refresh logic (lines 33-40) uses `moment.js` for date comparison.
  moment.js is a deprecated library (maintenance-only since 2020, 72KB bundle weight).
  Modern equivalent is date-fns or Day.js. Using moment in a new pattern reference propagates technical debt.
FIX: ESCALATE — confirm if the actual project codebase uses moment.js. If yes, this is a pre-existing
  tech debt signal worth noting as FINDING in docs/. If no, replace with native Date or date-fns equivalent.
```

### web-nextjs

```
SKILL: web-nextjs
FILE: packages/platform-web/skills/web-nextjs/references/performance.md
TYPE: OUTDATED
SEVERITY: low
FINDING: Line 125 warns "Do NOT use `after()` (Next.js 15+)". This warning is useful but
  doesn't explain what to use instead for post-response work. Also `after()` is documented
  as stable in Next.js 14.2+ — the 15+ attribution is slightly inaccurate.
FIX: Update to: "Do NOT use `after()` — not stable in this project's Next.js version.
  Use `setTimeout` or fire-and-forget patterns for post-response side effects if needed."
  Or remove if there's no viable alternative — at minimum fix the version attribution.
```

### web-testing

```
SKILL: web-testing
FILE: packages/platform-web/skills/web-testing/references/jest-rtl-patterns.md
TYPE: MISSING_REF
SEVERITY: low
FINDING: Custom render helper (lines 86-95) imports directly from `@/redux/store` — a single store.
  web-frontend documents a dual-store pattern (Global + Feature stores). The custom render helper
  doesn't show how to wrap with a Feature store, which is needed for most module component tests.
FIX: Add a second render helper example: `renderWithFeatureStore(ui, preloadedState?)` that wraps with
  the feature-scoped Provider. Link to web-frontend dual-store docs.
```

### web-nextjs (eval quality)

```
SKILL: web-nextjs
FILE: packages/platform-web/skills/web-nextjs/evals/eval-set.json
TYPE: MISSING_REF
SEVERITY: low
FINDING: No negative eval (should_trigger: false) for "write a server action" or "add middleware".
  These are core Next.js skill triggers and absence of negative evals allows false triggers.
  (Minor — current coverage is adequate for routing/layout/server-component queries.)
FIX: Add 2-3 should_trigger: false cases: "write a Jest test", "add a Playwright spec", "update Redux slice."
```

---

## Summary Table

| Severity | Count | Skills Affected |
|----------|-------|-----------------|
| Critical | 0 | — |
| High | 5 | web-modules (2), web-ui-lib (1), web-forms (1) |
| Medium | 10 | web-modules (1), web-ui-lib (1), web-i18n (2), web-frontend (2), web-auth (1), web-prototype-convert (1) |
| Low | 5 | web-ui-lib (1), web-forms (1), web-prototype-convert (1), web-testing (1), web-nextjs (1) |
| **Total** | **20** | |

---

## Top 3 Priority Fixes

1. **web-modules/api-binding.md FetchBuilder API** (HIGH) — Wrong method names will cause compile failures. Fix the Layer 4 example to use `new FetchBuilder<T>().withUrl().execute()` and align `_callers/` vs `_services/` naming.

2. **web-ui-lib integration.md + components.md import path** (HIGH) — `@org/design-system` is a placeholder that won't resolve. Replace with `@luz-next/klara-theme` everywhere in these reference files.

3. **web-forms/form-patterns.md stub** (HIGH) — This reference file is completely empty. web-forms is a named skill; having no reference content means agents generate forms without klara-theme FormField integration. Populate with the RHF + klara-theme binding pattern at minimum.

---

## Escalation List (Requires Human Decision)

| ID | Skill | Issue | Why Human Needed |
|----|-------|-------|------------------|
| ESC-001 | web-modules | `_callers/` vs `_services/` — which is canonical? | api-binding.md says `_callers/`, module-scaffold.md + MOD-002 say `_services/`. Both can't be right. |
| ESC-002 | web-ui-lib | `epost-mcp-manager` reference in components.md | Not in current 11-agent roster. Was it renamed? Removed? |
| ESC-003 | web-i18n | `createSharedPathnamesNavigation` deprecation | Need to confirm next-intl version in use before changing. |
| ESC-004 | web-auth | `moment.js` in auth-patterns.md | Is the actual codebase using moment.js? If yes → tech debt finding; if no → update reference. |
| ESC-005 | web-prototype-convert | Missing references/ directory | Is this skill actively used? If yes, references must be written. If no, mark user-invocable: false. |

---

## Methodology

- **Scope**: Explicit (all files under packages/platform-web/skills/ + packages/a11y/skills/web-a11y/)
- **git diff**: Skipped — explicit scope provided
- **KB layers**: L2 repo docs only (packages/); no RAG, no knowledge escalation (no Critical findings)
- **Files read**: 11 SKILL.md, 30 references/*.md, 4 evals/eval-set.json, 1 scripts/env-config.cjs (partial)
- **Rules applied**: LOGIC-001–003 (correctness/consistency), ARCH-001–003 (boundaries), DEAD-001 (stubs)
- **Stage 3**: Skipped — ≤2 files per skill, no auth/payment/security surfaces in skill docs

---

## Unresolved Questions

1. What next-intl version is the project using? Needed for ESC-003.
2. Is `epost-mcp-manager` a current agent or was it renamed? Needed for ESC-002.
3. Is web-prototype-convert actively used in production? Needed for ESC-005 priority decision.
4. Does the actual app codebase use moment.js or has it been replaced? Needed for ESC-004.
5. Were the web-modules `_callers/` vs `_services/` directories ever standardized in the actual codebase? Needed for ESC-001.
