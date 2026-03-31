---
phase: 1
title: "Apply Navigation Headers to All 15 Agents"
effort: 2.5h
depends: []
---

# Phase 1: Apply Navigation Headers

## Context Links
- [Plan](./plan.md)
- `packages/core/agents/` — 12 agents
- `packages/a11y/agents/epost-a11y-specialist.md` — 1 agent
- `packages/design-system/agents/epost-muji.md` — 1 agent
- `packages/kit/agents/epost-kit-designer.md` — 1 agent

## Overview
- Priority: P1
- Status: Pending
- Effort: 2.5h
- Description: Insert a navigation header block after frontmatter in each agent file

## Requirements

### Header Template

Insert this block between closing `---` of frontmatter and the first line of agent body:

```markdown
<!-- AGENT NAVIGATION
## {agent-name}
Summary: {one-line description of what this agent does}

### Intention Routing
| Intent Signal | Source | Action |
|---------------|--------|--------|
| {signal} | {who triggers} | {what happens} |

### Section Index
| Section | Line |
|---------|------|
| {section name} | L{N} |
-->
```

The header is an HTML comment so it does NOT interfere with the system prompt but is visible when reading source.

### Functional
- Each agent gets a unique routing table derived from CLAUDE.md intent map + agent's own `## When Activated` section
- Section index lists major `##` headings with their line numbers
- Line numbers are approximate (will shift as file changes) — use format `~L{N}`

### Non-Functional
- Header must be < 25 lines per agent
- Must not break YAML frontmatter parsing
- Must preserve existing content verbatim

## Agent-Specific Routing Data

### Core Agents (packages/core/agents/)

**epost-fullstack-developer.md**
- Triggers: "cook", "implement", "build", "create", "add", "make", "continue"
- Source: orchestrator, project-manager, planner handoff
- Receives from: epost-planner (handoff), epost-project-manager (delegation)

**epost-planner.md**
- Triggers: "plan", "design", "architect", "spec", "roadmap"
- Source: orchestrator, brainstormer handoff, researcher handoff
- Receives from: epost-brainstormer (handoff), epost-researcher (handoff)

**epost-debugger.md**
- Triggers: "debug", "trace", "inspect", "diagnose", "broken", "error", "crash"
- Source: orchestrator, build failures, CI failures

**epost-code-reviewer.md**
- Triggers: "review", "check code", "audit" (code-level)
- Source: orchestrator, fullstack-developer completion, hybrid audit flow

**epost-tester.md**
- Triggers: "test", "coverage", "validate", "verify"
- Source: orchestrator, debugger handoff

**epost-researcher.md**
- Triggers: "how does X work", "best practices", "compare", "research"
- Source: orchestrator, planner (parallel fan-out)

**epost-project-manager.md**
- Triggers: ambiguous requests, multi-step workflows, project status, progress tracking
- Source: orchestrator (fallback router)

**epost-git-manager.md**
- Triggers: "commit", "push", "pr", "merge", "done", "ship"
- Source: orchestrator, any agent handoff after completion

**epost-docs-manager.md**
- Triggers: "docs", "document", "write docs", "migrate docs", "scan docs"
- Source: orchestrator, muji (docs gap delegation)

**epost-brainstormer.md**
- Triggers: "brainstorm", "think about", "explore options", "trade-offs"
- Source: orchestrator, architecture review workflow

**epost-journal-writer.md**
- Triggers: auto (3+ test failures, critical bugs, redesign needed)
- Source: internal auto-trigger, orchestrator

**epost-mcp-manager.md**
- Triggers: MCP tool discovery, RAG management (non-RAG MCP only for subagents)
- Source: orchestrator, muji (Template E delegation)

### Package-Specific Agents

**epost-a11y-specialist.md** (packages/a11y/)
- Triggers: "a11y", "accessibility", "wcag", "VoiceOver", "TalkBack", "ARIA"
- Source: orchestrator, code-reviewer (escalation), muji (a11y findings)

**epost-muji.md** (packages/design-system/)
- Triggers: "design", "component", "UI/UX", "figma", "klara-theme", "landing page"
- Source: orchestrator, hybrid audit flow (Template A+)

**epost-kit-designer.md** (packages/kit/)
- Triggers: "create agent", "add skill", "add hook", "kit authoring"
- Source: orchestrator, kit maintenance tasks

## Implementation Steps

1. **Read each agent file** from `packages/` path
2. **Parse frontmatter end** (second `---` line)
3. **Build routing table** from data above + agent's own triggers
4. **Scan ## headings** to build section index with line numbers
5. **Insert HTML comment block** after frontmatter
6. **Write file** back

Process all 15 agents:

| # | File | Package |
|---|------|---------|
| 1 | `packages/core/agents/epost-fullstack-developer.md` | core |
| 2 | `packages/core/agents/epost-planner.md` | core |
| 3 | `packages/core/agents/epost-debugger.md` | core |
| 4 | `packages/core/agents/epost-code-reviewer.md` | core |
| 5 | `packages/core/agents/epost-tester.md` | core |
| 6 | `packages/core/agents/epost-researcher.md` | core |
| 7 | `packages/core/agents/epost-project-manager.md` | core |
| 8 | `packages/core/agents/epost-git-manager.md` | core |
| 9 | `packages/core/agents/epost-docs-manager.md` | core |
| 10 | `packages/core/agents/epost-brainstormer.md` | core |
| 11 | `packages/core/agents/epost-journal-writer.md` | core |
| 12 | `packages/core/agents/epost-mcp-manager.md` | core |
| 13 | `packages/a11y/agents/epost-a11y-specialist.md` | a11y |
| 14 | `packages/design-system/agents/epost-muji.md` | design-system |
| 15 | `packages/kit/agents/epost-kit-designer.md` | kit |

## Todo List

- [ ] Define final header template
- [ ] Apply header to epost-fullstack-developer.md
- [ ] Apply header to epost-planner.md
- [ ] Apply header to epost-debugger.md
- [ ] Apply header to epost-code-reviewer.md
- [ ] Apply header to epost-tester.md
- [ ] Apply header to epost-researcher.md
- [ ] Apply header to epost-project-manager.md
- [ ] Apply header to epost-git-manager.md
- [ ] Apply header to epost-docs-manager.md
- [ ] Apply header to epost-brainstormer.md
- [ ] Apply header to epost-journal-writer.md
- [ ] Apply header to epost-mcp-manager.md
- [ ] Apply header to epost-a11y-specialist.md
- [ ] Apply header to epost-muji.md
- [ ] Apply header to epost-kit-designer.md

## Success Criteria

- All 15 files have navigation header comment blocks
- No YAML frontmatter parsing errors
- Each header has: summary, routing table (2-4 rows), section index (3-8 rows)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Frontmatter breakage | High | Insert AFTER closing `---`, never inside frontmatter |
| Line numbers drift | Low | Use `~L{N}` approximate notation, update periodically |
| HTML comment interferes with model | Low | Claude Code ignores HTML comments in markdown by default |

## Security Considerations

None identified.

## Next Steps

- After all headers applied, proceed to Phase 2 (regenerate `.claude/`)
