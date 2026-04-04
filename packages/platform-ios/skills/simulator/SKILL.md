---
name: simulator
description: (ePost) Manages iOS simulators — list, boot, open, and launch apps. Use when user wants to list, boot, open, or manage iOS simulators, or launch the app on a simulator
argument-hint: "[--list | --boot | --shutdown | --install | --launch | --screenshot]"
user-invocable: true
context: fork
agent: epost-fullstack-developer
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - mcp__xcodebuildmcp__list_sims
  - mcp__xcodebuildmcp__boot_sim
  - mcp__xcodebuildmcp__open_sim
  - mcp__xcodebuildmcp__install_app_sim
  - mcp__xcodebuildmcp__launch_app_sim
  - mcp__xcodebuildmcp__stop_app_sim
  - mcp__xcodebuildmcp__screenshot
  - mcp__xcodebuildmcp__describe_ui
  - mcp__xcodebuildmcp__doctor
metadata:
  keywords:
    - simulator
    - ios-simulator
    - boot
    - xcrun
    - device
  triggers:
    - boot simulator
    - list simulators
    - open simulator
    - launch app on simulator
---

## Delegation — REQUIRED

This skill MUST run via `epost-fullstack-developer`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/simulator`
- **Arguments**: `$ARGUMENTS` (full argument string from Skill invocation)
- If no arguments: state "no arguments — use auto-detection"

# iOS Simulator Command

List, boot, shutdown, and manage iOS simulators using XcodeBuildMCP or xcrun simctl.

## Usage
```
/simulator --list                    # List available simulators
/simulator --boot "iPhone 16 Pro"    # Boot simulator
/simulator --shutdown                # Shutdown booted simulator
/simulator --install MyApp.app       # Install app
/simulator --launch com.myapp.bundle # Launch app
/simulator --screenshot              # Take screenshot
```

## Your Process

1. **Parse Action**
   - `--list`: List available simulators
   - `--boot <name>`: Boot specific simulator
   - `--shutdown`: Shutdown booted simulator
   - `--install <app>`: Install app on simulator
   - `--launch <bundleId>`: Launch app by bundle ID
   - `--screenshot`: Take screenshot of simulator

2. **Execute Action (MCP preferred)**
   - Use MCP tools if available
   - Fallback: xcrun simctl commands via Bash

## Quick Reference

| Action | MCP Tool | Fallback |
|--------|----------|----------|
| List | `list_sims()` | `xcrun simctl list devices available` |
| Boot | `boot_sim({ simulatorId })` + `open_sim` | `xcrun simctl boot "iPhone 16 Pro"` |
| Shutdown | — | `xcrun simctl shutdown booted` |
| Install | `install_app_sim({ simulatorId, appPath })` | `xcrun simctl install booted MyApp.app` |
| Launch | `launch_app_sim({ simulatorId, bundleId })` | `xcrun simctl launch booted com.bundle` |
| Screenshot | `screenshot({ simulatorId, outputPath })` | `xcrun simctl io booted screenshot out.png` |

Always call `list_sims` first to get current UDIDs before booting.

## Rules
- Use MCP tools when available
- Always use `list_sims` to get device UDIDs before booting
- Shutdown simulators when done to free resources
- Use simulator for faster iteration, device for final validation

## References

- `references/simulator-commands.md` — Full MCP tool signatures, xcrun fallbacks, troubleshooting

## Completion Report

```markdown
## Simulator Operation Complete
### Action: [performed] — Success / Failed
### Device: iPhone 16 Pro | UDID: [UUID] | Status: Booted / Shutdown
### App (if applicable): Bundle ID / App Path
```
