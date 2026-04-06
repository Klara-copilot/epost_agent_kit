---
date: 2026-04-05
agent: epost-planner
plan: plans/260405-2049-ide-converter-perfection/plan.md
status: READY
---

## Executive Summary

Created 5-phase plan to perfect IDE converter system. Key discovery: TargetAdapter infrastructure ALREADY exists with working Claude, Copilot, Cursor, and Export adapters. The primary gaps are wrong Copilot tool names, monolithic Cursor rules, missing per-package snippets, and no JetBrains target.

## Plan Details

- **Directory**: `plans/260405-2049-ide-converter-perfection/`
- **Phases**: 5 (3 parallel-safe: 1, 2, 4 | sequential: 3→after 1,2 | 5→after all)
- **Estimated effort**: 3 days (16h)
- **Platforms**: CLI (`epost-agent-kit-cli`)

| Phase | What | Effort | Key files (CLI repo) |
|-------|------|--------|---------------------|
| 1 | Fix Copilot tool names + scoped instructions + handoffs | 4h | copilot-adapter.ts, tool-mappers.ts |
| 2 | Cursor split-rules (5 .mdc files, not 1 blob) | 4h | mdc-generator.ts, init.ts |
| 3 | Per-package COPILOT/CURSOR snippet files | 3h | packages/*/COPILOT.snippet.md |
| 4 | JetBrains adapter (AGENTS.md) | 2h | jetbrains-adapter.ts |
| 5 | Unify convert command, lint checks, verification | 3h | convert.ts, lint.ts |

## Key Findings

1. **Copilot tool names are WRONG** — adapter uses `execute/read/edit/search/web` but correct names are `runInTerminal/readFile/editFiles/textSearch/fetch`
2. **Cursor rules are a single blob** — should be split by platform glob to reduce token waste
3. **Standalone `convert` command** uses separate code from `init` pipeline — tool mappings will diverge
4. **JetBrains** only needs `AGENTS.md` (single file) — simplest adapter

## Verdict: READY

All research complete, existing infrastructure well-understood, no blockers.

## Dependencies

- Existing plan `260301-1017-copilot-target-support` is largely SUPERSEDED — the TargetAdapter + CopilotAdapter already implemented. This new plan addresses the remaining gaps.
- No cross-plan file conflicts detected.

## Unresolved Questions

1. Should the old `src/domains/conversion/copilot-formatter.ts` be deleted or kept for backward compat?
2. Cursor `.agents/` path — is it `.cursor/agents/` or root `.agents/`? Current adapter uses `.cursor/` which matches Cursor docs.
