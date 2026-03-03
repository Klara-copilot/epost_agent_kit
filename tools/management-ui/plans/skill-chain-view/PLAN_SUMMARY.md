# Plan Summary: Skill Chain View Mode

## What Changes

Replace the "Skills View" toggle with "Skill Chain" — when activated, visualize the full skill loading chain (declared, affinity, platform, enhancer layers) for ALL agents simultaneously on the canvas.

## Files Modified

| File | Action | Description |
|------|--------|-------------|
| `lib/services/SkillChainResolver.ts` | Modify | Add `resolveAllSkillChains()` + `GlobalSkillChain` type |
| `app/canvas/page.tsx` | Modify | Rename viewMode `'skills'`->`'chain'`, add globalChain memo, update button label |
| `app/canvas/_components/FlowCanvas.tsx` | Modify | Accept chainViewActive prop, inject all-agent affinity edges, pass global layerMap to FocusContext |
| `app/canvas/_components/nodes/SkillNode.tsx` | Modify | Remove `focusedAgentId` gate on layer badge display |
| `app/canvas/_components/ChainLegend.tsx` | Create | Floating legend showing layer color encoding |

## 2 Phases, ~2h Total

**Phase 01 (1.5h)**: Global chain resolution, view mode rename, wire layerMap + affinity edges for all agents
**Phase 02 (30min)**: Layer-based edge color styling, floating legend component

## Key Design Decisions

1. **Shared skills**: When a skill appears in multiple agents' chains at different layers, highest-priority layer wins (declared > affinity > platform > enhancer)
2. **No new dependencies**: Pure computation + React components
3. **Backward compatible**: Existing focus mode (double-click agent) still works within chain view
4. **Per-agent detail**: Click agent in chain view -> right panel shows that agent's specific chain via existing `SkillChainSummary`
