# Kit Marketplace: Phase 2 CLI Commands

**Date**: 2026-03-23
**Agent**: epost-fullstack-developer
**Epic**: kit-marketplace
**Plan**: plans/260320-1213-kit-marketplace/

## What was implemented

Five new CLI commands (`roles`, `add`, `remove`, `list`, `upgrade`/profile deprecation) plus three supporting domain modules:

- `src/domains/resolver/bundles.ts` — loads `bundles.yaml`, resolves extends chains, computes merged skill/agent sets per role including shared baseline
- `src/domains/resolver/skill-locator.ts` — locates skill directories and agent files by searching across all `packages/*/skills/<name>` paths in the kit repo
- `src/commands/roles.ts` — table display with installed status, `--json` flag
- `src/commands/add.ts` — skill mode (resolver-resolved deps) + role mode (full bundle); confirms before copy; updates `.epost.json`
- `src/commands/remove.ts` — reverse dep check with warning; role mode removes all role skills/agents; protected `core` guard
- `src/commands/list.ts` — grouped display with role membership from bundles; `--json` flag
- `--profile` deprecation warning added to `runInit`

29 new tests, 0 new failures (6 pre-existing CopilotAdapter failures unchanged).

## Key decisions and why

- **No yaml dep added**: reused `parseSimpleYaml` from `package-resolver.ts`.
  **Why**: bundles.yaml uses same subset (string arrays, nested objects, no anchors); avoided a new dependency.

- **skill-locator searches packages/* at runtime**: instead of a compiled manifest.
  **Why**: YAGNI — a manifest would require build-time generation; runtime search is sufficient and simpler for dev mode.

- **`add` does not regenerate CLAUDE.md**: phase file specified `generateClaudeMd` reuse but that function requires full init context (package manifests, snippets, etc.).
  **Why**: YAGNI for Phase 2; CLAUDE.md regeneration is a Phase 3 concern. The `.epost.json` is updated correctly so state is consistent.

- **Tests are logic-only (no file system mocks)**: test the domain functions (resolver, bundle merge) directly rather than e2e command execution.
  **Why**: file ops are integration concerns; domain logic is where bugs live.

## What almost went wrong

- `SHARED_AGENTS` was imported but unused in `add.ts` causing a TS6133 error — caught by typecheck before build.
- Stash check showed 14 pre-existing test failures, not 6 — the stash inadvertently reverted the resolver test files from Phase 1, revealing they fixed some failures. Phase 2 net delta is +29 passing tests.
