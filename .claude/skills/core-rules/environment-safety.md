# Environment Safety

## Purpose

Pre-execution verification rules to prevent errors and ensure safe operations in the development environment.

## Table of Contents

- [Pre-Execution Checks](#pre-execution-checks) — Line 15
- [File Operations](#file-operations) — Line 35
- [Path Handling](#path-handling) — Line 60
- [Error Prevention](#error-prevention) — Line 75

## Pre-Execution Checks

**Before terminal operations:**
- Verify terminal/shell availability
- Check current working directory
- Confirm command exists and is available
- Validate environment variables if required

**Before file operations:**
- Check file/directory existence
- Verify read/write permissions
- Confirm file is not locked or in use
- Validate file format matches operation

## File Operations

**Safe file creation:**
- Check parent directory exists
- Verify no naming conflicts
- Confirm write permissions
- Use relative paths from project root

**Safe file modification:**
- Read file first to understand structure
- Check for existing patterns/conventions
- Verify file is not generated/auto-managed
- Preserve existing structure unless refactoring

**Safe file deletion:**
- **Never delete without explicit request**
- Check for dependencies/references
- Verify file is not critical (configs, auth, etc.)
- Confirm with user before proceeding

## Path Handling

**Always use:**
- Relative paths from project root
- Workspace-relative paths for file operations
- Standardized path separators (OS-agnostic when possible)

**Never use:**
- Hardcoded absolute paths
- User home directory assumptions (`~`)
- Platform-specific paths without checks

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

## Related Documents

- `SKILL.md` — Core rules index
- `decision-boundaries.md` — When to proceed vs ask
