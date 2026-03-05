---
updated: 2026-03-05
title: "Agent Ecosystem Redesign: Responsibilities, Skills, Routing & Workflows"
description: "Audit and redesign each agent's responsibilities, skill wiring, routing paths, and workflows. One agent per phase. Preserves skill-discovery + hub context + ecosystem mental model."
status: completed
priority: P0
effort: 12h
tags: [agents, skills, routing, workflows, ecosystem, redesign]
created: 2026-03-05
---

# Agent Ecosystem Redesign

## Problem Statement

After the agent rename (PLAN-0049) and skill consolidation (PLAN-0041), the ecosystem has 17 agents with inconsistent skill wiring, overlapping responsibilities, unclear routing boundaries, and stale workflow references. Several agents (code-simplifier, journal-writer, mcp-manager, ui-ux-designer) were added from claudekit but never properly integrated into the routing and skill ecosystem.

## Design Principles (Preserved)

1. **skill-discovery** — dynamic skill loading at task start (Step 1-4 protocol)
2. **Hub context** — `/epost` smart hub with intent detection, context boost, orchestrator delegation
3. **Skill ecosystem mental model** — `skill-index.json`, connection graph (extends/requires/enhances/conflicts), agent-affinity
4. **packages/ is source of truth** — all edits in `packages/`, `.claude/` is generated

## Current State Summary

| Metric | Value |
|--------|-------|
| Total agents | 17 (14 core + a11y + muji + kit-designer) |
| Total skills | 67 (skill-index.json count) |
| Skills wired to agents | ~15 unique skills across all `skills:` lists |
| Unwired agents (minimal skills) | 5 (code-simplifier, journal-writer, mcp-manager, ui-ux-designer, brainstormer) |

## Key Issues Found

1. **Overlapping roles**: project-manager + orchestrator (epost skill forks orchestrator, but PM does same routing)
2. **Orphaned agents**: code-simplifier, journal-writer, mcp-manager have no routing path from hub
3. **Stale references**: agents reference deleted skills (repomix, docs-seeker, doc-coauthoring)
4. **Inconsistent skill wiring**: tester has [core, skill-discovery] only — no test skill
5. **Missing routing entries**: ui-ux-designer, code-simplifier not in CLAUDE.snippet.md intent map
6. **muji overloaded**: 10 skills pre-loaded (includes web-rag, ios-rag which may not exist)
7. **Model misalignment**: code-simplifier uses opus (expensive for refactoring), mcp-manager uses haiku

## Phases (One Agent Per Phase)

| # | Agent | Focus | Effort | Dependencies |
|---|-------|-------|--------|-------------|
| 1 | epost-project-manager | Merge orchestrator role, clarify as sole entry point | 1h | none |
| 2 | epost-planner | Validate plan skill wiring, subagent-driven-development | 30m | P1 |
| 3 | epost-fullstack-developer | Validate cook/implement workflow, platform skill loading | 30m | P1 |
| 4 | epost-code-reviewer | Validate review skill, receiving-code-review refs | 30m | P1 |
| 5 | epost-debugger | Validate debug skill, error-recovery integration | 30m | P1 |
| 6 | epost-tester | Add test skill, validate platform delegation | 30m | P1 |
| 7 | epost-researcher | Validate research + knowledge-retrieval, model choice | 30m | P1 |
| 8 | epost-docs-manager | Validate docs skill, knowledge-capture integration | 30m | P1 |
| 9 | epost-git-manager | Validate git skill, gemini delegation | 30m | P1 |
| 10 | epost-brainstormer | Add sequential-thinking, clarify scope vs planner | 30m | P1 |
| 11 | epost-a11y-specialist | Validate a11y skill graph, platform skill loading | 30m | none |
| 12 | epost-muji | Trim skill list, validate RAG refs, audit skill | 30m | none |
| 13 | epost-kit-designer | Validate kit-agents wiring, add kit skill | 30m | none |
| 14 | New/utility agents | Decide: keep/merge/remove code-simplifier, journal-writer, mcp-manager, ui-ux-designer | 1h | P1-P13 |
| 15 | Routing & CLAUDE.snippet.md | Update intent map, add missing agents, fix stale refs | 1h | P14 |
| 16 | skill-index.json & validation | Regenerate index, validate connections, run verify | 30m | P15 |

## Decision: Orchestrator vs Project Manager

**Recommendation**: Merge into ONE agent. Keep `epost-project-manager` name (matches claudekit).
- The `epost` skill (smart hub) currently forks `epost-orchestrator` — change to fork `epost-project-manager`
- Remove `epost-orchestrator` agent file
- Move orchestrator's routing logic into project-manager

## Decision: Utility Agents (Phase 14)

Evaluate each against "Does this need a dedicated agent, or is it a skill?":

| Agent | Recommendation | Rationale |
|-------|---------------|-----------|
| code-simplifier | MERGE into fullstack-developer | Simplification is a mode of implementation, not a separate role |
| journal-writer | KEEP as lightweight agent | Unique voice/tone, haiku model is cheap, niche trigger |
| mcp-manager | REMOVE | MCP discovery is a tool capability, not an agent role |
| ui-ux-designer | MERGE into muji | Design system agent already handles UI/UX |

## Success Criteria

- [ ] Each agent has correct, minimal `skills:` list (core + skill-discovery + role-specific)
- [ ] No agent references deleted/non-existent skills
- [ ] Every agent reachable via routing (hub intent map or another agent's delegation)
- [ ] skill-index.json agent-affinity fields updated
- [ ] CLAUDE.snippet.md intent map covers all active agents
- [ ] `epost-kit verify` passes cleanly
- [ ] Orchestrator merged into project-manager
