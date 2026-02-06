---
description: Decision authority boundaries and escalation rules for iOS workspace
alwaysApply: true
---

# Decision Boundaries

## Purpose

Clear boundaries defining when Cursor may act autonomously versus when human approval is required in iOS development context.

## Table of Contents

- [Autonomous Actions](#autonomous-actions) → Lines 10-20
- [Requires Approval](#requires-approval) → Lines 22-35
- [Escalation Rules](#escalation-rules) → Lines 37-45
- [Option Presentation](#option-presentation) → Lines 47-52
- [iOS-Specific Boundaries](#ios-specific-boundaries) → Lines 54-62

## Related Documents

- [Core User Rules](./core-user-rules.mdc) - Foundational constraints
- [Environment Safety](./environment-safety.mdc) - Pre-execution checks

## Autonomous Actions

**Auto-execute without asking:**
- Dependency installs (`swift package resolve`, `pod install` if Podfile exists)
- Lint fixes (`swiftformat`, `swiftlint --fix`)
- Memory file consolidation (`.agent-memory.md` under 2KB)
- File structure compliance (adding Purpose/TOC/Related Docs)
- Documentation formatting (tables, bullets, keywords)
- Creating Swift files following existing patterns
- Adding comments/documentation to existing code

**Execute with brief confirmation:**
- Creating new files following standards
- Updating existing documentation
- Fixing obvious bugs in open files
- Adding unit tests following existing patterns

## Requires Approval

**Always ask before:**
- Deleting files or directories
- Modifying production configs (`.entitlements`, `Info.plist`, build settings)
- Changing build/test configurations
- Introducing new dependencies (SPM, CocoaPods, Carthage)
- Refactoring across multiple files
- Changing API contracts or interfaces
- Modifying authentication/authorization logic
- Changing Xcode project structure
- Modifying `Package.swift` dependencies
- Breaking changes to luz_ios_designui (affects luz_epost_ios)

**Present A/B/C options for:**
- Architectural decisions
- Breaking changes
- Framework/library choices
- Multiple valid approaches exist
- Xcode project organization changes
- SPM package structure changes

## Escalation Rules

**When uncertainty is high:**
- Partial context: Ask for clarification
- Multiple valid paths: Present options
- Conflicts detected: Explain and propose alternatives
- Repository rules unclear: Flag ambiguity
- Cross-project impact unclear: Verify dependencies

**Escalation format:**
- State the ambiguity
- Explain why it matters
- Propose 2-3 specific alternatives
- Wait for selection before proceeding

## Option Presentation

**Format for A/B/C options:**
- **Option A**: [Approach] - Pros: [X, Y] - Cons: [Z]
- **Option B**: [Approach] - Pros: [X, Y] - Cons: [Z]
- **Option C**: [Approach] - Pros: [X, Y] - Cons: [Z]

**Never present:**
- Open-ended questions without options
- Vague "what do you prefer?" prompts
- Options without pros/cons context

## iOS-Specific Boundaries

**Xcode Project Files:**
- Never modify `.pbxproj` directly
- Ask before changing schemes, build phases, or targets
- Verify impact on build configurations

**SPM Package:**
- Ask before adding/removing dependencies
- Verify platform compatibility
- Check version constraints

**Cross-Project Changes:**
- luz_ios_designui changes: Verify luz_epost_ios compatibility
- luz_epost_ios changes: Check luz_ios_designui usage
- Breaking changes: Always ask first