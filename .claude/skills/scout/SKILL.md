---
name: scout
description: "(ePost) Explore codebase — find files, patterns, RAG + grep search across platforms"
user-invocable: true
context: fork
agent: Explore
metadata:
  argument-hint: "[search query or platform-prefix: query]"
  keywords: [explore, search, find, locate, trace, pattern, architecture, codebase, where-is, which-file, implementation]
  triggers:
    - "where is"
    - "find the"
    - "search for"
    - "which file"
    - "how is X implemented"
    - "trace"
    - "explore"
    - "show me the code"
    - "what does this file do"
  platforms: [web, ios, android, backend]
  agent-affinity: [Explore, epost-architect, epost-researcher, epost-debugger]
  connections:
    uses: [knowledge-retrieval, web-rag, ios-rag]
    enhances: [planning, debugging, implementation]
    complementary: [repomix, scout-fast, scout-deep]
---

# Scout — Smart Codebase Explorer

Explore the codebase for files, patterns, architecture insights, and implementations. Auto-detects platform and intelligently routes between RAG (semantic search) and Grep (exact matches) with graceful fallback.

## Query

<query>$ARGUMENTS</query>

## Step 1: Classify Query Intent

Determine what the user is looking for:
- **File location** — "where is X", "find the Y", "which file has Z"
- **Pattern/Implementation** — "how is X implemented", "show me the code for Y", "trace X"
- **Architecture/Structure** — "what does X do", "how does the Y work", "architecture of Z"
- **Dependencies/Relationships** — "what calls X", "where is X used", "dependencies of Y"

## Step 2: Detect Platform(s)

Extract platform from:
1. **Explicit prefix** — `web:`, `ios:`, `android:`, `backend:` at query start
2. **Query keywords** — "React", "SwiftUI", "Compose", "JAX-RS", "Retrofit" → platform inference
3. **Default** — if ambiguous, search all platforms (then deduplicate by relevance)

## Step 3: Smart Search Routing

**Decision tree** (in order):

| Intent | Platform | Strategy | Tools |
|--------|----------|----------|-------|
| Exact file name | any | Grep filename | Glob, Grep |
| Implementation / pattern | **web** | Semantic first | web-rag → fallback Grep |
| Implementation / pattern | **ios** | Semantic first | ios-rag → fallback Grep |
| Implementation / pattern | **android** | Grep only | Grep (android-rag pending) |
| Architecture / design | any | docs/ first | Read docs/architecture/, docs/patterns/ → Grep → RAG |
| Dependencies | any | Grep dependencies | Grep for imports, require() |

**Offline fallback**: RAG unavailable → silently use Grep. Do NOT report RAG failure; results may be less semantically relevant but still correct.

## Step 4: RAG Integration (Lazy Detection)

When semantic search is chosen (web-rag/ios-rag):

1. **Lazy health check** — attempt RAG query on first semantic search, catch errors gracefully
2. **Query construction** — ask RAG: "Find [component/token/pattern] matching [user's intent]"
3. **Filter extraction** — extract relevant filters from query (e.g., "accessibility" → filter by ARIA, VoiceOver; "styling" → filter by tokens, Tailwind)
4. **Result limit** — request top 10–15 results, deduplicate by file path
5. **Fallback** — if RAG fails or returns empty, use Grep on full codebase

**RAG query examples**:
- "Find React components for user authentication" → web-rag semantic search
- "Find SwiftUI views for navigation" → ios-rag semantic search
- "Find accessibility helpers" → web-rag/ios-rag filtered by a11y keywords

## Step 5: Result Categorization & Synthesis

Group results by category:

| Category | Signals |
|----------|---------|
| **Components** | .tsx/.jsx (web), .swift (iOS), .kt (Android), .java (backend) |
| **Logic/Utils** | hooks, helpers, services, utils, managers |
| **Tokens/Config** | design tokens, theme, config, constants |
| **Tests** | .test.ts, .test.swift, Test.kt, *Test.java |
| **Docs** | .md, .mdx files, comments |

For each result:
- **File path** (short, relative to root)
- **One-line summary** (what it does, copy from docstring or infer)
- **Platform tag** (web, ios, android, backend)
- **Relevance badge** (exact match, high relevance, medium relevance)

## Step 6: Rank & Report

Rank by:
1. Exact filename matches first
2. Same platform as query
3. RAG relevance score (if used)
4. Frequency of matches in codebase

Report results concisely — file list + brief context. If >15 results, summarize top 10 + "See full results with `/scout-deep [query]`"

## Examples

- `/scout auth flow` → Search all platforms for auth-related files
- `/scout web: Button component` → web-rag semantic search for Button implementations
- `/scout ios: navigation` → ios-rag semantic search for navigation patterns
- `/scout where is the user model` → Grep exact match for "user model"
- `/scout web: authentication middleware` → web-rag search with platform detection
