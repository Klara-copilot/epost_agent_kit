# Phase 02: Update Skill-Discovery for Git Signals

## Context Links
- Parent plan: [plan.md](./plan.md)
- Source skill: `packages/core/skills/skill-discovery/SKILL.md`
- Deployed skill: `.claude/skills/skill-discovery/SKILL.md`

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Add git operations row to skill-discovery's Task Type Signals table and Quick Reference table
**Implementation Status**: Pending

## Key Insights
- skill-discovery has Platform Signals (ios, android, web, backend, cli, design) but no git operations signal
- Git is NOT a platform -- it's a task type (like debugging, research, documentation)
- Should go in "1b. Task Type Signals" table, not "1a. Platform Signals"
- Hub-context already has signal words: commit, push, pr, merge, done, ship

## Requirements
### Functional
- Add row to Task Type Signals (Section 1b) for git operations
- Add row to Quick Reference: Common Discovery Paths table
- Signal words align with hub-context intent map: commit, push, pr, merge, done, ship

### Non-Functional
- Keep table formatting consistent with existing rows

## Architecture
No architectural change. Table row additions.

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/skills/skill-discovery/SKILL.md` — source of truth [OWNED]
- `.claude/skills/skill-discovery/SKILL.md` — deployed copy (mirror) [OWNED]

### Read-Only
- `packages/core/skills/hub-context/SKILL.md` — reference for signal words

## Implementation Steps

1. In `packages/core/skills/skill-discovery/SKILL.md`, find the Task Type Signals table (Section 1b). After the last row (`get started, onboard...`), add:
   ```
   | commit, push, pr, merge, done, ship, branch | git operations | git-commit, git-push, git-pr |
   ```

2. Find the Quick Reference: Common Discovery Paths table. Add after the last row:
   ```
   | any agent | git task (commit, push, pr) | git-commit, git-push, git-pr |
   ```

3. Mirror both changes to `.claude/skills/skill-discovery/SKILL.md`

## Todo List
- [ ] Add git row to Task Type Signals table in packages/
- [ ] Add git row to Quick Reference table in packages/
- [ ] Mirror to .claude/ copy

## Success Criteria
- Grep for "git-commit" in skill-discovery SKILL.md returns matches
- Table has well-formed markdown row with pipe delimiters

## Risk Assessment
**Risks**: Minimal. Additive table rows.
**Mitigation**: Visual check of table alignment after edit.

## Security Considerations
None.

## Next Steps
After completion:
1. Run `epost-kit init` to validate regeneration picks up changes
2. Test: ask an agent "commit my changes" and verify git-commit skill is discovered
