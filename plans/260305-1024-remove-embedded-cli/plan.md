---
title: "Remove embedded epost-agent-cli and relink global epost-kit"
description: "Delete epost-agent-cli/ from monorepo, relink epost-kit globally to standalone repo"
status: active
priority: P1
effort: 1h
tags: [cli, cleanup, migration]
created: 2026-03-05
updated: 2026-03-05
---

# Remove Embedded CLI and Relink Global epost-kit

## Summary

The CLI has been extracted to a standalone repo (`epost-agent-kit-cli`). The old embedded copy at `epost-agent-cli/` remains in the monorepo, and `epost-kit` is globally linked to it. Remove the embedded copy and relink to the standalone repo.

## Current State

- `epost-agent-cli/` exists in monorepo (97MB including node_modules)
- Global `epost-kit` symlinked via `npm link` to `epost-agent-cli/`
- Standalone CLI at `/Users/than/Projects/epost-agent-kit-cli/` (separate git repo)
- ~25 references to `epost-agent-cli/` in `.claude/` agents, scripts, skills

## Key Dependencies

- Standalone CLI must be buildable and linkable before removing embedded copy
- All `.claude/` references must be updated to avoid broken paths
- Plans index (`epost-agent-cli/plans/INDEX.md`) must migrate to `plans/INDEX.md`

## Execution Strategy

Sequential: update references first, then relink, then delete.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Update references & relink CLI | 30m | pending | [phase-01](./phase-01-update-refs-relink.md) |
| 2 | Remove embedded CLI & verify | 30m | pending | [phase-02](./phase-02-remove-verify.md) |

## Critical Constraints

- `.claude/` is generated from `packages/` -- most reference changes go in `packages/`
- Plan index paths currently point to `epost-agent-cli/plans/INDEX.md`
- Scripts (`complete-plan.cjs`, `archive-plan.cjs`) hardcode `epost-agent-cli` path

## Success Criteria

- [ ] `epost-kit --version` works after relink
- [ ] `epost-kit init` works in a test project
- [ ] No `epost-agent-cli` references remain in `packages/` or `.claude/`
- [ ] `git status` shows `epost-agent-cli/` fully removed
