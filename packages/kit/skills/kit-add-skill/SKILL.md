---
name: kit-add-skill
description: "(ePost) Use when creating a new skill definition, scaffolding a skill directory, or adding a skill to a kit package."
user-invocable: true
context: fork
agent: epost-fullstack-developer
metadata:
  argument-hint: "[skill-name] [description]"
  keywords: [skill, create, scaffold, add-skill, kit]
  triggers: [/kit-add-skill, create a skill, scaffold skill, add a skill]
  platforms: [all]
  agent-affinity: [epost-fullstack-developer]
  connections:
    requires: []
---

## Delegation — REQUIRED

This skill MUST run via `epost-fullstack-developer`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/kit-add-skill`
- **Arguments**: $ARGUMENTS

## Your Mission

Create a new skill definition following epost_agent_kit conventions.

**IMPORTANT:** Read `.claude/skills/skill-creator/references/epost-skill-authoring-standards.md` for frontmatter reference and best practices.

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

2. **Layer Check** — verify content belongs in a skill (Layer 0), not repo docs (Layer 2):

   Skills in `epost_agent_kit` are **org-wide standards** (Layer 0). They must apply to any ePost repo, any team, any project.

   Scan the proposed skill content for Layer 2/3 signals:
   - References to specific repos, projects, or product names (e.g., "ePost web app", "our Keycloak instance")
   - Specific file paths that only exist in one repo (e.g., `src/modules/inbox/`)
   - Business logic or domain rules tied to one product
   - Conventions that deviate from org standard (e.g., "in this repo we use X instead of Y")
   - Config values, environment details, or deployment specifics for one service

   | Content type | Layer | Where it belongs |
   |---|---|---|
   | Org-wide workflow, pattern, or standard | Layer 0 | Skills in `packages/` ✓ |
   | How THIS repo deviates from the standard | Layer 2 | `docs/conventions/CONV-NNNN-*.md` |
   | Why a specific decision was made in this repo | Layer 2 | `docs/decisions/ADR-NNNN-*.md` |
   | Deep-dive on a feature in this repo | Layer 2 | `docs/features/FEAT-NNNN-*.md` |
   | A gotcha or debug finding in this repo | Layer 2 | `docs/findings/FINDING-NNNN-*.md` |

   **If Layer 2/3 signals detected → STOP. Do not create the skill.**

   Present this to the user:
   ```
   ⚠️ Layer Check: This content appears repo-specific (Layer 2), not org-wide (Layer 0).

   Skills in epost_agent_kit are loaded by all agents across all repos — they must
   apply universally. Repo-specific content belongs in this repo's docs/ instead.

   Suggested doc type: [CONV / ADR / FEAT / GUIDE / FINDING] — [reason]
   Suggested path: docs/[category]/[PREFIX-NNNN-slug].md

   To proceed anyway (if content is truly org-wide), confirm explicitly.
   ```

   Only continue to step 3 if content passes the Layer check.

3. **Suggest Connections** — scan existing skills for likely relationships:
   - `extends`: is this a specialization of an existing skill? (e.g., `ios-a11y` extends `a11y`)
   - `requires`: does it depend on another skill to function?
   - `enhances`: does it complement another skill?
   - `conflicts`: is it mutually exclusive with another?

4. **Scaffold Skill Directory**:
   - Create `packages/{package}/skills/{skill-name}/SKILL.md` with proper frontmatter
   - Include: name, description (with trigger phrases)
   - Set: user-invocable, context, agent, allowed-tools as needed
   - Add `metadata.connections` if relationships identified in step 3
   - Write concise SKILL.md body — quick reference, NOT documentation
   - Create `references/` directory if the skill needs detailed reference files
   - Create `evals/eval-set.json` with placeholder trigger queries (required for all user-invocable skills):
     ```json
     [
       {"query": "TODO: add a query that should trigger this skill", "should_trigger": true},
       {"query": "TODO: add a query that should NOT trigger this skill", "should_trigger": false}
     ]
     ```

5. **Progressive Disclosure**:
   - `SKILL.md` — short, concise (< 100 lines), always loaded
   - `references/*.md` — detailed patterns, loaded on demand via Read tool
   - Token efficiency is critical — keep SKILL.md lean

6. **Copy to Package Source**:
   - Copy skill directory to `packages/{package}/skills/{category}/{skill-name}/`
   - This is the source of truth — `.claude/` is generated output

7. **Register**:
   - Update `packages/{package}/package.yaml` skills list

8. **Validate**: Run `/kit-verify` — catch broken refs, eval-coverage warnings, frontmatter issues

9. **Quality** (hand off to `skill-creator`): Once scaffolded, use `skill-creator` to improve description quality, run trigger evals, and optimize. `skill-creator` is Anthropic's eval-driven tool — do not modify it.

10. **Report**: Skill name, package, files created, trigger phrases, connections

## Post-Creation Checklist

- [ ] Frontmatter has name and description with trigger phrases
- [ ] `metadata.keywords` present (min 3)
- [ ] `metadata.platforms` set (not defaulting to "all" unless intentional)
- [ ] `metadata.connections` declared if obvious parent/dependency exists
- [ ] `evals/eval-set.json` created with ≥2 trigger queries (1 true, 1 false)
- [ ] Registered in package.yaml `provides.skills`
- [ ] No lint errors (`epost-kit lint`)

## Rules

- Skills are NOT documentation — they teach Claude HOW to perform tasks
- Each skill teaches a specific development workflow, not what a tool does
- Use progressive disclosure: SKILL.md is lean, references/ has details
- `version:` is NOT a valid frontmatter field
- Background skills use `user-invocable: false`
- **Layer 0 only**: Skills in this kit must be org-wide applicable — if content is repo-specific, it belongs in that repo's `docs/` (CONV, ADR, FEAT, GUIDE, or FINDING), not here
