## Accessibility (WCAG 2.1 AA)

**Scope**: Web (ARIA, keyboard) · iOS (VoiceOver, UIKit/SwiftUI) · Android (TalkBack, Compose)

This rule auto-applies when editing component or screen files across platforms.

### Agent Routing

| Intent | Chat command |
|--------|-------------|
| Audit / fix / guide accessibility | `@epost-a11y-specialist [issue]` |
| Implement accessible component | `@epost-fullstack-developer [task]` |
| Review for a11y compliance | `@epost-code-reviewer [focus: accessibility]` |

### Conventions

- POUR framework: Perceivable, Operable, Understandable, Robust
- Severity: Critical (blocks use) → High → Medium → Low
- Always check: keyboard nav, screen reader flow, contrast ratio (4.5:1 AA min)
- Platform-specific: VoiceOver (iOS), TalkBack (Android), NVDA/JAWS/VoiceOver (Web)

### Context Rules

- `.cursor/rules/a11y.mdc` contains cross-platform accessibility conventions
- Cursor's Task tool may not work — delegate via chat, not programmatic dispatch
