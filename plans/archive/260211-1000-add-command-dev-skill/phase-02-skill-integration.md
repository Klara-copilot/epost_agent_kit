---
phase: 2
title: "Skill Integration"
status: pending
effort: 2h
dependencies: [phase-01]
---

# Phase 2: Skill Integration

## Context Links

- [Phase 1 Research Report](./research/command-dev-skill-analysis.md)
- [meta-kit-design package.yaml](../../packages/meta-kit-design/package.yaml)
- [meta-kit-design skills directory](../../packages/meta-kit-design/skills/)
- [doc-coauthoring integration example](../../packages/core/skills/doc-coauthoring/)

## Overview

**Priority**: P1 (blocking)
**Status**: Pending
**Effort**: 2h

Copy Command Development skill from anthropics/claude-code to meta-kit-design package, update package.yaml, verify structure, test loading.

## Key Insights

- meta-kit-design already has skills directory with agents/ subdirectory
- package.yaml uses simple list format for skills
- Skills registered under `provides.skills` array
- No special installation process needed (file-based)

## Requirements

### Functional Requirements

1. Copy skill files to meta-kit-design/skills/
2. Preserve directory structure
3. Update package.yaml with new skill
4. Verify frontmatter format
5. Test skill loading in Claude Code
6. Update CHANGELOG.md

### Non-Functional Requirements

- Maintain file integrity during copy
- Follow existing naming conventions
- Preserve skill functionality
- No breaking changes to existing skills
- Documentation completeness

## Architecture

### Target Structure

```
packages/meta-kit-design/
├── skills/
│   ├── agents/
│   │   ├── claude/
│   │   │   ├── agent-development/
│   │   │   │   └── SKILL.md
│   │   │   ├── skill-development/
│   │   │   │   └── SKILL.md
│   │   │   └── command-development/    # NEW
│   │   │       ├── SKILL.md
│   │   │       ├── references/
│   │   │       └── scripts/
│   │   └── mental-model/
│   │       └── SKILL.md
├── package.yaml
└── CHANGELOG.md
```

### Package.yaml Update

```yaml
provides:
  agents:
    - epost-scout
    - epost-mcp-manager
  skills:
    - agents/claude/agent-development
    - agents/claude/skill-development
    - agents/claude/command-development    # NEW
    - agents/mental-model
```

## Related Code Files

### To Modify

- `packages/meta-kit-design/package.yaml`
- `packages/meta-kit-design/CHANGELOG.md`

### To Create

- `packages/meta-kit-design/skills/agents/claude/command-development/SKILL.md`
- `packages/meta-kit-design/skills/agents/claude/command-development/references/*.md` (if any)
- `packages/meta-kit-design/skills/agents/claude/command-development/scripts/*` (if any)

### To Reference

- `anthropics/claude-code/.claude/skills/command-development/*` (source)
- `packages/core/skills/doc-coauthoring/SKILL.md` (frontmatter example)

## Implementation Steps

### Step 1: Prepare Target Directory

```bash
# Navigate to meta-kit-design skills
cd /Users/ddphuong/Projects/agent-kit/epost-agent-kit/packages/meta-kit-design/skills/agents/claude

# Create command-development directory
mkdir -p command-development

# Verify structure
ls -la
```

### Step 2: Copy Skill Files

```bash
# Copy main skill file
cp /tmp/claude-code/.claude/skills/command-development/SKILL.md \
   /Users/ddphuong/Projects/agent-kit/epost-agent-kit/packages/meta-kit-design/skills/agents/claude/command-development/

# Copy references directory (if exists)
if [ -d "/tmp/claude-code/.claude/skills/command-development/references" ]; then
  cp -r /tmp/claude-code/.claude/skills/command-development/references \
     /Users/ddphuong/Projects/agent-kit/epost-agent-kit/packages/meta-kit-design/skills/agents/claude/command-development/
fi

# Copy scripts directory (if exists)
if [ -d "/tmp/claude-code/.claude/skills/command-development/scripts" ]; then
  cp -r /tmp/claude-code/.claude/skills/command-development/scripts \
     /Users/ddphuong/Projects/agent-kit/epost-agent-kit/packages/meta-kit-design/skills/agents/claude/command-development/
fi
```

### Step 3: Verify File Integrity

```bash
# List copied files
tree packages/meta-kit-design/skills/agents/claude/command-development/ || \
ls -R packages/meta-kit-design/skills/agents/claude/command-development/

# Check SKILL.md exists
test -f packages/meta-kit-design/skills/agents/claude/command-development/SKILL.md && echo "SKILL.md OK"

# Verify file content
head -20 packages/meta-kit-design/skills/agents/claude/command-development/SKILL.md
```

### Step 4: Update package.yaml

```bash
# Read current package.yaml
cat packages/meta-kit-design/package.yaml

# Update with new skill entry
# Add "- agents/claude/command-development" to provides.skills array
```

Manual edit or script:
```yaml
# Add after agents/claude/skill-development:
  skills:
    - agents/claude/agent-development
    - agents/claude/skill-development
    - agents/claude/command-development    # NEW
    - agents/mental-model
```

### Step 5: Update CHANGELOG.md

```bash
# Add entry to CHANGELOG.md
cat >> packages/meta-kit-design/CHANGELOG.md << 'EOF'

## [Unreleased] - 2026-02-11

### Added
- Command Development skill from anthropics/claude-code
- Interactive command generator capability
- Splash command pattern support

EOF
```

### Step 6: Verify Skill Format

Check SKILL.md frontmatter matches epost-agent-kit format:

```yaml
---
name: command-development
description: "Skill description here"
---
```

If different, adjust to match doc-coauthoring format.

### Step 7: Test Skill Loading

```bash
# Navigate to project root
cd /Users/ddphuong/Projects/agent-kit/epost-agent-kit

# Test package validation (if CLI has validation)
# npx epost-kit validate packages/meta-kit-design

# Or verify skill can be listed
grep -r "command-development" packages/meta-kit-design/
```

### Step 8: Create Skill Index Entry

If `packages/core/skills/skill-index.json` exists and meta-kit-design uses it:

```json
{
  "agents/claude/command-development": {
    "name": "Command Development",
    "package": "meta-kit-design",
    "path": "skills/agents/claude/command-development/SKILL.md",
    "description": "Guide users through command creation workflow"
  }
}
```

## Todo List

- [ ] Create command-development directory
- [ ] Copy SKILL.md from source
- [ ] Copy references/ directory (if exists)
- [ ] Copy scripts/ directory (if exists)
- [ ] Verify file integrity
- [ ] Check frontmatter format
- [ ] Update package.yaml with new skill
- [ ] Update CHANGELOG.md
- [ ] Test skill loading
- [ ] Verify no broken references
- [ ] Update skill index (if needed)
- [ ] Commit changes to git

## Success Criteria

- All skill files copied successfully
- Directory structure preserved
- package.yaml updated correctly
- CHANGELOG.md updated
- No file corruption
- Skill loadable in Claude Code
- No syntax errors in YAML
- Git status clean

## Risk Assessment

### Potential Issues

1. **Missing Dependencies**: Skill may reference external files
   - Mitigation: Document in research report, adapt references

2. **Frontmatter Mismatch**: Skill frontmatter may differ
   - Mitigation: Adjust to match epost-agent-kit format

3. **Path Issues**: References may use absolute paths
   - Mitigation: Convert to relative paths for meta-kit-design

4. **Large File Size**: Skill may have large reference files
   - Mitigation: Review and optimize if needed

## Security Considerations

- Review skill content for external API calls
- Check scripts for command execution
- Verify no hardcoded credentials
- Ensure no unsafe file operations

## Next Steps

After completion:
1. Verify skill loads without errors
2. Test skill activation trigger
3. Confirm package.yaml valid
4. Proceed to Phase 3: Command Generator Creation

---

**Created by**: Phuong Doan
**Phase**: 2/4
