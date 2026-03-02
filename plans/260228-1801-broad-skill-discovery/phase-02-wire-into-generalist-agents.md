# Phase 02: Wire into Generalist Agents

## Context Links
- [Plan](./plan.md)
- [Phase 01](./phase-01-create-skill-discovery-skill.md)

## Overview
**Date**: 2026-02-28
**Priority**: P1
**Description**: Add `skill-discovery` to generalist agents' `skills:` lists and replace architect's inlined protocol with skill reference.
**Implementation Status**: ⏳ Pending

## Key Insights
- Agent `skills:` list is the guaranteed activation path — no other mechanism needed
- Architect currently has an inlined "Skill Discovery Protocol" section — replace with skill reference to stay DRY
- Specialists (web/ios/android/backend developers) don't need this — they already hardcode platform skills

## Requirements
### Functional
- Add `skill-discovery` to 5 generalist agents: implementer, debugger, tester, reviewer, orchestrator
- Replace architect's inline "Skill Discovery Protocol" section with reference to skill
- Keep architect's `skills:` list, add `skill-discovery` to it
- Do NOT modify specialist agents (web/ios/android/backend developers)

### Non-Functional
- Minimal changes per agent (1 line in frontmatter + optional prompt cleanup)

## Related Code Files
### Modify (EXCLUSIVE to this phase)
- `.claude/agents/epost-implementer.md` — Add skill-discovery to skills list [OWNED]
- `.claude/agents/epost-debugger.md` — Add skill-discovery to skills list [OWNED]
- `.claude/agents/epost-tester.md` — Add skill-discovery to skills list [OWNED]
- `.claude/agents/epost-reviewer.md` — Add skill-discovery to skills list [OWNED]
- `.claude/agents/epost-orchestrator.md` — Add skill-discovery to skills list [OWNED]
- `.claude/agents/epost-architect.md` — Add skill-discovery, remove inline protocol [OWNED]
- `packages/core/agents/epost-architect.md` — Source: remove inline protocol [OWNED]
- `packages/core/agents/epost-implementer.md` — Source: add skill [OWNED]
- `packages/core/agents/epost-debugger.md` — Source: add skill [OWNED]
- `packages/core/agents/epost-tester.md` — Source: add skill [OWNED]
- `packages/core/agents/epost-reviewer.md` — Source: add skill [OWNED]
- `packages/core/agents/epost-orchestrator.md` — Source: add skill [OWNED]

### Read-Only
- Phase 01 skill file (to verify it exists)

## Implementation Steps
1. **Add `skill-discovery` to 5 agents' frontmatter** `skills:` list
   - epost-implementer: `[core, code-review, debugging, error-recovery, knowledge-retrieval, skill-discovery]`
   - epost-debugger: `[core, debugging, knowledge-base, sequential-thinking, problem-solving, docs-seeker, error-recovery, skill-discovery]`
   - epost-tester: `[core, error-recovery, debugging, skill-discovery]`
   - epost-reviewer: `[core, code-review, knowledge-retrieval, repomix, skill-discovery]`
   - epost-orchestrator: `[core, planning, knowledge-retrieval, hub-context, skill-discovery]`
2. **Update epost-architect**:
   - Add `skill-discovery` to `skills:` list
   - Remove the "Skill Discovery Protocol" section from system prompt (the skill replaces it)
   - Add one-liner reference: "Platform skill discovery is handled by the `skill-discovery` skill."
3. **Update both source (packages/core/agents/) and installed (.claude/agents/) copies**

## Todo List
- [ ] Edit 6 agent source files in `packages/core/agents/`
- [ ] Edit 6 installed agent files in `.claude/agents/`
- [ ] Remove architect inline protocol, add skill reference
- [ ] Verify no other agents need the skill

## Success Criteria
- 6 agents have `skill-discovery` in skills list (5 generalists + architect)
- Architect has no duplicated inline protocol
- Specialist agents unchanged
- All agent files parse valid YAML frontmatter

## Risk Assessment
**Risks**: Adding skill to too many agents increases token load across all tasks
**Mitigation**: Skill has "skip if no platform detected" rule — zero-cost for platform-agnostic tasks

## Security Considerations
None.

## Next Steps
- Phase 03: Update skill-index.json and validate
