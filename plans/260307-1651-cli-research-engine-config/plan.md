---
title: "CLI support for research engine configs"
status: done
created: 2026-03-07
updated: 2026-03-07
effort: 3h
phases: 3
platforms: [all]
breaking: false
---

# CLI Support for Research Engine Configs

## Problem

The research engine plan (260307-1600) adds `skills.research` config to `.epost-kit.json` and `epost-config-utils.cjs`. But the CLI (`epost-agent-kit-cli`) has no awareness of this config:
- `ConfigSchema` (Zod) in `config-loader.ts` lacks `skills` field — validation will strip it
- `doctor` health checks don't verify research engine prerequisites (gemini binary, PERPLEXITY_API_KEY)
- No CLI command to view/set research engine — users must hand-edit JSON

## Solution

Extend the CLI in three phases:
1. Update Zod schema to pass through `skills.research` config
2. Add health check for research engine prerequisites
3. Add `epost-kit config` command for get/set of config values

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Schema + config passthrough | 1h | done | [phase-1](./phase-1-schema-update.md) |
| 2 | Doctor health check | 1h | done | [phase-2](./phase-2-health-check.md) |
| 3 | Config get/set command | 1h | done | [phase-3](./phase-3-config-command.md) |

## Design Decisions (resolved)

| Question | Decision |
|----------|----------|
| Which `.epost-kit.json` does `config set` write? | Installed only — `.claude/.epost-kit.json`. Never touches `packages/core/` source. |
| `config list` subcommand? | No subcommands — `epost-kit config` opens an interactive TUI. `--get/--set` flags for scripting. |

## Success Criteria

- `ConfigSchema` accepts `skills.research.engine` values without stripping
- `epost-kit doctor` reports engine prerequisites (gemini CLI, PERPLEXITY_API_KEY)
- `epost-kit config` opens interactive TUI — sections, current values, select/input/confirm controls
- `epost-kit config --get skills.research.engine` prints current engine (scripting)
- `epost-kit config --set skills.research.engine gemini` updates installed `.claude/.epost-kit.json` only
- Tests pass for all new code

## Dependencies

- Research engine plan (260307-1600) must land first — it creates the `skills.research` block in `.epost-kit.json` and `getResearchConfig()` in `epost-config-utils.cjs`

## Out of Scope

- Engine switching at runtime (session-init handles that)
- Gemini/Perplexity invocation logic (lives in epost_agent_kit skills, not CLI)
