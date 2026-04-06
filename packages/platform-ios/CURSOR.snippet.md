## iOS Platform

**Stack**: Swift 6 · SwiftUI + UIKit · iOS 18+ · XCTest / XCUITest · Xcode

This rule auto-applies when editing `.swift` files.

### Agent Routing

| Intent | Chat command |
|--------|-------------|
| Build / implement / add screen | `@epost-fullstack-developer [task]` |
| Fix / debug / crash | `@epost-debugger [error]` |
| Plan new flow / design approach | `@epost-planner [topic]` |
| Review staged .swift changes | `@epost-code-reviewer Review staged .swift changes` |
| Accessibility / VoiceOver | `@epost-a11y-specialist [issue]` |
| SwiftUI component / design system | `@epost-muji [component]` |

### Conventions

- Swift 6 strict concurrency — no unsafe Sendable workarounds
- SwiftUI-first; UIKit only where SwiftUI has no equivalent
- No force unwrap (`!`) — use `guard let` or `if let`
- `@MainActor` for UI updates
- Minimum target: iOS 18

### Context Rules

- `.cursor/rules/platform-ios.mdc` auto-applies for `.swift` files
- `.cursor/rules/platform-ios.mdc` contains iOS-specific patterns and conventions
- Cursor's Task tool may not work — delegate via chat, not programmatic dispatch
