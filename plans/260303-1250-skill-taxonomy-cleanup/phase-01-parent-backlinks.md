# Phase 01: Add Parent-to-Variant Back-Links

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/bootstrap/SKILL.md`
- `packages/core/skills/plan/SKILL.md`
- `packages/core/skills/cook/SKILL.md`
- `packages/core/skills/fix/SKILL.md`

## Overview
- Priority: P1
- Status: Pending
- Effort: 30m
- Description: Add `enhances` back-links so parent skills know their variants exist

## Requirements
### Functional
- Each parent skill's YAML frontmatter must list variant children in `connections.enhances`
- Variant skills already have `extends: [parent]` -- verify these are correct

### Non-Functional
- Only edit `packages/core/skills/*/SKILL.md` (source of truth)

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/skills/bootstrap/SKILL.md` -- add `metadata.connections.enhances: [bootstrap-fast, bootstrap-parallel]`
- `packages/core/skills/cook/SKILL.md` -- add `metadata.connections.enhances: [cook-fast, cook-parallel]`
- `packages/core/skills/plan/SKILL.md` -- add `metadata.connections.enhances: [plan-fast, plan-deep, plan-parallel]`
- `packages/core/skills/fix/SKILL.md` -- add `metadata.connections.enhances: [fix-deep, fix-ci, fix-ui]`

### Read-Only
- `packages/core/skills/bootstrap-fast/SKILL.md` -- verify extends
- `packages/core/skills/bootstrap-parallel/SKILL.md` -- verify extends
- `packages/core/skills/cook-fast/SKILL.md` -- verify extends
- `packages/core/skills/cook-parallel/SKILL.md` -- verify extends
- `packages/core/skills/plan-fast/SKILL.md` -- verify extends
- `packages/core/skills/plan-deep/SKILL.md` -- verify extends
- `packages/core/skills/plan-parallel/SKILL.md` -- verify extends
- `packages/core/skills/fix-deep/SKILL.md` -- verify extends
- `packages/core/skills/fix-ci/SKILL.md` -- verify extends
- `packages/core/skills/fix-ui/SKILL.md` -- verify extends

## Implementation Steps

1. **Add `metadata.connections` to `bootstrap/SKILL.md`**
   - Add to YAML frontmatter: `metadata.connections.enhances: [bootstrap-fast, bootstrap-parallel]`

2. **Add `metadata.connections` to `cook/SKILL.md`**
   - Add: `metadata.connections.enhances: [cook-fast, cook-parallel]`

3. **Add `metadata.connections` to `plan/SKILL.md`**
   - Add: `metadata.connections.enhances: [plan-fast, plan-deep, plan-parallel]`

4. **Add `metadata.connections` to `fix/SKILL.md`**
   - Add: `metadata.connections.enhances: [fix-deep, fix-ci, fix-ui]`
   - Note: `fix` already has `connections.conflicts: [fix-deep]` -- preserve that

5. **Verify all variant `extends` declarations are correct** (read-only check)

## Todo List
- [ ] Add enhances to bootstrap
- [ ] Add enhances to cook
- [ ] Add enhances to plan
- [ ] Add enhances to fix
- [ ] Verify all variant extends are correct

## Success Criteria
- `skill-index.json` (after regen) shows enhances arrays on all 4 parent skills

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Wrong YAML indentation | Low | Follow existing frontmatter patterns |

## Security Considerations
None

## Next Steps
- Proceed to Phase 02 (action/methodology linking)
