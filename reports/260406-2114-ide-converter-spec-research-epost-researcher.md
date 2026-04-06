---
name: IDE Converter Specification Research
description: Comprehensive frontmatter, skill discovery, and agent format analysis for Claude Code, GitHub Copilot, Cursor, JetBrains, and Windsurf IDE converters
type: research
agent: epost-researcher
date: 2026-04-06
status: ACTIONABLE
---

## Research: IDE Converter System Specifications

### Executive Summary

Researched 5 IDE agent/skill converter targets for epost_agent_kit CLI. Found **authoritative specs for Cursor, Copilot, and SKILL.md open standard**, confirmed **Copilot custom agent format evolved (chat modes → .agent.md)**, identified **JetBrains ACP emerging but stabilizing**, and **Windsurf lacks formal spec** (markdown rules only). 

**Key finding**: SKILL.md is now the cross-IDE lingua franca (Claude Code, Cursor, Copilot all support it as of Feb-Mar 2026). Copilot gained `excludeAgent` scoping (Nov 2025) and MCP tool references. Cursor skill discovery is pure LLM-based description matching (no embeddings). JetBrains launching JetBrains Central (Q2 2026) with agent coordination.

Converter viability: ✅ Copilot, Cursor, Windsurf actionable now. 🟡 JetBrains needs Q2 2026 clarification. ❌ Emerging IDE targets (Tabnine, Replit) not yet standardized.

---

## Q1: Cursor Latest (2026) — Subagent & Skill Format Details

### Confirmed Findings

#### Cursor `.agents/*.md` Subagent Frontmatter

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `name` | Yes | string | Description of when to use this subagent |
| `description` | Yes | string | **Critical for delegation decision**. Written like a job description—specific about when to use it, not vague |
| `model` | No | enum | `inherit` (use main agent model), `fast` (cheaper/faster), or specific model ID (hardcoded) |
| `readonly` | No | boolean | Set `true` to restrict write permissions (read-only analysis mode) |
| `is_background` | No | boolean | Set `true` to execute asynchronously in background |

**Source**: [Cursor Subagents Docs](https://cursor.com/docs/context/subagents); [Cursor 2.4 Changelog](https://cursor.com/changelog/2-4)

**Key behavior**: The main agent reads `description` to decide when to delegate. Description is **everything** for subagent routing — must match how users/agents describe tasks.

#### Cursor `.agents/skills/*/SKILL.md` Format

Cursor uses the open **Agent Skills specification** (agentskills.io). Frontmatter fields:

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | Max 64 chars, lowercase + hyphens, no leading/trailing/consecutive hyphens, must match directory name |
| `description` | Yes | Max 1024 chars, describe what it does + when to use it |
| `license` | No | License name or reference to LICENSE file |
| `compatibility` | No | Max 500 chars, system requirements (git, docker, Python 3.14+, network access, etc.) |
| `metadata` | No | Arbitrary key-value map (author, version, etc.) |
| `allowed-tools` | No | Space-delimited list of pre-approved tools (Experimental) |
| `disable-model-invocation` | No | Boolean, when `true` → slash command only, no auto-load |

**Source**: [agentskills.io Specification](https://agentskills.io/specification); [Cursor Skills Docs](https://cursor.com/docs/context/skills)

**Skill discovery**: Pure LLM-based. Cursor loads all skill descriptions into the Skill tool prompt, and the model decides which to invoke. No embeddings, no keyword matching, no ML classifiers. **Description field drives everything.**

#### Optional Directory Structure

```
skill-name/
├── SKILL.md           # Required
├── scripts/           # Python, Bash, JavaScript
├── references/        # REFERENCE.md, domain-specific docs
├── assets/            # Templates, images, data
```

Reference files loaded on-demand (progressive disclosure). Keep SKILL.md < 500 lines; move detailed content to `references/`.

---

## Q2: Copilot Agent Skills (Dec 2025 + Updates) — Frontmatter & Discovery

### Confirmed Findings

#### Copilot SKILL.md Frontmatter Fields

Same as open SKILL.md specification (used across Cursor, Copilot, Claude Code):

| Field | Required | Copilot-Specific Notes |
|-------|----------|------------------------|
| `name` | Yes | Unique identifier, lowercase + hyphens only |
| `description` | Yes | Drives both automatic activation and discovery |
| `license` | No | License applied to skill |
| `argument-hint` | No | **Copilot addition**: Hint text shown when invoking as `/` slash command |
| `user-invocable` | No | **Copilot addition**: Controls whether skill appears in `/` menu (default: true). Set `false` to hide from menu but allow agent auto-load |
| `disable-model-invocation` | No | When `true` → slash command only, agent cannot auto-load (default: false) |
| `metadata` | No | Arbitrary metadata (author, version, etc.) |

**Source**: [VS Code Copilot Agent Skills Docs](https://code.visualstudio.com/docs/copilot/customization/agent-skills); [GitHub Docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)

#### Skill Discovery in Copilot

**Model-invocation approach**: 
- Copilot reads all skill descriptions and lets the model decide which to invoke
- No explicit registration file needed
- Skills are discovered by LLM reasoning on description content
- `user-invocable: false` hides from slash menu but allows agent auto-load
- `disable-model-invocation: true` requires manual `/skill-name` invocation only

#### Cross-Skill References

**Not documented**. Copilot SKILL.md spec makes no mention of:
- Skill dependency declarations
- `connections` or `enhances` fields
- Skill-to-skill references or composition

**Status**: Unresolved. Likely not supported (each skill is independent; composition is the agent's job).

---

## Q3: Copilot `.instructions.md` Latest Format

### Confirmed Findings

#### Scoped Instructions with `applyTo` Glob Patterns

**File location**: `.github/instructions/` (multiple .instructions.md files supported)

**Frontmatter fields**:

| Field | Type | Purpose |
|-------|------|---------|
| `applyTo` | string (glob) | Glob pattern to target specific files (e.g., `**/*.ts,**/*.tsx`). If omitted, instructions do NOT auto-apply |
| `excludeAgent` | string enum | Exclude from agent: `"code-review"` or `"coding-agent"`. Default: applies to all agents |

**Example**:
```markdown
---
applyTo: "**/*.ts,**/*.tsx"
excludeAgent: "code-review"
---
Always use explicit return types on TypeScript functions.
```

**Source**: [Use Custom Instructions in VS Code](https://code.visualstudio.com/docs/copilot/customization/custom-instructions); [applyTo Pattern Guide](https://smartscope.blog/en/generative-ai/github-copilot/github-copilot-applyto-pattern-guide/); [GitHub Changelog Nov 2025](https://github.blog/changelog/2025-11-12-copilot-code-review-and-coding-agent-now-support-agent-specific-instructions/)

#### Agent Scoping (`excludeAgent` Property)

**New in Nov 2025**. Allows fine-grained control:
- `excludeAgent: "code-review"` → instructions used by coding agent only, not code-review agent
- `excludeAgent: "coding-agent"` → instructions used by code-review agent only
- Omitted → applies to all agents

This enables tailored guidance per agent without duplication.

#### External File References

**Status**: Not explicitly documented. Likely supported via standard Markdown links (e.g., `[guide](../docs/style-guide.md)`), but **NOT confirmed** as a first-class feature.

---

## Q4: Copilot Custom Chat Modes (`.chat.md`) → `.agent.md` Evolution

### Confirmed Findings

#### Terminology Update (Nov 2025)

- **Old name**: Custom chat modes (`.chat.md`)
- **New name**: Custom agents (`.agent.md`)
- **Location**: `.github/agents/` (same structure, renamed)
- **Functionality**: Identical—create specialized agent behaviors for specific tasks

**Source**: [Custom Agents in VS Code](https://code.visualstudio.com/docs/copilot/customization/custom-agents); [GitHub Docs](https://github.com/github/awesome-copilot/blob/main/docs/README.agents.md)

#### `.agent.md` Frontmatter Fields

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `name` | Yes | string | Agent identifier |
| `description` | Yes | string | When to use this agent |
| `tools` | No | array | `["*"]` (all), specific names (e.g., `["read", "edit", "search"]`), or omit for all. **Can include MCP server tools** |
| `model` | No | string | AI model to use (default: current model selection) |
| `handoffs` | No | array | Suggested next actions/transitions between agents |

**MCP Tool Syntax**:
```yaml
tools: ["code_search", "readfile", "mcp_server_tool_name"]
```

MCP tools from configured servers in agent profile or repository settings are automatically available.

**Source**: [Custom Agents Docs](https://code.visualstudio.com/docs/copilot/customization/custom-agents); [MCP Integration Docs](https://docs.github.com/en/copilot/tutorials/enhance-agent-mode-with-mcp)

#### Value for Auto-Generating Chat Modes

**YES — strong use case**. The kit could generate:
- `.github/agents/planner.agent.md` — strategic planning role
- `.github/agents/code-reviewer.agent.md` — QA/review role
- `.github/agents/debugger.agent.md` — troubleshooting role

Each with tailored tools, descriptions, and handoff chains. This would give Copilot users specialized agent modes mapped to epost roles.

---

## Q5: Windsurf & JetBrains — Emerging Converter Targets

### Windsurf (Codeium) — Rules-Based, No Agent Format

**Finding**: Windsurf does NOT have an agent/skill format analogous to Claude Code, Cursor, or Copilot.

**What exists**:
- `.windsurf/rules/` directory: Markdown rules files
- Rules can be always-on, @mention-able, file-glob-scoped, or Cascade-requested
- No subagent declarations, no skill frontmatter
- Rules are GUI-wrapped markdown, not machine-parseable

**Converter viability**: 
- ❌ **Cannot auto-generate Windsurf `.agent` files** — no such format exists
- ✅ **CAN generate `.windsurf/rules/` files** as markdown guidance (not executable skills)
- Would require manual translation of agent instructions → markdown rules

**Source**: [Windsurf Rules Docs](https://windsurf.com/); [Windsurf Directory Examples](https://codeium.com/windsurf/directory)

### JetBrains AI Assistant — ACP Emerging, AGENTS.md Stabilizing

#### Current Format (2026)

**Two parallel approaches**:

1. **AGENTS.md** (repository-level guidance)
   ```markdown
   - Project overview (language, build tool)
   - Development rules (coding standards)
   - Repository conventions (directory structure)
   - Common tasks (build, test commands)
   - Definition of done criteria
   ```
   Supported by: Junie agent, AI Assistant (primary approach)

2. **Agent Client Protocol (ACP)** (custom agent integration, emerging)
   - JSON configuration: `default_mcp_settings`, `agent_servers` objects
   - Each agent: `command`, `args`, `env` properties
   - Still stabilizing; not yet widely adopted

**Guidelines path**: Junie supports `guidelines.md` or `AGENTS.md` at `.junie/guidelines.md` or repository root.

**Source**: [JetBrains AI Assistant Docs](https://www.jetbrains.com/help/ai-assistant/configure-agent-behavior.html); [ACP Agent Registry](https://blog.jetbrains.com/ai/2026/01/acp-agent-registry/)

#### JetBrains Central (Q2 2026, Early Access)

**Emerging**: Air App and Air Team for workspace-level agent coordination and task orchestration. Not yet public—requires design partner signup for Q2 EAP.

**Converter viability**:
- 🟡 **Actionable NOW**: Generate AGENTS.md / guidelines.md (standard markdown)
- ⚠️ **Monitor Q2 2026**: ACP stabilization may enable agent-level converters
- ❌ **Skip for now**: JetBrains Central not ready for converter integration

**Source**: [Introducing JetBrains Central](https://blog.jetbrains.com/blog/2026/03/24/introducing-jetbrains-central-an-open-system-for-agentic-software-development/)

---

## Technology Comparison Table

| Aspect | Cursor | Copilot | JetBrains | Windsurf |
|--------|--------|---------|-----------|----------|
| **Subagent Format** | `.agents/*.md` | `.github/agents/*.agent.md` | AGENTS.md / ACP (emerging) | None |
| **Skill Format** | SKILL.md (open std) | SKILL.md (open std) | N/A | None |
| **Skill Discovery** | LLM description matching | LLM description matching | N/A | N/A |
| **Scoped Instructions** | No | `.instructions.md` w/ `applyTo` | AGENTS.md only | `.windsurf/rules/` |
| **Agent Scoping** | N/A | `excludeAgent` property | N/A | N/A |
| **MCP Integration** | Implicit (via .cursor/rules) | Explicit tools field | Config JSON (ACP) | N/A |
| **Auto-Invocation** | Yes (via description) | Yes (via description) | Yes (via guidelines) | Cascade-triggered only |
| **Converter Readiness** | ✅ Ready | ✅ Ready | 🟡 Partial (AGENTS.md) | ⚠️ Limited (rules only) |

---

## Recommended Actions for Kit Converter

### Priority 1: Immediate (3-4 weeks)

1. **SKILL.md as Cross-IDE Lingua Franca**
   - All three IDEs (Cursor, Copilot, Claude Code) accept SKILL.md format
   - **Action**: Extend converter to generate `packages/{platform}/skills/` in the SKILL.md format for Copilot and Cursor targets
   - Reuse existing skill metadata; no need for separate conversion logic

2. **Copilot Custom Agents (`.agent.md`)**
   - Update from deprecated `.chat.md` → `.agent.md` format
   - **Action**: Generate `.github/agents/` with `epost-planner`, `epost-code-reviewer`, `epost-debugger` agents
   - Reference available tools via MCP server integration (configure in repository settings)

3. **Cursor Subagents from Agent Definitions**
   - Map epost agents → Cursor `.agents/*.md`
   - **Action**: Extract `name`, `description` from agent `SKILL.md`; generate `.agents/{agent-name}.md` with minimal frontmatter
   - Set `model: inherit` (use repository's selected model)

### Priority 2: Medium (4-6 weeks)

4. **Scoped Instructions for Copilot**
   - Generate `.github/instructions/` files with `applyTo` glob patterns
   - **Action**: Create per-platform instructions (e.g., `web.instructions.md applyTo: **/*.tsx,**/*.ts`)
   - Add `excludeAgent: "code-review"` for coding-agent-specific guidance

5. **JetBrains AGENTS.md Template**
   - Generate repository-level `AGENTS.md` for Junie / AI Assistant
   - **Action**: Extract project overview, conventions, and tasks from kit knowledge base
   - Host at `.junie/guidelines.md` (Junie-specific) or repository root

### Priority 3: Future (Q2 2026+)

6. **JetBrains ACP Stabilization**
   - Monitor Q2 2026 updates to ACP spec and agent registry
   - Once stable, map epost agents → ACP JSON configs

7. **Windsurf Rules Generation** (Low ROI)
   - Generate `.windsurf/rules/` as markdown guidance (not executable)
   - Useful for teams using Windsurf, but no equivalent to agent auto-invocation

---

## Code Examples

### Example: Cursor Subagent Definition

```yaml
---
name: Code Reviewer
description: Reviews code against team standards, checks for bugs, performance issues, and security vulnerabilities. Use when you need a thorough code quality audit before merging.
model: fast
readonly: true
---

# Code Review Task

You are a specialized code reviewer. Analyze the provided code for:

1. **Security** — injection, auth/authz violations, secret exposure
2. **Performance** — N+1 queries, unnecessary re-renders, caching issues
3. **Correctness** — null handling, edge cases, error paths
4. **Standards** — naming conventions, file structure, patterns

Provide specific, actionable feedback with line numbers.
```

### Example: Copilot Custom Agent (`.agent.md`)

```yaml
---
name: Planner
description: Strategic planning and phased implementation design. Use when decomposing complex features or designing system architecture.
tools: ["read", "search", "code_analysis"]
model: claude-opus
handoffs: ["Coder", "Code Reviewer"]
---

# Planning Agent

You are an expert system designer. When asked to plan a feature:

1. Decompose into phases with clear dependencies
2. Identify risks and success criteria for each phase
3. Recommend parallel vs sequential execution
4. Suggest file ownership per phase

Produce a structured plan with sections: Overview, Phases, Risks, Success Criteria.
```

### Example: SKILL.md for Cross-IDE Use

```yaml
---
name: code-review-skill
description: Audits code for security, performance, and correctness violations. Use when reviewing PRs, assessing code quality, or validating changes before merge.
license: Apache-2.0
metadata:
  author: epost-kit
  version: "1.0.0"
allowed-tools: Read Bash
---

# Code Review Skill

Performs structured code audits using OWASP, WCAG, and performance heuristics.

## Usage

Load this skill to conduct multi-stage code reviews:
- **Stage 1**: Security analysis (STRIDE, injection, auth)
- **Stage 2**: Performance (N+1, re-renders, caching)
- **Stage 3**: Standards (naming, structure, patterns)

## Output

Structured report with findings, severity scores, and remediation suggestions.

See [references/owasp-checklist.md](references/owasp-checklist.md) for detailed security criteria.
```

---

## Unresolved Questions & Gaps

1. **Copilot skill-to-skill references** — Can SKILL.md declare dependencies on other skills? Not documented. Likely not supported (each skill is independent; agent orchestrates composition).

2. **JetBrains ACP stability** — When will ACP stabilize and be recommended over AGENTS.md? Need Q2 2026 clarity from JetBrains.

3. **Windsurf agent format roadmap** — Will Windsurf ever support agent/skill definitions like other IDEs? Currently no public roadmap.

4. **Cursor MCP tool discovery** — Does Cursor discover MCP tools automatically, or must they be explicitly registered in `.cursor/settings.json`? Docs suggest implicit discovery; needs confirmation.

5. **Cross-IDE skill naming conflicts** — If same skill name exists in both `.github/skills/` (Copilot) and `.agents/skills/` (Cursor), does IDE auto-resolution happen? Likely namespace is per-IDE; unconfirmed.

6. **Backwards compatibility** — How long will Copilot support deprecated `.chat.md` format alongside new `.agent.md`? Unclear; recommend migration ASAP.

---

## Consensus vs Experimental

### Stable / Proven (Adopt Now)
- ✅ SKILL.md open standard — used by Cursor, Copilot, Claude Code; standardized at agentskills.io
- ✅ Copilot `.agent.md` format — official replacement for `.chat.md` (Nov 2025)
- ✅ Cursor `.agents/*.md` subagents — documented, working, LLM-based discovery
- ✅ Copilot `.instructions.md` with `applyTo` — stable, widely used
- ✅ JetBrains AGENTS.md — de facto standard for guidance

### Experimental / Emerging (Monitor)
- 🟡 Copilot MCP tool integration — recent feature, still being optimized
- 🟡 JetBrains ACP — under development, not yet recommended over AGENTS.md
- 🟡 JetBrains Central — Q2 2026 EAP, not yet public

### Not Viable (Skip)
- ❌ Windsurf agent format — does not exist; rules-only system
- ❌ Tabnine / Replit agent formats — no standardized specs (not researched)

---

## Status: ACTIONABLE

**Verdict**: Converter targets for Copilot and Cursor are **immediately actionable**. Both use well-documented SKILL.md standard and formal agent/subagent formats. JetBrains is **partially actionable** (AGENTS.md now, ACP later). Windsurf is **low-ROI** (rules only, no agents).

**Recommended scope for Phase 1**: Copilot (custom agents + skills) and Cursor (subagents + skills). Defer JetBrains ACP until Q2 2026 clarification.

---

## Sources

- [Cursor Subagents Docs](https://cursor.com/docs/context/subagents)
- [Cursor Skills Docs](https://cursor.com/docs/context/skills)
- [Cursor 2.4 Changelog](https://cursor.com/changelog/2-4)
- [Agent Skills Specification (agentskills.io)](https://agentskills.io/specification)
- [VS Code Copilot Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [GitHub Docs: Create Skills](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
- [Copilot Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Copilot Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Copilot MCP Integration](https://docs.github.com/en/copilot/tutorials/enhance-agent-mode-with-mcp)
- [GitHub Changelog: excludeAgent (Nov 2025)](https://github.blog/changelog/2025-11-12-copilot-code-review-and-coding-agent-now-support-agent-specific-instructions/)
- [applyTo Pattern Guide](https://smartscope.blog/en/generative-ai/github-copilot/github-copilot-applyto-pattern-guide/)
- [JetBrains AI Assistant Docs](https://www.jetbrains.com/help/ai-assistant/configure-agent-behavior.html)
- [JetBrains ACP Agent Registry](https://blog.jetbrains.com/ai/2026/01/acp-agent-registry/)
- [Introducing JetBrains Central](https://blog.jetbrains.com/blog/2026/03/24/introducing-jetbrains-central-an-open-system-for-agentic-software-development/)
- [Cursor Skills Discovery](https://agenticthinking.ai/blog/skill-discovery/)
- [Windsurf Rules Docs](https://windsurf.com/)
