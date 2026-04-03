---
phase: 1
title: "Create ios-testing skill"
effort: 45 min
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Target: `packages/platform-ios/skills/ios-testing/`
- Register in: `packages/platform-ios/package.yaml`
- Stack: Swift 6, SwiftUI + UIKit, iOS 18+, XCTest, XCUITest, Swift Testing framework

## Files to Create

### `SKILL.md`

Frontmatter:
```yaml
---
name: ios-testing
description: "Use when writing iOS tests — XCTest unit tests, XCUITest E2E, Swift Testing (@Test/@Suite), snapshot testing, or diagnosing test failures. Covers async/await patterns, Page Object Model, flakiness fixes."
user-invocable: false
context: inline
metadata:
  keywords: [xctest, xcuitest, swift-testing, snapshot, unit-test, ui-test, ios]
  platforms: [ios]
  connections:
    extends: [ios-development]
    related: [test, scenario]
---
```

Body sections:
1. **Purpose** — 1-2 lines
2. **Test Pyramid for iOS** — Unit (60%) / Integration (20%) / UI/E2E (20%), coverage targets (70-85% unit, 60-70% UI flows)
3. **XCTest Unit Patterns** — async/await, setUp/tearDown, addTeardownBlock, XCTUnwrap, XCTAssertThrowsError
4. **XCUITest E2E Patterns** — accessibilityIdentifier (NOT labels), waitForExistence mandatory, Page Object Model structure, app.launchArguments for test flags
5. **Swift Testing Framework** — @Test, #expect, @Suite, parameterized tests with @Test(arguments:), async support. Migration note: prefer Swift Testing for NEW tests, XCTest for legacy
6. **Snapshot Testing** — swift-snapshot-testing library, assertSnapshot(), record mode, baseline management, when to use (SwiftUI component visual regression)
7. **Flakiness Fixes** — waitForExistence over .exists, deterministic test data, no Thread.sleep
8. **References** section

### `references/xctest-patterns.md`

Sections:
- setUp/tearDown + addTeardownBlock patterns
- Async/await testing (async throws test methods)
- XCTestExpectation + waitForExpectations for callback APIs
- XCTWaiter for ordered expectations
- Mocking via protocol + manual mock pattern (no third-party mock framework)
- XCUITest: Page Object Model (full example — LoginPage, DashboardPage, returns next page)
- XCUITest: flakiness patterns (waitForExistence, inverse waits for disappearing elements)
- Performance: XCTMetric, XCTCPUMetric — basic usage example
- Code coverage: Xcode settings + meaningful thresholds table

### `references/swift-testing-migration.md`

Sections:
- XCTest vs Swift Testing comparison table (declaration, assertions, error handling, parameterization)
- Assertion mapping: XCTAssert* → #expect equivalents
- #require for unwrapping (replaces try XCTUnwrap)
- @Test(arguments:) for parameterized tests
- @Suite for grouping
- Tags: @Test(.tags(.critical))
- Async support in Swift Testing
- Migration strategy: coexistence — both frameworks work in same target
- When to use which: new tests → Swift Testing; XCUITest → stays XCTest (no Swift Testing equivalent yet)

## File Ownership

| File | Action |
|---|---|
| `packages/platform-ios/skills/ios-testing/SKILL.md` | CREATE |
| `packages/platform-ios/skills/ios-testing/references/xctest-patterns.md` | CREATE |
| `packages/platform-ios/skills/ios-testing/references/swift-testing-migration.md` | CREATE |
| `packages/platform-ios/package.yaml` | UPDATE — add `ios-testing` to provides.skills |
