---
phase: 3
title: "epost-kit init sync"
effort: 5m
depends: [1, 2]
status: pending
---

# Phase 3: Kit Sync

Run `npx epost-kit init --source . --yes` to regenerate `.claude/` from `packages/`.

Verify:
- `.claude/skills/audit/references/` matches `packages/core/skills/audit/references/`
- `.claude/agents/epost-code-reviewer.md` matches `packages/core/agents/`
- No flat audit file references remain in `.claude/`
