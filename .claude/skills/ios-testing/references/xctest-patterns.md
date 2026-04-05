# XCTest Patterns Reference

Concrete patterns for XCTest unit tests and XCUITest E2E on iOS.

---

## setUp / tearDown + addTeardownBlock

```swift
final class OrderServiceTests: XCTestCase {
    var sut: OrderService!
    var mockAPI: MockOrderAPI!

    override func setUp() async throws {
        try await super.setUp()
        mockAPI = MockOrderAPI()
        sut = OrderService(api: mockAPI)
    }

    override func tearDown() async throws {
        sut = nil
        mockAPI = nil
        try await super.tearDown()
    }
}
```

Use `addTeardownBlock` when you want cleanup registered at the point where a resource is created — works even if the test throws before `tearDown`:

```swift
func testFileDownload() throws {
    let tempURL = FileManager.default.temporaryDirectory
        .appendingPathComponent(UUID().uuidString)
    addTeardownBlock {
        try? FileManager.default.removeItem(at: tempURL)
    }
    // test logic — file is always removed after
}
```

---

## Async/Await Testing

```swift
// Async throws test — XCTest supports async natively
func testFetchOrders() async throws {
    mockAPI.stubbedOrders = [.fixture]
    let orders = try await sut.fetchOrders(for: "user-1")
    XCTAssertEqual(orders.count, 1)
    XCTAssertEqual(orders[0].id, Order.fixture.id)
}

// Async setUp
override func setUp() async throws {
    try await super.setUp()
    try await database.reset()
    sut = UserRepository(database: database)
}
```

---

## XCTestExpectation for Callback APIs

Use when testing delegate callbacks or completion handlers that predate async/await:

```swift
func testDelegateCallback() {
    let exp = expectation(description: "delegate called")
    sut.delegate = MockDelegate { result in
        XCTAssertEqual(result, .success)
        exp.fulfill()
    }

    sut.startOperation()
    waitForExpectations(timeout: 3)
}

// Multiple expectations
func testTwoEvents() {
    let first = expectation(description: "first event")
    let second = expectation(description: "second event")

    sut.onFirst = { first.fulfill() }
    sut.onSecond = { second.fulfill() }
    sut.start()

    wait(for: [first, second], timeout: 5)
}
```

---

## XCTWaiter for Ordered Expectations

Enforce that expectations are fulfilled in a specific order:

```swift
func testOrderedEvents() {
    let connect = XCTestExpectation(description: "connected")
    let authenticate = XCTestExpectation(description: "authenticated")
    let ready = XCTestExpectation(description: "ready")

    sut.onConnect = { connect.fulfill() }
    sut.onAuthenticate = { authenticate.fulfill() }
    sut.onReady = { ready.fulfill() }

    sut.start()

    let result = XCTWaiter.wait(
        for: [connect, authenticate, ready],
        timeout: 10,
        enforceOrder: true
    )
    XCTAssertEqual(result, .completed)
}
```

---

## Mocking via Protocol + Manual Mock

No third-party mock framework needed for simple cases. Define a protocol and provide a test double:

```swift
// Production protocol
protocol UserAPIProtocol {
    func fetchUser(id: String) async throws -> User
}

// Real implementation
struct UserAPI: UserAPIProtocol {
    func fetchUser(id: String) async throws -> User { /* ... */ }
}

// Test double — configure per test
final class MockUserAPI: UserAPIProtocol {
    var stubbedUser: User?
    var stubbedError: Error?
    var fetchCallCount = 0

    func fetchUser(id: String) async throws -> User {
        fetchCallCount += 1
        if let error = stubbedError { throw error }
        return stubbedUser ?? .fixture
    }
}

// Usage in test
func testShowsUserName() async throws {
    let mock = MockUserAPI()
    mock.stubbedUser = User(id: "1", name: "Alice")
    let sut = ProfileViewModel(api: mock)

    await sut.load()

    XCTAssertEqual(sut.displayName, "Alice")
    XCTAssertEqual(mock.fetchCallCount, 1)
}
```

---

## XCUITest: Page Object Model

Encapsulate each screen as a struct with computed element accessors and action methods that return the next page:

```swift
// Base page — shared helpers
struct LoginPage {
    let app: XCUIApplication

    // Element accessors — always use accessibilityIdentifier
    var emailField: XCUIElement { app.textFields["login_email_field"] }
    var passwordField: XCUIElement { app.secureTextFields["login_password_field"] }
    var loginButton: XCUIElement { app.buttons["login_submit_button"] }
    var errorLabel: XCUIElement { app.staticTexts["login_error_label"] }

    // Assert page is visible before interacting
    func assertVisible() {
        XCTAssertTrue(loginButton.waitForExistence(timeout: 5),
                      "Login page did not appear")
    }

    @discardableResult
    func login(email: String, password: String) -> DashboardPage {
        emailField.tap()
        emailField.typeText(email)
        passwordField.tap()
        passwordField.typeText(password)
        loginButton.tap()
        return DashboardPage(app: app)
    }

    @discardableResult
    func attemptInvalidLogin(email: String, password: String) -> LoginPage {
        emailField.tap()
        emailField.typeText(email)
        passwordField.tap()
        passwordField.typeText(password)
        loginButton.tap()
        return self
    }
}

struct DashboardPage {
    let app: XCUIApplication

    var welcomeHeader: XCUIElement { app.staticTexts["dashboard_welcome_header"] }
    var profileButton: XCUIElement { app.buttons["dashboard_profile_button"] }

    func assertVisible() {
        XCTAssertTrue(welcomeHeader.waitForExistence(timeout: 5),
                      "Dashboard did not appear after login")
    }

    @discardableResult
    func openProfile() -> ProfilePage {
        profileButton.tap()
        return ProfilePage(app: app)
    }
}

// Test using page objects
func testSuccessfulLogin() {
    let app = XCUIApplication()
    app.launchArguments = ["--uitesting"]
    app.launch()

    let login = LoginPage(app: app)
    login.assertVisible()

    let dashboard = login.login(email: "test@example.com", password: "secret")
    dashboard.assertVisible()
}
```

---

## XCUITest: Flakiness Patterns

### waitForExistence — always required

```swift
// WRONG — element may not be rendered yet
XCTAssertTrue(app.buttons["submit"].exists)

// CORRECT
XCTAssertTrue(app.buttons["submit"].waitForExistence(timeout: 5))
```

### Inverse wait — element disappears

```swift
// Wait for loading spinner to disappear before asserting content
let spinner = app.activityIndicators["loading_spinner"]
XCTAssertTrue(spinner.waitForNonExistence(timeout: 10),
              "Loading took too long")

let content = app.staticTexts["content_label"]
XCTAssertTrue(content.waitForExistence(timeout: 3))
```

### Disable animations in test app

```swift
// In App.swift or AppDelegate
if CommandLine.arguments.contains("--uitesting") {
    UIView.setAnimationsEnabled(false)
    // or set UIApplication.shared.keyWindow?.layer.speed = 100
}
```

### Avoid Thread.sleep

```swift
// WRONG — arbitrary delay
Thread.sleep(forTimeInterval: 2)

// CORRECT — wait for the actual condition
XCTAssertTrue(resultLabel.waitForExistence(timeout: 5))
```

---

## Performance Testing

Measure execution time with `measure(metrics:)`:

```swift
func testSearchPerformance() {
    let dataset = generateLargeDataset()
    measure(metrics: [XCTClockMetric()]) {
        _ = sut.search(query: "swift", in: dataset)
    }
}

// CPU usage
func testCPUUsageDuringRender() {
    measure(metrics: [XCTCPUMetric()]) {
        _ = ProfileRenderer().render(user: .fixture)
    }
}

// Memory allocations
func testMemoryAllocations() {
    measure(metrics: [XCTMemoryMetric()]) {
        _ = ImageProcessor().process(image: sampleImage)
    }
}
```

Set a baseline in Xcode after the first run. Subsequent runs fail if metrics exceed the baseline by more than the allowed deviation (default 10%).

---

## Code Coverage

### Enabling in Xcode

1. Edit Scheme → Test → Options
2. Check **Code Coverage** → "Gather coverage for some targets"
3. Select app target (not test target)

### Meaningful thresholds

| Layer | Target | Rationale |
|---|---|---|
| Unit (business logic, models) | 70–85% | Core correctness, easily testable |
| Integration (repositories, services) | 60–70% | External boundaries add noise |
| UI / ViewModels | 50–65% | View layout untestable via unit tests |
| XCUITest critical flows | 60–70% | Login, checkout, core journeys |

Coverage is a quality signal, not a target. 80% on critical logic beats 95% on trivial getters.
