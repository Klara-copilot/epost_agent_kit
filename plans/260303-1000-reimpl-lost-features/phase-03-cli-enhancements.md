# Phase 03: Commit CLI enhancements

## Context Links
- Parent plan: [plan.md](./plan.md)

## Overview
**Date**: 2026-03-03
**Priority**: P2
**Description**: Commit CLI lint skill-health-checks integration and new verify command
**Implementation Status**: Pending

## Key Insights
- `lint.ts` enhanced to run skill health checks in parallel with ref validation
- New `skill-health-checks.ts` module (untracked) — validates connections, completeness, orphans, sync
- New `verify.ts` command (untracked) — pre-release audit pipeline combining lint + health + dependency graph
- `cli.ts` updated to register verify command
- `init.ts` updated to emit `connections` in skill-index entries

## Related Code Files
### Modify (EXCLUSIVE)
- `epost-agent-cli/src/commands/lint.ts` — skill health check integration [OWNED]
- `epost-agent-cli/src/cli.ts` — verify command registration [OWNED]
- `epost-agent-cli/src/commands/init.ts` — connections in skill-index generation [OWNED]

### Create (EXCLUSIVE)
- `epost-agent-cli/src/core/skill-health-checks.ts` — new module [NEW]
- `epost-agent-cli/src/commands/verify.ts` — new command [NEW]

### Read-Only
- `epost-agent-cli/src/core/ref-validator.ts` — existing validation

## Implementation Steps
1. Stage new files: `git add epost-agent-cli/src/core/skill-health-checks.ts epost-agent-cli/src/commands/verify.ts`
2. Stage modified files: `git add epost-agent-cli/src/commands/lint.ts epost-agent-cli/src/cli.ts epost-agent-cli/src/commands/init.ts`
3. Verify TypeScript compiles: `cd epost-agent-cli && npx tsc --noEmit`
4. Commit with descriptive message
5. Test: `epost-kit lint` and `epost-kit verify` work

## Todo List
- [ ] Stage CLI files
- [ ] Verify TypeScript compiles
- [ ] Commit
- [ ] Test lint and verify commands

## Success Criteria
- `epost-kit lint` runs skill health checks alongside ref validation
- `epost-kit verify` command available and executes
- TypeScript compiles without errors

## Risk Assessment
**Risks**: `skill-health-checks.ts` may import types not yet defined
**Mitigation**: Check imports and compile before committing

## Next Steps
After completion: verify lint output includes health check results
