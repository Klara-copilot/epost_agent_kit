---
name: ui-guidance
description: "DEPRECATED — Use ui-lib-dev skill instead. Content merged into ui-lib-dev/references/guidance.md."
user-invocable: false
context: fork
agent: epost-muji

metadata:
  agent-affinity: [epost-muji, epost-fullstack-developer, epost-code-reviewer]
  keywords: [ui, guidance, integration, design-code, conflict, review, consulting]
  platforms: [all]
  triggers: ["how to integrate", "design conflict", "ui review", "component guidance", "token usage"]
  connections:
    requires: [design-tokens]
    enhances: [code-review, audit]
---

# UI Guidance — Integration Consulting & Conflict Resolution

## Purpose

Cross-platform guidance for teams integrating design system components. Resolves conflicts between design intent and code constraints.

## When Active

- Team asks how to integrate a UI component
- Design-code mismatch found during review
- Token usage questions (which token for which purpose)
- Component customization beyond standard variants
- Platform-specific implementation differences
- Responsive behavior questions

## Guidance Workflow

### 1. Understand Context
- What platform? (web/iOS/Android)
- What component or pattern?
- What's the design spec (Figma link or screenshot)?
- What's the current implementation?

### 2. Diagnose
- Compare implementation against design tokens
- Check component API usage
- Identify token misuse (hardcoded values, wrong semantic level)
- Flag accessibility gaps

### 3. Resolve Conflicts

Common design-code conflicts:

| Conflict | Resolution |
|----------|-----------|
| Design uses non-existent token | Map to closest semantic token, flag for design team |
| Design spacing doesn't match scale | Use nearest scale value, document deviation |
| Component doesn't support variant | Extend via composition, not fork |
| Platform limitation prevents exact match | Document acceptable deviation, prioritize intent |
| Dark mode breaks contrast | Use semantic tokens (auto-adjusts), validate contrast ratio |

### 4. Provide Platform-Specific Guidance

Load platform ui-lib skill via skill-discovery:
- Web: `web-ui-lib` (React/klara-theme patterns)
- iOS: `ios-ui-lib` (SwiftUI/ios_theme_ui patterns)
- Android: `android-ui-lib` (Compose/android_theme_ui patterns)

### 5. Review Checklist

When reviewing UI code for other teams:

- [ ] Uses design tokens (no hardcoded colors/spacing/typography)
- [ ] Correct semantic level (not using primitives directly)
- [ ] Component from library (not custom recreation)
- [ ] Responsive behavior matches design
- [ ] Dark mode supported via semantic tokens
- [ ] Accessibility: contrast, touch targets, labels
- [ ] Platform conventions followed (HIG/Material/Web standards)

## Integration with Audit

When invoked via `/audit --ui`, follow the audit skill's UI mode:
1. Scan changed files for UI components
2. Apply review checklist above
3. Produce findings with severity + fix suggestions
4. Reference design-tokens skill for token mapping
