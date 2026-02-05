# Cross-Platform Agent/Skill Specification Formats

Created by Phuong Doan | 2026-02-05

## 1. Claude Code Agents

**Location**: `.claude/agents/*.md` (project) or `~/.claude/agents/*.md` (user-global)

**Format**: Markdown + YAML frontmatter. Body = system prompt.

### Frontmatter Fields

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | Agent identifier |
| `description` | Yes | Used for auto-delegation matching |
| `tools` | No | Allowlist: `Read, Glob, Grep, Bash, Edit, Write...` + MCP tools |
| `disallowedTools` | No | Denylist (inverse of `tools`) |
| `model` | No | `sonnet`, `opus`, `haiku`, `inherit` (default) |
| `permissionMode` | No | Controls permission prompt behavior |

```yaml
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---
You are a code reviewer...
```

### Key Behaviors
- Auto-delegation: Claude picks agent based on `description` match to task
- Progressive disclosure: only name+description loaded at startup; full prompt loaded on invocation
- Priority: project `.claude/agents/` > user `~/.claude/agents/`
- CLI: `--agents` flag accepts JSON with same fields + `prompt` for body
- Management: `/agents` command for interactive CRUD

Sources: [Claude Code Docs](https://code.claude.com/docs/en/sub-agents), [Anthropic Engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

---

## 2. Cursor

### 2a. AGENTS.md (Cross-Tool Standard)

**Location**: `AGENTS.md` at any directory level (hierarchical inheritance)

**Format**: Plain Markdown, no frontmatter. Closest to edited file wins.

Stewarded by Agentic AI Foundation (Linux Foundation). Supported by Cursor, Codex, Amp, Jules.

```
project/
  AGENTS.md              # Global
  frontend/AGENTS.md     # Frontend-specific override
  backend/AGENTS.md      # Backend-specific override
```

### 2b. Rules (.cursor/rules/*.mdc)

**Location**: `.cursor/rules/*.mdc` (project), migrating to `RULE.md` in Cursor 2.2+

**Format**: Markdown + YAML frontmatter (3 fields only)

| Field | Type | Purpose |
|---|---|---|
| `description` | string | UI display + agent filtering |
| `globs` | string | Comma-separated file globs for auto-attach |
| `alwaysApply` | boolean | Always include in context |

### Rule Type Inference (no explicit type field)

| Combo | Type | Behavior |
|---|---|---|
| `alwaysApply: true` | Always | Always in context |
| `globs` only | Auto-Attach | Matches current file |
| `description` only | Agent | Agent-queryable, not auto-attached |
| Neither | Manual | Must be @-mentioned |

```yaml
---
description: TypeScript coding standards
globs: "**/*.ts,**/*.tsx"
alwaysApply: false
---
# TypeScript Standards
...
```

### 2c. Commands (.cursor/commands/*.md)

**Location**: `.cursor/commands/*.md` (project) or `~/.cursor/commands/*.md` (user-global)

**Format**: Plain Markdown only. NO frontmatter supported.

Invoked via `/command-name` in Agent input. Content becomes the prompt with full project context. Commands carry more weight than rules (they ARE the prompt vs appended context).

```
.cursor/commands/
  review-code.md
  create-component.md
```

Sources: [Cursor Rules Docs](https://cursor.com/docs/context/rules), [AGENTS.md Spec](https://agents.md/), [Cursor Skills Docs](https://cursor.com/docs/context/skills)

---

## 3. GitHub Copilot

### 3a. Agents (.github/agents/*.agent.md)

**Format**: Markdown + YAML frontmatter

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | Display name |
| `description` | Yes | Agent purpose |
| `tools` | No | Array: `['read', 'edit/editFiles', 'search/codebase']` |
| `model` | No | e.g., `GPT-4o`, `Claude Sonnet 4` (VS Code only) |
| `target` | No | `vscode` or `github-copilot` |
| `handoffs` | No | Array of workflow transitions (VS Code only) |

#### Handoffs Format
```yaml
handoffs:
  - label: "Implement Plan"      # Button text
    agent: agent                   # Target agent
    prompt: "Implement the plan"   # Pre-filled message
    send: false                    # Auto-submit? (default false)
```

```yaml
---
name: API Architect
description: Guides API design with REST best practices
tools: ['read', 'edit/editFiles', 'search/codebase']
model: GPT-4o
handoffs:
  - label: Implement
    agent: implementer
    prompt: Implement the API design above
    send: false
---
You are an API architect...
```

Note: `model`, `argument-hint`, `handoffs` ignored on github.com coding agent; VS Code only.

### 3b. Instructions (.github/instructions/*.instructions.md)

**Format**: Markdown + YAML frontmatter

| Field | Required | Notes |
|---|---|---|
| `description` | Recommended | 1-500 chars |
| `applyTo` | Recommended | Glob pattern (e.g., `**/*.ts`) |
| `excludeAgent` | No | `"code-review"` or `"coding-agent"` |

```yaml
---
description: TypeScript coding standards
applyTo: "**/*.ts"
---
- Use strict mode
- Prefer interfaces over types
```

Passive context: auto-attached when working on matching files.

### 3c. Prompts (.github/prompts/*.prompt.md)

**Format**: Markdown + YAML frontmatter

| Field | Required | Notes |
|---|---|---|
| `description` | No | Purpose description |
| `agent` | No | Target agent (e.g., `agent`) |
| `model` | No | Model override |
| `tools` | No | Array of tool names |

Invoked via `/prompt-name` in Copilot Chat. Task-specific, on-demand templates.

```yaml
---
description: Generate a new React component
agent: agent
tools: ['githubRepo', 'search/codebase']
---
Create a React component that...
```

Sources: [GitHub Docs - Custom Agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents), [GitHub Docs - Instructions](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot), [VS Code Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

---

## 4. Cross-Platform Mapping Summary

| Concept | Claude Code | Cursor | GitHub Copilot |
|---|---|---|---|
| **Agent def** | `.claude/agents/*.md` | N/A (uses AGENTS.md) | `.github/agents/*.agent.md` |
| **Always-on rules** | `CLAUDE.md` | `.cursor/rules/*.mdc` (alwaysApply) | `.github/copilot-instructions.md` |
| **File-scoped rules** | N/A | `.cursor/rules/*.mdc` (globs) | `.github/instructions/*.instructions.md` (applyTo) |
| **Slash commands** | `/agents` built-in | `.cursor/commands/*.md` | `.github/prompts/*.prompt.md` |
| **Cross-tool standard** | N/A | AGENTS.md | AGENTS.md |
| **Frontmatter** | YAML (name, desc, tools, model) | YAML (desc, globs, alwaysApply) | YAML (name, desc, tools, model, handoffs) |
| **Delegation** | Auto (description match) | N/A | Handoffs (manual buttons) |
| **Model override** | Yes (per-agent) | No | Yes (VS Code only) |
| **Tool restriction** | Yes (allowlist/denylist) | No | Yes (allowlist) |

## 5. Unresolved Questions

1. Cursor AGENTS.md: does Cursor support agent-level tool restriction or model override within AGENTS.md? Current evidence says no.
2. Claude Code: no equivalent to Copilot's `applyTo` glob-scoped instructions; is this planned?
3. GitHub Copilot coding agent (github.com): when will `handoffs` be supported outside VS Code?
4. AGENTS.md spec: will it evolve to include structured frontmatter (tools, model) or remain pure markdown?
