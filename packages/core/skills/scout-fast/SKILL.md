---
name: scout-fast
description: "Quick codebase search using grep only — no RAG, no semantic search"
user-invocable: true
context: fork
agent: Explore
metadata:
  argument-hint: "[search query]"
  keywords: [quick, fast, search, grep, find, exact-match]
  triggers:
    - "search for"
    - "find the"
    - "where is"
    - "quick search"
    - "grep for"
  platforms: [web, ios, android, backend]
  agent-affinity: [Explore]
  connections:
    complements: [scout, scout-deep]
    uses: [knowledge-retrieval]
---

# Scout Fast — Quick Exact-Match Search

Fast codebase search using Glob/Grep only. No RAG, no semantic search — direct file pattern matching for exact results.

**Use when**: you know what you're looking for (filename, exact string, pattern) and want fast results.

**Skip RAG**: This variant is offline-friendly and always works, no external service needed.

## Query

<query>$ARGUMENTS</query>

## Instructions

1. **Parse query** — identify search term (filename, string, regex pattern)
2. **Detect platform** — infer from query context or explicit prefix (`web:`, `ios:`, etc.)
3. **Glob/Grep search** — use exact matching, parallel queries for speed
4. **Deduplicate & group** — by platform, then by file type
5. **Report** — compact file list with one-line context per match

## Search Strategy

| Query Type | Tool | Strategy |
|------------|------|----------|
| Filename | Glob | `**/{filename}*` |
| String/symbol | Grep | Literal string match |
| Regex pattern | Grep | Full regex support |
| Platform-specific | Grep + Glob | Filter by platform extension (.tsx, .swift, .kt, .java) |

## Result Format

```
## Results (X matches)

### {Platform} ({N} matches)
- `path/to/file.ext` — one-line context or summary
- `path/to/another.ext` — context
```

## Examples

- `/scout-fast Button` → find all files containing "Button"
- `/scout-fast web: useAuth` → find useAuth in web codebase
- `/scout-fast route.ts` → grep for route.ts files
- `/scout-fast ios: \.swift$` → all Swift files in ios codebase
