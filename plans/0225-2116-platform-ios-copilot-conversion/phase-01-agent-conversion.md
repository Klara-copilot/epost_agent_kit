# Phase 1: Agent Conversion

## Priority
P1

## Status
pending

## Overview
Convert 1 iOS agent to GitHub Copilot instruction format.

## Source Files

| File | Lines | Description |
|------|-------|-------------|
| `agents/epost-ios-developer.md` | 351 | iOS platform specialist |

## Target Files

| Target | applyTo |
|--------|---------|
| `instructions/epost-ios-developer.instructions.md` | `"**/*.swift"` |

## Conversion Steps

### 1. Transform Frontmatter

**Before (Claude):**
```yaml
---
name: epost-ios-developer
description: (ePost) iOS platform specialist...
tools: Read, Write, Edit, Bash, Grep, Glob, mcp__xcodebuildmcp__...
model: sonnet
color: blue
skills: [core, ios/development, debugging]
---
```

**After (Copilot):**
```yaml
---
applyTo: "**/*.swift"
description: "iOS platform specialist combining implementation, testing, and simulator management. Executes Swift 6, SwiftUI, UIKit development with XCTest and simulator operations."
---
```

### 2. Remove Claude-Specific Content

Remove these sections/elements:
- `tools:` list (not applicable to Copilot)
- `model: sonnet` (not applicable)
- `color: blue` (not applicable)
- `memory:` references
- `permissionMode` references
- MCP tool references in content (adapt to natural language)

### 3. Adapt Content

**MCP Tool References:**
Replace tool names with natural language descriptions:

| Claude | Copilot |
|--------|---------|
| `mcp__xcodebuildmcp__discover_projs` | "Use Xcode to discover projects" |
| `mcp__xcodebuildmcp__build_sim` | "Build for simulator using xcodebuild" |
| `mcp__xcodebuildmcp__test_sim` | "Run tests on simulator" |

**Skill References:**
Convert to Related Instructions section:
```markdown
## Related Instructions

- `ios-development.instructions.md` — iOS development patterns (if installed)
- `ios-accessibility.instructions.md` — WCAG 2.1 AA accessibility rules (if installed)
```

### 4. Add Usage Section

```markdown
## When to Invoke

This instruction applies when:
- Working with Swift files (.swift)
- Implementing iOS features
- Running iOS tests
- Managing iOS simulators
- Debugging iOS issues
```

### 5. Preserve All Content

Keep intact:
- All code examples
- Architecture patterns
- Testing patterns
- Build commands
- Rules section
- Table of Contents

## Implementation

```bash
# Create target file
touch packages/github-copilot/instructions/epost-ios-developer.instructions.md
```

## Success Criteria

- [ ] Frontmatter has `applyTo: "**/*.swift"`
- [ ] Description preserved in frontmatter
- [ ] No `tools`, `model`, `color` fields
- [ ] MCP tools described naturally
- [ ] Skills converted to Related Instructions
- [ ] All content sections preserved
- [ ] Usage/When to Invoke section added

## Validation

1. Check YAML frontmatter is valid
2. Verify `applyTo` pattern matches Swift files
3. Ensure no Claude-specific syntax remains
4. Confirm all code examples intact
