---
title: "Code Review Quality Gaps: Test Coverage, Complexity, Bundle Size, Regression Trends"
status: active
created: 2026-04-06
updated: 2026-04-06
effort: 4h
phases: 3
platforms: [all]
breaking: false
blocks: []
blockedBy: ["PLAN-0100"]
---

# Plan: Code Review Quality Gaps

## Scope Rationale

1. **Problem**: Reviews can APPROVE code with zero tests, deeply nested functions, large synchronous imports, and repeated findings across PRs. 4 evaluation gaps.
2. **Why this way**: Rule/step additions to existing skill files. No new scripts, no new tooling. Fits the existing rule-table system.
3. **Why now**: Review pipeline is mature (Phase 1 cross-cutting + Phase 2 ePost rules done). These gaps are the remaining quality blind spots.
4. **Simplest version**: Add rules to existing files + add a regression-check step to SKILL.md.
5. **Cut 50%**: Drop bundle size (gap #3) entirely — requires external tooling. Drop complexity if QUALITY-002 (30-line limit) is sufficient.

## Design Decisions

### D1: Gap #1 (Test Coverage) — New rule TEST-001 in cross-cutting standards

Add a `TEST` category to `code-review-standards.md`. One rule: "Changed logic files must have corresponding test changes." Cross-cutting — applies to all platforms. Added to lightweight scope (always checked).

### D2: Gap #2 (Complexity) — New rule QUALITY-007 in cross-cutting standards

QUALITY-002 limits function length (30 lines) but not nesting depth. Add QUALITY-007: "No function exceeds cognitive complexity 15 (nesting depth * conditions)." Escalated scope only (not lightweight) — avoids noise on small reviews.

### D3: Gap #3 (Bundle Size) — DEFERRED

PERF-006 (lazy load) already exists. Actual bundle size delta requires `webpack-bundle-analyzer` or `next/bundle-analyzer` — that's tooling, not a rule. **Defer** until: (a) a real PR slips through with >50KB added to initial bundle, or (b) CI pipeline supports bundle size reporting. Note: strengthen PERF-005 pass/fail examples instead.

### D4: Gap #4 (Regression Trends) — New step in SKILL.md review process

Add "Regression Scan" step between scope resolution and systematic review. Reads `reports/known-findings/code.json`, groups open findings by `rule_id`, counts occurrences. If any rule has fired 3+ times across reports, surface in the review report under a new "Regression Trends" section. No new file — just a step + report section.

### D5: File ownership

- Phase 1: `packages/core/skills/code-review/references/code-review-standards.md` (TEST + QUALITY-007)
- Phase 2: `packages/core/skills/code-review/SKILL.md` (regression scan step + report section)
- Phase 3: `packages/platform-web/skills/web-frontend/references/code-review-rules.md` (PERF-005 examples)

No overlap — phases can run in parallel (P1 + P3), then P2 depends on both.

## Phases

| # | Phase | Effort | Depends | Status | File |
|---|-------|--------|---------|--------|------|
| 1 | Add TEST-001 + QUALITY-007 to cross-cutting standards | 1.5h | -- | pending | [phase-01](./phase-01-test-and-complexity-rules.md) |
| 2 | Add regression scan step to code-review SKILL.md | 1.5h | P1 | pending | [phase-02](./phase-02-regression-scan-step.md) |
| 3 | Strengthen PERF-005 examples (bundle size awareness) | 1h | -- | pending | [phase-03](./phase-03-perf-005-examples.md) |

**Parallelism**: P1 + P3 parallel (different files). P2 after P1 (updates SKILL.md mode table referencing new TEST category).

## Success Criteria

- [ ] TEST-001 rule in `code-review-standards.md` with pass/fail examples
- [ ] QUALITY-007 cognitive complexity rule in `code-review-standards.md`
- [ ] Mode applicability table updated — TEST in lightweight, QUALITY-007 in escalated
- [ ] Regression scan step documented in `code-review/SKILL.md` review process
- [ ] Report template includes "Regression Trends" section (when findings exist)
- [ ] PERF-005 updated with concrete bundle-impact examples
- [ ] Gap #3 deferral documented with threshold condition

## Constraints

- All edits in `packages/` — never `.claude/` directly
- No new dependencies, no new scripts
- Backward-compatible: existing rules unchanged
- Rule format matches existing tables (Rule ID, Rule, Severity, Pass, Fail)
- DB schema for `reports/known-findings/code.json` unchanged — read-only for regression scan
