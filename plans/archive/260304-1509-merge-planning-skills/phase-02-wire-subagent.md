# Phase 02: Wire subagent-driven-development & update agent

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/subagent-driven-development/SKILL.md`
- `packages/core/agents/epost-architect.md`
- `packages/core/skills/plan-deep/SKILL.md`

## Overview
- Priority: P1
- Status: Pending
- Effort: 45m
- Description: Add epost-architect to subagent-driven-development affinity. Update architect agent skills list (plan replaces planning). Update plan-deep to reference subagent prompt templates for researcher dispatch. Trim agent system prompt of content now in skills.

## Requirements
### Functional
- `subagent-driven-development` metadata.agent-affinity adds `epost-architect`
- `epost-architect` agent skills: [core, skill-discovery, plan, knowledge-retrieval] (plan replaces planning)
- `epost-architect` system prompt trimmed — remove Plan File Structure templates (now in plan-fast/deep/parallel skills), remove duplicated process descriptions
- plan-deep Step 4 researcher dispatch references `subagent-driven-development/references/` templates as pattern guidance
- plan-deep researcher prompts note: "Follow subagent dispatch patterns from subagent-driven-development skill"

### Non-Functional
- Agent system prompt under 120 lines (currently 252, heavily duplicates skill content)
- No behavioral change — same routing, same plan output format

## Related Code Files
### Modify
- `packages/core/skills/subagent-driven-development/SKILL.md` — add epost-architect to agent-affinity
- `packages/core/agents/epost-architect.md` — update skills list, trim system prompt
- `packages/core/skills/plan-deep/SKILL.md` — reference subagent templates

### Read-Only
- `packages/core/skills/subagent-driven-development/references/implementer-prompt.md`
- `packages/core/skills/subagent-driven-development/references/spec-reviewer-prompt.md`

## Implementation Steps
1. **Update subagent-driven-development frontmatter**
   - Add `epost-architect` to `metadata.agent-affinity` array
   - Result: `[epost-orchestrator, epost-implementer, epost-architect]`
2. **Update epost-architect agent**
   - Change skills: `[core, skill-discovery, plan, knowledge-retrieval]`
   - Trim system prompt body:
     - Keep: When Activated, Plan Modes table, Rules, Completion, Related Documents
     - Remove: Your Process section (duplicates plan skill variants)
     - Remove: Plan File Structure templates (duplicates plan-fast/deep/parallel)
     - Remove: Parallelization Info section (duplicates plan-parallel)
     - Add: Brief note "Load `plan` skill for workflow. Load `subagent-driven-development` for researcher dispatch patterns."
3. **Update plan-deep researcher dispatch**
   - In Step 4 (Sequential Research Phase), add note before researcher prompts:
     ```
     Follow dispatch patterns from `subagent-driven-development` skill.
     Researcher subagents get fresh context per subagent-driven-development rules.
     ```
   - No structural change to researcher prompts — just cross-reference

## Todo List
- [ ] Update subagent-driven-development agent-affinity
- [ ] Update epost-architect skills list
- [ ] Trim epost-architect system prompt
- [ ] Add subagent cross-reference to plan-deep
- [ ] Verify agent prompt under 120 lines

## Success Criteria
- epost-architect loads `plan` skill (not `planning`)
- subagent-driven-development discoverable by architect via skill-discovery
- Agent system prompt concise, delegates to skills for detail
- plan-deep cross-references subagent templates

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Trimmed agent prompt loses critical context | Med | Keep Rules + Completion sections; skills carry the rest |
| plan-deep researcher dispatch breaks | Low | Cross-reference only, no structural change |

## Security Considerations
None identified.

## Next Steps
- Phase 03: Update indexes and cleanup
