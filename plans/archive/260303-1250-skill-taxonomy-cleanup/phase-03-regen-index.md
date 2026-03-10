# Phase 03: Regenerate skill-index.json

## Context Links
- [Plan](./plan.md)
- [Phase 02](./phase-02-action-methodology-links.md)

## Overview
- Priority: P1
- Status: Pending
- Effort: 15m
- Description: Run `epost-kit init` to regenerate `.claude/` from `packages/` and verify

## Requirements
### Functional
- `.claude/skills/skill-index.json` reflects all Phase 01 + Phase 02 connection changes
- `epost-kit lint` passes

### Non-Functional
- Count field matches actual number of SKILL.md files

## Related Code Files
### Read-Only
- `.claude/skills/skill-index.json` -- verify output
- `epost-agent-cli/src/commands/init.ts` -- generates the index

## Implementation Steps

1. **Run `epost-kit init`** to regenerate `.claude/` from `packages/`
2. **Verify skill-index.json** connections for all modified skills:
   - `bootstrap` has `enhances: [bootstrap-fast, bootstrap-parallel]`
   - `cook` has `enhances: [cook-fast, cook-parallel]`
   - `plan` has `enhances: [plan-fast, plan-deep, plan-parallel]` AND `requires: [planning]`
   - `fix` has `enhances: [fix-deep, fix-ci, fix-ui]`
   - `debug` has `requires: [debugging]`
   - `review-code` has `requires: [code-review]`
   - `convert` has `requires: [web-prototype]`
   - `planning` has `enhances: [plan, plan-fast, plan-deep, plan-parallel, plan-validate]`
   - `debugging` has `enhances: [debug, fix, fix-deep, fix-ci, fix-ui]`
   - `code-review` has `enhances: [review-code, review-improvements]`
   - `web-prototype` has `enhances: [convert]`
3. **Run `epost-kit lint`** and fix any warnings
4. **Spot-check** that `count` field matches

## Todo List
- [ ] Run init
- [ ] Verify connections in generated index
- [ ] Run lint
- [ ] Verify count

## Success Criteria
- All connections present in generated `skill-index.json`
- `epost-kit lint` clean

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Init overwrites manual .claude/ changes | None | We only edited packages/ |

## Security Considerations
None

## Next Steps
- Done. All taxonomy issues resolved.
