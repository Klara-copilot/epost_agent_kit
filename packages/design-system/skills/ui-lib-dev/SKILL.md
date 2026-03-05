---
name: ui-lib-dev
description: "Use when building, auditing, or documenting UI library components through the Figma-to-code pipeline across web, iOS, or Android platforms"
user-invocable: false

metadata:
  agent-affinity: [epost-muji, epost-fullstack-developer]
  keywords: [klara-theme, component, components, pipeline, audit, storybook]
  platforms: [all]
  connections:
    requires: [figma]
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
| `references/plan-feature.md` | Plan a new UI feature from Figma designs | 6 JSON plan artifacts |
| `references/implement-component.md` | Implement component from plan artifacts | Component code + Storybook stories |
| `references/audit-ui.md` | Audit implementation against plan and Figma | `audit-report.json` |
| `references/fix-findings.md` | Resolve audit findings | `PATCH.diff` or `fix-notes.json` |
| `references/document-component.md` | Document component with Figma data | `.figma.json` + `.mapping.json` |

## Quick Reference

### Input/Output Directory

All per-feature artifacts live in:
```
libs/klara-theme/.ai-agents/ui/<feature>/
```

### Key Resources

- **Component patterns**: `libs/klara-theme/CLAUDE.md`
- **Figma extraction**: `figma` skill
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
- `figma` skill — Figma MCP integration

## Platform-Specific Pipelines

The pipeline stages apply to all platforms. Platform differences:

| Stage | Web | iOS | Android |
|-------|-----|-----|---------|
| Source | `libs/klara-theme/` | `ios_theme_ui/` | `android_theme_ui/theme/` |
| Components | React + TypeScript | SwiftUI | Jetpack Compose |
| Tokens | CSS custom properties | Swift constants | Kotlin theme objects |
| Stories/Docs | Storybook | Xcode Previews | Compose Previews |
| Artifacts | `.ai-agents/ui/` | `.ai-agents/ui/` | `.ai-agents/ui/` |

Load platform-specific ui-lib skill (web-ui-lib, ios-ui-lib, android-ui-lib) via skill-discovery for component API reference.
