# Phase 01: Rename Existing Agents

## Context Links
- [Plan](./plan.md)
- `packages/core/agents/` — all core agent definitions
- `packages/core/package.yaml` — agent registry
- `packages/kit/agents/epost-kit-designer.md` — to be removed
- `packages/kit/package.yaml` — kit agent registry

## Overview
- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Rename 5 agents to match claudekit naming, remove epost-kit-designer

## Requirements

### Functional
- Rename agent files and `name:` frontmatter fields
- Align role descriptions and system prompts with claudekit equivalents
- Remove epost-kit-designer from kit package

### Non-Functional
- Preserve existing skills, memory, permissionMode, disallowedTools settings
- Keep `epost-` prefix on all agent names
- Keep epost-specific context (multi-platform, epost domain references)

## Related Code Files

### Files to Modify
- `packages/core/agents/epost-architect.md` — rename to `epost-planner.md`, update name/description
- `packages/core/agents/epost-orchestrator.md` — rename to `epost-project-manager.md`, update name/description
- `packages/core/agents/epost-implementer.md` — rename to `epost-fullstack-developer.md`, update name/description
- `packages/core/agents/epost-reviewer.md` — rename to `epost-code-reviewer.md`, update name/description
- `packages/core/agents/epost-documenter.md` — rename to `epost-docs-manager.md`, update name/description
- `packages/core/agents/epost-brainstormer.md` — update description to match claudekit brainstormer
- `packages/core/agents/epost-debugger.md` — update description to match claudekit debugger
- `packages/core/agents/epost-git-manager.md` — update description to match claudekit git-manager
- `packages/core/agents/epost-researcher.md` — update description to match claudekit researcher
- `packages/core/agents/epost-tester.md` — update description to match claudekit tester
- `packages/core/package.yaml` — update agents list with new names

### Files to Delete
- `packages/kit/agents/epost-kit-designer.md`

## Implementation Steps

1. **Rename agent files** (git mv for each)
   - `epost-architect.md` → `epost-planner.md`
   - `epost-orchestrator.md` → `epost-project-manager.md`
   - `epost-implementer.md` → `epost-code-reviewer.md` (wait, code-reviewer)
   - `epost-implementer.md` → `epost-fullstack-developer.md`
   - `epost-reviewer.md` → `epost-code-reviewer.md`
   - `epost-documenter.md` → `epost-docs-manager.md`

2. **Update frontmatter** in each renamed file
   - Change `name:` field to new name
   - Update `description:` to match claudekit equivalent (with `(ePost)` prefix)
   - Keep existing `skills:`, `memory:`, `permissionMode:`, `disallowedTools:` unchanged

3. **Align system prompts** with claudekit role definitions
   - planner: planning with opus model, researcher dispatch
   - project-manager: project oversight, task routing, progress tracking
   - fullstack-developer: phase execution with file ownership
   - code-reviewer: comprehensive review with scout-based edge case detection
   - docs-manager: documentation standards and maintenance

4. **Update remaining agents** (brainstormer, debugger, git-manager, researcher, tester)
   - Update `description:` to match claudekit style (include example triggers)
   - Keep `name:` unchanged

5. **Update package.yaml files**
   - `packages/core/package.yaml`: replace old names in agents list
   - `packages/kit/package.yaml`: remove epost-kit-designer from agents list

6. **Remove epost-kit-designer**
   - Delete `packages/kit/agents/epost-kit-designer.md`
   - Remove from `packages/kit/package.yaml` agents list

## Todo List
- [ ] git mv 5 agent files
- [ ] Update frontmatter name/description in all 10 core agents
- [ ] Align system prompts with claudekit roles
- [ ] Update packages/core/package.yaml agents list
- [ ] Delete epost-kit-designer + update packages/kit/package.yaml
- [ ] Verify no broken cross-references in agent files

## Success Criteria
- All 10 core agents have names matching claudekit with `epost-` prefix
- epost-kit-designer removed from kit package
- package.yaml files list correct agent names

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent name change breaks routing | High | Update CLAUDE.md in phase 03 |
| Lost functionality from kit-designer removal | Med | Kit skills remain, just no dedicated agent |
| Memory files reference old names | Low | Memory is per-agent, new name = fresh start |

## Security Considerations
- None identified

## Next Steps
- Phase 02: Add new agents (code-simplifier, journal-writer, mcp-manager, ui-ux-designer)
