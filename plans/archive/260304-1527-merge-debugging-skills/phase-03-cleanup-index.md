# Phase 03: Update index, connections, cleanup

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: Phase 01, Phase 02

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Update skill-index.json, update all skills that reference `debugging` to reference `debug`, verify no dangling references
**Implementation Status**: Pending

## Key Insights
- 5 skills have `enhances: [debugging]` — must change to `enhances: [debug]`
- skill-discovery references `debugging` as a task-type signal destination
- skill-index.json has separate entries for `debug` and `debugging` — must merge into one
- Several skills mention `debugging` in prose (Related Skills sections)

## Requirements
### Functional
- skill-index.json: remove `debugging` entry, merge metadata into `debug` entry
- Update skills that reference `debugging` in connections:
  - `problem-solving` — `enhances: [debugging]` -> `enhances: [debug]`
  - `sequential-thinking` — `enhances: [debugging]` -> `enhances: [debug]`
  - `error-recovery` — `enhances: [debugging]` -> `enhances: [debug]`
  - `scout` — `enhances: [plan, debugging, implementation]` -> `enhances: [plan, debug, implementation]`
  - `auto-improvement` — prose reference "debugging" -> "debug"
- Update `skill-discovery` SKILL.md: task-type signal table `debugging` -> `debug`
- Update prose references in Related Skills sections of: problem-solving, sequential-thinking, error-recovery, knowledge-capture, knowledge-base
- Decrement skill-index.json count

### Non-Functional
- No grep results for `"debugging"` in skill connections after cleanup (prose mentions of "debugging" as a concept are OK)

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/skills/skill-index.json` — merge entries, update count [OWNED]
- `packages/core/skills/problem-solving/SKILL.md` — update enhances + prose [OWNED]
- `packages/core/skills/sequential-thinking/SKILL.md` — update enhances + prose [OWNED]
- `packages/core/skills/error-recovery/SKILL.md` — update enhances + prose [OWNED]
- `packages/core/skills/scout/SKILL.md` — update enhances [OWNED]
- `packages/core/skills/skill-discovery/SKILL.md` — update signal table [OWNED]
- `packages/core/skills/auto-improvement/SKILL.md` — update prose ref [OWNED]
- `packages/core/skills/knowledge-capture/SKILL.md` — update prose ref [OWNED]
- `packages/core/skills/knowledge-base/SKILL.md` — update prose ref [OWNED]
### Read-Only
- `packages/core/skills/debug/SKILL.md` — verify name used in refs

## Implementation Steps

1. **Update skill-index.json**:
   - Remove `debugging` entry (around line 501)
   - Merge its metadata into `debug` entry: add keywords, agent-affinity, triggers, update connections
   - Update `debug` entry path to `debug/SKILL.md` (already correct)
   - Decrement total count by 1
2. **Update connection references** in 5 skill SKILL.md files:
   - `problem-solving`: `enhances: [debugging]` -> `enhances: [debug]`, Related Skills prose
   - `sequential-thinking`: `enhances: [debugging]` -> `enhances: [debug]`, Related Skills prose
   - `error-recovery`: `enhances: [debugging]` -> `enhances: [debug]`, Related Skills prose
   - `scout`: `enhances: [plan, debugging, implementation]` -> `enhances: [plan, debug, implementation]`
   - `auto-improvement`: prose "debugging" -> "debug" skill
3. **Update skill-discovery** signal table: `debugging` -> `debug` as destination
4. **Update prose references** in knowledge-capture, knowledge-base Related Skills sections
5. **Verify**: `grep -r '"debugging"' packages/core/skills/` returns only concept mentions, no connection refs

## Todo List
- [ ] Merge skill-index.json entries
- [ ] Update 5 skills' connection metadata
- [ ] Update skill-discovery signal table
- [ ] Update prose references
- [ ] Verify no dangling refs

## Success Criteria
- `grep -r 'requires.*debugging\|enhances.*debugging' packages/core/skills/` returns 0 results
- skill-index.json has no `debugging` entry
- skill-index.json count field is correct

## Risk Assessment
**Risks**: Missing a reference; prose "debugging" confused with skill name "debugging"
**Mitigation**: Use targeted grep; only change connection metadata + Related Skills sections, not concept mentions

## Security Considerations
None.

## Next Steps
After all phases: run `epost-kit init` to regenerate `.claude/` from packages/
