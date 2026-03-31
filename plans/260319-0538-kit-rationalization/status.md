# Kit Rationalization — Status

> Quick-glance overview of what's done, what's next, and key decisions.
> **This is the first file to update when something changes.**

---

## Progress

| Phase | Description | Status |
|-------|-------------|--------|
| 1. Delete Redundant Agents | Remove brainstormer, mcp-manager, journal-writer, kit-designer, project-manager | Done |
| 2. Consolidate Agents | Slim 5 agents to domain-only content | Pending |
| 3. Prune Skills | Remove 12 redundant + consolidate 9 into parent skills | Pending |
| 4. Hook Cleanup | Remove 4 non-essential hooks | Pending |
| 5. Native Delegation Wiring | Wire 4 agents to use Explore subagent + document wrapper pattern | Pending |

## Not Yet Started
- Phase 2: Consolidate Agent Responsibilities
- Phase 3: Prune Analysis/Reasoning Skills
- Phase 4: Hook Cleanup
- Phase 5: Native Delegation Wiring

## Deferred
- Planner wrapping `Plan` subagent (Q2 2026 — benefit unclear for structured phase output)
- Debugger using `general-purpose` subagent (Q2 2026 — skill injection buggy)
- Parallel Plan + researcher delegation (Q3 2026 — needs benchmarking)

---

## Known Bugs
None currently tracked.

### Recently Fixed
- None

---

## Key Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-19 | Keep all 11 non-redundant agents (slim, don't delete) | Research confirmed domain routing value; native tools lack handoff abstraction |
| 2026-03-19 | Preserve folder structure entirely | User requirement; packages/ -> .claude/ regeneration pattern is sound |
| 2026-03-19 | Consolidate kit-* skills into kit/references/ | 6 kit-authoring skills are reference material, not active behavioral skills |
| 2026-03-19 | Custom agents = wrappers around native primitives + domain skills | Report 260319-1225: native Explore/Plan handle execution, agents add domain knowledge |
| 2026-03-19 | epost-journal-writer superseded by journal skill | Journal skill loaded by fullstack-developer/debugger/planner — standalone agent unnecessary |
| 2026-03-19 | epost-mcp-manager confirmed redundant | Native MCP support in Claude Code/Cursor/Copilot handles discovery+management |
| 2026-03-19 | Multi-intent routing removed epost-project-manager | Orchestrator decomposes inline; subagents can't spawn subagents, so project-manager was non-functional as orchestrator anyway |

## Resolved Questions

| # | Question | Answer |
|---|----------|--------|
| 1 | epost-project-manager: delete or slim? | Slim — keep routing/decomposition, cut tutorial content |
| 2 | web-prototype, web-rag: keep? | Keep — real domain knowledge; consolidate into web-frontend/references/ |
| 3 | PLAN-0041 overlap? | No — different scope (folder structure vs content rationalization) |

## Open Decisions
None remaining.

---

## Architecture Reference

### Native Delegation Pattern (Phase 5)
```
Custom Agent = Native Primitive + Domain Skills + epost Format
```
- `Explore` (Haiku, read-only) → codebase scanning for any investigation/analysis agent
- `Plan` (inherited model, read-only) → pre-planning research (deferred)
- `general-purpose` (all tools) → multi-step isolated tasks (deferred until skill injection stable)

---

*Last updated: 2026-03-19*
