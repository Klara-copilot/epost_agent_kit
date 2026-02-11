---
description: (ePost) Generate simple standalone command
---

## Your Mission

Generate single command file using Command Development skill.

**IMPORTANT:** Activate `command-development` skill from meta-kit-design package for guidance.

## Workflow

### Step 1: Interactive Prompts

Use `AskUserQuestion` tool to gather:

1. **Command name** (kebab-case, e.g., "review-code", "run-tests")
   - Validate: lowercase, hyphens only, no spaces
   - Transform if needed: "Review Code" → "review-code"

2. **Command category** (e.g., "core", "git", "fix", "meta")
   - Determines subdirectory: `.claude/commands/{category}/`

3. **Command purpose** (brief description for frontmatter)

4. **Command workflow** (steps the command should execute)

5. **Arguments** (optional, e.g., "[file-path]", "[branch-name]")

6. **Skills to activate** (comma-separated, e.g., "code-review, sequential-thinking")

### Step 2: Generate Command File

**File**: `.claude/commands/{category}/{command-name}.md`

**Template**:
```markdown
---
description: {command purpose from user}
argument-hint: {arguments from user or omit if none}
---

## Your Mission

{command purpose expanded}

## Workflow

{Numbered workflow steps from user:}
1. {step 1}
2. {step 2}
3. {step 3}

## Skill Activation

{If user specified skills:}
Activate the following skills:
- {skill-1}
- {skill-2}

## Important Notes

**IMPORTANT:** {Add any important notes based on command purpose}
**IMPORTANT:** Follow YAGNI, KISS, DRY principles.
```

### Step 3: Create File

1. Check if directory exists:
   ```bash
   mkdir -p .claude/commands/{category}
   ```

2. Check for existing file:
   - If `.claude/commands/{category}/{command-name}.md` exists → ask user confirmation
   - If confirmed or new → write file

3. Write command file using template

### Step 4: Report Results

Output summary:
```
✅ Simple Command Generated: /{category}:{command-name}

File Created:
- .claude/commands/{category}/{command-name}.md

Usage:
/{category}:{command-name}  # {command description}

Next Steps:
1. Test the command: /{category}:{command-name}
2. Customize workflow as needed
3. Add additional skills if required
```

## Validation

Before completing:
- [ ] Command name is valid kebab-case
- [ ] Category name is valid
- [ ] Command file created with valid YAML frontmatter
- [ ] No file overwrites without confirmation
- [ ] Directory created successfully

## Error Handling

- **Invalid command name**: Convert to kebab-case or ask user to correct
- **Invalid category**: Suggest valid categories (core, git, fix, meta, docs) or create new
- **File exists**: Ask user: "Overwrite existing file? [y/N]"
- **Write permission error**: Report error and suggest checking permissions
- **Invalid YAML**: Fix template and regenerate

## Skill Activation

**IMPORTANT:** Activate `command-development` skill for:
- Command structure guidance
- Frontmatter format reference
- Best practices
- Workflow patterns
- Argument handling examples
