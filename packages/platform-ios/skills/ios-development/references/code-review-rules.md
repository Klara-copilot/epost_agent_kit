---
name: ios-code-review-rules
description: "iOS-specific code review rules — SWIFT, UIKIT categories"
user-invocable: false
disable-model-invocation: true
---

# iOS Code Review Rules

Swift / SwiftUI+UIKit iOS code review rules. Loaded by code-review skill when reviewing `.swift` files.

**Scope**: Swift / SwiftUI+UIKit iOS apps — optionals, closures, threading, accessibility, design tokens. Companion files: `code-review-rules-realm.md`, `code-review-rules-alamofire.md`.

---

## SWIFT: Language Safety

**Scope**: Swift language rules — optionals, closures, concurrency, extension discipline.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| SWIFT-001 | No force unwrap without guard — use `guard let`, `if let`, or nil coalescing | high | `guard let value = optional else { return }` or `optional ?? default` | `optional!` used without prior nil check |
| SWIFT-002 | No retain cycle in `@escaping` closure — use `[weak self]` or `[unowned self]` | high | `{ [weak self] in guard let self else { return } … }` | `self.property` captured strongly in `@escaping` closure stored by another object |
| SWIFT-003 | UI updates on main actor — UIKit mutations dispatched via `DispatchQueue.main` or `@MainActor` | critical | `DispatchQueue.main.async { … }` or function marked `@MainActor` | UIKit property set directly from background thread or non-isolated async context |
| SWIFT-004 | `[weak self]` in closures capturing self in async/escaping contexts — guard-let-self pattern | high | `Task { [weak self] in guard let self else { return }; self.update() }` | `Task { self.update() }` where self is a VC/VM that may deallocate |
| SWIFT-005 | `guard let` / `if let` at trust boundaries — never force unwrap API responses or decoded values | high | `guard let user = response.data else { return }` | `let user = response.data!` after JSON decode |
| SWIFT-006 | Codable decode wrapped in do-catch — never silent `try?` on API response parsing | high | `do { let obj = try decoder.decode(T.self, from: data) } catch { log(error) }` | `let obj = try? decoder.decode(T.self, from: data)` discards parse errors |
| SWIFT-007 | Task cancellation checked via `Task.isCancelled` or `try Task.checkCancellation()` in long async work | medium | `guard !Task.isCancelled else { return }` inside a loop or after each await | Long `async` function iterates without checking cancellation |
| SWIFT-008 | No business logic in extensions — extensions are syntactic helpers only (computed props, protocol conformance) | medium | `extension UserViewModel: TableViewDelegate { … }` with only delegate methods | `extension UserViewModel { func fetchUsers() { … } }` containing API calls or state mutations |

---

## UIKIT: UIKit / SwiftUI Conventions

**Scope**: UIKit views, accessibility, design token usage, async functions in view layer, lifecycle discipline.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| UIKIT-001 | All interactive elements have `accessibilityLabel` | medium | `button.accessibilityLabel = "Submit order"` or `.accessibilityLabel(…)` in SwiftUI | `UIButton` or `Image` has no label and is not explicitly hidden from accessibility tree |
| UIKIT-002 | No hardcoded colors or fonts — use design tokens from theme | medium | `UIColor.epostPrimary` or `UIFont.epostBody` from theme library | `UIColor(red:green:blue:alpha:)` or `UIFont.systemFont(ofSize:)` hardcoded inline |
| UIKIT-003 | Async functions that touch UIKit are marked `@MainActor` | high | `@MainActor func loadView() async { … }` | `async func update()` calls UIKit without `@MainActor` or `DispatchQueue.main` |
| UIKIT-004 | Heavy setup in `viewDidLoad` only — `viewWillAppear` for lightweight state refresh only | medium | `viewDidLoad` configures subviews; `viewWillAppear` calls `refreshBadgeCount()` | `viewWillAppear` calls `setupLayout()` and creates new subviews on every appearance |
| UIKIT-005 | `deinit` cleans up observers, timers, and nils delegates to prevent retain cycles | high | `deinit { NotificationCenter.default.removeObserver(self); timer?.invalidate() }` | VC with `NotificationCenter` observers has no `deinit` or `removeObserver` call |
| UIKIT-006 | No force-cast `as!` for dequeued cells or segue destinations — use `guard let as?` | high | `guard let cell = tableView.dequeueReusableCell(withIdentifier: id) as? MyCell else { return UITableViewCell() }` | `let cell = tableView.dequeueReusableCell(withIdentifier: id) as! MyCell` |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| SWIFT-001–005 | Yes | — |
| SWIFT-006–008 | — | Yes |
| UIKIT-001 | — | Yes |
| UIKIT-002 | — | Yes |
| UIKIT-003, UIKIT-005, UIKIT-006 | Yes | — |
| UIKIT-004 | — | Yes |

**Lightweight**: Run on all Swift file reviews (10 of 14 rules). **Escalated**: Activate on large PRs (10+ files) or explicit `--deep` flag (4 of 14 rules). See also REALM and ALAMOFIRE companion files.

## Extending

Add rules following the pattern `{CATEGORY}-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
