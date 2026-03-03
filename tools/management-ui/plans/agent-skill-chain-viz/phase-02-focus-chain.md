# Phase 02: Agent Focus Chain Rendering

## Context Links
- Parent plan: [plan.md](./plan.md)
- Phase 01: [phase-01-data-enrichment.md](./phase-01-data-enrichment.md)
- `app/canvas/_components/FlowCanvas.tsx` — focus mode
- `app/canvas/_components/nodes/SkillNode.tsx` — skill rendering

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Update focus mode to show differentiated skill chains per agent. Static skills rendered prominently, dynamic skills shown as expandable groups by platform, extension chains visible on click.
**Implementation Status**: Pending

## Key Insights

1. Current focus mode (`focus.ts`) does depth-1 only -- need depth-2 to show extension chains (agent -> skill -> extended-skill)
2. Dynamic candidate edges are very faint by default (opacity 0.25) -- in agent focus mode, they should become visible and grouped
3. Need visual grouping by platform: when focusing `epost-a11y-specialist`, show `a11y` (core) then grouped `ios-a11y`, `web-a11y`, `android-a11y` (extensions)
4. Hub context is a special skill -- handle in Phase 03

## Requirements
### Functional
- Focus mode on agent shows 2 tiers: static skills (solid, prominent) and dynamic candidates (dashed, dimmer)
- Skill extension chains: when a static skill has extensions, show them as depth-2 connections
- Platform grouping: dynamic skills grouped by platform with subtle visual separator
- Click a skill in focus mode to "drill into" its extension chain
- Legend overlay explaining edge styles

### Non-Functional
- No layout jank when expanding dynamic skills
- Transition animations for expanding/collapsing

## Architecture

```
Focus Mode (updated):
  Agent node [focused]
    ├── Static skills (solid edges, full opacity)
    │   ├── core ─── (extends) ─── core/*
    │   ├── skill-discovery
    │   └── debugging ─── (extends) ─── ios-debugging (if exists)
    │
    └── Dynamic candidates (dashed edges, 0.5 opacity)
        ├── [ios] ios-development, ios-ui-lib, ios-a11y
        ├── [web] web-frontend, web-nextjs, web-testing
        └── [android] android-development, android-ui-lib
```

## Related Code Files
### Modify (EXCLUSIVE)
- `lib/layout/focus.ts` — Extend to depth-2 for extension chains [OWNED]
- `app/canvas/_components/FlowCanvas.tsx` — Render dynamic edges in focus mode [OWNED]
- `app/canvas/_components/nodes/SkillNode.tsx` — Show platform badge + extension indicator [OWNED]
- `app/canvas/_components/nodes/AgentNode.tsx` — Show skill count summary [OWNED]

### Create (EXCLUSIVE)
- `app/canvas/_components/ChainLegend.tsx` — Legend overlay for edge styles [OWNED]

### Read-Only
- `lib/types/graph.ts` — edge types and metadata
- `lib/layout/dagre.ts` — edge styles

## Implementation Steps

1. **Extend focus depth** in `focus.ts`:
   ```typescript
   export function getConnectedNodeIds(
     focusedNodeId: string,
     edges: RFEdge[],
     depth: number = 1  // default 1, pass 2 for agent focus
   ): Set<string>
   ```
   - For agent focus: depth 2 to include skill extensions
   - Only follow `skill-extends` edges for depth-2 hop

2. **Update FlowCanvas** focus state computation:
   - When focused node is an agent, use depth=2
   - Show `dynamic-skill-candidate` edges at boosted opacity (0.5) in focus mode
   - Group these edges visually -- add a subtle "platform label" node or annotation

3. **Enhance SkillNode** rendering:
   - Add platform badge (e.g., `[ios]`, `[web]`) on dynamic skill nodes
   - Show "extends: {base}" subtitle when skill is an extension
   - Different left border treatment: extensions get a gradient or lighter version of parent color

4. **Enhance AgentNode** rendering:
   - Show skill count: `3 core + 12 dynamic` as subtitle
   - On hover, show a tooltip summarizing skill categories

5. **Create ChainLegend.tsx**:
   - Fixed overlay in bottom-left of canvas (opposite to DesignPanel)
   - Shows only when in focus mode on an agent
   - Legend items:
     - Solid green line = core (always loaded)
     - Dashed amber line = discoverable (lazy loaded)
     - Blue line = extends (skill chain)
     - Diamond icon = has connections

6. **Edge differentiation in displayEdges**:
   ```typescript
   // In focus mode on agent:
   // - static skill-dependency: opacity 1, solid, green
   // - dynamic-skill-candidate: opacity 0.5, dashed, amber
   // - skill-extends: opacity 0.7, solid, blue (chain connector)
   ```

## Todo List
- [ ] Update getConnectedNodeIds to support depth parameter
- [ ] Agent focus uses depth-2 traversal (only via skill-extends edges)
- [ ] Show dynamic-skill-candidate edges in agent focus mode
- [ ] Platform badge on SkillNode for dynamic skills
- [ ] Extension subtitle on SkillNode
- [ ] Skill count summary on AgentNode
- [ ] Create ChainLegend component
- [ ] Test with epost-muji (9 skills), epost-a11y-specialist (2 + extensions)

## Success Criteria
- Focusing epost-orchestrator shows `core`, `skill-discovery`, `hub-context` as static + dynamic candidates
- Focusing epost-muji shows 9 core skills with no dynamic candidates
- Focusing epost-a11y-specialist shows `core`, `a11y` as static, then `ios-a11y`, `web-a11y`, `android-a11y` as extensions
- Legend visible and accurate
- Esc exits focus mode cleanly

## Risk Assessment
**Risks**: Depth-2 traversal on highly connected agents could pull in too many nodes (cluttered view)
**Mitigation**: Only follow `skill-extends` and `skill-requires` edges for depth-2. Cap at 30 visible nodes -- show "+N more" if exceeded.

## Security Considerations
None — UI-only changes.

## Next Steps
After completion: Phase 03 adds hub context visualization for orchestrator.
