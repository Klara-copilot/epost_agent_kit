# Research: Native Agent Primitives & Reuse Opportunities

**Date**: March 19, 2026
**Agent**: epost-researcher
**Scope**: Built-in agent primitives across Claude Code, Cursor, and GitHub Copilot
**Status**: ACTIONABLE

---

## Executive Summary

epost_agent_kit maintains 15 custom agents primarily for domain knowledge (a11y, design-system, platform skills). However, **4-6 generic process agents (git-manager, debugger, planner, brainstormer, project-manager) can be significantly reduced or eliminated by delegating to native built-in primitives** available across Claude Code, Cursor, and Copilot.

**Key finding**: Native integration beats bolted-on custom agents. Built-in primitives offer:
- Automatic delegation based on task type (no manual routing)
- Native context preservation across parallel execution
- Lifecycle management baked into IDE/CLI
- No maintenance burden for common workflows

**Recommended approach**: Hybrid wrapper pattern — 3 epost agents become thin wrappers around native primitives + domain-specific skill injection. Remaining 12 agents stay custom (irreplaceable domain value).

---

## Part 1: Claude Code Built-in Agent Types

### Primitive Map

| Type | Model | Tools | Use Case | Strengths |
|------|-------|-------|----------|-----------|
| **Explore** | Haiku (fast) | Read-only | Fast codebase search, file discovery | Low latency, cost-efficient, prevents context pollution |
| **Plan** | Inherits | Read-only | Pre-planning research during plan mode | Prevents infinite nesting, research kept separate |
| **General-purpose** | Inherits | All tools | Multi-step complex tasks, exploration + modification | Full capability, context isolation |
| **claude-code-guide** | Haiku | Built-in help | Questions about Claude Code features | Dedicated documentation lookup |
| **Bash** | Inherits | Bash only | Terminal commands isolation | Prevents tool call bloat |

### Key Architectural Details

**Invocation Pattern**:
- Automatic delegation based on task description matching subagent `description` field
- Explicit invocation: `Use the Explore agent to...` or `@"Explore"` mention
- Cannot be nested: subagents cannot spawn other subagents (blocks infinite loops)

**Context Inheritance**:
- Subagents do NOT inherit parent conversation history
- Only receive: system prompt + tool definitions + CLAUDE.md project settings
- Parent receives only subagent's final message (verbose output stays isolated)

**Skill Injection**:
- Via `skills:` field in agent definition → full skill content injected at startup
- Subagents load skills explicitly (don't inherit parent skills)
- Skills can run in subagent context via `context: fork` + `agent:` (though currently buggy in practice)

**Tool Restrictions**:
- Allowlist (`tools:`) or denylist (`disallowedTools:`)
- Restrict Agent spawning: `Agent(worker, researcher)` syntax for subagent allowlist
- Permission modes: `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan`

---

## Part 2: Cursor Native Primitives

### Architecture (v2.5+)

**Subagent Hierarchy**:
- Synchronous subagents (traditional): parent blocks until complete
- **Async subagents** (Feb 2026): parent continues while subagent works in background
- **Nested subagents** (Feb 2026): subagents spawn their own subagents → tree of coordinated work
- **Parallel execution**: via git worktrees (isolated branches) for true concurrency

**Agent Skills** (new in Cursor):
- Domain-specific knowledge + workflows auto-discovered
- Works in editor AND CLI
- Can be packaged with agent definitions

**Sandbox Security**:
- macOS: Seatbelt kernel primitives
- Linux: Landlock + seccomp
- Windows: WSL2 sandbox (native Windows sandbox TBD)

### Advantage Over Claude Code

Cursor's async/nested subagent model allows:
- Multi-file features in parallel (tree execution)
- Large refactors without blocking parent
- Better for independent multi-step workflows

**Constraint**: Requires managing git worktree lifecycle, adding complexity.

---

## Part 3: GitHub Copilot Composable Primitives

### Composable System (GA March 2026)

Copilot ships a composable architecture where primitives complement each other:

| Primitive | Scope | Invocation | Authority |
|-----------|-------|-----------|-----------|
| **Instructions** | Always on | Implicit | Baseline guidance (highest priority) |
| **Agents (custom)** | Session-wide | User dropdown / CLI | Persistent persona |
| **Prompts** | Manual | Slash command | One-off guidance |
| **Skills** | Auto-discovered | Automatic / slash | Domain capabilities |
| **Hooks** | Execution gates | Event-driven | Hard enforcement (execution time) |
| **MCP** | Live tools | Automatic | External data/commands |

### Key Distinction from Claude Code

- **Instructions always load** (not optional) — no skill discovery required
- **Hooks are policy enforcers**, not just logging (exit code 2 = block action)
- **Agent references** via markdown links reduce duplication
- **Sub-agents** (preview) + auto-approve for MCP tools (in progress)

### Agent Composition

- Agents can reference instructions via links
- Skills bundle scripts + resources
- Hooks validate operations before execution
- No explicit "Agent tool" like Claude Code — agents are first-class session primitives

---

## Part 4: Reuse Opportunity Matrix

### Which epost Agents Map to Native Primitives?

| epost Agent | Maps To | Native Strength | epost Loss | Hybrid Viable? |
|-------------|---------|-----------------|-----------|---|
| **epost-planner** | Claude Code `Plan` | Pre-planning research isolation, phase decomposition | Custom plan format, skill-injection, phase files | **YES** — wrapper around Plan + skill loading |
| **epost-debugger** | Claude Code `general-purpose` | Multi-step investigation, modification capability | Platform detection, debug patterns, known-findings | **MAYBE** — skill injection needed |
| **epost-researcher** | Claude Code `general-purpose` + WebSearch | Complex synthesis, multi-source gathering | Report format, indexing, knowledge-capture | **NO** — domain-specific output format |
| **epost-git-manager** | CLI tools (no agent) | Native git, no overhead | Commit standards, security scanning, sign-off | **NO** — requires execution guarantees |
| **epost-brainstormer** | Claude Code `general-purpose` | Exploration, creativity | Sequential-thinking skill loading | **MAYBE** — skill-dependent |
| **epost-project-manager** | Orchestrator role (no subagent exists) | Multi-intent decomposition | Delegation routing, task tracking | **NO** — architectural role |

### Why Some Don't Delegate

**epost-researcher** (read-only synthesis):
- Native `Plan` agent designed for planning context gathering, not research report generation
- Output format (markdown reports, indexing) is domain-specific
- Recommend: Keep custom, use `Plan` agent internally for parallel context gathering

**epost-git-manager** (execution guarantees):
- No native agent for git workflows
- Requires commit message standards, security scans, GPG signing verification
- Recommend: Keep custom, might leverage Copilot's hooks for policy enforcement

**epost-project-manager** (orchestrator):
- Architectural role: decomposes multi-intent requests → routes to specialists
- No native "task decomposition + delegation" primitive
- Recommend: Keep custom (irreplaceable coordination value)

---

## Part 5: Recommended Delegation Patterns

### Pattern 1: Planner Wrapper (ACTIONABLE)

**Current**: epost-planner orchestrates custom system prompt + skill loading
**Native**: Claude Code `Plan` agent handles exploration phase
**Hybrid Approach**:

```
epost-planner
  ├─ Delegate to Claude Code Plan agent for codebase research
  ├─ Load epost-specific skills (plan phases, platform detection, etc.)
  └─ Format output as custom phase file (.claude/plans/...)
```

**Implementation**:
1. Detect plan intent in main conversation (already happens)
2. Spawn epost-planner as thin wrapper
3. epost-planner spawns Plan subagent for codebase analysis
4. epost-planner layers domain knowledge onto Plan's research
5. Return custom plan format (phases, dependencies, estimates)

**Benefit**: Plan agent handles heavy lifting (context gathering), epost injects domain knowledge (a11y checks, design-system patterns). Reduces epost maintenance.

---

### Pattern 2: Debugger with Skill Injection (EXPERIMENTAL)

**Current**: epost-debugger with custom system prompt
**Native**: Claude Code `general-purpose` agent (all tools)
**Hybrid Approach**:

```
epost-debugger
  ├─ Detect debug intent
  ├─ Spawn general-purpose agent with preloaded skills:
  │   - error-recovery (retry patterns, timeouts)
  │   - sequential-thinking (root cause methodology)
  │   - platform-specific debugging (ios-development, web-frontend, etc.)
  └─ Return findings + fixes
```

**Constraint**: Skill injection into subagents is currently buggy (`context: fork` + `agent:` ignored in practice). Likely fixed by Q2 2026.

**Verdict**: HOLD until skill-in-subagent support is stable. Worth revisiting in May 2026.

---

### Pattern 3: Researcher + Plan Parallel Delegation (EXPLORATORY)

**Current**: epost-researcher always runs inline
**Insight**: Some research tasks could parallelize with `Plan` agent

**Hybrid Approach**:
```
Main conversation
  ├─ [Agent] Plan agent (codebase research in parallel)
  ├─ [Agent] epost-researcher (external sources, synthesis)
  └─ Merge findings → comprehensive report
```

**Benefit**: Parallel execution reduces total time (plan explores codebase while researcher gathers external context).

**Challenge**: Requires coordinating two async research streams, merging results.

**Verdict**: Worth piloting for multi-source research tasks (e.g., tech evaluation + codebase audit).

---

## Part 6: What Stays Custom (Irreplaceable)

### Core epost Agents with Domain Value

| Agent | Why Custom | Replacement Cost |
|-------|-----------|------------------|
| **epost-a11y-specialist** | WCAG orchestration, platform-specific accessibility flows | Very high — domain expertise embedded |
| **epost-muji** | Design system + Figma pipeline, component knowledge | Very high — specialized UI library domain |
| **epost-fullstack-developer** | Platform detection, skill routing per platform (iOS/Android/Web/Backend) | Very high — multi-platform orchestration |
| **epost-code-reviewer** | Platform conventions, anti-patterns, security concerns per platform | High — platform-specific quality standards |
| **epost-tester** | Test framework patterns (Jest, XCTest, Gradle), platform-specific coverage | High — specialized test knowledge |
| **epost-docs-manager** | Docs structure, generation patterns, KB indexing | Medium — could leverage Copilot skills |
| **epost-researcher** | Report format, indexing, knowledge-capture workflow | High — output format is custom |

### Candidates for Reduction

| Agent | Option |
|-------|--------|
| **epost-planner** | Hybrid: wrap `Plan` agent + skill injection |
| **epost-project-manager** | Maybe split role: decomposition stays custom, delegation to specialists |
| **epost-brainstormer** | Hybrid: use `general-purpose` + sequential-thinking skill |
| **epost-debugger** | Hybrid: use `general-purpose` + platform skills (once skill injection works) |

---

## Part 7: Trade-offs & Recommendations

### Migration Path

**Phase 1 (Q2 2026): Pilot**
- Create wrapper version of epost-planner that uses Claude Code `Plan` agent internally
- Measure: plan quality, generation time, user satisfaction
- Decide: keep wrapper or revert

**Phase 2 (Q3 2026): Consolidate**
- If Phase 1 succeeds, migrate epost-debugger similarly (when skill-in-subagent is stable)
- Deprecate epost-brainstormer, delegate to `general-purpose` + skill loading

**Phase 3 (Q4 2026): Evaluate Copilot**
- GitHub Copilot custom agents + hooks reach GA
- Assess whether epost can target Copilot natively (would eliminate CLI toolkit dependency)

### Risk Assessment

**Low Risk** (safe to pilot):
- Wrapping `Plan` agent in epost-planner — Plan is read-only, doesn't disrupt epost flow

**Medium Risk** (defer until stable):
- Skill injection into subagents — currently buggy, likely fixed Q2 2026
- Async subagents in Cursor — only useful if epost targets Cursor CLI

**High Risk** (not recommended):
- Replacing epost-project-manager with native orchestrator — no equivalent primitive exists
- Delegating git operations to native tools — loses commit standards + security scanning

---

## Part 8: Code Example — Hybrid Planner Wrapper

### Before: Pure Custom

```markdown
# epost-planner system prompt (monolithic)
You are a software architect...
[100+ lines of planning methodology]
[Phase definitions]
[Skill loading logic]
```

### After: Hybrid Wrapper

```yaml
# .claude/agents/epost-planner
---
name: epost-planner
description: Software architect with domain knowledge integration
tools: Agent, Read, Glob, Grep
model: inherit
skills:
  - plan
  - knowledge-retrieval
---

You are an architectural coordinator integrating platform expertise.

When asked to plan:
1. Delegate to the Plan subagent for codebase research
2. Load domain skills: a11y, design-system, platform patterns
3. Synthesize epost-specific phase file format
4. Return structured plan with estimates + dependencies
```

**In epost-planner logic**:
```python
# Spawn Plan agent for codebase gathering
plan_research = await Agent(
  subagent_type="Plan",
  prompt=f"Research {codebase_scope} for planning context"
)

# Load epost skills into local context
load_skills(["a11y", "design-system", "platform-patterns"])

# Synthesize research + skills into epost phase format
phases = synthesize_phases(plan_research, loaded_skills)
return format_as_plan_file(phases)
```

---

## Part 9: Summary Matrix

### Native Primitives Available (March 2026)

| Tool | Built-in Types | Sub-agent Nesting | Skill Injection | Hooks | Cost Model |
|------|---|---|---|---|---|
| **Claude Code** | 4 (Explore, Plan, general-purpose, claude-code-guide) | NO nesting | YES (but buggy) | Basic | Free |
| **Cursor** | Custom configurable | YES async/nested | YES (Agent Skills) | YES | Paid |
| **Copilot** | Custom + Plan Agent | YES (preview) | YES (Skills) | YES (GA) | Paid |

### Recommendation Summary

✅ **Actionable** — epos-planner wrapper (Phase 1, Q2 2026)
🔄 **Experimental** — Parallel Plan + researcher delegation
⏸️ **Hold** — epos-debugger wrapper (wait for skill injection stability)
❌ **Not Viable** — Replace epos-project-manager or epos-git-manager

---

## Unresolved Questions

1. **When will skill-in-subagent support stabilize?** Current `context: fork` + `agent:` support is acknowledged as buggy. Expected timeline Q2 2026?

2. **Does Copilot skill discovery work across agent types?** Copilot's composable system allows agents to reference instructions via links. Can skills be discovered automatically, or only manually invoked?

3. **Can epost-specific phase format be preserved in Plan wrapper?** Will wrapping Plan agent lose phase structure, or can epost re-serialize Plan's output?

4. **What's the latency cost of nested agent spawning in Cursor?** Cursor's tree model may be slower than Copilot's flat composition. Worth benchmarking?

5. **Is there demand to target Copilot natively?** Would epost users benefit from Copilot support, or is Claude Code sufficient?

---

## Sources

- [Claude Code: Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude API: Subagents in the SDK](https://platform.claude.com/docs/en/agent-sdk/subagents)
- [Cursor Changelog 2.5: Async Subagents](https://cursor.com/changelog/2-5)
- [GitHub Copilot: Creating custom agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)
- [GitHub Copilot: About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [GitHub Blog: Major agentic improvements (Mar 2026)](https://github.blog/changelog/2026-03-11-major-agentic-capabilities-improvements-in-github-copilot-for-jetbrains-ides/)
- [Claude Code Agents & Subagents: What They Actually Unlock](https://www.ksred.com/claude-code-agents-and-subagents-what-they-actually-unlock/)
- [Agent design patterns (2026)](https://rlancemartin.github.io/2026/01/09/agent_design/)

---

**Verdict**: `ACTIONABLE` — Immediate opportunity for epos-planner wrapper. Defer debugger/brainstormer until skill injection stabilizes. Maintain irreplaceable domain agents (a11y, muji, fullstack-developer).
