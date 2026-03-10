# Phase 2: Update Implementation

**Status**: Pending
**Priority**: P2
**Effort**: 1h

## Overview

Execute systematic batch updates to add "(ePost)" prefix AND remove ⚡ emojis from all agent and command description fields using automated script.

## Prerequisites

- Phase 1 completed with file inventory
- YAML structure validated
- Update script tested on samples
- No existing "(ePost)" prefixes confirmed

## Implementation Strategy

### Batch Update Script

**Language**: Python (standard lib only - no deps)

**Features**:
- Parse YAML frontmatter safely
- Remove all ⚡ emoji characters from description
- Add "(ePost)" prefix to description
- Preserve all formatting and whitespace
- Handle edge cases (multi-line, special chars)
- Dry-run mode for verification
- Progress reporting
- Error handling and rollback

**Script Location**: `scripts/add-epost-prefix.py`

### Script Logic

```python
# Pseudocode
for each file in inventory:
    1. Read file content
    2. Extract YAML frontmatter (between --- markers)
    3. Parse description field
    4. Remove all ⚡ emoji characters from description
    5. Check if already has "(ePost)" prefix
    6. Add "(ePost) " prefix to description
    7. Reconstruct file with updated frontmatter
    8. Write back to original file
    9. Log changes
```

## Update Process

### Step 1: Create Update Script
```bash
# Create script at project root
cat > scripts/add-epost-prefix.py << 'EOF'
#!/usr/bin/env python3
"""Add (ePost) prefix to agent and command descriptions."""
import re
import sys
from pathlib import Path

def update_description(content: str) -> tuple[str, bool]:
    """Update description field in YAML frontmatter."""
    # Match YAML frontmatter
    pattern = r'^---\n(.*?)\n---'
    match = re.match(pattern, content, re.DOTALL)

    if not match:
        return content, False

    frontmatter = match.group(1)

    # Check if already has (ePost) prefix
    if '(ePost)' in frontmatter:
        return content, False

    # Update description field: remove emojis + add prefix
    updated = re.sub(
        r'^description:\s*(.+)$',
        lambda m: f'description: (ePost) {m.group(1).replace("⚡", "").strip()}',
        frontmatter,
        flags=re.MULTILINE
    )

    if updated == frontmatter:
        return content, False

    # Reconstruct file
    new_content = content.replace(frontmatter, updated)
    return new_content, True

def main():
    dry_run = '--dry-run' in sys.argv

    # File patterns
    patterns = [
        '.claude/agents/**/*.md',
        '.claude/commands/**/*.md',
        'packages/*/agents/*.md',
        'packages/*/commands/**/*.md',
    ]

    files_updated = 0
    files_skipped = 0

    for pattern in patterns:
        for filepath in Path('.').glob(pattern):
            content = filepath.read_text()
            new_content, updated = update_description(content)

            if updated:
                if not dry_run:
                    filepath.write_text(new_content)
                print(f'✓ Updated: {filepath}')
                files_updated += 1
            else:
                print(f'⊘ Skipped: {filepath}')
                files_skipped += 1

    print(f'\nSummary:')
    print(f'  Updated: {files_updated}')
    print(f'  Skipped: {files_skipped}')
    print(f'  Mode: {"DRY RUN" if dry_run else "LIVE"}')

if __name__ == '__main__':
    main()
EOF

chmod +x scripts/add-epost-prefix.py
```

### Step 2: Dry Run (Verification)
```bash
# Run in dry-run mode first
python3 scripts/add-epost-prefix.py --dry-run

# Expected output:
# ✓ Updated: .claude/agents/epost-reviewer.md
# ✓ Updated: .claude/agents/epost-implementer.md
# ...
# Summary:
#   Updated: 162
#   Skipped: 0
#   Mode: DRY RUN
```

### Step 3: Sample Verification
```bash
# Manually verify 5 sample files in dry-run output
head -10 .claude/agents/epost-reviewer.md
head -10 packages/core/agents/epost-implementer.md
head -10 .claude/commands/core/cook.md
head -10 packages/platform-ios/commands/a11y/audit.md
head -10 packages/platform-backend/commands/cook.md
```

### Step 4: Execute Live Update
```bash
# If samples pass verification, run live update
python3 scripts/add-epost-prefix.py

# Expected output:
# ✓ Updated: .claude/agents/epost-reviewer.md
# ...
# Summary:
#   Updated: 162
#   Skipped: 0
#   Mode: LIVE
```

### Step 5: Git Diff Verification
```bash
# Check git diff to verify only description changes
git diff .claude/agents/epost-reviewer.md
git diff packages/core/agents/epost-implementer.md
git diff .claude/commands/core/cook.md

# Expected diff:
# -description: Comprehensive code review agent...
# +description: (ePost) Comprehensive code review agent...
```

## Edge Case Handling

### Multi-line Descriptions
```yaml
# If found (unlikely):
description: >
  Long description
  spanning multiple lines

# Script should handle:
description: >
  (ePost) Long description
  spanning multiple lines
```

### Descriptions with Existing Parentheses
```yaml
# Before:
description: Agent for (specific task) implementation

# After:
description: (ePost) Agent for (specific task) implementation
```

### Emoji Removal Examples
```yaml
# Remove ⚡ emojis (common pattern)
# Before:
description: ⚡⚡ No research. Only analyze and create plan

# After:
description: (ePost) No research. Only analyze and create plan

# Multiple emojis
# Before:
description: ⚡⚡⚡⚡⚡ Bootstrap a new project step by step

# After:
description: (ePost) Bootstrap a new project step by step

# Other special characters (NOT removed)
# Before:
description: ⭑.ᐟ Implement features from plans

# After:
description: (ePost) ⭑.ᐟ Implement features from plans
```

## Rollback Plan

If issues discovered after update:
```bash
# Rollback all changes
git checkout -- .claude/agents/*.md
git checkout -- .claude/commands/**/*.md
git checkout -- packages/*/agents/*.md
git checkout -- packages/*/commands/**/*.md

# Or use git reset if not committed
git reset --hard HEAD
```

## Progress Tracking

### Agent Files (46 total - prefix only, no emojis expected)
- [ ] `.claude/agents/` (22 files)
- [ ] `packages/core/agents/` (~12 files)
- [ ] `packages/platform-*/agents/` (5 files)
- [ ] `packages/ui-ux/agents/` (1 file)
- [ ] `packages/arch-cloud/agents/` (1 file)
- [ ] `packages/meta-kit-design/agents/` (2 files)
- [ ] Other package agents (~3 files)

### Command Files (116 total - prefix + emoji removal)
- [ ] `.claude/commands/` (68 files - likely has emojis)
- [ ] `packages/core/commands/` (~24 files)
- [ ] `packages/platform-*/commands/` (13 files)
- [ ] Other package commands (~11 files)

## Deliverables

- [ ] Update script created and tested
- [ ] Emoji removal logic verified
- [ ] Dry-run executed successfully
- [ ] Sample files verified manually (both prefix + emoji removal)
- [ ] Live update executed (162 files)
- [ ] Git diff shows only description changes
- [ ] No YAML syntax errors introduced
- [ ] All frontmatter fields preserved
- [ ] Update summary report generated

## Success Criteria

- Script executes without errors
- All 162 files updated with "(ePost)" prefix
- All ⚡ emojis removed from command descriptions
- Git diff shows ONLY description field changes
- No formatting or whitespace changes (except emoji removal)
- Zero YAML syntax errors
- All other frontmatter fields unchanged

## Next Steps

After completion:
1. Review git diff for any anomalies
2. Proceed to Phase 3: Validation & Testing

---

**Created by**: Phuong Doan
