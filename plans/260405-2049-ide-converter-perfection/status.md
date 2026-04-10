---
plan: 260405-2049-ide-converter-perfection
updated: 2026-04-06
---

## Progress

| Phase | Title | Status |
|-------|-------|--------|
| 1 | Fix Copilot Tool Mapping + Scoped Instructions | Done |
| 2 | Cursor Split-Rules + Agent Path Fix | Done |
| 3 | Snippet Pipeline + Per-Package Snippets | Pending |
| 4 | JetBrains Adapter | Pending |
| 5 | Verification, Convert Command Sync, kit-verify | Pending |

## Key Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-04-06 | Keep COPILOT_EXTRA_TOOLS removed (not exposed in default set) | YAGNI — no agent currently needs browser/todo/vscode in default tools |
| 2026-04-06 | Tests updated to reflect HANDOFF_MAP auto-generation | Tests expected old no-handoffs behavior; new behavior is correct and intentional |
| 2026-04-06 | Split MDC uses `groupSnippetsByPlatform` via packageName | package.yaml `packageName` field maps cleanly to platform key |

## Architecture Reference

- `copilot-adapter.ts` — TOOL_MAP now uses short-form names (read/edit/execute/search/web)
- `mdc-generator.ts` — `generateSplitMdcFiles` + `PLATFORM_MDC_CONFIG` + `groupSnippetsByPlatform` + `packageToPlatformKey`
- `init.ts` — Cursor path uses `generateSplitMdcFiles`; vscode path wires `generateScopedInstructions`
