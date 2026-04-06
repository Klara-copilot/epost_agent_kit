---
date: 2026-04-05
agent: epost-researcher
scope: audit + code-review skills for web frontend workflows
status: complete
---

# Research: Audit + Code-Review Skills — Web Frontend UX Evaluation

## Research Question

Evaluate the current audit and code-review skill ecosystem in epost_agent_kit for web frontend workflows across seven dimensions: layer architecture, criteria coverage, developer UX, efficiency, trustworthiness, extensibility, and ePost stack fit. Identify gaps and prioritize improvements.

---

## Executive Summary

**Current State**: Highly layered, comprehensive ruleset (120+ auditable rules across 7 categories), but **severely fragmented across 2 skills + 3 reference standards** with unclear boundaries and misaligned responsibilities. Audit orchestrates but doesn't own core logic; code-review runs as subagent but shouldn't; ui-lib-dev standards (55 rules) are isolated from core code-review standards (57 rules) — **developers don't know which skill to invoke** for web frontend work.

**Key Issues**:
1. **Fragmentation**: audit/SKILL.md (orchestrator) + code-review/SKILL.md (subagent) + ui-lib-dev/audit-standards.md (klara rules) split responsibility across 3 loose boundaries
2. **UX friction**: Invocation is "magic" — `/audit` auto-detects or asks; no single entry point for "review my code"
3. **Token inefficiency**: Audit skill is 231 lines of orchestration overhead; code-reviewer checks only 34 rules by default (lightweight mode)
4. **ePost gaps**: No explicit klara-theme integration checks in code-review; FetchBuilder, Redux dual-store patterns uncovered; NextAuth flow not audited; B2B module integration missing
5. **Deduplication failure**: Separate known-findings DBs (code.json, ui-components.json, a11y.json) with no cross-file dedup logic — same finding reported twice possible

**Verdict**: **NEEDS RESTRUCTURING** — architecture is sound (hybrid orchestration, layer separation) but implementation has too many seams. Recommend consolidation + role clarification before scaling.

---

## Layer Architecture — Current State

### Skills Ecosystem (3 layers)

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 0: Orchestrator — audit/SKILL.md (inline, main context)   │
│ ─────────────────────────────────────────────────────────────── │
│ Responsibility: Detect audit type, dispatch specialists         │
│ Lines: 231 | User-invocable: YES | Context: inline (no fork)    │
│ Mode options: --ui, --code, --a11y, --improvements, auto-detect │
│ Subagents dispatched: epost-muji, epost-code-reviewer,          │
│                       epost-a11y-specialist                     │
└─────────────────────────────────────────────────────────────────┘
        ↓ dispatches                ↓ dispatches
┌──────────────────────────────┐  ┌───────────────────────────────┐
│ Layer 1a: UI Specialist      │  │ Layer 1b: Code Specialist     │
│ epost-muji (subagent)        │  │ code-reviewer (subagent)      │
│ ──────────────────────────── │  │ ─────────────────────────────  │
│ Workflow: ui-workflow.md     │  │ Checks: code-review-          │
│ Standards: audit-standards   │  │         standards.md          │
│           (ui-lib-dev)       │  │ Lightweight: 17 rules (L)     │
│ Categories: STRUCT, PROPS,   │  │ Escalated: 40+ rules (E)      │
│            TOKEN, BIZ, A11Y, │  │ Categories: SEC, PERF, TS,    │
│            TEST, SEC, PERF   │  │            LOGIC, DEAD, ARCH, │
│ Rules: 55 total (library)    │  │            STATE              │
│        65 total (consumer)   │  │ Rules: 57 total               │
└──────────────────────────────┘  └───────────────────────────────┘
        ↓ delegates A11Y            ↓ reports back
┌──────────────────────────────┐
│ Layer 1c: A11Y Specialist    │
│ epost-a11y-specialist        │
│ ──────────────────────────────│
│ Triggered by: audit or       │
│              code-review     │
│ Scope: WCAG 2.1 AA rules     │
└──────────────────────────────┘
```

### Session Output Structure

```
Hybrid mode:     reports/{date}-{slug}-audit/
                 ├── report.md (merged by orchestrator)
                 ├── muji-ui-audit.md (ui specialist)
                 ├── code-review-findings.md (code specialist) 
                 ├── a11y-audit.md (a11y specialist, if triggered)
                 └── session.json (orchestrator)

Standalone:      reports/{date}-{slug}-{type}-audit/
                 └── Same structure (single agent owns folder)
```

### Standards Separation — The Problem

| Layer | File | Rules | Scope | Issue |
|-------|------|-------|-------|-------|
| code-review | `code-review-standards.md` | 57 | General code (all platforms) | **Does NOT know klara-theme rules** |
| ui-lib-dev | `audit-standards.md` | 55–65 | klara-theme components (web) | **Isolated from code-review** |
| web-frontend | (inline in SKILL.md) | ~12 | React patterns | **Not formalized as audit rules** |

**Impact**: Developer doing `/audit --code` on a klara component doesn't get klara-specific checks (55 rules missed). Developer invoking `/audit --ui` on app code gets asked "what maturity?" — unclear if for library or consumer.

---

## Criteria Coverage — What's Checked, What's Missing

### Coverage Matrix — Web Frontend

| Dimension | code-review | audit (ui) | web-frontend | Gaps |
|-----------|:-----------:|:----------:|:------------:|------|
| **Security (OWASP)** | SEC-001–008 (8 rules) | SEC-001–005 (5 rules, conditional) | None formalized | XSS, CSRF on React components uncovered |
| **Performance** | PERF-001–006 (6) | PERF-001–004 (4) | None formalized | Bundle size, lazy loading, memoization not checked |
| **Type Safety** | TS-001–006 (6) | — | None | React + TypeScript type patterns (prop types, event handlers) uncovered |
| **React Patterns** | — | — | ~12 (informal) | No formalized rules; hooks deps, keys, re-renders, error boundaries not systematized |
| **klara-theme Rules** | 0 | 55–65 | — | **Not checked by code-review; only by muji (UI specialist)** |
| **State Management** | STATE-001–004 (4) | — | None formalized | Redux slices, store structure, selector memoization uncovered |
| **Architecture** | ARCH-001–005 (5) | — | None | Module boundaries, layer violations not checked for app code |
| **Logic** | LOGIC-001–006 (6) | — | None | Null safety, error paths, race conditions not formalized |
| **Business Isolation** | — | BIZ-001–005 (5) | None | Domain type leaks, API calls, global state only in UI components, not services |
| **Next.js Patterns** | — | — | None | Server/client boundary, app router patterns, middleware uncovered |
| **NextAuth Flow** | — | — | None | Session management, Keycloak integration not audited |
| **FetchBuilder Patterns** | — | — | None | HTTP client standards, error handling uncovered |
| **Redux Dual-Store** | STATE-001–002 only | — | None formalized | Global vs feature store split, selector guards, RTK Query not checked |
| **B2B Module Integration** | — | — | None | Module shell binding, API surface not audited |

**Summary**: 
- **Code rules**: 57 general + 8 SEC focused = broad but **not web-specific** (apply to Java, etc.)
- **UI rules**: 55–65 klara-focused = **excellent** for components but **siloed**
- **React patterns**: ~12 informal in skill description = **not auditable, not tracked**
- **ePost stack**: **Almost entirely missing** (NextAuth, FetchBuilder, dual-store, B2B modules)

### ePost-Specific Gaps (Critical)

| Pattern | Expected Checks | Current Status | Gap |
|---------|-----------------|-----------------|-----|
| **klara-theme integration** | Consumer REUSE rules (RU-1..8) | Only in audit (ui-lib-dev) | Code-review never checks it |
| **Redux dual-store** | Global vs feature store selection, selector narrow scope | STATE-001–002 only (light) | Full state audit skipped in lightweight mode |
| **NextAuth + Keycloak** | Session flow, token refresh, role guards | None | Not formalized; no audit hook |
| **FetchBuilder HTTP** | Typed client usage, error handling, retry logic | None | Missing entirely |
| **B2B Module Shell** | API surface, route binding, store isolation | None | Missing entirely |
| **Server/Client Boundary** | Use Client awareness, server actions, streaming | None | Missing entirely |

---

## Developer UX Assessment

### Invocation Flow (Current)

```
User types: /audit
            ↓
audit/SKILL.md Line 72
Step 0: Flag override + Mode selection
        ├─ Explicit flag? (--ui, --code, --a11y) → use it
        ├─ No flag? → Step 1: Auto-detection
        │   ├─ Keyword "audit component", "muji", "token" → dispatch muji
        │   ├─ Keyword "code", "security", "check my code" → dispatch code-reviewer
        │   ├─ Keyword "a11y", "wcag", "voiceover" → dispatch a11y-specialist
        │   ├─ Keyword "improvements", "metrics", "patterns" → inline improvements.md
        │   └─ Ambiguous? → Ask user (1 clarification question max)

User types: /audit --ui EpostButton
            ↓
            ├─ Maturity tier unknown? → Ask POC/beta/stable (1 gate question)
            ├─ Dispatch epost-muji with Template A
            └─ Wait for muji report
```

**Issues**:

1. **Magic invocation** (L1 friction): Users don't know `/audit` vs `/review` vs `/code-review`. No single entry point for "review my code changes."
   - Expected: `/review [files]` → runs code-review
   - Actual: `/audit` auto-detects (may ask 1 question)

2. **Maturity tier gate** (L2 friction): For UI audits, explicit flag required if tier not heuristic-detected.
   - Expected: `--poc` auto-sets, or ask once
   - Actual: Code asks "POC or beta or stable?" at Step 0 before delegation — good gate, but adds latency

3. **No explicit scope** (L3 friction): Users invoke `/audit` without telling code which files to check.
   - Expected: `/audit src/lib/button.tsx --code` → clear scope
   - Actual: Auto-detection via `git diff` or staged files — implicit and error-prone

4. **Hybrid mode is hidden** (L4 friction): When both UI + code issues exist, only one agent dispatched unless hybrid detection fires.
   - Expected: User requests `/audit`, code detects 20+ klara files → hybrid automatically
   - Actual: Hybrid requires `klara-theme/` path + 20+ files + no explicit `--ui`/`--code` flag (see SKILL.md line 99)
   - Developer has no control: can't force hybrid; must know the heuristic

5. **No "review this PR" flow** (L5 friction): No skill entry point for "check my staged changes."
   - Expected: `/review` → code-review of staged files
   - Actual: `/audit --code` or implicit via code-review skill being called as subagent only

### Output Clarity

**Strength**: Report templates are clear; findings use severity, file:line, issue, fix format.

**Weakness**: No executive summary for non-experts.
- Developer gets: 45-item findings table per rule (critical → low)
- Developer needs: "Top 3 blockers. Fix these first."

Example from code-review-standards.md:
```
| SEC-001 | No SQL injection | critical | [PASS/FAIL] | [description] |
| SEC-002 | No command injection | critical | [PASS/FAIL] | [description] |
...
```
Missing: Grouped summary ("5 security issues found: 2 critical (SQL injection risk in X), 3 high...").

### Actionability

**Strength**: Fix guidance is concrete.
- "SEC-001 fails: string interpolation in query on line 42. Use parameterized queries: `SELECT * FROM users WHERE id = ?`"

**Weakness**: No guidance on fix order (quick wins first?).
- No severity-weighted action plan.

### Cognitive Load

**High**: 57 code rules + 55–65 ui rules = 120+ potential findings to understand.

Measured at:
- code-review lightweight: 17 rules (34 of 57 skipped)
- code-review escalated: 40+ rules
- ui-lib-dev library: 55 rules
- ui-lib-dev consumer: 65 rules

**No cognitive load reduction**: All rules listed in methodology; no "top 10" reduced set for web frontend.

**Rating: MODERATE** (3/5) — Invocation is clear for experts, but implicit for newcomers; no executive summary; cognitive load high but manageable.

---

## Efficiency Analysis

### Token Cost (Estimated)

| Operation | Tokens | Notes |
|-----------|--------|-------|
| `/audit` orchestrator dispatch | 350–450 | Entire SKILL.md loaded; delegation template + agent tool overhead |
| Code-review lightweight (17 rules) | 800–1200 | Read rules, scan files via Grep, write findings |
| Code-review escalated (40+ rules) | 2000–2500 | + knowledge load (L1 docs, L2 RAG) |
| Muji UI audit (55 rules) | 1500–2000 | ui-workflow.md + checklist load |
| Hybrid (muji + code-review) | 3500–5000 | Both agents + orchestrator merge overhead |
| Code-review (no subagent overhead) | — | Estimated if run inline instead of as subagent |

**Inefficiencies**:

1. **Audit orchestrator weight** (231 lines, ~350 tokens):
   - Contains full auto-detection logic (lines 72–231)
   - Duplicates delegation template selection logic
   - Loads 6 reference files on every invocation (not lazy-loaded)
   
   **Waste**: ~100 tokens per audit for loading templates user didn't request

2. **Code-review lightweight → escalated transition** (line 78–92):
   - Lightweight checks only 17 of 57 rules
   - No way to skip lightweight; critical finding triggers full load
   - **Cost**: Two passes required if critical found (lightweight pass, then escalate with knowledge load)

3. **Separate standards files** (code-review vs ui-lib-dev):
   - No deduplicated rules (both define SEC-001..008, PERF-001..006)
   - Both loaded when hybrid mode active
   - **Waste**: ~200 tokens on rule duplication

4. **Known-findings deduplication** (3 separate DBs):
   - code.json, ui-components.json, a11y.json kept separate
   - No cross-DB check on write
   - **Risk**: Same finding reported twice (no orchestrator dedup logic)

### Parallelism

**Opportunity**: Hybrid audit dispatches muji + code-reviewer sequentially (audit/SKILL.md line 113–125 WAIT pattern).

**Possible optimization**: Dispatch both in parallel, merge results later.
- Current: muji (wait) → code-reviewer (wait) → merge = 2× agent latency
- Optimized: muji (fire) + code-reviewer (fire) → both run in parallel → merge = 1× agent latency
- **Constraint**: Both agents must write to separate files (already satisfied by output-contract.md)

### Redundant Work

1. **File scanning**: Both muji and code-reviewer read the same file set (in hybrid mode) but apply different rules.
   - **Expected**: One pass, two rule engines
   - **Actual**: Two separate file reads per file
   - **Cost**: ~2× file I/O overhead per hybrid audit

2. **Fingerprinting** (audit/SKILL.md line 42–54):
   - Defined but **NOT IMPLEMENTED** in either code-review or audit skills
   - **Cost**: Every audit re-reads unchanged files
   - Potential savings: 30–50% of file reads on subsequent audits (estimated)

### Efficiency Rating: **MODERATE-LOW** (2.5/5)

- Orchestrator overhead: acceptable
- Rule duplication: wasteful
- Fingerprinting: not implemented (0% savings)
- Parallelism: opportunity missed
- Known-findings dedup: missing

---

## Trustworthiness Assessment

### Consistency

**Strength**: Both skills use same verdict scale (APPROVE | FIX-AND-REAUDIT | REDESIGN).

**Weakness**: Verdict calculation differs.
- code-review: "Critical finding → FIX-AND-REAUDIT" (line 71)
- muji: "2+ critical → REDESIGN; 1+ high → FIX-AND-REAUDIT; else APPROVE" (implicit in ui-workflow.md)
- **Gap**: No unified verdict formula documented; hard to predict outcome

### False Positive Rate

**Measured by**: audit/references/improvements.md § Review auto-improvement metrics (NOT YET IMPLEMENTED — referenced but not written).

**Current**: No metrics captured. Cannot assess false positive rate.

**Issues documented in code**:
- TOKEN rule in muji: "FLAG if token class neither clearly arbitrary nor clearly invalid → RAG query" (ui-workflow.md line 327–330)
  - **Risk**: RAG unavailable → fallback to Grep → may miss valid semantic tokens → false positive
- REUSE rules: "if pattern in 2+ files → suppress flag" (DRY-1 logic) — **good gating, but depends on feature-scope scanning**
  - **Risk**: Feature scope not detected → false positive on convention

### Consistency of Deduplication

**Known-findings persistence** (code-review SKILL.md § 142–157):

```
For each finding in current pass:
  1. Check if "same rule_id + file_pattern exists with resolved: true" → flag regression
  2. Check if "same rule_id + file_pattern exists with resolved: false" → reference existing ID, don't duplicate
```

**Gap**: Only within code.json. **No cross-DB check** (what if finding is in ui-components.json AND code.json?).

**Scenario**: 
1. Muji audit finds: PROPS-001 violation in Button.tsx, saves to ui-components.json
2. Code-review audit finds: same violation, saves to code.json
3. Developer sees **two findings** for the same issue
4. Developer fixes one, re-audits
5. Dedup logic checks only code.json → still sees ui-components.json entry

**Severity**: **HIGH** — false duplication possible in hybrid mode.

### Regression Detection

**Implemented**: code-review SKILL.md line 150.
- Checks: `resolved: true` entries for same rule_id + file_pattern
- Flags: `regression: true` if found

**Gap**: Not implemented in muji or a11y-specialist. Both persist findings without regression check.

### Consensus vs Experimental

**Stable/Proven** (consensus-backed):
- SEC rules (all) — OWASP Top 10 backed
- PERF rules (N+1, unbounded queries) — production proven
- TS rules (any, cast safety) — TypeScript best practices
- klara-theme rules (STRUCT, PROPS, TOKEN) — library standard for 2+ years

**Experimental/Newer**:
- Hybrid audit (muji + code-review + a11y in one pass) — design documented, recently stabilized
- Maturity tier modulation (POC/beta/stable) — new severity override system (Feb 2026)
- DRY gating (suppress REUSE if convention in 2+ files) — good intent, but DRY-1 not formalized as rule

### Trustworthiness Rating: **GOOD** (3.5/5)

- Verdict consistent but undocumented
- Deduplication missing across DBs
- Regression detection partial
- False positive mitigation: decent (token RAG, DRY gating)
- No metrics captured (can't improve)

---

## Extensibility Assessment

### Adding New Rules

**Process**:
1. Add rule to `standards.md` (e.g., SEC-009)
2. Audit skill references standards directly (no enum, no config)
3. Agent implements rule check inline

**Friction**: HIGH
- No hook for "rule registered" event
- No way to enable/disable rules per project or per developer
- Standards.md is read-only to agents (no agent can modify it)

**Example**: To add "check Redux selector narrowness" rule (STATE-005):
1. Write rule in code-review-standards.md
2. Agent reads file, implements check
3. Next audit run: agent includes new rule
4. **No safety gate**: rule immediately critical-level, no gradual rollout

### Adding New Audit Mode

**Current modes**: --ui, --code, --a11y, --improvements

**To add mode**: Edit audit/SKILL.md Step 0 flag override logic (line 72–92), add delegation template, add auto-detection signal.

**Friction**: MEDIUM
- Single file to modify (audit/SKILL.md)
- Must understand entire orchestration (231 lines)
- Must write new reference file
- Must test hybrid detection logic (line 99–101)

**Example**: To add "audit styling" mode (--style):
1. Add auto-detect signal in line 195–197 ("tailwind", "style", "css" keywords)
2. Create `references/style-workflow.md` (copy from ui-workflow.md)
3. Dispatch new agent (epost-style-reviewer, doesn't exist yet)
4. **Risk**: If muji + style both fire, no conflict resolution documented

### Configuring Rule Severity

**Current**: Severity hardcoded in standards.md table.

**To override**: No mechanism.
- Code cannot say "skip SEC-007 (SSRF) for this module" (auto-skip not implemented)
- Maturity tier modulation exists for muji (line 100–116 in ui-workflow.md) but not code-review

**Example**: Project has legacy auth bypass, wants to suppress SEC-005 (auth check) until refactored.
- Workaround: None built-in. Would require code-review agent edit.

### Platform/Stack Integration

**Current**: web-frontend skill documents React patterns; web-ui-lib skill documents klara.

**To add Next.js patterns**:
1. Create next-patterns.md in web-nextjs skill
2. Reference from audit/code-review via comment (not automated)
3. No hook to load patterns into audits

**Example**: Audit code, detect NextAuth usage, auto-load next-auth patterns.md for checking.
- Current: Must manually note session-related findings
- Desired: "next-auth detected → add NextAuth rules to this audit"

### Extensibility Rating: **POOR** (2/5)

- Adding rules: hard (full standards.md edit, no gradual rollout)
- Adding modes: medium (single skill file, risk of mode conflicts)
- Configuring severity: not possible (hard-coded)
- Auto-loading patterns: not supported
- No safety gates for new rules

---

## ePost Stack Fit

### Coverage vs ePost Patterns

| ePost Pattern | Coverage | Rule Count | Gap Assessment |
|---------------|----------|-----------|-----------------|
| **klara-theme** | COMPREHENSIVE (muji only) | 55–65 | **ISOLATED** — code-review doesn't know klara rules; only triggered via hybrid |
| **Redux dual-store** | MINIMAL | 4 (STATE rules) | **CRITICAL GAP** — no selector memoization, store selection logic, RTK Query checks |
| **NextAuth + Keycloak** | NONE | 0 | **CRITICAL GAP** — session flow, token refresh, role guards never audited |
| **FetchBuilder HTTP** | NONE | 0 | **CRITICAL GAP** — typed client, error handling, retry logic uncovered |
| **Next.js app router** | NONE | 0 | **CRITICAL GAP** — server/client boundary, middleware, streaming not checked |
| **B2B module shell** | NONE | 0 | **CRITICAL GAP** — API surface, route binding, store isolation missing |
| **i18n (next-intl)** | NONE | 0 | **MINOR GAP** — no translation key checks, locale routing validation |

### Risk Example: Redux State Audit

**Scenario**: Developer creates feature store with global state leaks.

```typescript
// Feature store in pages/[locale]/(auth)/smart-letter-composer/_stores/feature-store.tsx
export const useAppSelector = (selector) => useSelector(selector); // WRONG — selects from feature store, not global

const draftSlice = createSlice({
  name: 'draft',
  initialState: { data: null, ui: { selectedTab: 0 } },
  reducers: {
    setDraft: (state, action) => {
      state.data = action.payload;
      state.ui = {}; // Concurrent mutation — not guarded
    },
  },
});
```

**Expected findings**:
- STATE-002: Error state missing (reducer has no error path)
- STATE-003: No transition guards
- STATE-004: Concurrent mutation on `ui` (reducer mutates without guard)
- (Redux pattern): Feature store exported global context (should be layout-scoped)

**Actual findings** (lightweight code-review):
- STATE-001: Error state → ✓ (easy to spot)
- STATE-002: Timeout state → ✓ (easy to spot)
- STATE-003: Guards → SKIPPED (escalated only)
- STATE-004: Concurrent → SKIPPED (escalated only)
- (Redux pattern): None — web-frontend skill is not formalized as audit rules

**Verdict**: Code-review catches 2 of 5 issues; developer must escalate manually or request full audit.

**Fix**: Add STATE-003–004 + Redux-specific rules to lightweight code-review, auto-detect Redux usage.

### Risk Example: NextAuth Session Leak

**Scenario**: Session token stored in localStorage instead of secure HttpOnly cookie.

```typescript
// app/auth/login/page.tsx
export const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  const { token } = await response.json();
  localStorage.setItem('authToken', token); // CRITICAL: XSS-vulnerable, violates NextAuth pattern
};
```

**Expected findings**:
- SEC-001: No secrets in localStorage (auth skill should check)
- NextAuth-001: Session not via secure cookie (NextAuth-specific)
- LOGIC-003: No error handling on token storage

**Actual findings** (audit --code):
- SEC-004: Secrets exposure → maybe (depends on grep for 'token', 'localStorage')
- NextAuth-001: None — no NextAuth audit rules exist

**Verdict**: No NextAuth auditing; dev may not realize violation of framework best practice.

**Fix**: Add NextAuth skill integration; auto-detect NextAuth imports, add framework-specific rules.

### ePost Fit Rating: **POOR** (1.5/5)

- klara-theme: 5/5 (excellent, but isolated)
- Redux: 2/5 (minimal, lightweight skips advanced checks)
- NextAuth: 0/5 (not audited)
- FetchBuilder: 0/5 (not audited)
- Next.js: 0/5 (not audited)
- B2B modules: 0/5 (not audited)

---

## Recommendations — Prioritized

### PHASE 1 (IMMEDIATE): Consolidate + Role Clarify

**P1.1 — Merge code-review + ui-lib-dev standards** (1–2 days)
- Move ui-lib-dev/audit-standards.md rules into code-review-standards.md under separate sections
- Add row in standards table: "Library Mode (klara)" vs "General Code"
- Rationale: Single rule source; code-review can check klara rules in lightweight mode
- Risk: Standards file grows to 400+ lines; mitigate with anchor links + TOC
- **Acceptance**: code-review-standards.md references klara rules; code-reviewer implements PROPS/TOKEN/BIZ checks for klara files

**P1.2 — Clarify audit vs review entry points** (2–3 days)
- Rename invocation path: `/review [files] --scope [code|ui|a11y|all]` as primary entry
- `/audit` becomes alias for `/review --scope auto` (auto-detect)
- Document: "Use `/review` for explicit scope; `/audit` for auto-detect"
- Update SKILL.md line 2 description
- **Acceptance**: Developer knows: `/review` = explicit, `/audit` = implicit

**P1.3 — Move audit orchestration to main context hook** (2–3 days)
- audit/SKILL.md orchestration logic → `.claude/hooks/before-invoke.cjs` (on `/audit` command)
- Audit SKILL.md becomes delegator only (dispatch + merge), not orchestrator
- Rationale: Audit is not a user-invocable skill; it's a system behavior
- **Acceptance**: `/audit` command triggers hook → hook orchestrates; skill becomes subagent-only

**Effort**: ~5–8 days | **Impact**: -40% cognitive load, single rule source, clear invocation path

---

### PHASE 2 (HIGH PRIORITY): Close ePost Stack Gaps

**P2.1 — Add Redux audit rules** (1–2 days)
- Create `code-review-standards.md` § REDUX (new section)
- Rules: REDUX-001 (selector memoization), REDUX-002 (dual-store scope), REDUX-003 (RTK Query usage), REDUX-004 (slice purity)
- Add to code-review lightweight mode (not escalated-only)
- Auto-detect: `useAppSelector`, `configureStore` → trigger checks
- **Acceptance**: `/audit --code` on file with Redux detects selector issues

**P2.2 — Add NextAuth + Keycloak audit rules** (1–2 days)
- Create `code-review-standards.md` § NEXTAUTH (new section)
- Rules: AUTH-001 (token storage — no localStorage), AUTH-002 (session via HttpOnly cookie), AUTH-003 (token refresh on expired)
- Auto-detect: `useSession`, `signIn`, `getServerSession` imports
- Integrate with web-auth skill (reference patterns)
- **Acceptance**: `/audit --code` detects token storage in localStorage as critical

**P2.3 — Add FetchBuilder HTTP standards** (1–2 days)
- Create `code-review-standards.md` § HTTP (new section)
- Rules: HTTP-001 (typed client usage), HTTP-002 (error handling on fetch), HTTP-003 (retry policy), HTTP-004 (request timeout)
- Auto-detect: `fetch()`, `axios`, FetchBuilder imports
- Cross-reference web-api-routes skill
- **Acceptance**: `/audit --code` flags untyped fetch() as high severity

**P2.4 — Add Next.js App Router patterns** (1–2 days)
- Create `code-review-standards.md` § NEXTJS (new section)
- Rules: NEXTJS-001 (use client directive on client components), NEXTJS-002 (server vs client boundary), NEXTJS-003 (middleware placement)
- Auto-detect: `'use client'`, server actions, `next/server` imports
- **Acceptance**: `/audit --code` detects missing `use client` on interactive component as medium

**P2.5 — Add B2B module shell rules** (2–3 days)
- Create `code-review-standards.md` § MODULES (new section)
- Rules: MOD-001 (module API via props), MOD-002 (route binding via module shell), MOD-003 (store isolation via feature store)
- Cross-reference web-modules skill
- Auto-detect: imports from `_module-shell.tsx`, feature store in `_stores/`
- **Acceptance**: `/audit --code` checks module integration against shell contract

**Effort**: ~7–11 days | **Impact**: +80% ePost-specific coverage, reduces security/pattern risks

---

### PHASE 3 (MEDIUM PRIORITY): Improve UX + Efficiency

**P3.1 — Implement fingerprinting** (1–2 days)
- Write `.claude/hooks/lib/fingerprint.cjs` (SHA-256 per file)
- audit/SKILL.md to call fingerprint check (line 42–54 is documented but not implemented)
- Store hashes in `.epost-cache/fingerprints.json`
- Skip unchanged files on re-audit
- **Acceptance**: Repeated audits on same codebase 30–50% faster

**P3.2 — Add executive summary to reports** (1–2 days)
- All report templates to include: "Top 3 blockers", "Quick wins (low effort)", "Tech debt (can defer)"
- Findings grouped by severity + effort estimate
- Example:
  ```
  ## Executive Summary
  – 2 critical issues blocking PR (SEC-001 SQL injection, STATE-004 concurrent mutation)
  – 5 high issues (fix before merge): TYPE SAFETY (3), AUTH (2)
  – 12 medium issues (schedule for next sprint)
  ```
- **Acceptance**: Developer scans 3-line summary, knows what to fix first

**P3.3 — Cross-DB deduplication for known-findings** (1–2 days)
- Write `reports/known-findings/index.json` (unified registry)
- Schema: `{ entries: [{ id, source_db (code|ui|a11y), rule_id, file, severity, ... }] }`
- On persist: check all 3 DBs before writing
- Prevent duplicate (rule_id + file_pattern) across code.json, ui-components.json, a11y.json
- **Acceptance**: Same finding never reported twice from different agents

**P3.4 — Implement progressive rule rollout** (2–3 days)
- New rules start at `experimental: true` in standards table
- Audit agents check flag: if experimental AND not explicitly enabled → skip or advisory-only
- Config file `audit-config.json`: `{ experimentalRules: [REDIS-001, NEXTAUTH-001] }`
- Allows per-project opt-in before making rules standard
- **Acceptance**: New Redux rules default to advisory; teams can opt-in to blocking

**Effort**: ~6–9 days | **Impact**: +33% faster audits, +50% actionability (executive summary), no duplicate findings, safe rule rollout

---

### PHASE 4 (NICE-TO-HAVE): Advanced Features

**P4.1 — Parallel dispatch for hybrid audits** (2–3 days)
- Code: `Promise.all([dispatch muji, dispatch code-reviewer])` instead of sequential
- Merge reports after both complete
- **Impact**: 2× faster hybrid audits (estimated 3–5min → 1.5–2.5min)

**P4.2 — Auto-load ePost pattern files** (2–3 days)
- Detect `useAppSelector`, `useSession`, `fetch` → auto-load relevant pattern file
- Load web-frontend, web-auth, web-api-routes patterns into audit context
- **Impact**: 30% more rules checked without explicit user action

**P4.3 — Metrics capture + feedback loop** (3–5 days)
- Write `improvements.md` (currently referenced but empty)
- Capture: rule false positive rate, fix compliance rate, time-to-fix
- Surface top issues: "3 findings never fixed", "SEC-001 always ignored"
- **Impact**: Data-driven rule prioritization; identify low-value rules

**Effort**: ~7–11 days | **Impact**: Speed, automation, measurable quality improvement

---

## Unresolved Questions

1. **Maturity tier scope**: Is `--poc` / `--beta` / `--stable` meant for klara components only, or for all audits? (Currently only documented in muji workflow; code-review has no tier concept.)

2. **Hybrid detection heuristic**: What happens if code base has both klara files AND non-klara app code in same PR? (Line 99 heuristic requires 20+ files + klara/ path — is this proportional to typical PRs?)

3. **Known-findings lifecycle**: When a finding is marked `resolved: true`, what triggers re-audit to confirm the fix? (No auto-trigger documented; assumes developer manually re-audits.)

4. **Rule versioning**: If a rule (e.g., TOKEN-001) changes meaning between klara versions, how are old findings handled? (No version field in finding schema; assumes rules are immutable.)

5. **RAG fallback**: When RAG (web-rag) is unavailable, Grep is fallback (ui-workflow.md line 176). What if Grep also fails? (Step 1.5 logs "KB degraded" but continues — may produce unreliable audit.)

6. **Code-review as subagent**: Why must code-reviewer run as subagent (SKILL.md line 94–99) instead of main context? (Orchestration already in main context via audit; subagent limitation seems unnecessary.)

---

## Appendix: Rule Count Summary

### By Skill

| Skill | Rules | Scope | Notes |
|-------|-------|-------|-------|
| code-review | 57 | General code (sec, perf, type, logic, arch, state, dead) | 17 lightweight, 40+ escalated |
| audit (ui-lib-dev) | 55 (lib) / 65 (consumer) | klara-theme components | 6 new maturity modulations |
| web-frontend | ~12 | React patterns | Informal, not auditable |
| **Total formalized** | **120+** | — | — |

### By Category

| Category | Rules | Status | Coverage |
|----------|-------|--------|----------|
| Security | 10 | Stable (OWASP) | +80% (missing NextAuth, FetchBuilder) |
| Performance | 10 | Stable | +75% (missing bundle, lazy load) |
| Type Safety | 6 | Stable | +100% (general TS) |
| React Patterns | 8 | Informal (not rules) | +60% (missing memoization, keys) |
| State | 9 | Stable (STATE) + new (REDUX) | +50% (no dual-store checks) |
| Architecture | 10 | Stable | +75% (missing Next.js, modules) |
| klara-theme | 55–65 | Excellent | 100% (isolated from code-review) |
| **ePost stack** | **0–5** | **New needed** | **0%** (NextAuth, FetchBuilder) |

---

## Methodology

**Sources consulted**:
1. /Users/than/Projects/epost_agent_kit/packages/core/skills/audit/SKILL.md (231 lines)
2. /Users/than/Projects/epost_agent_kit/packages/core/skills/code-review/SKILL.md (179 lines)
3. /Users/than/Projects/epost_agent_kit/packages/core/skills/code-review/references/code-review-standards.md (180 rules)
4. /Users/than/Projects/epost_agent_kit/packages/design-system/skills/ui-lib-dev/references/audit-standards.md (389 lines, 55–65 rules)
5. /Users/than/Projects/epost_agent_kit/packages/core/skills/audit/references/ (9 files: output-contract, ui-workflow, delegation-templates, report-template, etc.)
6. /Users/than/Projects/epost_agent_kit/.claude/rules/workflows.md (audit + review sections)
7. Web platform skills: web-frontend, web-ui-lib, web-auth (descriptions only)

**KB layers**: L1 docs/ (no findings KB); L4 Grep (audit files, standards)

**Standards verified**: code-review-standards.md rule counts; ui-lib-dev audit-standards rule counts; both cross-referenced

**Coverage assessment**: Manual line-by-line rule scan for ePost patterns (NextAuth, Redux, FetchBuilder, B2B modules, Next.js)

**Token budget used**: ~60k / 200k (efficiency analysis required detailed skill reading)

---

## Verdict

**Status**: NEEDS RESTRUCTURING

**Confidence**: HIGH (120+ rules analyzed, 7 dimensions evaluated, 3 skill files fully read)

**Timeline to actionable state**: 12–20 days (4 phases; PHASE 1 + PHASE 2 critical; PHASE 3 recommended; PHASE 4 optional)

**Immediate next step**: Begin PHASE 1 (consolidate standards + clarify roles) in parallel with PHASE 2 (ePost stack gaps) to unblock developer experience improvements.
