---
phase: 3
title: Update registries, indexes, and agent references
effort: 2h
depends: [1, 2]
---

# Phase 3: Update All Registries

## Tasks

### 3.1 Update package.yaml provides lists

For each package (core, a11y, kit, design-system, domains, platform-*):
- Remove merged variant skill names from `provides.skills`
- Keep parent skill names

### 3.2 Regenerate skill-index.json

- Remove entries for merged skills
- Update parent skill keywords to include variant keywords
- Update count field

### 3.3 Update agent skills: lists

Grep all agent `.md` files for variant references. If an agent lists `plan-fast` in skills:, change to `plan`.

### 3.4 Update cross-references in skills

Grep all SKILL.md files for references to merged skill names. Update to parent + flag/subcommand format.

Example: "delegate to `plan-fast`" -> "delegate to `plan --fast`"

### 3.5 Update CLAUDE.md routing tables

The Intent -> Skill Map in CLAUDE.md references variant names. Update to parent + flag.

### 3.6 Update skill-discovery routing tables

skill-discovery/SKILL.md has discovery paths. Update to new names.

### 3.7 Run epost-kit init

Regenerate `.claude/` from updated `packages/` to verify everything works.

## Validation

- [ ] `ls .claude/skills/ | wc -l` shows ~50 (down from 99)
- [ ] No broken cross-references (grep for old variant names returns 0)
- [ ] skill-index.json count matches actual folder count
- [ ] package.yaml provides lists match actual folders
- [ ] All agent skills: lists reference valid skill names
