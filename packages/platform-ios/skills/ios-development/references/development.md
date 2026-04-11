# iOS Development Patterns

## Purpose
Core iOS development patterns for Swift 6, iOS 18+, SwiftUI/UIKit implementation, and architecture.

## Swift 6 Concurrency

### async/await + MainActor
```swift
func fetchProducts() async throws -> [Product] {
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode([Product].self, from: data)
}

@MainActor
class ProductsViewModel {
    var products: [Product] = []
    func loadProducts() async {
        products = try await fetchProducts()
    }
}
```

### Sendable + Actor
```swift
// Thread-safe value type
struct Product: Sendable { let id: String; let name: String }

// Thread-safe mutable state
actor ProductCache {
    private var cache: [String: Product] = [:]
    func get(_ id: String) -> Product? { cache[id] }
    func set(_ product: Product) { cache[product.id] = product }
}
```

### Task Groups
```swift
func fetchMultiple() async throws -> [Data] {
    try await withThrowingTaskGroup(of: Data.self) { group in
        group.addTask { try await self.fetch(url1) }
        group.addTask { try await self.fetch(url2) }
        return try await group.reduce(into: []) { $0.append($1) }
    }
}
```

## SwiftUI vs UIKit Strategy

- New features → SwiftUI
- Complex custom views → UIKit
- Hybrid → `UIHostingController` / `UIViewRepresentable`

### @Observable (iOS 17+)
```swift
@Observable
class ProductsViewModel {
    var products: [Product] = []
    var isLoading = false

    func load() async {
        isLoading = true
        defer { isLoading = false }
        products = try await productService.fetchProducts()
    }
}

struct ProductsView: View {
    @State private var viewModel = ProductsViewModel()
    var body: some View {
        List(viewModel.products) { Text($0.name) }
            .task { await viewModel.load() }
    }
}
```

## Architecture

```
Simple app (<10 views)   → No architecture
Medium app (10–50 views) → MVVM with @Observable
Large app (50+ views)    → TCA (Composable Architecture)
```

### MVVM Example
```swift
@Observable
class LoginViewModel {
    var email = ""; var password = ""; var isLoading = false
    var errorMessage: String?
    private let authService: AuthService

    func login() async {
        isLoading = true; defer { isLoading = false }
        do { try await authService.login(email: email, password: password) }
        catch { errorMessage = error.localizedDescription }
    }
}
```

## Networking

```swift
struct NetworkClient {
    func fetch<T: Decodable>(_ type: T.Type, from url: URL) async throws -> T {
        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse,
              (200...299).contains(http.statusCode) else {
            throw NetworkError.invalidResponse
        }
        return try decoder.decode(T.self, from: data)
    }
}
```

Environment-aware base URL: use `#if DEBUG` to switch between development/production endpoints.

## Debugging Patterns

**SwiftUI state not updating** — Use `@Observable` (iOS 17+), not `ObservableObject`.

**Retain cycle** — Use `[weak self]` in all `@escaping` closures and Task captures:
```swift
Task { [weak self] in await self?.loadData() }
```

**MainActor checker error** — Mark the function `@MainActor` or use `await MainActor.run { }`.

## Rules

- SwiftUI first; UIKit only when required
- `@Observable` (iOS 17+), not `ObservableObject`
- `async/await`, not completion handlers
- `@MainActor` for all UI updates
- Value types (structs) by default
- Guard against force unwraps — use optional binding
- `[weak self]` in closures to prevent retain cycles
