---
updated: 2026-03-09
title: "Fix hooks diagnostic issues"
description: "Fix 4 hook problems from diagnostic report (2 critical, 2 moderate)"
status: archived
priority: P1
effort: 30m
branch: master
tags: [hooks, settings, bugfix]
created: 2026-03-03
---

# Fix Hooks Diagnostic Issues

## Overview

Fix all 4 problems identified in `plans/reports/epost-architect-260303-1333-hooks-diagnostic.md`. Two critical (PostToolUse lint/build fail, missing statusline.sh), two moderate (missing `os` import, async stdin inconsistency).

## Current State

- PostToolUse hooks run `npm run lint`/`npm run build` at project root -- fails every Write/Edit (no root `package.json`)
- `statusLine` references `~/.claude/statusline.sh` which doesn't exist
- `session-init.cjs` line 87 uses `os.userInfo()` without importing `os`
- `privacy-block.cjs` uses async stdin; `scout-block.cjs` uses sync -- inconsistency + timeout risk

## Target State

All hooks execute cleanly with zero errors on session start and tool use.

## Platform Scope
- [x] Backend (hooks / Node.js CJS)

## Implementation Phases

1. [Phase 01: Fix settings.json hooks](./phase-01-fix-settings.md)
2. [Phase 02: Fix hook scripts](./phase-02-fix-hook-scripts.md)

## Key Dependencies

- After all fixes: run `epost-kit init` to regenerate `.claude/`

## Success Criteria

- [ ] No ENOENT errors on Write/Edit operations
- [ ] No statusline.sh error on prompt
- [ ] `session-init.cjs` works in environments without USER env var
- [ ] `privacy-block.cjs` uses sync stdin matching `scout-block.cjs`

## Risk Assessment

Low risk -- all changes are isolated to hook config and scripts. No feature logic affected.
