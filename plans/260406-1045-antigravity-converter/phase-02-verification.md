---
phase: 2
title: "Verification + GEMINI.md Content Polish"
effort: 1h
depends: [1]
---

## Context

- Plan: [plan.md](plan.md)
- Phase 1: [phase-01-antigravity-adapter.md](phase-01-antigravity-adapter.md)

## Overview

Verify the adapter works end-to-end. Polish GEMINI.md content. Ensure compatibility report is accurate.

## TODO

- [ ] Run `epost-kit init --target antigravity --source` against epost_agent_kit repo
- [ ] Verify `GEMINI.md` exists at project root with correct content
- [ ] Verify `AGENTS.md` exists at project root with correct content
- [ ] Grep both files for `.claude/` — must find zero matches
- [ ] Verify compatibility report shows expected warnings
- [ ] Review GEMINI.md content for Antigravity-specific accuracy
- [ ] Run `npm run build` in CLI repo — TypeScript compiles clean
- [ ] Run existing tests — no regressions

## Content Review Checklist

For `GEMINI.md`:
- [ ] Project name and profile are correct
- [ ] Agent routing table lists all 11 agents
- [ ] Platform conventions from snippets are included
- [ ] Antigravity-specific notes are present (mention of `.agent/rules/`)
- [ ] No "Key Commands" section (Antigravity has no slash commands)
- [ ] No "use Claude Code for full capabilities" messaging (neutral tone)

For `AGENTS.md`:
- [ ] Matches JetBrains output format exactly
- [ ] Includes Key Commands section
- [ ] Includes agent routing table

## Success Criteria

- Both files generated correctly with `--source` flag
- TypeScript builds clean
- No test regressions
- Content is accurate and Antigravity-appropriate
