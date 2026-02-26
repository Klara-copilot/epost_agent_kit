---
name: web-rag
description: Web codebase RAG — vector search for klara-theme components, design tokens, Next.js patterns. Use before implementing web UI features, searching component APIs, or finding existing patterns.
user-invocable: false

metadata:
  agent-affinity: "[epost-web-developer, epost-muji, epost-implementer]"
  keywords: "[rag, vector-search, klara-theme, web, components, design-tokens]"
  platforms: "[web]"
  triggers: "[search components, find component, klara-theme, design token]"
"
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

## Query Patterns

### Component Search

```
query: "Button component variants and props"
filters: { component: "Button", topic: "design-system" }
```

**Use when**: Looking for component implementation, props interface, or variant patterns.

### Design Token Lookup

```
query: "color tokens for dark mode"
filters: { topic: "design-system", file_type: "scss" }
```

**Use when**: Need to find semantic color tokens, spacing scales, or typography definitions.

### Pattern Discovery

```
query: "form validation with React Hook Form"
filters: { topic: "ui" }
```

**Use when**: Searching for implementation patterns across the codebase.

### Implementation Reference

```
query: "how to use ThemeProvider with custom tokens"
filters: { topic: "design-system" }
```

**Use when**: Need usage examples or integration patterns.

## Reranking

Results use hybrid scoring:

| Factor | Weight |
|--------|--------|
| Semantic similarity | 55% |
| Keyword match | 20% |
| Metadata relevance | 25% |

Results are:
1. Scored using hybrid algorithm
2. Deduplicated (best chunk per file)
3. Sorted by combined score

## When to Use

| Scenario | Use RAG | Use Grep/Glob | Use Context7 |
|----------|---------|---------------|--------------|
| Find component implementation | ✅ | ✅ (if know filename) | ❌ |
| Search design tokens | ✅ | ✅ | ❌ |
| Library API docs | ❌ | ❌ | ✅ |
| Pattern across codebase | ✅ | ⚠️ (exact match only) | ❌ |
| Existing component for task | ✅ | ❌ | ❌ |

### Decision Flow

1. **Known filename or exact pattern?** → Use Grep/Glob
2. **External library API?** → Use Context7
3. **Semantic search needed?** → Use RAG
4. **Component discovery?** → Use RAG

## Integration

This skill integrates with `knowledge-retrieval` at priority level 2:

**Priority Chain**:
1. `.knowledge/` files (local docs)
2. **RAG systems** (this skill)
3. Skills and codebase search
4. External documentation (Context7)

### Workflow

```
User query → knowledge-retrieval orchestrator
  ↓
Check .knowledge/ files → Found? Return
  ↓
Query RAG system → Found? Return
  ↓
Search skills → Found? Return
  ↓
Query Context7 → Return
```

## Filter Reference

### Topics

| Topic | Coverage |
|-------|----------|
| `design-system` | Tokens, theme, component APIs |
| `ui` | Component implementations, patterns |
| `backend` | API routes, server actions |
| `state-management` | Redux, context, hooks |
| `agent-rules` | Agent configurations |
| `documentation` | README, docs, guides |

### File Types

| Extension | Content |
|-----------|---------|
| `tsx` | React components |
| `ts` | TypeScript utilities, types |
| `scss` | Styles, design tokens |
| `json` | Config, package manifests |
| `md` | Documentation |

### Priority Levels

Files are indexed with priority scores (1-10):

| Score | Path Pattern |
|-------|--------------|
| 10 | Theme tokens, core components |
| 8 | Feature components |
| 6 | Utilities, hooks |
| 4 | Tests, stories |
| 2 | Config files |

## Examples

### Find Button Variants

```typescript
const results = await query({
  query: "Button size and color variants",
  filters: { component: "Button", file_type: "tsx" },
  top_k: 3
});
```

### Search Form Patterns

```typescript
const results = await query({
  query: "form validation error handling pattern",
  filters: { topic: "ui" },
  top_k: 5
});
```

### Design Token Discovery

```typescript
const results = await query({
  query: "spacing scale tokens",
  filters: { topic: "design-system", file_type: "scss" }
});
```

## Troubleshooting

### Empty Results

**Causes**:
- Server offline
- Query too specific
- Invalid filters

**Solutions**:
1. Check server status with `status`
2. Broaden query or remove filters
3. Verify filter values match indexed metadata

### Low Relevance Scores

**Causes**:
- Query doesn't match indexed content
- Too many filters applied

**Solutions**:
1. Rephrase query with different terms
2. Remove restrictive filters
3. Use component name in query

### Server Timeout

**Causes**:
- Large result set
- Server under load

**Solutions**:
1. Reduce `top_k` parameter
2. Add more specific filters
3. Check server resources

## Best Practices

1. **Start broad, then filter**: Begin with general query, refine with filters
2. **Use natural language**: "button with loading state" better than "btn loading"
3. **Combine filters**: Use component + file_type for precision
4. **Check relevance scores**: < 0.3 may indicate poor match
5. **Fallback to grep**: If RAG fails, use traditional search

## Related Skills

- `knowledge-retrieval` — RAG priority chain orchestration
- `web-ui-lib` — Component API knowledge
- `web-ui-lib-dev` — Figma-to-code pipeline
- `web/frontend-development` — Frontend patterns
- `docs-seeker` — External documentation lookup

## References

- `query-patterns.md` — Common query examples
- `smart-query.md` — HyDE + multi-query retrieval for improved recall
- Server repo: `epost_web_theme_rag`
- API docs: `http://localhost:2636/docs`
