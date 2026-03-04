---
name: checklist-ios
description: iOS (Swift/SwiftUI + EpostThemeUI) audit checklist for UI component code review
last-verified: 2026-03-04
---

# Audit Checklist — iOS (Swift / SwiftUI / EpostThemeUI)

> Staleness warning: Verify token APIs against EpostThemeUI source or ios-rag before citing specific values.

## Tokens

### IOS-TOKEN-001: No hardcoded colors
- **Severity**: critical
- **Bad**: `.foregroundColor(.blue)` or `Color(red: 0.1, green: 0.45, blue: 0.9)`
- **Good**: `theme.colors.primary` via `@Environment(\.epostTheme) var theme`
- **Why**: Hardcoded colors break dark mode, Dynamic Colors, and brand theming. The theme environment provides automatic light/dark/high-contrast variants.

### IOS-TOKEN-002: No hardcoded spacing
- **Severity**: high
- **Bad**: `.padding(13)` or `.padding(.horizontal, 17)`
- **Good**: `.padding(theme.spacing.md)` — use the theme spacing scale (4, 8, 12, 16, 24, 32, 48)
- **Why**: Arbitrary spacing breaks alignment grids. Theme spacing tokens maintain visual rhythm across all screens.

### IOS-TOKEN-003: No hardcoded fonts
- **Severity**: high
- **Bad**: `.font(.system(size: 14, weight: .medium))`
- **Good**: `.font(theme.typography.body)` or the appropriate typography token
- **Why**: Typography tokens support Dynamic Type automatically. Hardcoded sizes don't scale with user accessibility settings.

### IOS-TOKEN-004: Use @Environment for theme access
- **Severity**: critical
- **Bad**: Accessing a global singleton: `AppTheme.shared.colors.primary`
- **Good**: `@Environment(\.epostTheme) var theme` inside View
- **Why**: Environment injection enables preview overrides, testing, and multi-window theming.

---

## Patterns

### IOS-PAT-001: SwiftUI View struct, not class
- **Severity**: critical
- **Bad**: `class MyComponent: UIView` without a SwiftUI wrapper
- **Good**: `struct EpostButton: View { var body: some View { ... } }`
- **Why**: The design system is SwiftUI-first. UIKit wrappers are only acceptable for platform-specific features unavailable in SwiftUI.

### IOS-PAT-002: Epost* naming prefix
- **Severity**: high
- **Bad**: `struct PrimaryButton: View`
- **Good**: `struct EpostButton: View`
- **Why**: Consistent prefix prevents naming collisions and identifies library components clearly.

### IOS-PAT-003: Extract subviews for readability
- **Severity**: medium
- **Bad**: Single `body` with 80+ lines of nested views
- **Good**: Extract into private sub-structs or `@ViewBuilder` computed properties
- **Why**: Deep nesting hurts readability and SwiftUI preview performance.

### IOS-PAT-004: Use ViewModifier for reusable styling
- **Severity**: medium
- **Bad**: Copy-pasting `.foregroundColor(theme.colors.primary).font(theme.typography.body)` everywhere
- **Good**: `struct PrimaryTextStyle: ViewModifier { ... }` + `.modifier(PrimaryTextStyle())`
- **Why**: ViewModifiers are composable and testable. They make refactoring a one-place change.

### IOS-PAT-005: No force unwraps
- **Severity**: high
- **Bad**: `let url = URL(string: urlString)!`
- **Good**: `guard let url = URL(string: urlString) else { return }` or optional chaining
- **Why**: Force unwraps crash at runtime on unexpected nil. Use safe unwrapping patterns.

### IOS-PAT-006: No direct modification of shared library files
- **Severity**: critical
- **Check**: No edits inside the EpostThemeUI package source — extend via protocols/modifiers
- **Why**: Shared library modifications break all consumers on next update.

---

## Performance

### IOS-PERF-001: Avoid heavy computation in body
- **Severity**: high
- **Bad**: Sorting/filtering arrays, network calls, or heavy math directly in `body`
- **Good**: Use `let` stored properties, `@State` + `onAppear`, or `task {}` modifier
- **Why**: `body` is called frequently. Expensive work causes jank and battery drain.

### IOS-PERF-002: Use LazyVStack/LazyHStack for lists
- **Severity**: medium
- **Bad**: `VStack { ForEach(hundredsOfItems) { ... } }` — renders all items upfront
- **Good**: `LazyVStack { ForEach(...) }` — renders on demand
- **Why**: Non-lazy stacks with many items cause significant memory and render time.

### IOS-PERF-003: Correct @State / @Binding usage
- **Severity**: high
- **Bad**: `@State` for derived data, `@State` passed as binding when `@Binding` required
- **Good**: `@State` for local source of truth; `@Binding` to receive from parent
- **Why**: Wrong ownership causes stale state, unexpected re-renders, or missed updates.

---

## Security

### IOS-SEC-001: No hardcoded credentials or URLs
- **Severity**: critical
- **Bad**: API keys, tokens, or environment URLs in component source
- **Good**: Inject via configuration, not baked into component code

### IOS-SEC-002: Use SecureField for sensitive input
- **Severity**: high
- **Bad**: `TextField("Password", text: $password)`
- **Good**: `SecureField("Password", text: $password)`
- **Why**: SecureField masks input and prevents content from appearing in screenshots/logs.

### IOS-SEC-003: Validate user input
- **Severity**: high
- **Check**: Text inputs that pass data to APIs should validate/sanitize before use

---

## Accessibility

### IOS-A11Y-001: accessibilityLabel on all non-text interactive elements
- **Severity**: high
- **Bad**: `Image(systemName: "xmark").onTapGesture { dismiss() }` — no label
- **Good**: `.accessibilityLabel("Close")` on the image/button

### IOS-A11Y-002: accessibilityHint for non-obvious actions
- **Severity**: medium
- **Bad**: Button with label "Submit" — no hint about what happens
- **Good**: `.accessibilityHint("Sends your message to the recipient")`

### IOS-A11Y-003: Dynamic Type support
- **Severity**: high
- **Check**: No fixed heights that clip text when font size increases. Use `.fixedSize(horizontal: false, vertical: true)` for text containers.

### IOS-A11Y-004: Minimum touch target 44×44pt
- **Severity**: high
- **Bad**: Icon button rendered at 20×20pt with no padding
- **Good**: `.frame(minWidth: 44, minHeight: 44)` or sufficient padding around the tap area

---

## Testing

### IOS-TEST-001: XCTest unit tests exist
- **Severity**: high
- **Check**: Test target includes tests for component logic/state

### IOS-TEST-002: Preview providers for all variants
- **Severity**: medium
- **Check**: `#Preview` or `PreviewProvider` covering primary, secondary, disabled, loading states
- **Why**: Previews catch visual regressions quickly without running the simulator.

### IOS-TEST-003: No logic in body tested via UI test only
- **Severity**: medium
- **Check**: Business logic extracted from `body` into testable functions or ViewModels
