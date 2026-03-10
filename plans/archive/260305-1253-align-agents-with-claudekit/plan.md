---
title: "Align Agent Team Roles with ClaudeKit"
description: "Restructure agent names and roles to match ../claudekit/.claude/agents/ plus a11y-specialist and epost-muji"
status: archived
priority: P1
effort: 4h
tags: [agents, roles, restructure, claudekit]
created: 2026-03-05
updated: 2026-03-09
---

# Align Agent Team Roles with ClaudeKit

## Summary

Rename and restructure epost agents to match claudekit's 14-agent team, keeping epost-a11y-specialist (a11y package), epost-kit-designer (kit package), and epost-muji (design-system package). Adds 4 new agents, renames 5 existing agents.

## Key Dependencies

- `packages/core/package.yaml` — agent list must be updated
- `packages/kit/package.yaml` — epost-kit-designer removal
- CLAUDE.md routing tables reference agent names
- `.claude/` is generated — all edits in `packages/`

## Agent Mapping

| claudekit Agent | Current epost Agent | Action |
|-----------------|-------------------|--------|
| planner | epost-architect | RENAME to epost-planner, align prompt |
| project-manager | epost-orchestrator | RENAME to epost-project-manager |
| fullstack-developer | epost-implementer | RENAME to epost-fullstack-developer |
| code-reviewer | epost-reviewer | RENAME to epost-code-reviewer |
| docs-manager | epost-documenter | RENAME to epost-docs-manager |
| brainstormer | epost-brainstormer | KEEP name, align prompt |
| debugger | epost-debugger | KEEP name, align prompt |
| git-manager | epost-git-manager | KEEP name, align prompt |
| researcher | epost-researcher | KEEP name, align prompt |
| tester | epost-tester | KEEP name, align prompt |
| code-simplifier | (none) | ADD new agent |
| journal-writer | (none) | ADD new agent |
| mcp-manager | (none) | ADD new agent |
| ui-ux-designer | (none) | ADD new agent |
| — | epost-a11y-specialist | KEEP (a11y package) |
| — | epost-muji | KEEP (design-system package) |
| — | epost-kit-designer | KEEP (kit package) |

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Rename existing agents | 1.5h | pending | [phase-01](./phase-01-rename-agents.md) |
| 2 | Add new agents | 1.5h | pending | [phase-02](./phase-02-add-agents.md) |
| 3 | Update references | 1h | pending | [phase-03](./phase-03-update-references.md) |

## Critical Constraints

- ALL edits in `packages/`, never `.claude/` directly
- Agent names must keep `epost-` prefix (per kit-agents convention)
- `epost-kit init` must be run after changes to regenerate `.claude/`
- a11y and design-system packages are independent — no changes needed

## Success Criteria

- [x] 17 total agents: 14 core + a11y-specialist + kit-designer + muji
- [x] All agent names match claudekit equivalents with `epost-` prefix
- [x] CLAUDE.snippet.md routing tables updated with new names
- [x] `packages/core/package.yaml` agent list matches (14 agents)
- [x] 84 files updated, 0 stale references remaining
- [ ] `epost-kit init` runs cleanly (pending)
