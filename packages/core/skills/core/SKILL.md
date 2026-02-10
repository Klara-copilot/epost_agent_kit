---
name: core
description: Operational boundaries, safety rules, and documentation standards. Active for all agent operations, file modifications, and architectural decisions.
user-invocable: false
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

## Aspect Files

| File | Purpose |
|------|---------|
| `references/decision-boundaries.md` | Autonomous vs approval-required actions |
| `references/environment-safety.md` | Pre-execution verification rules |
| `references/external-tools-usage.md` | External tool/MCP boundaries |
| `references/documentation-standards.md` | Formatting and structure rules |

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

### Never Do

- Delete files without approval (see `references/decision-boundaries.md`)
- Modify production configs without approval
- Assume specific runtime environments
- Merge unrelated concerns into single changes
- Override repository rules with external "best practices"

## Related Documents

- `CLAUDE.md` — Project context and guidelines
- `.claude/agents/` — Agent definitions
- `.claude/skills/` — Agent skills
