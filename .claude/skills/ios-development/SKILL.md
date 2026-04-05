---
name: ios-development
description: (ePost) Builds SwiftUI/UIKit views, manages Xcode builds, and debugs iOS crashes. Use when working on iOS — SwiftUI/UIKit views, Xcode builds, XCTest, or fixing iOS crashes and Swift issues
user-invocable: false
paths: ["**/*.swift", "**/*.xcodeproj/**", "**/*.xcworkspace/**"]

metadata:
  agent-affinity: [epost-fullstack-developer, epost-tester, epost-debugger, epost-code-reviewer]
  keywords: [ios, swift, swiftui, uikit, xcode, iphone, ipad, mobile]
  platforms: [ios]
  triggers: [".swift", ".xcodeproj", ".xcworkspace", "ios", "iphone", "ipad"]
---

# iOS Development Skill

## Purpose
Modern iOS development (Swift 6, iOS 18+, SwiftUI, UIKit) with XcodeBuildMCP integration for autonomous Xcode operations.

## When Active
User mentions iOS, Swift, SwiftUI, UIKit, iPhone app, iPad app, or iOS-specific commands.

## Specialized Sub-Skills

This skill includes 3 specialized sub-skills for different iOS development aspects:

### 1. Development Patterns
Reference: `ios/development/references/development.md`

- Swift 6 concurrency (async/await, Sendable, Actors)
- SwiftUI vs UIKit strategy
- Architecture patterns (MVVM, TCA)
- State management (@Observable, property wrappers)
- NavigationStack implementation
- Networking with URLSession
- Persistence (SwiftData, Core Data)
- Common UI components (List, Grid, Sheet, Form)
- Debugging patterns

### 2. Build & Simulator Management
Reference: `ios/development/references/build.md` | `ios/development/references/simulator.md`

- Xcode project configuration
- Build settings and schemes
- Swift Package Manager
- Dependency management (SPM, CocoaPods)
- Asset catalogs and resources
- Code signing and provisioning
- Build optimization
- Simulator management (xcrun simctl + XcodeBuildMCP)
- Common build errors and fixes
- MCP tool patterns (discover_projs, list_schemes, build_sim, etc.)

### 3. Testing Strategies
Reference: `ios/development/references/tester.md`

- XCTest patterns (unit tests)
- XCUITest patterns (UI tests)
- Mock dependencies setup
- Given-When-Then structure
- Async/await testing
- Coverage goals and reporting
- Test organization
- Accessibility identifiers for UI testing
- MCP test automation (test_sim, test_device)

## XcodeBuildMCP Integration

When XcodeBuildMCP is available, this skill provides autonomous Xcode operations:

### MCP Capabilities
- **Project Discovery**: Auto-discover projects and schemes
- **Build Automation**: Build for simulator, device, or macOS
- **Simulator Management**: Boot, install, launch, stop apps
- **Testing**: Run XCTest/XCUITest suites
- **UI Automation**: Tap, swipe, type, screenshot
- **Log Capture**: Stream simulator/device logs
- **Environment Validation**: Run diagnostics

### Prerequisites
- macOS 14.5+ with Xcode 16.x+
- XcodeBuildMCP server: `claude mcp add XcodeBuildMCP npx xcodebuildmcp@latest`

## Key Conventions

- SwiftUI first; UIKit only when required
- `@Observable` (iOS 17+), not `ObservableObject`
- `async/await`, not completion handlers
- `@MainActor` for all UI updates
- Swift Testing framework for new tests (iOS 18+)
- Mock network calls with URLProtocol or dependency injection

## Tech Stack
- iOS 18+ SDK, Swift 6.0+
- SwiftUI (primary), UIKit (fallback)
- SwiftData for persistence
- XCTest / Swift Testing for testing
- XcodeBuildMCP for automation (optional)

## Build Commands (Quick Reference)
```bash
# MCP (preferred)
mcp__xcodebuildmcp__build_sim  # Build for simulator
mcp__xcodebuildmcp__test_sim   # Run tests

# Fallback
xcodebuild -project MyApp.xcodeproj -scheme MyApp -sdk iphonesimulator build
```

## Sub-Skill Routing

| Intent | Sub-Skill | When |
|--------|-----------|------|
| UI components | `ios-ui-lib` | Theme components, design tokens |
| RAG search | `ios-rag` | Vector search iOS codebase |

## References

- `references/development.md` — @Observable, NavigationStack, Actor, MVVM, networking, persistence patterns
- `references/build.md` — Xcode config, SPM, code signing, MCP build workflow examples
- `references/simulator.md` — Simulator management via xcrun simctl + XcodeBuildMCP
- `references/tester.md` — XCTest/XCUITest/Swift Testing patterns, mock setup, coverage
