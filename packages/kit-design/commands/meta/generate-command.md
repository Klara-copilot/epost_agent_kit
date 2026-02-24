---
description: (ePost) ⚙️ Generate new slash or simple commands interactively
argument-hint: [splash|simple]
---

## Your Mission

Generate new command files using Command Development skill from meta-kit-design package.

## Workflow

1. **Command Type Selection**: Ask user to select command type:
   - `splash` - Router command with multiple variants (e.g., /plan, /plan:fast, /plan:deep)
   - `simple` - Single standalone command

2. **Route to Variant**:
   - If user selects `splash` → delegate to `/generate-command:splash`
   - If user selects `simple` → delegate to `/generate-command:simple`

## Delegation

Use the Skill tool to invoke the appropriate variant:

```
Skill("generate-command:splash")   # For splash command generation
Skill("generate-command:simple")    # For simple command generation
```

## Important Notes

**IMPORTANT:** This is a router command - it delegates to variants, does not generate commands directly.

**IMPORTANT:** Variants will activate the `command-development` skill from meta-kit-design package.

**IMPORTANT:** User selects command type interactively via AskUserQuestion tool.
