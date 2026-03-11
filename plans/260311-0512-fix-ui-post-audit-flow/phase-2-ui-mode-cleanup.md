---
phase: 2
title: "Clean up ui-mode.md (remove YAGNI, clarify close flow)"
effort: 30m
depends: [1]
---

# Phase 2: UI Mode Cleanup

## Context Links

- [Plan](./plan.md)
- `packages/core/skills/fix/references/ui-mode.md` -- current ui-mode with patch saving

## Files to Modify

### 1. `packages/core/skills/fix/references/ui-mode.md`

**Changes:**

1. **Remove Step 5 (patch file saving)** -- YAGNI. Muji edits files directly. Saving `.diff` files to `.epost-data/ui/fixes/patches/` adds complexity with no consumer.

2. **Simplify steps to 6 total:**
   - Step 1: Load `.epost-data/ui/known-findings.json` (unchanged)
   - Step 2: Select finding(s) per args (unchanged)
   - Step 3: Dispatch epost-muji via Agent tool (unchanged -- now works from main context after Phase 1)
   - Step 4: Receive fix result from muji (lines changed, confidence)
   - Step 5: Update `known-findings.json`: set `fix_applied: true`, `fix_applied_date: today`
   - Step 6: Output summary + suggest "Run `/audit --close --ui <id>` to verify and close"

3. **Remove any reference to `.epost-data/ui/fixes/patches/`** -- directory concept removed entirely.

### 2. `packages/core/skills/fix/references/a11y-mode.md`

**Changes:**

1. **Remove patch file saving** -- same YAGNI reasoning. Lines 9, 44, 48-49, 62, 69 reference `.epost-data/a11y/fixes/patches/`. Remove all.

2. **Simplify:** After applying fix, update known-findings.json directly. No diff file intermediary.

3. **Update close suggestion:** Line 51 references `/audit-close-a11y {id}` (old command). Change to `/audit --close --a11y <id>` (new flag-based pattern per skill consolidation).

4. **Line 71:** Same old command reference `/audit-close-a11y <id>` -> `/audit --close --a11y <id>`.

## Implementation Steps

1. Rewrite `ui-mode.md` Steps section (remove step 5, renumber)
2. Remove all `.epost-data/ui/fixes/patches/` references from ui-mode.md
3. Remove all `.epost-data/a11y/fixes/patches/` references from a11y-mode.md
4. Update `/audit-close-a11y` references to `/audit --close --a11y` in a11y-mode.md

## Todo List

- [x] Remove patch saving from ui-mode.md
- [x] Renumber ui-mode.md steps
- [x] Remove patch saving from a11y-mode.md (lines 9, 44, 48-49, 62, 69)
- [x] Update audit-close command references in a11y-mode.md (lines 51, 71)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Some workflow may depend on patch files | Low | No consumer exists -- YAGNI confirmed |
| Old `/audit-close-a11y` command may still exist | Low | Skill consolidation plan already merged these |
