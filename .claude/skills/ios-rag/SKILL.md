---
name: ios-rag
description: Use when searching iOS codebase for Swift views, UIKit/SwiftUI patterns, or design system tokens via vector search
user-invocable: false

metadata:
  agent-affinity: [epost-a11y-specialist, epost-muji, epost-implementer]
  keywords: [rag, vector-search, ios, swift, swiftui, uikit, design-system]
  triggers: ["search swift", "find view", "ios pattern", "theme token"]
  connections:
    enhances: [ios-development]
---

# iOS RAG Skill

## Purpose

Vector search across multiple iOS repositories. Uses ChromaDB with sentence-transformer embeddings for semantic search of Swift code, SwiftUI views, and design patterns. Call `status` to discover currently indexed projects.

## Server Connection

- **Repository**: `epost_ios_rag` (standalone, separate from this kit)
- **Port**: 2637 (default)
- **API**: FastAPI at `http://localhost:2637`
- **Start**: `cd /path/to/epost_ios_rag && ./start.sh`
- **Status**: `GET /api/rag/status`

## Indexed Repositories

Call `status` to discover which projects are currently indexed and their stats. Projects are indexed together, enabling cross-project pattern discovery.

## MCP Tools

### query

Primary search tool. Returns relevant code chunks with metadata.

**Parameters**:
- `query` (string, required): Natural language search query
- `top_k` (int, default 5): Number of results to return
- `enforce_scope` (boolean, default true): Limit to single project or search all
- `filters` (object, optional):
  - `project`: Filter by project name (discover available projects via `status`)
  - `component`: Filter by component/view name
  - `topic`: Filter by topic (ui, theme, state-management, networking, persistence)
  - `file_type`: Filter by extension (swift, storyboard, xib, plist, xcconfig)
  - `priority`: Filter by path priority

**Returns**: Array of results with:
- `content`: Code chunk text
- `metadata`: File path, project, component, topic
- `score`: Combined relevance score (0-1)

### status

Returns system health and indexing statistics.

**Returns**:
- `status`: Server health (healthy/degraded/offline)
- `projects`: Per-project indexing stats
- `indexed_files`: Total count across projects
- `indexed_chunks`: Total chunks indexed
- `last_update`: Timestamp of last index update

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
| Find Swift view pattern | ✅ | ✅ (if know filename) | ❌ |
| Search theme tokens | ✅ | ✅ | ❌ |
| Apple framework API | ❌ | ❌ | ✅ |
| Cross-project pattern | ✅ | ⚠️ (one repo at a time) | ❌ |
| Existing view for task | ✅ | ❌ | ❌ |

### Query Strategy Decision Tree

1. **Known view or file name?** → Standard `query` + `component` filter
2. **Exact pattern or API?** → Standard `query` + `topic` + `file_type` filters
3. **Conceptual or cross-cutting?** → Smart query with HyDE (see `references/smart-query.md`)
4. **< 3 results or all scores < 0.3?** → Broaden: remove filters, try synonyms, alternate casing
5. **Still sparse?** → Try `enforce_scope: false` to search all indexed repos
6. **Still nothing?** → Fall through to L4 (codebase Grep/Glob)

### Quick Decision Flow

1. **Known filename or exact pattern?** → Use Grep/Glob
2. **Apple framework API?** → Use Context7
3. **Cross-project search?** → Use RAG with enforce_scope=false
4. **Semantic discovery?** → Use RAG
5. When results have `stale_sidecar: true`, trust code chunks but ignore metadata fields

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

## Filter Reference

### Projects

Discover available projects via `status` tool. Use the `project` filter to narrow results to a specific repo.

### Topics

| Topic | Coverage |
|-------|----------|
| `ui` | Views, components, layout |
| `theme` | Tokens, colors, typography |
| `state-management` | @State, @Binding, ObservableObject |
| `networking` | URLSession, async/await, API clients |
| `persistence` | CoreData, UserDefaults, Keychain |

### File Types

| Extension | Content |
|-----------|---------|
| `swift` | Swift source code |
| `storyboard` | Interface Builder storyboards |
| `xib` | Interface Builder XIBs |
| `plist` | Property lists, configuration |
| `xcconfig` | Build configuration |

### Priority Levels

Files are indexed with priority scores (1-10):

| Score | Path Pattern |
|-------|--------------|
| 10 | Theme tokens, core views |
| 8 | Feature views, view models |
| 6 | Utilities, extensions |
| 4 | Tests, previews |
| 2 | Config, generated code |

## Related Skills

- `knowledge-retrieval` — RAG priority chain orchestration
- `ios-ui-lib` — iOS theme component knowledge
- `ios-development` — iOS development patterns
- `docs-seeker` — External Apple documentation lookup

## References

- `references/query-patterns.md` — iOS-specific query examples, troubleshooting, best practices
- `references/smart-query.md` — HyDE + multi-query retrieval for improved recall
- Server repo: `epost_ios_rag`
- API docs: `http://localhost:2637/docs`
