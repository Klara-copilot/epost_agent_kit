# Phase 01: Add --target CLI Flag

## Context Links
- Parent plan: [plan.md](./plan.md)
- `epost-agent-cli/src/cli.ts` -- Commander setup
- `epost-agent-cli/src/commands/init.ts` -- init command
- `epost-agent-cli/src/types/command-options.ts` -- option types

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Add `--target` CLI option to `epost-kit init` so users can specify IDE target non-interactively
**Implementation Status**: Pending

## Key Insights
- Target selection currently only happens at line 304-317 in init.ts (interactive `select()`)
- `metadata?.target` already persists target for updates
- The `TargetName` type (`'claude' | 'cursor' | 'github-copilot'`) exists in `target-adapter.ts`
- Non-interactive `--yes` mode defaults to `claude` -- with `--target`, it should use the specified value

## Requirements
### Functional
- `--target <name>` accepts: `claude`, `cursor`, `github-copilot`
- Overrides interactive selection when provided
- Works with `--yes` for full non-interactive install
- Invalid target values produce clear error message

### Non-Functional
- No breaking changes to existing behavior
- Default remains `claude` when not specified

## Architecture
Simple flag passthrough. No new modules needed.

## Related Code Files
### Modify (EXCLUSIVE to this phase)
- `epost-agent-cli/src/cli.ts:88-104` -- Add `.option("--target <name>")` to init command [OWNED]
- `epost-agent-cli/src/types/command-options.ts:15-25` -- Add `target?` to `InitOptions` [OWNED]
- `epost-agent-cli/src/commands/init.ts:304-317` -- Use `opts.target` to skip interactive select [OWNED]

### Read-Only (shared)
- `epost-agent-cli/src/core/target-adapter.ts` -- `TargetName` type, `createTargetAdapter()` factory

## Implementation Steps

1. **Add `target` to `InitOptions`** in `command-options.ts`:
   ```typescript
   export interface InitOptions extends GlobalOptions {
     // ... existing fields
     target?: string;  // 'claude' | 'cursor' | 'github-copilot'
   }
   ```

2. **Add `--target` option to Commander** in `cli.ts` line ~96:
   ```typescript
   .option("--target <name>", "IDE target (claude, cursor, github-copilot)")
   ```

3. **Wire into init flow** in `init.ts` around line 304:
   ```typescript
   // Select IDE target
   let target: "claude" | "cursor" | "github-copilot" =
     metadata?.target || "claude";

   if (opts.target) {
     // Validate --target value
     const validTargets = ["claude", "cursor", "github-copilot"];
     if (!validTargets.includes(opts.target)) {
       throw new Error(
         `Invalid target "${opts.target}". Valid: ${validTargets.join(", ")}`
       );
     }
     target = opts.target as "claude" | "cursor" | "github-copilot";
   } else if (!metadata && !opts.yes) {
     target = await select({ ... });
   }
   ```

4. **Same for legacy init** (line ~1036): wire `opts.target` there too

## Todo List
- [ ] Add `target` field to `InitOptions`
- [ ] Add `--target` CLI option to `init` command
- [ ] Wire `opts.target` into `runPackageInit()` target selection
- [ ] Wire `opts.target` into `runKitInit()` target selection
- [ ] Validate target value with clear error

## Success Criteria
- `epost-kit init --target github-copilot --yes` installs to `.github/`
- `epost-kit init --target invalid` shows error with valid options
- Existing interactive flow unchanged when `--target` not provided

## Risk Assessment
**Risks**: Minimal -- purely additive
**Mitigation**: N/A

## Security Considerations
None -- CLI-local operation only

## Next Steps
After completion: proceed to Phase 02 (additional packages step)
