# Phase 01: Update References and Relink CLI

## Context Links
- [Plan](./plan.md)
- `.claude/agents/` -- agent definitions referencing `epost-agent-cli/plans/`
- `.claude/scripts/` -- plan management scripts
- `.claude/skills/` -- skill-discovery, kit-cli

## Overview
- Priority: P1
- Status: Pending
- Effort: 30m
- Description: Update all internal references from `epost-agent-cli/` paths to the new locations, then relink the global CLI.

## Requirements
### Functional
- All agent report instructions point to `plans/INDEX.md` (not `epost-agent-cli/plans/INDEX.md`)
- Scripts use correct path for `plans/index.json`
- Skill-discovery references updated CLI path
- Global `epost-kit` linked to standalone repo

### Non-Functional
- Changes made in `packages/` (source of truth), not `.claude/` directly

## Related Code Files
### Files to Modify (in packages/)
- `packages/core/agents/epost-architect.md` -- update plan index path
- `packages/core/agents/epost-brainstormer.md` -- update plan index path
- `packages/core/agents/epost-debugger.md` -- update plan index path
- `packages/core/agents/epost-documenter.md` -- update plan index path
- `packages/core/agents/epost-implementer.md` -- update plan index path, remove CLI path detection
- `packages/core/agents/epost-orchestrator.md` -- update plan index path
- `packages/core/agents/epost-researcher.md` -- update plan index path
- `packages/core/agents/epost-reviewer.md` -- update plan index path
- `packages/core/agents/epost-tester.md` -- update plan index path
- `packages/core/scripts/complete-plan.cjs` -- update `epost-agent-cli` path to `plans/`
- `packages/core/scripts/archive-plan.cjs` -- update `epost-agent-cli` path to `plans/`
- `packages/core/skills/skill-discovery/SKILL.md` -- remove `epost-agent-cli/` platform signal
- `packages/kit/skills/kit-cli/SKILL.md` -- update directory tree reference (or remove if CLI is external)

### Files to Modify (in .claude/ -- regenerated, but also fix directly)
- Same set as above under `.claude/agents/`, `.claude/scripts/`, `.claude/skills/`

### Files to Modify (agent memory)
- `.claude/agent-memory/epost-implementer/MEMORY.md` -- update CLI path references

### Files to Migrate
- `epost-agent-cli/plans/INDEX.md` -- content already at `epost-agent-cli/plans/INDEX.md`, verify `plans/INDEX.md` exists at root level or create
- `epost-agent-cli/plans/index.json` -- same migration
- `epost-agent-cli/plans/PLAN_FORMAT.md` -- same migration

## Implementation Steps

1. **Build standalone CLI**
   - `cd /Users/than/Projects/epost-agent-kit-cli && npm run build`
   - Verify build succeeds

2. **Unlink old CLI, link new**
   - `cd /Users/than/Projects/epost_agent_kit/epost-agent-cli && npm unlink -g`
   - `cd /Users/than/Projects/epost-agent-kit-cli && npm link`
   - Verify: `epost-kit --version`

3. **Update agent references in packages/**
   - Replace `epost-agent-cli/plans/INDEX.md` with `plans/INDEX.md` in all agent files
   - Replace `epost-agent-cli/plans/index.json` with `plans/index.json`

4. **Update scripts in packages/**
   - `complete-plan.cjs`: change `path.join(cwd, 'epost-agent-cli', 'plans', 'index.json')` to `path.join(cwd, 'plans', 'index.json')`
   - `archive-plan.cjs`: same change

5. **Update skill-discovery**
   - Remove or update the `epost-agent-cli/` platform signal row

6. **Migrate plan index files**
   - Copy `epost-agent-cli/plans/INDEX.md` to `plans/INDEX.md` (if not already there)
   - Copy `epost-agent-cli/plans/index.json` to `plans/index.json`
   - Copy `epost-agent-cli/plans/PLAN_FORMAT.md` to `plans/PLAN_FORMAT.md`

7. **Re-run init to regenerate .claude/**
   - `epost-kit init` (from monorepo root)

## Todo List
- [ ] Build standalone CLI
- [ ] Unlink old, link new
- [ ] Update 9 agent files in `packages/core/agents/`
- [ ] Update 2 scripts in `packages/core/scripts/`
- [ ] Update skill-discovery SKILL.md
- [ ] Migrate plan index files to `plans/`
- [ ] Re-run `epost-kit init`
- [ ] Verify `epost-kit --version` and `epost-kit init`

## Success Criteria
- `epost-kit --version` returns version from standalone CLI
- All references in `packages/` point to `plans/` not `epost-agent-cli/plans/`

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Standalone CLI not ready | High | Build + smoke test before unlinking |
| Plan index data loss | Med | Copy before delete, verify content |
| Agent instructions break | Low | Grep verify after update |

## Security Considerations
- None identified

## Next Steps
- Phase 02: Remove embedded CLI directory
