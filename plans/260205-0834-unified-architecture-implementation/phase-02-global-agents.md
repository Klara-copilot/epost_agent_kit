# Phase 2: Global Agents Restructuring

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 0](phase-00-dependencies-audit.md), [Phase 1](phase-01-rules-foundation.md)
- Research: [Cross-Platform Formats](research/researcher-01-cross-platform-formats.md)

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 4h
- **Description**: Rename, create, merge, and update all global agents per the renaming map. Update commands and workflows to reference new agent names. This is the core architectural change.

## Key Insights
- Claude Code agents use YAML frontmatter: `name`, `description`, `tools`, `model`, `color`
- `agent:` field in command frontmatter routes to specific agent; must match exactly
- `orchestrator` is new; absorbs `project-manager` responsibilities + adds top-level routing
- `reviewer` absorbs `performance-analyst` capabilities into its review process
- Global agents become delegators: they detect platform and spawn platform subagents

## Requirements

### Functional

**Renames** (preserve content, update identity):
- `planner.md` -> `architect.md` (name: architect, description updated)
- `fullstack-developer.md` -> `implementer.md` (name: implementer, adds delegation logic)
- `code-reviewer.md` -> `reviewer.md` (name: reviewer, absorbs perf analysis)
- `docs-manager.md` -> `documenter.md` (name: documenter)

**Creates**:
- `orchestrator.md` - Top-level router combining PM duties + task routing

**Merges**:
- `project-manager.md` content -> `orchestrator.md` (then delete project-manager.md)
- `performance-analyst.md` content -> `reviewer.md` (then delete performance-analyst.md)

**Keeps** (update prompts to add delegation):
- `researcher.md` - Already global, no delegation needed
- `debugger.md` - Add platform delegation section
- `tester.md` - Add platform delegation section
- `git-manager.md` - Already global, no changes needed

**Updates commands** (change `agent:` field):
- `core/cook.md`: agent: fullstack-developer -> agent: implementer
- `core/plan.md`: agent: planner -> agent: architect (verify)
- All other commands: verify agent references

**Deletes**:
- `project-manager.md` (merged into orchestrator)
- `performance-analyst.md` (merged into reviewer)
- `ui-designer.md` (moves to web/designer.md in Phase 3)

### Non-Functional
- Agent prompts under 200 lines
- Each agent prompt clearly states when it delegates vs executes directly
- YAML frontmatter valid for Claude Code spec

## Architecture

### Orchestrator Flow
```
User request -> orchestrator
  |
  +-- Detects: "build a login page" -> web context
  |     -> Delegates to implementer -> implementer delegates to web/implementer
  |
  +-- Detects: "fix iOS crash" -> ios context
  |     -> Delegates to debugger -> debugger delegates to ios/debugger (future)
  |
  +-- Detects: "update README" -> no platform
        -> Delegates to documenter (executes directly, no platform agent)
```

### Delegation Pattern (added to implementer, reviewer, debugger, tester)
```yaml
## Platform Delegation

When assigned a platform-specific task:
1. Detect platform from context (file types, project structure, explicit mention)
2. Delegate to platform subagent:
   - Web: web/implementer, web/tester, web/designer
   - iOS: ios/implementer, ios/tester, ios/simulator
   - Android: android/implementer, android/tester
3. If no platform detected, ask user or default to web
```

## Related Code Files

### Create
- `.claude/agents/orchestrator.md`

### Modify
- `.claude/agents/planner.md` -> rename to `.claude/agents/architect.md`
- `.claude/agents/fullstack-developer.md` -> rename to `.claude/agents/implementer.md`
- `.claude/agents/code-reviewer.md` -> rename to `.claude/agents/reviewer.md`
- `.claude/agents/docs-manager.md` -> rename to `.claude/agents/documenter.md`
- `.claude/agents/debugger.md` - Add delegation section
- `.claude/agents/tester.md` - Add delegation section
- `.claude/commands/core/cook.md` - Update agent: field
- `.claude/commands/core/plan.md` - Update agent: field
- `.claude/commands/core/debug.md` - Verify agent: field
- `.claude/commands/core/test.md` - Verify agent: field
- `.claude/commands/core/ask.md` - Verify agent: field
- `.claude/commands/core/bootstrap.md` - Verify agent: field
- `.claude/workflows/bug-fixing.md` - Update references
- `.claude/workflows/feature-development.md` - Update references
- `.claude/workflows/project-init.md` - Update references
- `CLAUDE.md` - Update agent references

### Delete
- `.claude/agents/project-manager.md`
- `.claude/agents/performance-analyst.md`
- `.claude/agents/ui-designer.md` (moved to web/ in Phase 3)

## Implementation Steps

### Step 1: Create orchestrator.md
Create new agent combining project-manager + routing:
```yaml
---
name: orchestrator
description: Top-level task router and project manager. Routes tasks to appropriate global agents, detects platform context, manages project structure and organization.
tools: Read, Glob, Grep, Bash
model: inherit
color: green
---
```
Body includes:
- Task routing logic (analyze request -> pick agent)
- Platform detection (file extensions, project markers)
- PM duties from project-manager.md (structure, dependencies, architecture)

### Step 2: Rename planner -> architect
- Copy `planner.md` content
- Update frontmatter: `name: architect`, description updated
- Update prompt: replace "planning agent" with "architect agent"
- Remove emoji from name field (keep clean identifiers)
- Save as `architect.md`
- Delete `planner.md`

### Step 3: Rename fullstack-developer -> implementer
- Copy content, update frontmatter: `name: implementer`
- Add "Platform Delegation" section to prompt
- Remove platform-specific implementation details (those move to web/implementer)
- Save as `implementer.md`
- Delete `fullstack-developer.md`

### Step 4: Rename code-reviewer -> reviewer (absorb performance-analyst)
- Copy `code-reviewer.md` content
- Merge `performance-analyst.md` capabilities into performance review section
- Update frontmatter: `name: reviewer`
- Add "Platform Delegation" section
- Save as `reviewer.md`
- Delete `code-reviewer.md` and `performance-analyst.md`

### Step 5: Rename docs-manager -> documenter
- Copy content, update frontmatter: `name: documenter`
- Save as `documenter.md`
- Delete `docs-manager.md`

### Step 6: Update debugger.md and tester.md
- Add "Platform Delegation" section to each
- Keep existing content intact

### Step 7: Update all commands
- `core/cook.md`: `agent: fullstack-developer` -> `agent: implementer`
- `core/plan.md`: verify/update agent field to `architect`
- `core/debug.md`: verify agent field
- `core/test.md`: verify agent field
- All other commands: scan and update

### Step 8: Update workflows
- Replace old names in all 3 workflow files

### Step 9: Update CLAUDE.md
- Replace any old agent name references

### Step 10: Verify
- Grep all `.claude/` for old agent names: planner, fullstack-developer, code-reviewer, docs-manager, project-manager, performance-analyst, ui-designer
- Should return zero matches (except in plans/ directory)

## Todo List

- [ ] Create orchestrator.md with routing + PM duties
- [ ] Rename planner.md -> architect.md
- [ ] Rename fullstack-developer.md -> implementer.md (add delegation)
- [ ] Merge code-reviewer + performance-analyst -> reviewer.md
- [ ] Rename docs-manager.md -> documenter.md
- [ ] Add delegation section to debugger.md
- [ ] Add delegation section to tester.md
- [ ] Update all command agent: fields
- [ ] Update all workflow files
- [ ] Update CLAUDE.md
- [ ] Delete project-manager.md, performance-analyst.md, ui-designer.md
- [ ] Verify zero old name references remain

## Success Criteria

- 9 global agents exist: orchestrator, architect, implementer, reviewer, researcher, debugger, tester, documenter, git-manager
- 0 old agents remain: planner, fullstack-developer, code-reviewer, docs-manager, project-manager, performance-analyst, ui-designer
- All commands reference valid agent names
- Grep for old names returns zero matches in `.claude/` (excluding plans/)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Command breaks after rename | /cook fails to route | Phase 0 audit catches all references; verify grep |
| Orchestrator too complex | Prompt exceeds 200 lines | Keep routing simple: detect platform, pick agent |
| Lost content from merges | PM/perf capabilities lost | Copy key sections verbatim before merging |

## Security Considerations
- No code execution changes
- Agent tool restrictions preserved during rename
- git-manager safety rules unchanged

## Next Steps
- Phase 3 creates web/ platform agents that implementer/tester/debugger delegate to
- Phase 4 verifies the entire restructured agent system works
