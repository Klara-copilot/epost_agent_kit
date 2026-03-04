# Phase 02: MCP Tool

## Context Links
- Parent plan: [plan.md](./plan.md)
- Phase 01: [phase-01-rag-api-endpoint.md](./phase-01-rag-api-endpoint.md)
- Web MCP server: `epost_web_theme_rag/src/mcp_server.py`
- iOS MCP server: `epost_ios_rag/src/mcp_server.py`

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Add `expansions` MCP tool to both RAG MCP servers, calling the new `/api/rag/expansions` endpoint
**Implementation Status**: Completed 2026-03-04

## Key Insights
- Both MCP servers use identical pattern: httpx async client -> RAG API -> TextContent response
- Existing tools: `query`, `navigate`, `status` (+ `catalog` for web)
- Tool should return structured data agents can parse — JSON preferred over markdown for programmatic use
- Agent can call once per session and cache in working memory

## Requirements
### Functional
- `expansions` tool returns component_mappings + synonyms from RAG server
- Accepts optional `format` param: "json" (default) or "summary" (compact)
- "summary" format: counts only + sample entries, for token efficiency

### Non-Functional
- Response under 5KB in summary mode (avoid context bloat)
- Graceful error when RAG server unreachable

## Architecture
```
Agent calls MCP tool `expansions`
  -> MCP server calls GET /api/rag/expansions
  -> Returns structured text to agent
```

## Related Code Files
### Modify (EXCLUSIVE)
- `epost_web_theme_rag/src/mcp_server.py` — Add expansions tool [OWNED]
- `epost_ios_rag/src/mcp_server.py` — Add expansions tool [OWNED]

### Read-Only
- `src/api/routes/expansions.py` — Endpoint being called (from Phase 01)

## Implementation Steps

1. Add `expansions` Tool definition in `list_tools()`:
```python
Tool(
    name="expansions",
    description=(
        "Get query expansion data: component name mappings (alias->canonical) "
        "and synonym groups. Use to understand what aliases the RAG server "
        "recognizes and how queries get expanded. Call once per session."
    ),
    inputSchema={
        "type": "object",
        "properties": {
            "format": {
                "type": "string",
                "description": "Response format: 'full' (all data) or 'summary' (counts + samples)",
                "enum": ["full", "summary"],
                "default": "summary"
            }
        }
    }
)
```

2. Add handler in `call_tool()`:
```python
elif name == "expansions":
    return await handle_expansions(arguments)
```

3. Implement `handle_expansions()`:
```python
async def handle_expansions(arguments: Any) -> list[TextContent]:
    fmt = arguments.get("format", "summary")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{RAG_API_URL}/api/rag/expansions")
            response.raise_for_status()
            data = response.json()

        if fmt == "summary":
            # Compact: counts + first 5 entries per section
            result = f"# Query Expansions ({data['platform']})\n"
            result += f"Component mappings: {data['counts']['component_mappings']}\n"
            result += f"Synonym groups: {data['counts']['synonym_groups']}\n\n"
            # Sample entries...
        else:
            # Full JSON dump
            import json
            result = json.dumps(data, indent=2)

        return [TextContent(type="text", text=result)]
    except httpx.RequestError as e:
        return [TextContent(type="text", text=f"RAG server unreachable: {e}")]
```

4. Repeat for both web and iOS MCP servers

## Todo List
- [x] Add tool definition to web MCP server `list_tools()`
- [x] Add `handle_expansions()` to web MCP server
- [x] Add tool definition to iOS MCP server `list_tools()`
- [x] Add `handle_expansions()` to iOS MCP server
- [ ] Test via MCP inspector or Claude Code

## Success Criteria
- `expansions` tool appears in MCP tool list
- Returns correct data from both servers
- Summary mode under 5KB
- Full mode returns complete mappings

## Risk Assessment
**Risks**: Token budget — full expansion data could be large (~3KB for iOS, ~2KB for web)
**Mitigation**: Default to summary mode; full mode opt-in

## Security Considerations
- Same security model as existing tools (local server, no auth)

## Next Steps
After completion:
1. Proceed to Phase 03 — update kit skills to use MCP tool
