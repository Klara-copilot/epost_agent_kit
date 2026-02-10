---
name: rag-ios-rag
description: iOS codebase RAG — vector search for Swift app code, UIKit/SwiftUI components, design system patterns. Use before implementing iOS features, searching view patterns, or finding theme tokens.
keywords: [rag, vector-search, ios, swift, swiftui, uikit, design-system]
triggers: ["search swift", "find view", "ios pattern", "theme token"]
agent-affinity: [epost-ios-developer, epost-a11y-specialist, epost-muji, epost-implementer]
user-invocable: false
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

### query_rag

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

### get_rag_status

Returns system health and indexing statistics.

**Returns**:
- `status`: Server health (healthy/degraded/offline)
- `projects`: Per-project indexing stats
- `indexed_files`: Total count across projects
- `indexed_chunks`: Total chunks indexed
- `last_update`: Timestamp of last index update

## Query Patterns

### Swift View Search

```
query: "custom button with haptic feedback"
filters: { topic: "ui", file_type: "swift" }
```

**Use when**: Looking for SwiftUI view implementations.

### UIKit Component Search

```
query: "table view cell with async image loading"
filters: { topic: "ui", file_type: "swift" }
```

**Use when**: Finding UIKit component patterns.

### Theme Token Lookup

```
query: "color token for primary text"
filters: { project: "luz_theme_ui", topic: "theme" }
```

**Use when**: Need theme token definitions.

### Cross-Project Pattern

```
query: "networking layer with async await error handling"
enforce_scope: false
```

**Use when**: Searching pattern usage across all projects.

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

## Cross-Project Search

**Default Behavior** (enforce_scope=true):
- Searches single most relevant project
- Faster results
- More focused

**Cross-Project** (enforce_scope=false):
- Searches all three repositories
- Finds pattern usage across projects
- Useful for theme token usage, shared patterns

**Example**:
```typescript
// Search only theme library
const themeResults = await query_rag({
  query: "primary color token",
  filters: { project: "luz_theme_ui" }
});

// Search all projects for usage
const usageResults = await query_rag({
  query: "how is primary color token used",
  enforce_scope: false
});
```

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

## Examples

### Find Button Implementation

```typescript
const results = await query_rag({
  query: "custom button with loading state and haptic",
  filters: { topic: "ui", file_type: "swift" },
  top_k: 3
});
```

### Search Async Patterns

```typescript
const results = await query_rag({
  query: "async await pattern with error handling",
  filters: { topic: "networking" },
  top_k: 5
});
```

### Theme Color Discovery

```typescript
const results = await query_rag({
  query: "semantic color tokens for dark mode",
  filters: { project: "luz_theme_ui", topic: "theme" }
});
```

### Cross-Project Theme Usage

```typescript
const results = await query_rag({
  query: "using brand color token in views",
  enforce_scope: false,
  top_k: 10
});
```

## Swift-Specific Patterns

### Protocol Search

```typescript
query: "networking protocol with async await"
filters: { file_type: "swift" }
```

### Extension Search

```typescript
query: "String extension for email validation"
filters: { file_type: "swift" }
```

### Property Wrapper Search

```typescript
query: "@Published property wrapper state management"
filters: { topic: "state-management" }
```

### View Modifier Search

```typescript
query: "custom view modifier for rounded corners shadow"
filters: { topic: "ui" }
```

## Troubleshooting

### Empty Results

**Causes**:
- Server offline
- Query too specific
- Invalid filters
- Project not indexed

**Solutions**:
1. Check server status with `get_rag_status`
2. Verify project names in filters
3. Broaden query or remove filters
4. Try enforce_scope=false for cross-project

### Low Relevance Scores

**Causes**:
- Query doesn't match Swift terminology
- Too many filters applied

**Solutions**:
1. Use Swift-specific terms (view, modifier, protocol)
2. Remove restrictive filters
3. Try different phrasing

### Mixed Results from Different Projects

**Cause**: enforce_scope=false mixing projects

**Solution**: Add project filter to focus results

### Server Timeout

**Causes**:
- Large result set with enforce_scope=false
- Server under load

**Solutions**:
1. Reduce `top_k` parameter
2. Add project filter
3. Set enforce_scope=true
4. Check server resources

## Best Practices

1. **Use Swift terminology**: "view" not "component", "modifier" not "decorator"
2. **Start with enforce_scope=true**: Faster, more focused results
3. **Specify project for tokens**: Theme lookups should filter by luz_theme_ui
4. **Cross-project for patterns**: Use enforce_scope=false to see usage examples
5. **Check relevance scores**: < 0.3 may indicate poor match
6. **Combine filters**: Use topic + file_type for precision

## Related Skills

- `knowledge-retrieval` — RAG priority chain orchestration
- `muji/ios-theme` — iOS theme component knowledge
- `ios/ios-development` — iOS development patterns
- `docs-seeker` — External Apple documentation lookup

## References

- `query-patterns.md` — iOS-specific query examples
- Server repo: `epost_ios_rag`
- API docs: `http://localhost:2637/docs`
- Indexed projects:
  - `luz_epost_ios` — Main app
  - `luz_ios_designui` — Design system
  - `luz_theme_ui` — Theme library
