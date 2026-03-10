# Phase 02: Consolidate Reference Files

## Context Links
- Parent plan: [plan.md](./plan.md)
- Phase 01: [phase-01-rewrite-skills.md](./phase-01-rewrite-skills.md)

## Overview
**Date**: 2026-03-04
**Priority**: P2
**Description**: Remove or trim reference files that duplicate MCP tool data or contain hardcoded values
**Implementation Status**: Pending

## Key Insights

### Current Reference Files

**Web (`packages/platform-web/skills/web-rag/references/`)**:
- `query-patterns.md` (440 lines) — 90% hardcoded example queries with hardcoded filter values
- `smart-query.md` (124 lines) — HyDE procedural guide (GOOD, keep with minor edits)
- `component-mappings.md` (21 lines) — Already points to MCP tool (done in PLAN-0030)
- `synonym-groups.md` (28 lines) — Already points to MCP tool (done in PLAN-0030)

**iOS (`packages/platform-ios/skills/ios-rag/references/`)**:
- `query-patterns.md` (606 lines) — 90% hardcoded examples with hardcoded project names
- `smart-query.md` (105 lines) — HyDE procedural guide (GOOD, keep with minor edits)
- `component-mappings.md` (23 lines) — Already points to MCP tool (done in PLAN-0030)
- `synonym-groups.md` — Same as above

**Sidecar (in `.claude/skills/` only, not in packages)**:
- `sidecar-workflow.md` — Good procedural guide, but references `generate_sidecar` MCP tool that doesn't exist on web

### Action Plan

| File | Action | Reason |
|------|--------|--------|
| `query-patterns.md` | DELETE | 440-600 lines of hardcoded examples. Agent learns patterns from smart-query + MCP tool schema |
| `smart-query.md` | TRIM | Remove hardcoded filter values, keep HyDE procedure |
| `component-mappings.md` | KEEP | Already dynamic (PLAN-0030) |
| `synonym-groups.md` | KEEP | Already dynamic (PLAN-0030) |
| `sidecar-workflow.md` | MOVE to packages + fix | Currently only in `.claude/` (generated). Move to `packages/` as source of truth. Fix web version: remove `generate_sidecar` MCP tool reference, use REST API mention |

## Requirements
### Functional
- Remove `query-patterns.md` from both platforms
- Trim `smart-query.md` to remove hardcoded values
- Move `sidecar-workflow.md` from `.claude/` to `packages/` (source of truth)
- Fix sidecar-workflow web: clarify no MCP tool for sidecar generation, REST only

### Non-Functional
- Total reference files per platform: 4 -> 4 (query-patterns removed, sidecar-workflow added)
- Token savings: ~1000+ tokens per skill load (removing 440-600 line files)

## Related Code Files
### Delete
- `packages/platform-web/skills/web-rag/references/query-patterns.md` [DELETE]
- `packages/platform-ios/skills/ios-rag/references/query-patterns.md` [DELETE]

### Modify (EXCLUSIVE)
- `packages/platform-web/skills/web-rag/references/smart-query.md` [OWNED]
- `packages/platform-ios/skills/ios-rag/references/smart-query.md` [OWNED]

### Create
- `packages/platform-web/skills/web-rag/references/sidecar-workflow.md` [OWNED]
- `packages/platform-ios/skills/ios-rag/references/sidecar-workflow.md` [OWNED]

### Read-Only
- `.claude/skills/web-rag/references/sidecar-workflow.md` — existing generated content (reference)
- `.claude/skills/ios-rag/references/sidecar-workflow.md` — existing generated content (reference)

## Implementation Steps

### 1. Delete query-patterns.md (both platforms)

These files are 440-600 lines of static query examples with hardcoded filter values like `project: "luz_theme_ui"`, `topic: "design-system"`, `file_type: "scss"`. Agent should discover valid values at runtime via `status`/`filters`/`catalog` tools.

Replace with nothing — the SKILL.md Query Strategy section + smart-query.md provide sufficient procedural guidance.

### 2. Trim smart-query.md (both platforms)

Remove from web `smart-query.md`:
- Line 76-81: Hardcoded filter examples with specific values -> replace with generic pattern
- Line 91-92: Hardcoded component names ("Dialog", "ConfirmationModal") -> use generic example

Remove from iOS `smart-query.md`:
- Line 36-37: Hardcoded type names ("EPButton", "ButtonToken") -> use generic placeholders
- Lines 80-81: Hardcoded limitation note about phrase matching -> keep but trim

Both: Replace specific worked examples with GENERIC examples:
```
| User Query | HyDE Passage |
|-----------|-------------|
| "how does [concept] work?" | Write ~50-100 word hypothetical code snippet describing implementation |
```

### 3. Move sidecar-workflow.md to packages

Copy `.claude/skills/{web,ios}-rag/references/sidecar-workflow.md` to `packages/platform-{web,ios}/skills/{web,ios}-rag/references/sidecar-workflow.md`.

Web version edits:
- Remove reference to `generate_sidecar` as MCP tool
- Note: sidecar generation is via REST API (`POST /api/rag/sidecar`) or handled by indexing pipeline
- Keep the "When to Generate" / "When NOT" / "Metadata Fields" / "Verification" sections

iOS version edits:
- Same corrections — clarify REST endpoint
- Keep procedural workflow unchanged

### 4. Update SKILL.md References sections

After deletions, update the "References" section in both SKILL.md files (from Phase 01) to reflect actual files:
```
## References
- `references/smart-query.md` — HyDE + multi-query retrieval strategy
- `references/sidecar-workflow.md` — AI-generated metadata enrichment
- `references/component-mappings.md` — Get canonical names via `expansions` MCP tool
- `references/synonym-groups.md` — Get synonym groups via `expansions` MCP tool
```

## Todo List
- [ ] Delete web `query-patterns.md`
- [ ] Delete iOS `query-patterns.md`
- [ ] Trim web `smart-query.md` — remove hardcoded values
- [ ] Trim iOS `smart-query.md` — remove hardcoded values
- [ ] Move+fix web `sidecar-workflow.md` to packages
- [ ] Move+fix iOS `sidecar-workflow.md` to packages
- [ ] Update References sections in both SKILL.md files

## Success Criteria
- No `query-patterns.md` files in either platform
- `smart-query.md` has zero hardcoded component names, project names, or filter values
- `sidecar-workflow.md` exists in `packages/` (source of truth), not just `.claude/`
- Sidecar docs accurately describe available tools (REST, not MCP for sidecar generation)

## Risk Assessment
**Risks**: Removing query-patterns.md means agent has fewer examples to learn from
**Mitigation**: smart-query.md HyDE procedure is the real quality driver; generic examples in SKILL.md Query Strategy section sufficient; MCP tool descriptions are self-documenting

## Security Considerations
None

## Next Steps
After completion:
1. Run `epost-kit init` to regenerate `.claude/` from packages
2. Test agent workflow: load skill -> call status -> form query -> get results
