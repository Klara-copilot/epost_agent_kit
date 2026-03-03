# Phase 03: Navigation + Polish

## Context Links
- Parent plan: [plan.md](./plan.md)
- Phase 01: [phase-01-agent-view.md](./phase-01-agent-view.md)
- Phase 02: [phase-02-skill-view.md](./phase-02-skill-view.md)

## Overview
**Date**: 2026-03-03
**Priority**: P2
**Description**: Cross-view navigation (click agent in skill view -> agent view), cleanup, view mode URL sync, unified sidebar styling.
**Implementation Status**: Pending

## Key Insights
- Both views share the same data + canvas infrastructure
- Cross-linking deepens discovery: "this skill is required by agent X" -> click X -> see agent X's full chain
- URL state sync (`?view=agent&id=epost-debugger`) enables bookmarking/sharing

## Requirements
### Functional
- Click agent name in SkillImpactPanel -> switch to agent view with that agent selected
- Click skill name in DiscoveryProtocolPanel -> switch to skill view with that skill selected
- URL query params reflect current view + selection: `?view=agent&id=X` or `?view=skill&id=Y`
- Breadcrumb or back navigation when cross-linking

### Non-Functional
- URL updates via `router.replace` (no history pollution for every click)
- Page load with query params restores view state

## Related Code Files
### Modify (EXCLUSIVE)
- `app/canvas/page.tsx` — Add URL sync, cross-view click handlers, cleanup dead code from old discovery dropdown

### Read-Only
- `app/canvas/_components/AgentTree.tsx` — From Phase 01
- `app/canvas/_components/SkillTree.tsx` — From Phase 02
- `app/canvas/_components/SkillImpactPanel.tsx` — From Phase 02

## Implementation Steps

1. **Cross-view click handlers**
   - In `SkillImpactPanel`: agent names become clickable. onClick: `setViewMode('agent'); setDiscoveryAgentId(agentId)`
   - In `DiscoveryProtocolPanel`: skill names become clickable. onClick: `setViewMode('skill'); setSelectedSkillId(skillId)`
   - Style clickable items with hover underline + pointer cursor

2. **URL query param sync**
   - Read `searchParams` on mount: `view`, `id`
   - Set `viewMode` and `discoveryAgentId`/`selectedSkillId` from params
   - On state change, `router.replace` with updated params (debounced)

3. **Cleanup**
   - Remove old `<select>` discovery dropdown code (dead after Phase 01)
   - Consolidate `ViewModeToggle` to handle 4 modes: full, chain, agent, skill
   - Unify tree sidebar styling (AgentTree + SkillTree share common TreePanel wrapper)

4. **Home page navigation cards**
   - Update NavCard on homepage: add "Agent View" and "Skill View" cards linking to `/canvas?view=agent` and `/canvas?view=skill`

## Todo List
- [ ] Add cross-view click handlers in both panels
- [ ] Implement URL query param read/write
- [ ] Cleanup deprecated discovery dropdown code
- [ ] Extract shared TreePanel component from Agent/Skill trees
- [ ] Update homepage nav cards
- [ ] Manual test: bookmark URL, reload, verify state restored

## Success Criteria
- Click agent in skill view -> switches to agent view showing that agent
- Click skill in agent view -> switches to skill view showing that skill
- URL reflects current view state; reload preserves it

## Risk Assessment
**Risks**: URL sync with Next.js App Router `useSearchParams` may cause hydration warnings
**Mitigation**: Use `useSearchParams` from `next/navigation`, update via `router.replace` on client only

## Security Considerations
None

## Next Steps
After completion:
1. Consider adding keyboard navigation (arrow keys in tree)
2. Consider URL-based deep links from external docs
