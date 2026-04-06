---
status: ACTIONABLE
agent: epost-researcher
date: 2026-04-04
scope: MCP capabilities, Claude Code integration, connector patterns
research_engine: internal (system tool list) + context7 + knowledge skill
---

# Research: MCP Server Capabilities & Integration Patterns

## Asana MCP Capabilities

**Official Asana MCP Server** (`mcp__claude_ai_Asana__*` tools in Claude Code).

**Task Operations:**
- `get_task(task_id)`, `update_tasks([{task, name, assignee, due_on, completed, ...}])`, `delete_task()`
- `search_tasks_preview()` with filters: assignee, completed, due_on, created_on, start_on, text, projects
- Supports custom fields (priority enum, text, numbers)

**Project Management:**
- `get_project(id)`, `get_projects()`, `create_project()` with sections
- Section operations via project/task queries (no direct section API observed)
- `get_status_overview(keywords)` — status reports + task aggregation

**Collaboration:**
- `get_teams()`, `get_users()`, `search_objects()` (tasks, projects, portfolios, goals, tags, teams, users)
- `add_comment(task_id, text)` + `get_attachments(parent)`
- `create_project_status_update()` with color indicators (green/yellow/red/blue/complete)

**Portfolios:**
- `get_portfolio(gid)`, `get_portfolios()`, `get_items_for_portfolio(gid)`

**Auth:** OAuth flow required (`mcp__claude_ai_asana__authenticate`).

**Webhooks/Events:** NO event-based or webhook patterns documented. Polling-only integration.

---

## Claude Code + MCP Integration Patterns

**MCP Declaration** (in agent frontmatter):

```yaml
mcpServers:
  - name: asana
    config: {}  # or reference existing in .mcp.json / settings.json
```

**Configuration Sources:**
1. **Agent-level** (`mcpServers` field) — scoped to single agent
2. **Project-level** (`.mcp.json`) — shared across agents
3. **User-level** (`settings.json`) — global defaults

**Integration Mechanism:**
- MCP servers are NOT declared as skill dependencies
- Skills declare tool usage via `toolSearch()` or direct tool invocation
- No "connector skill" abstraction — tools are consumed directly
- Example: `simulator` skill lists `mcp__xcodebuildmcp__*` tools in frontmatter

**Permission Handling:**
- `allowedTools` whitelist applies to MCP tools (e.g., `allowedTools: [Read, mcp__asana__search_tasks]`)
- Agents with `permissionMode: plan` CANNOT use MCP tools (read-only override)
- Plugin sub-agents DO NOT support `mcpServers` (security restriction)

**Status:** CONFIRMED from agent-authoring-guide.md + cc-agent-spec.md.

---

## Connector Concept in Agent Frameworks

**Definition (from research):**
No industry standard term "connector skill" exists in LangChain, AutoGPT, or Zapier MCP. Similar patterns:
- **LangChain Agents:** Tools are loaded as-is; no wrapper abstraction
- **Zapier MCP:** Actions (create/update/search) → direct tool calls
- **OpenAI Assistants:** Tools → function calls → no intermediate layer
- **n8n Workflows:** Connectors are discrete nodes with HTTP backends

**ePost Approach (observed):**
- MCP tools are exposed directly to agents/skills
- Optional: skills can declare `context: fork` + dispatch to specialized agent for complex MCP workflows
- Example: `audit/SKILL.md` dispatches to `epost-mcp-manager` for RAG queries (not observed in current agents, but pattern described)

**Abstraction Level:** Tools-first, not connectors-first. Agents compose MCP tools directly.

---

## Available MCP Servers (Confirmed)

| Service | Official? | Auth | Key Capabilities | Webhooks |
|---------|-----------|------|------------------|----------|
| **Asana** | ✅ Claude AI | OAuth | Tasks, projects, portfolios, comments, status updates, search | ❌ No |
| **Jira** | ✅ Atlassian | OAuth | Create/edit issues, transitions, linking, JQL search, metadata | ❌ No |
| **Confluence** | ✅ Atlassian | OAuth | Create/update pages, inline/footer comments, CQL search | ❌ No |
| **Slack** | ✅ Claude AI | OAuth | Send/schedule messages, read threads, search public/private, canvases | ❌ No |
| **Gmail** | ✅ Google | OAuth | (requires authentication) | TBD |
| **Google Calendar** | ✅ Google | OAuth | (requires authentication) | TBD |
| **Figma** | ✅ Anthropic | OAuth | Design tokens, components, code-connect mapping | ❌ No |
| **Context7** | ✅ Anthropic | Auto | Library docs, framework APIs, SDK references | — |

**Pattern:** All official MCPs are read/write operations only. None expose webhook/event subscriptions.

---

## Integration Model Summary

### How Skills Use MCP

1. **Direct invocation:** Skill lists tool in frontmatter → calls `mcp__service__operation()`
2. **Agent dispatch:** Skill has `context: fork` + `agent: specialized-agent` → delegate complex MCP work
3. **No wrapper layer:** Tools are used directly, no intermediate "connector" skill

### Declaration Syntax

**Agent-level MCP:**
```yaml
---
name: my-agent
mcpServers:
  - name: asana
  - name: jira
---
```

**Skill-level MCP (via frontmatter tools list):**
```yaml
---
tools:
  - mcp__asana__search_tasks
  - mcp__asana__update_tasks
---
```

### Safety Constraints
- Plugin sub-agents cannot declare `mcpServers` (security boundary)
- `permissionMode: plan` blocks all tool use (read-only agents)
- OAuth auth is deferred (user grants on first tool invocation)

---

## Sources

| Source | Credibility | Coverage |
|--------|-------------|----------|
| System tool list (Claude Code) | High | Actual available MCPs, operations |
| `/epost_agent_kit/.claude/skills/kit-agent-development/references/` | High | Official CC agent spec, authoring guide |
| `/epost_agent_kit/CLAUDE.md` | High | ePost orchestration patterns |
| Asana npm registry | Medium | Package versions (3.1.x current) |

---

## Verdict

**ACTIONABLE** — MCP integration in Claude Code is tool-first, not connector-first. No standardized connector abstraction exists across agent frameworks. ePost's approach (direct tool usage, optional agent dispatch for complex workflows) aligns with industry patterns.

### Unresolved Questions
1. How are MCP tool discovery / tool search implemented? (ToolSearch pattern mentioned but not fully documented)
2. What's the exact flow for OAuth prompts on first tool use?
3. Can MCPs be dynamically added/removed at runtime, or only at startup?
4. Are there rate limits or retry patterns for MCP operations?

