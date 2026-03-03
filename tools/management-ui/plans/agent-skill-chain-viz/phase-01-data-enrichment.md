# Phase 01: Data Model & Edge Enrichment

## Context Links
- Parent plan: [plan.md](./plan.md)
- `lib/services/GraphBuilder.ts` — edge construction
- `lib/types/graph.ts` — edge/node types
- `lib/services/DataLoader.ts` — skill-index merge

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Enrich graph data model to distinguish static vs dynamic skill assignments and infer discoverable skill candidates per agent.
**Implementation Status**: Pending

## Key Insights

1. Agent `skills:[]` frontmatter = **static** (always loaded). These are the current `skill-dependency` edges.
2. **Dynamic** skills = skills from `skill-index.json` where `agent-affinity` includes the agent name, OR where `platforms` overlap with agent's package platforms. These are NOT currently edges in the graph.
3. `extends` field in skill-index is currently empty for all skills. Platform extension is implicit via naming convention (`a11y` -> `ios-a11y`, `web-a11y`). We should infer `extends` from name prefixes: if skill B's name starts with `{platform}-{skillA.name}`, treat B as extending A.
4. Tier info already merged from skill-index into Skill entities.

## Requirements
### Functional
- Add `loadType: 'static' | 'dynamic'` metadata to `skill-dependency` edges
- Create new `dynamic-skill-candidate` edges from agent to discoverable skills based on `agent-affinity` + platform overlap
- Infer `extends` relationships from naming convention when `extends` array is empty
- Group dynamic skills by platform in edge metadata

### Non-Functional
- No breaking changes to existing edge rendering
- Edge enrichment runs in GraphBuilder, not in components

## Architecture

```
DataLoader (existing)
  └─ mergeSkillIndex() → populates tier, connections
  └─ NEW: inferExtends() → populate extends from naming convention

GraphBuilder (modified)
  └─ agent→skill edges: add metadata.loadType = 'static'
  └─ NEW: for each agent, find discoverable skill candidates
       → agent-affinity match OR platform overlap
       → create edges with type 'dynamic-skill-candidate'
       → metadata: { loadType: 'dynamic', platform: 'ios'|'web'|... }
```

## Related Code Files
### Modify (EXCLUSIVE)
- `lib/types/graph.ts:9` — Add `'dynamic-skill-candidate'` to EdgeType union [OWNED]
- `lib/services/GraphBuilder.ts:125-166` — Enrich skill-dependency edges with loadType [OWNED]
- `lib/services/DataLoader.ts:153-189` — Add inferExtends() method [OWNED]
- `lib/layout/dagre.ts:27-69` — Add edge style for new edge type [OWNED]

### Read-Only
- `lib/types/entities.ts` — Skill, Agent types
- `packages/core/skills/skill-index.json` — skill data

## Implementation Steps

1. **Add edge type** to `graph.ts`:
   ```typescript
   export type EdgeType = '...' | 'dynamic-skill-candidate';
   ```

2. **Add edge metadata interface** to `graph.ts`:
   ```typescript
   export interface SkillEdgeMetadata {
     loadType: 'static' | 'dynamic';
     platform?: string;  // for dynamic: ios, web, android, backend
   }
   ```

3. **Enrich static edges** in `GraphBuilder.build()`: Add `metadata: { loadType: 'static' }` to all existing `skill-dependency` edges.

4. **Build dynamic candidate edges** in `GraphBuilder.build()`:
   - For each agent, get its package's platforms
   - For each discoverable skill in skill-index:
     - If `agent-affinity` includes agent name → candidate
     - If skill `platforms` overlaps with agent's package platforms → candidate
     - Skip if already a static dependency
   - Create edge with type `dynamic-skill-candidate`, metadata `{ loadType: 'dynamic', platform }`

5. **Infer extends** in `DataLoader.mergeSkillIndex()`:
   - For each skill with empty `extends`:
     - Check if removing platform prefix yields another skill name
     - e.g., `ios-a11y` -> remove `ios-` -> `a11y` exists? -> set extends = [`a11y`]
     - Patterns: `{platform}-{base}`, `{base}-{platform}`

6. **Add edge style** in `dagre.ts`:
   ```typescript
   'dynamic-skill-candidate': {
     stroke: '#f59e0b',
     strokeDasharray: '4 2',
     opacity: 0.25, // very faint by default
   },
   ```

## Todo List
- [ ] Add EdgeType + SkillEdgeMetadata to graph.ts
- [ ] Enrich existing skill-dependency edges with loadType metadata
- [ ] Build dynamic candidate edges from agent-affinity + platform match
- [ ] Infer extends from naming convention in DataLoader
- [ ] Add edge style config for dynamic-skill-candidate
- [ ] Verify graph stats include new edge type

## Success Criteria
- API response includes both static and dynamic skill edges
- Each skill-dependency edge has `metadata.loadType`
- Dynamic candidate edges only appear for discoverable-tier skills
- Extensions inferred correctly (ios-a11y extends a11y, web-a11y extends a11y, etc.)

## Risk Assessment
**Risks**: Platform inference from naming convention may produce false positives (e.g., `web-testing` is not an extension of `testing`)
**Mitigation**: Only infer extends when the base skill actually exists in the index. Require exact match after prefix removal.

## Security Considerations
None — read-only data transformation.

## Next Steps
After completion: Phase 02 uses enriched edges to render differentiated focus chains.
