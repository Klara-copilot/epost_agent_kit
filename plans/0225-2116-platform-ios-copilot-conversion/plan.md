---
title: "Platform iOS GitHub Copilot Conversion"
description: "Convert all platform-ios components to GitHub Copilot format"
status: pending
priority: P1
effort: 6h
branch: dev
tags: [ios, copilot, conversion, migration]
created: 2025-02-25
---

# Platform iOS GitHub Copilot Conversion

## Overview

Convert ALL components in `packages/platform-ios/` to GitHub Copilot format using templates from `packages/github-copilot/`.

## Scope

| Component Type | Count | Target Directory |
|----------------|-------|------------------|
| Agents | 1 | `.github/instructions/` |
| Skills (main) | 4 | `.github/instructions/` |
| Skills (references) | 17 | Merge into main or separate |
| Commands | 8 | `.github/prompts/` |
| CLAUDE.snippet.md | 1 | `.github/copilot-instructions.md` |

**Total: 31 files to convert**

## Phase Summary

| Phase | Description | Effort | Status |
|-------|-------------|--------|--------|
| [Phase 1](./phase-01-agent-conversion.md) | Agent Conversion | 30m | pending |
| [Phase 2](./phase-02-commands-conversion.md) | Commands Conversion | 1.5h | pending |
| [Phase 3](./phase-03-skills-conversion.md) | Skills Conversion | 3h | pending |
| [Phase 4](./phase-04-snippet-conversion.md) | Snippet Conversion | 15m | pending |
| [Phase 5](./phase-05-validation.md) | Validation & Testing | 45m | pending |

## Conversion Rules Summary

### Agents → .instructions.md
- Add `applyTo: "**/*.swift"` frontmatter
- Remove: `tools`, `model`, `color`, `memory`, `permissionMode`
- Convert `skills` to Related Instructions section
- File: `{name}.instructions.md`

### Commands → .prompt.md
- Add `mode` and `tools` frontmatter
- Convert `arguments` to `${input:...}` variables
- Remove `$ARGUMENTS` syntax
- File: `{name}.prompt.md`

### Skills → .instructions.md
- Add `applyTo` based on domain
- Keep all content intact
- Merge references or create separate files
- File: `{skill-name}.instructions.md`

### CLAUDE.snippet.md → copilot-instructions.md
- Remove command syntax (`/ios:...`)
- Use natural language triggers
- No YAML frontmatter

## Source → Target Mapping

### Agents

| Source | Target |
|--------|--------|
| `agents/epost-ios-developer.md` | `instructions/epost-ios-developer.instructions.md` |

### Commands

| Source | Target | Mode |
|--------|--------|------|
| `commands/cook.md` | `prompts/ios-cook.prompt.md` | agent |
| `commands/test.md` | `prompts/ios-test.prompt.md` | agent |
| `commands/debug.md` | `prompts/ios-debug.prompt.md` | agent |
| `commands/simulator.md` | `prompts/ios-simulator.prompt.md` | agent |
| `commands/a11y/audit.md` | `prompts/ios-a11y-audit.prompt.md` | agent |
| `commands/a11y/fix.md` | `prompts/ios-a11y-fix.prompt.md` | edit |
| `commands/a11y/fix-batch.md` | `prompts/ios-a11y-fix-batch.prompt.md` | edit |
| `commands/a11y/review.md` | `prompts/ios-a11y-review.prompt.md` | agent |

### Skills

| Source | Target | Strategy |
|--------|--------|----------|
| `skills/ios/development/SKILL.md` | `instructions/ios-development.instructions.md` | Merge refs |
| `skills/ios/development/references/*.md` | (merged into main) | Merge |
| `skills/ios/accessibility/SKILL.md` | `instructions/ios-accessibility.instructions.md` | Merge refs |
| `skills/ios/accessibility/references/*.md` | (merged into main) | Merge |
| `skills/ios/ui-lib/SKILL.md` | `instructions/ios-ui-lib.instructions.md` | Merge refs |
| `skills/ios/ui-lib/references/*.md` | (merged into main) | Merge |
| `skills/ios/rag/SKILL.md` | `instructions/ios-rag.instructions.md` | Keep separate |
| `skills/ios/rag/references/*.md` | `instructions/ios-rag-*.instructions.md` | Separate |

### Snippet

| Source | Target |
|--------|--------|
| `CLAUDE.snippet.md` | `copilot-instructions.md` |

## Output Structure

```
.github/
├── copilot-instructions.md              # Global iOS context
├── instructions/
│   ├── epost-ios-developer.instructions.md
│   ├── ios-development.instructions.md
│   ├── ios-accessibility.instructions.md
│   ├── ios-ui-lib.instructions.md
│   └── ios-rag.instructions.md
└── prompts/
    ├── ios-cook.prompt.md
    ├── ios-test.prompt.md
    ├── ios-debug.prompt.md
    ├── ios-simulator.prompt.md
    ├── ios-a11y-audit.prompt.md
    ├── ios-a11y-fix.prompt.md
    ├── ios-a11y-fix-batch.prompt.md
    └── ios-a11y-review.prompt.md
```

## Success Criteria

- [ ] All 31 source files converted
- [ ] All target files follow Copilot format
- [ ] No Claude-specific syntax remains
- [ ] applyTo patterns correctly set for Swift files
- [ ] Command variables use `${input:...}` syntax
- [ ] All content preserved during conversion
- [ ] No YAML frontmatter in copilot-instructions.md

## Risks

| Risk | Mitigation |
|------|------------|
| Large skill files exceed limits | Merge references strategically |
| MCP tool references incompatible | Replace with natural language |
| Triggers not matching Copilot style | Convert to applyTo patterns |

## Dependencies

- Templates from `packages/github-copilot/`
- Existing converted sample: `epost-a11y-specialist.instructions.md`

## Related Documents

- [Agent Template](/packages/github-copilot/instructions/agent-template.md)
- [Command Template](/packages/github-copilot/prompts/command-template.md)
- [Skill Template](/packages/github-copilot/skills/skill-template.md)
- [CLAUDE.md Template](/packages/github-copilot/instructions/claude-md-template.md)
