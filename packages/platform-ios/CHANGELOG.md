# Changelog: platform-ios

All notable changes to the `platform-ios` package will be documented in this file.

## [Unreleased]

### Added
- `ios-testing` skill — XCTest, XCUITest, Swift Testing (@Test/#expect), snapshot testing, flakiness fixes, Turbine async testing
- MCP servers via `settings.json`: XcodeBuildMCP (build/test/simulator/UI automation) and sosumi (Apple docs → Markdown)
- Code review rules: MEMORY-001..004 (retain cycles, NSTimer, Combine AnyCancellable, addChild/removeFromParent lifecycle)
- Code review rules: CONCURRENCY-001..004 (Swift 6 actor isolation, @unchecked Sendable comment, Task [weak self], async let scope)
- REALM rules expanded: REALM-004 (encryption key from Keychain), REALM-005 (migration block), REALM-006 (notification token as instance property) — 3 → 6 rules
- ALAMOFIRE rules expanded: ALAMOFIRE-004 (SSL pinning via ServerTrustManager), ALAMOFIRE-005 (auth via RequestInterceptor), ALAMOFIRE-006 (multipart upload) — 3 → 6 rules
- Build optimization workflow in `build.md` — AvdLee 4-step: benchmark → hotspots → settings audit → verify

### Changed
- Added `memory: project` to `epost-a11y-specialist` agent
- Updated `epost-ios-developer` skill bindings and `memory: project`
- `build.md` 559 → 150 lines: MCP tool signatures consolidated into reference table; simulator xcrun section removed (covered by simulator skill)
- `development.md` 432 → 137 lines: removed Navigation, UI Components, generic Persistence sections
- `tester.md` 445 → 95 lines: quick reference only — full patterns in `ios-testing` skill
- `asana-muji/references/task-templates.md`: stub replaced with Feature/Bug/Design Token templates

## [1.0.0] - 2026-02-08

Initial release.

### Agents

- Added `epost-ios-developer` — iOS platform specialist (Swift 6, SwiftUI, UIKit)
- Added `epost-a11y-specialist` — iOS accessibility auditing and fixing (WCAG 2.1 AA)

### Skills

- Added `ios/ios-development` — Swift 6, SwiftUI, UIKit patterns
- Added `ios/ios-accessibility` — WCAG 2.1 AA accessibility compliance

### Commands

- Added `/ios:cook` — Implement iOS features (Swift, SwiftUI)
- Added `/ios:test` — Run iOS unit and UI tests
- Added `/ios:debug` — Debug crashes, concurrency, SwiftUI state
- Added `/ios:simulator` — Manage iOS simulators
- Added `/ios:a11y:audit` — Audit staged Swift changes for accessibility
- Added `/ios:a11y:fix` — Fix a specific accessibility finding
- Added `/ios:a11y:fix-batch` — Fix top N accessibility findings in batch
- Added `/ios:a11y:review-buttons` — Review buttons for WCAG compliance
- Added `/ios:a11y:review-headings` — Review heading structure
- Added `/ios:a11y:review-modals` — Review modal focus management
