# Phase 01: Merge planning into plan

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/plan/SKILL.md` — router skill (target)
- `packages/core/skills/planning/SKILL.md` — knowledge skill (source, to delete)
- `packages/core/skills/planning/references/` — state-machine-guide.md, planning-flow.dot

## Overview
- Priority: P1
- Status: Pending
- Effort: 45m
- Description: Absorb planning skill content into plan skill. Move references/ dir. Delete planning skill.

## Requirements
### Functional
- plan SKILL.md gains: Expertise section, Planning Framework, State Machine Modeling, Mental Models, Best Practices, Output Format
- plan references/ dir gains: state-machine-guide.md, planning-flow.dot
- planning frontmatter metadata (keywords, agent-affinity, triggers) merged into plan metadata
- plan keeps user-invocable: true, context: fork, agent: epost-architect
- plan removes `requires: [planning]` from connections (self-reference after merge)
- Sub-Skill Routing table from planning moves to plan

### Non-Functional
- plan SKILL.md stays under 200 lines (trim verbose sections)
- No content loss — all unique planning knowledge preserved
- References moved, not duplicated

## Related Code Files
### Modify
- `packages/core/skills/plan/SKILL.md` — merge planning content in
### Create
- `packages/core/skills/plan/references/state-machine-guide.md` — move from planning
- `packages/core/skills/plan/references/planning-flow.dot` — move from planning
### Delete
- `packages/core/skills/planning/SKILL.md`
- `packages/core/skills/planning/references/state-machine-guide.md`
- `packages/core/skills/planning/references/planning-flow.dot`
- `packages/core/skills/planning/` (entire directory)

## Implementation Steps
1. **Create references/ dir under plan skill**
   - `mkdir -p packages/core/skills/plan/references/`
2. **Move reference files**
   - `mv packages/core/skills/planning/references/state-machine-guide.md packages/core/skills/plan/references/`
   - `mv packages/core/skills/planning/references/planning-flow.dot packages/core/skills/plan/references/`
3. **Merge SKILL.md content**
   - Update plan frontmatter: add keywords, agent-affinity, platforms from planning
   - Remove `requires: [planning]` from connections
   - Add enhances: [plan-fast, plan-deep, plan-parallel, plan-validate] (from planning)
   - After the existing router sections (Step 0, Complexity, Heuristics), add:
     - `## Planning Expertise` — condensed from planning's Expertise section
     - `## Planning Framework` — the 6-step framework
     - `## State Machine Modeling` — when/how + reference link
     - `## Mental Models` — Decomposition, 80/20, Risk Management
     - `## Best Practices` — merged list
     - `## Sub-Skill Routing` — table from planning
4. **Delete planning skill directory**
   - `rm -rf packages/core/skills/planning/`
5. **Verify plan SKILL.md under 200 lines**
   - Condense if needed: use tables not paragraphs, keywords not sentences

## Todo List
- [ ] Create packages/core/skills/plan/references/
- [ ] Move state-machine-guide.md
- [ ] Move planning-flow.dot
- [ ] Merge frontmatter metadata
- [ ] Merge planning body content into plan SKILL.md
- [ ] Delete packages/core/skills/planning/
- [ ] Verify line count

## Success Criteria
- plan SKILL.md contains all unique content from planning
- planning directory deleted
- `references/state-machine-guide.md` accessible from plan skill

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| plan SKILL.md exceeds 200 lines | Med | Aggressively condense; move verbose content to references/ |
| Other skills reference `planning` by name | High | Grep for references; update all |

## Security Considerations
None identified.

## Next Steps
- Phase 02: Wire subagent-driven-development to architect
