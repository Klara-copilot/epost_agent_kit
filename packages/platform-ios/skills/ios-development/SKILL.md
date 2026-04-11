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

- Build commands (simulator + device)
- XcodeBuildMCP tool reference table (full API)
- Build settings (Debug/Release)
- Code signing error fixes
- Swift Package Manager
- Build optimization (benchmark → hotspots → settings audit → verify)
- Common build errors

### 3. Testing Strategies
Reference: `ios/development/references/tester.md` (quick reference — full patterns in `ios-testing` skill)

- XCTest Given-When-Then pattern
- Async testing
- Accessibility identifiers (required for UI tests)
- Running tests via MCP + CLI
- Coverage goals (80%/75%/90%)

## MCP Integrations

Two MCP servers ship with this package (auto-configured via `settings.json`):

| MCP | Type | Role |
|-----|------|------|
| `XcodeBuildMCP` | local | Build, test, simulator control, UI automation |
| `sosumi` | remote | Apple docs → AI-readable Markdown |

**sosumi** converts Apple Developer docs, HIG, and WWDC sessions to Markdown so AI can read them. Use it to fetch current Swift/SwiftUI/UIKit API docs before implementing.

**Xcode 26+ users**: Xcode 26 includes native Claude Code integration (Coding Assistant). No separate setup needed — Claude Code connects via MCP automatically when Xcode 26 is installed.

### XcodeBuildMCP Capabilities
- **Project Discovery**: Auto-discover projects and schemes
- **Build Automation**: Build for simulator, device, or macOS
- **Simulator Management**: Boot, install, launch, stop apps
- **Testing**: Run XCTest/XCUITest suites
- **UI Automation**: Tap, swipe, type, screenshot
- **Log Capture**: Stream simulator/device logs
- **Environment Validation**: Run diagnostics

### Prerequisites
- macOS 14.5+ with Xcode 16.x+ (or Xcode 26+ for native integration)
- XcodeBuildMCP and sosumi are pre-configured — no manual install after `epost-kit init`

## Companion Skill Suite

**Axiom** (optional) — 175 battle-tested Claude Code skills for xOS (iOS/iPadOS/watchOS/tvOS) by Charles Wiltgen. Strong coverage of Swift 6 strict concurrency, memory leak diagnosis, and WWDC 2025 patterns. Install separately from [CharlesWiltgen/Axiom](https://github.com/CharlesWiltgen/Axiom) if your project needs deep xOS coverage beyond this skill.

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

- `references/development.md` — Swift 6 concurrency, @Observable, MVVM, networking, debugging patterns
- `references/build.md` — XcodeBuildMCP tool table, build commands, build settings, optimization workflow
- `references/simulator.md` — Simulator management (xcrun simctl + XcodeBuildMCP quick ref)
- `references/tester.md` — XCTest quick reference; full patterns in `ios-testing` skill
