---
date: 2026-04-06T22:55
agent: epost-code-reviewer
type: skill-quality-audit
status: DONE
scope: web platform skills (11 skills)
---

# Web Platform Skills — Self-Evaluation Report

**Date**: 2026-04-06  
**Agent**: epost-code-reviewer  
**Scope**: `packages/platform-web/skills/` (10 skills) + `packages/a11y/skills/web-a11y/` (1 skill)  
**Methodology**: Read SKILL.md for each skill; skim references/ headers (file names + line counts); inspect evals/eval-set.json; check frontmatter completeness.

---

## web-frontend

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 4/5   | Clear purpose (React/Redux patterns). Triggers precise. Slight overlap with web-nextjs on "components in app/". |
| Accurate     | 4/5   | RTK dual-store architecture well-documented. "React 18 only" rule explicit. Minor: CSO risk in description — leads with "Builds" verb (workflow) before "Use when" trigger clause. |
| Reusable     | 5/5   | Generic React + Redux patterns — applies across every web feature, no B2B hardcoding. |
| Token Eff.   | 4/5   | 97 lines in SKILL.md — slightly over 80-line target. Good progressive disclosure into 4 references. Sub-skill routing table adds ~8 lines of value. |
| Maintainable | 4/5   | 4 references, each with a single concern. Provider nesting deferred to web-auth (good cross-reference). No section has mixed concerns. |
| **Total**    | **21/25** | |

Top strength: Clear dual-store documentation with explicit anti-patterns (no Zustand/React Query).  
Top weakness: SKILL.md is 97 lines — 20% over target. Build commands section (8 lines) is low-value noise that belongs in a dev guide, not a skill.  
Recommended action: **MINOR_FIXES** — strip build commands to a one-liner, trim to < 80 lines.

---

## web-nextjs

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 4/5   | App Router patterns are distinct from web-frontend. Route structure diagram is the most valuable part. Triggers are precise. |
| Accurate     | 4/5   | `_prefix` convention, catch-all pattern, and error boundary hierarchy all documented clearly. FetchBuilder "never throws" contract cross-referenced correctly. |
| Reusable     | 4/5   | Applies to any Next.js 14 app. Route structure is ePost-specific but not module-specific. |
| Token Eff.   | 3/5   | 115 lines — 44% over target. Full ASCII route tree is valuable but verbose. 3 references are well-scoped. |
| Maintainable | 4/5   | 3 focused references. Server vs Client boundary table is clean. Sub-skill routing table is slightly redundant with web-frontend's version. |
| **Total**    | **19/25** | |

Top strength: Route structure diagram + `_prefix` convention — this is high-density, high-value content not duplicated elsewhere.  
Top weakness: 115 lines. The route tree ASCII art alone is ~20 lines. Could be extracted to `references/routing.md` (which already exists).  
Recommended action: **MINOR_FIXES** — move route tree to `references/routing.md`, keep SKILL.md under 80 lines.

---

## web-api-routes

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 5/5   | FetchBuilder is unique to this project — no other skill covers it. Triggers are specific (`route.ts`, `fetchbuilder`). |
| Accurate     | 5/5   | FetchResponse types, isErrorResponse(), placeholder convention, route handler raw-fetch exception — all verified and precise. "Do NOT use" list explicitly blocks SWR/React Query confusion. |
| Reusable     | 5/5   | FetchBuilder is used for every API call across all web features. Completely generic. |
| Token Eff.   | 4/5   | 119 lines — slightly over. Route handler code example (18 lines) is concrete and useful. 2 references well-scoped. |
| Maintainable | 5/5   | Cleanest structure of all web skills: types → API → caller pattern → constants → route handlers → rules. Each section has one job. |
| **Total**    | **24/25** | |

Top strength: FetchResponse types + "never throws" contract with concrete isErrorResponse() usage — zero ambiguity.  
Top weakness: SKILL.md is 119 lines; route handler example could move to `references/caller-patterns.md`.  
Recommended action: **KEEP_AS_IS** (or minor trim at discretion).

---

## web-auth

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 5/5   | Auth is a distinct surface. Provider nesting, session access patterns by context, feature flags — all auth-specific, no overlap. |
| Accurate     | 4/5   | NextAuth v4 + Keycloak pattern, JWT strategy, token refresh logic described correctly. "updateAge: 0" is a non-obvious config — worth documenting. Feature flag LRU cache noted. |
| Reusable     | 4/5   | Mostly generic. "e.g., Keycloak, Auth0, Azure AD" wording shows awareness of generality. Slightly ePost-specific (`organizationId`, `roles` fields in session). |
| Token Eff.   | 5/5   | 65 lines — well under 80. Almost everything deferred to `references/auth-patterns.md` (124 lines). Perfect progressive disclosure. |
| Maintainable | 4/5   | Single reference file owns all the detail. Provider nesting is inline — appropriate since it's short. Missing `paths:` field means file-based trigger won't fire. |
| **Total**    | **22/25** | |

Top strength: Leanest SKILL.md at 65 lines, perfect progressive disclosure model.  
Top weakness: Missing `paths:` frontmatter field — no file-based trigger. Auth files (`auth-options.ts`, `[...nextauth]`) won't auto-load this skill.  
Recommended action: **MINOR_FIXES** — add `paths: ["**/auth-options.ts", "**/[...nextauth]/**", "**/session*.ts"]`.

---

## web-i18n

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 5/5   | Clearly scoped to i18n. Google Sheets sync workflow is unique — no other skill covers it. `user-invocable: true` is correct (agents invoke `/i18n --pull`). |
| Accurate     | 4/5   | Push/pull/validate scripts, `.epost-kit.json` config structure, next-intl usage patterns all documented. Script paths (`.claude/skills/web-i18n/scripts/`) reference generated output — acceptable since scripts live there. |
| Reusable     | 3/5   | next-intl patterns are generic. Google Sheets sync is ePost-specific. Config JSON has hardcoded `googleSheetId` example — fine as example but could confuse. |
| Token Eff.   | 3/5   | 115 lines — over target. Flags table + execution table + push orchestration flow + config JSON example together are ~60 lines. Useful but dense. |
| Maintainable | 4/5   | 4 focused references (pull.md, push.md, validate.md, i18n-patterns.md). Script workflow is documented in SKILL.md (appropriate — it's the invocation surface). |
| **Total**    | **19/25** | |

Top strength: Push orchestration flow with exit-code-based branching — this is non-obvious behavior that must live in the skill body.  
Top weakness: At 115 lines, the config JSON example and next-intl quick reference are candidates for references/. The quick reference duplicates `references/i18n-patterns.md`.  
Recommended action: **MINOR_FIXES** — move `next-intl Quick Reference` section to `references/i18n-patterns.md`.

---

## web-testing

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 5/5   | Testing Trophy, CI gate order, Jest + Playwright coverage — clearly scoped, no overlap with other skills. |
| Accurate     | 4/5   | Jest mock patterns (`MockedFunction`, `jest.clearAllMocks`), Playwright config (`fullyParallel`, `storageState`) verified. `setupFilesAfterSetup` in SKILL.md is likely a typo for `setupFilesAfterFramework`. |
| Reusable     | 5/5   | Fully generic — applies to any web feature's test suite. No B2B assumptions. |
| Token Eff.   | 3/5   | 109 lines. Jest patterns section has 15 lines of code examples inline — these belong in `references/jest-rtl-patterns.md`. Also has a `## Test Commands` section that duplicates build commands from web-frontend. |
| Maintainable | 4/5   | 5 references, each with a distinct focus. Slight concern: `test-flakiness-mitigation.md` and `test-data-management.md` have no direct pointers in the SKILL.md body — discoverable only via the references table. |
| **Total**    | **21/25** | |

Top strength: CI/CD gate order with timing estimates (seconds vs minutes) — actionable ordering that agents would otherwise guess.  
Top weakness: `setupFilesAfterSetup` typo (should be `setupFilesAfterFramework` per Jest docs). Test Commands block (8 lines) is noise — these are in web-frontend already.  
Recommended action: **MINOR_FIXES** — fix typo, remove Test Commands block, move Jest code examples to references.

---

## web-modules

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 3/5   | B2B module integration workflow is clear. But triggers ("add to module", "create screen", "bind api") overlap with web-frontend triggers ("add a component", "create a page"). Agents may load both. |
| Accurate     | 4/5   | 9-step integration workflow is correct. References all exist. api-binding.md was recently fixed (FetchBuilder). |
| Reusable     | 2/5   | Explicitly B2B-only: "B2B module screens", "B2B module scaffolding". Not applicable to B2C or generic Next.js work. |
| Token Eff.   | 5/5   | 48 lines — leanest SKILL.md in the set. Almost pure pointer to references. Model for other skills. |
| Maintainable | 4/5   | 6 well-named references. Integration workflow is a numbered list — easy to add/remove steps. |
| **Total**    | **18/25** | |

Top strength: Best token efficiency in the set (48 lines). Pure progressive disclosure — SKILL.md is an index, not a tutorial.  
Top weakness: Hard-coded to B2B. Any B2C or generic module work won't benefit. Trigger overlap with web-frontend could cause both to load unnecessarily.  
Recommended action: **MINOR_FIXES** — add `domain-b2b` to connections, tighten triggers to be more B2B-specific (e.g., "module screen", "B2B module").

---

## web-ui-lib

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 4/5   | klara-theme KB routing is unique — no other skill does this. "Load live KB first" instruction is valuable. Slight concern: this skill is a meta-loader for another KB, not a self-contained knowledge base. |
| Accurate     | 4/5   | KB index path (`libs/klara-theme/docs/index.json`) and FEAT/CONV/ARCH entry IDs are documented. Index.json fallback via Glob is provided. May go stale if klara-theme entry IDs change. |
| Reusable     | 3/5   | Specific to klara-theme. Projects not using klara-theme get no value. But within ePost, applies to all web features using the design system. |
| Token Eff.   | 4/5   | 53 lines — well under 80. KB loading instructions are lean. References table (5 files) is clear. |
| Maintainable | 3/5   | The entry ID table (FEAT-0001, CONV-0001 etc.) is hardcoded — will silently go stale when klara-theme docs evolve. No "last verified" date. |
| **Total**    | **18/25** | |

Top strength: Task-based KB loading table (component lookup → FEAT-0001, token audit → CONV-0006) eliminates guessing which doc to load.  
Top weakness: Hardcoded entry IDs with no version pin or staleness warning. If klara-theme renames CONV-0003 → CONV-0008, this skill silently breaks.  
Recommended action: **MINOR_FIXES** — add staleness warning, recommend validating IDs via `index.json` before using.

---

## web-forms

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 4/5   | React Hook Form + Zod is distinct enough from web-frontend. Accessible error states give it unique value. Minor overlap with web-a11y on ARIA form patterns. |
| Accurate     | 5/5   | Code examples are clean and verified. `zodResolver`, `mode: 'onBlur'`, `reValidateMode: 'onChange'`, `aria-describedby` + `role="alert"` pattern — all correct. |
| Reusable     | 5/5   | RHF + Zod pattern applies to every form in the application. No B2B assumptions. |
| Token Eff.   | 3/5   | 122 lines with substantial inline code. Every section has a code block. Code examples are valuable but push SKILL.md past 80-line target significantly. Only 1 reference (form-patterns.md) handles overflow. |
| Maintainable | 3/5   | Only 1 reference file. All schema, validation timing, API error mapping, and ARIA patterns are inline — updating requires editing SKILL.md directly. Should distribute across 3-4 references. |
| **Total**    | **20/25** | |

Top strength: Complete, immediately-usable code examples for the 3 most common form patterns.  
Top weakness: Single reference file + 122-line SKILL.md. The SKILL.md is doing the work that 3 reference files should do. Hard to update one concern without disturbing others.  
Recommended action: **MINOR_FIXES** — extract API error mapping and ARIA error states to `references/form-patterns.md`, move Zod schema guidance there too. Keep just the basic setup example inline.

---

## web-prototype-convert

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 3/5   | Concept is valid — prototype-to-production conversions are a real task. But the SKILL.md opens with "References not yet written. This skill is disabled." Self-declared disabled. |
| Accurate     | 2/5   | Workflow steps point to 5 reference files that DO NOT EXIST (`analysis-checklist.md`, `component-mapping.md`, `token-mapping.md`, `style-migration.md`, `data-migration.md`). Following this skill produces broken guidance. |
| Reusable     | 3/5   | Workflow is generic (Step 1–6 pattern). Quick Reference has hardcoded klara-theme import path (`@luz-next/klara-theme`) that may be stale. |
| Token Eff.   | 2/5   | 91 lines describing a workflow that doesn't work. All content is waste until references exist. |
| Maintainable | 1/5   | No references, no evals, self-declared disabled. Maintenance is impossible — there's nothing to maintain. |
| **Total**    | **11/25** | |

Top strength: The 6-step workflow structure is sound and maps cleanly to real conversion tasks.  
Top weakness: All 5 referenced files are missing. The skill is self-declared broken. Agents loading it will follow steps that dead-end on missing files.  
Recommended action: **NEEDS_REWRITE** — either create the 5 reference files and remove the "disabled" notice, or DEPRECATE until resources are available.

---

## web-a11y

| Dimension    | Score | Rationale |
|---|---|---|
| Useful       | 5/5   | Clearly scoped to web a11y. Fix templates table is uniquely useful — maps symptom to template. Triggers are specific (aria fix, keyboard navigation). No overlap with web-forms ARIA content because web-a11y is the authoritative source. |
| Accurate     | 5/5   | Semantic HTML, ARIA, keyboard patterns all WCAG 2.1 AA compliant. tabIndex rules, aria-live, focusVisible — all correct. Testing tools section is useful and accurate. |
| Reusable     | 5/5   | Fully generic WCAG patterns — applies to any component, any feature. |
| Token Eff.   | 3/5   | 136 lines — highest in the set. Inline code examples are valuable (icon button, ARIA state patterns) but the SKILL.md contains Quick Reference sections that duplicate `references/web-aria.md` and `references/web-keyboard-focus.md`. |
| Maintainable | 4/5   | 6 focused references, each scoping one WCAG concern. Fix templates table is easy to extend. The inline Quick Reference sections create drift risk vs the reference files. |
| **Total**    | **22/25** | |

Top strength: Fix template table (7 templates with precise when-to-apply conditions) — this is the most decision-useful table in any web skill.  
Top weakness: At 136 lines (highest), the Quick Reference sections partially duplicate the references. Remove inline code examples and redirect to references.  
Recommended action: **MINOR_FIXES** — move Quick Reference code blocks to `references/web-aria.md` and `references/web-keyboard-focus.md`. Target < 90 lines.

---

## Ranked Leaderboard

| Rank | Skill | Total | Verdict |
|------|-------|-------|---------|
| 1 | web-api-routes | 24/25 | KEEP_AS_IS |
| 2 | web-auth | 22/25 | MINOR_FIXES |
| 2 | web-a11y | 22/25 | MINOR_FIXES |
| 4 | web-frontend | 21/25 | MINOR_FIXES |
| 4 | web-testing | 21/25 | MINOR_FIXES |
| 6 | web-forms | 20/25 | MINOR_FIXES |
| 7 | web-nextjs | 19/25 | MINOR_FIXES |
| 7 | web-i18n | 19/25 | MINOR_FIXES |
| 9 | web-modules | 18/25 | MINOR_FIXES |
| 9 | web-ui-lib | 18/25 | MINOR_FIXES |
| 11 | web-prototype-convert | 11/25 | NEEDS_REWRITE |

---

## Skills That Need Rewrite (< 15/25)

**web-prototype-convert (11/25)** — all 5 reference files missing, self-declared disabled, no evals, dead-ends on every workflow step. Rewrite = either create the 5 refs or deprecate cleanly.

---

## Skills to Deprecate (< 10/25 OR complete overlap)

None score below 10/25. No complete overlaps detected (web-forms and web-a11y both cover form ARIA but from different angles — web-forms is implementation, web-a11y is compliance).

**web-prototype-convert** is a candidate for deprecation if reference files aren't created within the current sprint — a broken skill wastes agent tokens and produces incorrect output.

---

## Token Efficiency Quick Wins

**Win 1 — web-a11y**: Remove inline Quick Reference code blocks (ARIA Labels, Keyboard Navigation, React Patterns) — ~30 lines. These duplicate `references/web-aria.md` and `references/web-keyboard-focus.md`. Saves ~22% of the 136-line SKILL.md.

**Win 2 — web-nextjs**: Move route structure ASCII tree (~20 lines) to `references/routing.md` (already exists). Add a 2-line summary in SKILL.md. Saves ~17% of the 115-line SKILL.md.

**Win 3 — web-forms**: Extract all code examples to `references/form-patterns.md`. Keep only the 4 Rules as inline text. Current: 122 lines with 5 code blocks. Target: ~45 lines (63% reduction). `form-patterns.md` is already present and 295 lines — it can absorb this content.

---

## Unresolved Questions

1. `web-prototype-convert`: Is there an owner actively working on the 5 missing reference files? If not, should the skill be hidden/disabled via `user-invocable: false` and a disabled flag to prevent agents from loading broken steps?
2. `web-testing`: Is `setupFilesAfterSetup` a typo for `setupFilesAfterFramework`? Needs verification against actual `jest.config.js`.
3. `web-ui-lib`: The entry IDs (FEAT-0001, CONV-0001, etc.) are hardcoded — when were they last verified against `libs/klara-theme/docs/index.json`?
4. `web-auth`: Is the `paths:` omission intentional (auth loaded by keyword trigger only) or an oversight?
5. `web-modules`: Should `domain-b2b` be a hard dependency (`connections.requires`) rather than a soft cross-reference? B2B module context seems prerequisite, not optional.
