---
phase: 1
title: "Add TEST-001 + QUALITY-007 to cross-cutting standards"
effort: 1.5h
depends: []
---

# Phase 1: Test Coverage + Complexity Rules

## Context

- Plan: [plan.md](./plan.md)
- Target file: `packages/core/skills/code-review/references/code-review-standards.md`

## Overview

Add two new rules to the cross-cutting code review standards:
1. **TEST-001** — Changed logic files must have corresponding test file changes
2. **QUALITY-007** — Cognitive complexity cap (nesting depth * branching)

## Requirements

### TEST-001: Test Coverage Check

Add a new `## TEST: Test Coverage` section after the existing QUALITY section.

```markdown
## TEST: Test Coverage

**Activation gate**: Apply when reviewing any PR that modifies logic files (not config, docs, or type-only changes).

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| TEST-001 | Changed logic files have corresponding test changes — new functions need new tests, modified functions need updated tests | high | PR adds `calculateTotal()` in `order.ts` and adds `calculateTotal.test.ts` or updates existing test file | PR adds 3 new service methods with zero test file changes in the diff |
```

**Scope logic for reviewer**: "Logic file" = any `.ts`, `.tsx`, `.java`, `.swift`, `.kt` file that is NOT: a type definition file (`*.d.ts`, `types.ts`), a config file, a translation file, or a pure re-export barrel (`index.ts` with only `export * from`). If ALL changed files are non-logic → skip TEST-001.

### QUALITY-007: Cognitive Complexity

Add to existing `## QUALITY: Code Quality, Reuse & OOP` table:

```markdown
| QUALITY-007 | No function exceeds cognitive complexity ~15 — count +1 per: nesting level, `if/else/switch`, `&&/||` chain, recursion, `catch` | medium | Functions are flat with early returns; complex logic extracted to helpers | 4-level nested `if` inside a `for` inside a `try/catch` with inline `&&` chains |
```

### Mode Applicability Updates

Update the "Mode Applicability (QUALITY)" table:

| Section | Lightweight | Escalated |
|---------|-------------|-----------|
| QUALITY | QUALITY-001, QUALITY-003 | + QUALITY-002, QUALITY-004-007 |

Add new mode applicability table for TEST:

| Section | Lightweight | Escalated |
|---------|-------------|-----------|
| TEST | TEST-001 | — (same rule, deeper analysis in escalated — check edge case coverage) |

### Update SKILL.md Rule Summary

In `code-review/SKILL.md`, add TEST to the cross-cutting rule summary table:

```
| TEST | Test Coverage | TEST-001 | Changed logic must have test changes |
```

And update the Lightweight vs Escalated table:

```
| Tests | Test file exists, covers changed code | + coverage gap analysis, edge case completeness |
```

This row already exists — verify it aligns with TEST-001.

## Files to Change

- `packages/core/skills/code-review/references/code-review-standards.md` — add TEST section + QUALITY-007 row + mode tables
- `packages/core/skills/code-review/SKILL.md` — update rule summary table (add TEST category)

## TODO

- [ ] Add `## TEST: Test Coverage` section with TEST-001 to `code-review-standards.md`
- [ ] Add QUALITY-007 row to existing QUALITY table
- [ ] Update mode applicability tables (QUALITY + new TEST)
- [ ] Update `code-review/SKILL.md` cross-cutting rule summary to include TEST
- [ ] Verify line count stays reasonable (file currently ~104 lines)

## Success Criteria

- TEST-001 has clear pass/fail examples covering the "no tests for new logic" case
- QUALITY-007 describes cognitive complexity in actionable terms (not just a number)
- Mode tables correctly place TEST-001 in lightweight, QUALITY-007 in escalated
- No existing rules modified
