# Phase 01: Add Node.js Version Check to State Management Scripts

## Context Links

- [Plan](./plan.md)
- [`set-active-plan.cjs`](../../.claude/scripts/set-active-plan.cjs)
- [`get-active-plan.cjs`](../../.claude/scripts/get-active-plan.cjs)
- [`epost-agent-cli/package.json`](../../epost-agent-cli/package.json) (engines: node >= 18)

## Overview

- Priority: P1
- Status: Pending
- Effort: 30m
- Description: Add early Node.js version validation to both state management scripts with clear, actionable error messages. The project already declares `>=18.0.0` in epost-agent-cli/package.json; scripts should enforce this consistently.

## Key Insights

- Both scripts use CommonJS (`require`), `path`, `fs` -- all safe on Node 14+, but `ck-config-utils.cjs` (24KB) may use newer APIs
- `project-detector.cjs` already reads `process.version` (line 364, 382) for diagnostics but doesn't enforce minimum
- The `engines` field in `epost-agent-cli/package.json` specifies `>=18.0.0`
- Version check must run BEFORE any `require()` of library modules to catch issues early

## Requirements

### Functional
- Both scripts check `process.version` at script start (before requiring ck-config-utils)
- If Node.js < 18.0.0, print clear error with: current version, required version, how to upgrade
- Exit with code 1 on version mismatch

### Non-Functional
- Version check adds < 15 lines per script
- No new dependencies
- Must work on Node.js 14+ (the check itself must parse on old Node)

## Architecture

Simple procedural check at top of each script, after the shebang and JSDoc comment, before the `require` block.

```javascript
// Version check (must run before requires that may use Node 18+ APIs)
const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  console.error('Error: Node.js >= 18.0.0 required (current: ' + process.version + ')');
  console.error('Please upgrade: https://nodejs.org/ or use nvm: nvm install 18');
  process.exit(1);
}
```

## Related Code Files

### Files to Modify
- `.claude/scripts/set-active-plan.cjs` - Add version check before line 11 (require block)
- `.claude/scripts/get-active-plan.cjs` - Add version check before line 11 (require block)

### Files to Create
- None

### Files to Delete
- None

## Implementation Steps

1. **Add version check to `set-active-plan.cjs`**
   - Insert version check block between JSDoc comment (line 9) and require block (line 11)
   - Use `process.versions.node` (not `process.version` which includes "v" prefix)
   - Parse major version with `split('.')[0]`
   - Error message: include current version, minimum required, upgrade hint

2. **Add version check to `get-active-plan.cjs`**
   - Same pattern as step 1
   - Insert between JSDoc comment (line 9) and require block (line 11)

3. **Test manually**
   - Run both scripts with current Node to verify they still work
   - Verify error message format is clear and actionable

## Todo List

- [ ] Add version check to `set-active-plan.cjs` (before require block)
- [ ] Add version check to `get-active-plan.cjs` (before require block)
- [ ] Manual test: run `node .claude/scripts/set-active-plan.cjs --help` to confirm no regression
- [ ] Manual test: run `node .claude/scripts/get-active-plan.cjs` to confirm no regression

## Success Criteria

- Scripts exit with code 1 and clear error on Node < 18
- Scripts function normally on Node >= 18
- Error message includes: current version, required version, upgrade URL

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Version parsing edge case (e.g., "18.0.0-nightly") | Low | Using `split('.')[0]` on `process.versions.node` handles all formats |
| Check itself fails on very old Node | Low | Only uses `process.versions.node`, `split`, `console.error` -- available since Node 0.x |

## Security Considerations

No security implications. This is a developer-facing validation check.

## Next Steps

- Independent of Phase 02 and Phase 03
- After implementation, run existing tests to verify no regression
