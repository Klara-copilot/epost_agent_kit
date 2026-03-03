# Phase 02: Discovery Canvas Page

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: [Phase 01](./phase-01-radial-layout.md)
- Related: `app/canvas/page.tsx`, `app/canvas/_components/FlowCanvas.tsx`

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: New page at `/canvas/discovery` that renders the radial skill chain for a selected agent with agent selector, legend, and discovery protocol panel.
**Implementation Status**: Pending

## Key Insights
- Can reuse existing `SkillNode`, `AgentNode` components with minor extensions
- Need new annotation node type for platform sector labels and ring labels
- Right panel repurposed to show "Discovery Protocol" steps -- which step loaded which skill
- Agent selector should be a dropdown in the header, not in the sidebar
- Page fetches same `/api/data` endpoint as existing canvas

## Requirements
### Functional
- Route: `app/canvas/discovery/page.tsx`
- Agent selector dropdown in header -- defaults to first agent or from URL param
- Canvas renders radial layout from Phase 01
- Ring labels: "Declared", "Affinity", "Platform", "Enhancers" at each ring
- Legend overlay (bottom-left) matching existing ChainLegend style
- Right panel: "Discovery Protocol" showing 4 layers as expandable sections
  - Each layer lists skills with how they were discovered
  - Platform layer shows platform grouping
- Header link back to main canvas

### Non-Functional
- Page loads in <500ms (data fetch + layout computation)
- Responsive zoom -- React Flow handles this

## Architecture

```
/canvas/discovery
├── Header: Agent Selector dropdown + nav
├── Center: ReactFlowProvider + DiscoveryCanvas
│   ├── AgentNode (center)
│   ├── SkillNode[] (rings)
│   ├── AnnotationNode[] (ring labels, sector labels)
│   └── Legend overlay
└── Right Panel: DiscoveryProtocolPanel
    ├── Step 1: Declared Skills
    ├── Step 2: Affinity Match
    ├── Step 3: Platform Detection
    └── Step 4: Enhancer Discovery
```

## Related Code Files
### Create (EXCLUSIVE)
- `app/canvas/discovery/page.tsx` -- Main page component [OWNED]
- `app/canvas/discovery/_components/DiscoveryCanvas.tsx` -- Canvas wrapper [OWNED]
- `app/canvas/discovery/_components/DiscoveryProtocolPanel.tsx` -- Right panel [OWNED]
- `app/canvas/discovery/_components/DiscoveryLegend.tsx` -- Legend overlay [OWNED]
- `app/canvas/_components/nodes/AnnotationNode.tsx` -- Ring/sector label node [OWNED]

### Modify (EXCLUSIVE)
- `app/canvas/_components/nodes/index.ts` -- Export AnnotationNode [OWNED]

### Read-Only
- `app/canvas/page.tsx` -- Pattern reference for page structure
- `app/canvas/_components/FlowCanvas.tsx` -- Pattern reference for RF setup
- `app/canvas/_components/nodes/SkillNode.tsx` -- Reuse directly
- `app/canvas/_components/nodes/AgentNode.tsx` -- Reuse directly
- `lib/services/SkillChainResolver.ts` -- resolveSkillChain()
- `lib/layout/radial.ts` -- Phase 01 output

## Implementation Steps

1. Create `AnnotationNode.tsx` -- simple text label node:
   ```typescript
   // No handles, transparent background, positioned by layout
   // Props: label string, color, fontSize
   // Used for ring labels ("Declared", "Platform: iOS") and sector dividers
   ```

2. Register in `nodes/index.ts`:
   ```typescript
   export { default as AnnotationNode } from './AnnotationNode';
   ```

3. Create `DiscoveryCanvas.tsx`:
   - Accept `chain: SkillChain`, `allSkills: Skill[]`, agent data
   - Call `radialLayout(chain, allSkills)` in useMemo
   - Register nodeTypes: `{ agent: AgentNode, skill: SkillNode, annotation: AnnotationNode }`
   - Render ReactFlow with nodes/edges, fitView centered
   - On skill node click: select it, show connections in right panel
   - On skill node double-click: expand its own sub-chain (Phase 04)

4. Create `DiscoveryProtocolPanel.tsx`:
   - 4 collapsible sections matching the 4 layers
   - Each section:
     - Header with layer name, color dot, count
     - List of skills with discovery reason
     - Platform section has sub-groups per platform
   - "How it works" description at top explaining skill-discovery protocol

5. Create `DiscoveryLegend.tsx`:
   - Adapted from existing `ChainLegend` component
   - Add ring distance legend
   - Add "Declared = always loaded" / "Affinity = model-invoked" explanations

6. Create `page.tsx`:
   - Fetch `/api/data` on mount (same pattern as canvas/page.tsx)
   - Agent selector dropdown: `<select>` with all agents
   - URL param sync: `?agent=epost-architect` updates selection
   - Call `resolveSkillChain(selectedAgent, data.skills)` in useMemo
   - Render 3-column layout: empty left (or mini agent list) | canvas | protocol panel

## Todo List
- [ ] Create AnnotationNode component
- [ ] Create DiscoveryCanvas component with radial layout
- [ ] Create DiscoveryProtocolPanel with 4-layer breakdown
- [ ] Create DiscoveryLegend overlay
- [ ] Create page.tsx with agent selector and data loading
- [ ] Add navigation link from main canvas header
- [ ] Test with epost-architect and epost-orchestrator agents

## Success Criteria
- Navigating to `/canvas/discovery` renders agent selector and radial graph
- Changing agent in dropdown updates the entire visualization
- Right panel shows clear 4-step discovery protocol per agent
- Ring labels visible and correctly positioned
- Nodes are clickable and show details

## Risk Assessment
**Risks**: AnnotationNode may interfere with React Flow edge routing.
**Mitigation**: Set `selectable: false, draggable: false, connectable: false` on annotation nodes. Use `zIndex: -1`.

## Security Considerations
None -- read-only visualization of local data.

## Next Steps
After completion:
1. Phase 03 adds platform selector interaction
2. Add link from main canvas to discovery view
