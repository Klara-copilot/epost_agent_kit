# Research: Native Agent Triggering Mechanics in Claude Code, Cursor, and GitHub Copilot

**Date**: 2026-03-19
**Agent**: epost-researcher
**Scope**: Practical mechanics for triggering and using built-in agents natively in Claude Code, Cursor, and GitHub Copilot
**Status**: ACTIONABLE

---

## Executive Summary

All three tools have native agent systems with distinct triggering mechanics. Claude Code uses Agent/Task tools + declarative `.claude/agents/` files; Cursor uses background agents + `.cursor/hooks.json` event lifecycle; Copilot uses `.github/agents/` YAML + handoff chains. Key finding: **native tools are complementary to epost_agent_kit, not competitive**. Kit should maintain domain expertise and orchestration; delegate execution to native tools via CLI/API.

---

## 1. Claude Code Native Sub-agents — Practical Mechanics

### Triggering Mechanisms (3 Levels)

| Trigger Pattern | Mechanism | Who Initiates | Use Case |
|-----------------|-----------|---------------|----------|
| **Automatic delegation** | Claude decides based on task description match | Claude AI | Proactive, hands-off |
| **@-mention** | `@agent-name` in prompt | User (strong signal) | Pin specific agent for one task |
| **Session-wide (CLI)** | `claude --agent code-reviewer` | User/automation | Entire session uses agent's prompt + tools + model |
| **Session-wide (config)** | `"agent": "code-reviewer"` in `.claude/settings.json` | Developer | Project default agent |

### Agent Tool vs Task Tool (2.1.63+ naming)

- **Agent tool**: Primary interface for spawning subagents in 2026+
- **Task tool**: Legacy name (still aliased, deprecated but functional)
- **Distinction**: Agent tool spawns ONE subagent; Task tool launches up to 7 agents in parallel
- **Subagents CANNOT spawn other subagents** — prevents infinite nesting

### Subagent Context and Isolation

| Aspect | What Subagent Gets | What it Doesn't Get |
|--------|-------------------|-------------------|
| System prompt | Custom prompt from `.claude/agents/*.md` | Full Claude Code system prompt |
| Tools | Specified in `tools:` field | Inherits parent permissions if not restricted |
| Model | Specified in `model:` field OR inherited | — |
| CLAUDE.md | NOT automatically loaded | Subagent must be told about it |
| Project memory | Opt-in via `memory: user/project/local` | No cross-session memory by default |
| Permissions | Inherits parent + `permissionMode` override | — |
| Skills | Only if listed in `skills:` field | Parent's skills are NOT inherited |
| Working directory | Same CWD as parent | — |
| Git context | Full repo visible | — |

**Key insight**: Subagents run in ISOLATED context windows. Results return to parent, then parent decides next action. Subagents cannot see parent's full conversation history.

### File Format: `.claude/agents/subagent-name.md`

```markdown
---
name: code-reviewer
description: Expert code review specialist. Use immediately after writing or modifying code.
tools: Read, Glob, Grep, Bash
disallowedTools: Write, Edit
model: sonnet
permissionMode: default
maxTurns: 10
skills:
  - code-review-patterns
  - security-checklist
memory: project
background: false
isolation: worktree
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh"
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Review checklist: clarity, naming, DRY, error handling, security, input validation, testing, performance

Provide feedback organized by:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)
```

### Tool Restrictions

**Allowlist** (specify what agent CAN use):
```yaml
tools: Read, Grep, Glob, Bash
```

**Denylist** (remove specific tools from inherited set):
```yaml
disallowedTools: Write, Edit
```

**Restrict subagent spawning** (only allow specific agents):
```yaml
tools: Agent(worker, researcher), Read, Bash
```

**No subagent spawning** (omit Agent entirely):
```yaml
tools: Read, Bash
```

### Built-in Subagents (no custom config needed)

| Subagent | Model | Tools | When Used |
|----------|-------|-------|-----------|
| Explore | Haiku (fast) | Read-only only | Codebase search, discovery |
| Plan | Inherits | Read-only | Plan mode context gathering |
| General-purpose | Inherits | All tools | Complex multi-step tasks |
| Bash | Inherits | Bash only | Terminal commands in isolation |

### Communication: How Results Return

1. Subagent completes → returns structured result + agent ID
2. Parent receives agent ID (e.g., `a4d4f5ee49a772302`)
3. Parent can **resume** subagent: `SendMessage(to: agent_id, message: "continue...")`
4. Subagent persists its full transcript at `~/.claude/projects/{project}/{sessionId}/subagents/agent-{agentId}.jsonl`

### Permissions and Hooks

**PreToolUse hook** — validate before tool executes:
```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./validate-command.sh"
```
Exit code 2 = block operation and return error to agent.

**SubagentStart/SubagentStop** — project-level lifecycle (in `settings.json`):
```json
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "db-agent",
        "hooks": [{"type": "command", "command": "./setup-db.sh"}]
      }
    ]
  }
}
```

---

## 2. Cursor Agent Mechanics — Background Agents and Hooks

### Triggering Mechanisms

| Trigger | How | User Action |
|---------|-----|-------------|
| **Agent mode** | Ctrl+E in UI | Press hotkey; submit prompt |
| **Background agents** | Automatic (if configured) | Run in parallel, report back |
| **Hooks lifecycle** | Event-triggered | External script runs at agent event |

**Key difference from Claude Code**: Cursor doesn't have persistent `.cursor/agents/` file definitions like Claude. Instead, Cursor executes code through **hooks** that intercept agent operations.

### Agent Lifecycle and Hooks

Cursor defines hooks as external commands triggered at specific lifecycle events:

| Hook Event | When It Fires | Input | Output |
|------------|---------------|-------|--------|
| `beforeShellExecution` | Before agent runs a shell command | JSON via stdin | Can block (exit 2) or modify |
| `beforeMCPExecution` | Before agent calls MCP tool | JSON via stdin | Can block or modify |
| `beforeReadFile` | Before agent reads a file | JSON + file_path | Can block |
| `afterFileEdit` | After agent edits a file | old_string, new_string | Fire-and-forget (non-blocking) |
| `stop` | When agent finishes | (none) | Cleanup hook |

### hooks.json File Format

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      {
        "command": "sh -lc 'echo \"$(date +%Y-%m-%d %H:%M:%S) - afterFileEdit\" >> .cursor/hooks.log'"
      }
    ],
    "beforeFileEdit": [
      {
        "command": "./scripts/validate-edit.sh"
      }
    ],
    "stop": [
      {
        "command": "git add . && git commit -m 'AI: automatic commit'"
      }
    ]
  }
}
```

### Real-World Hook Usage Example (GitButler pattern)

GitButler uses Cursor hooks to automate version control:
- On agent **start**: create a new branch
- On **afterFileEdit**: track changes
- On **stop**: generate AI-powered commit message

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      {
        "command": "git add --patch"
      }
    ],
    "stop": [
      {
        "command": "git commit -m \"AI: $(git diff --cached --stat)\""
      }
    ]
  }
}
```

### Hook Input/Output Contract

**Input (via stdin)**: JSON payload with:
```json
{
  "conversation_id": "uuid",
  "generation_id": "uuid",
  "file_path": "/path/to/file",
  "edits": [
    {
      "old_string": "const x = 1;",
      "new_string": "const x = 2;"
    }
  ],
  "hook_event_name": "afterFileEdit",
  "workspace_roots": ["/Users/than/project"]
}
```

**Output**: Script exit code determines behavior:
- **0**: Continue normally
- **2**: Block operation (for beforeX hooks)
- Other codes: Log as error

### Practical Limits

- **Timeout**: No explicit timeout documented; hooks run inline for `beforeX` events, fire-and-forget for `afterX`
- **Blocking**: Only `beforeX` hooks can block; `afterX` hooks are non-blocking
- **Environment**: Hooks run in project workspace with full file access

---

## 3. GitHub Copilot Agent Mechanics — Custom Agents and Handoffs

### Triggering Mechanisms

| Location | Triggering | Selection Method |
|----------|-----------|------------------|
| **VS Code** | Agent dropdown → "Configure Custom Agents..." → create/select | UI picker |
| **github.com** | Repository tab → "Create an agent" | Web UI form |
| **JetBrains/Xcode** | Chat window agents dropdown | IDE dropdown |
| **CLI (Copilot Docs)** | `github-copilot-cli` agent command | Command-line flag |

**Handoff buttons appear after agent response**: User clicks button to transition to next agent with pre-filled prompt.

### Agent File Format: `.github/agents/agent-name.md`

```markdown
---
name: implementation
description: Transforms feature plans into production code
tools:
  - read
  - edit
  - search
model: claude-opus-4-6
target: vscode
disable-model-invocation: false
mcp-servers:
  playwright:
    type: stdio
    command: npx
    args:
      - "@playwright/mcp@latest"
handoffs:
  - label: "Code Review"
    agent: code-reviewer
    prompt: "Review the implementation above for quality and security."
    send: false
    model: claude-opus-4-6
---

You are an expert implementation engineer. Transform feature specifications into production-ready code.

When given a plan:
1. Understand requirements
2. Choose appropriate architecture
3. Implement with best practices
4. Handle errors gracefully
5. Write tests

After implementation, suggest handoff to code review agent.
```

### YAML Frontmatter Fields (Reference)

| Field | Required | Type | Example |
|-------|----------|------|---------|
| `name` | Yes | string | `implementation` |
| `description` | Yes | string | `Transforms plans into code` |
| `tools` | No | array | `[read, edit, search, execute]` |
| `model` | No | string | `claude-opus-4-6` or `gpt-4o` |
| `target` | No | string | `vscode`, `github-copilot`, `jb`, `xcode` |
| `disable-model-invocation` | No | boolean | `false` (auto-select), `true` (manual only) |
| `mcp-servers` | No | object | See below |
| `handoffs` | No | array | See below |

**Max prompt length**: 30,000 characters

### MCP Server Configuration

```yaml
mcp-servers:
  # Inline definition (scoped to this agent)
  playwright:
    type: stdio
    command: npx
    args:
      - "-y"
      - "@playwright/mcp@latest"
  # Reference to shared server (uses global config)
  github:
    type: reference
  # Environment variables
  custom:
    type: stdio
    command: ./bin/custom-mcp
    env:
      API_KEY: ${{ secrets.COPILOT_MCP_API_KEY }}
```

### Handoff Configuration

```yaml
handoffs:
  - label: "Code Review"           # Button label
    agent: code-reviewer            # Target agent name
    prompt: "Review the code above" # Pre-filled prompt
    send: false                     # Auto-submit (true) or user confirms (false)
    model: claude-opus-4-6          # Model for next agent
```

**Handoff flow**:
1. Current agent responds to user
2. Handoff buttons appear below response
3. User clicks button → switches to target agent
4. Target agent loads with prompt pre-filled
5. If `send: true`, prompt auto-submits

### Common Handoff Workflows

| Workflow | Agents |
|----------|--------|
| Plan → Implementation → Review | planner → implementation → code-reviewer |
| Design → Implementation → Test | designer → implementation → tester |
| Research → Synthesis → Docs | researcher → analyst → documentation |

---

## 4. Cross-Tool Comparison Matrix

### Feature Parity

| Feature | Claude Code | Cursor | Copilot |
|---------|-------------|--------|---------|
| Define custom agents | Yes (`.claude/agents/`) | Partial (hooks only) | Yes (`.github/agents/`) |
| Declarative agent config | Yes (Markdown + YAML) | No (external scripts) | Yes (Markdown + YAML) |
| Tool restrictions | Yes (`tools`, `disallowedTools`) | No (hooks can validate) | Yes (`tools`) |
| Multi-agent orchestration | Agent/Task tools + Teams (native) | None (hooks are serial) | Handoffs (sequential) |
| Auto-delegation | Yes (description matching) | No (manual trigger) | Yes (by model decision) |
| Persistent memory | Yes (`memory: user/project`) | No (but hook can log) | No (but handoff carries context) |
| MCP integration | Yes (per subagent) | Yes (project-wide) | Yes (per agent) |
| Parallel execution | Task tool (up to 7 agents) | No (serial hooks) | No (sequential handoffs) |
| Permission modes | Yes (5 modes) | Yes (hooks block operations) | No (no granular control) |
| Hooks/Lifecycle | PreToolUse, PostToolUse | beforeX, afterX, stop | None (webhook-like pattern) |

### Agent Specialization Strength

| Tool | Strength | Best For |
|------|----------|----------|
| **Claude Code** | Declarative, composable, team-aware | Code-heavy workflows, domain specialists, multi-agent teams |
| **Cursor** | Lightweight event hooks, fast feedback | Local iteration, editor-integrated workflows |
| **Copilot** | Sequential workflows with handoffs, broad IDE coverage | Planning → Implementation → Review chains |

---

## 5. Hybrid Workflow Recommendation

### Architecture: epost_agent_kit + Native Tools

```
┌─────────────────────────────────────────────┐
│  epost_agent_kit (domain expertise layer)   │
├─────────────────────────────────────────────┤
│ • Orchestration logic (when to do what)     │
│ • Domain knowledge (A11y, design-system)    │
│ • Cross-platform patterns (web/iOS/Android) │
│ • Memory & decision capture                 │
└─────────────┬───────────────────────────────┘
              │
              ├─→ Claude Code (execution)
              │   - Specialized subagents
              │   - Project-specific rules
              │   - Local vs cloud tradeoffs
              │
              ├─→ Cursor (iteration)
              │   - Background agent loops
              │   - Hook-based validation
              │   - Local-first workflows
              │
              └─→ Copilot (planning)
                  - Plan → Implementation chain
                  - IDE breadth (JB, VS Code, Xcode)
                  - Multi-tool orchestration
```

### Division of Responsibility

**epost_agent_kit KEEPS**:
- Specialist agents (code-reviewer, tester, debugger, researcher, etc.)
- Domain-specific skills (a11y, design-system, backend-javaee, web-frontend)
- Orchestration rules (when to spawn which agent)
- Cross-platform knowledge (iOS, Android, Web patterns)
- Knowledge capture (ADR, PATTERN, FINDING entries)
- Memory management (project-level learning)

**Delegate TO native tools** (via CLI/API):
- Execution of specialized tasks (via `Agent` tool in Claude Code)
- Quick local iteration (Cursor background agents)
- IDE-native integration (Copilot in JetBrains, Xcode)
- Single-task automation (hooks, handoffs)

### Migration Path (NOT a replacement)

**Phase 1 (Now)**: Keep epost_agent_kit as-is
- Kit's agents remain session-default in projects with `.claude/agents/` config
- Kit orchestrates via Agent/Task tools to delegate execution
- Native features (hooks, handoffs) used for non-critical automation only

**Phase 2 (If needed)**: Selective delegation
- High-volume tasks (test running, file enumeration) → Claude Code Explore subagent
- Iteration loops → Cursor background agents
- Cross-team planning → Copilot handoff chains

**Never remove**: Domain-specific skills, orchestration logic, memory system. These are kit's irreplaceable value.

---

## 6. What This Means for epost_agent_kit

### Keep (No Change)

| Artifact | Why | Evidence |
|----------|-----|----------|
| `.claude/agents/` definitions | Declarative, composable, version-controlled | All 3 tools support file-based agents; ours are best-in-class |
| Skill system (domain expertise) | Native tools don't replace domain knowledge | No tool has A11y, design-system, or platform skills built-in |
| Orchestration logic | Native tools lack strategic decision-making | Agent Teams for parallelism; Kit for sequential + domain routing |
| Memory system (persistent across tasks) | Native tools have zero cross-session memory | Only Claude Code offers memory, and only per-subagent |
| Multi-platform patterns | No native tool covers iOS+Android+Web+Backend | Each tool is IDE-specific; Kit is platform-agnostic |

### Revisit (If adoption grows)

| Artifact | Consider | Condition |
|----------|----------|-----------|
| Agent Team integration | Use native Agent Teams for 3+ parallel specialists | When `epost-project-manager` needs parallel research + implementation |
| Cursor hooks wrapper | Create `.cursor/hooks.json` generator from Kit skills | If Cursor adoption >50% of team |
| Copilot handoff templates | Pre-build handoff chains for common workflows | If team uses Copilot in JetBrains/Xcode heavily |

### Verdict: No Kit Rationalization Needed

**Why**: Kit's value is NOT agent execution (native tools are fine) but **strategic routing, domain expertise, and memory**. These are orthogonal to native tools.

Kit should evolve to **orchestrate** native tools, not compete with them. Example future use:

```
User: "Plan and implement dark mode"
  → epost-planner (kit) decomposes into:
    1. Research dark mode best practices → Claude Code Explore
    2. Plan UI token changes → Kit orchestration
    3. Implement changes → Cursor background loop
    4. Review code → Copilot handoff
  → Kit merges all results into PATTERN entry
```

---

## Key Findings

### Finding 1: Tool Overlap is Healthy

All three tools can spawn agents. But they specialize:
- **Claude Code**: Subagents in same session, full context window
- **Cursor**: Hooks for feedback loops, not for spawning agents
- **Copilot**: Handoff chains, optimized for IDE breadth

**No conflict. Use each for its strength.**

### Finding 2: epost_agent_kit's Irreplaceable Value

Native tools cannot replace:
1. **Specialist agents** (code-reviewer, tester, debugger) — still use `.claude/agents/`
2. **Domain knowledge** (A11y, design-system, platform patterns) — still in `skills/`
3. **Orchestration logic** (when to delegate, to whom, in what order) — still in agent system prompts
4. **Persistent memory** (learnings across sessions) — native tools don't support this at scale

### Finding 3: Cursor Hooks Are Event-Driven, Not Agent-Centric

Cursor's hooks don't define agents; they intercept operations. This is **complementary** to Kit, not competitive. Use Cursor hooks to validate/transform Kit agent outputs.

### Finding 4: Copilot Handoffs Are Linear, Not Orchestrated

Copilot's handoff chains work best for plan → code → review flows. For complex routing (when A vs B vs C agent needed), use Kit's orchestration layer.

### Finding 5: Claude Code Agent Teams Are the Native Parallel Solution

For 3+ simultaneous specialists, use Claude Code's native Agent Teams (GA Mar 2026) instead of Kit's Task tool. But Kit still decides WHICH agents to team up.

---

## Unresolved Questions

1. **Cursor background agents**: Can they be defined declaratively (not just hooks)? Current docs suggest hooks only. Needs deeper Cursor docs exploration.
2. **Copilot agent auto-selection**: How does Copilot decide when to auto-delegate to a custom agent? (The `disable-model-invocation` flag exists, but triggering logic is unclear.)
3. **Cross-tool agent sync**: Can Kit agents be version-controlled and synced across Claude Code + Copilot `.github/agents/`? Likely yes for `.github/agents/`, needs validation.
4. **Hook timeout enforcement**: Cursor hooks have no documented timeout. What happens if a hook runs for 1 hour? Needs testing.
5. **Copilot handoff context size**: When handoff passes context to next agent, is there a limit? Max 30k chars in agent prompt + context size?

---

## Sources

- [Create custom subagents - Claude Code Docs](https://code.claude.com/docs/en/sub-agents)
- [Subagents in the SDK - Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/subagents)
- [Claude Code Agent Teams: The Complete Guide 2026](https://claudefa.st/blog/guide/agents/agent-teams)
- [The Task Tool: Claude Code's Agent Orchestration System - DEV Community](https://dev.to/bhaidar/the-task-tool-claude-codes-agent-orchestration-system-4bf2)
- [Cursor – Background Agents](https://cursor.com/docs)
- [Deep Dive into the new Cursor Hooks | Butler's Log](https://blog.gitbutler.com/cursor-hooks-deep-dive)
- [How to Use Cursor 1.7 Hooks to Customize Your AI Coding Agent](https://skywork.ai/blog/how-to-cursor-1-7-hooks-guide/)
- [Cursor Hooks | GitButler Docs](https://docs.gitbutler.com/features/ai-integration/cursor-hooks)
- [Creating custom agents for Copilot coding agent - GitHub Docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)
- [Custom agents configuration - GitHub Docs](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [Major agentic capabilities improvements in GitHub Copilot for JetBrains IDEs - GitHub Changelog](https://github.blog/changelog/2026-03-11-major-agentic-capabilities-improvements-in-github-copilot-for-jetbrains-ides/)
- [How to write a great agents.md - The GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-2500-repositories/)

---

## Verdict: ACTIONABLE

**Recommendation**: No changes to epost_agent_kit required. Kit's value (domain expertise + orchestration) is orthogonal to native agent execution. Maintain `.claude/agents/` as primary specialists; use native tools for scaling execution and IDE integration without losing domain knowledge.

