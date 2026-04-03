# Swift Testing Migration Reference

Guide for adopting Swift Testing (`import Testing`) alongside or in place of XCTest.

---

## XCTest vs Swift Testing Comparison

| Aspect | XCTest | Swift Testing |
|---|---|---|
| Test declaration | `func testFoo() { }` | `@Test func foo() { }` |
| Grouping | `class FooTests: XCTestCase` | `@Suite struct FooTests` |
| Assertions | `XCTAssertEqual(a, b)` | `#expect(a == b)` |
| Unwrap | `try XCTUnwrap(x)` | `try #require(x)` |
| Error testing | `XCTAssertThrowsError(try f())` | `#expect(throws: MyError.self) { try f() }` |
| Parameterized | manual loop or subclass | `@Test(arguments: [...])` |
| Tagging | none | `@Test(.tags(.critical))` |
| Async support | `func testFoo() async throws` | `@Test func foo() async throws` — same |
| setUp | `override func setUp()` | `init() async throws` on `@Suite struct` |
| tearDown | `override func tearDown()` | `deinit` on class `@Suite` or `addTeardownBlock` equivalent |
| Skip | `XCTSkip(...)` | `#expect(Bool(conditionMet))` or `withKnownIssue` |

---

## Assertion Mapping

| XCTest | Swift Testing |
|---|---|
| `XCTAssertTrue(x)` | `#expect(x)` |
| `XCTAssertFalse(x)` | `#expect(!x)` |
| `XCTAssertEqual(a, b)` | `#expect(a == b)` |
| `XCTAssertNotEqual(a, b)` | `#expect(a != b)` |
| `XCTAssertNil(x)` | `#expect(x == nil)` |
| `XCTAssertNotNil(x)` | `#expect(x != nil)` |
| `XCTAssertGreaterThan(a, b)` | `#expect(a > b)` |
| `XCTAssertThrowsError(try f())` | `#expect(throws: MyError.self) { try f() }` |
| `XCTAssertNoThrow(try f())` | `#expect(throws: Never.self) { try f() }` |
| `try XCTUnwrap(x)` | `try #require(x)` |

`#expect` captures the full expression tree — on failure it shows the sub-expression values, unlike `XCTAssertEqual` which only shows `a != b`.

---

## #require for Unwrapping

`#require` is the equivalent of `try XCTUnwrap`. It unwraps optionals and stops the test immediately on `nil` (rather than continuing with a force-unwrap crash):

```swift
// XCTest style
let item = try XCTUnwrap(response.items.first)
XCTAssertEqual(item.id, "abc")

// Swift Testing style
let item = try #require(response.items.first)
#expect(item.id == "abc")
```

---

## Parameterized Tests with @Test(arguments:)

Replace manual loops or duplicated test methods:

```swift
// XCTest — verbose
func testValidEmail_valid() { XCTAssertTrue(validate("user@example.com")) }
func testValidEmail_missingAt() { XCTAssertFalse(validate("userexample.com")) }
func testValidEmail_empty() { XCTAssertFalse(validate("")) }

// Swift Testing — one declaration
@Test("email validation", arguments: [
    ("user@example.com", true),
    ("userexample.com",  false),
    ("",                 false),
    ("a@b.c",           true),
])
func emailValidation(input: String, expected: Bool) {
    #expect(validate(input) == expected)
}
```

Arguments can be any `Collection`. Each element becomes a separate test case in the test report.

---

## @Suite for Grouping

Use `@Suite` on a struct to group related tests. Nesting is supported:

```swift
@Suite("Authentication")
struct AuthTests {

    @Suite("Login")
    struct LoginTests {
        @Test("succeeds with valid credentials")
        func validCredentials() async throws { /* ... */ }

        @Test("fails with wrong password")
        func wrongPassword() async throws { /* ... */ }
    }

    @Suite("Token Refresh")
    struct TokenRefreshTests {
        @Test("refreshes before expiry")
        func refreshBeforeExpiry() async throws { /* ... */ }
    }
}
```

`@Suite` on a struct provides value-type isolation — a fresh instance per test. Use a `class` suite only when you need shared mutable state across tests in the suite (rare).

---

## Tags

Define custom tags to group tests across suites and filter runs:

```swift
// Define tags — typically in a TestTags.swift file
extension Tag {
    @Tag static var critical: Self
    @Tag static var network: Self
    @Tag static var slow: Self
}

// Apply tags
@Test("checkout completes", .tags(.critical))
func checkoutCompletes() async throws { /* ... */ }

@Test("fetches remote config", .tags(.network, .slow))
func fetchesRemoteConfig() async throws { /* ... */ }
```

Run tagged tests from the command line:

```
xcodebuild test -scheme MyApp -testPlan default \
  -only-testing-tag critical
```

---

## Async Support

Async test methods work without any special setup in Swift Testing:

```swift
@Test("loads user profile")
func loadsUserProfile() async throws {
    let service = UserService(api: MockAPI())
    let profile = try await service.loadProfile(id: "42")
    #expect(profile.displayName == "Alice")
}
```

There is no `XCTestExpectation` equivalent in Swift Testing — model async callbacks as `async` functions or wrap in `withCheckedThrowingContinuation` to bridge to Swift concurrency.

---

## Coexistence Strategy

Both XCTest and Swift Testing work in the **same test target**. You do not need to split targets or migration all at once.

```swift
// ExistingTests.swift — untouched XCTest
import XCTest
final class LegacyServiceTests: XCTestCase {
    func testLegacyBehavior() { /* ... */ }
}

// NewFeatureTests.swift — Swift Testing
import Testing
@Suite struct NewFeatureTests {
    @Test func newBehavior() { /* ... */ }
}
```

Migration strategy:
1. Write all **new** test files using Swift Testing.
2. Migrate existing XCTest files opportunistically when editing — no big-bang rewrite.
3. Leave XCUITest files in XCTest permanently (no Swift Testing equivalent for UI automation).

---

## When to Use Each Framework

| Scenario | Framework | Reason |
|---|---|---|
| New unit test file | Swift Testing | Better diagnostics, parameterization, ergonomics |
| Existing XCTest file (minor edit) | XCTest | Avoid mixed-framework churn |
| UI automation (XCUITest) | XCTest | Swift Testing has no XCUITest replacement |
| Performance tests (measure{}) | XCTest | XCTMetric API not available in Swift Testing |
| Snapshot tests | XCTest | swift-snapshot-testing integrates with XCTest |

---

## Limitations

- **No XCUITest equivalent** — UI automation stays in XCTest indefinitely.
- **No XCTMetric / measure()** — performance tests stay in XCTest.
- **swift-snapshot-testing** uses XCTest hooks — snapshot tests stay in XCTest.
- Requires Swift 5.9+ / Xcode 15+. Projects targeting older toolchains must use XCTest.
