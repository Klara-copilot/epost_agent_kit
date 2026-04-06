---
name: kit-ide-snippets
description: "(ePost) Use when: \"cursor rules\", \"copilot instructions\", \"ide snippet\", \"convert skill to cursor\". Generates copilot-instructions.md, .cursor/rules/, or converts Claude skills to IDE-specific formats."
user-invocable: false
metadata:
  keywords: [copilot, cursor, ide, snippets, copilot-instructions, cursor-rules, mdc, snippet-authoring, cursor-agents, cursor-skills, jetbrains, agents-md, vscode]
  triggers: [update copilot snippet, cursor rules, ide snippet, copilot instructions, convert skill to cursor, COPILOT.snippet.md, CURSOR.snippet.md, cursor agents, cursor skills, jetbrains, AGENTS.md]
  platforms: [all]
  agent-affinity: [epost-fullstack-developer, epost-docs-manager]
  connections:
    enhances: [kit-add-skill, kit-agents]
---

# Kit IDE Snippets

Reference for authoring `COPILOT.snippet.md` and `CURSOR.snippet.md` in epost_agent_kit packages, and for understanding all 4 IDE targets supported by `epost-kit init`.

## IDE Target Overview

| Target | Command | Output dir | Status |
|--------|---------|------------|--------|
| `claude` | `epost-kit init --target claude` | `.claude/` | Stable — pass-through, no transforms |
| `vscode` | `epost-kit init --target vscode` | `.github/` | Stable — full transform pipeline |
| `cursor` | `epost-kit init --target cursor` | `.cursor/` | Stable — split MDC + agent transforms |
| `jetbrains` | `epost-kit init --target jetbrains` | `.` (root) | Experimental — single AGENTS.md |

## Transformation Table

| Claude Code feature | vscode (.github/) | cursor (.cursor/) | jetbrains |
|---------------------|-------------------|-------------------|-----------|
| Agents (.md) | `.agent.md` with tools/handoffs frontmatter | `.md` with Cursor fields only | Documented in AGENTS.md |
| Skills (SKILL.md) | `.instructions.md` per skill | stays in `.cursor/rules/` context | Not supported |
| Hooks (settings.json) | `hooks.json` (SessionStart/Stop only) | `settings.json` as-is | Not supported |
| Tool names | Short-form: `read/edit/execute/search/web` | N/A (no tools field) | N/A |
| Path refs (`.claude/`) | → `.github/` | → `.cursor/` | No change |
| CLAUDE.md context | `copilot-instructions.md` | `epost-kit-{platform}.mdc` (split) | `AGENTS.md` |

## Snippet Generation Pipeline

| Snippet file | Generated output |
|---|---|
| `CLAUDE.snippet.md` | `CLAUDE.md` in project root |
| `COPILOT.snippet.md` | `.github/copilot-instructions.md` |
| `CURSOR.snippet.md` | `.cursor/rules/epost-kit-{platform}.mdc` (per-platform split) |

Fallback: if `copilot_snippet` / `cursor_snippet` not in `package.yaml` → uses `claude_snippet`.

## Content Ownership Matrix

| Content | CLAUDE | COPILOT | CURSOR |
|---|---|---|---|
| Agent routing table | ❌ Anti-pattern | ✅ Only mechanism | ⚠ Workaround (skills not wired yet) |
| Skills catalogue | ✅ | ❌ | ❌ |
| Git / hook conventions | ✅ | ❌ | ❌ |
| Platform tech stack | ✅ | ❌ | ❌ |

## Cursor Split Rules (Phase 2+)

epost-kit now generates **per-platform `.mdc` files** instead of a single monolithic rule. Each platform package gets its own scoped rule with glob patterns matching its file extensions (e.g., `**/*.swift` for iOS). Core and cross-cutting packages use `alwaysApply: true`. See `references/cursor.md` for the full parity roadmap.

## Convert Command

`epost-kit convert` converts installed packages to IDE format without running full init:

```bash
epost-kit convert --target vscode    # → .github/ (default, backward compat)
epost-kit convert --target cursor    # → .cursor/
epost-kit convert --target jetbrains # → AGENTS.md at project root
```

Uses the same `TargetAdapter` pipeline as `epost-kit init` — tool mappings and path substitutions are identical.

## Verify: IDE Output Checks

`epost-kit verify` includes IDE output checks when IDE dirs exist:

- **vscode**: agents use `.agent.md` extension, no `.claude/` path refs in `.github/`
- **cursor**: per-platform `.mdc` files present (no monolithic `epost-kit.mdc`), no `.claude/` refs in `.cursor/`
- **jetbrains**: `AGENTS.md` exists and is non-empty

## References

- `references/copilot.md` — Copilot agents, skills, routing mechanics
- `references/cursor.md` — Cursor rules / subagents / skills, current gap, parity roadmap
- `references/snippet-pipeline.md` — CLI source details and package.yaml fields
