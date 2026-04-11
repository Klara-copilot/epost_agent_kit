# iOS Testing — Quick Reference

## Purpose
Essential testing patterns for XCTest/XCUITest in ePost iOS. Full patterns and Swift Testing migration in `ios-testing` skill.

## Test Types

| Type | When | Framework |
|------|------|-----------|
| Unit | ViewModel logic, services, models | XCTest / Swift Testing |
| Integration | API + persistence layer | XCTest |
| UI (E2E) | User flows | XCUITest |

## XCTest Pattern (Given-When-Then)

```swift
final class ProductsViewModelTests: XCTestCase {
    var viewModel: ProductsViewModel!
    var mockService: MockProductService!

    override func setUp() {
        super.setUp()
        mockService = MockProductService()
        viewModel = ProductsViewModel(service: mockService)
    }
    override func tearDown() { viewModel = nil; mockService = nil; super.tearDown() }

    func testLoadProducts_WhenNetworkFails_ShowsError() async {
        // Given
        mockService.shouldThrowError = true
        // When
        await viewModel.loadProducts()
        // Then
        XCTAssertNotNil(viewModel.errorMessage, "Error message must be set on network failure")
        XCTAssertTrue(viewModel.products.isEmpty)
    }
}
```

## Async Testing

```swift
func testAsyncOperation() async throws {
    await viewModel.loadProducts()
    XCTAssertFalse(viewModel.products.isEmpty)
}
```

## Accessibility Identifiers (Required for UI Tests)

```swift
// In SwiftUI view — always set accessibilityIdentifier for interactive elements
TextField("Email", text: $email).accessibilityIdentifier("EmailField")
Button("Login") { }.accessibilityIdentifier("LoginButton")

// In XCUITest
let field = app.textFields["EmailField"]
XCTAssertTrue(field.waitForExistence(timeout: 5))
```

## Running Tests

```bash
# CLI
xcodebuild test -project MyApp.xcodeproj -scheme MyApp \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro'

# Specific test
xcodebuild test ... -only-testing:MyAppTests/ProductsViewModelTests
```

```swift
// MCP (preferred)
mcp__xcodebuildmcp__test_sim({ projectPath, scheme, simulatorId })
mcp__xcodebuildmcp__test_sim({ ..., onlyTesting: ['MyAppTests/ProductTests'] })
```

## Coverage Goals

| Metric | Target |
|--------|--------|
| Statements | 80%+ |
| Branches | 75%+ |
| Functions | 90%+ |

## Rules

- Name tests `testFeature_Condition_ExpectedBehavior`
- Use Given-When-Then structure
- Mock external dependencies (network, DB) — never call real APIs in unit tests
- Use `accessibilityIdentifier` for all UI test targets (not display strings)
- `continueAfterFailure = false` in all UI test setUp
- `waitForExistence(timeout:)` — never `sleep()` in UI tests
- Test error cases explicitly, not just happy path
- Clean up in `tearDown` — nil out viewModels and mocks
