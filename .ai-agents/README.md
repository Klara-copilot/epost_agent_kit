# AI Agents Knowledge Base

## Purpose

Universal knowledge base for AI agents (Cursor, GitHub Copilot, etc.) organized by topic. This directory serves as the primary source of truth for rules, prompts, and analysis that agents reference.

## Structure

```
.ai-agents/
├── README.md                      # This file
├── QUICKSTART.md                  # Quick start guide
├── MIGRATION.md                   # Migration history
├── SUMMARY.md                     # Summary
├── rules/                         # Compliance rules
│   ├── accessibility/             # Accessibility-specific rules
│   │   ├── a11y-core.md
│   │   ├── a11y-buttons.md
│   │   ├── a11y-forms.md
│   │   ├── a11y-headings.md
│   │   ├── a11y-focus.md
│   │   ├── a11y-images.md
│   │   ├── a11y-colors-contrast.md
│   │   └── a11y-testing.md
│   ├── core-user-rules.md         # General: User interaction patterns
│   ├── decision-boundaries.md     # General: When to apply rules
│   ├── environment-safety.md      # General: Safe coding practices
│   ├── context7-usage.md          # General: External documentation
│   └── documentation-behavior.md  # General: Documentation standards
├── prompts/                       # Reusable prompt templates
│   └── accessibility/             # Accessibility prompts
│       ├── README.md
│       ├── button-accessibility-prompt.txt
│       ├── heading-accessibility-prompt.txt
│       ├── modal-dialog-accessibility-prompt.txt
│       ├── audit-git-diff-prompt.txt
│       ├── fix-specific-finding-prompt.txt
│       ├── fix-batch-top-n-prompt.txt
│       └── evolve-refine-rules-prompt.txt
└── analysis/                      # Historical audit findings
    └── accessibility/             # Accessibility analysis
        └── audit-rule-gaps-analysis.md
```

## Integration

This directory is the primary source of truth for all AI agents. Agents automatically read from this directory when configured.

## Usage

Agents automatically read from this directory when configured. Use agent prefixes:
- `@accessibilities-architect` - Real-time accessibility guidance
- `@accessibilities-auditor` - Batch accessibility auditing
- `@accessibilities-fixer` - Surgical accessibility fixes

## Maintenance

When updating rules, prompts, or analysis:
1. Update files in `.ai-agents/` (primary location)
2. Agents will automatically pick up changes
