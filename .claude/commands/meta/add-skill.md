---
description: (ePost) ⚙️ Create a new skill definition
agent: epost-implementer
argument-hint: [skill-name] [description]
---

## Your Mission

Create a new skill definition following epost_agent_kit conventions.

**IMPORTANT:** Use `skill-development` skill for frontmatter reference and best practices.

## Arguments

- SKILL_NAME: $1 (required — lowercase, hyphens, e.g. `my-skill`)
- DESCRIPTION: $2 (optional — what the skill teaches)

## Workflow

1. **Gather Info** (if not provided via arguments):
   - Skill name and domain category
   - Purpose — what development task it teaches
   - Which package it belongs to (core, platform-web, platform-ios, platform-android, platform-backend, meta-kit-design, ui-ux)
   - Whether it's user-invocable (slash command) or background (passive knowledge)
   - Whether it needs `context: fork` (task-oriented) or default (passive)

2. **Scaffold Skill Directory**:
   - Create `.claude/skills/{category}/{skill-name}/SKILL.md` with proper frontmatter
   - Include: name, description (with trigger phrases)
   - Set: user-invocable, context, agent, allowed-tools as needed
   - Write concise SKILL.md body — quick reference, NOT documentation
   - Create `references/` directory if the skill needs detailed reference files

3. **Progressive Disclosure**:
   - `SKILL.md` — short, concise (< 100 lines), always loaded
   - `references/*.md` — detailed patterns, loaded on demand via Read tool
   - Token efficiency is critical — keep SKILL.md lean

4. **Copy to Package Source**:
   - Copy skill directory to `packages/{package}/skills/{category}/{skill-name}/`
   - This is the source of truth — `.claude/` is generated output

5. **Register**:
   - Update `packages/{package}/package.yaml` skills list

6. **Report**: Skill name, package, files created, trigger phrases

## Rules

- Skills are NOT documentation — they teach Claude HOW to perform tasks
- Each skill teaches a specific development workflow, not what a tool does
- Use progressive disclosure: SKILL.md is lean, references/ has details
- `version:` is NOT a valid frontmatter field
- Background skills use `user-invocable: false`
