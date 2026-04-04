# Simulator Commands Reference

Detailed MCP and xcrun simctl commands for iOS simulator management.

## MCP Tools

### List Simulators
```swift
mcp__xcodebuildmcp__list_sims()
```

### Boot Simulator
```swift
mcp__xcodebuildmcp__boot_sim({
  simulatorId: 'iPhone-16-Pro-UUID'
})
mcp__xcodebuildmcp__open_sim({
  simulatorId: 'iPhone-16-Pro-UUID'
})
```

### Install App
```swift
mcp__xcodebuildmcp__install_app_sim({
  simulatorId: 'UUID',
  appPath: '/path/to/MyApp.app'
})
```

### Launch App
```swift
mcp__xcodebuildmcp__launch_app_sim({
  simulatorId: 'UUID',
  bundleId: 'com.myapp.bundle'
})
```

### Stop App
```swift
mcp__xcodebuildmcp__stop_app_sim({
  simulatorId: 'UUID',
  bundleId: 'com.myapp.bundle'
})
```

### Screenshot
```swift
mcp__xcodebuildmcp__screenshot({
  simulatorId: 'UUID',
  outputPath: '/path/to/screenshot.png'
})
```

## Fallback Commands (without MCP)

### List
```bash
xcrun simctl list devices available
```

### Boot
```bash
xcrun simctl boot "iPhone 16 Pro"
open -a Simulator
```

### Shutdown
```bash
xcrun simctl shutdown booted
```

### Install
```bash
xcrun simctl install booted MyApp.app
```

### Launch
```bash
xcrun simctl launch booted com.myapp.bundle
```

### Screenshot
```bash
xcrun simctl io booted screenshot screenshot.png
```

## Troubleshooting

- **Simulator won't boot**: Run `mcp__xcodebuildmcp__doctor` or `xcrun simctl diagnose`
- **App install fails**: Verify `.app` bundle is built for simulator (not device) architecture
- **UUID not found**: Always call `list_sims` first to get current UDIDs — they can change after Xcode updates
- **Animations slow tests**: Pass `--uitesting` launch argument to disable animations in app code
