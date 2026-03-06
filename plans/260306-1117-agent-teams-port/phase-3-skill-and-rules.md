---
phase: 3
title: "Team skill + coordination rules"
effort: 1h
depends: []
---

# Phase 3: Team Skill & Coordination Rules

## Task 3.1: Create team SKILL.md

**File**: `packages/core/skills/team/SKILL.md`
**Action**: Create
**Source**: `/Users/than/Projects/claudekit/.claude/skills/team/SKILL.md`

Changes from source:
- Frontmatter: `name: team` (not `ck:team`), remove `version:` (not valid CC field), keep `argument-hint:`
- All `CK_` env var references → `EPOST_` equivalents
- "CK Context Block" → "epost Context Block"
- Agent types use epost names:
  - `subagent_type: "researcher"` → spawns `epost-researcher`
  - `subagent_type: "fullstack-developer"` → spawns `epost-fullstack-developer`
  - `subagent_type: "code-reviewer"` → spawns `epost-code-reviewer`
  - `subagent_type: "debugger"` → spawns `epost-debugger`
  - `subagent_type: "tester"` → spawns `epost-tester`
  - `subagent_type: "planner"` → spawns `epost-planner`
- Template command prefix: `/team` (not `/ck:team`)
- Model assignments stay same: haiku for researchers/reviewers/testers, sonnet for devs/debuggers
- `CK_REPORTS_PATH` → `EPOST_REPORTS_PATH`, etc.
- Rules reference: `.claude/skills/core/references/team-coordination-rules.md`
- Remove duplicate "## Agent Memory" section
- Footer: `*epost_agent_kit Agent Teams*`

## Task 3.2: Create team-coordination-rules.md

**File**: `packages/core/skills/core/references/team-coordination-rules.md`
**Action**: Create
**Source**: `/Users/than/Projects/claudekit/.claude/rules/team-coordination-rules.md`

Changes from source:
- "CK Stack Conventions" → "epost Conventions"
- `CK_REPORTS_PATH` → `EPOST_REPORTS_PATH`
- Team/task config dirs stay `~/.claude/teams/` and `~/.claude/tasks/`
- No structural changes — just branding

Placement rationale: `core/references/` because coordination rules are operational boundaries (like orchestration.md), not a standalone skill.

## Task 3.3: Register team skill in skill-index.json

**File**: `packages/core/skills/skill-index.json` (or `.claude/skills/skill-index.json`)
**Action**: Modify

Add entry:
```json
{
  "name": "team",
  "description": "Agent Teams orchestration for parallel multi-session collaboration",
  "tier": "core",
  "platforms": ["all"],
  "keywords": ["team", "parallel", "teammates", "collaboration", "agent-teams"],
  "agent-affinity": ["epost-project-manager"]
}
```

Update count field.

## Validation

- `cat packages/core/skills/team/SKILL.md` contains no `CK_` references
- `cat packages/core/skills/core/references/team-coordination-rules.md` contains no `CK_` references
- skill-index.json valid JSON with updated count
- team SKILL.md has no `version:` in frontmatter
