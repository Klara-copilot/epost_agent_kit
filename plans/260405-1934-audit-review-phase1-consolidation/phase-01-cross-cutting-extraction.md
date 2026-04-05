---
phase: 1
title: "Cross-cutting rules extraction"
effort: 1.5h
depends: []
---

# Phase 1: Cross-Cutting Rules Extraction

## Context

- Plan: [plan.md](./plan.md)
- Depends on: none
- Blocks: Phase 2, 3, 4 (they need the boundary defined here)

## Overview

Strip platform-specific rules (PERF, TS, STATE) out of `code-review-standards.md`. Keep only cross-cutting rules that apply to ALL platforms: SEC, ARCH, LOGIC, DEAD. The extracted rules will be placed in platform-specific files by Phases 3 and 4.

## Requirements

- code-review-standards.md shrinks from 180 lines to ~90 lines
- Only SEC (8 rules), ARCH (5 rules), LOGIC (6 rules), DEAD (3 rules) remain = 22 rules
- PERF (6 rules), TS (6 rules), STATE (4 rules) = 16 rules REMOVED from this file
- Keep: frontmatter, severity scale, anti-patterns section (filter to cross-cutting only)
- Keep: Mode Applicability table and Lightweight vs Escalated Reference (update to reflect only remaining categories)
- Update the "Scope" paragraph to say "Cross-cutting rules for all platforms"

## Files Owned (Phase 1 ONLY)

- `packages/core/skills/code-review/references/code-review-standards.md` — strip to cross-cutting only

## Tasks

- [x] Read current `code-review-standards.md` — confirm 7 sections (SEC, PERF, TS, LOGIC, DEAD, ARCH, STATE)
- [x] Remove `## PERF: Performance` section entirely (6 rules)
- [x] Remove `## TS: Type Safety` section entirely (6 rules)
- [x] Remove `## STATE: State Management` section entirely (4 rules)
- [x] Update opening scope paragraph: "Cross-cutting code review rules applicable to all platforms and languages"
- [x] Remove PERF/TS/STATE references from the category table in code-review/SKILL.md (wait — that's Phase 2's file. Just note the dependency.)
- [x] Update Mode Applicability table: remove PERF, TS, STATE rows
- [x] Update Lightweight vs Escalated Reference table: remove PERF, TS, STATE rows
- [x] Update Anti-Patterns section: remove entries specific to PERF/TS/STATE (N+1, unbounded findAll, unsafe any, reducer side effect, stuck state machine)
- [x] Add note at top: "Platform-specific rules (PERF, TS, STATE) live in platform skill references. See code-review/SKILL.md § Platform Rules for loading protocol."
- [x] Verify <= 100 lines

## Validation

```bash
wc -l packages/core/skills/code-review/references/code-review-standards.md
# Expected: <= 100 lines

grep -c "^| " packages/core/skills/code-review/references/code-review-standards.md
# Expected: ~22 rule rows (SEC-001..008 + ARCH-001..005 + LOGIC-001..006 + DEAD-001..003)

# Verify PERF/TS/STATE removed
grep "## PERF:" packages/core/skills/code-review/references/code-review-standards.md
# Expected: not found

grep "## TS:" packages/core/skills/code-review/references/code-review-standards.md
# Expected: not found

grep "## STATE:" packages/core/skills/code-review/references/code-review-standards.md
# Expected: not found
```

## Success Criteria

- [x] Only SEC, ARCH, LOGIC, DEAD sections remain
- [x] 22 cross-cutting rules, no platform-specific rules
- [x] File under 100 lines (84 lines)
- [x] Pointer note to platform rules at top
