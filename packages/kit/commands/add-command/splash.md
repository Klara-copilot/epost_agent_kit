---
description: (ePost) Generate splash command with router and variants
agent: epost-kit-designer
---

## Your Mission

Generate splash command structure (router + variants) using Command Development skill.

**IMPORTANT:** Activate `command-development` skill from kit-design package for guidance.

## Splash Command Pattern

Splash commands consist of:
1. **Router command**: `packages/{package}/commands/{namespace}/{name}.md` — Routes to variants
2. **Variant commands**: `packages/{package}/commands/{name}/*.md` — Actual implementations

Example structure:
```
packages/{package}/commands/
├── core/
│   └── analyze.md                 # Router: /analyze
└── analyze/
    ├── quick.md                   # Variant: /analyze:quick
    ├── deep.md                    # Variant: /analyze:deep
    └── parallel.md                # Variant: /analyze:parallel
```

## Workflow

### Step 1: Interactive Prompts

Use `AskUserQuestion` tool to gather:

1. **Command name** (kebab-case, e.g., "code-review", "test-runner")
   - Validate: lowercase, hyphens only, no spaces

2. **Command namespace** (e.g., "core", "kit", "fix")

3. **Command purpose** (one sentence description)

4. **Target agent** for router and variants

5. **Number of variants** (2-5 recommended)

6. **Variant names** for each variant:
   - Common patterns: fast, deep, parallel, auto, quick, thorough
   - Validate: kebab-case

7. **Variant descriptions** (brief purpose for each)

### Step 2: Generate Router Command

**File**: `packages/{package}/commands/{namespace}/{command-name}.md`

**Template**:
```markdown
---
description: (ePost) {command description from user}
agent: {target agent}
argument-hint: [{variant1}|{variant2}|{variant3}]
---

## Your Mission

{command purpose from user}

## Workflow

Route to variant based on user selection or task complexity:
- {variant1} → /{command-name}:{variant1}
- {variant2} → /{command-name}:{variant2}

## Delegation

Use Skill tool to invoke appropriate variant:
- `/{command-name}:{variant1}` — {variant1 description}
- `/{command-name}:{variant2}` — {variant2 description}

## Important Notes

**IMPORTANT:** This router delegates; does not perform work directly.
```

### Step 3: Generate Variant Commands

**Files**: `packages/{package}/commands/{command-name}/{variant}.md` (one per variant)

**Template for each variant**:
```markdown
---
description: (ePost) {variant description from user}
agent: {target agent}
---

## Your Mission

{variant-specific task description}

## Workflow

1. Analyze the task and gather context
2. {Variant-specific workflow steps}
3. Execute implementation
4. Report results

## Important Notes

**IMPORTANT:** This is the {variant} variant of /{command-name}.
```

### Step 4: Create Files

1. Create router in `packages/{package}/commands/{namespace}/{command-name}.md`
2. Create variants in `packages/{package}/commands/{command-name}/{variant}.md`
3. Check for existing files — ask user confirmation before overwrite

### Step 5: Register

1. Update `packages/{package}/package.yaml` commands list (router + all variants)
2. Run `epost-kit init --fresh` to regenerate

### Step 6: Report Results

Output summary:
```
Splash Command Generated: /{command-name}

Files Created:
- packages/{package}/commands/{namespace}/{command-name}.md (router)
- packages/{package}/commands/{command-name}/{variant1}.md
- packages/{package}/commands/{command-name}/{variant2}.md

Usage:
/{command-name}             # Routes to appropriate variant
/{command-name}:{variant1}  # {variant1 description}
/{command-name}:{variant2}  # {variant2 description}

Next Steps:
1. Run epost-kit init --fresh to regenerate
2. Test: /{command-name}
3. Customize variant implementations
```

## Validation

Before completing:
- [ ] All files have valid YAML frontmatter with `agent:` field
- [ ] Router file references correct variant paths
- [ ] All variant files created
- [ ] Files in `packages/` (source of truth), not `.claude/`
- [ ] Registered in package.yaml
- [ ] No file overwrites without confirmation

## Rules

- All commands MUST have `agent:` field in frontmatter
- Source of truth is `packages/`, NOT `.claude/`
- Follow `{namespace}/{action}` naming convention for router
- Variants go in `{action}/{variant}` directory
