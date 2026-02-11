---
description: Generate splash command with router and variants
---

## Your Mission

Generate splash command structure (router + variants) using Command Development skill.

**IMPORTANT:** Activate `command-development` skill from meta-kit-design package for guidance.

## Splash Command Pattern

Splash commands consist of:
1. **Router command**: `.claude/commands/core/{name}.md` - Routes to variants
2. **Variant commands**: `.claude/commands/{name}/*.md` - Actual implementations

Example structure:
```
.claude/commands/
├── core/
│   └── analyze.md                 # Router: /analyze
└── analyze/
    ├── quick.md                  # Variant: /analyze:quick
    ├── deep.md                   # Variant: /analyze:deep
    └── parallel.md               # Variant: /analyze:parallel
```

## Workflow

### Step 1: Interactive Prompts

Use `AskUserQuestion` tool to gather:

1. **Command name** (kebab-case, e.g., "code-review", "test-runner")
   - Validate: lowercase, hyphens only, no spaces
   - Transform if needed: "Code Review" → "code-review"

2. **Command purpose** (one sentence description)

3. **Number of variants** (2-5 recommended)

4. **Variant names** for each variant:
   - Common patterns: fast, hard, parallel, auto, deep, quick, thorough
   - Validate: kebab-case

5. **Variant descriptions** (brief purpose for each)

### Step 2: Generate Router Command

**File**: `.claude/commands/core/{command-name}.md`

**Template**:
```markdown
---
description: {command description from user}
argument-hint: [{variant1}|{variant2}|{variant3}]
---

## Your Mission

{command purpose from user}

## Workflow

Route to variant based on user selection or task complexity:
- {variant1} → /{command-name}:{variant1}
- {variant2} → /{command-name}:{variant2}
- {variant3} → /{command-name}:{variant3}

## Delegation

Use Skill tool to invoke appropriate variant:
- `/{command-name}:{variant1}` - {variant1 description}
- `/{command-name}:{variant2}` - {variant2 description}
- `/{command-name}:{variant3}` - {variant3 description}

## Important Notes

**IMPORTANT:** This router delegates; does not perform work directly.
**IMPORTANT:** Variants activate relevant skills and perform actual work.
```

### Step 3: Generate Variant Commands

**Files**: `.claude/commands/{command-name}/{variant}.md` (one per variant)

**Template for each variant**:
```markdown
---
description: {variant description from user}
---

## Your Mission

{variant-specific task description}

## Workflow

1. Analyze the task and gather context
2. {Variant-specific workflow steps}
3. Execute implementation
4. Report results

## Skill Activation

Activate relevant skills for this variant:
- Skill: {relevant-skill-name}

## Important Notes

**IMPORTANT:** This is the {variant} variant of /{command-name}.
**IMPORTANT:** Follow YAGNI, KISS, DRY principles.
```

### Step 4: Create Files

1. Check if directories exist:
   ```bash
   mkdir -p .claude/commands/core
   mkdir -p .claude/commands/{command-name}
   ```

2. Check for existing files (prevent overwrite):
   - If `.claude/commands/core/{command-name}.md` exists → ask user confirmation
   - If variants exist → ask user confirmation

3. Write router file
4. Write all variant files

### Step 5: Report Results

Output summary:
```
✅ Splash Command Generated: /{command-name}

Files Created:
- .claude/commands/core/{command-name}.md (router)
- .claude/commands/{command-name}/{variant1}.md
- .claude/commands/{command-name}/{variant2}.md
- .claude/commands/{command-name}/{variant3}.md

Usage:
/{command-name}             # Routes to appropriate variant
/{command-name}:{variant1}  # {variant1 description}
/{command-name}:{variant2}  # {variant2 description}
/{command-name}:{variant3}  # {variant3 description}

Next Steps:
1. Test the command: /{command-name}
2. Customize variant implementations as needed
3. Add skill activations to variants
```

## Validation

Before completing:
- [ ] Command name is valid kebab-case
- [ ] All variant names are valid kebab-case
- [ ] Router file created with valid YAML frontmatter
- [ ] All variant files created with valid YAML frontmatter
- [ ] No file overwrites without confirmation
- [ ] Directories created successfully

## Error Handling

- **Invalid command name**: Convert to kebab-case or ask user to correct
- **File exists**: Ask user: "Overwrite existing files? [y/N]"
- **Write permission error**: Report error and suggest checking permissions
- **Invalid YAML**: Fix template and regenerate

## Skill Activation

**IMPORTANT:** Activate `command-development` skill for:
- Command structure guidance
- Frontmatter format reference
- Best practices
- Template examples
