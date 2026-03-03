# Phase 02: Skill-Centric View

## Context Links
- Parent plan: [plan.md](./plan.md)
- Phase 01: [phase-01-agent-view.md](./phase-01-agent-view.md)
- GraphBuilder edges: `lib/services/GraphBuilder.ts:125-356`
- Skill entity: `lib/types/entities.ts:57-73`

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: New view mode with skill as focal point. Left panel = skill tree. Canvas shows selected skill + all agents that use it + packages that provide it. Right panel = impact analysis: required vs optional consumers.
**Implementation Status**: Pending

## Key Insights
- GraphBuilder already creates `skill-dependency` edges (agent -> skill) and `package-provides` edges (package -> skill) — we just need to reverse-traverse them
- Skill `connections` field (extends/requires/enhances/conflicts) gives inter-skill relationships
- `usedByAgents` is already computed in SkillNode connections during graph build
- Agent skills list distinguishes declared (required) vs affinity (optional via discovery)
- A skill is "required" by an agent if it's in `agent.skills[]` frontmatter. It's "optional" if it reaches the agent only via affinity/platform/enhancer discovery

## Requirements
### Functional
- Left panel: skill tree grouped by package (like agent tree from Phase 01)
- Click skill = canvas shows:
  - The skill node (center)
  - All agents connected to it (left side)
  - Packages providing it (right side)
  - Related skills (extends/requires/enhances/conflicts)
- Right panel: Impact Analysis
  - **Required by**: agents where skill is in `skills:` frontmatter list
  - **Optional for**: agents where skill is available via affinity/platform/enhancer
  - **Provided by**: packages listing this skill in `provides.skills`
  - **Connections**: extends/requires/enhances/conflicts (already in SkillMetadataSection)

### Non-Functional
- ~45 skills — no virtualization needed but tree should be collapsible
- Canvas layout: skill in center, agents on left, packages on right (custom dagre config)

## Architecture

```
[Skill Tree (left)]    →  [Canvas (center)]           →  [Impact Panel (right)]
  core/                     [pkg-1]──provides──[SKILL]     Required by:
    core                    [pkg-2]──provides──┘  │          - epost-implementer
    skill-discovery                               │          - epost-debugger
    planning                [agent-1]─required────┘        Optional for:
  platform-web/             [agent-2]─optional─────          - epost-researcher
    web-frontend            [skill-x]─extends──[SKILL]     Provided by:
    web-nextjs              [skill-y]─enhances─[SKILL]       - core (layer 0)
  ...                                                      Connections:
                                                             extends: [parent]
                                                             enhances: [target]
```

State: new `selectedSkillId: string | null` drives tree highlight and canvas filter.

## Related Code Files
### Modify (EXCLUSIVE)
- `app/canvas/page.tsx` — Add 'skill' viewMode branch with filtered graph logic and SkillImpactPanel in right column

### Create (EXCLUSIVE)
- `app/canvas/_components/SkillTree.tsx` — Skill tree grouped by packageName, collapsible sections
- `app/canvas/_components/SkillImpactPanel.tsx` — Right panel showing required/optional agents, providing packages, skill connections

### Read-Only
- `lib/services/GraphBuilder.ts` — Edge structure for reverse lookup
- `lib/services/SkillChainResolver.ts` — To compute required vs optional
- `lib/types/entities.ts` — Skill, Agent, Package types
- `lib/types/graph.ts` — Edge types

## Implementation Steps

1. **Create `SkillTree.tsx`**
   - Group skills by `packageName`, sorted alphabetically
   - Collapsible package headers
   - Each skill item shows: name, tier badge (core/discoverable), connection indicator
   - Selected skill highlighted
   - Click handler: `onSelect(skill.id)`
   - Reuse styling pattern from AgentTree (Phase 01)

2. **Create `SkillImpactPanel.tsx`**
   - Props: `selectedSkill: Skill`, `agents: Agent[]`, `allSkills: Skill[]`, `packages: Package[]`
   - **Required by section**: filter agents where `agent.skills.includes(skill.name)` or `agent.skills.includes(skill.id)`. Show agent name + model badge.
   - **Optional for section**: for each agent NOT in "required", run `resolveSkillChain(agent, allSkills)` and check if skill appears in affinity/platform/enhancer layers. Show which layer (affinity/platform/enhancer) with color badge.
   - **Provided by section**: filter packages where `pkg.provides.skills.includes(skill.name)`. Show package name + layer.
   - **Connections section**: reuse existing `SkillConnectionList` patterns for extends/requires/enhances/conflicts
   - **Agent Affinity section**: show `skill.agentAffinity` list

3. **Add 'skill' viewMode to canvas/page.tsx**
   - New state: `selectedSkillId: string | null`
   - Add ViewModeToggle for "Skill" with color `#10b981`
   - Auto-select first skill when entering skill view
   - `filteredGraph` logic for `viewMode === 'skill'`:
     - Find all edges where source or target matches `skill:{selectedSkillId}`
     - Collect connected node keys (agents via skill-dependency, packages via package-provides, skills via skill-extends/requires/enhances)
     - Filter graph nodes to: selected skill + connected nodes
     - Filter graph edges to: only edges between visible nodes

4. **Wire left panel rendering**
   - When `viewMode === 'skill'`: render `SkillTree` in left panel
   - When `viewMode === 'skill'`: render `SkillImpactPanel` in right panel
   - Pass `selectedSkillId` to tree for highlight

5. **Add SkillViewLegend** (bottom-left overlay like ChainLegend)
   - Required (solid green line)
   - Optional/Affinity (dashed amber)
   - Provides (purple)
   - Extends/Requires/Enhances/Conflicts (existing colors)

## Todo List
- [ ] Create SkillTree component with package grouping
- [ ] Create SkillImpactPanel with required/optional/provided sections
- [ ] Add 'skill' viewMode to canvas/page.tsx
- [ ] Implement filteredGraph for skill view
- [ ] Add SkillViewLegend
- [ ] Test with skills that have many connections (e.g., 'core')
- [ ] Test edge case: skill with zero agents

## Success Criteria
- Click skill in tree, canvas shows all affected agents and packages
- Right panel clearly distinguishes required vs optional consumers
- Optional consumers show which discovery layer (affinity/platform/enhancer)
- Skill connections (extends/requires) visible on canvas as edges

## Risk Assessment
**Risks**: Skills like 'core' may connect to many agents, making canvas dense
**Mitigation**: Use dagre layout with more spacing. Consider highlighting connected nodes with opacity fade for unconnected (already existing pattern).

## Security Considerations
None — read-only UI

## Next Steps
After completion:
1. Proceed to Phase 03: Navigation + Polish
2. Cross-link agent and skill views (click agent in skill view -> switch to agent view)
