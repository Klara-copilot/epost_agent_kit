---
phase: 4
title: "Trim documentation-standards.md — remove 2 misplaced sections"
effort: 10m
depends: []
---

# Phase 4: Trim documentation-standards.md

## Files to Modify

- EDIT: `packages/core/skills/core/references/documentation-standards.md`

## Sections to Remove

| Section | Lines (approx) | Reason |
|---------|---------------|--------|
| `## Skill Structure Compliance` | ~37 lines | Belongs in kit-skill-development skill, not core rules loaded by all agents |
| `## Auto-Update Behavior` | ~25 lines | Context7-specific behavior, low general value |

## After Removal

Remaining sections (keep all of these):
- `## Formatting Rules`
- `## Required Structure`
- `## Content Guidelines`
- `## Size Limits`
- `## Related Documents`

Also update:
- `## Table of Contents` — remove the two deleted section entries
- `## Related Documents` — remove reference to `decision-boundaries.md` (the auto-update section that referenced it is gone)

## Todo

- [ ] Read documentation-standards.md fully
- [ ] Remove `## Skill Structure Compliance` section
- [ ] Remove `## Auto-Update Behavior` section
- [ ] Update Table of Contents
- [ ] Update Related Documents section
- [ ] Verify line count ≤ 85

## Success Criteria

- `## Skill Structure Compliance` absent
- `## Auto-Update Behavior` absent
- TOC matches remaining sections
- Line count ≤ 85
- Formatting Rules, Required Structure, Content Guidelines, Size Limits all present
