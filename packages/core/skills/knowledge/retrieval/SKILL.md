---
name: knowledge/retrieval
description: Internal-first knowledge retrieval before acting. Searches project knowledge, skills, RAG systems, ADRs before external sources.
keywords: [retrieve, search, knowledge, context, rag, lookup, prior-art]
platforms: [all]
triggers: ["what do we know about", "check knowledge", "prior art", "previous decision"]
agent-affinity: [epost-architect, epost-implementer, epost-debugger, epost-researcher]
user-invocable: false
---

# Knowledge Retrieval Skill

## Purpose

Internal-first knowledge retrieval protocol. Each piece of knowledge lives in exactly ONE tier. Search sources in order, stop when sufficient context found.

## Three Knowledge Tiers

| Tier | Type | Owner | Updated |
|------|------|-------|---------|
| **Procedural** | How to do things (methodology, pipelines, decision frameworks) | Skills | Versioned releases |
| **Codebase** | What exists in the code (components, tokens, patterns, implementations) | RAG system | Automatic (file watcher) |
| **Project** | What we decided & learned (ADRs, findings, conventions) | `.knowledge/` | Organic (captured during work) |

**Rule**: Each piece of knowledge lives in exactly ONE tier. Other systems reference it, never copy it.

## When Active

- Starting implementation (check for existing patterns)
- Debugging (check for similar findings)
- Making decisions (check for prior ADRs)
- Researching libraries (check for previous evaluations)
- Reviewing code (check for conventions)

## Retrieval Chain (5 Levels)

Search sources in order, stop when sufficient context found:

| Level | Source | Tool | When to Use |
|-------|--------|------|-------------|
| 1 | `.knowledge/` | Read index.json, Grep entries | Decisions, conventions, findings, patterns |
| 2 | RAG systems | MCP `query` | Code, components, tokens, implementations |
| 3 | Skills | Read skill-index.json | Methodology, procedures, guidelines |
| 4 | Codebase | Grep, Glob, Read | Exact matches, files RAG missed |
| 5 | External | Context7, WebSearch | Library APIs, latest external info |

## Search Protocol

### Level 1: Knowledge Base (`.knowledge/`)

**File**: `.knowledge/index.json`

**Steps**:
1. Read index
2. Filter by tags, category, or title keywords
3. Read matching entry markdown files
4. Follow `related` links for connected entries

**Example**:
```bash
# Search for React patterns
jq '.entries[] | select(.tags[] | contains("react"))' .knowledge/index.json

# Get specific entry path
jq -r '.entries[] | select(.id == "ADR-0001") | .path' .knowledge/index.json
```

**Stop if**: Exact ADR, convention, or finding answers the question.

### Level 2: RAG Systems

**Tool**: MCP `query` via platform-specific servers

**Ports**:
- Web: 2636
- iOS: 2637

**Query format**:
```typescript
query({
  query: "error boundary pattern",
  filters: {
    component: "ErrorBoundary",
    topic: "error-handling",
    file_type: "tsx",
    scope: "klara-theme"
  }
})
```

**Scope filter** — limit results to a specific library:

| Scope | Content |
|-------|---------|
| `klara-theme` | Design system components, tokens, styles |
| `luz-components` | Shared UI components |
| `luz-services` | Backend service layer |
| `luz-utils` | Utilities, Redux, state management |
| `libs` | All library scopes combined |
| `all` | No filtering (default) |

**When to use**: Platform-specific implementation context (components, tokens, code, architecture).

**Stop if**: RAG returns implementation + pattern that answers the question.

**Skip if**: No RAG server for current platform.

### Level 3: Skills Index

**File**: `.claude/skills/skill-index.json`

**Steps**:
1. Read skill index
2. Match query keywords against skill keywords/triggers
3. Read SKILL.md + reference files
4. Check aspect files in skill directory

**Example**:
```bash
# Find debugging-related skills
jq '.skills[] | select(.keywords[] | contains("debug"))' .claude/skills/skill-index.json
```

**When to use**: Methodology, process, guidelines (how to do things).

**Stop if**: Skill provides the procedural guidance needed.

### Level 4: Codebase Search

**Tools**: Grep, Glob, Read

**Steps**:
1. `Grep` for pattern/function names
2. `Glob` for file structure
3. `Read` key implementation files

**When to use**: Exact matches, specific file content, things RAG may have missed, tracing imports/exports.

**Stop if**: Found the exact code or file needed.

### Level 5: External (Context7 + WebSearch)

**Context7 tools**: `resolve-library-id`, `get-library-docs`

```typescript
// Resolve library
resolve-library-id("react")
// Fetch docs with topic
get-library-docs("/facebook/react", topic: "error-boundaries")
```

**WebSearch patterns**:
- `"[library] [version] [feature] documentation"`
- `"[error message] fix"`
- `"[library] best practices 2026"`

**When to use**: Library API reference, official patterns, latest external info.

**Skip if**: Internal sources already answered the question.

## Decision Matrix

| Question Type | Go to | Skip |
|---------------|-------|------|
| "What did we decide about X?" | L1 `.knowledge/` | RAG, External |
| "How is X implemented?" | L2 RAG → L4 Codebase | Skills |
| "What components exist?" | L2 RAG | `.knowledge/` |
| "What's the token value?" | L2 RAG | Skills |
| "What's the process for X?" | L3 Skills | RAG |
| "What's our convention?" | L1 `.knowledge/` | External |
| "Why does X break?" | L1 `.knowledge/findings` → L2 RAG → L4 Codebase | — |
| "How to use library X API?" | L5 External (Context7) | `.knowledge/` |
| "Should we use technology X?" | L1 `.knowledge/decisions` → L5 External | RAG |

## Search Strategy

### Keyword Expansion

Broaden search if initial query yields no results:

| Original | Expanded |
|----------|----------|
| "error boundary" | "error", "boundary", "error-handling", "exception" |
| "useState" | "state", "hook", "react-state" |
| "routing" | "route", "router", "navigation" |

### Combining Results

Merge findings from multiple sources:

```markdown
# Result: Error Boundary Pattern

**From .knowledge/** (PATTERN-0005):
- Use error boundaries for async Server Components
- Wrap at route segment level

**From RAG** (app/components/ErrorBoundary.tsx):
- Implementation uses react-error-boundary library
- Fallback renders user-friendly error message

**From Context7** (React docs):
- componentDidCatch lifecycle method
- getDerivedStateFromError for fallback UI
```

### Source Attribution

Note source for each finding:

- `.knowledge/` — Validated team knowledge
- RAG — Current implementation
- Skills — Agent guidance
- Codebase — Actual code
- Context7 — Official docs
- WebSearch — External info (verify)

## Integration with Existing Skills

### docs-seeker
Handles Context7 + WebSearch (Level 5):
```
docs-seeker → resolve-library-id → get-library-docs
docs-seeker → WebSearch (if Context7 fails)
```

### research
Handles deep multi-source investigation:
```
research → knowledge-retrieval (internal first)
research → docs-seeker (external)
research → synthesize findings
```

## Staleness Detection

| Source | Freshness | Validation |
|--------|-----------|------------|
| `.knowledge/` | Check `updated` field | Verify if >90 days old |
| RAG | Always fresh (auto-indexed) | Trust current |
| Skills | Manually updated | Check last commit |
| Codebase | Always current | Trust HEAD |
| Context7 | Always fresh (live docs) | Trust current |
| WebSearch | Check publication date | Prefer <2 years |

## Best Practices

1. **Start internal**: Always check `.knowledge/` first
2. **Skip irrelevant levels**: No RAG server? Skip to next level
3. **Stop when sufficient**: Don't search all levels unnecessarily
4. **Attribute sources**: Note where each finding came from
5. **Validate staleness**: Check dates on knowledge entries
6. **Expand keywords**: Try synonyms if no results
7. **Combine results**: Merge complementary findings
8. **Update knowledge**: If external search yields new insight, capture it

## Aspect Files

| File | Purpose |
|------|---------|
| `search-strategy.md` | How to search each source |
| `priority-matrix.md` | Decision table for source priority |

## Related Skills

- `knowledge-base` — Knowledge system structure
- `knowledge-capture` — Persist new learnings
- `docs-seeker` — External documentation retrieval
- `research` — Deep multi-source investigation

## References

- `references/search-strategy.md` — Source-specific search techniques
- `references/priority-matrix.md` — Decision table for source selection
