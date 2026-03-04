# Report: Copilot Adapter Init Integration + Additional Packages

## Plan

- **Directory**: `plans/260303-1308-copilot-init-integration/`
- **Phases**: 2
- **Estimated effort**: 3h total

## Summary

Two enhancements to `epost-kit init`:

1. **`--target` CLI flag** (Phase 01, ~1h) -- Add `--target <claude|cursor|github-copilot>` so copilot adapter works non-interactively. Currently target selection is interactive-only (line 304-317 of init.ts). The copilot adapter itself is fully implemented.

2. **Additional packages step** (Phase 02, ~2h) -- After profile resolves packages + optional, new step offers ALL remaining packages from `packages/` dir. Includes `--additional <list>` flag for non-interactive usage. Requires moving `loadAllManifests()` call earlier in the init flow.

## Key Files

| File | Phase | Change |
|------|-------|--------|
| `epost-agent-cli/src/types/command-options.ts` | 1+2 | Add `target?`, `additional?` to `InitOptions` |
| `epost-agent-cli/src/cli.ts` | 1+2 | Add `--target`, `--additional` options |
| `epost-agent-cli/src/commands/init.ts` | 1+2 | Wire target flag + insert additional packages step |

## Dependencies

- `CopilotAdapter` already implemented
- `loadAllManifests()` already available
- `resolvePackages()` handles dependency resolution

## Risks

Low -- both changes are purely additive. No existing behavior modifications.

## Unresolved Questions

1. Should `--additional` also work during `epost-kit update`? (Currently plan scopes to `init` only)
2. Should the additional packages step show package layer info (e.g., "Layer 2: platform") for better grouping?
