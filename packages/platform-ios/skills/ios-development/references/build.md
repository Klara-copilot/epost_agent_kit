# iOS Build & Simulator Management

## Purpose
Build systems, simulator management, Xcode workflows, and XcodeBuildMCP integration patterns.

## Build Commands

### Simulator
```bash
xcodebuild -workspace MyApp.xcworkspace \
  -scheme MyApp -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro'
```

### Device
```bash
xcodebuild -workspace MyApp.xcworkspace \
  -scheme MyApp -sdk iphoneos -configuration Release
```

### Debug vs Release
```bash
xcodebuild -scheme MyApp -configuration Debug   # default
xcodebuild -scheme MyApp -configuration Release
```

List schemes: `xcodebuild -list -workspace MyApp.xcworkspace`

## XcodeBuildMCP Tools (preferred over xcrun/xcodebuild)

| Tool | Purpose | Key Params |
|------|---------|-----------|
| `discover_projs` | Find projects in workspace | `workspaceRoot` |
| `list_schemes` | List available schemes | `projectPath` |
| `show_build_settings` | Show build settings | `projectPath, scheme` |
| `get_app_bundle_id` | Get bundle ID | `projectPath, scheme` |
| `build_sim` | Build for simulator | `projectPath, scheme, simulatorId` |
| `build_run_sim` | Build + run on simulator | `projectPath, scheme, simulatorId` |
| `list_sims` | List available simulators | — |
| `boot_sim` | Boot simulator | `simulatorId` |
| `open_sim` | Open Simulator.app | `simulatorId` |
| `install_app_sim` | Install .app | `simulatorId, appPath` |
| `launch_app_sim` | Launch app | `simulatorId, bundleId` |
| `stop_app_sim` | Stop running app | `simulatorId, bundleId` |
| `get_sim_app_path` | App container path | `simulatorId, bundleId` |
| `describe_ui` | UI hierarchy (**call first before any tap**) | `simulatorId` |
| `tap` | Tap at coordinates | `simulatorId, x, y` |
| `swipe` | Swipe gesture | `simulatorId, startX, startY, endX, endY` |
| `type_text` | Type text | `simulatorId, text` |
| `key_press` | Press key | `simulatorId, key` |
| `screenshot` | Take screenshot | `simulatorId, outputPath` |
| `start_sim_log_cap` | Start log capture | `simulatorId, bundleId` |
| `stop_sim_log_cap` | Get captured logs | `sessionId` |
| `test_sim` | Run tests on simulator | `projectPath, scheme, simulatorId` |
| `test_device` | Run tests on device | `projectPath, scheme, deviceId` |
| `clean` | Clean build folder | `projectPath, scheme` |
| `doctor` | Run diagnostics | — |
| `swift_package_build` | Build Swift Package | `packagePath` |
| `swift_package_test` | Test Swift Package | `packagePath` |

**Workspace-aware variants**: append `_ws` suffix (e.g. `build_sim_ws`, `test_sim_ws`) for projects with SPM dependencies.

## Build Settings

### Debug vs Release
| Setting | Debug | Release |
|---------|-------|---------|
| `SWIFT_OPTIMIZATION_LEVEL` | `-Onone` | `-O` |
| `ONLY_ACTIVE_ARCH` | `YES` | `NO` |
| `ENABLE_TESTABILITY` | `YES` | `NO` |
| `GCC_OPTIMIZATION_LEVEL` | `0` | `s` |
| `SWIFT_WHOLE_MODULE_OPTIMIZATION` | `NO` | `YES` |
| Precompile Prefix Header | `YES` (if bridging header) | — |

### xcconfig
```ini
// Debug.xcconfig
SWIFT_OPTIMIZATION_LEVEL = -Onone
SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG

// Release.xcconfig
SWIFT_OPTIMIZATION_LEVEL = -O
SWIFT_ACTIVE_COMPILATION_CONDITIONS = RELEASE
```

## Code Signing

| Error | Fix |
|-------|-----|
| "No signing certificate found" | Xcode → Accounts → Download Manual Profiles |
| "Profile doesn't include signing certificate" | Regenerate profile in Apple Developer Portal |
| "Bundle identifier differs from entitlement" | Match bundle ID in Xcode with Developer Portal |

## Swift Package Manager

```bash
swift build           # Build package
swift test            # Test package
swift package resolve # Resolve dependencies
swift package update  # Update
```

## Build Optimization

**Measure first — optimize second.** Never change settings without a baseline benchmark.

### Step 1: Benchmark
```bash
# Clean build (CI/fresh clone worst case)
time xcodebuild -workspace MyApp.xcworkspace -scheme MyApp \
  -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' \
  clean build 2>&1 | tail -5

# Incremental build (single-file change common case)
touch MyApp/SomeFile.swift
time xcodebuild -workspace MyApp.xcworkspace -scheme MyApp \
  -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' \
  build 2>&1 | tail -5
```
Record both baselines before making any changes.

### Step 2: Find Hotspots
```bash
# Enable build timing in Xcode log
defaults write com.apple.dt.Xcode ShowBuildOperationDuration -bool YES
# Enable parallel builds
defaults write com.apple.dt.Xcode BuildSystemScheduleInherentlyParallelCommandsEnabled -bool YES
```
Common hotspot causes: large type-inferred expressions, complex generics, missing type annotations.

### Step 3: Apply Settings (table above)

### Step 4: Verify
Re-run benchmark. 1s improvement on 50 builds/day = 3.5 hrs/dev/year.

## Common Build Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "No such module" | Package not resolved | File → Packages → Reset Package Caches, clean |
| "Command CompileSwift failed" | Syntax error | Check Swift syntax, Cmd+Shift+K clean |
| "Code signing error" | Certificate/profile mismatch | Add account in Xcode, re-download certificates |

## Rules

- Always call `describe_ui` before UI automation taps (MCP)
- Use `_ws` tools for projects with SPM/workspace dependencies
- Use simulator for iteration, physical device for final validation
- Run `doctor` when encountering unexpected MCP errors
- Use xcworkspace (not xcodeproj) when using SPM
