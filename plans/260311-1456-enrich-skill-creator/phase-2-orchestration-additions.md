---
phase: 2
title: "Add consensus pattern + ultrathink to orchestration"
effort: 1h
depends: []
---

# Phase 2: Orchestration Additions

## Tasks

### 2.1 Add consensus-voting pattern to orchestration.md
**Update:** `packages/core/skills/core/references/orchestration.md`

Add new section "## Consensus-Voting Pattern (Advanced)" after "## Subagent-Driven Development Integration":

Content:
- **When**: High-stakes design decisions, multi-perspective analysis, architecture tradeoffs
- **How**: 3 agents generate independent options → criteria-based evaluation → winner becomes spec
- **Flow**:
  ```
  Main context → [Agent] → brainstormer (generates 3 options)
  Main context → [Agent] → researcher (evaluates against criteria)
  Main context → [Agent] → planner (selects winner, writes spec)
  ```
- **Criteria template**: list of evaluation dimensions (feasibility, maintenance, performance, alignment)
- **When NOT to use**: single-option tasks, time-sensitive fixes, clear best practice exists
- Note: follows subagent spawn constraint (all dispatched from main context)

### 2.2 Add ultrathink guidance
**Update:** `packages/kit/skills/kit-skill-development/SKILL.md`

Add brief section "## Extended Thinking (`ultrathink`)" after CSO section:

Content:
- Anthropic supports `ultrathink` keyword in skill content to trigger extended thinking
- **When to use**: complex multi-step orchestration, deep analysis, architecture decisions
- **When NOT to use**: simple workflows, lookup tasks, CRUD operations
- **How**: include word "ultrathink" naturally in skill body where deep reasoning is needed
- Keep guidance to 5-8 lines max

## Files Changed

| File | Action |
|------|--------|
| `packages/core/skills/core/references/orchestration.md` | UPDATE (add consensus-voting section) |
| `packages/kit/skills/kit-skill-development/SKILL.md` | UPDATE (add ultrathink section) |

## Validation

- [ ] Consensus pattern section exists in orchestration.md with flow diagram
- [ ] Pattern respects subagent spawn constraint (dispatched from main context only)
- [ ] Ultrathink section in SKILL.md is 5-8 lines, includes when/when-not guidance
