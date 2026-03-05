# Phase 03: Update index, connections, cleanup

## Context Links
- [Plan](./plan.md)
- `.claude/skills/skill-index.json`
- `packages/core/package.yaml`

## Overview
- Priority: P2
- Status: Pending
- Effort: 30m
- Description: Update skill-index.json (remove planning entry, update plan entry). Update any cross-references. Grep for stale "planning" references. Run init to regenerate .claude/.

## Requirements
### Functional
- skill-index.json: remove `planning` entry, update `plan` entry with merged metadata
- skill-index.json count decremented by 1
- All skills referencing `planning` in connections updated to reference `plan`
- package.yaml updated if it lists skills
- After changes: run `epost-kit init` or equivalent to regenerate .claude/

### Non-Functional
- Zero dangling references to deleted `planning` skill

## Related Code Files
### Modify
- `.claude/skills/skill-index.json` — remove planning, update plan
- Any skill with `connections.enhances/requires/extends` referencing `planning`

### Read-Only
- `packages/core/package.yaml` — check skill registration

## Implementation Steps
1. **Grep for all references to `planning` skill**
   - `grep -r "planning" packages/core/skills/ --include="*.md" --include="*.json" --include="*.yaml"`
   - `grep -r "planning" .claude/skills/ --include="*.md" --include="*.json"`
   - Update each reference: planning -> plan
2. **Update skill-index.json**
   - Remove the `planning` object from skills array
   - Update `plan` entry: merge keywords, agent-affinity, platforms, triggers from planning
   - Decrement count by 1
3. **Check subagent-driven-development connections**
   - Currently: `enhances: [planning]` — change to `enhances: [plan]`
4. **Check knowledge-retrieval references**
   - planning skill referenced in Related Skills — update to plan
5. **Regenerate .claude/**
   - Run init command or manually sync
6. **Final validation**
   - `grep -r "planning" packages/core/ --include="*.md"` should return 0 hits for skill references
   - skill-index.json valid JSON, count matches array length

## Todo List
- [ ] Grep all planning references
- [ ] Update skill-index.json
- [ ] Update subagent-driven-development connections
- [ ] Update knowledge-retrieval related skills
- [ ] Update any other cross-references found
- [ ] Regenerate .claude/
- [ ] Validate no dangling references

## Success Criteria
- `grep -r "planning" packages/core/skills/ | grep -v "plan/"` returns nothing
- skill-index.json parses cleanly, count matches
- .claude/ regenerated successfully

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Missed reference to planning | Low | Thorough grep; CI validation |
| Init command fails | Med | Manual .claude/ sync as fallback |

## Security Considerations
None identified.

## Next Steps
- Plan complete. Ready for /cook.
