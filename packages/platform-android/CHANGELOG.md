# Changelog: platform-android

All notable changes to the `platform-android` package will be documented in this file.

## [Unreleased]

### Added
- `android-testing` skill — Compose UI Testing semantics/actions, Hilt @TestInstallIn patterns, Turbine Flow testing, MockK, Room in-memory DB
- MCP servers via `settings.json`: replicant-mcp (build/test/emulator control) and Google Developer Knowledge MCP (placeholder API key)
- Code review rules: MEMORY-001 (no Activity/View in singletons — LW critical), MEMORY-002..004 (BroadcastReceiver, custom View listeners, Handler/Runnable — Escalated)
- Code review rules: LOGGING-001 (Timber required; Log.*/println() forbidden — LW high, grounded in CONV-0002)
- FLOW-005: `stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), initialValue)` pattern

### Fixed
- `error-handling.md` logging strategy: replaced `Log.d`/`Log.e`/`Log.w` custom Logger object with Timber — was inconsistent with LOGGING-001 and CONV-0002
- `asana-muji/evals/eval-set.json`: replaced stub placeholder with 9 real eval cases
- `asana-muji/references/task-templates.md`: stub replaced with Feature/Bug/Design Token templates

### Changed
- Updated `epost-android-developer` skill bindings and `memory: project`
- `compose-best-practices.md` 444 → 375 lines: removed generic Material 3/Dynamic Colors sections; Testing Considerations collapsed to pointer to `android-testing` skill

## [1.0.0] - 2026-02-08

Initial release.

### Agents

- Added `epost-android-developer` — Android platform specialist (Kotlin, Jetpack Compose)

### Skills

- Added `android/android-development` — Kotlin, Jetpack Compose, Room, Hilt patterns

### Commands

- Added `/android:cook` — Implement Android features (Kotlin, Compose)
- Added `/android:test` — Run Android unit and instrumented tests
