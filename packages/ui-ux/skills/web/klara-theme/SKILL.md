---
name: klara-theme
description: klara-theme UI component library patterns, Figma-to-code pipeline, and component documentation workflows. Use when working with klara-theme components, planning features, implementing components, auditing UI, or documenting components.
user-invocable: false
---

# klara-theme Skill

Domain knowledge for the klara-theme UI component library. Provides patterns for the complete Figma-to-code pipeline: planning, implementation, auditing, fixing, and documentation.

## Pipeline Overview

```
plan-feature → implement-component → audit-ui → fix-findings → document-component
```

Each stage has a dedicated aspect file with detailed steps, inputs, outputs, and success criteria.

## Aspect Files

| Aspect | Purpose | Key Outputs |
|--------|---------|-------------|
| `plan-feature.md` | Plan a new UI feature from Figma designs | 6 JSON plan artifacts |
| `implement-component.md` | Implement component from plan artifacts | Component code + Storybook stories |
| `audit-ui.md` | Audit implementation against plan and Figma | `audit-report.json` |
| `fix-findings.md` | Resolve audit findings | `PATCH.diff` or `fix-notes.json` |
| `document-component.md` | Document component with Figma data | `.figma.json` + `.mapping.json` |

## Quick Reference

### Input/Output Directory

All per-feature artifacts live in:
```
libs/klara-theme/.ai-agents/ui/<feature>/
```

### Key Resources

- **Component patterns**: `libs/klara-theme/CLAUDE.md`
- **Figma extraction**: `web/figma-integration` skill
- **Token system**: `libs/klara-theme/_tokens/` (3-layer: primitives, themes, components)
- **Schemas**: `libs/klara-theme/figma-data/schema/`
- **Manifest**: `libs/klara-theme/figma-data/manifest.json`

### Build Commands

- Lint: `nx lint klara-theme`
- Test: `nx test klara-theme`
- Storybook: `npm run storybook-theme-build`

## Conventions

- **Reuse-first**: Always check existing components before creating new ones
- **Token-only**: No hardcoded values; use design tokens from the 3-layer system
- **Storybook coverage**: Default, Sizes, Variants, States stories for every component
- **forwardRef pattern**: All components use `forwardRef` with `displayName`
- **TypeScript strict mode**: Required for all component code

## Related Documents

- `libs/klara-theme/CLAUDE.md` — Component patterns, tokens, conventions
- `.claude/skills/web/figma-integration/SKILL.md` — Figma MCP integration
