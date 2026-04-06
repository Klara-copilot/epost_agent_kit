## iOS Platform

**Stack**: Swift 6 · SwiftUI + UIKit · iOS 18+ · XCTest / XCUITest · Xcode

### Agent Routing

| Task | Agent |
|------|-------|
| Add screen / implement feature / wire API | `@epost-fullstack-developer` |
| Fix crash / debug error / broken behavior | `@epost-debugger` |
| Plan new flow / design approach | `@epost-planner` |
| Review Swift changes before commit | `@epost-code-reviewer` |
| Add tests / validate XCTest coverage | `@epost-tester` |
| Accessibility / VoiceOver / WCAG | `@epost-a11y-specialist` |
| Design system / SwiftUI component | `@epost-muji` |

### Conventions

- Swift 6 strict concurrency — no unsafe Sendable workarounds
- SwiftUI-first; UIKit only where SwiftUI has no equivalent
- No Force unwrap (`!`) — use `guard let` or `if let`
- Prefer `@MainActor` for UI updates
- Minimum target: iOS 18

### Starter Prompts

- `@epost-fullstack-developer Implement [feature] for the iOS platform.`
- `@epost-debugger Fix this Swift/Xcode crash: [paste error]`
- `@epost-code-reviewer Review the staged .swift changes.`
- `@epost-tester Add XCTest unit tests for [component].`
- `@epost-a11y-specialist Audit VoiceOver support in [screen].`
