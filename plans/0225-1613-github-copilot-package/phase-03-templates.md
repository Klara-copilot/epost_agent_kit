# Phase 03: Create Conversion Templates

**Priority**: Medium
**Status**: Pending
**Estimated Effort**: 1 hour

## Overview

Create reusable templates for converting Claude Code components to GitHub Copilot format. These templates guide future conversions.

## Templates to Create

### 1. Command to Prompt Template

File: `packages/github-copilot/prompts/command-template.md`

```markdown
# Command to Prompt Conversion Template

## Source Format (Claude Code)
```markdown
---
name: command-name
description: Command description
arguments: [arg1, arg2]
---

# Command Title
[command implementation]
```

## Target Format (GitHub Copilot Prompt)
```markdown
---
mode: 'agent'
tools: ['codebase', 'githubRepo']
description: 'Command description'
---

# command-name.prompt.md

[command implementation - adapted]

## Variables

- `${input:arg1:Description}` - First argument
- `${input:arg2:Description}` - Second argument

## Usage

This prompt helps with: [description of what the prompt does]
```

## Conversion Rules
1. **Add YAML frontmatter** with:
   - `mode`: 'ask', 'edit', or 'agent' (most commands → 'agent')
   - `tools`: Array of available tools
   - `description`: From command description
2. Convert arguments to `${input:variableName:placeholder}` syntax
3. Remove Claude-specific slash command syntax
4. Keep command logic as prompt instructions

## Mode Selection Guide
| Command Type | Mode |
|--------------|------|
| Query/Explain | `ask` |
| Edit/Transform | `edit` |
| Complex workflow | `agent` |
```

### 2. Skill to Instruction Template

File: `packages/github-copilot/skills/skill-template.md`

```markdown
# Skill to Instruction Conversion Template

## Source Format (Claude Code)
```markdown
---
name: skill-name
description: Skill description
triggers: [pattern1, pattern2]
---

# Skill Name
[skill content]
```

## Target Format (GitHub Copilot)
```markdown
---
applyTo: "**/*.{relevant,extensions}"
description: "Skill description"
---

# skill-name.instructions.md

[skill content - preserved]

## Activation
This instruction applies when working with [file types/domains].
```

## Conversion Rules
1. **Keep YAML frontmatter** with:
   - `applyTo`: Glob pattern based on skill's domain
   - `description`: From skill description
2. Convert `triggers` to `applyTo` glob patterns
3. Keep skill content intact
4. Skills become path-specific instructions, not merged

## applyTo Pattern Mapping
| Skill Domain | applyTo Pattern |
|--------------|-----------------|
| iOS development | `"**/*.swift"` |
| Web frontend | `"**/*.{ts,tsx,js,jsx,css}"` |
| Testing | `"**/*.test.{ts,tsx,js,swift,kt}"` |
| Documentation | `"docs/**/*.md"` |
```

### 3. CLAUDE.md to copilot-instructions.md Template

File: `packages/github-copilot/instructions/claude-md-template.md`

```markdown
# CLAUDE.md to copilot-instructions.md Template

## Source Format (Claude Code)
`CLAUDE.md` - Project-wide instructions

## Target Format (GitHub Copilot)
`.github/copilot-instructions.md` - Repository-wide instructions (PLAIN MARKDOWN, no frontmatter)

## Conversion Rules

### Keep
- Project overview
- Tech stack description
- Code standards
- Development guidelines

### Remove
- Claude-specific hooks (SessionStart, PreToolUse, etc.)
- Skill activation directives (`**IMPORTANT:**` skill triggers)
- Agent routing instructions specific to Claude

### Adapt
- File paths: `.claude/` → `.github/`
- Command syntax: `/command` → natural language descriptions
- Agent references → instruction file references

## Example

### Before (CLAUDE.md)
```markdown
## Commands
- `/web:cook` — Implement web features
- `/ios:test` — Run iOS tests

## Hooks
SessionStart hook...
```

### After (.github/copilot-instructions.md)
```markdown
## Project Commands

This project has custom prompts available:
- Web feature implementation — Ask about "implement web feature"
- iOS testing — Ask about "run iOS tests"

## Development Guidelines
[Guidelines preserved without Claude-specific content]
```

## Important Note

`.github/copilot-instructions.md` is the ONLY file that uses plain Markdown without frontmatter.
All other instruction files (`.github/instructions/*.instructions.md`) MUST have YAML frontmatter.
```

## Implementation Steps

### Step 1: Create prompts/ directory structure

```bash
mkdir -p packages/github-copilot/prompts
```

### Step 2: Create command template

Create `packages/github-copilot/prompts/command-template.md` with conversion rules.

### Step 3: Create skill template

Create `packages/github-copilot/skills/skill-template.md` with conversion rules.

### Step 4: Create CLAUDE.md template

Create `packages/github-copilot/instructions/claude-md-template.md` with conversion rules.

## Success Criteria

- [ ] `prompts/command-template.md` created
- [ ] `skills/skill-template.md` created
- [ ] `instructions/claude-md-template.md` created
- [ ] All templates have clear conversion rules
- [ ] Templates reference both source and target formats

## Files to Create

| File | Action |
|------|--------|
| `packages/github-copilot/prompts/command-template.md` | Create |
| `packages/github-copilot/skills/skill-template.md` | Create |
| `packages/github-copilot/instructions/claude-md-template.md` | Create |

## Future Work

- CLI integration for automatic conversion
- Batch conversion scripts
- Validation tools for converted files
