---
phase: 4
title: "Testing & Documentation"
status: pending
effort: 0.5h
dependencies: [phase-03]
---

# Phase 4: Testing & Documentation

## Context Links

- [Generated commands](../../.claude/commands/)
- [meta-kit-design README](../../packages/meta-kit-design/README.md)
- [Main README](../../README.md)
- [CHANGELOG](../../packages/meta-kit-design/CHANGELOG.md)

## Overview

**Priority**: P2
**Status**: Pending
**Effort**: 0.5h

Test end-to-end command generation workflow, verify all components functional, update documentation.

## Key Insights

- Need to test both splash and simple command generation
- Verify skill activation works correctly
- Ensure generated commands are functional
- Documentation should include usage examples

## Requirements

### Functional Requirements

1. Test router command invocation
2. Test splash command generation
3. Test simple command generation
4. Verify skill activation
5. Validate generated file structure
6. Update documentation

### Non-Functional Requirements

- All tests pass
- Documentation complete
- Usage examples clear
- No regression in existing functionality

## Architecture

### Test Coverage

```
Testing Pyramid:
├── Unit Tests
│   ├── Command name validation
│   ├── File path generation
│   └── Template rendering
├── Integration Tests
│   ├── Router → variant delegation
│   ├── Skill activation
│   └── File creation
└── E2E Tests
    ├── Generate splash command
    └── Generate simple command
```

## Related Code Files

### To Test

- `.claude/commands/meta/generate-command.md`
- `.claude/commands/generate-command/splash.md`
- `.claude/commands/generate-command/simple.md`
- `packages/meta-kit-design/skills/agents/claude/command-development/SKILL.md`

### To Update

- `packages/meta-kit-design/README.md`
- `README.md` (if needed)
- `docs/code-standards.md` (if needed)

### To Verify

- `packages/meta-kit-design/package.yaml`
- `packages/meta-kit-design/CHANGELOG.md`

## Implementation Steps

### Step 1: Test Router Command

```bash
# Test command exists
test -f .claude/commands/meta/generate-command.md && echo "Router OK"

# Test YAML frontmatter valid
head -5 .claude/commands/meta/generate-command.md | grep "description:"

# Invoke command in Claude Code
# /meta:generate-command
# Verify:
# - Command loads
# - Prompts for type selection
# - Routes to variant
```

### Step 2: Test Splash Generator

End-to-end test:

1. **Invoke**: `/meta:generate-command`
2. **Select**: "splash"
3. **Input**:
   - Command name: "test-analyze"
   - Purpose: "Analyze code with multiple strategies"
   - Variants: "quick", "deep"
4. **Verify**:
   - Router created: `.claude/commands/core/test-analyze.md`
   - Variant 1: `.claude/commands/test-analyze/quick.md`
   - Variant 2: `.claude/commands/test-analyze/deep.md`
5. **Validate**:
   - Frontmatter present
   - Description field populated
   - Workflow section exists
   - Delegation logic present

```bash
# Check generated files
ls -la .claude/commands/core/test-analyze.md
ls -la .claude/commands/test-analyze/

# Validate content
cat .claude/commands/core/test-analyze.md | head -20
cat .claude/commands/test-analyze/quick.md | head -20
```

### Step 3: Test Simple Generator

End-to-end test:

1. **Invoke**: `/meta:generate-command`
2. **Select**: "simple"
3. **Input**:
   - Command name: "test-format"
   - Purpose: "Format code files"
   - Arguments: "[file-path]"
4. **Verify**:
   - Command created: `.claude/commands/util/test-format.md`
5. **Validate**:
   - Frontmatter present
   - Argument-hint correct
   - Workflow documented

```bash
# Check generated file
test -f .claude/commands/util/test-format.md && echo "Simple command OK"

# Validate content
cat .claude/commands/util/test-format.md | head -15
```

### Step 4: Test Skill Activation

```bash
# Verify skill loads
# In Claude Code, activate skill manually:
# Load command-development skill

# Verify skill provides:
# - Command templates
# - Structure guidance
# - Frontmatter formats
```

### Step 5: Validate File Structure

```bash
# Check directory structure
tree .claude/commands/test-analyze/ || ls -R .claude/commands/test-analyze/

# Verify no permission issues
ls -la .claude/commands/meta/
ls -la .claude/commands/generate-command/

# Check YAML syntax
# Use YAML validator if available
```

### Step 6: Test Command Invocation

```bash
# Test generated router command
# /test-analyze
# Verify:
# - Command loads
# - Routes to variants
# - No errors

# Test generated variant
# /test-analyze:quick
# Verify:
# - Variant loads
# - Executes workflow
```

### Step 7: Update Documentation

Add to `packages/meta-kit-design/README.md`:

```markdown
## Command Generator

Generate new commands interactively using the Command Development skill.

### Usage

```
/meta:generate-command
```

### Generate Splash Command

Creates router + multiple variants:

```
/meta:generate-command
→ Select: splash
→ Enter: command-name
→ Enter: purpose
→ Enter: variant names
```

Generates:
- `.claude/commands/core/{command-name}.md` (router)
- `.claude/commands/{command-name}/{variant}.md` (variants)

### Generate Simple Command

Creates standalone command:

```
/meta:generate-command
→ Select: simple
→ Enter: command-name
→ Enter: purpose
```

Generates:
- `.claude/commands/{category}/{command-name}.md`

### Examples

**Splash Command**:
```
Command: analyze
Variants: quick, deep, parallel
Result: /analyze, /analyze:quick, /analyze:deep, /analyze:parallel
```

**Simple Command**:
```
Command: format-code
Result: /format-code
```
```

### Step 8: Create Usage Examples

Create `packages/meta-kit-design/examples/command-generation.md`:

```markdown
# Command Generation Examples

## Example 1: Code Review Command

Generate multi-strategy code review:

```
/meta:generate-command
→ splash
→ Command: review-code
→ Purpose: Review code with different strategies
→ Variants: quick, security, performance
```

Result:
- `/review-code` (router)
- `/review-code:quick` (fast syntax check)
- `/review-code:security` (security audit)
- `/review-code:performance` (performance analysis)

## Example 2: Format Command

Generate code formatter:

```
/meta:generate-command
→ simple
→ Command: format
→ Purpose: Format code files
→ Arguments: [file-pattern]
```

Result:
- `/format [file-pattern]` (standalone)
```

### Step 9: Run Cleanup

```bash
# Remove test commands
rm -f .claude/commands/core/test-analyze.md
rm -rf .claude/commands/test-analyze/
rm -f .claude/commands/util/test-format.md

# Verify cleanup
ls .claude/commands/core/ | grep "test-"
ls .claude/commands/ | grep "test-"
```

### Step 10: Final Verification

```bash
# Check package.yaml valid
cat packages/meta-kit-design/package.yaml

# Verify CHANGELOG updated
cat packages/meta-kit-design/CHANGELOG.md | head -20

# Test skill file exists
test -f packages/meta-kit-design/skills/agents/claude/command-development/SKILL.md && echo "Skill OK"

# Verify all command files exist
test -f .claude/commands/meta/generate-command.md && echo "Router OK"
test -f .claude/commands/generate-command/splash.md && echo "Splash OK"
test -f .claude/commands/generate-command/simple.md && echo "Simple OK"
```

## Todo List

- [ ] Test router command loads
- [ ] Test splash generation E2E
- [ ] Test simple generation E2E
- [ ] Verify skill activation works
- [ ] Validate generated file structure
- [ ] Test generated command invocation
- [ ] Update meta-kit-design README
- [ ] Create usage examples
- [ ] Run cleanup of test files
- [ ] Verify package.yaml valid
- [ ] Verify CHANGELOG complete
- [ ] Run final verification checks

## Success Criteria

- Router command functional
- Splash generator works E2E
- Simple generator works E2E
- Skill activates correctly
- Generated files valid
- Commands invocable
- Documentation complete
- Usage examples clear
- All tests pass
- No regressions

## Risk Assessment

### Potential Issues

1. **Test Command Conflicts**: Test commands may conflict with existing
   - Mitigation: Use unique test names, cleanup after

2. **Skill Not Loading**: Command Development skill may fail to load
   - Mitigation: Debug skill path, verify package.yaml

3. **Generated File Errors**: Generated commands may have syntax errors
   - Mitigation: Validate templates, test thoroughly

4. **Documentation Gaps**: Usage may be unclear
   - Mitigation: Add comprehensive examples

## Security Considerations

- Verify test commands don't persist
- Check file permissions on generated files
- Ensure no sensitive data in test outputs

## Next Steps

After completion:
1. Commit all changes to git
2. Create pull request if needed
3. Update main documentation
4. Announce new feature to team

## Unresolved Questions

None at this phase.

---

**Created by**: Phuong Doan
**Phase**: 4/4
