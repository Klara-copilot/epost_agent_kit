# Phase 5: iOS Platform Agents

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 4](phase-04-functional-verification.md)
- Research: [Cross-Platform Formats](research/researcher-01-cross-platform-formats.md)

## Overview
- **Priority**: P2
- **Status**: pending
- **Effort**: 3h
- **Description**: Create iOS platform agents (`ios/implementer`, `ios/tester`, `ios/simulator`), reorganize iOS skills, and update existing iOS commands to reference new agents.

## Key Insights
- iOS commands already exist: `ios/cook.md`, `ios/debug.md`, `ios/simulator.md`, `ios/test.md`
- `ios/cook.md` references `ios-developer` agent which does NOT exist; this is a known broken reference
- iOS skill already exists at `skills/ios-development/` with sub-skills
- MCP tools available: `xcodebuildmcp` for build, test, discover, doctor
- `ios/cook.md` already has `allowed-tools` restricting to specific MCP tools

## Requirements

### Functional

**Create agents**:
- `ios/implementer.md` - Swift 6, SwiftUI, UIKit, iOS 18+ specialist
- `ios/tester.md` - XCTest, XCUITest specialist
- `ios/simulator.md` - Simulator management specialist

**Reorganize skills**:
- `skills/ios-development/` -> `skills/ios/ios-development/`

**Update commands**:
- `ios/cook.md`: `agent: ios-developer` -> `agent: ios-implementer`
- `ios/debug.md`: update agent field
- `ios/simulator.md`: update agent field
- `ios/test.md`: update agent field

### Non-Functional
- iOS agents must include MCP tool references (xcodebuildmcp)
- Agents self-contained; no web/android assumptions
- Under 200 lines per agent

## Architecture

```
Global implementer (detects .swift, Package.swift, .xcodeproj)
  |
  +-- Spawns ios/implementer
        |
        +-- Uses skills: ios/ios-development
        +-- Uses shared skills: databases
        +-- Tools: Read, Write, Edit, Bash, Grep, Glob + xcodebuildmcp MCP tools
        +-- Build: xcodebuild or MCP build_sim
        +-- Test: delegates to ios/tester

Global tester -> ios/tester
Global debugger -> ios/debugger (implicit, via ios/implementer for now)
```

## Related Code Files

### Create
- `.claude/agents/ios/implementer.md`
- `.claude/agents/ios/tester.md`
- `.claude/agents/ios/simulator.md`
- `.claude/skills/ios/` directory

### Move
- `.claude/skills/ios-development/` -> `.claude/skills/ios/ios-development/`

### Modify
- `.claude/commands/ios/cook.md` - Update agent field
- `.claude/commands/ios/debug.md` - Update agent field
- `.claude/commands/ios/simulator.md` - Update agent field
- `.claude/commands/ios/test.md` - Update agent field
- `.claude/agents/implementer.md` - Add ios/implementer delegation
- `.claude/agents/tester.md` - Add ios/tester delegation
- `.claude/agents/debugger.md` - Add ios context awareness

## Implementation Steps

### Step 1: Create agents directory
```bash
mkdir -p .claude/agents/ios
```

### Step 2: Create ios/implementer.md
```yaml
---
name: ios-implementer
description: iOS platform implementation specialist. Executes Swift 6, SwiftUI, UIKit development tasks. Uses xcodebuildmcp for build verification. Spawned by global implementer for iOS-specific work.
tools: Read, Write, Edit, Bash, Grep, Glob, mcp__xcodebuildmcp__discover_projs, mcp__xcodebuildmcp__list_schemes, mcp__xcodebuildmcp__build_sim, mcp__xcodebuildmcp__test_sim, mcp__xcodebuildmcp__doctor
model: inherit
color: blue
---
```
Body includes:
- Tech stack: Swift 6, iOS 18+, SwiftUI (default), UIKit (when needed)
- Architecture: MVVM default, TCA for complex features
- Skills: ios/ios-development
- Build: MCP build_sim preferred, xcodebuild fallback
- Patterns: @Observable, async/await, MainActor
- Content adapted from current ios/cook.md command body

### Step 3: Create ios/tester.md
```yaml
---
name: ios-tester
description: iOS platform testing specialist. Runs XCTest and XCUITest suites. Uses xcodebuildmcp for test execution. Spawned by global tester for iOS-specific work.
tools: Read, Write, Edit, Bash, Grep, Glob, mcp__xcodebuildmcp__test_sim, mcp__xcodebuildmcp__discover_projs, mcp__xcodebuildmcp__list_schemes
model: inherit
color: yellow
---
```
Body: XCTest patterns, coverage, test_sim MCP usage

### Step 4: Create ios/simulator.md
```yaml
---
name: ios-simulator
description: iOS simulator management specialist. Manages simulator lifecycle, boot, install, and screenshot capture. Spawned for simulator-related tasks.
tools: Read, Bash, Grep, Glob, mcp__xcodebuildmcp__discover_projs, mcp__xcodebuildmcp__list_schemes, mcp__xcodebuildmcp__build_sim
model: inherit
color: orange
---
```
Body: Simulator commands, device management, screenshot capture

### Step 5: Reorganize skills
```bash
mkdir -p .claude/skills/ios
mv .claude/skills/ios-development .claude/skills/ios/ios-development
```

### Step 6: Update iOS commands
- `ios/cook.md`: `agent: ios-developer` -> `agent: ios-implementer`
- `ios/debug.md`: update agent field
- `ios/simulator.md`: `agent:` -> `ios-simulator`
- `ios/test.md`: `agent:` -> `ios-tester`

### Step 7: Update global agents
- Add ios delegation targets to implementer.md, tester.md, debugger.md

### Step 8: Verify
- All 3 iOS agents valid YAML
- iOS commands reference correct agents
- iOS skill at new path
- MCP tools listed in agent frontmatter

## Todo List

- [ ] Create `.claude/agents/ios/` directory
- [ ] Create ios/implementer.md with MCP tools
- [ ] Create ios/tester.md with MCP tools
- [ ] Create ios/simulator.md with MCP tools
- [ ] Move ios-development skill to ios/ios-development
- [ ] Update ios/cook.md agent field
- [ ] Update ios/debug.md agent field
- [ ] Update ios/simulator.md agent field
- [ ] Update ios/test.md agent field
- [ ] Update global implementer, tester, debugger delegation
- [ ] Verify all references

## Success Criteria

- 3 iOS agents at `.claude/agents/ios/{implementer,tester,simulator}.md`
- iOS skill at `.claude/skills/ios/ios-development/`
- All 4 iOS commands reference valid agents
- MCP tools included in iOS agent tool lists
- No `ios-developer` references remain

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| xcodebuildmcp not available in all environments | MCP tools fail silently | Include Bash fallback commands in agent prompts |
| Nested agent dirs not supported | ios/ agents not found | Use flattened names (ios-implementer.md at root) per Phase 4 findings |

## Security Considerations
- MCP tool access scoped to xcodebuildmcp only (already in settings.json)
- No new tool permissions beyond existing

## Next Steps
- Phase 6 creates Android platform agents (skeleton)
- Phase 7 builds CLI that discovers all platform agents/skills
