---
name: android/accessibility
description: WCAG 2.1 AA compliance rules for Android — TalkBack, contentDescription, Jetpack Compose semantics patterns
user-invocable: false
---

# Android Accessibility Skill

## Purpose

Comprehensive WCAG 2.1 AA accessibility rules for Android development. Covers TalkBack support, Jetpack Compose semantics, contentDescription, focus management, color contrast, and testing patterns.

## Aspect Files

| File | Coverage |
|------|----------|
| `references/a11y-core.md` | Core principles: perceivable, operable, understandable, robust. Enabling accessibility, semantics block, TalkBack detection |
| `references/a11y-buttons.md` | Button accessibility: contentDescription, Role.Button, toggle state, icon buttons, custom clickables |
| `references/a11y-forms.md` | Form input accessibility: labels, validation, error states, keyboard options, OutlinedTextField |
| `references/a11y-headings.md` | Heading structure: `semantics { heading() }`, heading hierarchy, TalkBack rotor navigation |
| `references/a11y-focus.md` | Focus management: FocusRequester, LaunchedEffect, liveRegion, paneTitle on dialogs |
| `references/a11y-images.md` | Image accessibility: decorative vs informative, clearAndSetSemantics {}, complex images |
| `references/a11y-colors-contrast.md` | Visual accessibility: WCAG contrast ratios (4.5:1 normal, 3:1 large/UI), Material 3 semantic tokens, dark theme |
| `references/a11y-testing.md` | Testing: composeTestRule, onNodeWithContentDescription, isHeading(), hasRole(), TalkBack manual testing |
| `references/a11y-mode-guidance.md` | Guidance mode: real-time advice, Kotlin/Compose code examples, response style rules |
| `references/a11y-mode-audit.md` | Audit mode: batch analysis, JSON output schema, Android violation types, block-PR logic |
| `references/a11y-mode-fix.md` | Fix mode: surgical fixes, Android fix templates, known-findings input, status codes |

## Known Findings

Projects using this skill can maintain a `epost-known-findings-android.json` file (see `known-findings-schema.json` for format) tracking discovered accessibility violations. The `epost-a11y-specialist` uses this file in fix mode to apply surgical fixes.

## Agents Using This Skill

- `epost-a11y-specialist` — Unified accessibility agent (guidance, audit, and fix modes)

## Related Documents

- `android/development/references/compose-best-practices.md` — Compose development patterns
- `.agent-knowledge/epost-known-findings-android.json` — Project-specific known violations (if exists)
