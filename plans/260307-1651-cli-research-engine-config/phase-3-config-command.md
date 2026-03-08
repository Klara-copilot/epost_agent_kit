---
phase: 3
title: "Interactive config command"
effort: 1.5h
depends: [1]
---

# Phase 3 — Interactive Config Command

## Goal

`epost-kit config` launches an interactive TUI (using `@inquirer/prompts`, already installed) that shows all configurable settings grouped by category. User navigates, selects, toggles, or types values. Saves to installed `.claude/.epost-kit.json` only.

Non-interactive flags (`--get <key>`, `--set <key> <value>`) supported for scripting.

## Config Registry

Two storage locations, clearly separated:

| Store | File | Purpose | Git |
|-------|------|---------|-----|
| Config | `.claude/.epost-kit.json` | Engine selection, models, feature flags | committed |
| Secrets | `.claude/.env` | API keys — never committed | gitignored |

**Config keys** (written to `.epost-kit.json`):

| Section | Key | UI Control | Valid Values |
|---------|-----|-----------|-------------|
| Research | `skills.research.engine` | `select` | `gemini`, `perplexity`, `websearch` |
| Research | `skills.research.gemini.model` | `input` | any string |
| Research | `skills.research.perplexity.model` | `select` | `sonar`, `sonar-pro`, `sonar-reasoning` |
| Hooks | `hooks.scout.enabled` | `confirm` | `true`, `false` |
| Hooks | `hooks.privacy.enabled` | `confirm` | `true`, `false` |
| Hooks | `hooks.packagesGuard.enabled` | `confirm` | `true`, `false` |
| Project | `project.packageManager` | `select` | `npm`, `yarn`, `pnpm`, `bun` |

**Secret keys** (written to `.claude/.env`):

| Section | Env Var | UI Control | Used by |
|---------|---------|-----------|---------|
| Secrets | `GEMINI_API_KEY` | `password` (masked) | Gemini API mode (alt to `gemini auth login`) |
| Secrets | `PERPLEXITY_API_KEY` | `password` (masked) | Perplexity REST API |

> This registry is the single source of truth. Adding a new key here wires it into the TUI, validation, and `--get/--set` automatically.

## Tasks

### 3.1 Create `src/commands/config.ts`

#### Interactive mode (default — no flags)

```ts
import { select, input, confirm, password } from "@inquirer/prompts";

// 1. Load .claude/.epost-kit.json (config) + .claude/.env (secrets, if exists)
// 2. Show section menu: "Research", "Hooks", "Project", "Secrets", "Save & Exit", "Exit without saving"
// 3. On section select → show keys in that section with current value displayed
// 4. On key select → show appropriate prompt (select/input/confirm/password)
// 5. On value confirmed → update in-memory config or secrets map
// 6. Loop back to section menu
// 7. On "Save & Exit" → write .epost-kit.json + write .claude/.env (append/update KEY=value lines)
```

UX flow:
```
? Select section › Research / Hooks / Project / Secrets / Save & Exit / Exit without saving

  [Research selected]
? Select setting › Research engine (current: websearch) / Gemini model / Perplexity model / Back
? Research engine › gemini / perplexity / websearch

  [Secrets selected]
? Select secret › GEMINI_API_KEY (set) / PERPLEXITY_API_KEY (not set) / Back
? PERPLEXITY_API_KEY: **********************   ← masked input
```

- Secret values display as `(set)` / `(not set)` — never show current value
- Write secrets as `KEY=value` lines to `.claude/.env` (create if absent)
- Ensure `.claude/.env` is in project `.gitignore` (warn if not)

#### Non-interactive flags (scripting)

```
epost-kit config --get skills.research.engine
epost-kit config --set skills.research.engine gemini
```

- `--get <dotpath>`: print current value to stdout (plain text)
- `--set <dotpath> <value>`: validate + write, print confirmation
- Both resolve install dir same way as TUI: metadata → `.claude/` fallback

#### Install dir resolution

1. `--dir <path>` flag if provided
2. Read `.epost-metadata.json` for `target` → derive install dir
3. Fallback: `.claude/.epost-kit.json`

**Never write to `packages/core/.epost-kit.json`** — that's the source template, not the installed config.

### 3.2 Register in `src/cli.ts`

```ts
cli
  .command("config", "View and edit kit configuration (interactive)")
  .option("--dir <path>", "Target project directory")
  .option("--get <key>", "Get a config value (non-interactive)")
  .option("--set <key>", "Set a config value (non-interactive, requires --value)")
  .option("--value <val>", "Value for --set")
  .action(async (opts) => {
    const { runConfig } = await import("./commands/config.js");
    await runConfig({ ...cli.globalCommand.options, ...opts });
  });
```

### 3.3 Config registry module

File: `src/domains/config/registry.ts`

Export typed registry so validation, TUI prompts, and `--get/--set` all share one definition:

```ts
export type ConfigEntry = {
  key: string;           // dot-notation path in .epost-kit.json
  label: string;         // human label for TUI
  section: string;       // section for grouping
  type: "select" | "input" | "confirm";
  choices?: string[];    // for "select" type
};

export const CONFIG_REGISTRY: ConfigEntry[] = [ ... ];
```

### 3.4 Add tests

File: `tests/commands/config.test.ts`

- `--get skills.research.engine` returns current value
- `--set skills.research.engine gemini` updates file correctly
- `--set skills.research.engine invalid` errors with valid options listed
- `--get unknown.key` errors with "unknown config key"
- JSON file valid after set (round-trip)
- Interactive mode: test `runConfig` with mocked `@inquirer/prompts` (vitest mock)

## Files to Change

| File | Change |
|------|--------|
| `src/commands/config.ts` | New — interactive TUI + `--get/--set` handler |
| `src/domains/config/registry.ts` | New — typed config registry |
| `src/cli.ts` | Register `config` command |
| `tests/commands/config.test.ts` | New test file |

## Acceptance

- [ ] `epost-kit config` opens interactive TUI, shows sections + current values
- [ ] Engine select shows `gemini / perplexity / websearch` with current highlighted
- [ ] Boolean settings use `confirm` prompt
- [ ] "Save & Exit" writes `.claude/.epost-kit.json`; "Exit without saving" discards changes
- [ ] `--get skills.research.engine` prints engine name
- [ ] `--set skills.research.engine gemini` updates installed config only
- [ ] Invalid values rejected with valid options listed
- [ ] Tests pass
