# IDE Converter Specs — Quick Reference

**Date**: 2026-04-06 | **Status**: ACTIONABLE

---

## SKILL.md — Cross-IDE Standard

All three IDEs (Cursor, Copilot, Claude Code) use the same SKILL.md frontmatter.

**Required fields**:
- `name`: max 64 chars, lowercase + hyphens, match directory name
- `description`: max 1024 chars, describe what + when to use

**Optional fields**:
- `license`, `compatibility`, `metadata`, `allowed-tools`
- `disable-model-invocation` (set true for slash-command-only)
- `user-invocable` (Copilot only; hide from `/` menu but allow auto-load)
- `argument-hint` (Copilot only; hint text for slash invocation)

**Discovery**: Pure LLM-based. No embeddings, no keyword matching. Description field is everything.

---

## Cursor Subagents — `.agents/*.md`

```yaml
---
name: Code Reviewer
description: Reviews code against team standards. Use when auditing code quality before merge.
model: inherit | fast | model-id
readonly: true | false
is_background: true | false
---
```

**All fields except name/description are optional.**

---

## Copilot Custom Agents — `.agent.md` (NEW in Nov 2025)

Replaced deprecated `.chat.md`. Location: `.github/agents/`

```yaml
---
name: Planner
description: Strategic planning and decomposition.
tools: ["*"] | ["read", "edit"] | ["mcp_tool_name"]
model: model-id (default: current selection)
handoffs: ["AgentName"]
---
```

---

## Copilot Custom Instructions — `.instructions.md`

Location: `.github/instructions/` (multiple files supported)

```yaml
---
applyTo: "**/*.ts,**/*.tsx"
excludeAgent: "code-review" | "coding-agent"
---
```

If `applyTo` omitted → instructions DO NOT auto-apply. `excludeAgent` omitted → applies to all agents.

---

## JetBrains AI Assistant — AGENTS.md

Repository-level guidance file. No subagent/skill format yet.

```markdown
- Project overview (language, build tool)
- Development rules (coding standards)
- Repository conventions (directory structure)
- Common tasks (build, test commands)
- Definition of done
```

Junie looks for: `.junie/guidelines.md` or `AGENTS.md` at repo root.

**ACP Emerging**: Agent Client Protocol (JSON config) under development; monitor Q2 2026.

---

## Windsurf Rules — `.windsurf/rules/*.md`

No agent/skill format. Rules are markdown, @mention-able, file-glob-scoped. **Low converter value.**

---

## Converter Roadmap

| IDE | Readiness | Phase 1 Action |
|-----|-----------|---|
| Cursor | ✅ Ready | Generate `.agents/*.md` subagents + `.agents/skills/*/SKILL.md` |
| Copilot | ✅ Ready | Generate `.github/agents/*.agent.md` + `.github/instructions/*.md` + skills |
| JetBrains | 🟡 Partial | Generate `AGENTS.md`; defer ACP until Q2 2026 |
| Windsurf | ⚠️ Limited | Skip agent generation; could generate `.windsurf/rules/` as markdown |

**All targets** should leverage SKILL.md standard — reuse skill metadata across all three.

---

## Key Findings

1. **SKILL.md is lingua franca** — Cursor, Copilot, Claude Code all support it identically
2. **Copilot .agent.md is official** — `.chat.md` deprecated (Nov 2025)
3. **Copilot excludeAgent scoping** — Fine-grained agent-specific instructions (Nov 2025)
4. **Cursor uses pure LLM discovery** — Description-driven, no embeddings
5. **Copilot MCP tools** — Custom agents can reference MCP server tools
6. **JetBrains ACP emerging** — Q2 2026 stabilization needed
7. **Windsurf no agents** — Rules-only system, low converter value

---

## Unresolved

- Copilot skill cross-references (likely not supported)
- JetBrains ACP stabilization timeline (need Q2 clarity)
- Cursor MCP tool discovery (implicit vs explicit registration)

See full report: `reports/260406-2114-ide-converter-spec-research-epost-researcher.md`
