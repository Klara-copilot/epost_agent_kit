---
updated: 2026-03-09
title: "Re-implement lost features from working tree"
description: "Recover and commit improvements overridden by partial re-init"
status: archived
priority: P1
effort: 2h
branch: master
tags: [recovery, skills, cli, management-ui]
created: 2026-03-03
---

# Re-implement Lost Features

## Overview

Multiple fully-implemented improvements exist in the working tree but were partially overridden when `epost-kit init` ran with `core`-only profile instead of `full`. Need to reconcile, validate, and commit.

## Current State

- 92 files modified/untracked in working tree
- `.epost-metadata.json` regressed from `full` profile (9 packages) to `core` only
- CLAUDE.md stripped of platform sections (a11y, web, iOS, Android, backend, kit, design-system)
- New features exist as untracked/unstaged changes

## Target State

All improvements committed, metadata restored to `full` profile, no regressions.

## Implementation Phases

1. [Phase 01: Fix metadata + CLAUDE.md regression](./phase-01-metadata-fix.md)
2. [Phase 02: Commit skill ecosystem improvements](./phase-02-skill-improvements.md)
3. [Phase 03: Commit CLI enhancements](./phase-03-cli-enhancements.md)
4. [Phase 04: Commit management UI canvas improvements](./phase-04-management-ui.md)

## Key Dependencies

- Phase 1 must go first (restores correct profile)
- Phases 2-4 independent, can run parallel

## Success Criteria

- [ ] `epost-kit lint` passes
- [ ] `.epost-metadata.json` has full profile with all 9 packages
- [ ] CLAUDE.md has all platform sections
- [ ] All working tree improvements committed
- [ ] No unintended regressions

## Risk Assessment

- Running `init` again could re-overwrite — commit changes first
- Some `.claude/` files are generated output; only commit `packages/` changes + regenerate
