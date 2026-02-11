---
description: (ePost) ⭑⭑⭑ Intelligent plan creation with prompt enhancement
argument-hint: [task]
---

## Your mission

<task>
$ARGUMENTS
</task>

## Pre-Creation Check (Active vs Suggested Plan Detection)

Check the `## Plan Context` section in the injected context:

- If "Plan:" shows a path → Active plan exists. Ask user: "Active plan found: {path}. Continue with this? [Y/n]"
- If "Suggested:" shows a path → Branch-matched plan hint only. Ask user if they want to activate it or create new.
- If "Plan: none" → Proceed to create new plan using naming pattern from `## Naming` section.

## Workflow

1. **Pre-Creation Check**: Check `## Plan Context` section
   - "Plan: {path}" → ask "Active plan found: {path}. Continue? [Y/n]"
   - "Suggested: {path}" → ask to activate or create new
   - "Plan: none" → proceed to step 2

2. **Task Analysis**: Analyze task and use `AskUserQuestion` for clarification if needed

3. **Route Selection**: Based on complexity:
   - **Simple tasks** → Use Skill tool: `/plan:fast <detailed-instructions>`
   - **Complex tasks** → Use Skill tool: `/plan:hard <detailed-instructions>`

4. **Delegation**: Sub-command will:
   - Create plan directory (if new) and run `set-active-plan.cjs`
   - Delegate to epost-planner agent via Task tool
   - epost-planner activates `planning` skill and creates plan files
   - Return plan path for user review

**Note**: `<detailed-instructions>` is enhanced prompt describing task in detail.

## Delegation Chain

```
User → /core:plan
      ↓
      ├→ /plan:fast → epost-planner → planning skill
      └→ /plan:hard → epost-researcher (parallel) → epost-planner → planning skill
```

- **epost-planner**: Creates plan files (plan.md + phase-XX.md)
- **epost-researcher**: Conducts technical research (only in /plan:hard)
- **planning skill**: Loaded by epost-planner for workflow guidance

## Important Notes

**IMPORTANT:** This command routes to sub-commands; it does NOT create plans directly.
**IMPORTANT:** Sub-commands delegate to `epost-planner` agent for plan creation.
**IMPORTANT:** Analyze skills catalog and activate needed skills during process.
**IMPORTANT:** Sacrifice grammar for concision in reports.
**IMPORTANT:** Ensure token efficiency while maintaining quality.
**IMPORTANT:** List unresolved questions at end of reports.
**IMPORTANT:** Do NOT start implementing.
