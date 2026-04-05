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

## XCTest Critical Rules

- `setUp`/`tearDown` must call `super` when async — use `async throws` variants
- Use `addTeardownBlock` for cleanup registered at point of setup
- `try XCTUnwrap(optional)` — fail immediately on nil, no force-unwrap
- `XCTAssertThrowsError` for error path validation

## XCUITest Critical Rules

- **ALWAYS use `.accessibilityIdentifier`** — never query by label/text (breaks on localization)
- **`waitForExistence(timeout:)` is MANDATORY** — never use `.exists` alone
- Pass `["--uitesting"]` via `app.launchArguments` to disable animations

See `references/xctest-patterns.md` for async/await examples, setUp/tearDown, Page Object Model.

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
