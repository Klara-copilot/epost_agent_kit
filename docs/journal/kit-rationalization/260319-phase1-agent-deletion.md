# Phase 1: Delete Redundant Agents

**Date**: 2026-03-19
**Agent**: epost-fullstack-developer
**Epic**: kit-rationalization
**Plan**: plans/260319-0538-kit-rationalization/

## What was implemented

Deleted 5 agents confirmed redundant by research (reports 260318-1940, 260318-1951, 260319-1225):
- `epost-brainstormer` → native general-purpose agent + sequential-thinking skill
- `epost-mcp-manager` → native MCP management in Claude Code/Cursor/Copilot
- `epost-journal-writer` → journal skill already loaded by fullstack-developer/debugger/planner
- `epost-kit-designer` → epost-docs-manager + kit skills sufficient
- `epost-project-manager` → routing in CLAUDE.md; orchestration impossible (subagents can't spawn subagents)

Updated: package.yaml (both packages), CLAUDE.md routing + orchestration, skill-index.json agent-affinity (12 refs across 9 skills), synced .claude/agents/ and .claude/skills/skill-index.json.

## Key decisions and why

- **Decision**: Delete epost-project-manager (not just slim)
  **Why**: Its only job was multi-intent decomposition + delegation, but subagents can't spawn further subagents — making it structurally broken as an orchestrator. The routing table in CLAUDE.md handles decomposition inline in the main context.

- **Decision**: Manual .claude/ sync instead of epost-kit init
  **Why**: `epost-kit init` is interactive (asks install location) — not scriptable. Since packages/ is canonical and .claude/ is a copy, direct sync of the changed files achieves the same result.

## What almost went wrong

- `plans/260318-1353-skill-discovery-superpower/phase-1-quick-fixes.md` references `epost-kit-designer` as a file to update (add `skills:` field). Pre-check flagged it. Closer reading: it's a file-path-as-target, not an agent dependency. Safe to delete — that task in phase-1 is now moot.
