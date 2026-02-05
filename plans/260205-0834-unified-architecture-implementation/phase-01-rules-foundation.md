# Phase 1: Rules Foundation

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 0](phase-00-dependencies-audit.md)
- Research: [Cross-Platform Formats](research/researcher-01-cross-platform-formats.md)

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 2h
- **Description**: Update rules in `.claude/rules/` to reflect parent-child delegation protocol. These rules govern how all agents behave, so they must be updated before restructuring agents.

## Key Insights
- Current `orchestration-protocol.md` describes sequential/parallel chaining but lacks parent-child routing
- Current `primary-workflow.md` references old agent names (planner, fullstack-developer, code-reviewer, docs-manager)
- Rules are global and platform-agnostic; platform conventions belong in agent prompts
- Cursor uses `.cursor/rules/*.mdc` with different frontmatter; Copilot uses `.github/instructions/*.instructions.md`

## Requirements

### Functional
- `orchestration-protocol.md`: Add parent-child delegation rules (global agents route to platform agents)
- `primary-workflow.md`: Update all agent name references to new names
- `development-rules.md`: Add platform detection rules and cross-platform guidelines
- `documentation-management.md`: Update agent references
- All rules remain platform-agnostic (no platform-specific code in rules)

### Non-Functional
- Rules under 200 lines each
- Clear, concrete examples (not vague guidance)
- Rules must work for Claude Code first; Cursor/Copilot conversion handled in Phase 8

## Architecture

Rules hierarchy:
```
CLAUDE.md (top-level project instructions)
  |
  +-- .claude/rules/orchestration-protocol.md   (delegation patterns)
  +-- .claude/rules/primary-workflow.md          (workflow steps with new names)
  +-- .claude/rules/development-rules.md         (coding standards + platform detection)
  +-- .claude/rules/documentation-management.md  (docs maintenance)
```

## Related Code Files

### Modify
- `.claude/rules/orchestration-protocol.md` - Add parent-child delegation protocol
- `.claude/rules/primary-workflow.md` - Update agent name references
- `.claude/rules/development-rules.md` - Add platform detection section
- `.claude/rules/documentation-management.md` - Update agent references

### No Create/Delete
- Rules files already exist; update in place

## Implementation Steps

1. **Update `orchestration-protocol.md`**:
   - Add "Parent-Child Delegation" section:
     ```
     Global agents (orchestrator, architect, implementer, reviewer, debugger, tester)
     route tasks to platform agents (web/*, ios/*, android/*) based on:
     1. Explicit platform prefix in command (/web:cook, /ios:test)
     2. File extension detection (.swift -> ios, .kt -> android, .tsx -> web)
     3. Project structure detection (Package.swift -> ios, build.gradle -> android)
     ```
   - Add delegation protocol:
     ```
     When delegating:
     1. Global agent identifies platform from context
     2. Global agent spawns platform-specific subagent
     3. Platform agent executes within its domain
     4. Platform agent reports results back to global agent
     ```
   - Keep existing sequential/parallel chaining sections

2. **Update `primary-workflow.md`**:
   - Replace `planner` -> `architect`
   - Replace `fullstack-developer` -> `implementer`
   - Replace `code-reviewer` -> `reviewer`
   - Replace `docs-manager` -> `documenter`
   - Replace `project-manager` references -> `orchestrator`
   - Add note: "implementer delegates to `web/implementer`, `ios/implementer`, or `android/implementer`"

3. **Update `development-rules.md`**:
   - Add "Platform Detection" section with file extension and project structure rules
   - Add "Cross-Platform Guidelines" section:
     - Shared skills (databases, docker) available to all platform agents
     - Platform skills only loaded by their respective platform agents

4. **Update `documentation-management.md`**:
   - Replace old agent name references with new names
   - Add `orchestrator` as the agent responsible for roadmap/changelog updates

## Todo List

- [ ] Update orchestration-protocol.md with parent-child delegation
- [ ] Update primary-workflow.md with new agent names
- [ ] Update development-rules.md with platform detection
- [ ] Update documentation-management.md with new agent names
- [ ] Verify no old agent names remain in any rules file
- [ ] Verify rules are under 200 lines each

## Success Criteria

- Grep for old agent names (planner, fullstack-developer, code-reviewer, docs-manager, project-manager) returns zero matches in `.claude/rules/`
- `orchestration-protocol.md` contains parent-child delegation section
- `development-rules.md` contains platform detection rules
- All rules files compile as valid markdown

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| CLAUDE.md also references old names | Broken references at top level | Update CLAUDE.md in Phase 2 alongside agent changes |
| Rules too verbose | Exceeds 200-line limit | Use references to phase docs instead of inline detail |

## Security Considerations
- No code execution, documentation-only changes
- No secrets or credentials involved

## Next Steps
- Phase 2 uses updated rules to guide agent restructuring
- Rules must be complete before agents reference them
