---
phase: 1
title: "Create epost-brainstormer agent file"
effort: 1.5h
depends: []
---

# Phase 1: Create epost-brainstormer Agent File

## Context Links
- [Plan](./plan.md)
- Reference: `/Users/than/Projects/claudekit/.claude/agents/brainstormer.md` (CK source)
- Conventions: `packages/core/agents/epost-planner.md` (epost style reference)

## Overview
- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Create the agent definition following epost frontmatter, nav header, and body conventions

## Requirements

### Functional
- CTO-level ideation advisor; does NOT write code
- Challenges assumptions, surfaces alternatives, quantifies trade-offs
- 7-phase process: Discovery → Research → Analysis → Debate → Consensus → Report → Offer to plan
- Behavioral checklist (6 items) verified before session end
- Hands off to epost-planner when consensus reached
- Report output uses epost naming: `reports/{YYMMDD-HHMM}-{slug}-epost-brainstormer.md`

### Non-Functional
- Agent file under 200 lines
- Follow YAGNI/KISS/DRY

## Related Code Files

### Files to Create
- `packages/core/agents/epost-brainstormer.md` — new agent definition

### Files to Read (for convention reference)
- `packages/core/agents/epost-planner.md` — frontmatter + nav header pattern
- `packages/core/agents/epost-researcher.md` — handoff pattern
- `packages/core/skills/thinking/SKILL.md` — framework names to reference
- `packages/core/skills/plan/references/predict-mode.md` — predict framework for high-stakes decisions

### Files to Delete
- None

## Implementation Steps

1. **Write frontmatter block**
   - `name: epost-brainstormer`
   - `description: (ePost) Use when user wants to ideate, brainstorm approaches, debate architecture decisions, or explore technical options before committing to implementation`
   - `color: purple`
   - `model: opus`
   - `skills: [core, skill-discovery, knowledge, thinking]`
   - `memory: project`
   - `permissionMode: default`
   - `handoffs:` with label "Create plan from ideas" → `epost-planner`
   - NO `disallowedTools` — brainstormer needs Write for reports

2. **Write AGENT NAVIGATION header**
   - Summary: "CTO-level ideation advisor for architecture decisions and technical debates"
   - Intention Routing table:
     | "brainstorm", "should we", "help me think", "which approach" | orchestrator | Ideation session |
     | "compare options", "architecture decision", "what's the best way" | orchestrator | Technical debate |
   - Handoff Targets: → epost-planner (when consensus reached)
   - Section Index with line references

3. **Write agent body (adapt from CK, remove CK-specific content)**
   - Opening: "You are a CTO-level advisor challenging assumptions..."
   - Behavioral Checklist (6 items — keep as-is from CK, they're universal):
     - Assumptions challenged
     - Alternatives surfaced (2-3 genuinely different)
     - Trade-offs quantified
     - Second-order effects named
     - Simplest viable option identified
     - Decision documented
   - Core principles: YAGNI/KISS/DRY
   - Expertise areas: system architecture, risk assessment, DX/UX, tech debt, performance
   - Skill activation preamble: "Activate relevant skills from `.claude/skills/` based on task context."
   - Platform/domain awareness: "Load platform and domain skills dynamically — detect from file context or ask."

4. **Write 7-phase process (adapted from CK)**
   - **Discovery**: Ask clarifying questions about requirements, constraints, success criteria
   - **Research**: Use `knowledge-retrieval` for prior art + internal patterns; reference `epost-researcher` for deep external research needs
   - **Analysis**: Evaluate approaches using expertise + principles; use `thinking` skill frameworks (assumption audit, hypothesis cycle) for complex analysis; reference `predict` framework from `plan/references/predict-mode.md` for high-stakes decisions
   - **Debate**: Present 2-3 options, challenge user preferences, work toward optimal
   - **Consensus**: Ensure alignment, document agreed approach
   - **Report**: Create markdown summary with: problem statement, evaluated approaches (pros/cons), recommended solution, risks, success metrics, next steps
   - **Handoff**: Ask if user wants implementation plan → if yes, tell user to dispatch epost-planner (or use handoff button). Pass brainstorm context.

5. **Write report output section**
   - Use epost report standard: `core/references/report-standard.md`
   - Naming: `reports/{YYMMDD-HHMM}-{slug}-epost-brainstormer.md`
   - Content: problem statement, evaluated approaches, recommended solution, risks, metrics, next steps

6. **Write critical constraints**
   - Does NOT implement code — advisory only
   - Validates feasibility before endorsing
   - Prioritizes long-term maintainability over short-term convenience
   - Considers both technical excellence and business pragmatism

7. **Verify: NO CK-specific content remains**
   - No Team Mode section
   - No references to `ck:scout`, `ck:plan`, `docs-seeker` skill, `ai-multimodal`, `psql`, `repomix`, `sequential-thinking`
   - No `TaskCreate`, `TaskGet`, `TaskUpdate`, `TaskList`, `SendMessage` references
   - No CK-specific slash commands

## Todo List
- [ ] Create `packages/core/agents/epost-brainstormer.md`
- [ ] Verify frontmatter matches epost conventions
- [ ] Verify nav header follows pattern from epost-planner.md
- [ ] Verify no CK-specific references leaked
- [ ] Verify file under 200 lines

## Success Criteria
- Agent file parses valid YAML frontmatter
- Contains all 6 behavioral checklist items
- Contains all 7 process phases
- References epost skills (thinking, knowledge, plan/predict)
- References epost-planner for handoff (not /ck:plan)
- No CK-specific tool or slash command references

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Accidentally copy CK verbatim | Med | Checklist step 7 — explicit CK removal verification |
| `thinking` skill not installed in `.claude/` | Low | Skill is in `packages/core/skills/` — will install on next `epost-kit init` |
| Overlap with epost-planner scope | Med | Clear boundary: brainstormer = explore options, planner = create implementation plan |

## Security Considerations
- None identified — advisory agent with no code execution
