# Phase 01: Agent-Centric View

## Context Links
- Parent plan: [plan.md](./plan.md)
- Current discovery mode: `app/canvas/page.tsx:241-395`
- Skill chain resolver: `lib/services/SkillChainResolver.ts`

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Replace discovery dropdown with agent tree in left panel. Clicking agent filters canvas to show that agent's full skill chain. Reuses existing `resolveSkillChain` and `filteredGraph` logic.
**Implementation Status**: Pending

## Key Insights
- Discovery mode already implements the filtering logic (lines 241-395 of canvas/page.tsx) — just needs tree-based selection instead of `<select>`
- `SkillChainResolver.resolveSkillChain()` already computes declared/affinity/platform/enhancer layers
- DiscoveryProtocolPanel (right panel) already shows the chain breakdown — reuse it
- Platform filter buttons already work — keep them

## Requirements
### Functional
- Left panel shows all agents as a clickable tree/list (grouped by package)
- Clicking agent = canvas filters to that agent + skill chain
- Right panel continues showing DiscoveryProtocolPanel with chain breakdown
- Platform filter buttons stay in right panel (not header bar)
- No dropdown anywhere
- Selected agent highlighted in tree

### Non-Functional
- Tree renders instantly (13 agents — no virtualization needed)
- Smooth transition when switching between agents

## Architecture

```
[Agent Tree (left)]  →  [Canvas (center)]  →  [Chain Panel (right)]
  core/                   agent node            Step 1: Declared
    epost-architect       + skill nodes          Step 2: Affinity
    epost-implementer     (filtered)             Step 3: Platform
  platform-web/                                  Step 4: Enhancers
    epost-web-developer
  ...
```

State: `discoveryAgentId` (existing) drives both tree highlight and canvas filter.

## Related Code Files
### Modify (EXCLUSIVE)
- `app/canvas/page.tsx` — Replace discovery dropdown bar + CollectionSection approach with AgentTree component. Remove `<select>` at lines 508-545. Wire agent tree click to `setDiscoveryAgentId`.

### Create (EXCLUSIVE)
- `app/canvas/_components/AgentTree.tsx` — Agent tree grouped by packageName. Props: agents, selectedAgentId, onSelect.

### Read-Only
- `lib/services/SkillChainResolver.ts` — Existing chain resolver
- `lib/types/entities.ts` — Agent type
- `app/canvas/_components/FlowCanvas.tsx` — Canvas component

## Implementation Steps

1. **Create `AgentTree.tsx`**
   - Group agents by `packageName`
   - Render package headers (collapsible) with agent items underneath
   - Selected agent gets highlighted bg + accent border
   - Click handler calls `onSelect(agent.id)`
   - Show model badge (haiku/sonnet/opus) and skill count per agent
   - Style: matches existing sidebar panel aesthetic (dark bg, monospace IDs)

2. **Modify canvas/page.tsx — viewMode === 'discovery' branch**
   - Replace the discovery agent selector bar (lines 508-545 with `<select>`) with nothing — agent selection moves to left panel
   - When `viewMode === 'discovery'` (rename to `'agent'`), show `AgentTree` in left panel instead of CollectionSection
   - Keep existing `filteredGraph` logic for discovery mode (lines 241-395) as-is
   - Keep `DiscoveryProtocolPanel` in right panel as-is
   - Move platform filter into right panel DiscoveryProtocolPanel (already there)

3. **Update ViewModeToggle labels**
   - Rename "Discovery" to "Agent" in the header toggle
   - Update viewMode type: `'full' | 'chain' | 'agent' | 'skill'`

4. **Auto-select first agent when entering agent view** (existing behavior, just verify)

## Todo List
- [ ] Create AgentTree component with package grouping
- [ ] Replace dropdown with AgentTree in left panel
- [ ] Rename viewMode 'discovery' to 'agent'
- [ ] Verify auto-select and platform filter still work
- [ ] Test agent switching transitions

## Success Criteria
- Click any agent in left tree, canvas updates to show its skill chain
- No `<select>` dropdown anywhere
- Platform filter in right panel still toggles platform skill visibility
- Chain breakdown in right panel updates per selected agent

## Risk Assessment
**Risks**: Minimal — mostly moving existing UI from dropdown to tree
**Mitigation**: Existing state management (`discoveryAgentId`) stays the same

## Security Considerations
None — read-only UI, no auth involved

## Next Steps
After completion:
1. Proceed to Phase 02: Skill-Centric View
2. Agent view serves as pattern for skill view's left panel
