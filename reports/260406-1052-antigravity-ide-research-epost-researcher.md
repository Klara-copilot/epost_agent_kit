---
status: ACTIONABLE
agent: epost-researcher
date: 2026-04-06
scope: Antigravity IDE research for potential epost-kit converter target
research-scope: Tool classification, customization architecture, equivalence mapping, MCP support
---

# Research: Antigravity IDE — Customization Architecture & epost-kit Converter Viability

## Executive Summary

**Antigravity** is Google's **agentic IDE** (announced Nov 2025), not a traditional code editor. It's an agent-orchestration platform where AI agents autonomously plan, code, test, and verify tasks. Unlike Claude Code (which is Claude's IDE integrating multi-agent workflows), Antigravity prioritizes **agent management over text editing**.

**Customization model differs significantly from Claude Code**: Antigravity uses **GEMINI.md + AGENTS.md** (shared across Cursor/Windsurf), not a unified skill+agent architecture. It has **SKILL.md equivalents** but no true "agent definitions" in Claude Code's sense.

**Verdict**: Worth investigating as a **secondary converter target** (phase 2), but **lower priority than Cursor rules** due to architectural mismatch. Tool maturity is young (public preview, Nov 2025 release) and ecosystem still stabilizing.

---

## What is Antigravity?

### Classification
- **Type**: Agentic IDE (Google product)
- **Release**: Public preview, November 18, 2025 (alongside Gemini 3)
- **Foundation**: Modified fork of Visual Studio Code
- **Platform**: macOS, Windows, Linux

### Core Design Philosophy
Antigravity is **agent-first**, not editor-first. Its metaphor is "Mission Control" — you manage autonomous agents that execute multi-step coding tasks with minimal human intervention. Instead of writing code directly, you define tasks, agents plan execution, and you monitor progress via "Artifacts" (verifiable outputs like plans, task lists, screenshots, browser recordings).

### Key Differentiator from Claude Code
| Aspect | Claude Code | Antigravity |
|--------|-------------|-------------|
| **Primary UX** | Text editing with agent sidebar | Agent orchestration (Manager view) |
| **Agent role** | Specialized task handler | Autonomous long-running executor |
| **UI paradigm** | Editor-first (VS Code base) | Agent manager-first + Editor view |
| **Model primary** | Claude (Haiku/Sonnet/Opus) | Gemini 3/3.1 Pro, Flash |
| **Secondary models** | Supports OpenAI, Anthropic | Supports Claude Sonnet 4.5+, Claude Opus 4.5 (experimental thinking) |

---

## Customization Architecture

### File-Based Configuration System

Antigravity reads rules from **three sources** in precedence order:

#### 1. **GEMINI.md** (Antigravity-specific)
- **Purpose**: Antigravity-exclusive settings and behavior overrides
- **Location**: 
  - Global: `~/.gemini/GEMINI.md`
  - Project: `./GEMINI.md` (repo root)
- **Format**: Plain Markdown (no special syntax)
- **Precedence**: Highest priority (overrides AGENTS.md)
- **Content examples**: 
  - Antigravity-specific rules
  - Custom instructions unique to this IDE
  - Behavior customizations

#### 2. **AGENTS.md** (Cross-tool shared)
- **Purpose**: Unified rules shared across Antigravity, Cursor, and Claude Code
- **Location**: 
  - Global: `~/.gemini/AGENTS.md`
  - Project: `./AGENTS.md` (repo root)
- **Format**: Plain Markdown with optional `@imports`
- **Precedence**: Second (overridden by GEMINI.md)
- **Content examples**: 
  - Tech stack declaration
  - Code quality standards
  - Testing requirements
  - Git conventions
  - Safety guardrails
  - Architectural constraints
- **Import syntax**: `@path/to/file.md` (reference other Markdown files)
- **Version adoption**: Added in Antigravity v1.20.3 (March 5, 2026)

#### 3. **.agent/rules/** (Workspace directory)
- **Purpose**: Organize workspace rules into separate files
- **Location**: `.agent/rules/` directory in project
- **Format**: Individual Markdown files
- **Precedence**: Lowest (supplementary)

### Rules vs. Workflows

Antigravity distinguishes between two customization mechanisms:

| Mechanism | Purpose | Invocation | Use Case |
|-----------|---------|-----------|----------|
| **Rules** | System instructions guiding agent behavior | Auto-loaded based on context | Guardrails, standards, conventions |
| **Workflows** | Saved prompts / command templates | Invoked via `/command` | Repeated tasks (e.g., `/lint`, `/test`) |

**Key distinction**: Rules are always active. Workflows are on-demand.

---

## Agent & Skill Architecture

### Agent Definitions
Antigravity **does NOT have explicit agent definition files** like Claude Code's `.claude/agents/*.md`.

Instead, agents are:
- Built-in to the IDE (Manager view orchestrates them)
- Configured via UI settings (three dots → "Customizations")
- Guided by GEMINI.md/AGENTS.md rules
- No `.claude/agents/agent-name.md` equivalent

### Skill Architecture

Antigravity **does have skills** that parallel Claude Code's `SKILL.md` pattern:

#### Structure
```
skills/my-skill/
├── SKILL.md                 # Metadata + instructions
├── scripts/                 # Optional automation scripts
└── resources/               # Optional static/dynamic context data
```

#### SKILL.md Format
- **Metadata section**: Name, description (required)
- **Instructions section**: Detailed agent instructions (loaded on-demand)
- **No frontmatter** (unlike Claude Code's YAML frontmatter)
- **Plain Markdown** instructions

#### How Skills Load
- **On-demand only**: Skill instructions loaded when agent determines relevance to user request
- **Context optimization**: Keeps irrelevant skills out of context window
- **Dynamic behavior**: Transforms generic agent into specialist following org standards

#### Key Difference from Claude Code
- Claude Code: Skills have YAML frontmatter (`model:`, `skills:`, `context:`, `agent:`) + explicit agent routing
- Antigravity: Skills are simpler — markdown-only, loaded heuristically by relevance

---

## Feature Matrix: Equivalence to Claude Code Concepts

| Claude Code Concept | Antigravity Equivalent | Notes |
|---|---|---|
| `.claude/agents/agent-name.md` | Built-in agents + GEMINI.md rules | No explicit agent definitions in Antigravity |
| `.claude/skills/skill-name/SKILL.md` | `skills/skill-name/SKILL.md` | Similar concept, simpler (no YAML frontmatter) |
| `.claude/agents/CLAUDE.md` | `./AGENTS.md` or `./GEMINI.md` | AGENTS.md is cross-tool; GEMINI.md is Antigravity-specific |
| `.cursor/rules/` | `./AGENTS.md` or `./GEMINI.md` | Unified with AGENTS.md standard |
| `.github/copilot-instructions.md` | `./AGENTS.md` | Cross-tool shared standard |
| Skills registration (skill-index.json) | None (auto-discovery?) | Skills appear to be auto-discovered; no explicit registry found |
| `skills:` frontmatter in agents | Built-in to agent config | Configured via IDE UI, not in files |
| `context: fork` agent spawning | Workflows (saved prompts) | Different model: save → invoke via `/` |

### Critical Mismatch: No True "Agent Definitions"

Claude Code's multi-agent orchestration model (epost-kit) relies on:
- Agent definition files (`.claude/agents/*.md`)
- Explicit agent-to-skill mappings (`skills: [list]`)
- Agent tool for spawning subagents
- Hierarchical orchestration

Antigravity has:
- Built-in agents (no user-defined agents)
- No explicit skill registration
- Workflows as on-demand saved prompts (not equivalent to agent spawning)
- No multi-agent orchestration equivalent to Claude Code's Agent tool

---

## API Models Supported

### Primary Models
- **Gemini 3 Pro** (primary, generous rate limits free tier)
- **Gemini 3.1 Flash** (fast, free)

### Secondary Models (Supported)
- **Claude Sonnet 4.5** (Anthropic)
- **Claude Opus 4.5** (experimental thinking variant)
- **GPT-OSS-120B** (open-source OpenAI variant)

### Model Swapping
Users can configure which model Antigravity uses via IDE settings.

---

## MCP (Model Context Protocol) Support

### Status
**YES — Full MCP support** (native integration as of v1.20.3).

### Implementation
- **Architecture**: Client-Host-Server (Antigravity = Host)
- **MCP Servers available**:
  - Google Cloud (AlloyDB, BigQuery, Spanner, Cloud SQL, Looker)
  - Notion integration
  - Blender
  - Custom enterprise tools
- **Discovery**: Antigravity MCP Store (in-IDE marketplace)
- **Configuration**: Click "Install" in MCP Store to add servers

### Integration Depth
- Agents can use MCP servers for real-time context beyond open files
- Secure connection protocol built-in
- Pre-built servers for Google Cloud services

### Comparison to Claude Code
- Claude Code: MCP support via prompts + tool calls (experimental/beta)
- Antigravity: Native MCP client, first-class IDE integration

---

## Customization File Locations & Hierarchy

```
~/.gemini/                          # Global (all projects)
├── GEMINI.md                       # Antigravity global rules
└── AGENTS.md                       # Cross-tool global rules

./project-root/
├── GEMINI.md                       # Project Antigravity rules
├── AGENTS.md                       # Project cross-tool rules
└── .agent/
    └── rules/
        ├── rule-1.md
        ├── rule-2.md
        └── ...                     # Additional workspace rules
```

### Precedence (High to Low)
1. System rules (immutable)
2. GEMINI.md (project-level, Antigravity-specific)
3. GEMINI.md (global, Antigravity-specific)
4. AGENTS.md (project-level, cross-tool)
5. AGENTS.md (global, cross-tool)
6. .agent/rules/ (workspace supplementary)

---

## Official Resources & Documentation

### Primary URLs
- **Official site**: https://antigravity.google/
- **Getting started**: https://codelabs.developers.google.com/getting-started-google-antigravity
- **Skills tutorial**: https://codelabs.developers.google.com/getting-started-with-antigravity-skills
- **Google Developers Blog**: https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/

### Community & Ecosystem
- **Antigravity Codes** (rules & MCP hub): https://antigravity.codes/
- **Antigravity Awesome Skills** (GitHub): https://github.com/sickn33/antigravity-awesome-skills (1,340+ skills)
- **Workspace templates**: https://github.com/study8677/antigravity-workspace-template

### Guides Reviewed
- [Antigravity Rules Guide](https://antigravity.codes/blog/user-rules)
- [AGENTS.md Guide](https://antigravity.codes/blog/antigravity-agents-md-guide)
- [MCP Setup Tutorial](https://antigravity.codes/blog/antigravity-mcp-tutorial)
- [Antigravity Workspace Template](https://github.com/study8677/antigravity-workspace-template)

---

## epost-kit Converter Viability Assessment

### Should epost-kit support Antigravity conversion?

**Short answer: Not immediately. Consider for phase 2.**

### Rationale

#### ✅ Favorable Signals
1. **Shared standard (AGENTS.md)**: Antigravity reads the same AGENTS.md standard as Cursor, enabling cross-tool conversion
2. **MCP support**: Antigravity's native MCP client is mature and could benefit from epost-kit MCP discovery
3. **Skill architecture**: SKILL.md pattern has conceptual overlap, enabling skill content reuse
4. **Growth trajectory**: Young product (6 months) with significant adoption, large community ecosystem (1,340+ shared skills)

#### ❌ Friction Points
1. **No agent definitions**: Antigravity has no equivalent to Claude Code's multi-agent orchestration. Epost-kit's core value (agent definitions + dynamic skill injection) has no target in Antigravity
2. **Different orchestration model**: Workflows ≠ Agent spawning. Antigravity's on-demand prompts don't map to Claude Code's subagent pattern
3. **Premature ecosystem**: Product is 5 months old (as of Apr 2026). API/file format stability not yet proven. Cursor took 2+ years to stabilize rules format
4. **One-way conversion only**: Can convert epost-kit → Antigravity AGENTS.md (rules only), but NOT reverse conversion (Antigravity features → epost-kit agents)
5. **Workflow != Skills**: Antigravity workflows are saved prompts, not parameterized skill packages. No equivalent converter mapping
6. **Rules only**: Only AGENTS.md (rules) would convert cleanly. Skills, workflows, and agent orchestration have limited mapping paths

### Recommended Approach

#### Phase 1 (Now)
- ✅ Document Antigravity as an **information reference** (what it is, architecture comparison)
- ✅ Create AGENTS.md export capability from epost-kit (lower priority, one-way only)
- ✅ Track ecosystem maturity; revisit in 12 months

#### Phase 2 (2027)
- ⏸️ **Conditional**: IF Antigravity stabilizes API and gains >20% market share among epost-kit users, then:
  - Add Antigravity converter (`/convert --to antigravity`)
  - Scope: AGENTS.md export (rules only)
  - Scope: SKILL.md content reuse (with metadata adaptation)
  - Out of scope: Agent definitions (no equivalent exists)

#### Out of Scope (Never)
- Multi-agent orchestration (Antigravity doesn't support it)
- Workflow-to-prompt conversion (fundamentally different models)
- Antigravity → epost-kit reverse conversion (asymmetric architecture)

---

## Technical Integration Points (If Converter Built)

### AGENTS.md Export (High Confidence)
```markdown
# Source: epost-kit project rules
# Exported: CLAUDE.md + docs/conventions/* + docs/guides/*
# Format: Unified AGENTS.md for Antigravity, Cursor, Windsurf

## Tech Stack
[From docs/architecture/]

## Code Quality
[From docs/conventions/]

## Testing Requirements
[From docs/guides/]
```

### SKILL.md Reuse (Medium Confidence)
```markdown
# Antigravity SKILL.md (adapted from epost-kit SKILL.md)

## [Skill Name]
[Description - from original skill]

[Instructions - from original skill, minus YAML frontmatter]

## Scripts
[Optional: link to original scripts/]
```

### Agent Routing (Low Confidence — requires workaround)
- Antigravity has no built-in multi-agent spawning
- Possible workaround: Workflows that include prompt templates that mention specific agents
- Not recommended; too fragile

### MCP Discovery (High Confidence)
- Antigravity's MCP Store could benefit from epost-kit MCP registry
- Not a converter concern, but integration opportunity

---

## Comparison to Cursor

| Dimension | Cursor | Antigravity |
|-----------|--------|-------------|
| **Maturity** | Stable (2+ years) | New (6 months) |
| **Customization files** | `.cursor/rules/`, `.cursorignore` | `AGENTS.md`, `GEMINI.md`, `.agent/rules/` |
| **Cross-tool support** | Limited (Copilot-specific) | Native (AGENTS.md shared standard) |
| **epost-kit converter** | ✅ HIGH priority | ⏸️ MEDIUM priority (phase 2) |
| **Converter scope** | Rules + context injection | Rules only (initially) |

---

## Unresolved Questions

1. **Skills auto-discovery**: Does Antigravity auto-discover skills in a standard directory, or must they be registered? (Not documented in public sources reviewed)
2. **Skill versioning**: How does Antigravity version and update skills? (No equivalent to epost-kit's version field)
3. **Global vs. project skills**: Can skills be registered globally (~/.gemini/skills/) or only project-local (./skills/)? (Not specified)
4. **Workflow parameterization**: Can Antigravity workflows accept parameters/arguments, or are they fixed prompts? (Only documented as "saved prompts")
5. **Agent spawning equivalent**: Is there ANY mechanism in Antigravity to trigger nested agent execution, or is it strictly single-agent-with-tools? (Appears to be no, but not explicitly confirmed)
6. **AGENTS.md parsing**: Does Antigravity parse AGENTS.md headers/structure (e.g., ## sections) specially, or treat it as flat prose? (Unclear from docs)

---

## Verdict

**Status: ACTIONABLE** — Antigravity is worth monitoring and documenting. Adding a converter target is feasible but should wait 12 months for API stabilization.

**Recommendation for epost-kit**: 
1. Add Antigravity to documentation as a reference/comparison (now)
2. Create internal notes on AGENTS.md export format (now)
3. Schedule ecosystem review in Q1 2027 (reassess adoption + API stability)
4. If >20% adoption + stable API: add phase 2 converter (AGENTS.md + SKILL.md content)

**NOT recommended**: Attempt full agent/workflow equivalence. Different orchestration paradigm; not worth the conversion cost.

---

## Sources

- [Getting Started with Google Antigravity | Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Build with Google Antigravity, our new agentic development platform - Google Developers Blog](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)
- [Antigravity Rules: Guide with AGENTS.md & Examples (2026)](https://antigravity.codes/blog/user-rules)
- [The Complete Guide to AGENTS.md — Unified Agent Rules Across AI Coding Tools](https://antigravitylab.net/en/articles/tips/agents-md-guide)
- [AGENTS.md Guide: Cross-Tool Rules for Antigravity (2026)](https://antigravity.codes/blog/antigravity-agents-md-guide)
- [Authoring Google Antigravity Skills | Google Codelabs](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)
- [How to Use MCP Servers in Antigravity (Setup Guide 2026)](https://antigravity.codes/blog/antigravity-mcp-tutorial)
- [GitHub: antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)
- [GitHub: antigravity-workspace-template](https://github.com/study8677/antigravity-workspace-template)
- [How to Set Up and Use Google Antigravity | Codecademy](https://www.codecademy.com/article/how-to-set-up-and-use-google-antigravity)
- [An Honest Review of Google Antigravity - DEV Community](https://dev.to/fabianfrankwerner/an-honest-review-of-google-antigravity-4g6f)
