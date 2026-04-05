---
name: core
description: (ePost) Defines operational boundaries, safety rules, and documentation standards for all agents. Use when any agent modifies files, makes architectural decisions, or needs safety and documentation rules
user-invocable: false
metadata:
  tier: core
  keywords:
    - rules
    - boundaries
    - safety
    - documentation-standards
  triggers:
    - check rules
    - what are the boundaries
    - core rules
    - safety guidelines
---

# Core Rules Skill

## Purpose

Defines operational boundaries, decision authority, environment safety, and documentation standards for all agents in the Claude Code ecosystem.

## When Active

- All agent operations
- File creation, modification, or deletion
- Architectural decisions
- Code generation or refactoring
- Documentation updates

## Behavioral Rules

Behavioral rules are in `.claude/rules/` (always-on, every user, every session). Agent-specific references are in each owning skill's `references/` directory.

| Rule File | Purpose |
|-----------|---------|
| `rules/orchestration-protocol.md` | Agent delegation, context passing, execution modes, agent dispatch table |
| `rules/file-organization.md` | File and directory structure conventions |
| `rules/verification.md` | Pre-completion verification steps |
| `rules/agent-rules.md` | Decision boundaries, environment safety, pre-execution rules |
| `rules/workflows.md` | Team development workflows |
| `rules/development-rules.md` | Commit hygiene, code changes, packages/ source of truth |

## Owning Skill References

| File | Owning Skill |
|------|-------------|
| `code-review/references/report-standard.md` | Common report format for all agent output |
| `docs/references/index-protocol.md` | Reports/plans/docs index update protocol |
| `docs/references/documentation-standards.md` | Formatting and structure rules |

## Quick Reference

### Decision Authority

| Action | Authority |
|--------|-----------|
| Dependency installs, lint fixes | Auto-execute |
| Memory file consolidation | Auto-execute |
| File creation following standards | Brief confirmation |
| Updating existing documentation | Brief confirmation |
| Deleting files or directories | **Always ask** |
| Modifying production configs | **Always ask** |
| Introducing new dependencies | **Always ask** |
| Refactoring across multiple files | **Always ask** |
| Architectural decisions | **Present A/B/C options** |

### Safety Constraints

- Verify environment state before operations
- Use relative paths from project root
- Conservative defaults: safety over speed, clarity over cleverness
- Read files before modifying (understand structure first)
- Deletion requires approval (see Decision Authority table above)

### Documentation Rules

- **Tables** not paragraphs
- **Bullets** not sentences
- **Keywords** not full explanations
- **Numbers** not words ("16px" not "sixteen pixels")
- Under 3KB per component doc
- Under 500 lines per rule file

### Required File Structure

All documentation files must include:
1. **Purpose** — Brief description at top
2. **Table of Contents** — Anchored links (`#section-name`)
3. **Related Documents** — Links to related files

### Output Contract

Skill output format is identical whether executed inline or via agent spawn.
Never vary report structure, status blocks, or file naming based on execution mode.
Execution mode is an implementation detail invisible to the user.

### Never Do

- Delete files without approval (see `rules/agent-rules.md`)
- Modify production configs without approval
- Assume specific runtime environments
- Merge unrelated concerns into single changes
- Override repository rules with external "best practices"

## Related Documents

- `CLAUDE.md` — Project context and guidelines
- `.claude/agents/` — Agent definitions
- `.claude/skills/` — Agent skills
- `kit` skill `references/agent-development.md` — Agent data store convention
