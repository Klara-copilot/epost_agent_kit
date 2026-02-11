# Phase 1: Discovery & Analysis

**Status**: Pending
**Priority**: P2
**Effort**: 30 min

## Overview

Discover, catalog, and analyze all agent and command files to plan systematic updates.

## Objectives

1. Create complete file inventory with accurate counts
2. Verify no existing "(ePost)" prefixes to avoid duplicates
3. Detect and count ⚡ emojis in command descriptions
4. Validate YAML frontmatter structure consistency
5. Identify any edge cases or special formatting
6. Plan batch update approach (script vs manual)

## File Inventory

### Agent Files

**Global Agents** (`.claude/agents/`):
- Expected: ~22 files
- Location: `/Users/ddphuong/Projects/agent-kit/epost-agent-kit/.claude/agents/`

**Package Agents** (`packages/*/agents/`):
- core: ~12 agents
- platform-web: ~1 agent
- platform-ios: ~2 agents (including a11y-specialist)
- platform-android: ~1 agent
- platform-backend: ~1 agent
- ui-ux: ~1 agent (muji)
- arch-cloud: ~1 agent (database-admin)
- meta-kit-design: ~2 agents (scout, mcp-manager)
- rag-web, rag-ios, domain-b2b, domain-b2c: TBD
- Expected: ~24 files total

### Command Files

**Global Commands** (`.claude/commands/`):
- Expected: ~68 files
- Location: `/Users/ddphuong/Projects/agent-kit/epost-agent-kit/.claude/commands/`

**Package Commands** (`packages/*/commands/`):
- core: ~10 commands + variants
- platform-web: ~2 commands
- platform-ios: ~8 commands (including a11y suite)
- platform-android: ~2 commands
- platform-backend: ~2 commands
- ui-ux, arch-cloud, domain-b2b, domain-b2c: TBD
- Expected: ~48 files total

## Analysis Tasks

### 1. File Discovery
```bash
# Count agent files
find .claude/agents -name "*.md" -type f | wc -l
find packages -type f -path "*/agents/*.md" | wc -l

# Count command files
find .claude/commands -name "*.md" -type f | wc -l
find packages -type f -path "*/commands/*.md" | wc -l

# Generate full file list
find .claude/agents packages -type f \( -path "*/agents/*.md" -o -path "*/commands/*.md" \) > /tmp/epost-files-to-update.txt
find .claude/commands -name "*.md" -type f >> /tmp/epost-files-to-update.txt
```

### 2. Existing Prefix Check
```bash
# Check for any existing "(ePost)" prefixes
grep -r "description:.*ePost" .claude/agents packages/*/agents
grep -r "description:.*ePost" .claude/commands packages/*/commands

# Expected: No matches (should return empty)
```

### 2b. Emoji Detection
```bash
# Count command files with ⚡ emojis
grep -r "description:.*⚡" .claude/commands packages/*/commands | wc -l

# List all files with emojis for documentation
grep -rl "description:.*⚡" .claude/commands packages/*/commands > /tmp/epost-emoji-files.txt

# Sample files with emojis
grep -r "description:.*⚡" .claude/commands | head -10

# Document emoji patterns found (e.g., ⚡⚡, ⚡⚡⚡, etc.)
grep -oh "description:.*⚡*" .claude/commands packages/*/commands | sort | uniq -c
```

### 3. YAML Structure Validation
```bash
# Sample 5 agent files to verify frontmatter structure
head -20 .claude/agents/epost-reviewer.md
head -20 packages/core/agents/epost-implementer.md
head -20 .claude/agents/epost-orchestrator.md

# Sample 5 command files
head -20 .claude/commands/core/cook.md
head -20 packages/core/commands/core/plan.md
head -20 packages/platform-ios/commands/a11y/audit.md
```

### 4. Edge Case Identification

Check for:
- Multi-line descriptions (YAML block scalars)
- Special characters in descriptions
- Descriptions with existing parentheses
- Non-standard frontmatter format
- Files without description field

```bash
# Check for multi-line descriptions
grep -A 2 "description:" .claude/agents/*.md | grep -E "^\s+[a-zA-Z]"

# Check for existing parentheses
grep "description:.*(.*).*" .claude/agents/*.md .claude/commands/**/*.md
```

## Update Approach Options

### Option A: Automated Script (Recommended)
**Pros**:
- Fast (162 files in <1 min)
- Consistent formatting
- Easy to verify changes
- Repeatable if needed

**Cons**:
- Requires script development
- Need to handle edge cases

**Implementation**: Python/Node.js script

### Option B: Manual Updates
**Pros**:
- Complete control
- Can handle any edge case

**Cons**:
- Time-consuming (162 files)
- Higher error risk
- Inconsistent application

**Not Recommended** for this volume

### Option C: Hybrid Approach
**Pros**:
- Script handles 95% of files
- Manual review for edge cases

**Best Balance** - Use automated script with manual verification

## Recommended Approach

**Use Option C: Hybrid Approach**

1. Create Python script to:
   - Read each .md file
   - Parse YAML frontmatter
   - Update description field only
   - Preserve exact formatting
   - Write back to file

2. Run script on sample batch (5 files)
3. Manually verify sample output
4. Run full batch if samples pass
5. Manual verification of edge cases

## Deliverables

- [ ] Complete file inventory (162 files confirmed)
- [ ] Zero existing "(ePost)" prefixes verified
- [ ] Emoji count and patterns documented
- [ ] YAML structure consistency confirmed
- [ ] Edge cases identified and documented
- [ ] Update approach selected and justified
- [ ] Sample script tested on 5 files
- [ ] Phase 1 report with findings

## Success Criteria

- Accurate file count for all locations
- No duplicate "(ePost)" prefixes found
- YAML frontmatter structure validated
- Update approach selected with rationale
- Ready to proceed to Phase 2

## Next Steps

After completion:
1. Review findings and file inventory
2. Approve update approach
3. Proceed to Phase 2: Update Implementation

---

**Created by**: Phuong Doan
