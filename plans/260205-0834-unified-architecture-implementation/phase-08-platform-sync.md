# Phase 8: Platform Sync

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 7](phase-07-cli-build.md)
- Research: [Cross-Platform Formats](research/researcher-01-cross-platform-formats.md)

## Overview
- **Priority**: P2
- **Status**: pending
- **Effort**: 4h
- **Description**: Use the CLI to generate and deploy configuration files for Cursor and Copilot platforms. Verify generated files are valid for each platform. Optionally install external skills (skill-creator, find-skills).

## Key Insights
- Claude Code is the source of truth; other platforms are generated outputs
- Cursor requires: `AGENTS.md`, `.cursor/rules/*.mdc`, `.cursor/commands/*.md`
- Copilot requires: `.github/agents/*.agent.md`, `.github/instructions/*.instructions.md`, `.github/prompts/*.prompt.md`
- AGENTS.md is a cross-tool standard (Linux Foundation) supported by Cursor, Codex, Amp, Jules
- Copilot `handoffs` field only works in VS Code, not github.com coding agent

## Requirements

### Functional

**Generate Cursor output**:
- `AGENTS.md` - Combined agent definitions (hierarchical sections)
- `.cursor/rules/*.mdc` - Rules with Cursor-specific frontmatter
- `.cursor/commands/*.md` - Commands (from skills + commands)

**Generate Copilot output**:
- `.github/agents/*.agent.md` - Agent definitions with Copilot frontmatter
- `.github/instructions/*.instructions.md` - Instructions with `applyTo`
- `.github/prompts/*.prompt.md` - Prompt files from skills + commands
- `.github/copilot-instructions.md` - Global instructions

**Install external skills**:
- `skill-creator` from anthropics/skills
- `find-skills` from vercel-labs/skills

### Non-Functional
- Generated files committed to repo (not ephemeral)
- Each platform's output validates independently
- No manual edits to generated files (re-generate via CLI)

## Architecture

```
Source of Truth:                Generated Outputs:
.claude/agents/                 AGENTS.md
.claude/skills/        --CLI--> .cursor/rules/*.mdc
.claude/commands/               .cursor/commands/*.md
.claude/rules/                  .github/agents/*.agent.md
CLAUDE.md                       .github/instructions/*.instructions.md
                                .github/prompts/*.prompt.md
                                .github/copilot-instructions.md
```

### AGENTS.md Structure
```markdown
# Agents

## Orchestrator
Top-level task router and project manager...

## Architect
Design and planning orchestrator...

## Web

### Web Implementer
Next.js, React, TypeScript specialist...

### Web Tester
Vitest, Playwright specialist...
...
```

### Cursor Rule Format (.mdc)
```yaml
---
description: Primary workflow rules
alwaysApply: true
---
# Primary Workflow
[converted content from primary-workflow.md]
```

### Copilot Agent Format
```yaml
---
name: Orchestrator
description: Top-level task router and project manager
tools: ['read', 'edit/editFiles', 'search/codebase']
model: Claude Sonnet 4
handoffs:
  - label: "Implement"
    agent: implementer
    prompt: "Implement the plan"
    send: false
---
[agent prompt body]
```

## Related Code Files

### Create
- `AGENTS.md` (generated)
- `.cursor/rules/*.mdc` (generated, ~4 files)
- `.cursor/commands/*.md` (generated, ~30 files)
- `.github/agents/*.agent.md` (generated, ~12 files)
- `.github/instructions/*.instructions.md` (generated, ~4 files)
- `.github/prompts/*.prompt.md` (generated, ~30 files)
- `.github/copilot-instructions.md` (generated)
- `.claude/skills/skill-creator/` (external)
- `.claude/skills/find-skills/` (external)

### Modify
- None (all generated fresh)

## Implementation Steps

### Step 1: Generate Cursor output
```bash
npx epost-kit install --target cursor
```
This should create:
- `AGENTS.md` at project root
- `.cursor/rules/primary-workflow.mdc`
- `.cursor/rules/development-rules.mdc`
- `.cursor/rules/orchestration-protocol.mdc`
- `.cursor/rules/documentation-management.mdc`
- `.cursor/commands/` with converted commands and skills

### Step 2: Validate AGENTS.md
- Verify markdown structure is valid
- Each agent has a section heading with description
- Platform agents nested under platform headings

### Step 3: Validate Cursor rules
- Each `.mdc` file has valid frontmatter: `description`, `alwaysApply` or `globs`
- Content is readable markdown

### Step 4: Generate Copilot output
```bash
npx epost-kit install --target copilot
```
This should create:
- `.github/agents/*.agent.md` for each agent
- `.github/instructions/*.instructions.md` for each rule
- `.github/prompts/*.prompt.md` for each command/skill
- `.github/copilot-instructions.md` from CLAUDE.md

### Step 5: Validate Copilot agents
- Each `.agent.md` has valid frontmatter: `name`, `description`, `tools` (array)
- Tool names mapped correctly (Read -> read, Edit/Write -> edit/editFiles)
- `handoffs` included where delegation exists

### Step 6: Install external skills
```bash
# If skills CLI available:
npx skills add https://github.com/anthropics/skills --skill skill-creator
npx skills add https://github.com/vercel-labs/skills --skill find-skills
# Manual fallback: clone and copy
```
Verify `.claude/skills/skill-creator/SKILL.md` and `.claude/skills/find-skills/SKILL.md` exist

### Step 7: Generate final Claude output
```bash
npx epost-kit install --target claude
```
Verify all Claude Code files remain intact and valid

### Step 8: Create sync documentation
Document in README or docs/:
- How to regenerate platform files: `npx epost-kit install --target all`
- Which files are generated (should not be hand-edited)
- Workflow: edit Claude Code source -> run CLI -> commit all

## Todo List

- [ ] Run `epost-kit install --target cursor`
- [ ] Validate AGENTS.md structure
- [ ] Validate .cursor/rules/*.mdc frontmatter
- [ ] Validate .cursor/commands/*.md
- [ ] Run `epost-kit install --target copilot`
- [ ] Validate .github/agents/*.agent.md frontmatter
- [ ] Validate .github/instructions/*.instructions.md
- [ ] Validate .github/prompts/*.prompt.md
- [ ] Install skill-creator external skill
- [ ] Install find-skills external skill
- [ ] Run `epost-kit install --target claude` (verify)
- [ ] Document sync workflow

## Success Criteria

- `AGENTS.md` exists with all agents grouped hierarchically
- `.cursor/rules/` contains 4 `.mdc` files with valid frontmatter
- `.cursor/commands/` contains converted commands/skills
- `.github/agents/` contains agent files with Copilot-valid frontmatter
- `.github/instructions/` contains rule-to-instruction conversions
- `.github/prompts/` contains skill/command-to-prompt conversions
- External skills installed: `skill-creator`, `find-skills`
- All generated files pass `epost-kit validate`

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| AGENTS.md spec evolves | Generated file becomes invalid | Pin to current spec version; update CLI when spec changes |
| Copilot rejects invalid tool names | Agents don't work in Copilot | Test tool name mapping against Copilot docs |
| External skills repo unavailable | Skills not installed | Manual fallback: copy SKILL.md content directly |
| Generated files accidentally edited | Edits lost on next sync | Add "DO NOT EDIT — generated by epost-kit" header |

## Security Considerations
- Generated files may expose agent prompt content to platform providers
- No secrets should exist in agent prompts (verify before publishing)
- External skill installation from trusted sources only (anthropics, vercel-labs)

## Next Steps
- Phase 9 performs E2E verification across all platforms
