---
name: kit-ide-snippets
description: "(ePost) Use when authoring or updating IDE snippets for Copilot or Cursor targets, converting Claude skills to IDE-specific format, or generating copilot-instructions.md or .cursor/rules/. Triggers: 'update copilot snippet', 'cursor rules', 'ide snippet', 'copilot instructions', 'convert skill to cursor'."
user-invocable: false
metadata:
  keywords: [copilot, cursor, ide, snippets, copilot-instructions, cursor-rules, mdc, snippet-authoring]
  triggers: [update copilot snippet, cursor rules, ide snippet, copilot instructions, convert skill to cursor, COPILOT.snippet.md, CURSOR.snippet.md]
  platforms: [all]
  agent-affinity: [epost-fullstack-developer, epost-docs-manager]
  connections:
    enhances: [kit-add-skill, kit-agents]
---

# Kit IDE Snippets

Reference for authoring `COPILOT.snippet.md` and `CURSOR.snippet.md` in epost_agent_kit packages. Covers the generation pipeline, IDE-specific routing mechanics, and what content belongs in each target.

## Snippet Generation Pipeline

| Snippet file | Generated output | CLI domain |
|---|---|---|
| `CLAUDE.snippet.md` | `CLAUDE.md` in project root | `installation/` |
| `COPILOT.snippet.md` | `.github/copilot-instructions.md` | `installation/` |
| `CURSOR.snippet.md` | `.cursor/rules/epost-kit.mdc` | `installation/` |

- Source: `epost-agent-kit-cli/src/domains/installation/`
- **Copilot fallback**: if `copilot_snippet` not declared in `package.yaml`, falls back to `claude_snippet`
- **Cursor fallback**: same — falls back to `claude_snippet`
- Declared per-package in `package.yaml`:

```yaml
claude_snippet: CLAUDE.snippet.md
copilot_snippet: COPILOT.snippet.md   # optional — falls back to claude_snippet
cursor_snippet: CURSOR.snippet.md     # optional — falls back to claude_snippet
```

## GitHub Copilot — How Agents Work

- Custom agents: `.agent.md` files (workspace or user profile) with YAML frontmatter
- Users **explicitly select** agents from Chat view dropdown — no auto-routing by description
- Agent Skills (extension API only): `contributes.chatSkills` in `package.json` — NOT workspace files
- `.github/copilot-instructions.md` is **auto-loaded** as global instructions for every session
- **Implication**: routing table in `COPILOT.snippet.md` is the correct mechanism — it tells Copilot which `@agent` to suggest

## Cursor — How Rules Work

- Rules: `.mdc` files in `.cursor/rules/` with YAML frontmatter
- `alwaysApply: true` → always injected into every session
- `alwaysApply: false` + `description` → Cursor Agent decides whether to apply based on context
- `globs` → restrict rule to specific file patterns
- **Current setup**: `mdc-generator.ts` generates with `alwaysApply: true` — entire snippet always injected

## Content Ownership Matrix

| Content | CLAUDE.snippet.md | COPILOT.snippet.md | CURSOR.snippet.md |
|---|---|---|---|
| Agent routing table | Anti-pattern (ARCH-0002) | Only mechanism | Only mechanism |
| Skills catalogue | Yes | No | No |
| Git conventions | Yes | No | No |
| Hook Response Protocol | Yes (AskUserQuestion) | No | No |
| Python venv instructions | Yes | No | No |
| Platform tech stack | Yes | No | No |

**Rule**: Claude snippets are rich knowledge docs. IDE snippets are routing-only — keep them minimal and targeted.

## Authoring Rules

1. **COPILOT.snippet.md** — agent routing table only; no skill/stack detail (Copilot has no skill system)
2. **CURSOR.snippet.md** — routing + brief context; no deep reference (injected into every prompt)
3. **CLAUDE.snippet.md** — full knowledge: skills, stack, conventions, hook protocols
4. When adding a new agent → update all three snippet files in the owning package
5. When adding a new platform → update `CLAUDE.snippet.md` only (routing belongs in IDE snippets only if agent exists)

## Future Optimization (Cursor)

Split `CURSOR.snippet.md` into per-concern `.mdc` files with `alwaysApply: false` + `description` — Cursor only injects relevant rules per session:

```
.cursor/rules/
├── epost-kit-core.mdc        # alwaysApply: true  (always needed)
├── epost-kit-web.mdc         # globs: ["**/*.tsx", "**/*.ts"]
├── epost-kit-ios.mdc         # globs: ["**/*.swift"]
└── epost-kit-android.mdc     # globs: ["**/*.kt"]
```

This mirrors how Claude Code loads skills on demand. Current single-file approach is simpler but injects irrelevant platform context into every session.

## Reference Files

| File | Purpose |
|---|---|
| `references/snippet-pipeline.md` | CLI source details and package.yaml fields |
