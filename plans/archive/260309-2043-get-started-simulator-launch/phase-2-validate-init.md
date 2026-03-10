---
phase: 2
title: "Validate init output matches"
effort: 0.5h
depends: [1]
---

# Phase 2: Validate Init Output

## Context Links

- [Plan](./plan.md)
- `packages/core/skills/get-started/SKILL.md` -- source
- `.claude/skills/get-started/SKILL.md` -- generated output

## Overview

- Priority: P2
- Status: Pending
- Effort: 0.5h
- Description: Run epost-kit init and verify .claude/skills/get-started/SKILL.md matches the updated source

## Requirements

### Functional

- After editing `packages/core/skills/get-started/SKILL.md`, the `.claude/` generated copy must match
- If init is not available, manually diff the two files

### Non-Functional

- Do not edit `.claude/` directly (it is generated output)

## Files to Modify

- None (validation only)

## Implementation Steps

1. Run `epost-kit init` (or equivalent regeneration command)
2. Diff `packages/core/skills/get-started/SKILL.md` vs `.claude/skills/get-started/SKILL.md`
3. If mismatch, investigate init pipeline

## Todo List

- [x] Run init
- [x] Verify generated output matches source
- [x] Fix any discrepancies

## Success Criteria

- `.claude/skills/get-started/SKILL.md` contains the new Phase 3 launch steps

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Init not available in env | Low | Manual copy or diff check |

## Security Considerations

- None identified
