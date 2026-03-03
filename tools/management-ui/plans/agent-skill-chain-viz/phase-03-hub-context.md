# Phase 03: Hub Context Visualization

## Context Links
- Parent plan: [plan.md](./plan.md)
- Phase 02: [phase-02-focus-chain.md](./phase-02-focus-chain.md)
- `packages/core/skills/hub-context/SKILL.md` — hub context skill definition

## Overview
**Date**: 2026-03-03
**Priority**: P2
**Description**: Render hub-context as a special node showing the routing/dispatch behavior. When focusing the orchestrator, visualize the context-sensing + intent routing protocol.
**Implementation Status**: Pending

## Key Insights

1. `hub-context` is a core skill on `epost-orchestrator` only
2. It functions as a **router** -- senses git state, detects platform, classifies intent, dispatches to agents
3. Visually it should be distinct from regular skills -- more like a "gateway" or "dispatch" node
4. The routing targets are other agents (intent -> agent mapping from CLAUDE.md)
5. This enriches the orchestrator focus view: `orchestrator -> hub-context -> [target agents]`

## Requirements
### Functional
- Hub-context node renders with distinct "router" visual (different shape/icon)
- When focused, shows routing connections to target agents
- Routing edges annotated with intent labels (Build->implementer, Fix->debugger, etc.)
- Platform detection signals shown as metadata on hub-context node

### Non-Functional
- Only activates when orchestrator is focused or hub-context is selected
- Clean deactivation when focus exits

## Architecture

```
Focus: epost-orchestrator
  ├── core (static)
  ├── skill-discovery (static)
  └── hub-context (static, SPECIAL RENDER)
        ├── ──[build]──▸ epost-implementer
        ├── ──[fix]──▸ epost-debugger
        ├── ──[plan]──▸ epost-architect
        ├── ──[test]──▸ epost-tester
        ├── ──[review]──▸ epost-reviewer
        ├── ──[debug]──▸ epost-debugger
        └── ──[docs]──▸ epost-documenter
```

## Related Code Files
### Modify (EXCLUSIVE)
- `app/canvas/_components/nodes/SkillNode.tsx` — Conditional rendering for hub-context [OWNED]
- `lib/services/GraphBuilder.ts` — Add hub-context routing edges [OWNED]

### Create (EXCLUSIVE)
- `app/canvas/_components/nodes/HubContextOverlay.tsx` — Routing visualization overlay [OWNED]

### Read-Only
- `lib/types/graph.ts` — edge types
- `lib/layout/dagre.ts` — edge styles

## Implementation Steps

1. **Define routing map** as static data in GraphBuilder:
   ```typescript
   const HUB_ROUTING_MAP: Record<string, string> = {
     'build': 'epost-implementer',
     'fix': 'epost-debugger',
     'plan': 'epost-architect',
     'test': 'epost-tester',
     'review': 'epost-reviewer',
     'debug': 'epost-debugger',
     'docs': 'epost-documenter',
     'git': 'epost-git-manager',
     'research': 'epost-researcher',
   };
   ```

2. **Create hub routing edges** in GraphBuilder:
   - Type: `'hub-routing'` (new EdgeType)
   - Source: `skill:hub-context`
   - Target: `agent:{targetAgent}`
   - Metadata: `{ intent: 'build' | 'fix' | ... }`
   - Only created, NOT shown by default -- only visible in focus mode

3. **Update SkillNode** for hub-context:
   - Detect `data.name === 'hub-context'`
   - Render with different icon/border (e.g., orange diamond border, router icon)
   - Show "Router" badge instead of tier badge

4. **Create HubContextOverlay**:
   - Shown when hub-context is in focus chain
   - Renders intent labels on routing edges
   - Minimap-style showing the dispatch flow

5. **Add edge styles** for `hub-routing`:
   ```typescript
   'hub-routing': {
     stroke: '#f97316',  // orange
     strokeDasharray: '6 3',
     opacity: 0,  // hidden by default, shown in focus mode
   },
   ```

6. **Focus mode integration**:
   - When focused on orchestrator, traverse through hub-context to show routing targets at depth-2
   - Routing edges rendered with intent labels

## Todo List
- [ ] Add 'hub-routing' EdgeType
- [ ] Add HUB_ROUTING_MAP to GraphBuilder
- [ ] Create hub routing edges in graph build
- [ ] Special SkillNode rendering for hub-context
- [ ] Create HubContextOverlay component
- [ ] Focus mode shows routing edges with intent labels
- [ ] Edge style config for hub-routing

## Success Criteria
- Focusing orchestrator shows hub-context with routing lines to target agents
- Each routing line labeled with intent (build, fix, plan, etc.)
- Hub-context node visually distinct from regular skills
- Non-focus mode: routing edges hidden

## Risk Assessment
**Risks**: Hub routing targets are hardcoded -- if routing map changes in CLAUDE.md, visualization becomes stale
**Mitigation**: Extract routing map from hub-context SKILL.md at load time if possible, or note staleness risk in UI

## Security Considerations
None — visualization only.

## Next Steps
After all phases: manual QA pass, then consider adding routing map extraction from SKILL.md content.
