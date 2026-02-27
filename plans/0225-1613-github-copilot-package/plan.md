# GitHub Copilot Package Implementation Plan

**Created**: 2026-02-25 16:13
**Completed**: 2026-02-25 17:06
**Status**: Complete
**Priority**: High

## Overview

Create `packages/github-copilot/` to support GitHub Copilot as a target IDE. This package will:

1. Define GitHub Copilot-specific package structure
2. Provide conversion templates for Claude Code → GitHub Copilot format
3. Generate `epost-a11y-specialist` instruction file for GitHub Copilot

## Key Findings

### Format Conversion Matrix

| Claude Code                 | GitHub Copilot                           |
| --------------------------- | ---------------------------------------- |
| `.claude/agents/*.md`       | `.github/instructions/*.instructions.md` |
| `CLAUDE.md`                 | `.github/copilot-instructions.md`        |
| `.claude/commands/*.md`     | `.github/prompts/*.prompt.md`            |
| `.claude/skills/*/SKILL.md` | Merged into instructions                 |

### Format Specifications (from Official GitHub Docs)

#### Instructions Files (`.github/instructions/*.instructions.md`)
```markdown
---
applyTo: "**/*.ts,**/*.tsx"
description: "TypeScript guidelines"
---
# Instructions content...
```

#### Prompt Files (`.github/prompts/*.prompt.md`)
```markdown
---
mode: 'agent'
tools: ['githubRepo', 'codebase']
description: 'Brief description'
---
# Prompt content with ${variable} syntax...
```

#### Global Instructions (`.github/copilot-instructions.md`)
- Plain Markdown (no frontmatter)
- Applied to all chat requests automatically

### Key Differences from Claude Code

1. **YAML frontmatter IS used** — Both `.instructions.md` and `.prompt.md` use it
2. **`applyTo` glob patterns** — Target specific file types/folders
3. **`mode` property in prompts** — `ask`, `edit`, or `agent` modes
4. **`tools` property in prompts** — Specify available tools
5. **Variable syntax** — `${variableName}` for dynamic inputs

## Phases

| Phase                                     | Description                   | Status   |
| ----------------------------------------- | ----------------------------- | -------- |
| [Phase 01](phase-01-package-structure.md) | Create package structure      | Complete |
| [Phase 02](phase-02-a11y-specialist.md)   | Convert epost-a11y-specialist | Complete |
| [Phase 03](phase-03-templates.md)         | Create conversion templates   | Complete |

## Success Criteria

- [x] `packages/github-copilot/` created with correct structure
- [x] `package.yaml` defines all metadata
- [x] `epost-a11y-specialist.instructions.md` generated
- [x] Conversion template for agent → instruction exists
- [ ] CLI can install to GitHub Copilot target (future work)

## Files Created

- `packages/github-copilot/package.yaml` — Package metadata
- `packages/github-copilot/COPILOT.snippet.md` — VS Code settings snippet
- `packages/github-copilot/agents/epost-a11y-specialist.instructions.md` — Converted agent
- `packages/github-copilot/instructions/agent-template.md` — Agent conversion template
- `packages/github-copilot/instructions/claude-md-template.md` — CLAUDE.md conversion template
- `packages/github-copilot/prompts/command-template.md` — Command/shortcut template
- `packages/github-copilot/skills/skill-template.md` — Skill conversion template

## Related Files

- Source: `/packages/core/agents/epost-a11y-specialist.md`
- Reference: `/docs/system-architecture.md` (conversion matrix)
