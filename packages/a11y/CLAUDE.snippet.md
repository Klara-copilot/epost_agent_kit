## Accessibility (WCAG 2.1 AA)

### Agent
- `epost-a11y-specialist` — Multi-platform accessibility orchestrator (iOS, Android, Web)

### Commands
- `/audit:a11y` — Audit staged changes for violations (auto-detects platform)
- `/audit:a11y-close <id>` — Mark a finding as resolved
- `/fix:a11y <id>` — Fix a specific finding by ID
- `/fix:a11y-batch <n>` — Batch-fix top N priority findings
- `/review:a11y` — Review accessibility compliance by focus area

### Skills
- `a11y/core` — Cross-platform WCAG 2.1 AA foundation (POUR, scoring)
- `ios/a11y` — iOS (VoiceOver, UIKit-primary, SwiftUI) *(extends ios/\*)*
- `android/a11y` — Android (Compose, Views/XML, TalkBack) *(extends android/\*)*
- `web/a11y` — Web (ARIA, keyboard, screen readers) *(extends web/\*)*
