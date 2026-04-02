---
phase: 2
title: "Skill-discovery simplification"
effort: 1.5h
depends: []
---

## Context Links

- Plan: [plan.md](./plan.md)
- Source file: `packages/core/skills/skill-discovery/SKILL.md`

## Overview

Simplify skill-discovery from a 174-line 4-step lazy-loader protocol to a ~50-line capability catalogue. Remove runtime routing logic and skill-index.json dependency (P6 + P7).

## Requirements

### Functional
1. **Remove** the 4-step protocol (detect signals → query index → resolve deps → apply)
2. **Remove** all references to `skill-index.json` as a runtime routing source
3. **Replace** with a simple catalogue: "here are available skills and when to use them"
4. **Keep** platform signal table (which extensions map to which skills) — useful as reference
5. **Keep** agent discovery hints section (agents with distinct flows)

### Non-Functional
- skill-discovery SKILL.md under 60 lines
- No JSON index queries in the skill body
- Catalogue should be scannable (table format)

## Files to Change

- `packages/core/skills/skill-discovery/SKILL.md` — **Modify**: simplify to catalogue

## Implementation Steps

1. Read current `packages/core/skills/skill-discovery/SKILL.md` in full
2. Extract the useful parts:
   - Platform signal table (1a)
   - Task type signal table (1b)
   - Quick Reference table at bottom
3. Remove:
   - Step 2 (Query Skill Index) — entire section
   - Step 2b (Resolve Dependencies) — entire section
   - Step 3 (Select and Load / Token Budget) — entire section
   - Step 4 (Apply Discovered Knowledge) — entire section
   - All `skill-index.json` references
4. Restructure as:
   - Brief purpose statement
   - Platform skills table
   - Task-type skills table
   - Common discovery paths (condensed Quick Reference)
5. Update frontmatter: remove `tier: core`, update description
6. Verify < 60 lines

## Todo List

- [ ] Remove 4-step protocol
- [ ] Remove all skill-index.json references
- [ ] Keep platform + task-type signal tables
- [ ] Restructure as catalogue
- [ ] Update frontmatter
- [ ] Verify < 60 lines

## Success Criteria

- No 4-step protocol remains
- No `skill-index.json` references in SKILL.md
- File under 60 lines
- Platform and task-type tables preserved
