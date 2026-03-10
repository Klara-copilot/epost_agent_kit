---
title: "Research engine with switchable backend (Gemini / Perplexity)"
status: archived
created: 2026-03-07
updated: 2026-03-09
effort: 4h
phases: 4
platforms: [all]
breaking: false
---

# Research Engine — Switchable Backend

## Problem

The `epost-researcher` agent uses only Claude's built-in `WebSearch` tool for external research. This is:
- Limited to Claude's search index
- Not configurable or swappable
- Misses deeper, citation-aware results that specialised search APIs provide

claudekit already has a working Gemini CLI integration (stdin pipe, MCP proxy mode). epost_agent_kit should adopt and extend it with Perplexity as a second backend, switchable via config.

## Solution

Add a **research engine layer** to the kit:
- Config key `skills.research.engine` in `.epost-kit.json`: `"gemini" | "perplexity" | "websearch"`
- Gemini: `echo "prompt" | gemini -y -m <model>` (MCP proxy mode, JSON-only output)
- Perplexity: REST call via `curl` with `PERPLEXITY_API_KEY`, model `sonar` or `sonar-pro`
- WebSearch: existing Claude built-in tool (current default, unchanged)
- Fallback chain: configured engine → WebSearch if unavailable
- `EPOST_RESEARCH_ENGINE` env var exported by `session-init.cjs` for agent use
- `GEMINI.md` at project root (Gemini CLI system prompt) — assets managed by `epost-kit init`

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Config layer + env export | 1h | pending | [phase-1](./phase-1-config-and-env.md) |
| 2 | GEMINI.md asset + Gemini invocation pattern | 0.75h | pending | [phase-2](./phase-2-gemini-integration.md) |
| 3 | Perplexity integration | 1h | pending | [phase-3](./phase-3-perplexity-integration.md) |
| 4 | Research skill update + fallback chain | 1.25h | pending | [phase-4](./phase-4-research-skill-update.md) |

## Success Criteria

- `skills.research.engine` in `.epost-kit.json` accepts `"gemini"`, `"perplexity"`, `"websearch"`
- `epost-config-utils.cjs` validates and exposes `getResearchEngine()`
- `session-init.cjs` exports `EPOST_RESEARCH_ENGINE`, `EPOST_GEMINI_MODEL`, `EPOST_PERPLEXITY_MODEL`
- `packages/core/assets/GEMINI.md` exists; `epost-kit init` copies it to project root
- `research/SKILL.md` uses engine-specific invocation pattern, with fallback to WebSearch
- `research/references/engines.md` documents each backend's invocation + limits
- Perplexity REST call uses `PERPLEXITY_API_KEY` env var, no hardcoded secrets
- WebSearch fallback fires if engine binary/API key is absent (logged in coverage gap)

## Out of Scope

- Building a new CLI command to switch engine (config-file edit is sufficient for now)
- Streaming Perplexity responses
- Caching research results across sessions
