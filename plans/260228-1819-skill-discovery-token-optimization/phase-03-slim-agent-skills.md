# Phase 03: Slim Agent Skills Lists

## Context Links
- [Plan](./plan.md)
- [Phase 02](./phase-02-classify-skill-tiers.md)

## Overview
**Date**: 2026-02-28
**Priority**: P1
**Description**: Reduce each generalist agent's `skills:` list to only core-tier skills + skill-discovery. Removed skills become discoverable on-demand.
**Implementation Status**: ⏳ Pending

## Key Insights
- Agents keep their PRIMARY function skill (debugging for debugger, planning for architect)
- Everything else moves to discovery
- Specialist agents (web/ios/android/backend developers) stay unchanged — their platform skills ARE their primary function

## Proposed Changes

### epost-architect (40KB → 12KB, -70%)
```
Before: [core, planning, doc-coauthoring, knowledge-retrieval, sequential-thinking, skill-discovery]
After:  [core, planning, skill-discovery]
```
Removed → discoverable: doc-coauthoring, knowledge-retrieval, sequential-thinking

### epost-implementer (28KB → 10KB, -64%)
```
Before: [core, code-review, debugging, error-recovery, knowledge-retrieval, skill-discovery]
After:  [core, code-review, skill-discovery]
```
Removed → discoverable: debugging, error-recovery, knowledge-retrieval

### epost-debugger (28KB → 9KB, -68%)
```
Before: [core, debugging, knowledge-base, sequential-thinking, problem-solving, docs-seeker, error-recovery, skill-discovery]
After:  [core, debugging, skill-discovery]
```
Removed → discoverable: knowledge-base, sequential-thinking, problem-solving, docs-seeker, error-recovery

### epost-orchestrator (27KB → 12KB, -56%)
```
Before: [core, planning, knowledge-retrieval, hub-context, skill-discovery]
After:  [core, planning, hub-context, skill-discovery]
```
Removed → discoverable: knowledge-retrieval (hub-context stays — essential for routing)

### epost-reviewer (19KB → 10KB, -47%)
```
Before: [core, code-review, knowledge-retrieval, repomix, skill-discovery]
After:  [core, code-review, skill-discovery]
```
Removed → discoverable: knowledge-retrieval, repomix

### epost-tester (17KB → 9KB, -47%)
```
Before: [core, error-recovery, debugging, skill-discovery]
After:  [core, debugging, skill-discovery]
```
Removed → discoverable: error-recovery

### NOT modified (specialists — keep as-is)
- epost-web-developer, epost-ios-developer, epost-android-developer, epost-backend-developer
- epost-kit-designer, epost-muji, epost-a11y-specialist
- epost-documenter, epost-researcher, epost-brainstormer, epost-scout, epost-guide, epost-git-manager

## Requirements
### Functional
- Edit 6 generalist agent files (source + installed = 12 files)
- Only remove `tier: discoverable` skills from lists
- Keep `tier: core` skills + agent's primary function skill

### Non-Functional
- Agent descriptions unchanged — they still HANDLE the same tasks; skills are just loaded differently

## Related Code Files
### Modify (EXCLUSIVE to this phase)
- `packages/core/agents/epost-architect.md` [OWNED]
- `packages/core/agents/epost-implementer.md` [OWNED]
- `packages/core/agents/epost-debugger.md` [OWNED]
- `packages/core/agents/epost-tester.md` [OWNED]
- `packages/core/agents/epost-reviewer.md` [OWNED]
- `packages/core/agents/epost-orchestrator.md` [OWNED]
- `.claude/agents/` — 6 installed copies [OWNED]

## Implementation Steps
1. **Edit each source agent** — trim skills list per table above
2. **Copy changes to installed agents** in `.claude/agents/`
3. **Verify** no agent has empty skills list; all have at least `[core, {primary}, skill-discovery]`

## Todo List
- [ ] Slim 6 source agent files
- [ ] Sync 6 installed agent files
- [ ] Verify consistency

## Success Criteria
- All 6 agents have ≤4 startup skills
- Total startup payload across 6 agents: ~62KB (down from ~160KB)
- All agents still have `core` and `skill-discovery`

## Risk Assessment
**Risks**: Agent loses a skill it frequently needs → discovery overhead on common tasks
**Mitigation**: Phase 04 tests common scenarios. If a discoverable skill is needed >80% of the time, move it back to core tier.

## Security Considerations
None.

## Next Steps
- Phase 04: Validate with scenario tests
