---
name: kit-ide-snippets
description: "(ePost) Use when authoring or updating IDE snippets for Copilot or Cursor targets, converting Claude skills to IDE-specific format, or generating copilot-instructions.md or .cursor/rules/. Triggers: 'update copilot snippet', 'cursor rules', 'ide snippet', 'copilot instructions', 'convert skill to cursor', 'cursor agents', 'cursor skills'."
user-invocable: false
metadata:
  keywords: [copilot, cursor, ide, snippets, copilot-instructions, cursor-rules, mdc, snippet-authoring, cursor-agents, cursor-skills]
  triggers: [update copilot snippet, cursor rules, ide snippet, copilot instructions, convert skill to cursor, COPILOT.snippet.md, CURSOR.snippet.md, cursor agents, cursor skills]
  platforms: [all]
  agent-affinity: [epost-fullstack-developer, epost-docs-manager]
  connections:
    enhances: [kit-add-skill, kit-agents]
---

# Kit IDE Snippets

Reference for authoring `COPILOT.snippet.md` and `CURSOR.snippet.md` in epost_agent_kit packages.

## Snippet Generation Pipeline

| Snippet file | Generated output |
|---|---|
| `CLAUDE.snippet.md` | `CLAUDE.md` in project root |
| `COPILOT.snippet.md` | `.github/copilot-instructions.md` |
| `CURSOR.snippet.md` | `.cursor/rules/epost-kit.mdc` |

Fallback: if `copilot_snippet` / `cursor_snippet` not in `package.yaml` → uses `claude_snippet`.

## Content Ownership Matrix

| Content | CLAUDE | COPILOT | CURSOR |
|---|---|---|---|
| Agent routing table | ❌ Anti-pattern | ✅ Only mechanism | ⚠ Workaround (skills not wired yet) |
| Skills catalogue | ✅ | ❌ | ❌ |
| Git / hook conventions | ✅ | ❌ | ❌ |
| Platform tech stack | ✅ | ❌ | ❌ |

## Current Gap (Cursor)

epost-kit generates only a single `alwaysApply: true` rule — blunt injection every session. Cursor actually supports three native layers (rules, subagents, skills) that enable on-demand loading like Claude Code. See `references/cursor.md`.

## References

- `references/copilot.md` — Copilot agents, skills, routing mechanics
- `references/cursor.md` — Cursor rules / subagents / skills, current gap, parity roadmap
- `references/snippet-pipeline.md` — CLI source details and package.yaml fields
