---
phase: 1
title: "Rewrite Phase 3 prompt with platform launch steps"
effort: 1h
depends: []
---

# Phase 1: Rewrite Phase 3 Prompt

## Context Links

- [Plan](./plan.md)
- `packages/core/skills/get-started/SKILL.md:179-229` -- current Phase 3 prompt block

## Overview

- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Extend the Phase 3 Agent prompt in get-started/SKILL.md to include platform-specific app launch after build, plus sudo-blocker handling

## Requirements

### Functional

1. **iOS launch sequence** (new Step 6 in Phase 3 prompt):
   - Detect schemes: `xcodebuild -list` or read `.xcodeproj`/`.xcworkspace`
   - Build for simulator: `xcodebuild -scheme {scheme} -destination 'platform=iOS Simulator,name=iPhone 16 Pro' build`
   - Boot simulator: `xcrun simctl boot "iPhone 16 Pro"` + `open -a Simulator`
   - Install: `xcrun simctl install booted {app_path}`
   - Launch: `xcrun simctl launch booted {bundle_id}`
   - Reference: "For advanced simulator management, use `/simulator` skill"
   - If XcodeBuildMCP tools available, prefer MCP over xcrun simctl

2. **Android launch sequence** (new Step 7 in Phase 3 prompt):
   - Build debug APK: `./gradlew assembleDebug` or `./gradlew installDebug`
   - If emulator available: `emulator -list-avds`, boot first AVD, install + launch
   - If device connected: `adb devices`, `adb install`, `adb shell am start -n {package}/{activity}`
   - Fallback: list available AVDs/devices, report what user needs to do

3. **Sudo-blocker handling** (add to Step 1 in Phase 3 prompt):
   - Try tool install/setup without sudo first
   - If a step fails due to permissions (e.g., `xcode-select --install`), skip it
   - Continue with all non-sudo steps (bundle install, pod install, build, xcrun simctl, etc.)
   - At end, list ONLY the sudo-blocked steps as "Manual steps requiring elevated permissions"

### Non-Functional

- Keep Phase 3 prompt under 120 lines (currently ~45 lines)
- Maintain existing Steps 1-5 structure; add Steps 6-7 for launch
- Platform detection: check for `*.xcodeproj`/`*.xcworkspace` (iOS) or `build.gradle*` (Android)

## Files to Modify

- `packages/core/skills/get-started/SKILL.md` -- Phase 3 prompt block (lines 179-229)

## Files to Create

- None

## Implementation Steps

1. **Add sudo-handling instruction to Step 1** (existing tool install step):
   - After "Check what's missing and install via Homebrew":
   - Add: "If any step requires sudo and fails, skip it. Continue with everything else. Collect blocked steps for final report."

2. **Add Step 6 -- Launch on iOS Simulator** (after existing Step 5):
   - Guard: only if `*.xcodeproj` or `*.xcworkspace` found
   - Detect scheme names
   - Build for simulator target
   - Boot simulator, install app, launch app
   - Note: "For simulator lifecycle commands, the `/simulator` skill provides full MCP + xcrun simctl support"

3. **Add Step 7 -- Launch on Android Emulator/Device** (after Step 6):
   - Guard: only if `build.gradle` or `build.gradle.kts` found
   - Build debug variant
   - Detect connected device or available AVD
   - Install and launch

4. **Update Output section** to include launch status:
   - Add: "App launch: running on {device/simulator} / not launched (reason)"
   - Add: "Manual steps (sudo required): {list or 'none'}"

## Todo List

- [x] Add sudo-handling to Step 1 instructions
- [x] Add Step 6 (iOS simulator launch)
- [x] Add Step 7 (Android emulator/device launch)
- [x] Add `/simulator` skill reference in iOS section
- [x] Update Output section template
- [x] Verify total prompt stays under 120 lines

## Success Criteria

- Phase 3 prompt includes iOS xcodebuild + simctl boot/install/launch
- Phase 3 prompt includes Android gradlew + adb/emulator install/launch
- Sudo-blocked steps gracefully skipped, collected, reported at end
- `/simulator` skill referenced for iOS projects

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Prompt too long for subagent context | Med | Keep concise, use bullet format not prose |
| XcodeBuildMCP not available in all envs | Low | Fallback to xcrun simctl already standard |

## Security Considerations

- Sudo handling explicitly avoids escalating -- blocked steps are reported, not forced
