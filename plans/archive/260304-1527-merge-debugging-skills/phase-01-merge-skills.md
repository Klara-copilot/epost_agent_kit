# Phase 01: Merge debugging into debug

## Context Links
- Parent plan: [plan.md](./plan.md)
- Source: `packages/core/skills/debugging/SKILL.md` (222 lines)
- Target: `packages/core/skills/debug/SKILL.md` (30 lines)

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Merge all content from `debugging` skill into `debug` skill, absorb references/ directory
**Implementation Status**: Pending

## Key Insights
- `debug` is user-invocable (router), `debugging` is passive (knowledge base) — same pattern as plan/planning
- `debug` currently requires `debugging` — after merge, self-contained
- `debugging` has 2 reference files: `debugging-flow.dot`, `condition-based-waiting.md`
- `debugging` frontmatter has rich metadata (keywords, agent-affinity, triggers, connections.enhances) that must be preserved in merged skill

## Requirements
### Functional
- Merged `debug` contains ALL sections from `debugging`: Expertise, Patterns, Common Issues, Defense-in-Depth, State Diagram Tracing, Verification Checklist, Tools, Debugging Discipline, Sub-Skill Routing
- `references/` dir moves from `debugging/` to `debug/`
- Frontmatter merges: keep user-invocable + context:fork + agent from `debug`, absorb keywords/agent-affinity/platforms/connections from `debugging`
- Remove `requires: [debugging]` from merged skill (self-contained now)
- Keep `enhances: [debug, fix, fix-deep, fix-ci, fix-ui]` but change to just `enhances: [fix, fix-deep, fix-ci, fix-ui]` (can't enhance self)

### Non-Functional
- Merged skill should be < 250 lines (combine, don't bloat)
- No duplicate content between skill and agent prompt

## Related Code Files
### Create (EXCLUSIVE)
- (none — modifying existing)
### Modify (EXCLUSIVE)
- `packages/core/skills/debug/SKILL.md` — absorb debugging content [OWNED]
### Delete
- `packages/core/skills/debugging/SKILL.md` [OWNED]
- `packages/core/skills/debugging/references/debugging-flow.dot` (moved)
- `packages/core/skills/debugging/references/condition-based-waiting.md` (moved)
- `packages/core/skills/debugging/.DS_Store`
### Read-Only
- `packages/core/skills/debugging/SKILL.md` — source content

## Implementation Steps

1. **Move references/** from `packages/core/skills/debugging/references/` to `packages/core/skills/debug/references/`
2. **Merge frontmatter** into `debug/SKILL.md`:
   - Keep: `name: debug`, `user-invocable: true`, `context: fork`, `agent: epost-debugger`
   - Add from debugging: `tier: core`, all `metadata` (agent-affinity, keywords, platforms, triggers)
   - Update connections: remove `requires: [debugging]`, add `enhances: [fix, fix-deep, fix-ci, fix-ui]`
   - Keep `argument-hint` from debug
3. **Merge body content** — append debugging sections after debug's Platform Detection + Execution:
   - Expertise (systematic debugging 6-step)
   - Log Analysis, Stack Trace Interpretation, Reproduction Strategies
   - Root Cause Analysis (cross-ref to problem-solving)
   - Fix Validation
   - Patterns (debug logging, error boundaries, structured logging)
   - Common Issues (TS, React, Async)
   - Defense-in-Depth
   - State Diagram Tracing
   - Verification Checklist
   - Tools
   - Debugging Discipline (Iron Law)
   - Sub-Skill Routing table
   - Related Skills list
   - References section (update paths to `references/`)
4. **Delete** `packages/core/skills/debugging/` directory entirely
5. **Verify** merged file < 250 lines, all references resolve

## Todo List
- [ ] Move references/ directory
- [ ] Merge frontmatter
- [ ] Merge body content
- [ ] Delete debugging/ directory
- [ ] Verify merged skill compiles (no broken refs)

## Success Criteria
- `packages/core/skills/debug/SKILL.md` contains all debugging expertise
- `packages/core/skills/debug/references/` has both reference files
- `packages/core/skills/debugging/` directory no longer exists
- Merged frontmatter has all keywords, triggers, connections

## Risk Assessment
**Risks**: Missing content during merge; broken reference paths
**Mitigation**: Diff before/after line counts; grep for "debugging/" paths

## Security Considerations
None — skill content only, no runtime code.

## Next Steps
After completion: Phase 02 (trim agent prompt), Phase 03 (update index + references)
