# Phase 02: Additional Packages Step in Init

## Context Links
- Parent plan: [plan.md](./plan.md)
- `epost-agent-cli/src/commands/init.ts:280-302` -- existing optional packages step
- `epost-agent-cli/src/core/package-resolver.ts` -- `loadAllManifests()`, `resolvePackages()`

## Overview
**Date**: 2026-03-03
**Priority**: P2
**Description**: After profile + optional selection, offer all remaining available packages as "additional" choices
**Implementation Status**: Pending

## Key Insights
- Current flow: profile -> resolve -> recommended -> optional -> target -> install
- `loadAllManifests()` already returns ALL packages from `packages/` dir
- `resolvePackages()` handles dependency resolution + topological sort
- Additional packages should appear AFTER optional step (line ~302), BEFORE target selection
- Profile optional packages are limited to what the profile declares; additional packages = everything else
- `resolvePackages` with explicit `packages` list bypasses profile constraint -- can add anything

## Requirements
### Functional
- New interactive step: "Add additional packages?" (checkbox)
- Shows all packages NOT already in resolved set
- Each choice shows package name + description from manifest
- Selected additional packages get merged into resolved list and re-resolved for deps
- Skipped in `--yes` mode and `--dry-run` mode
- New `--additional <list>` CLI flag for non-interactive usage

### Non-Functional
- Step only appears when there ARE unselected packages available
- Maintains existing step numbering (insert between optional and target steps)

## Architecture
Slot into existing init flow between Step 4 (optional) and current target selection.

```
Profile selection -> Resolve -> Recommended -> Optional -> ADDITIONAL -> Target -> Install
```

## Related Code Files
### Modify (EXCLUSIVE to this phase)
- `epost-agent-cli/src/commands/init.ts:280-320` -- Insert additional packages step [OWNED]
- `epost-agent-cli/src/cli.ts:88-104` -- Add `--additional` option [OWNED]
- `epost-agent-cli/src/types/command-options.ts:15-25` -- Add `additional?` to `InitOptions` [OWNED]

### Read-Only (shared)
- `epost-agent-cli/src/core/package-resolver.ts` -- `loadAllManifests()`, `resolvePackages()`

## Implementation Steps

1. **Add `additional` to `InitOptions`** in `command-options.ts`:
   ```typescript
   export interface InitOptions extends GlobalOptions {
     // ... existing fields
     additional?: string;  // comma-separated additional package names
   }
   ```

2. **Add `--additional` CLI option** in `cli.ts`:
   ```typescript
   .option("--additional <list>", "Comma-separated additional packages beyond profile")
   ```

3. **Parse additional list** in `init.ts` near line 178 (where other lists parsed):
   ```typescript
   const additionalList = opts.additional
     ?.split(",")
     .map((s) => s.trim())
     .filter(Boolean);
   ```

4. **Insert additional packages step** after optional step (~line 302), before target selection:
   ```typescript
   // ── Additional packages (beyond profile) ──
   const allManifestNames = [...manifests.keys()];
   const currentPkgSet = new Set(resolved.packages);
   const availableAdditional = allManifestNames.filter(
     (name) => !currentPkgSet.has(name)
   );

   if (additionalList && additionalList.length > 0) {
     // Non-interactive: add specified additional packages
     const reResolved = await resolvePackages({
       packagesDir,
       profilesPath,
       packages: [...resolved.packages, ...additionalList],
       exclude: excludeList,
     });
     resolved.packages.length = 0;
     resolved.packages.push(...reResolved.packages);
   } else if (availableAdditional.length > 0 && !opts.yes) {
     const addMore = await confirm({
       message: "Add packages beyond your profile?",
       default: false,
     });

     if (addMore) {
       const selectedAdditional = await checkbox({
         message: "Select additional packages:",
         choices: availableAdditional.map((name) => {
           const m = manifests.get(name);
           return {
             name: m ? `${name} — ${m.description}` : name,
             value: name,
           };
         }),
       });

       if (selectedAdditional.length > 0) {
         const reResolved = await resolvePackages({
           packagesDir,
           profilesPath,
           packages: [...resolved.packages, ...selectedAdditional],
           exclude: excludeList,
         });
         resolved.packages.length = 0;
         resolved.packages.push(...reResolved.packages);
       }
     }
   }
   ```

5. **Move `loadAllManifests` call earlier** -- currently at line 325 (after target selection). Move to before the additional packages step so manifests are available for display. The manifests are already needed by the additional step for descriptions.

   Currently: `const manifests = await loadAllManifests(packagesDir);` at line 325.
   Move to: right after `resolvePackages()` succeeds (line ~256).

## Todo List
- [ ] Add `additional` field to `InitOptions`
- [ ] Add `--additional` CLI option
- [ ] Parse `additionalList` in init
- [ ] Move `loadAllManifests()` call earlier in flow
- [ ] Insert additional packages interactive step
- [ ] Handle non-interactive `--additional` flag
- [ ] Test with: no additional, some additional, `--additional` flag

## Success Criteria
- Interactive: "Add packages beyond your profile?" appears after optional step
- Selecting additional packages works and resolves dependencies
- `--additional core,kit` works non-interactively
- `--yes` skips additional step entirely
- Step hidden when no unselected packages remain

## Risk Assessment
**Risks**: `loadAllManifests()` call reorder could affect error ordering
**Mitigation**: Both `resolvePackages` and `loadAllManifests` read from same `packagesDir` -- no ordering dependency

## Security Considerations
None

## Next Steps
After both phases: test full flow end-to-end with `--target github-copilot --additional kit`
