# Changelog: platform-ios

All notable changes to the `platform-ios` package will be documented in this file.

## [Unreleased]

### Changed
- Added `memory: project` to `epost-a11y-specialist` agent
- Updated `epost-ios-developer` skill bindings and `memory: project`

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
