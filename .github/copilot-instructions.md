# ePost iOS Workspace - GitHub Copilot Instructions

**Last Updated**: 2026-02-03
**Scope**: Workspace-wide instructions for all modules

---

## Workspace Structure

This workspace contains **4 interconnected iOS modules** for Swiss Post's secure document management app:

| Module                | Purpose                      | Key Technologies                            |
| --------------------- | ---------------------------- | ------------------------------------------- |
| `luz_epost_ios/`      | Main ePost app               | UIKit, Matrix/Rust E2E encryption, Fastlane |
| `epost-ios-theme-ui/` | Design system library        | UIKit components, SwiftGen, dynamic theming |
| `luz_ios_designui/`   | High-level design components | Kingfisher, SVGKit, SkeletonView            |
| `luz_ios_login/`      | Authentication flows         | Alamofire, AppAuth, KeychainAccess          |

**Data flow**: App → `luz_ios_login` (auth) → `luz_ios_designui` → `epost-ios-theme-ui` (base components)

---

## Available Agents

Specialized GitHub Copilot agents for this workspace:

### iOS Development
- **@ios-developer** - General iOS development guidance for ePost workspace
  - Workspace structure, theme system, SDK integration patterns
  - Use for: Building features, working with Swift/UIKit, SDK integration

### Accessibility (WCAG 2.1 AA Compliance)
- **@accessibility-architect** - Real-time accessibility guidance during coding
  - Proactive WCAG 2.1 AA compliance, iOS VoiceOver best practices
  - Use for: Writing new UI code, preventing accessibility issues

- **@accessibility-auditor** - Batch accessibility auditing for CI/CD
  - Produces structured JSON reports of violations
  - Use for: Pre-commit checks, auditing code diffs, CI/CD pipelines

- **@accessibility-fixer** - Surgical fixes for documented findings
  - Applies targeted fixes without refactoring
  - Use for: Fixing known issues from findings database

### Design System
- **@figma-component-inspector** - Figma design inspection
  - Extract component specs (colors, spacing, typography)
  - Use for: Implementing designs from Figma

- **@component-doc-writer** - Component documentation generation
  - Creates usage examples, updates READMEs
  - Use for: Documenting theme components

**See** [.github/AGENTS.md](.github/AGENTS.md) for detailed agent documentation.

---

## Knowledge Bases

Agents have access to centralized knowledge:

### .ai-agents/
- `rules/accessibility/` - 8 WCAG 2.1 AA rules for iOS
- `prompts/accessibility/` - Reusable prompt templates
- `analysis/accessibility/` - Common issues and solutions
- `rules/` - General workspace rules (core, context7 usage, documentation behavior)

### .agent-knowledge/
- `epost-known-findings.json` - Documented accessibility issues (6KB)

---

## Build Commands

### Main App (from `luz_epost_ios/`)

```bash
fastlane ios buildApp           # Build using ePostDev scheme
fastlane ios DEV               # Full pipeline: build + TestFlight + Slack
./start_ePostSDK.sh            # Build XCFramework for SDK distribution
```

### Theme UI Library (from `epost-ios-theme-ui/`)

```bash
# CRITICAL: Use xcodebuild, NOT swift build (UIKit dependency)
xcodebuild -scheme ios_theme_ui -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build

make lint && make format       # Code quality checks
make xcframework-project       # Build for distribution
```

---

## Critical Conventions

### Color System (Theme UI)

```swift
// ✅ CORRECT: Use theme color pickers
view.theme_backgroundColor = ThemeColorPicker.background

// ❌ WRONG: Direct UIColor
view.backgroundColor = UIColor.white
```

### Auto Layout (Theme UI)

Use the **custom DSL** from `UIViewConstraints.swift`:

```swift
// ✅ CORRECT
view.fillSuperview(padding: .grid200)
view.anchor(top: parent.topAnchor, padding: .horizontalSides(.grid100))

// ❌ WRONG: No external libs, no raw NSLayoutConstraint
NSLayoutConstraint.activate([...])  // Don't use
```

### Border Radius (Theme UI)

```swift
// ✅ CORRECT: Use ThemeCornerStyle system
view.setBorderRadius(.primary)     // 8px fixed
view.setBorderRadius(.secondary)   // height/2 (pill)

// ❌ WRONG: Direct layer manipulation
layer.cornerRadius = 8
```

### Typography

**Font family: SwissPostSans** (NOT Frutiger Neue)

```swift
label.style = .bodyBody3           // Regular body text
label.style = .titleTitle4         // Black weight headings
```

### File Headers (Theme UI)

```swift
//  [FileName].swift
//  ios_theme_ui
//  Created by Phuong Doan on DD/MM/YY.
//  Copyright © 2025 AAVN. All rights reserved.
```

---

## Key Architectural Patterns

### Component Architecture (Theme UI)

- All UI components in `ios_theme_ui/Classes/Theme/Components/`
- 18 component categories: Avatar, Badge, Button, Chip, InputChip, Label, Segmented, SidePanel, Tabs, TextField, TitleBar, Toggle, etc.
- Components use `ThemeColorPicker` for dynamic light/dark/brand theming

### Navigation (Main App)

- `AppCoordinator` pattern for all navigation
- Entry: `main.swift` → `AppDelegate` → `AppCoordinator.start()`
- Features in `Featured Screens/[FeatureName]/` with ViewController + DataSource + Models

### API Layer (Main App)

- REST APIs in `ServerAPIs/` using Alamofire
- Examples: `LoginAPI`, `LetterBoxAPI`, `PaymentAPI`, `ArchiveLettersAPI`

### Matrix/E2E Encryption (Main App)

- Rust-based Matrix protocol in `Matrix Rust Modules/`
- Complex state machines for encrypted messaging
- Bridging via `luz_epost_ios-Bridging-Header.h`

---

## Project-Specific Gotchas

1. **50+ SPM dependencies** - Initial builds take time; don't restart Xcode during resolution
2. **Monolithic VCs** - `LetterBoxVC.swift` (~140KB), `LetterDetailsVC.swift` (~215KB) - break down when modifying
3. **5 build environments** - Dev, Staging, TEST, PROD, Design Dev - verify correct scheme
4. **SwiftGen auto-generates** `Classes/Generated/Assets.swift` - never edit manually
5. **Security-sensitive** - Keychain storage, E2E encryption, screen capture protection

---

## Accessibility Standards

This project follows:

- **WCAG 2.1 Level AA** - Web Content Accessibility Guidelines
- **iOS Accessibility Guidelines** - Apple's accessibility standards
- **VPAT Compliance** - Voluntary Product Accessibility Template

All code must meet these standards before merging.

### Accessibility Best Practices

**When Writing Code:**
1. Always include accessibility from the start
2. Use `@accessibility-architect` for real-time guidance
3. Test with VoiceOver before committing
4. Reference specific rules when uncertain

**When Reviewing Code:**
1. Run `@accessibility-auditor` on all Swift changes
2. Check for critical violations that block users
3. Provide constructive feedback with examples
4. Link to specific rules for context

**When Fixing Issues:**
1. Use `@accessibility-fixer` for known findings
2. Make surgical changes only
3. Test the fix with VoiceOver
4. Update findings database when resolved

---

## CI/CD Integration

### Pre-commit Hook Pattern

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Get staged Swift files
STAGED_SWIFT_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep "\.swift$")

if [ -n "$STAGED_SWIFT_FILES" ]; then
    echo "Running accessibility audit on staged Swift files..."
    # Use @accessibility-auditor to check each file
fi
```

### GitHub Actions Pattern

```yaml
name: Accessibility Audit
on: [pull_request]

jobs:
  accessibility-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Audit Changed Files
        run: |
          # Use @accessibility-auditor agent
          changed_files=$(git diff --name-only origin/${{ github.base_ref }}...HEAD | grep "\.swift$")
          echo "$changed_files" | while read file; do
            echo "Auditing: $file"
          done
```

---

## Reference Files

| Pattern                  | Example Files                                                    |
| ------------------------ | ---------------------------------------------------------------- |
| Component implementation | `ios_theme_ui/Classes/Theme/Components/Button/ThemeButton.swift` |
| Color system             | `ios_theme_ui/Classes/Theme/ColorSystem/ThemeColorPicker.swift`  |
| Grid/spacing             | `ios_theme_ui/Classes/Theme/Foundation/ThemeGrid.swift`          |
| Auto Layout DSL          | `ios_theme_ui/Classes/Extensions/UIViewConstraints.swift`        |
| Feature screen           | `luz_epost_ios/Featured Screens/LetterBox/`                      |
| API handler              | `luz_epost_ios/ServerAPIs/`                                      |
| Accessibility rules      | `.ai-agents/rules/accessibility/a11y-*.md`                       |

---

## External Resources

- Apple Accessibility Programming Guide
- WCAG 2.1 Guidelines
- iOS VoiceOver Testing Guide
- See `CLAUDE.md` for comprehensive project documentation

---

**Created by**: Phuong Doan
**Agent Documentation**: See [.github/AGENTS.md](.github/AGENTS.md)
**Lines**: ~280 (well under 500-line limit)
