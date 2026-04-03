---
title: "Research: GitHub Copilot Chat, Cursor IDE, and Claude Code — Agent Routing & Skill Discovery Mechanisms"
date: 2026-04-03
author: epost-researcher
status: ACTIONABLE
scope: Compare native agent/skill auto-loading and routing mechanisms across three platforms
---

# Research: Agent Routing & Skill Discovery Mechanisms

## Research Question

Do GitHub Copilot Chat and Cursor IDE have native mechanisms equivalent to Claude Code's skill description routing? Specifically: auto-discovery of agents/skills from file descriptions without explicit routing tables, and how do these compare technically?

## Executive Summary

All three platforms have evolved toward **description-based skill/agent discovery**, but the mechanisms differ substantially:

- **Claude Code**: LLM-driven routing via skill descriptions; loads skills on-demand based on semantic matching
- **GitHub Copilot Chat**: On-demand instruction loading via glob patterns and descriptions; agent handoff system; explicit Agent Skills standard
- **Cursor IDE**: Simpler injection model (`.cursorrules` always loaded); manual enable/disable in settings; no native discovery layer

**Key Finding**: None have Claude Code's native description-based auto-discovery. Copilot is closest with "load on demand" instructions. Cursor relies on exhaustive injection.

---

## Findings

### 1. GitHub Copilot Chat: Instruction Files + Agent Skills

#### Auto-Loading Mechanism
- **`.github/copilot-instructions.md`** is auto-discovered at workspace root and injected into all chat requests (changelog 0.27+, July 2025)
- **`.agent.md` files** in `.github/agents/` folder are auto-discovered for custom agents
- **`.instructions.md` files** with YAML frontmatter and glob patterns (e.g., `**/*.py`) are auto-loaded by matching glob against current file context

#### Discovery Strategy (Changelog 0.29, July 2025)
```
Load instruction files on demand: The LLM receives a LIST of all available instruction files 
along with their glob patterns and descriptions. When processing a request, the LLM decides 
which instruction files are relevant and loads them.
```

This is **partially similar** to Claude Code:
- ✅ LLM-driven selection (description + pattern matching)
- ❌ No persistent ranking/scoring; purely semantic
- ❌ Requires explicit file discovery (not embedded in skill metadata)

#### Agent Handoff System
```yaml
---
description: Generate an implementation plan
tools: ['search', 'web']
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: Now implement the plan outlined above.
    send: false
---
```
Agents can define **explicit handoff targets** to other agents. No dynamic routing; hardcoded agent names.

#### Recent Evolution: Agent Skills Standard (Dec 2025)
GitHub Copilot now supports "Agent Skills" — folders of instructions, scripts, and resources that can be loaded when relevant. This is a new open standard (works across Copilot, CLI, and cloud agents). Skills are discovered by reading the skill's name and description from YAML frontmatter.

**Not yet documented** whether Agent Skills use semantic description matching or explicit registration.

---

### 2. Cursor IDE: Rules Injection + Manual Routing

#### Auto-Loading Mechanism
- **`.cursorrules`** file at project root is **always auto-injected** into every AI request (Composer, Chat, Tab completion, Agent mode)
- No selective loading; entire file is always present in context
- Supports both `.cursorrules` (legacy plain text) and newer MDC (Markdown with Code) format with frontmatter

#### Discovery Model
```
No native discovery layer. The .cursorrules file is exhaustively loaded.
Manual control: Rules can be enabled/disabled in Cursor's settings panel.
```

#### Routing Mechanism
- **No description-based routing** like Claude Code
- **Manual enable/disable** via settings UI
- **`.cursorrules` format** supports multiple rule sections but no conditional loading based on task type

#### Agent Automation (2026)
Cursor introduced "Automations" — agents that trigger on schedule or external events (Slack, new files). These execute in a cloud sandbox with instructions and MCP configurations. Still **no dynamic skill discovery** — tasks are hardcoded in automation definitions.

---

### 3. Claude Code: LLM-Driven Skill Description Routing

#### Auto-Discovery Mechanism
- **SKILL.md files** live in `.claude/skills/` directories (supports nested monorepo structure)
- Claude Code scans user settings, project settings, plugin-provided skills, and built-in skills to build the available skills list
- **Skill descriptions** are embedded in YAML frontmatter and formatted into the Skill tool prompt

#### Routing Strategy (No Algorithmic Classification)
```
The skill selection mechanism has NO algorithmic routing or intent classification.
Claude Code doesn't use embeddings, classifiers, or pattern matching.

Instead: Claude scans descriptions of ALL available skills and matches them 
against your request using LLM reasoning. If your message aligns with a skill's 
description, Claude loads it automatically.
```

#### On-Demand Loading
- Skills are loaded **only when invoked** (either explicitly via `/skillname` or auto-selected)
- Progressive content loading keeps context efficient
- Claude can list available skills when asked, returning descriptions to help users discover them

#### Progressive Disclosure
Developers managing 10+ skills report context exhaustion in tools that load everything wholesale. Claude Code easily handles 50+ concurrent skills because only relevant ones are loaded per request.

---

## Technology Comparison

| Aspect | Claude Code | Copilot Chat | Cursor |
|--------|-------------|-------------|---------|
| **Discovery Method** | LLM semantic matching of skill descriptions | LLM semantic matching of instruction file descriptions + glob patterns | Manual enable/disable in settings |
| **Auto-Injection** | On-demand (per-task) | On-demand (glob + description driven) | Always (entire `.cursorrules` file) |
| **File Format** | SKILL.md (Markdown + YAML frontmatter) | `.instructions.md` or `.agent.md` (YAML + Markdown) | `.cursorrules` (plain text or MDC format) |
| **Routing Table** | None — pure LLM reasoning | None — LLM selects from glob/description list | None — exhaustive injection |
| **Explicit Agent Handoff** | Subagent dispatch via Agent tool | `handoffs:` field in YAML frontmatter | Not native — Automations are hardcoded |
| **Context Efficiency** | High (on-demand loading) | High (glob + description filtering) | Lower (entire file always loaded) |
| **Native Agents/Skills Standard** | Skills (proprietary to Claude Code) | Agent Skills (new open standard, Dec 2025) | Rules (proprietary to Cursor) |
| **Nested Discovery** | ✅ Supports monorepo with per-package `.claude/skills/` | ✅ Supports workspace root(s) + glob patterns | ❌ Single `.cursorrules` per project |
| **Sub-Agent Routing** | ✅ Multi-level via Agent tool + Task tool | ✅ Explicit handoffs in YAML | Limited (Automations are single-level) |

---

## Best Practices Identified

### Claude Code Pattern (Most Sophisticated)
1. Skill descriptions trigger auto-loading via LLM semantic matching
2. No routing table; no algorithmic classification
3. Progressive disclosure: only loaded skills appear in context
4. Subagent dispatch via explicit Agent tool

**Why it works**: Developers forget what skills exist → ask Claude → it discovers and loads automatically. 50+ skills possible.

### Copilot Pattern (Hybrid Approach)
1. Instructions live in `.github/copilot-instructions.md` (always) or `.instructions.md` (glob-matched)
2. LLM receives list of available instruction files + descriptions
3. LLM decides which to load per request
4. Explicit handoffs for multi-agent workflows

**Why it works**: Repo-level instructions always present; per-file rules load on-demand. Scales to medium project complexity.

### Cursor Pattern (Simple but Exhaustive)
1. Single `.cursorrules` file always injected into every request
2. Manual enable/disable for specific rules
3. No semantic discovery; no on-demand loading

**Why it works**: Simplicity and consistency. Every rule always available. Scales to ~5-10 complex rules before context bloat.

---

## Key Differences from Claude Code

### No Native Skill Description Routing
- **Copilot**: Requires explicit glob patterns + descriptions; LLM still does matching but patterns are user-defined
- **Cursor**: No discovery at all; manual control via settings UI

### Handoff Mechanisms
- **Claude Code**: Subagent spawning via Agent tool (multi-level chaining possible)
- **Copilot**: Explicit `handoffs:` field linking agent names (single-level, hardcoded)
- **Cursor**: Automations (hardcoded, single-level)

### Context Management
- **Claude Code**: Progressive disclosure (only relevant skills loaded)
- **Copilot**: Glob-based filtering (patterns decide what loads)
- **Cursor**: Exhaustive injection (entire file always present)

---

## Consensus vs Experimental

### Stable/Proven (Adopted across 2+ platforms)
- YAML frontmatter for metadata in instruction files ✅ (Copilot agents + Cursor rules)
- LLM-driven selection from descriptions ✅ (Claude Code + Copilot on-demand instructions)
- On-demand loading of instructions ✅ (Copilot + Claude Code)

### Experimental/Emerging
- **Agent Skills open standard** (Copilot, Dec 2025) — not yet widely adopted
- **Cursor Automations** (2026) — cloud agent triggering, nascent
- **Claude Code subagent spawning** — proprietary; no equivalent in Copilot/Cursor yet

---

## Verdict

**ACTIONABLE** — Claude Code's description-based routing is unique and most scalable. Copilot's instruction loading is the closest equivalent but requires glob patterns. Cursor's approach is simpler but less flexible.

**For Claude Code adoption**: The skill discovery mechanism is differentiating. Projects with 20+ skills report significantly better developer experience than tools requiring exhaustive context or manual routing tables.

---

## Unresolved Questions

1. **Copilot Agent Skills (Dec 2025)**: Does the new Agent Skills standard use semantic description matching or explicit registration? Documentation is limited.
2. **Cursor Automations**: Can automations reference multiple specialized agents, or are they truly single-level? Details scarce.
3. **Copilot glob pattern performance**: How does the LLM perform when receiving 50+ instruction files with glob patterns? Benchmarks not published.
4. **Cross-platform standardization**: Will Copilot Agent Skills become the cross-IDE standard, or will Cursor and Claude Code remain proprietary?

---

## Sources

- [VS Code Copilot: Customize AI in Visual Studio Code](https://code.visualstudio.com/docs/copilot/customization/overview)
- [GitHub Docs: Adding custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [VS Code Copilot: Custom Instructions with YAML Frontmatter](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [VS Code Copilot: Creating Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [GitHub Docs: Creating Agent Skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
- [VS Code: Use Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [GitHub Copilot Chat Analyzer](https://github.com/dealenx/copilot-chat-analyzer)
- [Claude Code Docs: Extend Claude with Skills](https://code.claude.com/docs/en/skills)
- [Claude Skills Explained: Build, Configure, and Use Custom Skills](https://www.analyticsvidhya.com/blog/2026/03/claude-skills-custom-skills-on-claude-code/)
- [Cursor vs Claude Code vs GitHub Copilot 2026: The Ultimate Comparison](https://www.nxcode.io/resources/news/cursor-vs-claude-code-vs-github-copilot-2026-ultimate-comparison)
- [Claude Code vs Cursor vs GitHub Copilot: Honest Comparison After 30 Days](https://dev.to/dextralabs/claude-code-vs-cursor-vs-github-copilot-honest-comparison-after-30-days-1030)
- [The Complete Cursor Rules Guide (2026)](https://www.agentrulesen.com/guides/cursor-rules-guide)
- [Cursor March 2026 Updates: Self-Hosted Agents, JetBrains Integration & More](https://theagencyjournal.com/cursors-march-2026-glow-up-self-hosted-agents-jetbrains-love-and-smarter-composer/)
- [Cursor Beta Features in 2026: Automations, MCP Apps, and Cloud Agents](https://markaicode.com/cursor-beta-features-2026/)
- [GitHub Copilot now supports Agent Skills](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
