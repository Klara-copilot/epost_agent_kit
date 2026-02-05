# Migration Guide: v0.1 → v0.2

## Overview

Version 0.2 introduces significant enhancements to the epost_agent_kit framework with 3 new agents, 6 new skills, enhanced workflows, and standardized cross-cutting patterns. This guide documents all breaking changes and migration steps.

## What Changed

### Cross-Cutting Patterns Added

All agents now standardly include:

1. **Skills Activation Instruction** - Explicit directive to analyze and activate relevant skills during task execution
2. **Token Efficiency Awareness** - Emphasis on context management and avoiding unnecessary verbosity
3. **YAGNI/KISS/DRY Principles** - Core software engineering principles enforced across all agents
4. **Report Naming Convention** - Standardized report naming with timestamps and descriptive slugs
5. **Concision Instruction** - Clear expectation for concise, focused outputs
6. **Large File Handling Protocol** - Documented strategies for managing files exceeding size limits
7. **Project Docs Awareness** - References to codebase standards and documentation
8. **Model Specification** - Each agent has explicit model assignment (haiku, sonnet, opus, or inherit)

### New Agents

Three new specialized agents added:

| Agent | Model | Purpose |
|-------|-------|---------|
| **epost-scout** | haiku | Codebase file search and pattern matching |
| **epost-brainstormer** | sonnet | Solution evaluation and design alternatives |
| **epost-database-admin** | sonnet | Database optimization and schema design |

### Enhanced Agents

All existing agents enhanced with:
- Cross-cutting pattern integration
- Report templates with consistent naming
- Model specification
- Improved delegation clarity

**Enhanced**: orchestrator, architect, implementer, reviewer, debugger, tester, researcher, documenter, git-manager

### New Skills (6 Total)

| Skill | Purpose | Platform |
|-------|---------|----------|
| **code-review** | Code quality and security analysis patterns | All |
| **sequential-thinking** | Structured debugging and analysis techniques | All |
| **docs-seeker** | Documentation discovery and integration | All |
| **problem-solving** | Meta-reasoning and problem decomposition | All |
| **repomix** | Codebase compression and analysis | All |
| **docker** | Container management and orchestration | DevOps |

### Enhanced Skills (6 Total)

Skills updated with cross-cutting patterns and improved integration:

| Skill | Improvements |
|-------|--------------|
| **research** | Added evidence-based approach patterns |
| **planning** | Added todo tracking and phase management |
| **debugging** | Added systematic root cause analysis |
| **databases** | Added performance optimization patterns |
| **backend-development** | Added security and testing standards |
| **frontend-development** | Added responsive design and accessibility patterns |

### Enhanced Workflows

All primary workflows now include additional validation steps:

**Feature Development Workflow (4→6 steps)**:
- Plan (architect) → Code (implementer) → Test (tester)
- **[NEW]** Review (reviewer) → **[NEW]** Document (documenter) → Deploy

**Bug Fixing Workflow (3→5 steps)**:
- **[NEW]** Analyze with scout (debugger) → Diagnose (debugger) → Fix (implementer)
- → Test (tester) → **[NEW]** Review (reviewer)

**Project Initialization Workflow (2→4 steps)**:
- **[NEW]** Setup (orchestrator) → **[NEW]** Plan (architect)
- → **[NEW]** Document (documenter) → Ready

### New Commands

Three new commands added to support enhanced workflows:

```
/scout      - Search codebase for patterns and references
/brainstorm - Generate and evaluate alternative solutions
/review     - Comprehensive code quality and security review
```

### Model Distribution Changes

**New Distribution**:
- Haiku (5 agents): orchestrator, tester, researcher, documenter, scout
- Sonnet (8 agents): implementer, reviewer, debugger, brainstormer, database-admin, web-developer, ios-developer, android-developer
- Opus (1 agent): architect
- Inherit (1 agent): git-manager

## Breaking Changes

### Agent Naming Convention

If you have custom agents, update naming:
- Old: `my-custom-agent.md`
- New: `epost-my-custom-agent.md` (with epost prefix)

### Report Output Paths

Updated report naming convention:
- Old: `/reports/scout-report.md`
- New: `/reports/docs-manager-260205-2120-{slug}.md` (with timestamp and slug)

**Migration**: Update any hardcoded report paths in scripts or automation.

### Workflow Chains

If extending workflows, update delegation chains:

Before:
```
user → architect → implementer → tester
```

After:
```
user → orchestrator → architect → implementer → tester → reviewer → documenter
```

### Git Operations

git-manager agent now uses inherited model configuration. If calling explicitly, specify in delegation.

## Migration Steps

### 1. Update Agent References

If you have custom code referencing agents, update names:

```bash
# Search for old naming patterns
grep -r "epost-[^-]" .claude/agents/

# Rename files if needed
mv old-agent.md epost-old-agent.md
```

### 2. Update Workflows

If you have custom workflow files, add new validation steps:

```markdown
# Before
- Implement
- Test

# After
- Implement
- Test
- Review
- Document
```

### 3. Update Report Paths

If scripts reference report locations, update paths:

```bash
# Old
/reports/output.md

# New
/reports/docs-manager-260205-2120-{descriptive-slug}.md
```

### 4. Review Skill Usage

New skills available. Consider activating:
- `code-review` for quality checks
- `sequential-thinking` for complex analysis
- `docs-seeker` for documentation integration
- `problem-solving` for design work

### 5. Test Workflows

After migration, test key workflows:

```bash
# Test feature workflow
/cook implementation-task

# Test debugging workflow
/fix bug-description

# Test review workflow
/review code-changes
```

## Compatibility Notes

### Backward Compatibility

- All existing workflows still function
- New agents are additive; no removal of existing agents
- Existing commands unchanged
- Platform delegation (web, ios, android) preserved

### Forward Compatibility

The framework is designed for easy extension:
- Add new agents by following the epost-{name} naming convention
- Integrate new skills by including them in agent SKILL activation directives
- Extend workflows by chaining agents in orchestrator

## Testing Checklist

After migration, verify:

- [ ] All 15 agents load without errors
- [ ] Orchestrator successfully routes to all agents
- [ ] Platform detection works (web, ios, android)
- [ ] Scout finds files in codebase
- [ ] Review workflow produces reports
- [ ] Documentation updates capture changes
- [ ] No circular delegation detected
- [ ] All skill references resolve

## Support

For migration issues:

1. Check [docs/agent-inventory.md](./agent-inventory.md) for current agent list
2. Review [docs/system-architecture.md](./system-architecture.md) for architecture details
3. Verify [docs/code-standards.md](./code-standards.md) for coding patterns
4. Consult project maintainers for custom implementations

---

**Created by**: Phuong Doan
**Last Updated**: 2026-02-05
**Version**: 1.0
