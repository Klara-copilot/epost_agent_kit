---
phase: 1
title: "Git --watzup flag"
effort: 30m
depends: []
---

# Phase 1: Git --watzup Flag

## Context Links

- [Plan](./plan.md)
- `packages/core/skills/git/SKILL.md:34-41` — flag override section

## Overview

- Priority: P2
- Status: Pending
- Effort: 30m
- Description: Add `--watzup` flag to git skill for EOD change summary

## Requirements

### Functional

- Review current branch name + recent commits (last ~24h or since last push)
- Produce structured summary: what changed, impact assessment, quality notes
- Read-only — never implement or modify code
- Output as markdown report

### Non-Functional

- Reference file under 80 lines
- Follow existing flag pattern (see `--retro` as model)

## Files to Modify

- `packages/core/skills/git/SKILL.md` — add `--watzup` to flag table + aspect files table

## Files to Create

- `packages/core/skills/git/references/watzup.md` — watzup mode reference

## Implementation Steps

1. **Add flag to SKILL.md**
   - Add row to aspect files table: `references/watzup.md` | EOD change summary
   - Add to Step 0 flag override: `If $ARGUMENTS contains --watzup: load references/watzup.md`
   - Update `argument-hint` in frontmatter to include `--watzup`

2. **Create references/watzup.md**
   - Frontmatter: name, description, user-invocable: false, disable-model-invocation: true
   - Step 1: Gather data — `git log --since="24 hours ago"`, `git diff --stat`, `git branch --show-current`
   - Step 2: Categorize changes — group by type (feat/fix/refactor/docs/test)
   - Step 3: Assess impact — files touched, LOC delta, breaking potential
   - Step 4: Quality notes — large commits, missing tests, TODOs added
   - Step 5: Format as markdown report with sections: Branch, Changes, Impact, Quality

## Todo List

- [ ] Add --watzup to git SKILL.md flag override section
- [ ] Add to aspect files table
- [ ] Update argument-hint
- [ ] Create references/watzup.md with gather/categorize/assess/format steps

## Success Criteria

- `/git --watzup` loads watzup.md and produces EOD summary
- No code implementation happens (read-only review)
- Output grouped by change type with impact notes

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Overlaps with --retro | Low | watzup = daily snapshot, retro = period metrics. Different scope |

## Security Considerations

- None — read-only git operations
