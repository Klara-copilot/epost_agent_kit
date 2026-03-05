---
title: "Team Workflows: Rules-Based Agent Orchestration"
description: "Adopt claudekit's rules-based workflow model for epost agent teams. Update 3 existing workflows, add orchestration protocol, team coordination rules, and wire into routing."
status: completed
priority: P1
effort: 6h
tags: [workflows, orchestration, agents, rules, team-coordination]
created: 2026-03-05
updated: 2026-03-05
---

# Team Workflows: Rules-Based Agent Orchestration

## Problem Statement

Current epost_agent_kit has 3 stale workflow files (feature-development, bug-fixing, project-init) with old agent names and no enforcement mechanism. Agents lack formal handoff protocols, context passing rules, file ownership boundaries, and team coordination standards. claudekit solves this with a rules-based architecture (5 rule files in `.claude/rules/`) that all agents follow.

## Design Decision: Rules as Skills, Not Separate Directory

claudekit uses `.claude/rules/` — a non-standard directory that requires CLAUDE.md references to be discovered. In epost, we use the **skill system** which IS auto-discovered. Rules should live as **reference files within existing skills** rather than a separate directory:

| claudekit Pattern | epost Adaptation |
|---|---|
| `rules/primary-workflow.md` | `core/references/workflows.md` |
| `rules/orchestration-protocol.md` | `core/references/orchestration.md` |
| `rules/team-coordination-rules.md` | `core/references/team-coordination.md` |
| `rules/development-rules.md` | Already in `core/SKILL.md` |
| `rules/documentation-management.md` | Already in `docs/SKILL.md` |

**Why**: Skills are the unit of knowledge in our system. References within skills are loaded on-demand. No new directories needed.

## Current vs Target

| Capability | Current | Target |
|---|---|---|
| Feature dev workflow | Stale file, old agent names | Updated, wired to skills |
| Bug fix workflow | Stale file, old names | Updated, wired to skills |
| Project init workflow | Stale file, old names | Updated, wired to skills |
| Orchestration protocol | None | Context passing, sequential/parallel rules |
| Team coordination | None | File ownership, reports, communication |
| Code review workflow | None | Scout-first review pattern |
| Architecture review | None | Brainstormer → researcher → planner chain |

## Phases

| # | Phase | Effort | Status | Description |
|---|-------|--------|--------|-------------|
| 1 | Update workflow reference files | 2h | completed | Rewrite 3 workflows + add 2 new ones |
| 2 | Create orchestration protocol | 2h | completed | Context passing, parallel execution, escalation |
| 3 | Wire into core skill + CLAUDE.snippet.md | 1h | completed | Reference from routing, agents auto-discover |
| 4 | Update agents with workflow awareness | 1h | completed | Key agents reference orchestration rules |

## Phase 1: Update Workflow References

Move workflows from `packages/core/workflows/` to `packages/core/skills/core/references/` and rewrite:

### 1a. `workflow-feature-development.md`
- Fix agent names (planner, fullstack-developer, code-reviewer, docs-manager, git-manager)
- Add file ownership section
- Add parallel execution option
- Add failure/retry loop
- 6-step canonical: Plan → Implement → Test → Review → Docs → Git

### 1b. `workflow-bug-fixing.md`
- Fix agent names
- Add knowledge-capture integration (post-fix learning)
- Scout → Debug → Fix → Test → Review → Git

### 1c. `workflow-project-init.md`
- Fix agent names
- Integrate with `/get-started` and `/bootstrap` skills
- Bootstrap → Docs → Git

### 1d. NEW `workflow-code-review.md`
- Scout-based edge-case detection first
- Quality review second
- Receiving review (addressing feedback)
- Integration with knowledge-capture

### 1e. NEW `workflow-architecture-review.md`
- Brainstormer → parallel researchers → planner
- ADR creation via knowledge-capture
- Decision documentation

## Phase 2: Orchestration Protocol

Create `packages/core/skills/core/references/orchestration.md`:

### Context Passing
Every subagent invocation MUST include:
- Work context (project path)
- Reports path
- Plan context (if active plan)
- Platform context (detected platform)
- Naming convention

### Sequential vs Parallel Execution
- **Default: Sequential** — Plan → Implement → Test → Review
- **Opt-in Parallel** — when phases have exclusive file ownership
- File ownership enforcement: each file modified by exactly ONE agent/phase
- Conflict detection: reviewer checks for ownership violations

### Escalation Rules
- Test failure → debugger investigates → fix → re-test (max 3 loops)
- Review rejection → implement fix → re-review
- Ambiguous request → ask user (max 1 question)
- Multi-intent → route to project-manager

### Team Coordination
- Report output: `plans/reports/{agent}-{date}-{slug}.md`
- File naming: kebab-case, descriptive, self-documenting
- Commit convention: `feat:`, `fix:`, `docs:`, `refactor:`

## Phase 3: Wire Into System

### core/SKILL.md
Add reference to orchestration protocol and workflow index.

### CLAUDE.snippet.md
Add workflow routing hints:
```
| Multi-step feature | "plan and build X" | project-manager → workflow-feature-development |
| Bug report | "X is broken, fix it" | debugger → workflow-bug-fixing |
| New project | "bootstrap/init new" | workflow-project-init |
```

## Phase 4: Agent Workflow Awareness

Update key agents to reference orchestration protocol:

| Agent | Addition |
|---|---|
| epost-project-manager | Reference orchestration.md for delegation context |
| epost-planner | Reference workflow-feature-development for plan→implement handoff |
| epost-fullstack-developer | Reference orchestration.md for file ownership rules |
| epost-code-reviewer | Reference workflow-code-review for scout-first pattern |
| epost-debugger | Reference workflow-bug-fixing for investigation protocol |

## Critical Constraints

- ALL edits in `packages/`, never `.claude/` directly
- Workflows are reference files, not standalone skills (no SKILL.md frontmatter)
- Keep each reference file under 200 LOC
- Workflows describe patterns, not enforce them (guidance, not constraint)
- Don't duplicate content already in skill SKILL.md files

## Success Criteria

- [x] 5 workflow reference files in `core/references/` (3 updated + 2 new)
- [x] Orchestration protocol covering context passing, parallel execution, escalation
- [x] Old `workflows/` directory removed (content migrated to references)
- [x] core/SKILL.md references orchestration protocol
- [x] CLAUDE.snippet.md has workflow routing hints
- [x] Key agents reference relevant workflow/orchestration docs
- [ ] `epost-kit init` runs cleanly with new references

## Unresolved Questions

1. Should workflows be in `core/references/` or a dedicated `orchestration/` skill? (Recommendation: core/references/ — simpler, no new skill needed)
2. Should we add SendMessage-style inter-agent communication? (Recommendation: No — Claude Code doesn't support it natively; use report files instead)
3. Should parallel execution be auto-detected or always opt-in? (Recommendation: opt-in via `--parallel` flag on `/cook`)
