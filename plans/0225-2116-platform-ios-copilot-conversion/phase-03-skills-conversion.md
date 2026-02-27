# Phase 3: Skills Conversion

## Priority
P1

## Status
pending

## Overview
Convert 4 main skills + 17 reference files to GitHub Copilot instruction format.

## Source Files

### Main Skills (4)

| File | Lines | References |
|------|-------|------------|
| `skills/ios/development/SKILL.md` | 215 | 3 files |
| `skills/ios/accessibility/SKILL.md` | 41 | 11 files |
| `skills/ios/ui-lib/SKILL.md` | 18 | 2 files |
| `skills/ios/rag/SKILL.md` | 371 | 1 file |

### Reference Files (17)

**Development (3):**
- `references/development.md` - Core patterns
- `references/build.md` - Build/simulator
- `references/tester.md` - Testing strategies

**Accessibility (11):**
- `references/a11y-core.md`
- `references/a11y-buttons.md`
- `references/a11y-forms.md`
- `references/a11y-headings.md`
- `references/a11y-focus.md`
- `references/a11y-images.md`
- `references/a11y-colors-contrast.md`
- `references/a11y-testing.md`
- `references/a11y-mode-guidance.md`
- `references/a11y-mode-audit.md`
- `references/a11y-mode-fix.md`

**UI Lib (2):**
- `references/components.md`
- `references/design-system.md`

**RAG (1):**
- `references/query-patterns.md`

## Strategy: Merge vs Separate

### Merge Strategy (Development, Accessibility, UI Lib)
- Main SKILL.md + all references → single `.instructions.md`
- Reason: References are tightly coupled
- Result: 3 large instruction files

### Separate Strategy (RAG)
- Main SKILL.md → `ios-rag.instructions.md`
- References → kept inline or separate if large
- Reason: Query patterns are lookup-focused

## Target Files

| Target | applyTo | Strategy |
|--------|---------|----------|
| `instructions/ios-development.instructions.md` | `"**/*.swift"` | Merge |
| `instructions/ios-accessibility.instructions.md` | `"**/*.swift"` | Merge |
| `instructions/ios-ui-lib.instructions.md` | `"**/*.swift"` | Merge |
| `instructions/ios-rag.instructions.md` | `"**/*"` | Separate |

## Conversion Steps

### 1. Transform Frontmatter

**Before (Claude):**
```yaml
---
name: ios/development
description: Modern iOS development with Swift 6...
keywords: [ios, swift, swiftui, uikit, xcode]
platforms: [ios]
triggers: [".swift", ".xcodeproj", ".xcworkspace"]
agent-affinity: [epost-ios-developer]
user-invocable: false
---
```

**After (Copilot):**
```yaml
---
applyTo: "**/*.swift"
description: "Modern iOS development with Swift 6, SwiftUI, UIKit, and XcodeBuildMCP integration"
---
```

### 2. Merge Reference Content

For each skill with references:

```
# Main SKILL.md content
[Keep intro, purpose, when active sections]

## Reference: Development Patterns
[Content from references/development.md]

## Reference: Build & Simulator
[Content from references/build.md]

## Reference: Testing Strategies
[Content from references/tester.md]
```

### 3. Add Activation Section

```markdown
## Activation

This instruction applies when working with:
- Swift source files (.swift)
- Xcode projects (.xcodeproj, .xcworkspace)
- SwiftUI views and view models
- iOS app development
```

### 4. Remove Claude-Specific Content

| Remove | Reason |
|--------|--------|
| `agent-affinity:` | Not applicable |
| `user-invocable:` | Not applicable |
| `keywords:` | Not needed (use applyTo) |
| `platforms:` | Not needed |
| `.claude/skills/` paths | Replace with `.github/instructions/` |

## Skill-by-Skill Conversion

### ios-development.instructions.md

**Source:** SKILL.md + development.md + build.md + tester.md
**Estimated Lines:** ~600

**Structure:**
```markdown
---
applyTo: "**/*.swift"
description: "Modern iOS development with Swift 6, SwiftUI, UIKit, and XcodeBuildMCP integration"
---

# iOS Development Instruction

## Purpose
[From SKILL.md]

## When to Use
[From SKILL.md]

## Swift 6 Concurrency
[From development.md]

## SwiftUI vs UIKit
[From development.md]

## Architecture Patterns
[From development.md]

## Navigation
[From development.md]

## Networking
[From development.md]

## Persistence
[From development.md]

## Common UI Components
[From development.md]

## Build & Simulator
[From build.md]

## Testing Strategies
[From tester.md]

## Activation
This instruction applies when working with Swift files.
```

### ios-accessibility.instructions.md

**Source:** SKILL.md + all 11 a11y reference files
**Estimated Lines:** ~800

**Structure:**
```markdown
---
applyTo: "**/*.swift"
description: "WCAG 2.1 AA compliance rules for iOS — VoiceOver, UIKit, SwiftUI accessibility patterns"
---

# iOS Accessibility Instruction

## Purpose
[From SKILL.md]

## Core Principles
[From a11y-core.md]

## Button Accessibility
[From a11y-buttons.md]

## Form Accessibility
[From a11y-forms.md]

## Heading Structure
[From a11y-headings.md]

## Focus Management
[From a11y-focus.md]

## Image Accessibility
[From a11y-images.md]

## Color & Contrast
[From a11y-colors-contrast.md]

## Testing
[From a11y-testing.md]

## Operating Modes

### Guidance Mode
[From a11y-mode-guidance.md]

### Audit Mode
[From a11y-mode-audit.md]

### Fix Mode
[From a11y-mode-fix.md]

## Activation
This instruction applies when working with Swift UI files.
```

### ios-ui-lib.instructions.md

**Source:** SKILL.md + components.md + design-system.md
**Estimated Lines:** ~200

**Structure:**
```markdown
---
applyTo: "**/*.swift"
description: "iOS theme UI library: SwiftUI components and design tokens"
---

# iOS UI Library Instruction

## Purpose
[From SKILL.md]

## Components
[From components.md]

## Design System
[From design-system.md]

## Activation
This instruction applies when working with SwiftUI components.
```

### ios-rag.instructions.md

**Source:** SKILL.md + query-patterns.md (inline)
**Estimated Lines:** ~400

**Structure:**
```markdown
---
applyTo: "**/*"
description: "iOS codebase RAG — vector search for Swift app code, UIKit/SwiftUI components"
---

# iOS RAG Instruction

## Purpose
[From SKILL.md]

## Server Connection
[From SKILL.md]

## Indexed Repositories
[From SKILL.md]

## Query Patterns
[From SKILL.md + query-patterns.md]

## Filter Reference
[From SKILL.md]

## Examples
[From SKILL.md]

## Troubleshooting
[From SKILL.md]

## Activation
This instruction applies when searching for iOS code patterns.
```

## Implementation

```bash
# Create instruction files
mkdir -p packages/github-copilot/instructions
touch packages/github-copilot/instructions/ios-development.instructions.md
touch packages/github-copilot/instructions/ios-accessibility.instructions.md
touch packages/github-copilot/instructions/ios-ui-lib.instructions.md
touch packages/github-copilot/instructions/ios-rag.instructions.md
```

## Success Criteria

- [ ] All 4 main skills converted
- [ ] All 17 reference files merged appropriately
- [ ] Correct applyTo patterns
- [ ] No Claude-specific frontmatter
- [ ] Content sections preserved
- [ ] Activation section added
- [ ] File sizes reasonable (<1000 lines each)

## Validation

1. Check each file has valid YAML frontmatter
2. Verify applyTo matches skill domain
3. Ensure all reference content included
4. Test file not too large for context
5. Confirm no broken internal links
