---
name: knowledge-retrieval
description: Use when you need prior art, past decisions, or existing patterns — checks docs/, skills, and RAG before external sources
user-invocable: false

metadata:
  agent-affinity: [epost-architect, epost-implementer, epost-debugger, epost-researcher]
  keywords: [retrieve, search, knowledge, context, rag, lookup, prior-art]
  platforms: [all]
  triggers: ["what do we know about", "check knowledge", "prior art", "previous decision"]
---

# Knowledge Retrieval Skill

## Purpose

Internal-first knowledge retrieval protocol. Each piece of knowledge lives in exactly ONE tier. Search sources in order, stop when sufficient context found.

## Three Knowledge Tiers

| Tier | Type | Owner | Updated |
|------|------|-------|---------|
| **Procedural** | How to do things (methodology, pipelines, decision frameworks) | Skills | Versioned releases |
| **Codebase** | What exists in the code (components, tokens, patterns, implementations) | RAG system | Automatic (file watcher) |
| **Project** | What we decided & learned (ADRs, findings, conventions) | `docs/` | Organic (captured during work) |

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
| 1 | `docs/` | Read docs/index.json, filter by agentHint + tags | Decisions, conventions, findings, patterns |
| 2 | RAG systems | MCP `query` | Code, components, tokens, implementations |
| 3 | Skills | Read skill-index.json | Methodology, procedures, guidelines |
| 4 | Codebase | Grep, Glob, Read | Exact matches, files RAG missed |
| 5 | External | Context7, WebSearch | Library APIs, latest external info |

## Search Protocol

Search sources in order, stop when sufficient context found. See `references/search-strategy.md` for full retrieval chain, query examples, and source-specific techniques.

**Key principle**: Start internal (docs/ index), then RAG, then skills, then codebase grep, then external (Context7/WebSearch). Stop as soon as you have sufficient context.

## Decision Matrix

| Question Type | Go to | Skip |
|---------------|-------|------|
| "What did we decide about X?" | L1 `docs/decisions/` | RAG, External |
| "How is X implemented?" | L2 RAG → L4 Codebase | Skills |
| "What components exist?" | L2 RAG | `docs/` |
| "What's the token value?" | L2 RAG | Skills |
| "What's the process for X?" | L3 Skills | RAG |
| "What's our convention?" | L1 `docs/conventions/` | External |
| "Why does X break?" | L1 `docs/findings/` → L2 RAG → L4 Codebase | — |
| "How to use library X API?" | L5 External (Context7) | `docs/` |
| "Should we use technology X?" | L1 `docs/decisions/` → L5 External | RAG |
| "What's the system architecture?" | L1 `docs/architecture/` | External |
| "How does feature X work?" | L1 `docs/features/` → L4 Codebase | — |

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
| `docs/` | Check `updatedAt` field | Verify if >90 days old |
| RAG | Always fresh (auto-indexed) | Trust current |
| Skills | Manually updated | Check last commit |
| Codebase | Always current | Trust HEAD |
| Context7 | Always fresh (live docs) | Trust current |
| WebSearch | Check publication date | Prefer <2 years |

## Best Practices

1. **Start internal**: Always check `docs/index.json` first
2. **Use agentHint**: Match hints against current task for relevance
3. **Skip irrelevant levels**: No RAG server? Skip to next level
4. **Stop when sufficient**: Don't search all levels unnecessarily
5. **Attribute sources**: Note where each finding came from
6. **Validate staleness**: Check dates on knowledge entries
7. **Expand keywords**: Try synonyms if no results
8. **Combine results**: Merge complementary findings
9. **Update knowledge**: If external search yields new insight, capture it

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
