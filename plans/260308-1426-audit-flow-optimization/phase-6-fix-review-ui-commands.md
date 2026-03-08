---
phase: 6
title: "fix --ui and review --ui reference files"
effort: 1.5h
depends: [5]
---

# Phase 6: `/fix --ui` and `/review --ui` Reference Files

## Overview

Create two new reference files — `fix/references/ui-mode.md` and `review/references/ui-mode.md` — that wire the `--ui` flag into each parent skill. Update parent skills to route `--ui` to epost-muji. Mirrors `fix/references/a11y-mode.md` and `review/references/a11y.md` patterns exactly.

## Context

A11y routing pattern (source of truth):
- `fix/SKILL.md` detects `--a11y` flag → loads `references/a11y-mode.md` → delegates to epost-a11y-specialist
- `review/SKILL.md` detects `--a11y` flag → loads `review/references/a11y.md` → delegates to epost-a11y-specialist

UI needs the same:
- `fix/SKILL.md` detects `--ui` flag → loads `references/ui-mode.md` → delegates to epost-muji
- `review/SKILL.md` detects `--ui` flag → loads `review/references/ui-mode.md` → delegates to epost-muji

## Files to Create

### `packages/core/skills/fix/references/ui-mode.md`

Workflow for fixing a UI component finding:

```
## Fix UI Mode

Invoked when: `fix --ui <ComponentName> [--finding-id <id>] [--top <n>]`

### Steps

1. Load `.epost-data/ui/known-findings.json` (or note "no DB yet — run `/audit --ui` first")
2. Select finding(s):
   - `--finding-id <id>`: load that specific finding
   - `--top <n>`: load top N unresolved by severity + priority
   - No flag: load all unresolved findings for component
3. Delegate to epost-muji via Task tool with:
   - Finding objects from DB
   - Component name + file_pattern
   - Mode: fix (apply surgical changes)
   - Boundaries: fix ONLY the flagged rule violation — no refactoring
4. Receive fix result from epost-muji:
   - Unified diff
   - Lines changed
   - Confidence (high|medium|low)
5. Save diff to `.epost-data/ui/fixes/patches/finding-{id}-{date}.diff`
6. Update known-findings.json: set `fix_applied: true`, `fix_applied_date: today`
7. Output confirmation (JSON + prose summary)
8. Suggest: "Run `/audit --close --ui <id>` to mark as fully resolved after verification"

### Boundaries
- Fix ONE rule violation per finding — no opportunistic improvements
- Do not run a full re-audit after fixing
- If fix requires structural change (STRUCT category) — report instead of fixing, suggest redesign
```

### `packages/core/skills/review/references/ui-mode.md`

Workflow for lightweight UI component review:

```
## Review UI Mode

Invoked when: `review --ui <ComponentName> [--focus structure|reuse|tokens|react|a11y|all]`
Default focus: `all`

### Steps

1. Pre-audit KB load:
   - Check `docs/index.json` for component FEAT/CONV entry
   - If found: treat documented patterns as intentional conventions
2. Read component source file(s) (not full module scan — target file only)
3. Run ONLY the rules for the selected focus area:
   | Focus | Rules Applied |
   |-------|---------------|
   | structure | STRUCT-001..006 |
   | reuse | REUSE (RU-1..8) from consumer mode, or STRUCT for library mode |
   | tokens | TOKEN-001..006 |
   | react | REACT (RE-1..8) |
   | a11y | A11Y-001..005 (surface check only; delegate to epost-a11y-specialist for deep WCAG) |
   | all | All applicable rules for mode (library or consumer) |
4. Collect violations (no full report — quick findings list)
5. Optionally append to `.epost-data/ui/known-findings.json` (ask user if not automated)
6. Output: short findings table (ID | Rule | File:Line | Issue | Quick Fix)

### Boundaries
- Lightweight: max 2 files read per review
- No delegation to other agents (this is a quick check — full audit → /audit --ui)
- A11y focus: surface ARIA/label issues only; delegate to epost-a11y-specialist for WCAG analysis
- No score calculation — findings list only
```

## Files to Modify

### `packages/core/skills/fix/SKILL.md`

Add `--ui` flag row to flag routing table (after `--a11y` row):
```
| --ui | Fix UI component findings from known-findings DB | Loads fix/references/ui-mode.md | epost-muji |
```

### `packages/core/skills/review/SKILL.md` (if exists)

Add `--ui` flag row:
```
| --ui | Lightweight UI component review by focus area | Loads review/references/ui-mode.md | epost-muji |
```

## Todo List

- [ ] Read `packages/core/skills/fix/SKILL.md` to understand flag routing table format
- [ ] Read `packages/core/skills/fix/references/` to understand a11y-mode.md structure
- [ ] Read `packages/core/skills/review/SKILL.md` if it exists
- [ ] Create `packages/core/skills/fix/references/ui-mode.md`
- [ ] Create `packages/core/skills/review/references/ui-mode.md`
- [ ] Add `--ui` row to fix/SKILL.md flag routing table
- [ ] Add `--ui` row to review/SKILL.md flag routing table (if skill exists)
- [ ] Verify all edits in `packages/` not `.claude/`

## Success Criteria

- fix/references/ui-mode.md has 8-step workflow matching a11y-mode.md pattern
- review/references/ui-mode.md has focus-area table with correct rule mappings
- Both parent skills route `--ui` flag to respective reference files
- epost-muji is the agent for both (consistent with audit --ui)
