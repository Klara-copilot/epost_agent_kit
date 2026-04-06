# Snippet Pipeline

How per-package snippet files flow through `epost-kit init` to produce IDE-specific output.

## Source Files

Each package may define up to three snippet files:

| File | IDE target | Field in package.yaml |
|------|-----------|----------------------|
| `CLAUDE.snippet.md` | Claude Code (`CLAUDE.md`) | `claude_snippet` |
| `COPILOT.snippet.md` | GitHub Copilot (`.github/copilot-instructions.md`) | `copilot_snippet` |
| `CURSOR.snippet.md` | Cursor (`.cursor/rules/*.mdc`) | `cursor_snippet` |

## Collection

`init.ts` reads `package.yaml` for each installed package in installation order.
For each package, it checks for `claude_snippet`, `copilot_snippet`, and `cursor_snippet` fields.

**Fallback rule**: If `copilot_snippet` or `cursor_snippet` is absent from `package.yaml`, the CLI falls back to `claude_snippet`. This means every package must have at minimum a `CLAUDE.snippet.md` — it will cover all three targets until dedicated files are added.

## Assembly

Snippets are grouped by target, then layered in package installation order (core first, then platform packages, then domain packages).

### CLAUDE target

All `claude_snippet` content concatenated → written to `CLAUDE.md` at project root.

### Copilot target

All `copilot_snippet` content (or `claude_snippet` fallback) concatenated → written to `.github/copilot-instructions.md`.

### Cursor target

For `--target cursor`:
- **Split rules** (phase 2+): Each package's `cursor_snippet` generates a scoped `.mdc` file in `.cursor/rules/`
  - Platform packages get glob patterns matching their file extensions
  - Core + cross-cutting packages use `alwaysApply: true`
  - File naming: `.cursor/rules/{package-name}.mdc`
- **Monolithic fallback** (legacy): All `cursor_snippet` content concatenated → `.cursor/rules/epost-kit.mdc`

## package.yaml Fields

```yaml
claude_snippet: CLAUDE.snippet.md      # required — fallback for all targets
copilot_snippet: COPILOT.snippet.md    # optional — Copilot-specific content
cursor_snippet: CURSOR.snippet.md      # optional — Cursor-specific content
```

If `copilot_snippet` or `cursor_snippet` are absent, the CLI uses `claude_snippet` as fallback.

## Per-Package Content Guidelines

### CLAUDE.snippet.md
- Full detail: tech stack, skills catalogue, git conventions, tool-specific info
- Loaded into Claude Code context on every session — can be verbose

### COPILOT.snippet.md
- Shorter than CLAUDE (Copilot has smaller context windows)
- Focus: routing table, platform conventions, starter prompts
- No tool details — Copilot has its own tools
- Use `@agent-name` invocation pattern

### CURSOR.snippet.md
- Similar length to COPILOT
- Mention `.cursor/rules/` auto-loading behavior
- Note Cursor-specific limitations (no Task tool, no hooks)
- Reference which `.mdc` rule file applies

## Split Rules Output (Cursor)

After phase 2 of the IDE converter plan, Cursor output uses per-platform `.mdc` files:

| Package | .mdc file | glob pattern |
|---------|-----------|-------------|
| core | `epost-kit.mdc` | `alwaysApply: true` |
| platform-web | `platform-web.mdc` | `**/*.{ts,tsx,scss,css}` |
| platform-ios | `platform-ios.mdc` | `**/*.swift` |
| platform-android | `platform-android.mdc` | `**/*.{kt,kts}` |
| platform-backend | `platform-backend.mdc` | `**/*.java` |
| design-system | `design-system.mdc` | `alwaysApply: true` |
| a11y | `a11y.mdc` | `alwaysApply: true` |

## Scoped Instructions Output (VSCode Copilot)

For `--target vscode`, the CLI generates scoped `.instructions.md` files in `.github/instructions/`:

| Package | Instructions file | glob pattern |
|---------|------------------|-------------|
| core | `epost-kit.instructions.md` | `**/*` |
| platform-web | `platform-web.instructions.md` | `**/*.{ts,tsx,scss,css}` |
| platform-ios | `platform-ios.instructions.md` | `**/*.swift` |
| platform-android | `platform-android.instructions.md` | `**/*.{kt,kts}` |
| platform-backend | `platform-backend.instructions.md` | `**/*.java` |

Content for each file comes from the package's `copilot_snippet` (or `claude_snippet` fallback).
