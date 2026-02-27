# Phase 4: Snippet Conversion

## Priority
P2

## Status
pending

## Overview
Convert CLAUDE.snippet.md to copilot-instructions.md format.

## Source File

| File | Lines |
|------|-------|
| `CLAUDE.snippet.md` | 23 |

## Target File

| Target | Notes |
|--------|-------|
| `copilot-instructions.md` | **No YAML frontmatter** |

## Key Difference

**IMPORTANT:** `copilot-instructions.md` is the ONLY instruction file that uses plain Markdown WITHOUT YAML frontmatter.

## Conversion Steps

### 1. Remove Command Syntax

**Before:**
```markdown
### Commands
- `/ios:cook` — Implement iOS features (Swift, SwiftUI)
- `/ios:test` — Run iOS unit and UI tests
```

**After:**
```markdown
### Custom Prompts

This project has custom prompts available in `.github/prompts/`:

- **iOS feature implementation** — Ask "implement iOS feature" or use ios-cook prompt
- **iOS testing** — Ask "run iOS tests" or use ios-test prompt
```

### 2. Convert Command Triggers

| Claude Command | Copilot Trigger |
|----------------|-----------------|
| `/ios:cook` | "implement iOS feature" or ios-cook prompt |
| `/ios:test` | "run iOS tests" or ios-test prompt |
| `/ios:debug` | "debug iOS issue" or ios-debug prompt |
| `/ios:simulator` | "manage simulator" or ios-simulator prompt |
| `/ios:a11y:audit` | "audit accessibility" or ios-a11y-audit prompt |
| `/ios:a11y:fix` | "fix accessibility" or ios-a11y-fix prompt |
| `/ios:a11y:fix-batch` | "fix accessibility batch" |
| `/ios:a11y:review` | "review accessibility" |

### 3. Adapt Agent References

**Before:**
```markdown
### Agents
- `epost-ios-developer` — iOS platform specialist
- `epost-a11y-specialist` — iOS accessibility auditing
```

**After:**
```markdown
### Related Instructions

- `epost-ios-developer.instructions.md` — iOS development patterns
- `epost-a11y-specialist.instructions.md` — Accessibility patterns
```

### 4. Preserve Tech Stack

Keep tech stack section unchanged:
```markdown
### Tech Stack
- **Language**: Swift 6
- **UI**: SwiftUI + UIKit
- **Minimum Target**: iOS 18+
- **Testing**: XCTest, XCUITest
- **Build**: Xcode, XcodeBuildMCP
```

## Complete Target File

```markdown
# iOS Platform

GitHub Copilot instructions for iOS development with Swift 6, SwiftUI, and UIKit.

## Tech Stack

- **Language**: Swift 6
- **UI**: SwiftUI + UIKit
- **Minimum Target**: iOS 18+
- **Testing**: XCTest, XCUITest
- **Build**: Xcode, XcodeBuildMCP

## Custom Prompts

This project has custom prompts available in `.github/prompts/`:

- **iOS feature implementation** — Ask "implement iOS feature" or use `ios-cook` prompt
- **iOS testing** — Ask "run iOS tests" or use `ios-test` prompt
- **iOS debugging** — Ask "debug iOS issue" or use `ios-debug` prompt
- **Simulator management** — Ask "manage simulator" or use `ios-simulator` prompt
- **Accessibility audit** — Ask "audit accessibility" or use `ios-a11y-audit` prompt
- **Accessibility fix** — Ask "fix accessibility" or use `ios-a11y-fix` prompt
- **Accessibility batch fix** — Use `ios-a11y-fix-batch` prompt
- **Accessibility review** — Ask "review accessibility" or use `ios-a11y-review` prompt

## Related Instructions

- `epost-ios-developer.instructions.md` — iOS platform specialist patterns
- `ios-development.instructions.md` — Swift 6, SwiftUI, UIKit development patterns
- `ios-accessibility.instructions.md` — WCAG 2.1 AA accessibility rules
- `ios-ui-lib.instructions.md` — UI library components and tokens
- `ios-rag.instructions.md` — Codebase vector search patterns

## Trigger Phrases

Use these phrases to activate iOS-specific assistance:

- "implement iOS feature" — Feature implementation
- "run iOS tests" — Testing
- "debug iOS" — Debugging
- "simulator" — Simulator operations
- "accessibility" / "VoiceOver" / "WCAG" — Accessibility

## Development Guidelines

When working with iOS code:

1. Default to SwiftUI for new features
2. Use @Observable (iOS 17+) instead of ObservableObject
3. Use async/await, not completion handlers
4. Use MainActor for all UI updates
5. Write tests for business logic
6. Follow WCAG 2.1 AA for accessibility
```

## Implementation

```bash
# Create copilot-instructions.md (no frontmatter!)
touch packages/github-copilot/copilot-instructions.md
```

## Success Criteria

- [ ] No YAML frontmatter
- [ ] Commands converted to natural language
- [ ] Agents converted to Related Instructions
- [ ] Tech stack preserved
- [ ] Trigger phrases documented
- [ ] Development guidelines included

## Validation

1. Verify NO frontmatter (plain Markdown only)
2. Check no `/command` syntax remains
3. Ensure all commands have natural language equivalents
4. Confirm Related Instructions reference correct files
