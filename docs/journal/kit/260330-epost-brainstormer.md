# Add epost-brainstormer Agent

**Date**: 2026-03-30
**Agent**: epost-fullstack-developer
**Epic**: kit
**Plan**: plans/260330-2303-epost-brainstormer/

## What was implemented / fixed

Created `packages/core/agents/epost-brainstormer.md` — a CTO-level ideation advisor agent. Wired routing in `packages/core/CLAUDE.snippet.md` and root `CLAUDE.md` with new Intent Map row, ideation verbs in fuzzy matching, and less common intents reference.

## Key decisions and why

- **Decision**: `permissionMode: default` (not `plan`)
  **Why**: Brainstormer writes reports to `reports/` — `plan` mode blocks ALL file writes

- **Decision**: `model: opus`
  **Why**: Deliberative reasoning task; option exploration benefits from most capable model

- **Decision**: No `disallowedTools`
  **Why**: Brainstormer needs Write for report creation — matches planner pattern

## What almost went wrong

No near-misses. Phase 2 routing verification confirmed epost-planner nav header already had the brainstormer routing row at line 24 (no edit needed — plan correctly pre-verified this).
