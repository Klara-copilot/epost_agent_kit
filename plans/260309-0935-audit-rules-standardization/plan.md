# Plan: Audit Rules Standardization

## Problem

Code review rules are vague prose categories ("Structure: File organization, module boundaries") while UI audit rules are well-structured with numbered IDs, severity, pass/fail in tables. The two systems are inconsistent — code review has no enforceable rule IDs, making findings untraceable and the known-findings `rule_id` field arbitrary.

### Current State

| Domain | Rules File | Format | Rule IDs | Count |
|--------|-----------|--------|----------|-------|
| UI Library | `audit-standards.md` | Tables: ID, Rule, Severity, Pass, Fail | STRUCT-001..006, PROPS-001..008, TOKEN-001..007, BIZ-001..005, A11Y-001..005, TEST-001..004, SEC-001..005, PERF-001..004, LDRY-001..003, EMBED-001..005 | ~52 |
| UI Consumer | `audit-standards.md` | Same tables | INT-1..3, PL-1..7, RU-1..8, TW-1..5, DRY-1..3, RE-1..8, POC-1..7, PP-E1..2 | ~43 |
| Code Review | `code-review/SKILL.md` | Prose bullets | None — categories only (Structure, Logic, State Machines, Types, Performance, Security) | ~0 formal |
| A11Y | External WCAG 2.1 AA | Referenced but not enumerated | WCAG criteria (1.1.1, 4.1.2 etc.) | N/A |

### Issues

1. **No rule IDs for code review** — `rule_id` field in `code-known-findings-schema.md` says "SEC-001, PERF-002, TS-003" but these IDs are invented at audit time, not defined in any standards file
2. **Categories don't match** — known-findings schema uses SEC/PERF/TS/LOGIC/DEAD but the skill file says Structure/Logic/State Machines/Types/Performance/Security
3. **No pass/fail criteria** — code reviewer uses judgment; two runs on same code can produce different findings
4. **Inconsistent ID format** — UI uses `STRUCT-001` (zero-padded), code uses `SEC-001` (assumed, undefined)

## Goal

Create `code-review/references/code-review-standards.md` with the same table format as `audit-standards.md`. All code review categories get numbered rules with ID, severity, pass/fail. The known-findings categories (SEC/PERF/TS/LOGIC/DEAD) become the canonical sections.

## Decisions Required

1. **Keep categories as SEC/PERF/TS/LOGIC/DEAD** or rename to match UI pattern?
   - Recommendation: Keep SEC/PERF/TS/LOGIC/DEAD — they already exist in the known-findings schema and are different concerns from UI rules

2. **Add ARCH (Architecture) category?**
   - Recommendation: Yes — "module boundaries", "cross-module impact" don't fit cleanly into existing 5 categories. ARCH covers structure + architecture.

3. **ID format**: `SEC-001` (zero-padded 3-digit) matching UI format?
   - Recommendation: Yes — consistent with STRUCT-001, TOKEN-003 etc.

## Phases

### Phase 1: Create code-review-standards.md ✅
- [x] Define SEC rules (SEC-001..SEC-008) — OWASP Top 10 surface checks
- [x] Define PERF rules (PERF-001..PERF-006) — N+1, renders, loops, caching, bundle
- [x] Define TS rules (TS-001..TS-006) — unsafe any, unvalidated casts, missing guards, generics
- [x] Define LOGIC rules (LOGIC-001..LOGIC-006) — edge cases, null handling, error paths, race conditions, comparisons
- [x] Define DEAD rules (DEAD-001..DEAD-003) — unreachable code, unused exports, orphaned utils
- [x] Define ARCH rules (ARCH-001..ARCH-005) — file organization, module boundaries, circular deps, layer violations
- [x] Define STATE rules (STATE-001..STATE-004) — state machine completeness, exit states, concurrent mutations
- [x] Add severity scale, mode applicability table, escalation trigger table
- [x] Add lightweight vs escalated scope column per rule

### Phase 2: Update code-review/SKILL.md ✅
- [x] Replace prose "Systematic Review" section with reference to `code-review-standards.md`
- [x] Update "Lightweight vs. Escalated" table to reference rule IDs
- [x] Update severity classification to match shared scale

### Phase 3: Align known-findings schema ✅
- [x] Add ARCH and STATE to category enum in `code-known-findings-schema.md`
- [x] Verify rule_id examples match new standards file

### Phase 4: Cross-reference ✅
- [x] Add Standards Files Reference to `output-contract.md`
- [x] Document: UI audit uses `audit-standards.md`, code review uses `code-review-standards.md`, hybrid uses both

### Phase 5: Sync ✅
- [x] Run `npx epost-kit init --source . --yes`
- [x] Verify .claude/ files match packages/

## Rule Count Estimate

| Category | Rules | Covers |
|----------|-------|--------|
| SEC | ~8 | Injection, XSS, CSRF, secrets, auth, input validation, SSRF, insecure deserialization |
| PERF | ~6 | N+1, re-renders, loops, caching, bundle size, lazy loading |
| TS | ~6 | Unsafe any, unvalidated cast, missing guard, generic constraints, assertion, strict null |
| LOGIC | ~6 | Null handling, edge cases, error paths, race conditions, off-by-one, comparison |
| DEAD | ~3 | Unreachable, unused exports, orphaned utils |
| ARCH | ~5 | File org, module boundaries, circular deps, layer violations, dependency direction |
| STATE | ~4 | Exit states, error/timeout, transition guards, concurrent mutations |
| **Total** | **~38** | |

## Shared vs Domain-Specific

| Rule Set | Used By | Scope |
|----------|---------|-------|
| `audit-standards.md` | epost-muji | UI library + consumer code |
| `code-review-standards.md` (new) | epost-code-reviewer | All code (backend, web logic, services) |
| WCAG 2.1 AA (external) | epost-a11y-specialist | Accessibility |
| Overlap: SEC, PERF | Both muji + code-reviewer | SEC/PERF rules in audit-standards.md are UI-specific (component context); code-review-standards.md SEC/PERF are general (API, backend, services) |

## File Changes

| File | Action |
|------|--------|
| `packages/core/skills/code-review/references/code-review-standards.md` | **NEW** — ~38 rules in table format |
| `packages/core/skills/code-review/SKILL.md` | UPDATE — reference standards file, simplify prose |
| `packages/core/skills/code-review/references/code-known-findings-schema.md` | UPDATE — add ARCH, STATE categories |
| `packages/core/skills/audit/references/output-contract.md` | UPDATE — reference both standards files |
| `packages/core/skills/audit/SKILL.md` | UPDATE — add standards file to Aspect Files |
