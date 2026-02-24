---
name: ios/accessibility
description: WCAG 2.1 AA compliance rules for iOS — VoiceOver, UIKit, SwiftUI accessibility patterns
user-invocable: false
---

# iOS Accessibility Skill

## Purpose

Comprehensive WCAG 2.1 AA accessibility rules for iOS development. Covers VoiceOver support, UIKit/SwiftUI accessibility attributes, focus management, color contrast, and testing patterns.

## Aspect Files

| File | Coverage |
|------|----------|
| `references/a11y-core.md` | Core principles: perceivable, operable, understandable, robust. Enabling accessibility, properties, VoiceOver detection |
| `references/a11y-buttons.md` | Button accessibility: labels, traits, states, icon buttons, toggle buttons, groups, custom buttons |
| `references/a11y-forms.md` | Form input accessibility: labels, validation, error states, input types, form structure |
| `references/a11y-headings.md` | Heading structure: `.header` trait, heading levels (H1-H6), navigation, dynamic content |
| `references/a11y-focus.md` | Focus management: notifications, indicators, focus order, groups, programmatic focus, screen changes |
| `references/a11y-images.md` | Image accessibility: decorative vs informative, complex images (charts, diagrams, maps), image buttons |
| `references/a11y-colors-contrast.md` | Visual accessibility: WCAG contrast ratios (4.5:1 normal, 3:1 large/UI), color independence, testing |
| `references/a11y-testing.md` | Testing: Xcode Accessibility Inspector, VoiceOver testing, simulator, automated testing, checklists |
| `references/a11y-mode-guidance.md` | Guidance mode: real-time advice, code examples, response style rules |
| `references/a11y-mode-audit.md` | Audit mode: batch analysis, JSON output schema, violation types, block-PR logic |
| `references/a11y-mode-fix.md` | Fix mode: surgical fixes, fix templates, known-findings input, status codes |

## Known Findings

Projects using this skill can maintain a `epost-known-findings.json` file (see `known-findings-schema.json` for format) tracking discovered accessibility violations. The `epost-a11y-specialist` uses this file in fix mode to apply surgical fixes.

## Agents Using This Skill

- `epost-a11y-specialist` — Unified accessibility agent (guidance, audit, and fix modes)

## Related Documents

- `ios/development/references/tester.md` — iOS testing patterns (includes accessibilityIdentifier examples)
- `.agent-knowledge/epost-known-findings.json` — Project-specific known violations (if exists)
