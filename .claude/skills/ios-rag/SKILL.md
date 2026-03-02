---
name: ios-rag
description: Use when searching iOS codebase for Swift views, UIKit/SwiftUI patterns, or design system tokens via vector search
user-invocable: false

metadata:
  agent-affinity: [epost-a11y-specialist, epost-muji, epost-implementer]
  keywords: [rag, vector-search, ios, swift, swiftui, uikit, design-system]
  triggers: ["search swift", "find view", "ios pattern", "theme token"]
---

# iOS RAG Skill

## Purpose

Vector search across three iOS repositories: main app (luz_epost_ios), design system (luz_ios_designui), and theme library (luz_theme_ui). Uses ChromaDB with sentence-transformer embeddings for semantic search of Swift code, SwiftUI views, and design patterns.

## Server Connection

- **Repository**: `epost_ios_rag` (standalone, separate from this kit)
- **Port**: 2637 (default)
- **API**: FastAPI at `http://localhost:2637`
- **Start**: `cd /path/to/epost_ios_rag && ./start.sh`
- **Status**: `GET /api/rag/status`

## Indexed Repositories

| Repository | Purpose | Coverage |
|------------|---------|----------|
| `luz_epost_ios` | Main iOS app | App screens, features, business logic |
| `luz_ios_designui` | Design system | Reusable UI components, patterns |
| `luz_theme_ui` | Theme library | Theme tokens, styling, branding |

All three repositories are indexed together, enabling cross-project pattern discovery.

## MCP Tools

### query

Primary search tool. Returns relevant code chunks with metadata.

**Parameters**:
- `query` (string, required): Natural language search query
- `top_k` (int, default 5): Number of results to return
- `enforce_scope` (boolean, default true): Limit to single project or search all
- `filters` (object, optional):
  - `project`: Filter by project (luz_epost_ios, luz_ios_designui, luz_theme_ui)
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

### Decision Flow

1. **Known filename or exact pattern?** → Use Grep/Glob
2. **Apple framework API?** → Use Context7
3. **Cross-project search?** → Use RAG with enforce_scope=false
4. **Semantic discovery?** → Use RAG

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

| Project | Content |
|---------|---------|
| `luz_epost_ios` | Main app, feature screens, app logic |
| `luz_ios_designui` | Design system components, patterns |
| `luz_theme_ui` | Theme tokens, styles, branding |

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
- Server repo: `epost_ios_rag`
- API docs: `http://localhost:2637/docs`
- Indexed projects:
  - `luz_epost_ios` — Main app
  - `luz_ios_designui` — Design system
  - `luz_theme_ui` — Theme library
