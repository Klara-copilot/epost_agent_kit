---
name: knowledge-retrieval
description: Internal-first knowledge retrieval before acting. Searches project knowledge, skills, RAG systems, ADRs before external sources.
keywords: [retrieve, search, knowledge, context, rag, lookup, prior-art]
platforms: [all]
triggers: ["what do we know about", "check knowledge", "prior art", "previous decision"]
agent-affinity: [epost-architect, epost-implementer, epost-debugger, epost-researcher]
user-invocable: false
---

# Knowledge Retrieval Skill

## Purpose

Internal-first knowledge retrieval protocol that searches project knowledge, RAG systems, skills, and codebase before consulting external sources.

## When Active

- Starting implementation (check for existing patterns)
- Debugging (check for similar findings)
- Making decisions (check for prior ADRs)
- Researching libraries (check for previous evaluations)
- Reviewing code (check for conventions)

## RAG Priority Chain

Search sources in order, stop when sufficient context found:

| Level | Source | Tool | When to Use |
|-------|--------|------|-------------|
| 1 | `.knowledge/` | Read index.json, grep entries | Always start here |
| 2 | RAG system | MCP `query_rag` | Platform-specific context (web, iOS) |
| 3 | `.claude/skills/` | Read skill-index.json | Agent guidance needed |
| 4 | Agent memory | Auto-loaded | Cross-session context |
| 5 | Codebase | Grep, Glob, Read | Implementation details |
| 6 | Context7 | `docs-seeker` skill | Library documentation |
| 7 | WebSearch | `docs-seeker` skill | Latest external info |

## Search Protocol

### Level 1: Knowledge Base

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
jq -r '.entries[] | select(.id == "PATTERN-0005") | .path' .knowledge/index.json
```

### Level 2: RAG Systems

**Tools**: MCP `query_rag` via port-specific servers

**Ports**:
- Web: 2636
- iOS: 2637

**Query format**:
```typescript
{
  query: "error boundary pattern",
  filters: {
    component: "ErrorBoundary",
    topic: "error-handling",
    category: "pattern",
    file_type: "tsx"
  }
}
```

**When to use**: Platform-specific implementation context (components, code, architecture)

**Skip if**: No RAG server for current platform

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

### Level 4: Agent Memory

**Tool**: Auto-loaded by Claude if `memory: project` configured

**Access**: Automatic, no tool calls needed

**Content**: Cross-session context, task continuity notes

**When to rely on**: Task-specific context from previous sessions

### Level 5: Codebase Search

**Tools**: Grep, Glob, Read

**Steps**:
1. `Grep` for pattern/function names
2. `Glob` for file structure
3. `Read` key implementation files

**Example**:
```bash
# Find error boundary implementations
grep -r "ErrorBoundary" --include="*.tsx" app/

# Find all components
glob "**/*.tsx" app/components/
```

### Level 6: Context7 (Library Docs)

**Tools**: `resolve-library-id`, `get-library-docs`

**Process**:
1. Resolve library name to Context7 ID
2. Fetch docs with topic filter
3. Extract relevant sections

**Example**:
```
resolve-library-id("react")
→ /facebook/react/18.2.0

get-library-docs("/facebook/react/18.2.0", topic="error-boundaries")
→ [Error Boundary documentation]
```

**When to use**: Library API reference, official patterns

### Level 7: WebSearch

**Tool**: WebSearch via `docs-seeker` skill

**Query patterns**:
- "[topic] [version] documentation"
- "[error message] fix"
- "[library] best practices 2026"

**When to use**: Latest information not in other sources

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

**From skills** (debugging/SKILL.md):
- Error boundaries only catch render errors
- Don't catch event handler errors

**From Context7** (React docs):
- componentDidCatch lifecycle method
- getDerivedStateFromError for fallback UI
```

### Source Attribution

Note source for each finding:

- `.knowledge/` → Validated team knowledge
- RAG → Current implementation
- Skills → Agent guidance
- Codebase → Actual code
- Context7 → Official docs
- WebSearch → External info (verify)

## Decision Matrix

| Question Type | Primary | Secondary | Skip |
|---------------|---------|-----------|------|
| "What did we decide about X?" | `.knowledge/adrs` | Agent memory | RAG, Context7 |
| "How did we implement X?" | RAG, codebase | `.knowledge/patterns` | Context7 |
| "Why does X break?" | `.knowledge/findings` | RAG, codebase | Context7 |
| "How to use library X?" | Context7 | docs-seeker, WebSearch | `.knowledge` |
| "What's the convention for X?" | `.knowledge/conventions` | Skills | RAG |
| "What components exist for X?" | RAG | Codebase, skills | `.knowledge` |

## Integration with Existing Skills

### docs-seeker
Handles Context7 + WebSearch (levels 6-7):
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

### repomix
Provides codebase overview:
```
repomix → generate codebase summary
knowledge-retrieval → use summary for context
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

## Aspect Files

| File | Purpose |
|------|---------|
| `search-strategy.md` | How to search each source |
| `priority-matrix.md` | Decision table for source priority |

## Example Retrieval Session

**Query**: "How should we handle errors in async Server Components?"

**Level 1: .knowledge/**
```bash
jq '.entries[] | select(.tags[] | contains("error"))' .knowledge/index.json
```
**Result**: `PATTERN-0005: Error boundary for async Server Components`

**Level 2: RAG**
```typescript
query_rag({
  query: "error boundary server component",
  filters: { file_type: "tsx", topic: "error-handling" }
})
```
**Result**: `app/components/ErrorBoundary.tsx` implementation

**Level 5: Codebase**
```bash
grep -r "ErrorBoundary" --include="*.tsx" app/
```
**Result**: 12 usages found

**Stop here** — sufficient context from internal sources

**Skip levels 6-7** — no need for external docs

**Combined answer**:
- Pattern documented: `.knowledge/patterns/0005-error-boundary-async.md`
- Current implementation: `app/components/ErrorBoundary.tsx`
- Usage examples: 12 components using pattern
- Recommendation: Follow existing pattern

## Best Practices

1. **Start internal**: Always check `.knowledge/` first
2. **Skip irrelevant levels**: No RAG server? Skip to next level
3. **Stop when sufficient**: Don't search all levels unnecessarily
4. **Attribute sources**: Note where each finding came from
5. **Validate staleness**: Check dates on knowledge entries
6. **Expand keywords**: Try synonyms if no results
7. **Combine results**: Merge complementary findings
8. **Update knowledge**: If external search yields new insight, capture it

## Related Skills

- `knowledge-base` — Knowledge system structure
- `knowledge-capture` — Persist new learnings
- `docs-seeker` — External documentation retrieval
- `research` — Deep multi-source investigation
- `repomix` — Codebase summary generation

## References

- `references/search-strategy.md` — Source-specific search techniques
- `references/priority-matrix.md` — Decision table for source selection
