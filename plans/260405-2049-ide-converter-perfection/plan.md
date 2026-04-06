---
title: "IDE Converter Perfection — Copilot, Cursor, JetBrains Full Parity"
status: active
created: 2026-04-05
updated: 2026-04-05
effort: 3d
phases: 5
platforms: [cli]
breaking: false
blocks: []
blockedBy: []
---

## Scope Rationale

1. **Problem**: TargetAdapter infrastructure exists but each adapter has accuracy gaps — wrong tool names, missing transforms, no split-rules for Cursor, no JetBrains target
2. **Why this way**: Single-source multi-IDE is the kit's core value prop; converters must be correct
3. **Why now**: Copilot and Cursor adapters ship wrong tool names; users will get broken output
4. **Simplest value**: Fix tool mappings + add Cursor split-rules (phases 1-2)
5. **Cut 50%**: Drop JetBrains (phase 4) and snippet updates (phase 3)

## Current State (already built)

The CLI at `epost-agent-kit-cli/` already has:
- `src/domains/installation/target-adapter.ts` — TargetAdapter interface + factory (claude/cursor/vscode/export)
- `src/domains/installation/copilot-adapter.ts` — CopilotAdapter with agent/skill/hook transforms
- `src/domains/installation/cursor-adapter.ts` — CursorAdapter with agent transforms + readonly mapping
- `src/domains/installation/mdc-generator.ts` — Single `.mdc` file generator
- `src/domains/installation/compatibility-report.ts` — Warning system
- `src/domains/conversion/` — Standalone `convert` command (older, separate from init pipeline)
- `src/commands/init.ts` — Wired to adapters, snippet collection, MDC generation

## Gap Analysis

| Area | Copilot (vscode) | Cursor | JetBrains |
|------|------------------|--------|-----------|
| Tool names | WRONG: uses `execute/read/edit/search/web` — should be `runInTerminal/readFile/editFiles/textSearch/fetch` | N/A (no tool arrays) | N/A |
| Model mapping | Correct | Pass-through (OK — Cursor uses model IDs) | N/A |
| Agent transform | Works but wrong tools | Works, 5 fields only | Not built |
| Skill transform | `invocable→invokable` only | Pass-through (OK — Cursor uses SKILL.md) | N/A |
| Hook transform | Works (with dropped-feature tracking) | Pass-through (OK) | N/A |
| Root instructions | `copilot-instructions.md` generated | Single `epost-kit.mdc` blob | Not built |
| Split rules | N/A (uses scoped `.instructions.md`) | MISSING — should split by platform globs | N/A |
| Scoped instructions | Not generated yet | N/A | N/A |
| Handoff generation | Frontmatter supported, no auto-generation | N/A | N/A |
| `AGENTS.md` | N/A | N/A | Not built |
| Snippet files | `COPILOT.snippet.md` exists (core only) | `CURSOR.snippet.md` exists (core only) | None |
| `convert` command | Exists but uses OLD tool mappings | Not supported | Not supported |

## Phases

| # | Phase | Effort | Depends | File |
|---|-------|--------|---------|------|
| 1 | [Fix Copilot Tool Mapping + Scoped Instructions](phase-01-copilot-fixes.md) | 4h | — | copilot-adapter.ts, tool-mappers.ts |
| 2 | [Cursor Split-Rules + Agent Path Fix](phase-02-cursor-split-rules.md) | 4h | — | cursor-adapter.ts, mdc-generator.ts, init.ts |
| 3 | [Snippet Pipeline + Per-Package Snippets](phase-03-snippet-pipeline.md) | 3h | 1,2 | packages/*/COPILOT.snippet.md, packages/*/CURSOR.snippet.md |
| 4 | [JetBrains Adapter](phase-04-jetbrains-adapter.md) | 2h | — | jetbrains-adapter.ts, target-adapter.ts |
| 5 | [Verification, Convert Command Sync, kit-verify](phase-05-verification.md) | 3h | 1-4 | convert.ts, kit-verify, evals |

## Consolidated Transformation Reference

| Claude Code | Copilot (`.github/`) | Cursor (`.cursor/`) | JetBrains |
|-------------|---------------------|---------------------|-----------|
| `.claude/agents/name.md` | `.github/agents/name.agent.md` | `.cursor/agents/name.md` | `AGENTS.md` (all-in-one) |
| `.claude/commands/x.md` | `.github/prompts/x.prompt.md` | N/A (no commands) | N/A |
| `.claude/skills/x/SKILL.md` | `.github/skills/x/SKILL.md` | `.cursor/skills/x/SKILL.md` | N/A |
| `.claude/settings.json` hooks | `.github/hooks/hooks.json` | `.cursor/settings.json` (as-is) | N/A |
| `CLAUDE.md` | `.github/copilot-instructions.md` | `.cursor/rules/*.mdc` (split) | `AGENTS.md` preamble |
| **model: sonnet** | `Claude Sonnet 4.6` | `sonnet` (pass-through) | N/A |
| **permissionMode: plan** | Omit write/execute tools | `readonly: true` | N/A |
| **disallowedTools: Write** | Omit `editFiles` | N/A (not supported) | N/A |
| **user-invocable** | `user-invokable` | N/A (all invocable) | N/A |
| **Tool: Read** | `readFile` | N/A | N/A |
| **Tool: Write/Edit** | `editFiles` | N/A | N/A |
| **Tool: Bash** | `runInTerminal` | N/A | N/A |
| **Tool: Grep** | `textSearch` | N/A | N/A |
| **Tool: Glob** | `listDirectory` | N/A | N/A |
| **Tool: WebFetch** | `fetch` | N/A | N/A |

## Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Copilot tool names change between VS Code releases | Medium | Mapping table is centralized in copilot-adapter.ts; one-line fix |
| Cursor `.agents/` path (root, not `.cursor/agents/`) may change | Low | CursorAdapter.installDir is configurable |
| JetBrains ACP (Q2 2026) may supersede `AGENTS.md` | Low | AGENTS.md is stable GA; add ACP adapter later |
| Split `.mdc` rules may exceed Cursor token budget | Medium | Keep per-platform rules concise; alwaysApply only for core |
| `convert` command tool mappings diverge from `init` adapter | High | Phase 5 unifies them |

## Success Criteria

1. `epost-kit init --target vscode` produces `.github/agents/*.agent.md` with correct tool names (`readFile`, `editFiles`, `runInTerminal`, `textSearch`, `listDirectory`, `fetch`)
2. `epost-kit init --target cursor` produces split `.cursor/rules/epost-kit-{platform}.mdc` files with correct globs
3. `epost-kit init --target jetbrains` produces `AGENTS.md` with agent descriptions and routing table
4. `epost-kit convert` tool mappings match the `init` adapter mappings exactly
5. `epost-kit lint` validates output structure for all targets
6. Zero `.claude/` path references in non-Claude output
