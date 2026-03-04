# Phase 03: RAG Integration

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: Phase 02 (routing)
- Ref: `web-rag/SKILL.md`, `ios-rag/SKILL.md`

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Wire scout to use RAG MCP tools for semantic search
**Implementation Status**: Pending

## Key Insights
- web-rag and ios-rag are standalone skills with MCP query/status tools
- Scout as Explore subagent can access MCP tools directly
- Key: scout needs instructions on WHEN and HOW to call RAG query tool
- Both RAGs share same API shape: query(query, top_k, filters)
- Scout should check RAG status before querying (fail fast)

## Requirements
### Functional
- When platform=web and query is semantic: call web-rag `query` tool
- When platform=ios and query is semantic: call ios-rag `query` tool
- Check RAG `status` before first query in a session
- Pass appropriate filters (component, topic, file_type) extracted from query
- Combine RAG results with Grep results when both available
### Non-Functional
- Single RAG query should return in <3s
- Max 2 RAG calls per scout invocation (avoid over-querying)

## Architecture

Scout SKILL.md will instruct the Explore subagent:

```
1. Detect platform from query
2. If semantic query + platform has RAG:
   a. Check RAG status (cache for session)
   b. Extract filters from query keywords
   c. Call RAG query tool (top_k=5)
   d. Also run Grep/Glob in parallel for complementary results
3. If RAG offline or no platform RAG:
   a. Fall back to Grep/Glob only
4. Merge and deduplicate results
```

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/skills/scout/SKILL.md` -- add RAG integration instructions [OWNED]
### Read-Only
- `packages/core/skills/web-rag/SKILL.md` -- MCP tool API reference
- `packages/core/skills/ios-rag/SKILL.md` -- MCP tool API reference

## Implementation Steps
1. Add "RAG Integration" section to scout SKILL.md with:
   - When to use RAG vs Grep (restate from Phase 02 decision tree)
   - MCP tool call patterns:
     ```
     Web semantic search:
       Tool: web-rag query
       Params: { query: "{user query}", top_k: 5, filters: { topic: "ui" } }

     iOS semantic search:
       Tool: ios-rag query
       Params: { query: "{user query}", top_k: 5, filters: { project: "..." } }
     ```
   - Filter extraction heuristics:
     - "button" -> component: "Button"
     - "color", "token", "typography" -> topic: "design-system" or "theme"
     - ".swift" -> file_type: "swift"
   - Result merging rules:
     - RAG results first (higher relevance for semantic)
     - Grep results appended if unique files
     - Deduplicate by file path

2. Add "Offline Handling" section:
   ```
   Before first RAG call:
     Check status endpoint
     If offline: warn user, proceed with Grep only
     If degraded: proceed but note in output
   ```

3. Add future android-rag placeholder:
   ```
   ## Future: Android RAG
   When android-rag becomes available:
   - Port: TBD
   - Add to platform-to-RAG mapping
   - Same query/status API pattern
   ```

## Todo List
- [ ] Write RAG integration section with MCP tool call patterns
- [ ] Write filter extraction heuristics
- [ ] Write result merging rules
- [ ] Write offline handling section
- [ ] Add android-rag future placeholder

## Success Criteria
- `/scout web: button component` calls web-rag query tool
- `/scout ios: navigation` calls ios-rag query tool
- RAG offline -> graceful fallback with user warning
- Results combine RAG + Grep without duplicates

## Risk Assessment
**Risks**: RAG servers may not be running during most sessions
**Mitigation**: Grep is always the reliable fallback; RAG is additive value

## Security Considerations
RAG queries are local (localhost only). No data leaves the machine.

## Next Steps
After completion: Phase 04 (Result Categorization)
