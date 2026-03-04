---
name: scout-deep
description: "Deep codebase search using RAG + grep — exhaustive semantic + exact match results"
user-invocable: true
context: fork
agent: Explore
metadata:
  argument-hint: "[search query]"
  keywords: [deep, thorough, exhaustive, semantic, rag, comprehensive, all-results]
  triggers:
    - "search everywhere"
    - "find everything"
    - "deep search"
    - "exhaustive"
    - "show all"
    - "comprehensive search"
  platforms: [web, ios, android, backend]
  agent-affinity: [Explore, epost-architect, epost-researcher]
  connections:
    complements: [scout, scout-fast]
    uses: [knowledge-retrieval, web-rag, ios-rag]
---

# Scout Deep — Exhaustive Semantic + Exact-Match Search

Deep codebase search combining RAG semantic search with full grep coverage. Returns all relevant results, ranked by relevance.

**Use when**: you want comprehensive results, all implementations, patterns, or exhaustive coverage of a topic.

**RAG first**: Semantic search finds conceptually related code even with different names. Grep catches exact matches. Results merged and deduplicated.

## Query

<query>$ARGUMENTS</query>

## Instructions

1. **Parse query** — identify intent (find all implementations, trace pattern, etc.)
2. **Detect platform** — from explicit prefix or keywords
3. **RAG search** (if available) — semantic search on platform codebase (web-rag/ios-rag)
4. **Grep fallback** — exact match across all platform files
5. **Merge & deduplicate** — RAG results + Grep results, rank by relevance
6. **Report** — comprehensive file list with context, all matches included

## Search Strategy

| Platform | Semantic | Exact Match | Fallback |
|----------|----------|-------------|----------|
| web | web-rag | Grep .tsx/.jsx/.ts | Grep only |
| ios | ios-rag | Grep .swift | Grep only |
| android | (future android-rag) | Grep .kt | Grep only |
| backend | (future) | Grep .java | Grep only |

## Result Format

Show all results in sections:

```
## Results (X total matches)

### Semantic Matches (from RAG)
- `path/to/component.tsx` — summary from RAG
- ...

### Exact Matches (from Grep)
- `path/to/file.ts` — context snippet
- ...

### By Category
**Components**: ...
**Utils/Hooks**: ...
**Config/Constants**: ...
**Tests**: ...
**Docs**: ...
```

## RAG Query Tuning

When semantic search is used:
- Extract domain keywords from query (auth, UI, data, etc.)
- Ask RAG: "Find all [concept] related to [domain]"
- Include filter hints: accessibility, styling, testing, documentation
- Fetch all available results (no limit), then rank client-side

## Examples

- `/scout-deep Button` → all Button-related code (web-rag semantic + grep exact)
- `/scout-deep web: authentication` → all auth implementations/patterns in web
- `/scout-deep ios: navigation patterns` → all nav-related Swift code
- `/scout-deep where is X used` → all usages of X across all platforms
- `/scout-deep accessibility helpers` → all a11y-related code (semantic + exact)
