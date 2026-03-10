---
phase: 4
title: "Muji audit delegation — docs-manager and mcp-manager"
effort: 1h
depends: [1]
---

# Phase 4: Muji Docs & MCP Delegation

## Overview

Formalize two delegation patterns that emerge during a muji UI component audit:

1. **Docs delegation** (`epost-docs-manager`) — when muji finds documentation issues (missing component docs, stale KB entries, undocumented API surface)
2. **MCP delegation** (`epost-mcp-manager`) — for RAG queries during audit (already implemented in code; needs a formal template and trigger conditions in epost-muji)

## Context

During a UI audit, muji encounters two categories of out-of-domain work:

- **Documentation retrieval (muji does this directly)**: When `docs/index.json` exists and entries are current, muji reads them in Step 1 KB load — no delegation needed.
- **Documentation gaps → delegate to epost-docs-manager**: When muji finds a component has no FEAT/CONV entry, an entry is stale (props mismatch), or the API surface is undocumented. Muji flags the gap and delegates docs *authoring/management* — it does not fix docs inline.
- **Knowledge retrieval via RAG → delegate to epost-mcp-manager**: When muji needs vector search to discover related components, find prior findings, or look up design tokens beyond what static `docs/index.json` covers. Muji delegates to mcp-manager (runtime tool discovery) rather than hard-coding server names.

Both patterns have been partially addressed at code level (MCP delegation updated in ui.md, web-ui-lib, ui-lib-dev), but there are no formal delegation templates or explicit trigger conditions in epost-muji's agent file.

## Requirements

### Functional

- Add **Template D** (Docs Audit delegation) to `delegation-templates.md` — triggered when muji audit finds missing/stale docs
- Add **Template E** (MCP/RAG Query delegation) to `delegation-templates.md` — formalize the pattern for runtime tool discovery
- Add `## Docs & MCP Delegation` section to `epost-muji.md` covering:
  - When to delegate to docs-manager (trigger conditions)
  - When to delegate to mcp-manager (trigger conditions)
  - How to incorporate their outputs back into the audit report

### Non-Functional

- Templates D and E under 20 lines each
- Trigger conditions are explicit (not "if you feel like it")
- Does not change existing direct-invocation behavior of epost-docs-manager or epost-mcp-manager

## Files to Modify

- `packages/core/skills/audit/references/delegation-templates.md` — add Templates D and E
- `packages/design-system/agents/epost-muji.md` — add Docs & MCP Delegation section

## Implementation Steps

### 1. Add Template D to `delegation-templates.md`

```markdown
**Template D: Documentation Audit Delegation (to epost-docs-manager)**
## Delegated Docs Audit
Scope: {component_name} — {file_list}
Mode: {library | consumer}
Trigger: {missing_docs | stale_docs | undocumented_api}
Existing registry: {docs/index.json path if found, or "not found"}

Expectations:
- Check if component has a docs/index.json entry (FEAT-* or CONV-*)
- If entry exists, verify it matches current API surface (props, variants, exports)
- If entry missing, draft a new FEAT-* entry for the component
- Flag stale docs with specific field-level mismatches

Boundaries:
- Do not modify source code
- Do not create full documentation from scratch — flag gaps and draft entry stubs only
- Report which docs paths you checked

Report back to: {calling_agent}
Output path: {reports_path}
```

### 2. Add Template E to `delegation-templates.md`

```markdown
**Template E: MCP/RAG Knowledge Query (to epost-mcp-manager)**
## MCP Knowledge Query
Query: {query_string}
Scope: {component_name | token_name | pattern_name}
Platform: {web | ios | android}
Purpose: {reuse_check | token_lookup | component_catalog | prior_findings}

Expectations:
- Discover available MCP/RAG tools for the given platform
- Execute query against the best available tool
- Return: matched component names, file paths, relevant excerpts

Boundaries:
- Query only — no writes, no code changes
- If no relevant tool is available, return "no RAG available" so caller can fall back to Glob/Grep
- Single-shot: one query per delegation

Report back to: {calling_agent}
```

### 3. Add to `epost-muji.md` — after `## Delegated Audit Intake`

```markdown
## Docs & MCP Delegation

### When to delegate to epost-docs-manager

**Muji reads docs directly** — if `docs/index.json` exists and entries are current, load them in Step 1 and proceed. No delegation needed for retrieval.

Trigger delegation to docs-manager only when audit reveals a **docs management gap**:
- Component has no `docs/index.json` entry (checked after Step 1 KB load)
- A loaded FEAT/CONV doc has fields that no longer match current source (stale props, renamed variants)
- Component exports new props/slots not present in any known KB entry

Use **Template D** from `audit/references/delegation-templates.md`. Wait for docs-manager report before finalizing audit verdict. Add output to a `## Docs Findings` section in your report; does not affect verdict score but listed as action items.

### When to delegate to epost-mcp-manager

Trigger delegation when you need runtime knowledge retrieval:
- Building `componentCatalog` (Step 1 — reuse check)
- Looking up a design token's canonical name or value
- Checking if a prior finding ID exists in the known-findings database

Use **Template E** from `audit/references/delegation-templates.md`. If mcp-manager returns "no RAG available", fall back to `Glob` + `Grep` for local discovery.

**Do not hardcode MCP server names.** Always delegate — mcp-manager handles tool discovery.
```

### 4. Add routing rows to muji's Task-Type Routing table

```markdown
| Docs gap found during audit | Template D to epost-docs-manager | Wait → add to Docs Findings section |
| Knowledge retrieval needed | Template E to epost-mcp-manager | Wait → use result in audit step |
```

## Todo List

- [x] Add Template D to `packages/core/skills/audit/references/delegation-templates.md`
- [x] Add Template E to `packages/core/skills/audit/references/delegation-templates.md`
- [x] Add `## Docs & MCP Delegation` section to `packages/design-system/agents/epost-muji.md`
- [x] Add routing rows for docs and MCP to muji's Task-Type Routing table
- [x] Verify all edits in `packages/` not `.claude/`

## Success Criteria

- Template D covers: trigger conditions, scope, docs-manager expectations, what to return
- Template E covers: single-shot query pattern, fallback instruction, boundaries
- epost-muji has explicit trigger conditions (not vague "when needed")
- muji knows what to do with docs-manager output (add to Docs Findings, not verdict)
- muji knows the MCP fallback path (Glob/Grep if no tool available)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Muji over-delegates docs — every audit spawns docs-manager | Med | Explicit trigger conditions; not triggered unless a gap is actually found |
| Template E too open-ended — mcp-manager doesn't know what to query | Low | Purpose field required; single-shot constraint keeps scope tight |
| Docs-manager findings inflate audit verdict | Low | Docs Findings section is informational only; verdict is unaffected |
