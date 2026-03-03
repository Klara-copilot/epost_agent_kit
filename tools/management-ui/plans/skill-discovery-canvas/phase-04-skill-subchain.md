# Phase 04: Skill Sub-Chain Expansion

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: [Phase 02](./phase-02-discovery-page.md)
- Related: `skill-index.json` connections field

## Overview
**Date**: 2026-03-03
**Priority**: P3
**Description**: Clicking a skill node in the discovery canvas expands its own connection sub-graph -- showing extends parents, requires dependencies, enhancers, and conflicts inline.
**Implementation Status**: Pending

## Key Insights
- Each skill has `connections: { extends, requires, enhances, conflicts }` in skill-index.json
- Currently visible only in right panel text; this makes it visual
- Sub-chain expansion is a "drill-down" within the radial graph -- add nodes near the clicked skill
- Keep it simple: show one level of connections (no recursive expansion)

## Requirements
### Functional
- Double-click skill node in discovery canvas: expand its connections
- Expanded connections appear as smaller satellite nodes around the skill
- Edge types distinguished:
  - extends: solid blue, arrow pointing to parent
  - requires: solid red, arrow pointing to dependency
  - enhances: dotted teal, arrow pointing to enhanced skill
  - conflicts: dashed red, X marker
- Double-click again to collapse
- Only one skill expanded at a time (expanding new collapses previous)
- Right panel updates to show expanded skill's full metadata

### Non-Functional
- Expansion animates: nodes fade in from skill position (300ms)
- Collapse animates: nodes fade out toward skill position (200ms)

## Architecture

```
[COLLAPSED] ──(dblclick skill)──▸ [EXPANDED]
    │                                │
    │                            (dblclick same)
    │                                ▼
    └────────────────────────▸ [COLLAPSED]

EXPANDED adds satellite nodes at fixed offsets around the skill:
    [extends-parent]
         ↑
  [requires] ← [SKILL] → [enhances-target]
         ↓
    [conflicts]
```

## Related Code Files
### Modify (EXCLUSIVE)
- `app/canvas/discovery/_components/DiscoveryCanvas.tsx` -- Expansion state + satellite positioning [OWNED]
- `app/canvas/discovery/page.tsx` -- Pass expanded skill to right panel [OWNED]

### Read-Only
- `lib/types/entities.ts` -- SkillConnections type
- `lib/services/SkillChainResolver.ts` -- Skill lookup by name

## Implementation Steps

1. Add expansion state to `DiscoveryCanvas`:
   ```typescript
   const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
   ```

2. On skill double-click:
   - If same skill: collapse (set null)
   - If different: collapse previous, expand new
   - Look up skill's `connections` from skill data

3. Compute satellite nodes:
   - For each connection type, offset from skill position:
     - extends: y - 80px (above)
     - requires: x - 120px (left)
     - enhances: x + 120px (right)
     - conflicts: y + 80px (below)
   - Create temporary RFNodes with type 'skill' and special styling
   - Mark as `data.isSatellite: true` for SkillNode to render smaller

4. Create satellite edges:
   - From expanded skill to each satellite with connection-type styling

5. Merge satellites into displayNodes/displayEdges in useMemo

6. SkillNode: if `data.isSatellite`, render at 80% scale with connection-type border color

## Todo List
- [ ] Add expansion state management
- [ ] Compute satellite positions relative to expanded skill
- [ ] Create satellite nodes and edges
- [ ] Update SkillNode for satellite rendering
- [ ] Add collapse-on-second-click behavior
- [ ] Add fade-in/fade-out animation

## Success Criteria
- Double-clicking `ios-a11y` shows `a11y` (extends parent) above it
- Satellites have correct edge types and colors
- Double-clicking again collapses
- Only one skill expanded at a time

## Risk Assessment
**Risks**: Satellite nodes may overlap with existing ring nodes.
**Mitigation**: Check for overlap and shift satellites away from existing nodes. Use smaller node size for satellites.

## Security Considerations
None.

## Next Steps
After completion:
1. Feature complete -- test with all agents
2. Consider adding export/screenshot capability
