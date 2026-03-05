---
phase: 1
title: "Remove scripts and update package.yaml"
effort: 0.5h
depends: []
---

# Phase 1: Remove Scripts and Update package.yaml

## Context Links
- [Plan](./plan.md)

## Overview
- Priority: P1
- Status: Pending
- Effort: 0.5h
- Description: Delete 8 unnecessary scripts, update package.yaml scripts list

## Files to Delete

- `packages/core/scripts/agent-profiler.cjs`
- `packages/core/scripts/detect-improvements.cjs`
- `packages/core/scripts/check-coverage.cjs`
- `packages/core/scripts/scan-secrets.cjs`
- `packages/core/scripts/test-fixes.cjs`
- `packages/core/scripts/validate-command-descriptions.cjs`
- `packages/core/scripts/validate-skill-connections.cjs`
- `packages/core/scripts/validate-role-scenarios.cjs`

## Files to Modify

- `packages/core/package.yaml` — Remove deleted scripts from `scripts:` list (lines 60-67)

### Expected package.yaml scripts section after:
```yaml
scripts:
  - get-active-plan.cjs
  - set-active-plan.cjs
  - complete-plan.cjs
  - archive-plan.cjs
  - generate-skill-index.cjs
```

## Implementation Steps

1. Delete the 8 scripts listed above from `packages/core/scripts/`
2. Edit `packages/core/package.yaml` — trim scripts list to 5 entries
3. Verify remaining scripts still exist and are valid

## Success Criteria
- `ls packages/core/scripts/*.cjs | wc -l` returns 5
- `package.yaml` scripts list matches expected

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Script referenced by hook | Med | Grep for script names in hooks/ before deleting |
