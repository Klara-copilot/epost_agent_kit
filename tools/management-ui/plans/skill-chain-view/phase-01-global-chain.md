# Phase 01: Global Chain Resolution + View Mode

## Context Links
- Parent plan: [plan.md](./plan.md)
- `lib/services/SkillChainResolver.ts` — existing single-agent chain resolver
- `app/canvas/page.tsx` — view mode state, `filteredGraph`, `skillChain` memo

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Add `resolveAllSkillChains()` function, rename view mode to `'chain'`, wire global layer map into FocusContext so all skill nodes show layer badges in chain view.
**Implementation Status**: Pending

## Key Insights
- Current `resolveSkillChain()` handles one agent. For global view, iterate all agents, merge layer maps with priority: declared > affinity > platform > enhancer.
- `FocusContext.skillLayerMap` currently only populated when `focusedAgentId` is set. In chain view, populate it unconditionally.
- Affinity edges currently injected in `FlowCanvas` only for focused agent. In chain view, inject for all agents.

## Requirements
### Functional
- New function `resolveAllSkillChains(agents, skills)` returns merged `SkillChain` with global layer map
- View mode state changes: `'full' | 'skills'` becomes `'full' | 'chain'`
- Button label: "Skill Chain" (teal when active)
- In chain view: filter to agents+skills (like current skills view)
- In chain view: `skillLayerMap` populated globally (not gated by `focusedAgentId`)
- In chain view: affinity edges injected for all agents

### Non-Functional
- `useMemo` for chain resolution — depends on `data.agents` + `data.skills` (stable after load)
- No new dependencies

## Architecture

```
CanvasPage
  ├── viewMode: 'full' | 'chain'
  ├── globalChain = useMemo(() => resolveAllSkillChains(agents, skills), [data])
  ├── filteredGraph = chain view filters to agents+skills
  └── FlowCanvas
        ├── FocusContext.skillLayerMap = chain view ? globalChain.layerMap : (focused agent chain)
        └── displayEdges: inject affinity edges for ALL agents when chain view active
```

## Related Code Files
### Modify (EXCLUSIVE)
- `lib/services/SkillChainResolver.ts` — add `resolveAllSkillChains()` [OWNED]
- `app/canvas/page.tsx` — view mode rename, global chain memo, pass to FlowCanvas [OWNED]
- `app/canvas/_components/FlowCanvas.tsx` — accept `chainViewActive` prop, inject all-agent affinity edges [OWNED]

### Read-Only
- `lib/types/entities.ts` — Agent, Skill types
- `app/canvas/_components/FocusContext.tsx` — no changes needed, already supports `skillLayerMap`
- `app/canvas/_components/nodes/SkillNode.tsx` — already reads layer from FocusContext

## Implementation Steps

### 1. Add `resolveAllSkillChains()` to SkillChainResolver.ts

```typescript
export interface GlobalSkillChain {
  /** Merged layer map — if skill in multiple agents, highest priority layer wins */
  layerMap: Map<string, SkillLayer>;
  /** Per-agent chains for detail panel */
  perAgent: Map<string, SkillChain>;
  /** All affinity entries across agents (for edge injection) */
  allAffinityEdges: Array<{ agentId: string; skillName: string }>;
}

const LAYER_PRIORITY: Record<SkillLayer, number> = {
  declared: 0,
  affinity: 1,
  platform: 2,
  enhancer: 3,
};

export function resolveAllSkillChains(
  agents: Agent[],
  allSkills: Skill[],
): GlobalSkillChain {
  const layerMap = new Map<string, SkillLayer>();
  const perAgent = new Map<string, SkillChain>();
  const allAffinityEdges: Array<{ agentId: string; skillName: string }> = [];

  for (const agent of agents) {
    const chain = resolveSkillChain(agent, allSkills);
    perAgent.set(agent.id, chain);

    // Merge layer map — lower priority number wins
    for (const [skillName, layer] of chain.layerMap) {
      const existing = layerMap.get(skillName);
      if (!existing || LAYER_PRIORITY[layer] < LAYER_PRIORITY[existing]) {
        layerMap.set(skillName, layer);
      }
    }

    // Collect affinity edges
    for (const entry of chain.affinity) {
      allAffinityEdges.push({ agentId: agent.id, skillName: entry.skillName });
    }
  }

  return { layerMap, perAgent, allAffinityEdges };
}
```

### 2. Update view mode in `page.tsx`

- Rename `viewMode` type: `'full' | 'chain'`
- Rename button: `'Skill Chain'`
- Add `globalChain` memo:
```typescript
const globalChain = useMemo(() => {
  if (!data) return null;
  return resolveAllSkillChains(data.agents, data.skills);
}, [data]);
```

- Update `filteredGraph` to filter when `viewMode === 'chain'`
- Pass `chainViewActive={viewMode === 'chain'}` and `globalChain` to `FlowCanvas`
- Update right panel: when chain view active and no selected node, show aggregated summary
- When chain view active and agent selected, show per-agent chain from `globalChain.perAgent`

### 3. Update FlowCanvas props + edge injection

- New props: `chainViewActive: boolean`, `globalChain: GlobalSkillChain | null`
- In `focusContextValue` memo: when `chainViewActive && globalChain`, set `skillLayerMap` from `globalChain.layerMap` (even without `focusedAgentId`)
- In `displayEdges` memo: when `chainViewActive && globalChain`, inject affinity edges for ALL agents from `globalChain.allAffinityEdges`

### 4. Update SkillNode layer badge visibility

- Currently: `layerStyle` only shown when `focusedAgentId` set (via `layer = focusedAgentId && skillLayerMap ? ...`)
- Change: show layer badge when `skillLayerMap` has an entry, regardless of `focusedAgentId`
- Update condition: `const layer = skillLayerMap ? skillLayerMap.get(id) : null;`

## Todo List
- [ ] Add `resolveAllSkillChains()` + `GlobalSkillChain` type to SkillChainResolver.ts
- [ ] Rename viewMode from `'skills'` to `'chain'` in page.tsx
- [ ] Add globalChain useMemo in page.tsx
- [ ] Pass chainViewActive + globalChain to FlowCanvas
- [ ] Update FlowCanvas FocusContext to use globalChain.layerMap in chain view
- [ ] Inject all-agent affinity edges in FlowCanvas when chain view active
- [ ] Update SkillNode to show layer badge when skillLayerMap exists (remove focusedAgentId gate)
- [ ] Update right panel for chain view: aggregated summary or per-agent detail

## Success Criteria
- Chain view shows all skill nodes with layer badges
- Affinity edges visible for all agents
- Clicking agent in chain view shows per-agent chain detail
- Focus mode (double-click) still works within chain view

## Risk Assessment
**Risks**: Shared skills showing wrong layer when multiple agents claim different layers
**Mitigation**: Priority system (declared > affinity > platform > enhancer) ensures most important layer shown

## Security Considerations
None — client-side visualization only.

## Next Steps
After completion: Phase 02 adds edge color differentiation by layer and a visual legend.
