---
description: Environment verification and safety checks before operations in iOS workspace
alwaysApply: true
---

# Environment Safety

## Purpose

Pre-execution verification rules to prevent errors and ensure safe operations in iOS development environment (Xcode, SPM, multi-project workspace).

## Table of Contents

- [Pre-Execution Checks](#pre-execution-checks) → Lines 10-20
- [File Operations](#file-operations) → Lines 22-35
- [Path Handling](#path-handling) → Lines 37-42
- [iOS-Specific Checks](#ios-specific-checks) → Lines 44-55
- [Error Prevention](#error-prevention) → Lines 57-62

## Related Documents

- [Core User Rules](./core-user-rules.mdc) - Foundational safety constraints
- [Decision Boundaries](./decision-boundaries.mdc) - When to proceed vs. ask

## Pre-Execution Checks

**Before terminal operations:**
- Verify terminal/shell availability
- Check current working directory (which project: luz_epost_ios or luz_ios_designui)
- Confirm command exists and is available
- Validate environment variables if required
- Check Xcode command line tools availability

**Before file operations:**
- Check file/directory existence
- Verify read/write permissions
- Confirm file is not locked or in use
- Validate file format matches operation
- Verify project context (app vs package)

## File Operations

**Safe file creation:**
- Check parent directory exists
- Verify no naming conflicts
- Confirm write permissions
- Use relative paths from project root
- Follow iOS naming conventions (PascalCase for classes, camelCase for files)
- Place files in correct project structure

**Safe file modification:**
- Read file first to understand structure
- Check for existing patterns/conventions
- Verify file is not generated/auto-managed
- Preserve existing structure unless refactoring
- Maintain Swift code style consistency

**Safe file deletion:**
- **Never delete without explicit request**
- Check for dependencies/references
- Verify file is not critical (configs, auth, etc.)
- Check Xcode project references
- Confirm with user before proceeding

## Path Handling

**Always use:**
- Relative paths from project root
- Workspace-relative paths for file operations
- Project-specific paths (luz_epost_ios/ vs luz_ios_designui/)
- Standardized path separators

**Never use:**
- Hardcoded absolute paths
- User home directory assumptions (`~`)
- Platform-specific paths without checks
- Assumptions about project location

## iOS-Specific Checks

**Xcode Project Files:**
- Verify `.xcodeproj` structure before operations
- Check scheme availability
- Verify target configurations
- Confirm build settings impact

**SPM Package:**
- Verify `Package.swift` syntax
- Check dependency availability
- Validate platform requirements
- Confirm resource processing rules

**Cross-Project:**
- Verify luz_ios_designui package location
- Check luz_epost_ios dependency on luz_ios_designui
- Validate import paths
- Confirm workspace structure

**Build System:**
- Check Xcode version compatibility
- Verify Swift version requirements
- Confirm platform deployment targets
- Validate dependency versions

## Error Prevention

**When checks fail:**
- Provide clear error message
- Explain what was checked
- Suggest resolution steps
- Ask for clarification if needed

**Graceful degradation:**
- Handle missing files gracefully
- Provide alternatives when possible
- Never crash or leave operations incomplete
- Preserve project integrity on errors