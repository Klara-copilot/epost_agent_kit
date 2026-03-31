## Phase Implementation Report

- Phase: phase-2-cli-commands | Plan: plans/260320-1213-kit-marketplace/ | Status: completed

### Files Modified

**CLI repo** (`/Users/than/Projects/epost-agent-kit-cli/`):

New files:
- `src/domains/resolver/bundles.ts` — bundle loader, role merging, shared baseline constants
- `src/domains/resolver/skill-locator.ts` — skill/agent source locator across packages/*
- `src/commands/roles.ts` — `epost-kit roles` command
- `src/commands/add.ts` — `epost-kit add [skill] | --role <name>` command
- `src/commands/remove.ts` — `epost-kit remove [skill] | --role <name>` command
- `src/commands/list.ts` — `epost-kit list` command
- `tests/commands/roles.test.ts`
- `tests/commands/add.test.ts`
- `tests/commands/remove.test.ts`
- `tests/commands/list.test.ts`

Modified files:
- `src/cli.ts` — registered `roles`, `add`, `remove`, `list` commands
- `src/types/commands.ts` — added `RolesOptions`, `AddOptions`, `RemoveOptions`, `ListOptions`
- `src/domains/resolver/index.ts` — re-exports for bundles + skill-locator
- `src/commands/init.ts` — `--profile` deprecation warning via `resolveProfileAlias`

### Tasks Completed

- 2.1 `epost-kit roles` — table display + `--json` flag, installed status from `.epost.json`
- 2.2 `epost-kit add` — skill mode (dep resolution) + role mode (full bundle install + shared baseline)
- 2.3 `epost-kit remove` — reverse dep warning, role mode, `core` guard, config update
- 2.4 `epost-kit list` — grouped by role membership, `--json` flag
- 2.5 `epost-kit upgrade` — not modified (already upgrades CLI self; content versioning is Phase 3)
- 2.6 Commands wired into `cli.ts`
- 2.7 `--profile` deprecation warning in `runInit`

### Tests Status

- 205 passing / 6 failing (6 failures are pre-existing CopilotAdapter tests, unrelated to Phase 2)
- 29 new tests added across 4 test files
- TypeScript: clean (`tsc --noEmit` passes)

### Issues Encountered

- **CLAUDE.md regeneration skipped**: `generateClaudeMd` requires full init context not available in `add`/`remove`. Left as Phase 3 concern; `.epost.json` is updated correctly.
- **`epost-kit upgrade` not extended**: existing `upgrade` command self-updates the CLI binary. Content/skill version upgrade (diffing installed vs latest) was scoped to Phase 3.

### Next Steps

- Phase 3: `epost-kit upgrade` for skill content version comparison + diff display
- Phase 3: CLAUDE.md regeneration after `add`/`remove`
- Phase 3: `epost-kit new` integration with role selection
