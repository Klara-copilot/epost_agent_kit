# Phase 01: Rewrite SKILL.md Files

## Context Links
- Parent plan: [plan.md](./plan.md)

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Rewrite both `web-rag/SKILL.md` and `ios-rag/SKILL.md` to be dynamic and MCP-tool-driven
**Implementation Status**: Pending

## Key Insights

### What's Wrong Now
1. **Hardcoded server details**: Port 2636/2637, `cd /path/to/epost_web_theme_rag && ./start.sh` — useless, agent connects via MCP not HTTP
2. **Hardcoded filter enums**: Topics list, file_type list, priority scores — drift from server reality
3. **Hardcoded project names**: `luz_epost_ios`, `luz_theme_ui`, `luz_ios_designui` — only valid for current indexing config
4. **MCP tool docs duplicate schema**: Skill describes `query` params that are already in MCP tool inputSchema
5. **Skill says `generate_sidecar` exists as MCP tool**: Web MCP server has no such tool; iOS has REST endpoint but no MCP tool
6. **Web skill missing `catalog` and `filters` docs**: These MCP tools exist but skill doesn't mention them
7. **Reranking weights**: iOS skill hardcodes 55/20/25 weights — implementation detail, not agent guidance

### What's Right (Keep)
- Frontmatter metadata (name, description, keywords, triggers, connections)
- "When to Use" decision table (RAG vs Grep vs Context7)
- Query Strategy Decision Tree (procedural, not data)
- Integration with knowledge-retrieval chain
- Rules section (start broad, natural language, check scores, fallback)

### Design Principle
Skills should be **protocol guides**, not **API reference docs**. MCP tools are self-describing. Teach agents:
1. Which tool to call first (`status` for discovery)
2. When to use RAG vs alternatives
3. How to interpret results and iterate
4. When to fall through to other sources

## Requirements
### Functional
- Remove all hardcoded values that can be discovered via MCP tools
- Keep procedural knowledge (decision trees, strategies, rules)
- Add "Discovery Protocol" section: call `status` first, then `filters`/`catalog`
- Unify structure between web and ios skills
- Correct MCP tool inventory (list only tools that actually exist)

### Non-Functional
- Each SKILL.md under 120 lines
- No platform-specific data that could drift

## Architecture

New SKILL.md structure:
```
1. Frontmatter (unchanged)
2. Purpose (2 lines — what this RAG covers)
3. MCP Tools (list names + 1-line description, NO param details — schema is self-describing)
4. Discovery Protocol (call status, then filters/catalog/expansions)
5. When to Use (decision table — RAG vs Grep vs Context7)
6. Query Strategy (decision tree — kept from current)
7. Rules (kept from current, remove hardcoded score thresholds)
8. Integration (knowledge-retrieval chain — kept)
9. Related Skills + References
```

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/platform-web/skills/web-rag/SKILL.md` [OWNED]
- `packages/platform-ios/skills/ios-rag/SKILL.md` [OWNED]

### Read-Only
- `epost_web_theme_rag/src/mcp_server.py` — actual MCP tool list
- `epost_ios_rag/src/mcp_server.py` — actual MCP tool list

## Implementation Steps

### 1. Rewrite `packages/platform-web/skills/web-rag/SKILL.md`

New content (~100 lines):

```markdown
---
(keep existing frontmatter unchanged)
---

# Web RAG Skill

## Purpose

Vector search for the web codebase. Semantic search across component libraries, design tokens, and implementation patterns via MCP tools.

## MCP Tools

| Tool | Purpose |
|------|---------|
| `query` | Semantic search — returns code chunks with relevance scores |
| `status` | Health check, indexed modules, document counts |
| `catalog` | List available components/hooks/styles per module (no vector search) |
| `navigate` | O(1) shortcut to known code locations |
| `expansions` | Component alias mappings + synonym groups for query planning |

Tool parameters are self-describing — check inputSchema for current options.

## Discovery Protocol

Before querying, discover what's indexed:

1. **Call `status`** — returns available modules, document counts, health
2. **Call `catalog`** (optional) — lists components/hooks/styles for discovery
3. **Call `expansions`** (once per session) — get component aliases and synonym groups

Use discovered values for `module`, `filters.scope`, and `filters.component` params.

## When to Use

| Scenario | RAG | Grep/Glob | Context7 |
|----------|-----|-----------|----------|
| Find component by concept | yes | if know filename | no |
| Search design tokens | yes | yes | no |
| Library API docs | no | no | yes |
| Pattern across codebase | yes | exact match only | no |
| Discover available components | catalog | no | no |

## Query Strategy

1. **Known component or file?** -> `query` + component filter (get canonical name from `expansions`)
2. **Known topic area?** -> `query` + topic/file_type filters
3. **Conceptual/cross-cutting?** -> Smart query with HyDE (see `references/smart-query.md`)
4. **< 3 results or low scores?** -> Broaden: remove filters, try synonyms, alternate casing
5. **Still nothing?** -> Fall through to Grep/Glob (codebase search)

## Rules

1. Start broad, refine with filters — not longer queries
2. Natural language works best — "button with loading state" over "btn loading"
3. Low relevance scores suggest rephrasing needed
4. If server offline, fall back to Grep/Glob
5. `stale_sidecar: true` in results — trust code chunks, ignore metadata fields
6. Do NOT generate synonym variants — server handles expansion automatically

## Integration

Priority level 2 in `knowledge-retrieval` chain:
1. `docs/` files -> 2. **RAG** -> 3. Skills/codebase -> 4. Context7

## Related Skills

- `knowledge-retrieval` — Orchestrates source priority
- `web-frontend` — Frontend patterns (enhanced by this skill)
- `docs-seeker` — External documentation lookup

## References

- `references/smart-query.md` — HyDE + multi-query retrieval strategy
- `references/sidecar-workflow.md` — AI-generated metadata enrichment
```

### 2. Rewrite `packages/platform-ios/skills/ios-rag/SKILL.md`

Same structure, differences:
- MCP Tools: `query`, `status`, `navigate`, `expansions` (no `catalog`)
- Add note: iOS has `filters` endpoint (`GET /api/rag/filters` via REST, or check `query` tool inputSchema for filter options)
- Related skills: `ios-development` instead of `web-frontend`

### 3. Verify MCP tool inventory matches

Web MCP tools (from mcp_server.py): `query`, `navigate`, `status`, `expansions`, `catalog`
iOS MCP tools (from mcp_server.py): `query`, `navigate`, `status`, `expansions`

Current web skill lists: `query`, `status`, `generate_sidecar`, `navigate` — WRONG (no generate_sidecar, missing catalog + expansions)
Current iOS skill lists: `query`, `status` — WRONG (missing navigate + expansions)

## Todo List
- [ ] Rewrite web-rag SKILL.md with dynamic structure
- [ ] Rewrite ios-rag SKILL.md with dynamic structure
- [ ] Verify all MCP tool names match actual server implementations
- [ ] Remove hardcoded ports, project names, filter enums, priority scores

## Success Criteria
- Zero hardcoded values that could drift from server reality
- Both skills under 120 lines
- MCP tool inventory matches actual server tools
- Agent can discover everything at runtime

## Risk Assessment
**Risks**: Skill becomes too thin — agent doesn't know how to form good queries
**Mitigation**: Keep smart-query.md reference for procedural HyDE strategy; keep "When to Use" and "Query Strategy" decision trees — these are protocol, not data

## Security Considerations
None — skill files are documentation only

## Next Steps
After completion:
1. Phase 02: Consolidate reference files
2. Run `epost-kit init` to regenerate `.claude/`
