---
name: ios-testing
description: "Use when writing iOS tests — XCTest unit tests, XCUITest E2E, Swift Testing (@Test/@Suite), snapshot testing, or diagnosing test failures. Covers async/await patterns, Page Object Model, flakiness fixes."
user-invocable: false
context: inline
paths: ["**/*.swift", "**/*Tests.swift", "**/*Test.swift", "**/*Spec.swift"]
metadata:
  keywords: [xctest, xcuitest, swift-testing, snapshot, unit-test, ui-test, ios]
  platforms: [ios]
  connections:
    extends: [ios-development]
    related: [test, scenario]
---

## Purpose

iOS testing patterns for XCTest unit tests, XCUITest E2E automation, and the Swift Testing framework (@Test/@Suite). Covers async/await testing, snapshot regression, and flakiness prevention.

---

## Test Pyramid for iOS

| Layer | Share | Tool | Coverage Target |
|---|---|---|---|
| Unit | 60% | XCTest / Swift Testing | 70–85% |
| Integration | 20% | XCTest | 60–70% |
| UI / E2E | 20% | XCUITest | 60–70% (critical flows) |

Keep unit tests fast and isolated. Reserve XCUITest for user-visible flows where unit tests cannot provide confidence.

---

## XCTest Unit Patterns

### async/await tests

```swift
func testFetchUser() async throws {
    let user = try await sut.fetchUser(id: "123")
    XCTAssertEqual(user.name, "Alice")
}
```

### setUp / tearDown

```swift
override func setUp() async throws {
    try await super.setUp()
    sut = UserService(client: MockAPIClient())
}

override func tearDown() async throws {
    sut = nil
    try await super.tearDown()
}
```

Use `addTeardownBlock` for per-test cleanup registered at the point of setup:

```swift
func testSomething() throws {
    let resource = try Resource.open()
    addTeardownBlock { resource.close() }
    // test continues — resource always closed
}
```

### Unwrapping and error assertions

```swift
// Safe unwrap — test fails immediately on nil
let item = try XCTUnwrap(response.items.first)

// Assert an error is thrown
XCTAssertThrowsError(try sut.validate(input: "")) { error in
    XCTAssertEqual(error as? ValidationError, .empty)
}
```

---

## XCUITest E2E Patterns

### Critical rules

- **ALWAYS use `.accessibilityIdentifier`** — never query by label or text. Labels break on localization; identifiers are stable.
- **`waitForExistence(timeout:)` is MANDATORY** — never use `.exists` alone. Elements may not be rendered yet.
- Use `app.launchArguments` to pass test flags (`["--uitesting"]`) so the app can disable animations and use deterministic data.

```swift
app.launchArguments = ["--uitesting"]
app.launch()

let loginButton = app.buttons["login_button"]
XCTAssertTrue(loginButton.waitForExistence(timeout: 5))
loginButton.tap()
```

### Page Object Model

Encapsulate screen interactions in page objects. Actions return the next page to enable chaining.

```swift
struct LoginPage {
    let app: XCUIApplication

    var emailField: XCUIElement { app.textFields["login_email"] }
    var passwordField: XCUIElement { app.secureTextFields["login_password"] }
    var submitButton: XCUIElement { app.buttons["login_submit"] }

    @discardableResult
    func login(email: String, password: String) -> DashboardPage {
        emailField.tap()
        emailField.typeText(email)
        passwordField.tap()
        passwordField.typeText(password)
        submitButton.tap()
        return DashboardPage(app: app)
    }
}
```

See `references/xctest-patterns.md` for full Page Object examples and XCUITest flakiness patterns.

---

## Swift Testing Framework

Available from Swift 5.9+ / Xcode 15+. Prefer Swift Testing for all **new** test code.

```swift
import Testing

@Suite("User Service")
struct UserServiceTests {

    @Test("fetches user by ID")
    func fetchUser() async throws {
        let service = UserService(client: MockAPIClient())
        let user = try await service.fetchUser(id: "42")
        #expect(user.name == "Alice")
    }

    @Test("rejects empty input", arguments: ["", "   ", "\n"])
    func rejectsEmptyInput(input: String) throws {
        #expect(throws: ValidationError.empty) {
            try validate(input)
        }
    }
}
```

Key points:
- `#expect` replaces all `XCTAssert*` macros — it captures expression details on failure.
- `@Test(arguments:)` replaces manual loops for parameterized cases.
- Async test methods work without any special setup.
- `@Suite` groups related tests; nesting is supported.
- **XCUITest has no Swift Testing equivalent** — keep UI tests in XCTest.
- Both frameworks coexist in the same test target; migrate incrementally.

See `references/swift-testing-migration.md` for the full assertion mapping and migration strategy.

---

## Snapshot Testing

Library: `swift-snapshot-testing` (pointfreeco).

```swift
import SnapshotTesting

func testProfileViewSnapshot() {
    let view = ProfileView(user: .fixture)
    assertSnapshot(of: view, as: .image(on: .iPhone13))
}
```

- Run once with `record: true` to capture baselines; commit the `.png` artifacts.
- Use for SwiftUI component visual regression — catch unintended layout changes.
- Scope to components, not full screens, to keep snapshots stable.
- Store baselines in `__Snapshots__/` next to the test file.

---

## Flakiness Fixes

| Problem | Wrong | Correct |
|---|---|---|
| Element may not be ready | `XCTAssertTrue(button.exists)` | `XCTAssertTrue(button.waitForExistence(timeout: 5))` |
| Waiting for element to disappear | — | `XCTAssertTrue(spinner.waitForNonExistence(timeout: 5))` |
| Timing delay | `Thread.sleep(forTimeInterval: 2)` | `XCTestExpectation` or `waitForExistence` |
| Non-deterministic data | random IDs in test data | fixed fixtures / launch args |
| Animations interfere | — | `app.launchArguments += ["--uitesting"]` → disable animations in app code |

---

## References

- `references/xctest-patterns.md` — setUp/tearDown, async, expectations, mocking, Page Object, performance, coverage
- `references/swift-testing-migration.md` — XCTest → Swift Testing mapping, parameterized tests, coexistence strategy
