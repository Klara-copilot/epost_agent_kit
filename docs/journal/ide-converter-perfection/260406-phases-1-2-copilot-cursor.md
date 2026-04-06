# IDE Converter Perfection — Phases 1 + 2

**Date**: 2026-04-06
**Agent**: epost-fullstack-developer
**Epic**: ide-converter-perfection
**Plan**: plans/260405-2049-ide-converter-perfection/

## What was implemented / fixed

Phase 1 — Copilot tool mapping fix:
- `copilot-adapter.ts`: TOOL_MAP updated to short-form VS Code tool names (`read`, `edit`, `execute`, `search`, `web`). Old verbose names (`readFile`, `editFiles`, `runInTerminal`, `textSearch`, `listDirectory`) removed — these are internal toolset sub-tools, not valid `tools:` values.
- DEFAULT_TOOLS now `["read", "edit", "execute", "search", "web"]`
- READONLY_TOOLS now `["read", "search", "web"]`
- `generateScopedInstructions` was already implemented; wired into `init.ts` for vscode target
- Auto-handoff generation via HANDOFF_MAP was already present

Phase 2 — Cursor split MDC rules:
- `mdc-generator.ts`: Added `PLATFORM_MDC_CONFIG`, `packageToPlatformKey`, `groupSnippetsByPlatform`, `generateSplitMdcFiles`
- `init.ts`: Cursor path now calls `generateSplitMdcFiles` instead of single `generateMdcFile`; old monolithic `epost-kit.mdc` deleted on migration
- 7 split rule files: core (alwaysApply), web/ios/android/backend (file-scoped globs), design-system/a11y (manual invoke)

## Key decisions and why

- **Decision**: Removed `COPILOT_EXTRA_TOOLS` constant rather than leaving as unused variable
  **Why**: TypeScript strict mode raises error on unused vars; YAGNI — no current consumer needs it

- **Decision**: Updated tests to reflect HANDOFF_MAP auto-generation behavior
  **Why**: Two existing tests assumed no auto-handoffs for `epost-planner`; the feature was already built and correct — tests were stale

- **Decision**: `generateSplitMdcFiles` deletes old `epost-kit.mdc` unconditionally
  **Why**: Clean migration — old file is superseded; no content loss since split files cover all platforms

## What almost went wrong

- The HANDOFF_MAP was already in the codebase but tests hadn't been updated to reflect it. Running tests first would have caught this immediately without the manual test fix loop.
- `generateMdcFile` import in `init.ts` became unused after replacing the cursor MDC block — TypeScript caught this cleanly.
