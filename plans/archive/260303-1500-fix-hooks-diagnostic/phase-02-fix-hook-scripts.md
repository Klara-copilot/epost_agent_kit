# Phase 02: Fix hook scripts

## Context Links
- Parent plan: [plan.md](./plan.md)
- Report: `plans/reports/epost-architect-260303-1333-hooks-diagnostic.md`

## Overview
**Date**: 2026-03-03
**Priority**: P2
**Description**: Fix missing `os` import in session-init.cjs and standardize stdin read in privacy-block.cjs
**Implementation Status**: Pending

## Key Insights
- `session-init.cjs` line 87: `os.userInfo().username` used but `os` not imported. Masked by `process.env.USER` on macOS. Crashes in Docker/CI.
- `privacy-block.cjs` uses `async for await (process.stdin)` while `scout-block.cjs` uses `fs.readFileSync(0)`. Async approach adds 5s timeout risk.

## Requirements
### Functional
- P3: Add `os` import to session-init.cjs
- P4: Convert privacy-block.cjs stdin read from async to sync
### Non-Functional
- Maintain identical behavior (same exit codes, same output)

## Architecture
Minimal edits to two hook scripts. No structural changes.

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/hooks/session-init.cjs` -- Add `const os = require('os');` at line 14 (before other requires) [OWNED]
- `packages/core/hooks/privacy-block.cjs` -- Replace async stdin with sync `fs.readFileSync(0, 'utf-8')` [OWNED]
### Read-Only
- `packages/core/hooks/scout-block.cjs` -- Reference for sync stdin pattern

## Implementation Steps

### P3: session-init.cjs

Add after line 14 (`const fs = require('fs');`):
```js
const os = require('os');
```

### P4: privacy-block.cjs

**Add** `fs` import at top (after `const path = require('path');` line 17):
```js
const fs = require('fs');
```

**Replace** the async main function's stdin reading (lines 83-87):
```js
// BEFORE (async):
async function main() {
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }

// AFTER (sync, matches scout-block.cjs):
function main() {
  let input = '';
  try {
    input = fs.readFileSync(0, 'utf-8');
  } catch {
    process.exit(0); // No stdin, allow
  }
```

**Also update** the bottom call (line 131-132) since main is no longer async:
```js
// BEFORE:
if (require.main === module) {
  main().catch(() => process.exit(0));
}

// AFTER:
if (require.main === module) {
  main();
}
```

## Todo List
- [ ] Add `os` import to session-init.cjs
- [ ] Add `fs` import to privacy-block.cjs
- [ ] Convert privacy-block.cjs main() from async to sync
- [ ] Update main() call site to remove .catch()
- [ ] Verify both hooks still work (manual test or `node <hook> < test-input.json`)

## Success Criteria
- `session-init.cjs` no longer references undefined `os`
- `privacy-block.cjs` uses `fs.readFileSync(0)` matching scout-block.cjs pattern
- Both hooks exit 0 on normal input, exit 2 on block

## Risk Assessment
**Risks**: Changing async→sync in privacy-block could break if any caller depends on async behavior
**Mitigation**: Claude Code hooks are simple stdin→stdout pipes. Sync is the documented pattern (see scout-block.cjs). No async dependency exists.

## Security Considerations
None -- privacy-block.cjs blocking logic unchanged. Only I/O method changes.

## Next Steps
After both phases: run `epost-kit init` to regenerate `.claude/` from `packages/core/`.
