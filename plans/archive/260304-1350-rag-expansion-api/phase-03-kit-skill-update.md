# Phase 03: Kit Skill Update

## Context Links
- Parent plan: [plan.md](./plan.md)
- Phase 02: [phase-02-mcp-tool.md](./phase-02-mcp-tool.md)

## Overview
**Date**: 2026-03-04
**Priority**: P2
**Description**: Replace hardcoded component-mappings.md and synonym-groups.md in kit skills with instructions to call the `expansions` MCP tool
**Implementation Status**: Completed 2026-03-04

## Key Insights
- 4 files to replace: web + iOS x (component-mappings + synonym-groups)
- `smart-query.md` references both files — needs pointer update
- `scout/SKILL.md` and `knowledge-retrieval/references/search-strategy.md` reference these files
- Skill reference files are installed to `.claude/skills/` via `epost-kit init` — changes go in `packages/`

## Requirements
### Functional
- Remove hardcoded mapping data from skill reference files
- Replace with instructions: "Call `expansions` MCP tool to get current data"
- Keep the "Impact on Query Strategy" guidance (HyDE yes, synonyms no) — this is procedural knowledge, not data
- smart-query.md: update cross-references

### Non-Functional
- Skill files much smaller (< 1KB each, down from 2-4KB)
- Agent knows to call tool once and cache result

## Architecture
Before: Skill loads -> agent reads hardcoded mappings from reference file
After: Skill loads -> agent calls `expansions` MCP tool -> gets live data

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/platform-web/skills/web-rag/references/component-mappings.md` [OWNED]
- `packages/platform-web/skills/web-rag/references/synonym-groups.md` [OWNED]
- `packages/platform-ios/skills/ios-rag/references/component-mappings.md` [OWNED]
- `packages/platform-ios/skills/ios-rag/references/synonym-groups.md` [OWNED]
- `packages/platform-web/skills/web-rag/references/smart-query.md` [OWNED]
- `packages/platform-ios/skills/ios-rag/references/smart-query.md` [OWNED]

### Read-Only
- `packages/core/skills/scout/SKILL.md` — References these files; verify still works
- `packages/core/skills/knowledge-retrieval/references/search-strategy.md` — Cross-ref

## Implementation Steps

1. Replace `component-mappings.md` (both platforms) with:
```markdown
# {Web|iOS} RAG -- Component Mappings

Live data served by RAG server. Call the `expansions` MCP tool to get current mappings.

## How to Get Mappings

Call `expansions` tool (format: "full") on the {web|ios}-rag MCP server.
Returns `component_mappings` dict: alias (lowercase) -> canonical name.

## Usage

- Use canonical name in `component` filter: `filters={"component": "date-picker"}`
- Server handles alias detection automatically
- Do NOT generate synonym variants in queries -- server expands them

## Notes
- CamelCase/PascalCase aliases are matched as single tokens
- {iOS-specific: word-by-word only, no phrase matching}
```

2. Replace `synonym-groups.md` (both platforms) with:
```markdown
# {Web|iOS} RAG -- Synonym Groups

Live data served by RAG server. Call the `expansions` MCP tool to get current groups.

## How to Get Synonym Groups

Call `expansions` tool (format: "full") on the {web|ios}-rag MCP server.
Returns `synonyms` dict: group key -> list of synonym terms.

## Impact on Query Strategy

| Technique | Use? | Reason |
|-----------|:----:|--------|
| HyDE passage | YES | Server can't generate hypothetical code |
| Structural variants (1-2) | YES | Different angle, not synonyms |
| Synonym variants | NO | Server already handles |
| Component filter w/ canonical | YES | Use canonical from expansions tool |
```

3. Update `smart-query.md` references — change "see component-mappings.md" to "call `expansions` MCP tool"

## Todo List
- [x] Rewrite web `component-mappings.md`
- [x] Rewrite web `synonym-groups.md`
- [x] Rewrite iOS `component-mappings.md`
- [x] Rewrite iOS `synonym-groups.md`
- [x] Update web `smart-query.md` cross-references
- [x] Update iOS `smart-query.md` cross-references
- [x] Verify scout SKILL.md references still valid (no references found)
- [ ] Run `epost-kit init` to regenerate `.claude/` (pending — user action)

## Success Criteria
- All 4 reference files replaced with MCP tool instructions
- smart-query.md cross-references updated
- No hardcoded mapping data in kit skill files
- Procedural knowledge (HyDE strategy) preserved

## Risk Assessment
**Risks**: If RAG server is down, agent has no expansion data at all (currently has hardcoded fallback)
**Mitigation**: Keep a note in skill file: "If MCP tool unavailable, queries still work -- server handles expansions internally. The mappings are for query planning guidance, not required."

## Security Considerations
- No security impact — removing data, not adding

## Next Steps
After completion:
1. Run `epost-kit init` to regenerate `.claude/` from packages
2. Test agent workflow: load skill -> call expansions tool -> use data in query planning
