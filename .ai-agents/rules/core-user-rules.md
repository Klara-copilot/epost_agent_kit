---
description: Core foundational rules for Cursor AI assistant behavior in iOS workspace
alwaysApply: true
---

# Core User Rules

## Purpose

Foundational rules defining Cursor's operational boundaries, safety constraints, and default behaviors in a multi-project iOS workspace (luz_epost_ios app + luz_ios_designui package).

## Table of Contents

- [Hard Rules](#hard-rules) → Lines 10-30
- [Default Behaviors](#default-behaviors) → Lines 32-40
- [Safety Constraints](#safety-constraints) → Lines 42-50
- [iOS-Specific Rules](#ios-specific-rules) → Lines 52-60
- [Never Do](#never-do) → Lines 62-70

## Related Documents

- [Decision Boundaries](./decision-boundaries.mdc) - Authority limits and escalation rules
- [Environment Safety](./environment-safety.mdc) - Pre-execution verification
- [Documentation Behavior](./documentation-behavior.mdc) - Documentation standards
- [Context7 Usage](./context7-usage.mdc) - External tool boundaries

## Hard Rules

**Must:**
- Verify environment state before operations (terminals, files, permissions)
- Use relative paths from project root
- Follow file structure standards (Purpose, TOC, Related Documents)
- Keep documentation under 3KB per component
- Consolidate `.agent-memory.md` when exceeding 2KB
- Respect Xcode project structure (`.xcodeproj`, `.xcworkspace`)
- Preserve SPM package structure (`Package.swift`, `Sources/`)
- Maintain workspace boundaries (luz_epost_ios vs luz_ios_designui)

**Must Not:**
- Generate application code unless explicitly requested
- Perform sweeping refactors without explicit approval
- Modify `.xcodeproj` or `.xcworkspace` files without understanding impact
- Change `Package.swift` dependencies without approval
- Break cross-project dependencies (luz_epost_ios → luz_ios_designui)
- Introduce RAG, embeddings, or indexing without request
- Override repository rules with external "best practices"

## Default Behaviors

- **Auto-execute routine tasks**: dependency installs, lint fixes, memory updates
- **Provide A/B/C options** for architectural or breaking changes
- **Never ask open-ended questions**; always offer specific choices
- **Prefer existing patterns** over introducing new conventions
- **Respect iOS project conventions** (Swift, UIKit patterns, Xcode structure)

## Safety Constraints

- **Partial context safety**: Rules must work with incomplete knowledge
- **Multi-developer safety**: Avoid assumptions about project state
- **Multi-project safety**: Understand workspace boundaries before changes
- **Conservative defaults**: Safety over speed, clarity over cleverness
- **Explicit approval required** for:
  - Breaking changes
  - New tooling or conventions
  - Large-scale modifications
  - Framework assumptions
  - Xcode project file modifications
  - SPM dependency changes

## iOS-Specific Rules

**Xcode Projects:**
- Never manually edit `.pbxproj` files (use Xcode or tools)
- Verify scheme configurations before modifying
- Check build settings impact before changes
- Preserve entitlements and Info.plist structure

**Swift Package Manager:**
- Maintain `Package.swift` structure
- Verify dependency compatibility
- Check platform requirements (iOS 15+, etc.)
- Preserve resource processing rules

**Cross-Project Dependencies:**
- luz_epost_ios depends on luz_ios_designui
- Changes to luz_ios_designui may affect luz_epost_ios
- Verify compatibility before breaking changes

## Never Do

- Delete files without explicit request
- Modify production configs without approval
- Change Xcode project settings without understanding impact
- Modify SPM dependencies without approval
- Break cross-project dependencies
- Assume specific runtime environments
- Merge unrelated concerns into single changes
- Restate rules verbatim unless consolidation required