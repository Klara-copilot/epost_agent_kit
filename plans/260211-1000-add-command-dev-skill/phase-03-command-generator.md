---
phase: 3
title: "Command Generator Creation"
status: pending
effort: 2h
dependencies: [phase-02]
---

# Phase 3: Command Generator Creation

## Context Links

- [Splash command pattern](../../.claude/commands/core/plan.md)
- [Plan variants](../../.claude/commands/plan/)
- [Command Development skill](../../packages/meta-kit-design/skills/agents/claude/command-development/)
- [Command structure docs](../../docs/code-standards.md)

## Overview

**Priority**: P1
**Status**: Pending
**Effort**: 2h

Create interactive command that uses Command Development skill to generate splash commands. Implement command selection UI, delegation pattern, skill activation.

## Key Insights

- Splash commands use router → variant delegation
- Router command has minimal logic, delegates to variants
- Variants activate skills and perform actual work
- Command frontmatter uses YAML with description and argument-hint
- Need interactive selection for command name

## Requirements

### Functional Requirements

1. Create router command for command generation
2. Implement interactive command name selection
3. Integrate with Command Development skill
4. Generate splash command structure
5. Create router + variant files
6. Support command customization

### Non-Functional Requirements

- User-friendly interactive prompts
- Clear error messages
- Consistent with existing commands
- Proper skill activation
- Documentation in command file

## Architecture

### Command Structure

```
.claude/commands/
├── meta/
│   └── generate-command.md        # New router command
└── generate-command/
    ├── splash.md                  # Generate splash command
    └── simple.md                  # Generate simple command
```

### Workflow

```
User: /meta:generate-command
  ↓
Router: Ask command type (splash/simple)
  ↓
Variant: /generate-command:splash
  ↓
Activate: command-development skill
  ↓
Interactive: Ask for command name
  ↓
Generate: Router + variants
  ↓
Output: Command files created
```

## Related Code Files

### To Create

- `.claude/commands/meta/generate-command.md` (router)
- `.claude/commands/generate-command/splash.md` (splash generator)
- `.claude/commands/generate-command/simple.md` (simple generator)

### To Reference

- `.claude/commands/core/plan.md` (router pattern)
- `.claude/commands/plan/fast.md` (variant pattern)
- `packages/meta-kit-design/skills/agents/claude/command-development/SKILL.md` (skill)

### To Modify

- `packages/meta-kit-design/package.yaml` (add commands)
- `packages/meta-kit-design/CHANGELOG.md` (document new commands)

## Implementation Steps

### Step 1: Create Router Command

File: `.claude/commands/meta/generate-command.md`

```markdown
---
description: ⚙️ Generate new splash or simple commands interactively
argument-hint: [splash|simple]
---

## Your Mission

Generate new command files using Command Development skill.

## Workflow

1. **Command Type Selection**: Ask user to select:
   - `splash` - Router command with multiple variants
   - `simple` - Single standalone command

2. **Route to Variant**:
   - `splash` → `/generate-command:splash`
   - `simple` → `/generate-command:simple`

## Delegation

Use Skill tool to invoke appropriate variant:
- `/generate-command:splash` - For splash command generation
- `/generate-command:simple` - For simple command generation

## Important Notes

**IMPORTANT:** This router delegates; does not generate commands directly.
**IMPORTANT:** Variants activate command-development skill.
**IMPORTANT:** User selects command type interactively.
```

### Step 2: Create Splash Generator Variant

File: `.claude/commands/generate-command/splash.md`

```markdown
---
description: Generate splash command with router and variants
---

## Your Mission

Generate splash command structure using Command Development skill.

## Workflow

1. **Activate Skill**: Load command-development skill
2. **Interactive Prompt**: Ask user:
   - Command name (e.g., "analyze", "review")
   - Command purpose
   - Number of variants (2-5 recommended)
   - Variant names (e.g., "fast", "deep", "parallel")

3. **Generate Structure**:
   ```
   .claude/commands/
   ├── core/
   │   └── {command-name}.md     # Router
   └── {command-name}/
       ├── {variant-1}.md        # Variant 1
       ├── {variant-2}.md        # Variant 2
       └── {variant-3}.md        # Variant 3
   ```

4. **Router Template**:
   ```markdown
   ---
   description: {command description}
   argument-hint: [{variants}]
   ---

   ## Your Mission

   {command purpose}

   ## Workflow

   Route to variant based on complexity:
   - Simple → /command:variant1
   - Complex → /command:variant2

   ## Delegation

   Use Skill tool to invoke variant.
   ```

5. **Variant Template**:
   ```markdown
   ---
   description: {variant description}
   ---

   ## Your Mission

   {variant-specific task}

   ## Workflow

   1. {step 1}
   2. {step 2}
   3. {step 3}

   ## Skill Activation

   Activate relevant skills for this variant.
   ```

6. **Create Files**: Write router and variant files
7. **Report**: List created files and usage instructions

## Skill Activation

Activate `command-development` skill for guidance.

## Important Notes

**IMPORTANT:** Use command-development skill for templates.
**IMPORTANT:** Validate command names (kebab-case).
**IMPORTANT:** Create both router and variants.
**IMPORTANT:** Update package.yaml if in package.
```

### Step 3: Create Simple Generator Variant

File: `.claude/commands/generate-command/simple.md`

```markdown
---
description: Generate simple standalone command
---

## Your Mission

Generate single command file using Command Development skill.

## Workflow

1. **Activate Skill**: Load command-development skill
2. **Interactive Prompt**: Ask user:
   - Command name
   - Command purpose
   - Arguments (if any)

3. **Generate Structure**:
   ```
   .claude/commands/
   └── {category}/
       └── {command-name}.md
   ```

4. **Template**:
   ```markdown
   ---
   description: {command description}
   argument-hint: {arguments}
   ---

   ## Your Mission

   {command purpose}

   ## Workflow

   1. {step 1}
   2. {step 2}

   ## Skill Activation

   Activate relevant skills.
   ```

5. **Create File**: Write command file
6. **Report**: List created file and usage

## Skill Activation

Activate `command-development` skill for guidance.
```

### Step 4: Add to Package

Update `packages/meta-kit-design/package.yaml`:

```yaml
provides:
  commands:
    - meta/generate-command
    - generate-command/splash
    - generate-command/simple
```

### Step 5: Update CHANGELOG

Add to `packages/meta-kit-design/CHANGELOG.md`:

```markdown
### Added
- Interactive command generator (/meta:generate-command)
- Splash command generator with router + variants
- Simple command generator for standalone commands
```

### Step 6: Create Command Directories

```bash
# Create directories
mkdir -p .claude/commands/meta
mkdir -p .claude/commands/generate-command

# Verify structure
ls -la .claude/commands/meta/
ls -la .claude/commands/generate-command/
```

### Step 7: Test Command Generation

Test workflow:
1. Invoke `/meta:generate-command`
2. Select "splash"
3. Enter command name: "test-cmd"
4. Enter 2 variants: "quick", "thorough"
5. Verify files created:
   - `.claude/commands/core/test-cmd.md`
   - `.claude/commands/test-cmd/quick.md`
   - `.claude/commands/test-cmd/thorough.md`

### Step 8: Validate Generated Commands

```bash
# Check router file
cat .claude/commands/core/test-cmd.md

# Check variants
cat .claude/commands/test-cmd/quick.md
cat .claude/commands/test-cmd/thorough.md

# Verify YAML frontmatter valid
# Test command invocation: /test-cmd
```

## Todo List

- [ ] Create .claude/commands/meta/ directory
- [ ] Create .claude/commands/generate-command/ directory
- [ ] Write router command (generate-command.md)
- [ ] Write splash variant (splash.md)
- [ ] Write simple variant (simple.md)
- [ ] Update package.yaml with commands
- [ ] Update CHANGELOG.md
- [ ] Test router command
- [ ] Test splash generator
- [ ] Test simple generator
- [ ] Validate generated files
- [ ] Verify skill activation
- [ ] Document usage in README

## Success Criteria

- Router command functional
- Splash generator creates router + variants
- Simple generator creates standalone command
- Interactive prompts work correctly
- Command Development skill activated
- Generated files have valid frontmatter
- Commands registered in package.yaml
- All tests pass

## Risk Assessment

### Potential Issues

1. **Skill Activation Failure**: command-development skill may not activate
   - Mitigation: Test skill loading in Phase 2, debug activation

2. **Invalid Command Names**: User may enter non-kebab-case names
   - Mitigation: Validate and convert to kebab-case

3. **File Overwrite**: May overwrite existing commands
   - Mitigation: Check file existence, ask confirmation

4. **Invalid Frontmatter**: Generated YAML may have syntax errors
   - Mitigation: Use validated templates, test generated files

## Security Considerations

- Validate command names (no path traversal)
- Check file write permissions
- Sanitize user input for file names
- Prevent overwriting critical files

## Next Steps

After completion:
1. Test end-to-end command generation
2. Verify all generated commands functional
3. Document usage in meta-kit-design README
4. Proceed to Phase 4: Testing & Documentation

---

**Created by**: Phuong Doan
**Phase**: 3/4
