---
description: (ePost) Generate simple standalone command
agent: epost-kit-designer
---

## Your Mission

Generate single command file using Command Development skill.

**IMPORTANT:** Activate `command-development` skill from kit-design package for guidance.

## Workflow

### Step 1: Interactive Prompts

Use `AskUserQuestion` tool to gather:

1. **Command name** (kebab-case, e.g., "review-code", "run-tests")
   - Validate: lowercase, hyphens only, no spaces
   - Transform if needed: "Review Code" → "review-code"

2. **Command namespace** (e.g., "kit", "git", "fix", "docs")
   - Determines subdirectory: `packages/{package}/commands/{namespace}/`

3. **Command purpose** (brief description for frontmatter)

4. **Target agent** (e.g., epost-implementer, epost-debugger, epost-tester)

5. **Command workflow** (steps the command should execute)

6. **Arguments** (optional, e.g., "[file-path]", "[branch-name]")

### Step 2: Generate Command File

**File**: `packages/{package}/commands/{namespace}/{command-name}.md`

**Template**:
```markdown
---
description: (ePost) {command purpose from user}
agent: {target agent}
argument-hint: {arguments from user or omit if none}
---

## Your Mission

{command purpose expanded}

## Workflow

{Numbered workflow steps from user:}
1. {step 1}
2. {step 2}
3. {step 3}

## Important Notes

**IMPORTANT:** {Add any important notes based on command purpose}
```

### Step 3: Create File

1. Create in package source: `packages/{package}/commands/{namespace}/{command-name}.md`
2. Check for existing file — ask user confirmation before overwrite
3. Write command file using template

### Step 4: Register

1. Update `packages/{package}/package.yaml` commands list
2. Run `epost-kit init --fresh` to regenerate `.claude/commands/`

### Step 5: Report Results

Output summary:
```
Command Generated: /{namespace}:{command-name}

File Created:
- packages/{package}/commands/{namespace}/{command-name}.md

Usage:
/{namespace}:{command-name}  # {command description}

Next Steps:
1. Run epost-kit init --fresh to regenerate
2. Test the command: /{namespace}:{command-name}
3. Customize workflow as needed
```

## Validation

Before completing:
- [ ] Command name is valid kebab-case
- [ ] Namespace is valid
- [ ] Command file has valid YAML frontmatter with `agent:` field
- [ ] File created in `packages/` (source of truth), not `.claude/`
- [ ] No file overwrites without confirmation
- [ ] Registered in package.yaml

## Rules

- All commands MUST have `agent:` field in frontmatter
- Source of truth is `packages/{package}/commands/`, NOT `.claude/commands/`
- Follow `{namespace}/{action}` naming convention
- Commands are instructions FOR Claude, not messages TO the user
