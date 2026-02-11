# Phase 3: Validation & Testing

**Status**: Pending
**Priority**: P2
**Effort**: 30 min

## Overview

Validate YAML syntax, verify no functional changes, ensure all prefixes added, and confirm all emojis removed before finalizing.

## Prerequisites

- Phase 2 completed with all 162 files updated
- Git diff available for review
- No script execution errors

## Validation Tasks

### 1. YAML Syntax Validation

**Objective**: Ensure all updated files have valid YAML frontmatter

**Method**: Use YAML parser to validate each file

```bash
# Create validation script
cat > scripts/validate-yaml-frontmatter.py << 'EOF'
#!/usr/bin/env python3
"""Validate YAML frontmatter in markdown files."""
import yaml
import re
from pathlib import Path

def validate_file(filepath: Path) -> tuple[bool, str]:
    """Validate YAML frontmatter in a single file."""
    content = filepath.read_text()

    # Extract frontmatter
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "No frontmatter found"

    try:
        yaml.safe_load(match.group(1))
        return True, "Valid"
    except yaml.YAMLError as e:
        return False, str(e)

def main():
    patterns = [
        '.claude/agents/**/*.md',
        '.claude/commands/**/*.md',
        'packages/*/agents/*.md',
        'packages/*/commands/**/*.md',
    ]

    valid_count = 0
    invalid_count = 0
    errors = []

    for pattern in patterns:
        for filepath in Path('.').glob(pattern):
            is_valid, message = validate_file(filepath)

            if is_valid:
                valid_count += 1
            else:
                invalid_count += 1
                errors.append(f'{filepath}: {message}')

    print(f'YAML Validation Results:')
    print(f'  ✓ Valid: {valid_count}')
    print(f'  ✗ Invalid: {invalid_count}')

    if errors:
        print(f'\nErrors:')
        for error in errors:
            print(f'  {error}')
        return 1

    return 0

if __name__ == '__main__':
    exit(main())
EOF

chmod +x scripts/validate-yaml-frontmatter.py

# Run validation
python3 scripts/validate-yaml-frontmatter.py

# Expected output:
# YAML Validation Results:
#   ✓ Valid: 162
#   ✗ Invalid: 0
```

### 2. Prefix Verification

**Objective**: Confirm all files have "(ePost)" prefix

```bash
# Count files with (ePost) prefix
grep -r "description:.*ePost" .claude/agents packages/*/agents | wc -l
grep -r "description:.*ePost" .claude/commands packages/*/commands | wc -l

# Expected: 46 agents + 116 commands = 162 total

# Verify no duplicates (should match above counts)
grep -r "description:.*(ePost).*(ePost)" .claude packages/*/agents packages/*/commands

# Expected: No matches (empty output)
```

### 2b. Emoji Removal Verification

**Objective**: Confirm all ⚡ emojis removed from command descriptions

```bash
# Check for remaining ⚡ emojis in descriptions
grep -r "description:.*⚡" .claude/commands packages/*/commands

# Expected: No matches (empty output)

# Count any remaining emojis (should be 0)
grep -r "description:.*⚡" .claude/commands packages/*/commands | wc -l

# Expected: 0

# Verify agents never had emojis (baseline check)
grep -r "description:.*⚡" .claude/agents packages/*/agents

# Expected: No matches (empty output)
```

### 3. Field Preservation Check

**Objective**: Ensure no other frontmatter fields were modified

```bash
# Check git diff statistics
git diff --stat .claude/agents/*.md packages/*/agents/*.md
git diff --stat .claude/commands/**/*.md packages/*/commands/**/*.md

# Expected: Only description lines changed

# Sample detailed diff review
git diff .claude/agents/epost-reviewer.md
git diff packages/core/agents/epost-implementer.md
git diff .claude/commands/core/cook.md
git diff packages/platform-ios/commands/a11y/audit.md

# Expected pattern:
# -description: Original description
# +description: (ePost) Original description
```

### 4. Agent Loading Test

**Objective**: Verify agents can still be loaded by Claude Code

```bash
# Test agent invocation (should show updated description)
# This would be done manually in Claude Code UI:
# 1. Open Claude Code
# 2. Type `/` to see command list
# 3. Verify descriptions show "(ePost)" prefix
# 4. Check agent help for updated descriptions

# For automated check, validate agent file structure
cat .claude/agents/epost-reviewer.md | head -15
cat packages/core/agents/epost-implementer.md | head -15

# Verify frontmatter fields:
# - name: present
# - description: has (ePost) prefix
# - other fields: unchanged
```

### 5. Command Execution Test

**Objective**: Verify commands still execute correctly

```bash
# Test sample command execution
# Manual testing in Claude Code:
# 1. Run `/core:cook --help` (should show updated description)
# 2. Run `/core:plan --help` (should show updated description)
# 3. Verify functionality unchanged

# Automated check: verify command structure
head -15 .claude/commands/core/cook.md
head -15 packages/core/commands/core/plan.md
```

### 6. Sample File Review

**Manual Review Checklist**:

Randomly select 10 files for detailed inspection:
- [ ] `.claude/agents/epost-reviewer.md`
- [ ] `.claude/agents/epost-orchestrator.md`
- [ ] `packages/core/agents/epost-implementer.md`
- [ ] `packages/platform-ios/agents/epost-ios-developer.md`
- [ ] `.claude/commands/core/cook.md`
- [ ] `.claude/commands/core/plan.md`
- [ ] `packages/core/commands/core/debug.md`
- [ ] `packages/platform-ios/commands/a11y/audit.md`
- [ ] `packages/platform-backend/commands/cook.md`
- [ ] `packages/ui-ux/agents/epost-muji.md`

For each file verify:
- [ ] YAML frontmatter valid
- [ ] Description has "(ePost)" prefix
- [ ] All ⚡ emojis removed (command files)
- [ ] Description content unchanged (except prefix and emoji removal)
- [ ] All other fields preserved exactly
- [ ] No formatting changes (indentation, spacing)
- [ ] No trailing whitespace added

## Verification Report

Create verification report documenting results:

```markdown
# ePost Prefix Update - Verification Report

**Date**: 2026-02-11
**Scope**: 162 files (46 agents + 116 commands)

## Results Summary

| Category | Expected | Actual | Status |
|----------|----------|--------|--------|
| Files Updated | 162 | XXX | ✓/✗ |
| YAML Valid | 162 | XXX | ✓/✗ |
| Prefix Added | 162 | XXX | ✓/✗ |
| Emojis Removed | 0 remaining | XXX | ✓/✗ |
| Fields Preserved | 162 | XXX | ✓/✗ |
| No Duplicates | 0 | XXX | ✓/✗ |

## Detailed Findings

### YAML Validation
- Valid: XXX files
- Invalid: XXX files
- Errors: [list if any]

### Prefix Verification
- With prefix: XXX files
- Without prefix: XXX files
- Duplicate prefix: XXX files

### Emoji Removal
- Emojis removed: XXX files
- Remaining emojis: XXX files
- Agent files checked: XXX files (baseline)

### Git Diff Analysis
- Lines changed: XXX
- Files modified: XXX
- Only description changed: ✓/✗

### Sample File Review
- Files reviewed: 10
- Issues found: XXX
- Details: [list if any]

### Agent Loading Test
- Agents tested: XXX
- Load successful: ✓/✗
- Description visible: ✓/✗

### Command Execution Test
- Commands tested: XXX
- Execute successful: ✓/✗
- Description visible: ✓/✗

## Issues Identified

[List any issues found during validation]

## Recommendations

[Any recommendations for follow-up or improvements]

## Conclusion

Overall Status: ✓ PASS / ✗ FAIL

Ready to commit: YES / NO
```

## Rollback Criteria

Trigger rollback if:
- Any YAML syntax errors found
- Duplicate "(ePost)" prefixes detected
- Any ⚡ emojis remain in command descriptions
- Fields other than description modified
- Agent loading fails
- Command execution broken
- More than 5% of files have issues

## Deliverables

- [ ] YAML validation script created and executed
- [ ] All 162 files pass YAML validation
- [ ] Prefix verification shows 100% coverage
- [ ] Emoji removal verification shows 0 remaining
- [ ] Git diff confirms only description changes
- [ ] Sample files manually reviewed (10 files)
- [ ] Agent loading tested successfully
- [ ] Command execution tested successfully
- [ ] Verification report completed
- [ ] No rollback criteria triggered

## Success Criteria

- Zero YAML syntax errors
- All 162 files have "(ePost)" prefix
- Zero ⚡ emojis remaining in command descriptions
- Zero duplicate prefixes
- Zero unintended field changes
- Git diff shows clean, description-only changes (prefix + emoji removal)
- Agents load and execute normally
- Commands execute normally
- Verification report shows 100% pass rate

## Next Steps

After validation passes:
1. Review verification report
2. Commit changes with proper message
3. Update documentation if needed
4. Close implementation plan

---

**Created by**: Phuong Doan
