# Phase 01: Radial Layout Engine

## Context Links
- Parent plan: [plan.md](./plan.md)
- Related: `lib/layout/dagre.ts` (existing column layout), `lib/services/SkillChainResolver.ts`

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Create a radial/concentric layout engine that positions an agent at center with skills in concentric rings by layer.
**Implementation Status**: Pending

## Key Insights
- React Flow doesn't have built-in radial layout; must compute `{x, y}` positions manually
- `SkillChainResolver` already groups skills by layer -- layout function consumes this directly
- Existing dagre layout places all skills in one column; radial spreads them by layer distance
- Platform chains need grouping within Layer 2 ring -- use angular sectors per platform

## Requirements
### Functional
- Accept `SkillChain` and produce `RFNode[]` with positions
- Agent node at position (0, 0) -- center of the graph
- Layer 0 (declared) nodes on innermost ring (radius ~200px)
- Layer 1 (affinity) on second ring (~400px)
- Layer 2 (platform) on third ring (~600px), grouped by platform in angular sectors
- Layer 3 (enhancers) on outermost ring (~800px)
- Nodes within each ring evenly distributed by angle
- Return styled `RFEdge[]` matching layer colors

### Non-Functional
- Pure function, no side effects
- O(n) where n = total skills in chain
- Ring radii configurable

## Architecture

```
SkillChain ──▸ radialLayout() ──▸ { nodes: RFNode[], edges: RFEdge[] }

Ring structure:
         ┌── Layer 3: Enhancers (outermost) ──┐
         │   ┌── Layer 2: Platform ──────┐    │
         │   │   ┌── Layer 1: Affinity ──┐│   │
         │   │   │   ┌── L0: Declared ─┐ ││   │
         │   │   │   │    [AGENT]      │ ││   │
         │   │   │   └────────────────┘ ││   │
         │   │   └──────────────────────┘│   │
         │   └───── ios | android | web ─┘   │
         └───────────────────────────────────┘
```

Platform sectors within Layer 2:
- Divide 360 degrees into N sectors (one per platform with skills)
- Each sector gets proportional angular space based on skill count
- Sector label rendered as a text annotation

## Related Code Files
### Create (EXCLUSIVE)
- `lib/layout/radial.ts` -- Radial layout engine [OWNED]

### Read-Only
- `lib/services/SkillChainResolver.ts` -- SkillChain type, resolveSkillChain()
- `lib/layout/dagre.ts` -- Edge style constants to reuse
- `lib/types/graph.ts` -- GraphNode, Edge types

## Implementation Steps

1. Create `lib/layout/radial.ts` with constants:
   ```typescript
   const RING_RADII = [200, 400, 600, 800]; // L0-L3
   const NODE_WIDTH = 180;
   const NODE_HEIGHT = 52;
   ```

2. Implement `radialLayout(chain: SkillChain, allSkills: Skill[]): LayoutResult`:
   - Place agent node at (0, 0)
   - For Layer 0 (declared): distribute N nodes evenly around ring 0
     - angle = (i / N) * 2 * PI, x = r * cos(a), y = r * sin(a)
   - For Layer 1 (affinity): same pattern on ring 1
   - For Layer 2 (platform chains):
     - Compute angular sectors: each platform gets `(platformSkillCount / totalL2Count) * 2*PI` radians
     - Within each sector, distribute skills evenly
     - Add sector label annotation node (type: 'annotation')
   - For Layer 3 (enhancers): distribute on ring 3
     - Position near the skill they enhance (angle proximity)

3. Generate edges:
   - Agent -> declared skills: solid green (`#10b981`), strokeWidth 2
   - Agent -> affinity skills: dashed amber (`#f59e0b`, dasharray `6 4`), strokeWidth 1.5
   - Agent -> platform skills: dashed amber, strokeWidth 1
   - Enhancer -> enhanced skill: dotted teal (`#4ec9b0`, dasharray `3 3`)
   - Extends chains within platform: solid blue (`#60a5fa`)
   - Requires chains: solid red (`#ef4444`)

4. Handle `loadedVia` edges in platform chains:
   - If skill has `loadedVia: { type: 'extends', from: 'a11y' }`, draw edge from parent to child
   - These are intra-ring edges (within Layer 2)

## Todo List
- [ ] Create `lib/layout/radial.ts` with types and constants
- [ ] Implement ring position calculator
- [ ] Implement platform sector calculator
- [ ] Generate styled edges per layer
- [ ] Handle extends/requires intra-ring edges
- [ ] Export `radialLayout` function

## Success Criteria
- Given epost-architect's SkillChain, produces valid RFNode/RFEdge arrays
- All 4 layers positioned at correct radii
- Platform skills grouped by sector
- No node overlaps within a ring

## Risk Assessment
**Risks**: Node overlap in dense rings (orchestrator may have 20+ discoverable skills)
**Mitigation**: Dynamically increase ring radius when too many nodes. Add collision detection and angle adjustment.

## Security Considerations
None -- client-side visualization only.

## Next Steps
After completion:
1. Phase 02 builds the page component that renders this layout
2. Test with all 13 agents to verify no overlap edge cases
