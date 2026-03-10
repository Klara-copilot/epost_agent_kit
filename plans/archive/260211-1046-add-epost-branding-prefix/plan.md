---
updated: 2026-03-09
title: "Add (ePost) Branding Prefix to Agents and Commands"
description: "Systematically add (ePost) prefix to all agent and command descriptions for consistent branding"
status: archived
priority: P2
effort: 2h
branch: feat/add-skill
tags: [branding, documentation, agents, commands]
created: 2026-02-11
---

# Add (ePost) Branding Prefix - Implementation Plan

## Overview

Add "(ePost)" branding prefix AND remove ⚡ emojis from all agent and command description fields across the entire epost-agent-kit codebase for consistent brand identification and professional formatting.

## Scope Summary

### Agent Files
- `.claude/agents/`: 22 files
- `packages/*/agents/`: 24 files
- **Total**: 46 agent files

### Command Files
- `.claude/commands/`: 68 files
- `packages/*/commands/`: 48 files
- **Total**: 116 command files

### Grand Total: 162 files to update

## Format Change

```yaml
# Commands with emojis (remove ⚡ + add prefix)
# Before
description: ⚡⚡ No research. Only analyze and create an implementation plan

# After
description: (ePost) No research. Only analyze and create an implementation plan

# Commands with many emojis
# Before
description: ⚡⚡⚡⚡⚡ Bootstrap a new project step by step

# After
description: (ePost) Bootstrap a new project step by step

# Agents (typically no emojis, just add prefix)
# Before
description: Senior technical documentation specialist...

# After
description: (ePost) Senior technical documentation specialist...
```

## Implementation Phases

### Phase 1: Discovery & Analysis
**Status**: Complete ✓
**Completed**: 2026-02-11
**Effort**: 30 min
**File**: `phase-01-discovery-analysis.md`

- Count and catalog all agent/command files
- Verify no existing "(ePost)" prefixes exist
- Validate YAML frontmatter structure
- Create file inventory with paths
- Plan systematic update approach

### Phase 2: Update Implementation
**Status**: Complete ✓
**Completed**: 2026-02-11
**Effort**: 1h
**File**: `phase-02-update-implementation.md`

- Create update script for batch processing
- Update agent descriptions (46 files)
- Update command descriptions (116 files)
- Preserve all other frontmatter fields
- Handle edge cases (multi-line descriptions, special chars)

### Phase 3: Validation & Testing
**Status**: Complete ✓
**Completed**: 2026-02-11
**Effort**: 30 min
**File**: `phase-03-validation-testing.md`

- Validate YAML syntax in all updated files
- Verify no functional changes to agents/commands
- Test agent loading and command execution
- Review sample files manually
- Create verification report

## Success Criteria

- [ ] All 162 files updated with "(ePost)" prefix
- [ ] All ⚡ emojis removed from command descriptions
- [ ] Zero YAML syntax errors introduced
- [ ] All frontmatter fields preserved exactly
- [ ] No functional changes to agent/command behavior
- [ ] Verification report shows 100% success rate
- [ ] Git diff shows only description field changes

## Risk Assessment

**Low Risk** - Pure documentation change:
- Only modifying description fields in frontmatter
- No code logic changes
- No API or behavioral changes
- Easy to verify and rollback if needed

**Mitigation**:
- YAML validation after each batch
- Git tracking for easy rollback
- Sample file verification before full batch
- Automated script to ensure consistency

## Dependencies

- None (standalone documentation update)

## Next Steps

1. Execute Phase 1: Discovery & Analysis
2. Review file inventory and approach
3. Execute Phase 2: Batch updates via script
4. Execute Phase 3: Validation & verification
5. Commit changes with descriptive message

---

**Created by**: Phuong Doan
**Plan Directory**: `/Users/ddphuong/Projects/agent-kit/epost-agent-kit/plans/260211-1046-add-epost-branding-prefix/`
