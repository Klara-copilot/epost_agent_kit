---
phase: 3
title: "Index protocol + report standard updates"
effort: 30m
depends: [1, 2]
---

# Phase 3: Index Protocol and Report Standard Updates

## Context Links

- [Plan](./plan.md)
- `packages/core/skills/core/references/index-protocol.md`
- `packages/core/skills/core/references/report-standard.md`

## Overview

- Priority: P2
- Status: Pending
- Effort: 30m
- Description: Final cross-referencing pass. Ensure all three index files, report standard, and output contract are internally consistent. Run epost-kit init to sync.

## Requirements

### Functional

- `report-standard.md` Per-Agent Templates table updated -- link to folder pattern
- `output-contract.md` references `.epost-data/` directory layout (from Phase 1)
- `index-protocol.md` Agent Responsibility Matrix unchanged (already correct)
- Cross-reference: `report-standard.md` -> `output-contract.md` -> `index-protocol.md`

### Non-Functional

- Run `npx epost-kit init --source . --yes` to sync `.claude/`

## Related Code Files

### Files to Modify

- `packages/core/skills/core/references/report-standard.md` -- add cross-ref to output-contract
- `packages/core/skills/audit/references/output-contract.md` -- add cross-ref to report-standard

### Files to Create

- None

### Files to Delete

- None

## Implementation Steps

1. **Add cross-references**
   - `report-standard.md`: add "See `audit/references/output-contract.md` for audit-specific session folder contract"
   - `output-contract.md`: add "See `core/references/report-standard.md` for general report anatomy and folder pattern"

2. **Verify consistency**
   - `reports/index.json` schema in index-protocol matches what agents will produce
   - Folder pattern in report-standard matches output-contract session folder pattern
   - All three known-findings stores referenced in output-contract

3. **Sync**
   - Run `npx epost-kit init --source . --yes`
   - Verify `.claude/skills/` matches `packages/` changes

## Todo List

- [x] Add cross-references between report-standard and output-contract
- [x] Verify schema consistency
- [x] Run epost-kit init
- [x] Spot-check `.claude/` output

## Success Criteria

- All doc files cross-reference each other correctly
- `.claude/` in sync with `packages/`
- No orphan references

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| epost-kit init may fail | Low | Run manually, check output |

## Security Considerations

- None

## Next Steps

- Mark plan as completed
- Consider archiving PLAN-0064b (audit-session-folder-pattern) as superseded
