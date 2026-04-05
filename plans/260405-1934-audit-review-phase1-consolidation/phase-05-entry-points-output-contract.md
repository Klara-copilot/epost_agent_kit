---
phase: 5
title: "Entry points + output contract"
effort: 2h
depends: []
---

# Phase 5: Entry Points + Output Contract

## Context

- Plan: [plan.md](./plan.md)
- Depends on: none (parallel with P3, P4; independent of P1/P2 file ownership)
- Blocks: none

## Overview

Clarify the routing distinction between `/audit` and `/review`. Update audit/SKILL.md to pass platform context when dispatching code-reviewer. Unify verdict formula. Add cross-DB dedup to output contract.

## Files Owned (Phase 5 ONLY)

- `packages/core/skills/audit/SKILL.md` — add platform detection for `--code` dispatch, decision table
- `packages/core/skills/audit/references/output-contract.md` — add cross-DB dedup, platform context passing
- `packages/core/skills/audit/references/report-template.md` — add unified verdict formula
- `packages/core/skills/code-review/references/report-template.md` — replace with reference pointer
- `packages/core/skills/code-review/references/report-standard.md` — update verdict to reference unified formula

## Tasks

### Entry Point Clarification

- [x] Add decision table to audit/SKILL.md (after first heading):
  ```
  | Need | Command | What happens |
  |------|---------|-------------|
  | Quick code quality check | `/review [files]` | Lightweight code-review, no specialist dispatch |
  | Full component audit | `/audit --ui ComponentName` | Dispatches muji + optional code + a11y |
  | Auto-detect audit type | `/audit` | Reads git diff, dispatches appropriate specialists |
  ```
- [x] Update audit/SKILL.md `--code` dispatch to include platform detection:
  ```
  When dispatching epost-code-reviewer for --code:
  1. Detect platforms from files in scope (same extension mapping as code-review)
  2. Pass in dispatch prompt: "Platform: {detected}. Platform rules: {path}."
  ```
- [x] Update audit/SKILL.md Hybrid Orchestration step 5 to pass platform context to code-reviewer
- [x] Rewrite audit/SKILL.md triggers — remove `review` (belongs to code-review)
- [x] Rewrite code-review/SKILL.md triggers in Phase 2 already handles this — just verify no overlap here

### Output Contract

- [x] Add unified verdict formula to `audit/references/report-template.md`:
  ```
  ## Verdict Formula
  - Any critical finding → FIX-AND-RESUBMIT (minimum)
  - 2+ critical findings → REDESIGN
  - 1+ high, 0 critical → FIX-AND-RESUBMIT
  - Medium/low only → APPROVE
  ```
- [x] Replace `code-review/references/report-template.md` body with reference pointer to audit's template
- [x] Update `code-review/references/report-standard.md` verdict section to reference unified formula
- [x] Add cross-DB dedup protocol to `audit/references/output-contract.md`:
  ```
  ## Cross-DB Deduplication
  Before persisting ANY finding:
  1. Check .epost-data/code/ for same rule_id + file_pattern
  2. Check .epost-data/ui/ for same rule_id + file_pattern
  3. Check .epost-data/a11y/ for same rule_id + file_pattern
  4. Match with resolved: false → reference existing ID, skip duplicate
  5. Match with resolved: true → flag as regression
  6. No match → create new finding
  ```
- [x] Add platform context passing protocol to output-contract.md:
  ```
  ## Platform Context (Code Review Dispatch)
  Audit and main context MUST pass platform info when dispatching code-reviewer:
  - Detect from file extensions in scope
  - Include in Agent tool prompt: Platform + rules file path
  ```

## Validation

```bash
# Decision table in audit
grep "Quick code quality check" packages/core/skills/audit/SKILL.md
# Expected: found

# Verdict formula in report template
grep "Verdict Formula" packages/core/skills/audit/references/report-template.md
# Expected: found

# Cross-DB dedup in output contract
grep "Cross-DB Deduplication" packages/core/skills/audit/references/output-contract.md
# Expected: found

# code-review report-template is now a pointer
wc -l packages/core/skills/code-review/references/report-template.md
# Expected: < 10 lines

# No trigger overlap
grep "triggers:" -A10 packages/core/skills/audit/SKILL.md | grep "review"
# Expected: not found (review removed from audit triggers)
```

## Success Criteria

- [x] Decision table in audit/SKILL.md with 3+ rows
- [x] Platform detection added to `--code` dispatch flow
- [x] Unified verdict formula in report template
- [x] Cross-DB dedup in output contract
- [x] code-review report-template is reference pointer (< 10 lines)
- [x] No trigger keyword overlap between audit and code-review
