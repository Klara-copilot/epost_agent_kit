---
name: ios-code-review-rules
description: "iOS-specific code review rules — SWIFT, UIKIT categories"
user-invocable: false
disable-model-invocation: true
---

# iOS Code Review Rules

Swift 6 / SwiftUI+UIKit iOS code review rules. Loaded by code-review skill when reviewing `.swift` files.

**Scope**: Swift 6 / SwiftUI+UIKit iOS apps — optionals, closures, threading, accessibility, design tokens.

---

## SWIFT: Language Safety

**Scope**: Swift 6 language rules — optionals, closures, concurrency.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| SWIFT-001 | No force unwrap without guard — use `guard let`, `if let`, or nil coalescing | high | `guard let value = optional else { return }` or `optional ?? default` | `optional!` used without prior nil check |
| SWIFT-002 | No retain cycle in `@escaping` closure — use `[weak self]` or `[unowned self]` | high | `{ [weak self] in guard let self else { return } … }` | `self.property` captured strongly in `@escaping` closure stored by another object |
| SWIFT-003 | UI updates on main actor — UIKit mutations dispatched via `DispatchQueue.main` or `@MainActor` | critical | `DispatchQueue.main.async { … }` or function marked `@MainActor` | UIKit property set directly from background thread or non-isolated async context |

---

## UIKIT: UIKit / SwiftUI Conventions

**Scope**: UIKit views, accessibility, design token usage, async functions in view layer.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| UIKIT-001 | All interactive elements have `accessibilityLabel` | medium | `button.accessibilityLabel = "Submit order"` or `.accessibilityLabel(…)` in SwiftUI | `UIButton` or `Image` has no label and is not explicitly hidden from accessibility tree |
| UIKIT-002 | No hardcoded colors or fonts — use design tokens from theme | medium | `UIColor.epostPrimary` or `UIFont.epostBody` from theme library | `UIColor(red:green:blue:alpha:)` or `UIFont.systemFont(ofSize:)` hardcoded inline |
| UIKIT-003 | Async functions that touch UIKit are marked `@MainActor` | high | `@MainActor func loadView() async { … }` | `async func update()` calls UIKit without `@MainActor` or `DispatchQueue.main` |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| SWIFT-001–003 | Yes | — |
| UIKIT-001–003 | — | Yes |

**Lightweight**: Run on all Swift file reviews. **Escalated**: Activate on critical findings, large PRs (10+ files), or explicit `--deep` flag.

## Extending

Add rules following the pattern `{CATEGORY}-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
