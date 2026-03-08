---
phase: 1
title: "Fix RAG direct invocation — remove mcp-manager hop"
effort: 45m
depends: []
---

# Phase 1: RAG Direct Invocation

## Root Cause

Muji and other audit agents are spawned as subagents via Task tool. Subagents cannot call Task tool again — any `epost-mcp-manager` delegation silently fails. RAG is never queried; every audit falls to Glob fallback.

## Strategy

Option B: each agent owns its RAG queries. Call `ToolSearch("web-rag")` to discover MCP tools, then call status/catalog/query directly. mcp-manager kept only for non-RAG MCP tasks.

## Files to Modify

### 1. `packages/core/skills/audit/references/ui.md`

**Step 1 — Discover + Load Component Catalog (Web section)**

Replace:
```
2. Delegate RAG search to `epost-mcp-manager`: query = component name, scope = web — get related components
```

With:
```
2. ToolSearch("web-rag") → discover `mcp__web-rag-system__*` tools
3. Call `status` → confirm RAG available and module indexed
4. Call `catalog` with module filter → component list
5. Call `query` with component name → related components, prior patterns
6. If RAG unavailable: fallback to `Glob libs/klara-theme/src/lib/**/*.tsx`
7. Append "L2-RAG" or "L2-RAG-unavailable" to `knowledgeTiersUsed`
```

**Step 1 — iOS section**

Replace:
```
2. Delegate RAG search to `epost-mcp-manager`: query = component name, scope = iOS
```

With:
```
2. ToolSearch("ios-rag") → discover iOS RAG MCP tools → call directly (same pattern as web above)
```

---

### 2. `packages/design-system/agents/epost-muji.md`

**`### When to delegate to epost-mcp-manager` section**

Replace the current content with:

```markdown
### RAG Queries — Call Directly (not via mcp-manager)

For component catalog, pattern search, prior findings:
1. `ToolSearch("web-rag")` → discover available RAG MCP tools
2. Call `status` → health check
3. Call `catalog` / `query` as needed
4. If unavailable → fallback to Glob/Grep

Append `"L2-RAG"` or `"L2-RAG-unavailable"` to `knowledgeTiersUsed` in methodology.

**Do not delegate RAG queries to epost-mcp-manager** — subagents cannot spawn subagents.

### When to delegate to epost-mcp-manager

Restrict to **non-RAG MCP tasks only**:
- Resource listing (list available MCP servers)
- Tool discovery for non-RAG servers (Figma, Notion, etc.)
- Any MCP capability that is NOT catalog/query/status on a RAG server

Use **Template E** from `audit/references/delegation-templates.md`. Only when muji is running as the primary agent (not as a subagent) — if muji was invoked via Task tool, skip mcp-manager entirely.
```

---

### 3. `packages/core/agents/epost-code-reviewer.md`

**Pre-Audit KB Load section** — add RAG step:

After step 4 ("Compare documented API surface..."), add:

```markdown
5. RAG query (hybrid pass only): call `ToolSearch("web-rag")` → query prior findings and security patterns for this module → append "L2-RAG" or "L2-RAG-unavailable" to methodology
```

Also update **Skill References** to note: "`audit/references/delegation-templates.md` — structured Task tool prompts; **Note**: RAG queries bypass mcp-manager; call directly via ToolSearch"

---

### 4. `packages/core/skills/code-review/SKILL.md`

**Dispatch Protocol section** — add code-reviewer RAG step:

After "Critical escalation" subsection, add:

```markdown
**RAG lookup (hybrid audit pass):**
1. `ToolSearch("web-rag")` → discover `mcp__web-rag-system__*` tools
2. Call `status` → confirm available
3. Call `query` with module name + "prior findings security architecture" → surface known issues
4. Call `query` with "SEC PERF TS {component}" → pull previously indexed findings
5. If RAG unavailable: fallback to Grep on `reports/` for prior audit files
6. Append "L2-RAG" or "L2-RAG-unavailable" to methodology
```

---

### 5. `packages/core/skills/audit/references/delegation-templates.md`

**Template E** — add scope restriction:

After the template body, add:

```markdown
**Scope**: Use Template E for **non-RAG MCP queries only** (resource listing, Figma tool discovery, service-level MCP capabilities).

**Do NOT use Template E for RAG queries** (catalog, pattern search, prior findings). RAG queries bypass mcp-manager — call `mcp__web-rag-system__*` tools directly via `ToolSearch("web-rag")`. Reason: subagents cannot spawn further subagents via Task tool.
```

## Todo

- [ ] Edit `audit/references/ui.md` Step 1 Web + iOS sections
- [ ] Edit `epost-muji.md` MCP delegation section
- [ ] Edit `epost-code-reviewer.md` Pre-Audit KB Load + Skill References
- [ ] Edit `code-review/SKILL.md` Dispatch Protocol
- [ ] Edit `delegation-templates.md` Template E scope note
