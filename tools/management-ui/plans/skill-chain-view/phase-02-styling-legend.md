# Phase 02: Chain View Edge Styling + Legend

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: Phase 01 (global chain resolution)
- `lib/layout/dagre.ts` — EDGE_STYLES config
- `app/canvas/_components/FlowCanvas.tsx` — edge rendering

## Overview
**Date**: 2026-03-03
**Priority**: P2
**Description**: Color-code edges by layer type in chain view and add a floating legend overlay explaining the visual encoding.
**Implementation Status**: Pending

## Key Insights
- Current edges use `skill-dependency` style (teal, opacity 0.5) for all agent->skill edges
- Affinity edges already have distinct style (amber dashed) when injected
- Need to restyle existing `skill-dependency` edges in chain view based on which layer the target skill belongs to
- Legend should be a small floating panel (bottom-left, above Controls)

## Requirements
### Functional
- In chain view, `skill-dependency` edges restyled based on target skill's layer:
  - Declared: solid #10b981, opacity 0.7
  - Affinity: dashed #f59e0b, opacity 0.6 (already handled by injected edges)
  - Platform: dashed #f59e0b, opacity 0.4
  - Enhancer: dotted #4ec9b0, opacity 0.4
- Floating legend panel in bottom-left corner when chain view active
- Legend shows 4 layer types with color swatches + labels

### Non-Functional
- Legend panel uses same dark theme as rest of canvas
- Legend auto-hides when chain view disabled

## Architecture

```
FlowCanvas
  ├── displayEdges: in chain view, override style of skill-dependency edges based on globalChain.layerMap
  └── {chainViewActive && <ChainLegend />}
```

## Related Code Files
### Create (EXCLUSIVE)
- `app/canvas/_components/ChainLegend.tsx` — floating legend component [OWNED]

### Modify (EXCLUSIVE)
- `app/canvas/_components/FlowCanvas.tsx` — edge restyling logic in chain view, render legend [OWNED]

### Read-Only
- `lib/services/SkillChainResolver.ts` — layer types reference

## Implementation Steps

### 1. Create ChainLegend.tsx

```typescript
const LEGEND_ITEMS = [
  { label: 'Declared', color: '#10b981', style: 'solid' },
  { label: 'Discoverable', color: '#f59e0b', style: 'dashed' },
  { label: 'Platform', color: '#f59e0b', style: 'dashed', opacity: 0.6 },
  { label: 'Enhancer', color: '#4ec9b0', style: 'dotted' },
];
```

Small floating div positioned `absolute bottom-14 left-4` (above ReactFlow Controls). Each row: short color line + label text.

### 2. Update edge styling in FlowCanvas displayEdges

In chain view, when processing `skill-dependency` edges:
- Look up target skill name in `globalChain.layerMap`
- Override stroke color, dasharray, opacity based on layer
- Map:
  - `declared` -> solid #10b981, opacity 0.7
  - `affinity` -> dashed #f59e0b, opacity 0.6
  - `platform` -> dashed #f59e0b, opacity 0.4
  - `enhancer` -> dotted #4ec9b0, opacity 0.4

### 3. Render legend conditionally

In FlowCanvas return: `{chainViewActive && <ChainLegend />}` inside the ReactFlow wrapper (so it overlays the canvas).

## Todo List
- [ ] Create ChainLegend.tsx component
- [ ] Add layer-based edge restyling logic in FlowCanvas displayEdges
- [ ] Render ChainLegend when chainViewActive
- [ ] Verify legend positioning doesn't overlap Controls

## Success Criteria
- Edges visually distinct by layer type in chain view
- Legend visible and correctly describes encoding
- Legend hidden in full view mode

## Risk Assessment
**Risks**: Edge restyling adds complexity to already-dense displayEdges memo
**Mitigation**: Keep logic in a helper function, memoize globalChain.layerMap lookup

## Security Considerations
None.

## Next Steps
Feature complete after this phase. Consider future enhancement: click-to-expand extension chains within chain view.
