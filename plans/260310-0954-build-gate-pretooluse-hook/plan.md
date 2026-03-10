---
title: "PreToolUse hook: auto-run build-gate on git commit"
status: complete
created: 2026-03-10
updated: 2026-03-10
effort: 1.5h
phases: 1
platforms: [all]
breaking: false
---

# PreToolUse Hook: Auto-Run Build-Gate on Git Commit

## Summary

Add a PreToolUse hook on Bash that detects `git commit` commands and automatically runs `build-gate.cjs` before allowing them. This provides an automatic safety net independent of whether the agent follows skill instructions.

Note: The `/git` skill already forks to `epost-git-manager` via `context: fork` + `agent: epost-git-manager` frontmatter -- no changes needed there.

## Background

The archived build-success-gate plan (PLAN-0068) implemented Option A: skill instructions tell the agent to call build-gate. This plan adds Option B as a complementary automatic enforcement layer via PreToolUse hook.

## Key Dependencies

- `packages/core/hooks/lib/build-gate.cjs` -- existing utility (already implemented)
- `packages/core/hooks/lib/epost-config-utils.cjs` -- hook enable/disable pattern
- `.claude/settings.json` -- PreToolUse hook registration

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Build-gate PreToolUse hook | 1.5h | complete | [phase-1](./phase-1-build-gate-hook.md) |

## Critical Constraints

- Must edit `packages/core/hooks/` (source of truth), NOT `.claude/hooks/` directly
- Hook must only match Bash commands containing `git commit` (not `git status`, `git add`, etc.)
- Must respect `--skip-build` if present in the command or env var
- Must NOT block when build-gate exits 2 (no build command detected)
- Must read stdin for PreToolUse JSON payload (`tool_name`, `tool_input.command`)
- Hook must be non-blocking on parse errors (exit 0 on any unexpected state)
- Must be configurable via `.epost-kit.json` (`hooks.build-gate.enabled`)

## Success Criteria

- [ ] `git commit -m "..."` Bash calls automatically trigger build-gate
- [ ] Build failure blocks the commit with clear error message
- [ ] `git commit --skip-build` or `EPOST_SKIP_BUILD=1` bypasses the gate
- [ ] Non-commit git commands pass through unaffected
- [ ] Hook is toggleable via epost-config
