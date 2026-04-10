---
date: 2026-04-08
agent: epost-code-reviewer
skill: web-prototype-convert
plan: plans/260407-1240-web-prototype-convert-redesign
status: DONE_WITH_CONCERNS
verdict: PASS_WITH_CONCERNS
---

# Code Review — web-prototype-convert Skill Audit

## Executive Summary

The skill is well-structured and covers the conversion pipeline comprehensively. The 4-phase pipeline is coherent, Phase B's output contract is clearly specified, and the reference files are well-differentiated. The primary concerns are: (1) a critical import path mismatch in `data-migration.md` that would generate non-compiling code, (2) FetchBuilder's "never throws" error-handling contract is absent from the service pattern, and (3) a directory naming inconsistency (`_services/` vs `caller/`) that diverges from the canonical web-api-routes pattern.

---

## Findings Table

| ID | File | Severity | Category | Description |
|----|------|----------|----------|-------------|
| F-001 | data-migration.md | **Critical** | LOGIC | FetchBuilder imported from `@luz-next/shared/http` — does not match actual path `../service/fetch-builder` used in web-api-routes skill |
| F-002 | data-migration.md | **Critical** | LOGIC | Service pattern omits error check on `response.error` — FetchBuilder never throws, so missing this check silently swallows errors |
| F-003 | data-migration.md | **Major** | ARCH | Uses `_services/` directory for API callers; canonical pattern from web-api-routes is `caller/` with `'use server'` — creates friction when developer follows this skill then reads web-api-routes |
| F-004 | data-migration.md | **Major** | LOGIC | `useAuthToken()` from `@luz-next/shared/auth` — not confirmed accurate; web-api-routes/web-auth skills use session retrieval inside `'use server'` actions, not a `useAuthToken` hook |
| F-005 | data-migration.md | **Major** | LOGIC | Hook calls service directly (`getLetters(token).then(setData)`) with no error handling — `useEffect` pattern here contradicts the `caller/` + server action flow taught in web-nextjs/web-modules |
| F-006 | SKILL.md | **Minor** | LOGIC | Phase C says "Always do a first-encounter live read to validate mapping freshness" but this conflicts with the HIGH-confidence row that says "skip live read" — the rule and table are contradictory |
| F-007 | component-mapping.md | **Minor** | ARCH | Confidence tiers defined in §5 but SKILL.md Phase C table uses same tiers — no cross-reference from Phase C to §5 of component-mapping.md for the reader |
| F-008 | style-migration.md | **Minor** | LOGIC | Inline styles example: `style={{ padding: '16px' }}` → `p-4` (Tailwind) — contradicts token-mapping.md §4 which explicitly calls out `p-4` as wrong and requires `p-400` (klara scale) |
| F-009 | eval-set.json | **Minor** | ARCH | No negative case for "update klara-theme component props" vs updating a prototype-sourced component — edge trigger overlap with web-ui-lib |
| F-010 | SKILL.md | **Minor** | ARCH | Line count is 77 — within ≤80 limit but very close; future additions will breach the limit |

---

## Stage 0 — Edge Case Scout

| Dimension | Edge Cases Found | Stage Impact |
|-----------|-----------------|--------------|
| Boundary | Prototype with NO package.json (plain HTML) — analysis-checklist handles it | Stage 1 ✅ |
| State | No-match klara component (drag-drop, charts) — escalated to 🔴 in Phase B | Stage 1 ✅ |
| Integration | Missing backend endpoint — stub pattern exists in data-migration.md §5 | Stage 1 ✅ |
| Integration | FetchBuilder error shape not covered in service pattern | Stage 2 → **F-002** |
| Boundary | Prototype using Pages Router (not App Router) — covered in style-migration.md §7 | Stage 1 ✅ |
| Auth | Token passed as client prop to server action — explicitly forbidden in §9 | Stage 1 ✅ |

---

## Stage 1 — Spec Compliance

### 1. SKILL.md Quality — PASS WITH MINOR ISSUES

- 4-phase pipeline (UNDERSTAND → DECIDE → IMPLEMENT → VALIDATE): logical, sequential, gates are respected
- Phase B 3-section output contract (✅/🟡/🔴): clearly specified with format rules and bold-keyword format
- Phase C confidence-tiered live source reading: table is present and directive; "always do first-encounter live read" instruction creates ambiguity with HIGH tier row (F-006)
- Reference table: complete, all 5 files listed with correct phases
- `user-invocable: true`: confirmed set (line 5)
- Line count: 77 — within ≤80 limit (F-010 as watch item)

### 2. Reference File Coherence — PASS

- No content overlap detected across files
- Each file stays in its lane: analysis-checklist = Phase A only, component-mapping = B/C, token-mapping = B/C, style-migration = C, data-migration = C
- Cross-references between files are directional and correct

### 3. LLM Usability — PASS WITH CONCERNS

- Instructions are directive throughout (imperative verbs, explicit rules, wrong→right examples)
- Phase B question format ("Reply **collapsible** or **fixed**") is excellent — non-developer readable
- Confidence tiers used consistently in component-mapping.md and SKILL.md Phase C table
- The "live source reading" instruction in SKILL.md is precise (exact directory path given)
- F-006 (contradiction between "always first-encounter read" and HIGH=skip live read) creates LLM ambiguity that could cause inconsistent behavior

---

## Stage 2 — Code Quality

### F-001 (Critical) — FetchBuilder import path

`data-migration.md` teaches:
```ts
import { FetchBuilder } from '@luz-next/shared/http';
```

Actual import per `web-api-routes/references/caller-patterns.md`:
```ts
import { FetchBuilder } from '../service/fetch-builder';
```

An LLM following this skill would generate non-compiling code. This is the most impactful bug in the skill.

**Fix**: Update all FetchBuilder import examples to use `'../service/fetch-builder'` (relative) or document the actual package path if it truly exports from `@luz-next/shared/http`. Cross-reference `web-api-routes` skill.

---

### F-002 (Critical) — Missing error check

The canonical service pattern in data-migration.md §2 omits `response.error` check entirely. FetchBuilder's contract is "never throws — check response.error". The hook pattern then calls `.then(setData)` directly, which receives `undefined` when an error occurs.

**Fix**: Add error check to the service return or add error handling to the hook:
```ts
// In the hook
useEffect(() => {
  getLetters(token).then((data) => {
    if (data) setData(data);
  });
}, [token]);
```
Or teach that services should check `response.error` internally and return `null | T`.

---

### F-003 (Major) — `_services/` vs `caller/` directory naming

`data-migration.md` teaches `_services/{entity}Service.ts` as the API caller location. The canonical location per `web-api-routes/references/caller-patterns.md` is `caller/` (no underscore prefix), and caller files must begin with `'use server'`.

`web-modules/references/api-binding.md` uses `_services/letter-caller.ts` — so `_services/` does appear in module context. This is a genuine inconsistency across skills, not a fabrication. However, `data-migration.md`'s service files lack `'use server'` directive, which is required per web-api-routes.

**Fix**: Add `'use server'` to service/caller file examples in data-migration.md, and add a note that the directory may be `_services/` (module convention) or `caller/` (route-level convention).

---

### F-004 (Major) — `useAuthToken()` unverified

The hook pattern uses `import { useAuthToken } from '@luz-next/shared/auth'`. This hook is not documented in `web-auth` skill or any other reference file. The web-auth skill describes `getAuthSession()` action in `_services/_actions/auth-session.action.ts`. Client-side token extraction is typically discouraged in favor of server-side session access.

**Fix**: Replace with the documented auth pattern from `web-auth` skill, or explicitly mark this as a simplified teaching example with a note pointing to `web-auth` for production patterns.

---

### F-005 (Major) — Hook pattern contradicts server action flow

The hook in §3 directly calls the service (`getLetters(token)`) from a `useEffect`. The web-nextjs skill teaches that API calls go through `caller/` files with `'use server'`, and components should invoke server actions — not call service functions from client-side hooks.

This teaches an architecture that bypasses the server boundary.

**Fix**: Either (a) teach a server component pattern that calls the service in an async server component, or (b) teach the server action wrapper pattern where the hook dispatches an action. Clarify which pattern applies in which case (client component vs server component).

---

### F-008 (Minor) — Spacing token contradiction

`style-migration.md` §6 maps `style={{ padding: '16px' }}` → `p-4` (Tailwind).
`token-mapping.md` §4 explicitly marks `p-4` as wrong and requires `p-400` (klara scale).

These files are read by the same agent in the same Phase C. The contradiction will cause the LLM to resolve ambiguity unpredictably.

**Fix**: `style-migration.md` §6 should use `p-400` not `p-4`, consistent with token-mapping.md.

---

### F-006 (Minor) — Phase C instruction contradiction

SKILL.md Phase C states: "Always do a first-encounter live read to validate mapping freshness."
Phase C table HIGH row states: "skip live read."

**Fix**: Clarify "first-encounter" means once per skill invocation session (not once per file). Or restate as: "For first use of any component, do one live read regardless of tier; on subsequent uses of the same component within the same invocation, apply the tier."

---

## Stage 3 — Adversarial Review

Scope gate: 5+ files changed, covers migration/conversion code → Stage 3 runs.

**Attack vector: LLM hallucinating correct output**

An LLM following this skill for a real prototype conversion would:
1. Correctly invoke all 4 phases
2. Correctly structure Phase B spec
3. Fail at Phase C — generate non-compiling FetchBuilder imports (F-001)
4. Produce service files that silently eat errors (F-002)
5. Place data fetching logic client-side in a useEffect instead of server-side (F-005)

Result: migrated code compiles if the developer patches the import, but has a subtle error-swallowing bug and a security/architecture concern (auth token on client side).

**Attack vector: Phase B stop gate bypass**

Phase C explicitly says "STOP and wait for user confirmation before Phase C." — this is in Phase B, not Phase C. An LLM reading quickly might execute C without pause. The STOP instruction should be formatted more visibly (e.g., block-quoted or in a warning box) and should be at the END of Phase B description, not embedded mid-paragraph.

**Attack vector: confidence tier gaming**

An LLM might classify all components as HIGH to avoid live reads (faster response). The instruction "always do a first-encounter live read" in Phase C provides a forcing function but it contradicts the HIGH tier (F-006). Without resolution, a clever LLM can rationalize skipping all live reads.

---

## Eval Set Assessment

**Positive cases (8 total)**: Good coverage. Covers Vite, plain HTML, Next.js, designer handoff scenarios. "adopt this React app's layout" is slightly ambiguous — could trigger web-frontend instead. Consider adding "I have a Figma handoff implemented as a prototype" for the designer-handoff signal.

**Negative cases (5 total)**: Correct boundaries. "write a new component from scratch" and "fix a bug" are strong negatives. "update the klara-theme Button component" correctly tests non-triggering against ui-lib-dev. "add a new page to the app router" correctly tests non-trigger.

**Gap**: No negative case for "refactor this production component" — which might superficially resemble conversion but should route to code-review or web-frontend.

---

## Excellent Patterns to Preserve

- **Phase B output contract** — the ✅/🟡/🔴 structure with plain-language-first formatting is excellent for non-developer readability. The "Reply **X** or **Y**" question format is specific and unambiguous.
- **component-mapping.md signal priority** (DOM semantics > interaction > visual) is a well-reasoned heuristic that prevents name-matching errors.
- **token-mapping.md anti-patterns table** (§6) is exactly the right format — wrong→right with "why" column.
- **No-match list** in component-mapping.md is critical and prevents common LLM approximation errors.
- **Missing API stub pattern** in data-migration.md is pragmatic and unblocks UI work.

---

## Fix Priority

| Priority | Finding | Impact |
|----------|---------|--------|
| P0 | F-001 — FetchBuilder import path | Would generate non-compiling code |
| P0 | F-002 — Missing error check | Silent error swallowing in service layer |
| P1 | F-005 — Hook architecture | Bypasses server boundary requirement |
| P1 | F-003 — `_services/` missing `'use server'` | Security/architecture gap |
| P2 | F-008 — `p-4` vs `p-400` contradiction | LLM ambiguity on spacing tokens |
| P2 | F-006 — "first-encounter" vs HIGH tier contradiction | LLM ambiguity on live reads |
| P3 | F-004 — `useAuthToken` unverified | Uncertain correctness |
| P3 | F-007 — Missing cross-reference | Minor discoverability issue |

---

## Unresolved Questions

1. Is `FetchBuilder` exported from `@luz-next/shared/http` or only from `../service/fetch-builder`? This determines whether F-001 is a critical bug or accurate documentation of a secondary export path.
2. Does `useAuthToken()` exist in `@luz-next/shared/auth`? If yes, is it intended for the data layer or only for components?
3. Is the `_services/` directory intended to hold `'use server'` callers in the module pattern, or is it strictly for utility/transform logic? The inconsistency between web-api-routes (`caller/`) and web-modules (`_services/`) needs a canonical answer.
4. Should `data-migration.md` teach client component data fetching (useEffect + hook) at all, or exclusively server component patterns for luz_next?
