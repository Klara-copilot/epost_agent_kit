---
phase: 1
title: "Research & Acquisition"
status: pending
effort: 1.5h
dependencies: []
---

# Phase 1: Research & Acquisition

## Context Links

- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [meta-kit-design package](../../packages/meta-kit-design/)
- [Core skill structure](../../packages/core/skills/)
- [doc-coauthoring example](../../packages/core/skills/doc-coauthoring/)

## Overview

**Priority**: P1 (blocking)
**Status**: Pending
**Effort**: 1.5h

Research Command Development skill from anthropics/claude-code, understand structure, analyze dependencies, study splash command pattern.

## Key Insights

- Command Development skill likely in `.claude/skills/` directory
- May have SKILL.md frontmatter similar to doc-coauthoring
- Need to understand skill activation patterns
- Splash commands use variants (e.g., /plan, /plan:fast, /plan:hard)

## Requirements

### Functional Requirements

1. Clone anthropics/claude-code repository
2. Locate Command Development skill files
3. Document skill file structure
4. Identify skill dependencies
5. Analyze skill activation triggers
6. Study splash command pattern in epost-agent-kit

### Non-Functional Requirements

- Complete research within 1.5h
- Document findings for Phase 2
- Identify all required files
- Note any compatibility concerns

## Architecture

### Repository Structure Analysis

```
anthropics/claude-code/
├── .claude/
│   ├── skills/
│   │   └── command-development/  (target)
│   │       ├── SKILL.md
│   │       ├── references/
│   │       └── scripts/
│   └── commands/
└── README.md
```

### Skill Components

1. **SKILL.md**: Main skill definition with frontmatter
2. **references/**: Supporting documentation
3. **scripts/**: Helper scripts (if any)

### Splash Command Pattern

```
.claude/commands/
├── core/
│   └── plan.md              # Router command
└── plan/
    ├── fast.md              # Variant 1
    ├── hard.md              # Variant 2
    └── parallel.md          # Variant 3
```

## Related Code Files

### To Analyze

- `anthropics/claude-code/.claude/skills/command-development/SKILL.md`
- `.claude/commands/core/plan.md` (splash pattern reference)
- `.claude/commands/plan/*.md` (variant examples)
- `packages/core/skills/doc-coauthoring/SKILL.md` (structure reference)

### To Reference

- `packages/meta-kit-design/package.yaml` (for Phase 2)
- `packages/core/package.yaml` (package structure example)

## Implementation Steps

### Step 1: Clone Repository

```bash
# Navigate to temp directory
cd /tmp

# Clone anthropics/claude-code
git clone https://github.com/anthropics/claude-code.git

# Navigate to repository
cd claude-code
```

### Step 2: Locate Skill

```bash
# Find command development skill
find .claude/skills -name "*command*" -o -name "*cmd*"

# List skill directories
ls -la .claude/skills/

# Examine skill structure
tree .claude/skills/command-development/ || ls -R .claude/skills/command-development/
```

### Step 3: Analyze Skill Files

```bash
# Read main skill file
cat .claude/skills/command-development/SKILL.md

# Check for references
ls -la .claude/skills/command-development/references/

# Check for scripts
ls -la .claude/skills/command-development/scripts/
```

### Step 4: Document Structure

Create research report with:
- Skill file tree
- Frontmatter format
- Activation triggers
- Dependencies (if any)
- Reference files list
- Script files list

### Step 5: Analyze Splash Pattern

```bash
# Study existing splash commands
cat .claude/commands/core/plan.md
cat .claude/commands/plan/fast.md
cat .claude/commands/plan/hard.md
```

Document:
- Router command structure
- Variant delegation pattern
- Argument passing mechanism
- Skill activation in variants

### Step 6: Create Research Report

Save findings to:
`/Users/ddphuong/Projects/agent-kit/epost-agent-kit/plans/260211-1000-add-command-dev-skill/research/command-dev-skill-analysis.md`

## Todo List

- [ ] Clone anthropics/claude-code repository
- [ ] Locate Command Development skill directory
- [ ] Read SKILL.md and document frontmatter
- [ ] List all skill files (references, scripts)
- [ ] Identify skill dependencies
- [ ] Analyze activation triggers
- [ ] Study splash command pattern
- [ ] Document router → variant delegation
- [ ] Create comprehensive research report
- [ ] Identify compatibility concerns
- [ ] List required files for Phase 2

## Success Criteria

- Repository cloned successfully
- Command Development skill located
- Complete file inventory documented
- Skill structure understood
- Splash pattern analyzed
- Research report completed
- All dependencies identified
- No blockers for Phase 2

## Risk Assessment

### Potential Issues

1. **Repository Access**: May require authentication
   - Mitigation: Use public clone URL

2. **Skill Not Found**: Skill may not exist or be named differently
   - Mitigation: Search broadly, check documentation

3. **Complex Dependencies**: Skill may require external tools
   - Mitigation: Document all dependencies for Phase 2 decisions

4. **Structure Mismatch**: Skill format may differ from epost-agent-kit
   - Mitigation: Plan adaptation strategy in research report

## Security Considerations

- Clone from official anthropics repository only
- Verify repository authenticity
- Review skill code for any external calls
- Check for API keys or credentials in skill files

## Next Steps

After completion:
1. Review research report
2. Confirm all files identified
3. Validate no blockers
4. Proceed to Phase 2: Skill Integration

---

**Created by**: Phuong Doan
**Phase**: 1/4
