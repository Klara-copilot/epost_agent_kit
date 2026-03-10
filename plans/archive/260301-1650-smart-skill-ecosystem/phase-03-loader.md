# Phase 03: Smart Dynamic Loader

## Context Links
- Parent: [plan.md](./plan.md)
- Current loader: `.claude/skills/skill-discovery/SKILL.md`
- Connection graph: [phase-02-connections.md](./phase-02-connections.md)

## Overview
**Date**: 2026-03-01
**Priority**: P1
**Description**: Upgrade `skill-discovery` to use connection graph for chain-loading. Auto-resolve extends/requires. Suggest enhances. Warn on conflicts.
**Implementation Status**: Pending

## Key Insights

Current `skill-discovery` loads max 3 skills via keyword matching. No dependency resolution. If `ios-a11y` is loaded, `a11y` base is NOT auto-loaded. The new loader should:

1. Resolve `extends` chains (load base before specialization)
2. Auto-load `requires` dependencies
3. Suggest `enhances` skills (don't auto-load, but mention availability)
4. Warn if `conflicts` detected (two conflicting skills matched)

### Loading Algorithm

```
Input: task signals (platform, task type, domain)
Output: ordered skill list to load

1. MATCH: Find candidate skills via current signal matching
2. RESOLVE: For each candidate:
   a. If has `extends`: prepend parent(s) to load list (recursive, max 3 hops)
   b. If has `requires`: add required skills to load list
   c. If has `conflicts` with another candidate: keep higher-priority, drop lower
3. DEDUPLICATE: Remove already-loaded skills (from agent's skills: list)
4. BUDGET: Apply token budget (15KB max)
   - Sort by: requires > extends-base > direct-match > enhances
   - Trim from bottom until within budget
5. LOAD: Read SKILL.md files in dependency order (bases first)
6. SUGGEST: List unloaded `enhances` skills as available
```

### Budget Management

| Slot | Type | Auto-Load? | Token Priority |
|------|------|-----------|----------------|
| 1-2 | requires/extends dependencies | Yes | Highest |
| 3-5 | Direct signal matches | Yes | High |
| N/A | enhances suggestions | No (mention only) | None |

Effective increase from "max 3" to "max 5 with dependencies counting separately from budget" OR keep max 3 direct + unlimited requires/extends (capped by 15KB).

**Recommendation**: Keep 15KB budget. Requires/extends load within that budget but don't count toward the "max 3 discoverable" limit. This means: up to 3 new discoverable skills + their dependency chain, all within 15KB.

## Requirements
### Functional
- Loader reads `connections` from `skill-index.json`
- `extends`/`requires` auto-resolved before loading
- `conflicts` detected and lower-priority skill dropped
- `enhances` listed as suggestions in agent output
### Non-Functional
- Max 3-hop chain resolution
- 15KB total token budget maintained
- No change to SKILL.md files themselves

## Architecture

### Updated Skill Discovery Protocol

```markdown
## Step 2b: Resolve Dependencies (NEW)

After matching candidates in Step 2:

For each candidate skill:
  1. Read its `connections` from index
  2. If `extends`: recursively add parent skills (max 3 hops)
  3. If `requires`: add required skills
  4. If `conflicts` with another candidate:
     - Keep the one with higher agent-affinity match
     - If tie, keep the one with more keyword matches
  5. Deduplicate against already-loaded skills

Load order: base skills first, then specializations, then direct matches.
```

### Example Resolution

Task: "Fix VoiceOver issue in iOS app"
Signals: ios, accessibility, debugging

1. MATCH: `ios-a11y`, `ios-development`, `debugging` (3 direct)
2. RESOLVE:
   - `ios-a11y` extends `a11y` -> prepend `a11y`
   - `ios-development` has no requires
   - `debugging` enhanced by `problem-solving` -> suggest
3. LOAD ORDER: `a11y` -> `ios-a11y` -> `ios-development` -> `debugging`
4. SUGGEST: "Also available: `problem-solving` (enhances debugging)"

## Related Code Files
### Modify (EXCLUSIVE)
- `.claude/skills/skill-discovery/SKILL.md` — Add Step 2b, update budget rules [OWNED]
### Read-Only
- `.claude/skills/skill-index.json` — Connection data source
- `.claude/agents/*.md` — Agent skills: lists for dedup

## Implementation Steps
1. Add "Step 2b: Resolve Dependencies" section to skill-discovery SKILL.md
2. Update Step 3 budget rules: requires/extends don't count toward max-3
3. Add conflict detection logic
4. Add "Suggested Skills" output format
5. Update "Quick Reference" table with chain examples
6. Test with 3-4 scenarios mentally (iOS a11y, web design system, backend debugging)

## Todo List
- [ ] Add dependency resolution step to skill-discovery
- [ ] Update budget management rules
- [ ] Add conflict detection
- [ ] Add enhancement suggestions
- [ ] Update quick reference examples

## Success Criteria
- Loader resolves `extends` chains automatically
- `requires` skills load without manual specification
- Conflicts produce warnings, not errors
- Total loaded content stays within 15KB
- No regression for current signal-matching behavior

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Chain too deep | Token budget blown | Hard 3-hop limit |
| Requires cycle | Infinite loop | Validator from Phase 02 prevents |
| Over-loading | Context dilution | Budget cap unchanged at 15KB |

## Security Considerations
None.

## Next Steps
Phase 04 aligns agent roster with new category structure.
