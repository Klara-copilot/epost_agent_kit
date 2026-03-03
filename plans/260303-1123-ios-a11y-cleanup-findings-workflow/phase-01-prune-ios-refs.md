# Phase 01: Prune iOS a11y References

## Context Links
- Parent plan: [plan.md](./plan.md)
- `packages/a11y/skills/ios-a11y/` — source of truth
- `packages/a11y/skills/android-a11y/` — reference for target structure

## Overview
**Date**: 2026-03-03
**Priority**: P2
**Description**: Remove/relocate unnecessary files from ios-a11y to match android-a11y's leaner structure
**Implementation Status**: Pending

## Key Insights

Current ios-a11y has 11 refs (2950 lines). Android-a11y has 6 refs (1911 lines).

**Files to remove/relocate:**

| File | Lines | Action | Reason |
|------|-------|--------|--------|
| `a11y-images.md` | 299 | DELETE | 80% overlaps with `a11y-buttons.md` (image-button section) and `a11y-mode-guidance.md` (image patterns). Unique content (complex images: charts/diagrams/maps) = ~40 lines — merge into `a11y-core.md` |
| `a11y-mode-audit.md` | 89 | MOVE to `audit-a11y/references/` | iOS-specific audit mode, but audit is cross-platform. Should live with the command skill |
| `a11y-mode-fix.md` | 92 | MOVE to `fix-a11y/references/` | Same reasoning |
| `a11y-mode-guidance.md` | 71 | MOVE to `review-a11y/references/` | Same reasoning |

**Files to keep (7 remaining):**
- `a11y-core.md` (445 lines) — core principles, Dynamic Type, SwiftUI modifiers
- `a11y-buttons.md` (405 lines) — button patterns (already covers image-buttons)
- `a11y-forms.md` (298 lines) — form accessibility
- `a11y-headings.md` (305 lines) — heading structure
- `a11y-focus.md` (359 lines) — focus management
- `a11y-colors-contrast.md` (291 lines) — contrast rules
- `a11y-testing.md` (296 lines) — testing patterns

## Requirements
### Functional
- Merge unique image content (complex images section ~40 lines) into `a11y-core.md`
- Move mode refs to command skill `references/` dirs
- Update `ios-a11y/SKILL.md` aspect files table to remove deleted/moved entries
- Update moved mode refs to remove iOS-specific framing (make platform-neutral or add platform conditional)

### Non-Functional
- Total ios-a11y references should be ~2400 lines (down from 2950)
- No knowledge loss — all unique patterns preserved somewhere

## Architecture

```
BEFORE:
ios-a11y/references/
  a11y-core.md          (keep)
  a11y-buttons.md       (keep)
  a11y-forms.md         (keep)
  a11y-headings.md      (keep)
  a11y-focus.md         (keep)
  a11y-colors-contrast.md (keep)
  a11y-testing.md       (keep)
  a11y-images.md        (DELETE, merge unique parts)
  a11y-mode-audit.md    (MOVE)
  a11y-mode-fix.md      (MOVE)
  a11y-mode-guidance.md (MOVE)

AFTER:
ios-a11y/references/     (7 files)
audit-a11y/references/   (NEW dir)
  ios-audit-mode.md      (moved from ios-a11y)
fix-a11y/references/     (NEW dir)
  ios-fix-mode.md        (moved from ios-a11y)
review-a11y/references/  (NEW dir)
  ios-guidance-mode.md   (moved from ios-a11y)
```

## Related Code Files
### Create
- `packages/a11y/skills/audit-a11y/references/ios-audit-mode.md` [OWNED]
- `packages/a11y/skills/fix-a11y/references/ios-fix-mode.md` [OWNED]
- `packages/a11y/skills/review-a11y/references/ios-guidance-mode.md` [OWNED]

### Modify
- `packages/a11y/skills/ios-a11y/SKILL.md` — remove 4 entries from aspect table [OWNED]
- `packages/a11y/skills/ios-a11y/references/a11y-core.md` — add complex images section [OWNED]
- `packages/a11y/skills/audit-a11y/SKILL.md` — add aspect files table [OWNED]
- `packages/a11y/skills/fix-a11y/SKILL.md` — add aspect files table [OWNED]
- `packages/a11y/skills/review-a11y/SKILL.md` — add aspect files table [OWNED]

### Delete
- `packages/a11y/skills/ios-a11y/references/a11y-images.md` [OWNED]
- `packages/a11y/skills/ios-a11y/references/a11y-mode-audit.md` [OWNED]
- `packages/a11y/skills/ios-a11y/references/a11y-mode-fix.md` [OWNED]
- `packages/a11y/skills/ios-a11y/references/a11y-mode-guidance.md` [OWNED]

### Read-Only
- `packages/a11y/skills/android-a11y/SKILL.md` — structure reference
- `packages/a11y/assets/known-findings-schema.json` — schema reference

## Implementation Steps

1. Extract unique content from `a11y-images.md`:
   - "Complex Images" section (Charts/Graphs, Diagrams, Maps) ~lines 184-230
   - Append to `a11y-core.md` as new "## Complex Image Accessibility" section
2. Delete `a11y-images.md`
3. Move `a11y-mode-audit.md` -> `audit-a11y/references/ios-audit-mode.md`
4. Move `a11y-mode-fix.md` -> `fix-a11y/references/ios-fix-mode.md`
5. Move `a11y-mode-guidance.md` -> `review-a11y/references/ios-guidance-mode.md`
6. Update `ios-a11y/SKILL.md`: remove 4 rows from aspect files table, remove images from fix templates
7. Update `audit-a11y/SKILL.md`: add aspect files reference
8. Update `fix-a11y/SKILL.md`: add aspect files reference
9. Update `review-a11y/SKILL.md`: add aspect files reference
10. Verify no broken cross-references in remaining files

## Todo List
- [ ] Extract complex images content from a11y-images.md
- [ ] Merge into a11y-core.md
- [ ] Delete a11y-images.md
- [ ] Move 3 mode files to command skill dirs
- [ ] Update 4 SKILL.md files
- [ ] Verify cross-references

## Success Criteria
- ios-a11y has exactly 7 reference files
- No unique knowledge lost
- Command skills reference their mode files
- All cross-references valid

## Risk Assessment
**Risks**: Removing images ref could break agent guidance for image-heavy screens
**Mitigation**: Image-button patterns already in buttons ref; decorative/informative patterns in guidance mode; complex images merged to core

## Security Considerations
N/A — documentation only

## Next Steps
After completion:
1. Run `epost-kit init` to regenerate `.claude/`
2. Proceed to Phase 02
