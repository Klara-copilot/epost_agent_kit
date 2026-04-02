---
phase: 12
title: "rules/ — Migrate core/references/ to rules/ + owning skills. Delete core/references/."
effort: 60m
depends: []
---

# Phase 12: Migrate core/references/ → rules/ + owning skills

After consolidation, `core/references/` has 8 files. All of them belong elsewhere:
- Behavioral rules → `packages/core/rules/` (always-on, every user, every session)
- Agent-specific references → owning skill's `references/` directory

**End state: `core/references/` directory is deleted.**

## Migration Map

### → `packages/core/rules/`

| Source | Destination | Rename |
|--------|-------------|--------|
| `core/references/orchestration.md` | `core/rules/orchestration-protocol.md` | yes |
| `core/references/file-organization.md` | `core/rules/file-organization.md` | no |
| `core/references/verification-checklist.md` | `core/rules/verification.md` | yes |
| `core/references/agent-rules.md` | `core/rules/agent-rules.md` | no |
| `core/references/workflows.md` | `core/rules/workflows.md` | no |

Plus 2 new files (originally planned in Phase 12):
| New file | Content |
|----------|---------|
| `core/rules/development-rules.md` | Commit hygiene, code changes, packages/ source of truth |
| `core/rules/orchestration-protocol.md` | Extend existing orchestration.md with agent dispatch table |

### → Owning skills

| Source | Destination | Owning skill |
|--------|-------------|-------------|
| `core/references/report-standard.md` | `core/skills/code-review/references/report-standard.md` | code-review |
| `core/references/index-protocol.md` | `core/skills/docs/references/index-protocol.md` | docs |
| `core/references/documentation-standards.md` | `core/skills/docs/references/documentation-standards.md` | docs |

## New Files to Create

### `core/rules/development-rules.md`

```markdown
# Development Rules

## Commits

- Conventional commits: `feat:` `fix:` `docs:` `refactor:` `test:` `chore:`
- Never add AI attribution: no "Generated with Claude Code", no "Co-authored by Claude"
- Run lint before committing (Node: `npm run lint`, Java: `mvn checkstyle:check`)
- Never commit secrets: check for `sk-`, `Bearer `, `password =`, `API_KEY=`
- No force-push to main/master without explicit user request

## Code Changes

- Read files before editing — never assume current state
- Ask before: deleting files, modifying production configs, introducing new dependencies,
  multi-file refactors, changing API contracts
- Auto-execute: dependency installs, lint fixes, documentation formatting

## Packages as Source of Truth

`.claude/` is generated output — wiped on `epost-kit init`. ALL edits go in `packages/`.
Editing `.claude/` directly = changes lost on next init. Always check you're in `packages/`.

## Verification

Never claim "done", "complete", or "passing" without running verification in the current turn.
Memory of previous results is not evidence. Run the command, read the output, then claim.
```

### Extend `core/rules/orchestration-protocol.md` (after migrating orchestration.md)

Append a dispatch table section:

```markdown
## Agent Dispatch

Always delegate via Agent tool. Never handle these inline in the main context.

| Intent | Dispatch to | Never |
|--------|-------------|-------|
| Plan / Design / Spec | `epost-planner` | Built-in `Plan` subagent_type (read-only, no Write) |
| Git (commit, push, PR, ship) | `epost-git-manager` | Inline git commands |
| Build / Implement | `epost-fullstack-developer` | Inline code writing |
| Fix / Debug | `epost-debugger` | Inline diagnosis |
| Test | `epost-tester` | Inline test runs |
| Research | `epost-researcher` | Inline web search |
| Docs | `epost-docs-manager` | Inline documentation |

**Critical**: Built-in `Plan` subagent_type has NO Write/Edit tools. Always use `epost-planner`.
```

## package.yaml Changes

Add `rules/: rules/` to the `files:` map in `packages/core/package.yaml`.

## SKILL.md Changes

After migration, `core/SKILL.md` Aspect Files table needs updating:
- Remove the 8 migrated `references/` entries
- Add 3 entries pointing to owning skills: "See code-review/, docs/ skills for agent-specific refs"
- Or simplify: SKILL.md just says "Rules are in `.claude/rules/`. Agent refs are in each skill."

## Todo

- [x] Create `packages/core/rules/` directory
- [x] Move + rename: orchestration.md → rules/orchestration-protocol.md
- [x] Move: file-organization.md → rules/file-organization.md
- [x] Move + rename: verification-checklist.md → rules/verification.md
- [x] Move: agent-rules.md → rules/agent-rules.md
- [x] Move: workflows.md → rules/workflows.md
- [x] Create `rules/development-rules.md`
- [x] Append Agent Dispatch section to rules/orchestration-protocol.md
- [x] Move: report-standard.md → code-review/references/report-standard.md
- [x] Move: index-protocol.md → docs/references/index-protocol.md
- [x] Move: documentation-standards.md → docs/references/documentation-standards.md
- [x] Delete `packages/core/skills/core/references/` directory
- [x] Add `rules/: rules/` to packages/core/package.yaml files map
- [x] Update core/SKILL.md — remove Aspect Files table or simplify
- [x] Update any references to old paths in agent prompts and other skills

## Cross-Reference Sweep

After migration, grep for stale paths:
- `core/references/orchestration` → `rules/orchestration-protocol`
- `core/references/report-standard` → `code-review/references/report-standard`
- `core/references/index-protocol` → `docs/references/index-protocol`
- `core/references/verification-checklist` → `rules/verification`
- `core/references/file-organization` → `rules/file-organization`

Check in: all agent `.md` files, all skill SKILL.md files, CLAUDE.snippet.md

## Success Criteria

- `packages/core/rules/` has 6 files (orchestration-protocol, file-organization, verification, agent-rules, workflows, development-rules)
- `packages/core/skills/code-review/references/report-standard.md` exists
- `packages/core/skills/docs/references/index-protocol.md` exists
- `packages/core/skills/docs/references/documentation-standards.md` exists
- `packages/core/skills/core/references/` directory deleted
- `package.yaml` files map includes `rules/: rules/`
- Zero stale `core/references/` path references remaining

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent prompts reference old paths | High | Cross-reference sweep after migration |
| report-standard.md already exists in code-review/ | Medium | Check before moving — merge if needed |
| index-protocol.md already exists in docs/ | Medium | Check before moving — merge if needed |
| core SKILL.md becomes empty shell | Low | Update to describe rules/ location |
