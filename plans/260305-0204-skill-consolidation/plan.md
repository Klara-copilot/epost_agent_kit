---
updated: 2026-03-05
title: Consolidate 99 skill folders into ~45 using flag-based routing
status: archived
created: 2026-03-05
complexity: complex
effort: 8h
phases: 3
platforms: [all]
breaking: true
---

# Skill Consolidation: From 99 Folders to ~45

## Problem

99 skill folders are overwhelming. Many are variants (cook, cook-fast, cook-parallel) that should be flags on a parent skill, not standalone folders. claudekit achieves similar functionality with 73 skills and uses **flags on skills + subcommands in commands/** instead of separate skill folders per variant.

## Design Principles (from claudekit)

1. **One skill folder per concept** -- variants are flags (`--fast`, `--deep`, `--parallel`)
2. **Variant logic lives in `references/`** inside the parent skill folder
3. **Commands use subfolders** for user-facing variants (e.g., `commands/plan/deep.md`)
4. **Skills = knowledge/behavior**, Commands = user entry points

## Current State: 99 Skill Folders

### Variant Groups to Merge (saves ~30 folders)

| Parent | Variants to Absorb | New Flags | Folders Saved |
|--------|-------------------|-----------|---------------|
| `cook` | cook-fast, cook-parallel | `--fast`, `--parallel` | 2 |
| `fix` | fix-deep, fix-ci, fix-ui | `--deep`, `--ci`, `--ui` | 3 |
| `plan` | plan-fast, plan-deep, plan-parallel, plan-validate | `--fast`, `--deep`, `--parallel`, `--validate` | 4 |
| `bootstrap` | bootstrap-fast, bootstrap-parallel | `--fast`, `--parallel` | 2 |
| `git` | git-commit, git-push, git-pr | `cm`, `push`, `pr` (subcommands) | 3 |
| `docs` | docs-init, docs-update, docs-component | `init`, `update`, `component` (subcommands) | 3 |
| `review` | review-code, review-improvements | `code`, `improvements` (subcommands) | 2 |
| `kit` | kit-add-agent, kit-add-hook, kit-add-skill, kit-optimize-skill | `add-agent`, `add-hook`, `add-skill`, `optimize` (subcommands) | 4 |
| `audit` | audit-ui, audit-a11y, audit-close-a11y | `--ui`, `--a11y`, `--close` flags | 3 |
| `fix` | fix-a11y | `--a11y` flag | 1 |
| `review` | review-a11y | `--a11y` flag | 1 |
| `a11y` | a11y-wcag | merge wcag into a11y (wcag IS a11y) — **DONE** | 1 |
| `kit` | kit-agent-development, kit-skill-development, kit-hooks, kit-cli | merge into kit/references/ | 4 |

**Total folders saved: ~33** (99 -> ~66)

### Reference-Only Skills to Merge Into Parents

| Absorbed Skill | Merge Into | Rationale |
|---------------|-----------|-----------|
| `hub-context` | `skill-discovery` | Both do routing; skill-discovery is the entry point |
| `receiving-code-review` | `code-review` | Same domain, add as section |
| `verification-before-completion` | `core` | Universal guardrail, belongs in core |
| `knowledge-base` | `knowledge-retrieval` | Base is just structure; retrieval uses it |

**Total after this: ~62**

### Skills That Stay Standalone (~65)

Standalone skills fall into clean categories:

**Core behavioral** (8): core, skill-discovery, error-recovery, problem-solving, sequential-thinking, auto-improvement, data-store, subagent-driven-development

**Workflow commands** (12): cook, fix, plan, test, debug, scout, convert, bootstrap, git, docs, review, epost

**Kit authoring** (4): kit, kit-agents, kit-agent-development, kit-skill-development, kit-hooks, kit-cli, kit-verify → merge add-* into parent → **kit** (1 folder) + kit-agents, kit-agent-development, kit-skill-development, kit-hooks, kit-cli, kit-verify (6 reference)

**Knowledge** (3): knowledge-retrieval, knowledge-capture, doc-coauthoring

**Infrastructure** (2): infra-cloud, infra-docker

**A11y** (4): a11y, ios-a11y, android-a11y, web-a11y

**Platform** (varies by installed packages -- these are NOT in core)

**Audit** (1): audit (parent with subcommands)

**Other** (3): repomix, research, get-started, simulator

## Target: ~50 Skill Folders

Down from 99. Clean, flag-based, no variant explosion.

## Migration Pattern

For each variant group:

1. Move variant SKILL.md content into `parent/references/variant-name.md`
2. Add flag detection table to parent SKILL.md (like cook already has for `--fast`)
3. Update `package.yaml` provides list (remove variant entries)
4. Update `skill-index.json` (remove variant entries, update parent keywords)
5. Update agent `skills:` lists if they reference variants directly
6. Update cross-references in other skills

## Risks

- **Breaking**: Any agent or skill that references a variant by name breaks
- **Mitigation**: Grep all `.md` files for variant names, update references
- **epost-kit init**: Must handle new structure (fewer folders to copy)
- **skill-index.json**: Must be regenerated after consolidation

## Resolved Decisions

1. **kit-agent-development, kit-skill-development, kit-hooks, kit-cli** → merge into `kit/references/` (not standalone folders)
2. **docs-seeker** → stays standalone (Context7 integration is distinct enough)
3. **hub-context** → merges into `skill-discovery`
4. **audit-a11y** → merges into `audit` (as `--a11y` flag); **fix-a11y** → merges into `fix` (as `--a11y` flag); **review-a11y** → merges into `review` (as `a11y` subcommand); **audit-close-a11y** → merges into `audit` (as `--close` flag). References stay in `packages/a11y/skills/a11y/references/`.
5. **Commands subfolders are DEPRECATED** — flag-based routing in skills is the pattern. No `commands/plan/deep.md` etc.
