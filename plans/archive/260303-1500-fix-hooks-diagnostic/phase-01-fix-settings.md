# Phase 01: Fix settings.json hooks

## Context Links
- Parent plan: [plan.md](./plan.md)
- Report: `plans/reports/epost-architect-260303-1333-hooks-diagnostic.md`

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Remove broken PostToolUse hooks and statusLine config from settings.json
**Implementation Status**: Pending

## Key Insights
- No `package.json` at project root -- `npm run lint` and `npm run build` are meaningless here
- `~/.claude/statusline.sh` does not exist and is not created by `epost-kit init`
- Both issues cause errors on every session/tool use

## Requirements
### Functional
- Remove PostToolUse lint/build hooks (P1 fix)
- Remove statusLine block (P2 fix)
### Non-Functional
- Settings JSON must remain valid after edits

## Architecture
Direct deletion of JSON blocks in `packages/core/settings.json`.

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/settings.json` -- Remove PostToolUse block (lines 50-70), remove statusLine block (lines 112-116) [OWNED]
### Read-Only
- `plans/reports/epost-architect-260303-1333-hooks-diagnostic.md` -- Reference

## Implementation Steps

1. In `packages/core/settings.json`, delete the entire `"PostToolUse"` key and its array value (lines 50-71)
2. Delete the `"statusLine"` key and its object value (lines 112-116)
3. Optionally remove stale `permissions.allow` entries that reference `npm run lint:*` and `npm run build` (lines 101-102) since those hooks are gone
4. Validate JSON is well-formed

### Exact changes

**Remove** from hooks object:
```json
"PostToolUse": [
  {
    "matcher": "Write|Edit",
    "hooks": [
      {
        "type": "command",
        "command": "npm run lint -- --fix 2>/dev/null || true",
        "timeout": 30
      }
    ]
  },
  {
    "matcher": "Write|Edit",
    "hooks": [
      {
        "type": "command",
        "command": "npm run build 2>/dev/null || true",
        "timeout": 60
      }
    ]
  }
],
```

**Remove** top-level key:
```json
"statusLine": {
  "type": "command",
  "command": "~/.claude/statusline.sh",
  "padding": 0
}
```

## Todo List
- [ ] Remove PostToolUse hooks
- [ ] Remove statusLine config
- [ ] Remove stale permission entries
- [ ] Validate JSON

## Success Criteria
- `packages/core/settings.json` parses as valid JSON
- No `PostToolUse` or `statusLine` keys remain
- `epost-kit init` regenerates `.claude/settings.json` without these entries

## Risk Assessment
**Risks**: Removing lint/build hooks means no auto-lint on save
**Mitigation**: These never worked (no root package.json). If lint-on-save is desired later, it should be added to epost-agent-cli's package-level config, not the monorepo root.

## Security Considerations
None -- removing non-functional config.

## Next Steps
After completion: proceed to Phase 02 (fix hook scripts).
