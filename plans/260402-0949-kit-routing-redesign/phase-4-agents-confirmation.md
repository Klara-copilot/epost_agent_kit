---
phase: 4
title: "Agent frontmatter cleanup + confirmation gates"
effort: 1.5h
depends: []
---

## Context Links

- Plan: [plan.md](./plan.md)
- Agent files: `packages/core/agents/epost-*.md` (9 files)
- Skill files: `packages/core/skills/code-review/SKILL.md`, `packages/core/skills/clean-code/SKILL.md`

## Overview

Two changes: (1) Remove `skill-discovery` from all 9 core agents' `skills:` frontmatter (P3 corollary — skill-discovery becomes a passive catalogue, not a runtime loader). (2) Add confirmation gate pattern to code-modifying skills (P4).

## Requirements

### Functional — P3: Remove skill-discovery from agents
1. Remove `skill-discovery` from `skills:` list in all 9 agents:
   - epost-fullstack-developer, epost-debugger, epost-tester, epost-researcher
   - epost-planner, epost-docs-manager, epost-git-manager, epost-brainstormer
   - epost-code-reviewer
2. Keep `core` and all other skills intact
3. Platform-specific agents (muji, a11y) are in separate packages — not in scope

### Functional — P4: Confirmation gate
4. Add confirmation gate rule to `code-review/SKILL.md`:
   - Review findings that require code changes → propose changes first
   - User confirms → then apply
   - Never auto-apply refactoring suggestions on working code
5. Add same pattern to `clean-code/SKILL.md`:
   - Propose improvements → user confirms → apply
   - Never auto-execute clean-code changes

## Files to Change

- `packages/core/agents/epost-fullstack-developer.md` — remove `skill-discovery`
- `packages/core/agents/epost-debugger.md` — remove `skill-discovery`
- `packages/core/agents/epost-tester.md` — remove `skill-discovery`
- `packages/core/agents/epost-researcher.md` — remove `skill-discovery`
- `packages/core/agents/epost-planner.md` — remove `skill-discovery`
- `packages/core/agents/epost-docs-manager.md` — remove `skill-discovery`
- `packages/core/agents/epost-git-manager.md` — remove `skill-discovery`
- `packages/core/agents/epost-brainstormer.md` — remove `skill-discovery`
- `packages/core/agents/epost-code-reviewer.md` — remove `skill-discovery`
- `packages/core/skills/code-review/SKILL.md` — add confirmation gate
- `packages/core/skills/clean-code/SKILL.md` — add confirmation gate
- `packages/core/skills/simplify/SKILL.md` — add confirmation gate (if exists)

## Implementation Steps

1. For each of the 9 agent files, edit `skills:` frontmatter to remove `skill-discovery`
   - Example: `skills: [core, skill-discovery, test]` → `skills: [core, test]`
2. Read `packages/core/skills/code-review/SKILL.md`
3. Add confirmation gate section:
   ```markdown
   ## Confirmation Gate
   Code-modifying suggestions (refactor, rename, restructure) require explicit user confirmation before applying.
   1. Present proposed changes with rationale
   2. Wait for user confirmation
   3. Apply only after "yes" / "go ahead" / explicit approval
   Never auto-apply changes to working code.
   ```
4. Read `packages/core/skills/clean-code/SKILL.md`
5. Add similar confirmation gate section
6. Run `epost-kit init` and verify all agents regenerated correctly

## Todo List

- [ ] Remove skill-discovery from epost-fullstack-developer
- [ ] Remove skill-discovery from epost-debugger
- [ ] Remove skill-discovery from epost-tester
- [ ] Remove skill-discovery from epost-researcher
- [ ] Remove skill-discovery from epost-planner
- [ ] Remove skill-discovery from epost-docs-manager
- [ ] Remove skill-discovery from epost-git-manager
- [ ] Remove skill-discovery from epost-brainstormer
- [ ] Remove skill-discovery from epost-code-reviewer
- [ ] Add confirmation gate to code-review SKILL.md
- [ ] Add confirmation gate to clean-code SKILL.md
- [ ] Run epost-kit init, verify regeneration

## Success Criteria

- No agent has `skill-discovery` in its `skills:` frontmatter
- code-review SKILL.md has confirmation gate section
- clean-code SKILL.md has confirmation gate section
- `epost-kit init` succeeds
