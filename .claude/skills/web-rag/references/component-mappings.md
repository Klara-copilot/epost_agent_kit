# Web RAG — Component Mappings

Live data served by RAG server. Call the `expansions` MCP tool to get current mappings.

## How to Get Mappings

Call `expansions` tool (format: "full") on the web-rag MCP server.
Returns `component_mappings` dict: alias (lowercase) → canonical name.

## Usage

- Use canonical name in `component` filter: `filters={"component": "date-picker"}`
- Server handles alias detection automatically
- Do NOT generate synonym variants in queries — server expands them

## Notes

- CamelCase/PascalCase aliases are matched as single tokens
- If MCP tool unavailable, queries still work — server handles expansions internally.
  The mappings are for query planning guidance, not required.
