---
title: "Git Skills & Skill-Discovery Integration"
description: "Fix git-* skills (empty keywords, missing agent-affinity) and add git signal path to skill-discovery"
status: pending
priority: P2
effort: 1.5h
branch: master
tags: [skills, git, skill-discovery, kit]
created: 2026-03-03
---

# Git Skills & Skill-Discovery Integration

## Overview

The 3 git skills (`git-commit`, `git-pr`, `git-push`) and the `epost-git-manager` agent exist but are invisible to skill-discovery. The discovery protocol has no git signal path, so agents never auto-load git skills when user says "commit", "push", "pr", etc.

## Current State

- `git-commit`, `git-pr`, `git-push` SKILL.md files exist in `packages/core/skills/`
- All 3 have **empty keywords** `[]` and **empty agent-affinity** `[]` in skill-index
- `skill-discovery` SKILL.md has NO git entry in Platform Signals, Task Type Signals, or Quick Reference tables
- `hub-context` correctly routes git intents but skill-discovery does NOT load the skills
- The `epost-git-manager` agent has workflow details but skills reference `agent: epost-git-manager` without being discoverable

## Target State

- git-* skills have proper keywords and agent-affinity in both skill-index files
- skill-discovery has a "Git Operations" signal row in Task Type Signals table
- skill-discovery Quick Reference table includes git discovery path
- Agent can discover `git-commit`/`git-push`/`git-pr` when user says "commit", "push", "pr", "done", "ship"

## Platform Scope
- [x] All (git is cross-platform)

## Implementation Phases

1. [Phase 01: Update git-* skill index entries](./phase-01-skill-index.md)
2. [Phase 02: Update skill-discovery for git signals](./phase-02-skill-discovery.md)

## Key Dependencies

- Must edit `packages/` (source of truth), NOT `.claude/`
- After edit, `epost-kit init` regenerates `.claude/` -- but we also update `.claude/` for immediate effect

## Success Criteria

- [ ] All 3 git skills have keywords: [commit, push, pr, git, branch, merge, ship, done]
- [ ] All 3 git skills have agent-affinity: [epost-git-manager]
- [ ] skill-discovery Task Type Signals table has git row
- [ ] skill-discovery Quick Reference table has git row
- [ ] skill-index.json count field still accurate

## Risk Assessment

Low risk. Additive changes only -- no existing behavior altered.
