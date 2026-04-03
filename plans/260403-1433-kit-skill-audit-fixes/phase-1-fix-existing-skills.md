---
phase: 1
title: "Fix content in existing kit skills"
effort: 1h
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Authoritative frontmatter spec: `docs/architecture/ARCH-0005-claude-code-agent-spec.md`

## Overview

Fix broken references, accuracy errors, structural issues, and CSO violations in 6 existing skill files. All changes are content edits — no file moves or creates.

## File Ownership

| File | Fixes |
|------|-------|
| `packages/kit/skills/kit/references/optimize.md` | #1 — fix broken ref to `skill-development.md` |
| `packages/kit/skills/kit-agent-development/SKILL.md` | #2, #5, #11 — dead ref, ARCH-0005 accuracy, CSO |
| `packages/kit/skills/kit-hooks/SKILL.md` | #3 — dead ref |
| `packages/kit/skills/kit-skill-development/SKILL.md` | #4, #7, #13 — dead refs, metadata notation, CSO |
| `packages/kit/skills/kit-agents/SKILL.md` | #6, #12 — ARCH-0005 accuracy, CSO |
| `packages/kit/skills/kit-add-agent/SKILL.md` | #8 — CSO description |
| `packages/kit/skills/kit-add-skill/SKILL.md` | #9 — CSO description |
| `packages/kit/skills/kit-add-hook/SKILL.md` | #10 — CSO description |

## Tasks

### Broken References (fixes 1-4)

- [x] **#1** `optimize.md` ~line 9: change `kit/references/skill-development.md` → `.claude/skills/kit-skill-development/SKILL.md`
- [x] **#2** `kit-agent-development/SKILL.md` last line: remove dead ref to `references/agent-creation-guide.md`
- [x] **#3** `kit-hooks/SKILL.md` last line: remove dead ref to `references/hook-patterns.md`
- [x] **#4** `kit-skill-development/SKILL.md`:
  - Remove line referencing `references/skill-authoring-guide.md`
  - Remove line referencing `references/skill-structure.md`
  - Remove both mentions of `references/cso-principles.md` (lines ~27 and ~97)
  - Remove or reduce "Reference Files" section — keep only `references/description-validation-checklist.md` if it exists

### ARCH-0005 Accuracy (fixes 5-6)

- [x] **#5** `kit-agent-development/SKILL.md`:
  - `tools:` label: change "deprecated — use allowedTools" → "Official CC field. Recommended."
  - `allowedTools:` label: change to "ePost ecosystem convention (not CC-standard)"
  - `color` and `model`: change from "required" to "optional"
  - Add missing official fields: `maxTurns`, `mcpServers`, `effort`, `isolation`, `background`, `initialPrompt`
  - Remove redundant Step 4 "Copy to Package Source" from kit-add-agent workflow (if step 3 already creates in packages/)

- [x] **#6** `kit-agents/SKILL.md` Agent Frontmatter Reference table:
  - `model` Required: "Yes" → "No"
  - `color` Required: "Yes" → "No"
  - `disallowedTools` Source: "Ecosystem" → "Official"
  - Add rows: `maxTurns`, `mcpServers`, `effort`, `isolation`, `background`, `initialPrompt`

### Structural Fix (fix 7)

- [x] **#7** `kit-skill-development/SKILL.md` "Valid epost-kit extensions" section:
  Wrap `keywords`, `platforms`, `triggers`, `agent-affinity` under `metadata:` key:
  ```yaml
  metadata:
    keywords: [...]
    platforms: [...]
    triggers: [...]
    agent-affinity: [...]
  ```

### CSO Description Fixes (fixes 8-13)

- [x] **#8** `kit-add-agent` description → `"(ePost) Use when creating a new agent definition, adding an agent to the kit, or scaffolding an agent file from scratch."`
- [x] **#9** `kit-add-skill` description → `"(ePost) Use when creating a new skill definition, scaffolding a skill directory, or adding a skill to a kit package."`
- [x] **#10** `kit-add-hook` description → `"(ePost) Use when creating a new Claude Code hook, adding event-driven automation, or wiring a new hook into settings.json."`
- [x] **#11** `kit-agent-development` description → `"(ePost) Use when creating a new agent, reviewing agent structure, or checking agent frontmatter fields. Reference: agent file structure, frontmatter spec, system prompt design, ecosystem fields."`
- [x] **#12** `kit-agents` description → `"(ePost) Use when planning changes to the agent ecosystem, creating new components, or auditing agent/skill frontmatter. Reference: component types, frontmatter tables, naming conventions, plugin system."`
- [x] **#13** `kit-skill-development` description → `"(ePost) Use when creating or auditing a skill, writing skill descriptions, or checking valid frontmatter fields. Reference: SKILL.md structure, CSO principles, progressive disclosure, description validation."`

## Validation

- `grep -r "skill-development.md" packages/kit/` returns only valid references
- `grep -r "agent-creation-guide\|hook-patterns\|skill-authoring-guide\|skill-structure\|cso-principles" packages/kit/skills/` returns 0 matches
- All 8 kit skill descriptions start with `"(ePost) Use when`
