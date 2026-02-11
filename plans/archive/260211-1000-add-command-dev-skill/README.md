# Add Command Development Skill & Generator

**Status**: Ready for Implementation  
**Effort**: 6 hours  
**Branch**: feat/add-skill

## Quick Start

```bash
# View plan overview
cat plan.md

# Execute phases in order
cat phase-01-research-acquisition.md
cat phase-02-skill-integration.md
cat phase-03-command-generator.md
cat phase-04-testing-documentation.md

# Check planning report
cat ../reports/planner-260211-1000-command-dev-skill.md
```

## Phase Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ Phase 1: Research & Acquisition (1.5h)                          │
│ • Clone anthropics/claude-code                                  │
│ • Analyze Command Development skill                             │
│ • Study splash command pattern                                  │
│ • Create research report                                        │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Phase 2: Skill Integration (2h)                                 │
│ • Copy skill to meta-kit-design/skills/                         │
│ • Update package.yaml                                            │
│ • Verify frontmatter & structure                                │
│ • Test skill loading                                             │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Phase 3: Command Generator Creation (2h)                        │
│ • Create router: /meta:generate-command                         │
│ • Create splash variant                                         │
│ • Create simple variant                                         │
│ • Implement interactive prompts                                 │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Phase 4: Testing & Documentation (0.5h)                         │
│ • Test E2E command generation                                   │
│ • Verify skill activation                                       │
│ • Update documentation                                           │
│ • Cleanup test artifacts                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Expected Outputs

### Skill Files
```
packages/meta-kit-design/skills/agents/claude/
└── command-development/
    ├── SKILL.md
    ├── references/*.md
    └── scripts/*
```

### Command Files
```
.claude/commands/
├── meta/
│   └── generate-command.md
└── generate-command/
    ├── splash.md
    └── simple.md
```

### Configuration
```yaml
# packages/meta-kit-design/package.yaml
provides:
  skills:
    - agents/claude/command-development
  commands:
    - meta/generate-command
    - generate-command/splash
    - generate-command/simple
```

## Usage After Implementation

```bash
# Generate splash command
/meta:generate-command
→ Select: splash
→ Enter: analyze
→ Variants: quick, deep

# Result
/analyze           # Router
/analyze:quick     # Fast variant
/analyze:deep      # Thorough variant
```

## Files in This Plan

- `plan.md` - Overview with frontmatter
- `phase-01-research-acquisition.md` - Research phase details
- `phase-02-skill-integration.md` - Integration phase details
- `phase-03-command-generator.md` - Generator creation details
- `phase-04-testing-documentation.md` - Testing phase details
- `README.md` - This file
- `research/` - Research outputs (created in Phase 1)

## Related Documentation

- [System Architecture](../../docs/system-architecture.md)
- [Code Standards](../../docs/code-standards.md)
- [Planning Report](../reports/planner-260211-1000-command-dev-skill.md)
- [meta-kit-design Package](../../packages/meta-kit-design/)

---

**Created by**: Phuong Doan  
**Date**: 2026-02-11
