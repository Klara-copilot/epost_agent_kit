---
title: "Command Development Skill Integration - Planning Report"
created: 2026-02-11
planner: epost-planner (aeb44c1)
effort: 6h
phases: 4
status: ready-for-implementation
---

# Command Development Skill Integration - Planning Report

## Executive Summary

Comprehensive 4-phase plan created for integrating Command Development skill from anthropics/claude-code into meta-kit-design package and creating interactive command generator for splash command pattern.

## Plan Location

**Directory**: `/Users/ddphuong/Projects/agent-kit/epost-agent-kit/plans/260211-1000-add-command-dev-skill/`

**Status**: Active (set via set-active-plan.cjs)

## Deliverables

### Phase 1: Research & Acquisition (1.5h)
- Clone anthropics/claude-code repository
- Locate and analyze Command Development skill
- Document skill structure, dependencies, triggers
- Study splash command pattern
- Create research report

**Outputs**:
- Research report: `research/command-dev-skill-analysis.md`
- Skill file inventory
- Dependency list
- Compatibility assessment

### Phase 2: Skill Integration (2h)
- Copy skill to `packages/meta-kit-design/skills/agents/claude/command-development/`
- Update `package.yaml` with new skill reference
- Verify file integrity and frontmatter
- Update CHANGELOG
- Test skill loading

**Outputs**:
- Skill files in meta-kit-design package
- Updated package.yaml
- Updated CHANGELOG.md

### Phase 3: Command Generator Creation (2h)
- Create router command: `.claude/commands/meta/generate-command.md`
- Create splash generator: `.claude/commands/generate-command/splash.md`
- Create simple generator: `.claude/commands/generate-command/simple.md`
- Implement interactive command name selection
- Integrate Command Development skill

**Outputs**:
- 3 command files (router + 2 variants)
- Interactive command generation workflow
- Updated package.yaml with commands

### Phase 4: Testing & Documentation (0.5h)
- Test E2E splash command generation
- Test E2E simple command generation
- Verify skill activation
- Update documentation with usage examples
- Cleanup test artifacts

**Outputs**:
- Tested command generation workflow
- Updated README with usage
- Usage examples document

## Technical Architecture

### Skill Location
```
packages/meta-kit-design/skills/agents/claude/
└── command-development/
    ├── SKILL.md
    ├── references/
    └── scripts/
```

### Command Structure
```
.claude/commands/
├── meta/
│   └── generate-command.md        # Router
└── generate-command/
    ├── splash.md                  # Splash generator
    └── simple.md                  # Simple generator
```

### Workflow
```
User: /meta:generate-command
  ↓
Router: Select splash/simple
  ↓
Variant: Activate command-development skill
  ↓
Interactive: Prompt for command details
  ↓
Generate: Create router + variants or standalone
  ↓
Output: Command files + usage instructions
```

## Key Design Decisions

1. **Package Location**: meta-kit-design (meta-level tooling)
2. **Command Pattern**: Splash (router + variants)
3. **Skill Integration**: File-based, no dependencies
4. **Interactive UX**: Command name selection, variant specification
5. **Templates**: Based on existing plan command pattern

## Success Metrics

- [ ] Skill integrated without breaking changes
- [ ] Command generator functional
- [ ] Can create splash commands (router + variants)
- [ ] Can create simple commands (standalone)
- [ ] Documentation complete with examples
- [ ] All tests pass

## Dependencies

**External**:
- anthropics/claude-code repository (public)
- Git access for cloning

**Internal**:
- meta-kit-design package structure
- Existing splash command pattern (plan, cook, etc.)
- Command Development skill compatibility

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Skill not found in repo | High | Search broadly, check docs |
| Structure mismatch | Medium | Adapt to epost-agent-kit format |
| Complex dependencies | Medium | Document, evaluate alternatives |
| Skill activation failure | High | Test thoroughly in Phase 2 |
| Invalid generated files | Medium | Validate templates, test E2E |

## Implementation Notes

**Critical Path**: Phase 1 → Phase 2 → Phase 3 → Phase 4 (sequential)

**Parallel Opportunities**: None (each phase depends on previous)

**Testing Strategy**:
- Unit: Command name validation, file paths
- Integration: Router delegation, skill activation
- E2E: Generate splash + simple commands

**Quality Gates**:
- Phase 1: Research report complete, no blockers
- Phase 2: Skill loads without errors
- Phase 3: Commands generate valid files
- Phase 4: All E2E tests pass

## Files Created

1. `plan.md` - Overview with frontmatter
2. `phase-01-research-acquisition.md` - Research & clone
3. `phase-02-skill-integration.md` - Copy & configure
4. `phase-03-command-generator.md` - Build commands
5. `phase-04-testing-documentation.md` - Test & document
6. `planner-260211-1000-command-dev-skill.md` - This report

## Next Actions

1. **Execute Phase 1**: Clone repo, analyze skill
2. **Review Research**: Validate findings, check blockers
3. **Execute Phase 2**: Integrate skill
4. **Execute Phase 3**: Build command generator
5. **Execute Phase 4**: Test and document

## Unresolved Questions

- Exact location of Command Development skill in anthropics/claude-code (will discover in Phase 1)
- Skill activation trigger syntax (will document in Phase 1)
- Command Development skill dependencies (will identify in Phase 1)
- Optimal number of variants for splash commands (will determine in Phase 3)

---

**Created by**: Phuong Doan (planner agent aeb44c1)
**Plan Ready**: 2026-02-11
**Estimated Effort**: 6 hours
**Status**: Ready for implementation
