# Phase 01: Fix metadata + CLAUDE.md regression

## Context Links
- Parent plan: [plan.md](./plan.md)

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Restore `.epost-metadata.json` to full profile and regenerate CLAUDE.md with all platform sections
**Implementation Status**: Pending

## Key Insights
- `.epost-metadata.json` changed `installedPackages` from 9 packages to just `["core"]`
- `profile` field removed entirely
- CLAUDE.md lost ~140 lines: a11y, web, iOS, Android, backend, kit, design-system sections
- Root cause: `epost-kit init` ran without profile flag, defaulted to core-only
- The `get-started` onboarding row added to Smart Routing is a legitimate NEW feature to keep

## Requirements
### Functional
- Restore `installedPackages` to full list
- Restore `profile: "full"` field
- Regenerate CLAUDE.md with all platform sections via `epost-kit init --profile full`
- Preserve the new `/get-started` routing row

### Non-Functional
- Do NOT manually edit `.claude/` files — use init to regenerate

## Related Code Files
### Modify (EXCLUSIVE)
- `.epost-metadata.json` — restore profile + packages list before re-init
### Read-Only
- `epost-agent-cli/src/commands/init.ts` — understand init behavior

## Implementation Steps
1. Revert `.epost-metadata.json` to committed version: `git checkout -- .epost-metadata.json`
2. Revert `.claude/` generated files: `git checkout -- CLAUDE.md`
3. Run `epost-kit init --profile full` to regenerate everything cleanly
4. Verify CLAUDE.md has all platform sections
5. Re-apply the `/get-started` routing row if lost during regeneration
6. Verify `.epost-metadata.json` shows full profile

## Todo List
- [ ] Revert metadata to committed state
- [ ] Run full-profile init
- [ ] Verify platform sections present
- [ ] Verify get-started routing preserved

## Success Criteria
- `.epost-metadata.json` has `profile: "full"` and all 9 packages
- CLAUDE.md has a11y, web, iOS, Android, backend, kit, design-system sections

## Risk Assessment
**Risks**: Re-init might overwrite other working tree changes in `.claude/`
**Mitigation**: Commit packages/ changes first, or stash `.claude/` changes

## Next Steps
After completion: proceed to phases 2-4 for feature commits
