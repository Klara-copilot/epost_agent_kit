---
name: web-rag
description: Use when searching web codebase for klara-theme components, design tokens, or existing Next.js patterns via vector search
user-invocable: false

metadata:
  agent-affinity: [epost-muji, epost-implementer]
  keywords: [rag, vector-search, klara-theme, web, components, design-tokens]
  platforms: [web]
  triggers: [search components, find component, klara-theme, design token]
  connections:
    enhances: [web-frontend]
---

# Web RAG Skill

## Purpose

Vector search for the web codebase (klara-theme, Next.js monorepo). Uses ChromaDB with sentence-transformer embeddings for semantic search across component libraries, design tokens, and implementation patterns.

## Server Connection

- **Repository**: `epost_web_theme_rag` (standalone, separate from this kit)
- **Port**: 2636 (default)
- **API**: FastAPI at `http://localhost:2636`
- **Start**: `cd /path/to/epost_web_theme_rag && ./start.sh`
- **Status**: `GET /api/rag/status`

## MCP Tools

### query

Primary search tool. Returns relevant code chunks with metadata.

**Parameters**:
- `query` (string, required): Natural language search query
- `top_k` (int, default 5): Number of results to return
- `filters` (object, optional):
  - `component`: Filter by component name (e.g., "Button", "Dialog")
  - `topic`: Filter by topic (design-system, ui, backend, state-management, agent-rules, documentation)
  - `category`: Filter by file category
  - `file_type`: Filter by extension (ts, tsx, scss, json, md)
  - `priority`: Filter by path priority

**Returns**: Array of results with:
- `content`: Code chunk text
- `metadata`: File path, component, topic, category
- `score`: Combined relevance score (0-1)

### status

Returns system health and indexing statistics.

**Returns**:
- `status`: Server health (healthy/degraded/offline)
- `indexed_files`: Count of indexed files
- `indexed_chunks`: Count of indexed chunks
- `last_update`: Timestamp of last index update

### generate_sidecar

Store AI-generated metadata for a file to enrich indexing.

**Parameters**:
- `file_path` (string, required): Path to the file
- `metadata` (object, required): AI-generated metadata (summary, component names, topics)

### navigate

Fast O(1) shortcut navigation to known paths in the codebase.

**Parameters**:
- `shortcut` (string, required): Navigation shortcut name

## When to Use

| Scenario | Use RAG | Use Grep/Glob | Use Context7 |
|----------|---------|---------------|--------------|
| Find component implementation | yes | yes (if know filename) | no |
| Search design tokens | yes | yes | no |
| Library API docs | no | no | yes |
| Pattern across codebase | yes | partial (exact match only) | no |
| Existing component for task | yes | no | no |

See `references/query-patterns.md` for detailed query examples, filter combinations, and troubleshooting.

## Integration

This skill integrates with `knowledge-retrieval` at priority level 2:

**Priority Chain**:
1. `docs/` files (local docs)
2. **RAG systems** (this skill)
3. Skills and codebase search
4. External documentation (Context7)

### Workflow

```
User query → knowledge-retrieval orchestrator
  ↓
Check docs/ files → Found? Return
  ↓
Query RAG system → Found? Return
  ↓
Search skills → Found? Return
  ↓
Query Context7 → Return
```

## Filter Quick Reference

**Topics**: `design-system`, `ui`, `backend`, `state-management`, `agent-rules`, `documentation`
**File types**: `tsx`, `ts`, `scss`, `json`, `md`
**Priority scores**: 10 (core tokens/components) → 2 (config files)

See `references/query-patterns.md` for filter combinations, examples, and troubleshooting.

## Query Strategy Decision Tree

1. **Known component or file name?** → Standard `query` + `component` filter
2. **Exact pattern or API?** → Standard `query` + `topic` + `file_type` filters
3. **Conceptual or cross-cutting?** → Smart query with HyDE (see `references/smart-query.md`)
4. **< 3 results or all scores < 0.3?** → Broaden: remove filters, try synonyms, alternate casing
5. **Still nothing?** → Fall through to L4 (codebase Grep/Glob)

## Rules

1. Start broad, then filter — refine with filters not longer queries
2. Use natural language — "button with loading state" better than "btn loading"
3. Check relevance scores — < 0.3 may indicate poor match, rephrase query
4. Fallback to grep if RAG fails or server is offline
5. When results have `stale_sidecar: true`, trust code chunks but ignore metadata fields

## Related Skills

- `knowledge-retrieval` — RAG priority chain orchestration
- `web-ui-lib` — Component API knowledge
- `web-ui-lib-dev` — Figma-to-code pipeline
- `web-frontend` — Frontend patterns
- `docs-seeker` — External documentation lookup

## References

- `references/query-patterns.md` — Common query examples
- `references/smart-query.md` — HyDE + multi-query retrieval for improved recall
- Server repo: `epost_web_theme_rag`
- API docs: `http://localhost:2636/docs`
