## Accessibility (WCAG 2.1 AA)

**Scope**: Web (ARIA, keyboard) · iOS (VoiceOver, UIKit/SwiftUI) · Android (TalkBack, Compose)

### Agent Routing

| Task | Agent |
|------|-------|
| Audit / fix / guide accessibility | `@epost-a11y-specialist` |
| Implement accessible component | `@epost-fullstack-developer` |
| Review for a11y compliance | `@epost-code-reviewer` |

### Conventions

- POUR framework: Perceivable, Operable, Understandable, Robust
- Severity: Critical (blocks use) → High → Medium → Low
- Always test: keyboard navigation, screen reader flow, contrast ratio (4.5:1 AA)
- Platform-specific: VoiceOver (iOS), TalkBack (Android), NVDA/JAWS/VoiceOver (Web)

### Starter Prompts

- `@epost-a11y-specialist Audit accessibility in [component/screen].`
- `@epost-a11y-specialist Fix VoiceOver issues in [iOS screen].`
- `@epost-a11y-specialist Fix TalkBack issues in [Android screen].`
- `@epost-a11y-specialist Fix ARIA/keyboard issues in [web component].`
- `@epost-a11y-specialist Check WCAG 2.1 AA compliance for [feature].`
