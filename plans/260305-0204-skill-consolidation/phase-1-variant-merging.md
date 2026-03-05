---
phase: 1
title: Merge variant skills into parent folders
effort: 4h
depends: []
---

# Phase 1: Merge Variant Skills Into Parents

## Scope

Merge 29 variant skill folders into their parent skill as `references/` files + flag routing tables.

## Tasks

### 1.1 cook variants (packages/core/skills/)

**Merge**: cook-fast, cook-parallel -> cook/references/

| File | Action |
|------|--------|
| `cook-fast/SKILL.md` | Move to `cook/references/fast-mode.md` |
| `cook-parallel/SKILL.md` | Move to `cook/references/parallel-mode.md` |
| `cook/SKILL.md` | Add flag detection: `--fast`, `--parallel` |

### 1.2 fix variants

**Merge**: fix-deep, fix-ci, fix-ui -> fix/references/

| File | Action |
|------|--------|
| `fix-deep/SKILL.md` | Move to `fix/references/deep-mode.md` |
| `fix-ci/SKILL.md` | Move to `fix/references/ci-mode.md` |
| `fix-ui/SKILL.md` | Move to `fix/references/ui-mode.md` |
| `fix/SKILL.md` | Add flag detection: `--deep`, `--ci`, `--ui` |

### 1.3 plan variants

**Merge**: plan-fast, plan-deep, plan-parallel, plan-validate -> plan/references/

Already partially done (plan/SKILL.md has flag routing). Move variant SKILL.md into references/.

### 1.4 bootstrap variants

**Merge**: bootstrap-fast, bootstrap-parallel -> bootstrap/references/

### 1.5 git subcommands

**Merge**: git-commit, git-push, git-pr -> git/references/

| File | Action |
|------|--------|
| `git-commit/SKILL.md` | Move to `git/references/commit.md` |
| `git-push/SKILL.md` | Move to `git/references/push.md` |
| `git-pr/SKILL.md` | Move to `git/references/pr.md` |
| `git/SKILL.md` | Add subcommand routing: `cm`, `push`, `pr` |

### 1.6 docs subcommands

**Merge**: docs-init, docs-update, docs-component -> docs/references/

### 1.7 review subcommands

**Merge**: review-code, review-improvements -> review/references/

### 1.8 kit subcommands

**Merge**: kit-add-agent, kit-add-hook, kit-add-skill, kit-optimize-skill -> kit/references/

Keep kit-agent-development, kit-skill-development, kit-agents, kit-hooks, kit-cli, kit-verify as standalone (they are large reference skills, not workflow variants).

### 1.9 audit subcommands (across packages)

**Merge**: audit-ui (design-system pkg), audit-a11y + audit-close-a11y (a11y pkg) -> audit/references/

### 1.10 a11y variant

**Merge**: a11y-wcag -> a11y (wcag content is the foundation of a11y, not a variant)

### 1.11 a11y package workflow variants

**Merge**: fix-a11y -> fix/references/a11y-mode.md, review-a11y -> review/references/a11y.md

**Note**: These cross package boundaries (a11y pkg variants reference core pkg parents). The a11y package would provide references/ files that get merged into core skill folders during init.

## Validation

After each merge:
1. Grep all `.md` files for old variant name references
2. Update cross-references
3. Verify parent SKILL.md loads correct reference for each flag
4. Update skill-index.json (remove variant entries)

## Files Modified

All changes in `packages/*/skills/` (source of truth, NOT `.claude/`)
