---
title: "Agent Navigation Headers — Summary + Routing Tables"
status: archived
created: 2026-03-15
updated: 2026-03-15
effort: 3h
phases: 2
platforms: [all]
breaking: false
---

# Agent Navigation Headers

## Summary

Add a structured navigation header to all 15 agent files containing: one-line agent summary, intention routing table (what triggers this agent, from whom), key section line references for quick navigation. Edit in `packages/` (source of truth), then regenerate `.claude/`.

## Key Dependencies

- `packages/core/agents/` (12 agents)
- `packages/a11y/agents/` (1 agent)
- `packages/design-system/agents/` (1 agent)
- `packages/kit/agents/` (1 agent)
- CLAUDE.md routing tables as reference for intention mapping

## Execution Strategy

Phase 1: Define the header template and apply to all 15 agent files in `packages/`.
Phase 2: Regenerate `.claude/agents/` via `epost-kit init` or manual copy, validate.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Apply navigation headers to all 15 agents | 2.5h | pending | [phase-1](./phase-01-apply-headers.md) |
| 2 | Regenerate and validate | 0.5h | pending | [phase-2](./phase-02-regenerate-validate.md) |

## Critical Constraints

- NEVER edit `.claude/agents/` directly — it is generated output
- All edits go to `packages/{pkg}/agents/` files
- Header must be inserted AFTER frontmatter `---` but BEFORE the first system prompt line
- Header is a comment block readable by humans, not parsed by Claude Code frontmatter
- Keep headers concise (< 25 lines per agent)

## Success Criteria

- [ ] All 15 agent files in `packages/` have navigation headers
- [ ] Each header contains: summary, routing table, section line refs
- [ ] `.claude/agents/` regenerated and matches source
- [ ] No frontmatter breakage (all agents still load correctly)
