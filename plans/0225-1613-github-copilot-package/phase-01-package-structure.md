# Phase 01: Create Package Structure

**Priority**: High
**Status**: Pending
**Estimated Effort**: 30 min

## Overview

Create the `packages/github-copilot/` directory structure following established patterns from other platform packages.

## Target Structure

```
packages/github-copilot/
├── package.yaml              # Package metadata
├── COPILOT.snippet.md        # Copilot-specific snippet (like CLAUDE.snippet.md)
├── agents/                   # Converted agent instructions
│   └── .gitkeep
├── instructions/             # Instruction templates
│   └── agent-template.md     # Conversion template for agents
├── prompts/                  # Command → prompt templates
│   └── command-template.md   # Conversion template for commands
└── skills/                   # Skill → instruction templates
    └── skill-template.md     # Conversion template for skills
```

## Implementation Steps

### Step 1: Create Directory Structure

```bash
mkdir -p packages/github-copilot/{agents,instructions,prompts,skills}
touch packages/github-copilot/agents/.gitkeep
```

### Step 2: Create package.yaml

```yaml
name: github-copilot
version: "1.0.0"
description: "GitHub Copilot format support — instruction files, prompts, and conversion templates"
layer: 1
platforms: [github-copilot]

dependencies:
  - core

provides:
  templates:
    - agent-to-instruction
    - command-to-prompt
    - skill-to-instruction

files:
  instructions/: templates/instructions/
  prompts/: templates/prompts/
  skills/: templates/skills/

settings_strategy: none
copilot_snippet: COPILOT.snippet.md
```

### Step 3: Create COPILOT.snippet.md

```markdown
## GitHub Copilot Integration

This project uses ePost Agent Kit for GitHub Copilot support.

### Available Instructions
- `epost-a11y-specialist` — Multi-platform accessibility (iOS, Android, Web)

### Usage
GitHub Copilot will automatically use these instructions based on file context.
```

### Step 4: Create Agent Conversion Template

Create `instructions/agent-template.md`:

```markdown
# Agent to Instruction Conversion Template

## Source Format (Claude Code)
```markdown
---
name: agent-name
description: Agent description
tools: [Read, Write, Edit]
model: sonnet
skills: [skill1, skill2]
---

# Agent Name
[content]
```

## Target Format (GitHub Copilot)
```markdown
---
applyTo: "**/*.{related,extensions}"
description: "Agent description"
---

# Agent Name

[content - preserved from source]

## Usage
This instruction applies when working with: [file patterns]
```

## Conversion Rules
1. **Keep YAML frontmatter** but transform fields:
   - `name` → filename: `{name}.instructions.md`
   - `description` → keep in frontmatter
   - Add `applyTo` with appropriate glob pattern based on agent's domain
   - Remove Claude-specific: `model`, `color`, `memory`, `permissionMode`
2. Convert `skills` to inline references or separate instruction files
3. Map `tools` to Copilot's `tools` property if creating a prompt file
4. Keep all Markdown content

## applyTo Pattern Examples
| Agent Type | applyTo Pattern |
|------------|-----------------|
| iOS/Swift | `"**/*.swift"` |
| Web/React | `"**/*.{ts,tsx,js,jsx}"` |
| Android/Kotlin | `"**/*.kt"` |
| Backend/Java | `"**/*.java"` |
| Accessibility | `"**/*.{swift,kt,tsx,jsx}"` |
```

## Success Criteria

- [ ] Directory structure created
- [ ] `package.yaml` valid and complete
- [ ] `COPILOT.snippet.md` created
- [ ] Agent template created

## Files to Create

| File | Action |
|------|--------|
| `packages/github-copilot/package.yaml` | Create |
| `packages/github-copilot/COPILOT.snippet.md` | Create |
| `packages/github-copilot/instructions/agent-template.md` | Create |
| `packages/github-copilot/agents/.gitkeep` | Create |

## Next Phase

→ [Phase 02: Convert epost-a11y-specialist](phase-02-a11y-specialist.md)
