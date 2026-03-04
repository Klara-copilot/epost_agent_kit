# Phase 02: Smart Search Routing

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: Phase 01 (metadata)
- Ref: `web-rag/SKILL.md`, `ios-rag/SKILL.md`, `knowledge-retrieval/SKILL.md`

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Add decision tree for routing queries to best search backend
**Implementation Status**: Pending

## Key Insights
- knowledge-retrieval already defines a 5-level retrieval chain (docs -> RAG -> skills -> codebase -> external)
- web-rag has "When to Use" table differentiating RAG vs Grep vs Context7
- ios-rag has similar decision tree + enforce_scope parameter
- Scout should reuse these patterns, not reinvent them
- Platform detection already exists in skill-discovery and hub-context

## Requirements
### Functional
- Detect platform from query (explicit prefix `web:`, `ios:` or inferred keywords)
- Route to appropriate search backend:
  - RAG query when: semantic search, component discovery, pattern matching
  - Grep/Glob when: known filename, exact string, regex pattern
  - Context7 when: external library API docs
  - docs/ when: project decisions, conventions, architecture
- Fallback chain: RAG -> Grep -> report "not found"
- Handle RAG server offline gracefully
### Non-Functional
- Response time < 10s for typical queries
- No new dependencies -- use existing MCP tools

## Architecture

```
User query
  |
  v
[Platform Detection]
  |-- explicit: "web:", "ios:", "android:", "backend:"
  |-- inferred: .tsx/.swift/.kt keywords, module names
  |-- default: all platforms
  |
  v
[Query Classification]
  |-- semantic/conceptual -> RAG
  |-- exact pattern/filename -> Grep/Glob
  |-- external library -> Context7
  |-- project decision -> docs/index.json
  |
  v
[Search Execution] (parallel when possible)
  |-- RAG: web-rag (2636) or ios-rag (2637)
  |-- Grep: standard codebase search
  |-- Read: docs/index.json lookup
  |
  v
[Result Synthesis]
  |-- deduplicate
  |-- group by category
  |-- rank by relevance
```

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/skills/scout/SKILL.md` -- add search routing protocol [OWNED]
### Read-Only
- `packages/core/skills/web-rag/SKILL.md` -- reference decision tree
- `packages/core/skills/ios-rag/SKILL.md` -- reference decision tree
- `packages/core/skills/knowledge-retrieval/SKILL.md` -- retrieval chain

## Implementation Steps
1. Add "Search Routing Protocol" section to scout SKILL.md:
   - Platform detection rules (reuse skill-discovery signals)
   - Query classification heuristics table
   - Search backend selection decision tree
2. Add "Query Classification" table:

   | Query Pattern | Classification | Backend |
   |---------------|---------------|---------|
   | Known filename ("Button.tsx") | exact | Grep/Glob |
   | Component search ("button with loading") | semantic | RAG |
   | Pattern trace ("how auth works") | semantic | RAG + Grep |
   | External API ("React useEffect") | external | Context7 |
   | Decision/convention ("why we use X") | project | docs/ |
   | Token value ("primary color") | semantic | RAG |

3. Add fallback chain:
   ```
   RAG offline? -> Grep/Glob (warn user: "RAG unavailable, using text search")
   No results? -> Broaden: remove filters, try synonyms
   Still nothing? -> Report "no matches" with search suggestions
   ```
4. Add platform-to-RAG mapping:

   | Platform | RAG Server | Port | Status Check |
   |----------|-----------|------|--------------|
   | web | web-rag | 2636 | GET /api/rag/status |
   | ios | ios-rag | 2637 | GET /api/rag/status |
   | android | (future) | TBD | -- |
   | backend | (none) | -- | Grep only |

## Todo List
- [ ] Write search routing protocol section
- [ ] Write query classification table
- [ ] Write fallback chain rules
- [ ] Write platform-to-RAG mapping

## Success Criteria
- Scout SKILL.md has clear decision tree for routing
- Protocol covers all 5 query types (exact, semantic, external, project, token)
- Fallback path defined for offline RAG

## Risk Assessment
**Risks**: Overcomplicating a simple skill -- scout is an Explore subagent
**Mitigation**: Keep routing as a reference table, not code. Claude interprets it at runtime.

## Security Considerations
RAG servers are localhost only -- no auth concerns.

## Next Steps
After completion: Phase 03 (RAG Integration)
