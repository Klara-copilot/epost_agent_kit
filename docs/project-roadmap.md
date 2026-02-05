# Project Roadmap

## Executive Summary

The epost_agent_kit development roadmap spans 9 implementation phases over approximately 32 hours, transforming the project from planning phase to a complete multi-platform agent distribution system. The roadmap prioritizes core architecture stability (Phases 0-4) before expanding to additional platforms (Phases 5-6) and building the distribution CLI (Phase 7-9).

**Current Status**: Planning Phase (Phase 0 pending)
**Target Completion**: ~2-3 weeks at full-time effort (assuming sequential execution)
**Key Stakeholders**: Development team, platform partners (Claude, Cursor, Copilot)

---

## Phase Overview & Timeline

### High-Level Timeline

```
Week 1        |  Week 2        |  Week 3
Phases 0-2    |  Phases 3-4    |  Phases 5-9
(Audit,       |  (Platform &   |  (CLI,
Foundations)  |  Verification) |  Distribution)
```

### Phase Dependency Graph

```
Phase 0: Audit & Dependencies (1h)
    ↓
Phase 1: Rules Foundation (2h)
    ↓
Phase 2: Global Agents (4h) ─────┐
    ↓                             │
Phase 3: Web Platform (3h) ──────┤
    ↓                             ├─→ Phase 4: Verification (2h)
Phase 5: iOS Platform (3h) ──────┤
    ↓                             │
Phase 6: Android Platform (2h) ──┘
    ↓
Phase 7: CLI Build (8h)
    ↓
Phase 8: Platform Sync (4h)
    ↓
Phase 9: E2E Verification (3h)
```

---

## Detailed Phase Breakdown

### Phase 0: Dependencies & Audit (1 hour)

**Status**: Pending
**Focus**: Foundation and inventory
**Deliverables**: Audit report, dependency list

**Goals**:
- Audit existing agents, skills, commands for inventory
- Document cross-platform format requirements
- Identify external dependencies needed
- Prepare development environment

**Tasks**:
1. Create audit checklist for all components
2. Verify research reports completeness (cross-platform formats, CLI patterns)
3. Document external skill dependencies (skill-creator, find-skills)
4. Set up development environment (Node.js, TypeScript, CLI tools)
5. Verify git repository health

**Success Criteria**:
- Audit report completed and filed
- All cross-platform format requirements documented
- External dependencies identified
- Development environment ready for Phase 1

**Key Insights**:
- 11 existing agents will be restructured to 9 global + platform-specific
- 11 existing skills will be reorganized by platform
- 23 commands exist and will be updated with new agent references

---

### Phase 1: Rules Foundation (2 hours)

**Status**: Pending
**Focus**: Governance and project rules
**Dependencies**: Phase 0
**Deliverables**: 4 rules files in `.claude/rules/`

**Goals**:
- Create foundational governance structure
- Define development workflow
- Document orchestration protocol
- Establish documentation management practices

**Files to Create**:

1. **primary-workflow.md** (80-100 lines)
   - Development workflow stages
   - Platform detection and routing
   - Code implementation cycle
   - Testing and review stages
   - Integration and deployment

2. **development-rules.md** (100-120 lines)
   - General development guidelines
   - Code quality standards
   - File naming conventions
   - YAGNI/KISS/DRY principles
   - Error handling and security

3. **orchestration-protocol.md** (100-120 lines)
   - Parent-child delegation pattern
   - Platform detection logic
   - Agent routing rules
   - Skill organization principles
   - Extension guidelines

4. **documentation-management.md** (80-100 lines)
   - Documentation requirements
   - Roadmap maintenance
   - Changelog updates
   - Documentation triggers
   - Review protocols

**Success Criteria**:
- All 4 rules files created in `.claude/rules/`
- CLAUDE.md references all rules appropriately
- Rules clear enough for Phases 2+ to follow
- No contradictions or ambiguities between rules

---

### Phase 2: Global Agents Restructuring (4 hours)

**Status**: Pending
**Focus**: Agent renaming and reorganization
**Dependencies**: Phase 0, Phase 1
**Deliverables**: 9 restructured global agents, updated commands

**Agent Transformations**:

| Current | Action | New | Status |
|---------|--------|-----|--------|
| planner.md | RENAME | architect.md | To do |
| fullstack-developer.md | RENAME | implementer.md | To do |
| code-reviewer.md | RENAME | reviewer.md | To do |
| docs-manager.md | RENAME | documenter.md | To do |
| project-manager.md | MERGE | → orchestrator.md | To do |
| performance-analyst.md | MERGE | → reviewer.md | To do |
| ui-designer.md | MOVE | → web/designer.md (Phase 3) | To do |
| researcher.md | KEEP | researcher.md | To do |
| debugger.md | UPDATE | Add delegation section | To do |
| tester.md | UPDATE | Add delegation section | To do |
| git-manager.md | KEEP | git-manager.md | To do |

**Implementation Tasks**:
1. Create orchestrator.md (combining project-manager + routing logic)
2. Rename planner → architect (update frontmatter)
3. Rename fullstack-developer → implementer (add delegation)
4. Merge code-reviewer + performance-analyst → reviewer
5. Rename docs-manager → documenter
6. Update debugger with delegation section
7. Update tester with delegation section
8. Update all commands to reference new agent names
9. Update all workflows to reference new agent names
10. Delete old agent files (project-manager, performance-analyst, ui-designer)
11. Grep for old agent names - verify zero matches

**Command Updates Required**:
- `core/cook.md`: agent: fullstack-developer → agent: implementer
- `core/plan.md`: verify → agent: architect
- `core/debug.md`: verify agent reference
- `core/test.md`: verify agent reference
- All other commands: scan and verify

**Success Criteria**:
- 9 global agents exist with correct names
- All command agent references updated
- All workflows updated
- Zero old agent names in codebase (except plans/)
- Phase 4 tests pass (agent routing works)

---

### Phase 3: Web Platform Agents (3 hours)

**Status**: Pending
**Focus**: Web platform specialization
**Dependencies**: Phase 2
**Deliverables**: 3 web platform agents, web skills

**Agents to Create**:

1. **web/implementer.md** (150-200 lines)
   - Role: Implement features in Next.js/React
   - Tools: Read, Glob, Grep, Bash, Edit, Write
   - Specialization: React components, hooks, state management
   - Frameworks: Next.js App Router, TypeScript, Tailwind
   - Libraries: shadcn/ui, Zustand, TanStack Query

2. **web/tester.md** (150-200 lines)
   - Role: Web testing and quality assurance
   - Testing frameworks: Vitest, Playwright, Testing Library
   - Coverage: Unit, integration, E2E tests
   - Performance: Lighthouse, Web Vitals

3. **web/designer.md** (150-200 lines)
   - Role: Design system and accessibility
   - Tools: shadcn/ui components, Figma integration
   - Styling: Tailwind CSS, CSS modules
   - Accessibility: WCAG 2.1 AA compliance

**Skills to Create/Reorganize**:
- Move existing `frontend-development` skill → `web/frontend-development`
- Move existing `nextjs` skill → `web/nextjs`
- Move existing `shadcn-ui` skill → `web/shadcn-ui`
- Move existing `backend-development` skill → `web/backend-development`
- Create new `web/testing` skill (if needed)

**Implementation Tasks**:
1. Create web/ directory in `.claude/agents/`
2. Create web/implementer.md with full prompt
3. Create web/tester.md with testing guidance
4. Create web/designer.md with design system guidance
5. Move/reorganize skills to `.claude/skills/web/`
6. Update implementer.md to mention web/implementer delegation
7. Test command routing: `/cook` → implementer → web/implementer

**Success Criteria**:
- 3 web platform agents created
- Web skills organized in `.claude/skills/web/`
- Phase 4 tests verify `/web:cook` routes to web/implementer
- All agent prompts under 200 lines
- Skills properly categorized and discoverable

---

### Phase 4: Functional Verification (2 hours)

**Status**: Pending
**Focus**: Test agent routing and delegation
**Dependencies**: Phases 0-3
**Deliverables**: Verification report, test results

**Testing Scope**:

1. **Agent Existence** (15 min)
   - All 9 global agents exist ✓
   - All platform agents created (web/) ✓
   - Agents have valid YAML frontmatter ✓
   - No duplicate agent names ✓

2. **Command Routing** (30 min)
   - `/cook` command exists and has agent reference ✓
   - `/cook` routes to implementer ✓
   - `/web:cook` routes to web/implementer ✓
   - `/test`, `/debug`, `/plan` commands route correctly ✓
   - Commands with new agent names work ✓

3. **Delegation Logic** (30 min)
   - Implementer detects platform from context ✓
   - Implementer delegates to web/implementer for web projects ✓
   - Orchestrator routes to correct global agent ✓
   - Platform agents execute without cross-platform confusion ✓

4. **Skill Accessibility** (15 min)
   - Global skills accessible from all agents ✓
   - Web skills accessible from web agents ✓
   - Shared skills accessible everywhere ✓
   - Skill discovery works (CLI/IDE) ✓

**Verification Tests**:
```typescript
// Example verification test structure
describe('Phase 4: Functional Verification', () => {
  it('should have 9 global agents', async () => {
    const agents = await discoverAgents('.claude/agents');
    expect(agents.filter(a => !a.platform)).toHaveLength(9);
  });

  it('should route /cook to web/implementer for web projects', async () => {
    const cmd = await parseCommand('/cook');
    const agent = cmd.getAgent('.'); // current dir
    expect(agent.path).toBe('.claude/agents/web/implementer.md');
  });

  it('should have all skills discoverable', async () => {
    const skills = await discoverSkills('.claude/skills');
    expect(skills.length).toBeGreaterThan(10);
  });
});
```

**Success Criteria**:
- All agent existence tests pass
- All command routing tests pass
- All delegation tests pass
- All skill accessibility tests pass
- Verification report completed

---

### Phase 5: iOS Platform Agents (3 hours)

**Status**: Pending
**Focus**: iOS platform specialization
**Dependencies**: Phase 2
**Deliverables**: 3 iOS platform agents, iOS skills

**Agents to Create**:

1. **ios/implementer.md** (150-200 lines)
   - Role: Swift implementation for iOS
   - Language: Swift 6
   - UI: SwiftUI (primary), UIKit (legacy)
   - Architecture: MVVM, Clean Architecture
   - State: Combine, @State, @StateObject

2. **ios/tester.md** (150-200 lines)
   - Role: iOS testing and quality
   - Unit testing: XCTest
   - UI testing: XCUITest
   - Performance: Instruments, profiling

3. **ios/simulator.md** (150-200 lines)
   - Role: Simulator management and debugging
   - Simulator control: Launch, configure, manage
   - Debugging: Capture crashes, logs, screenshots
   - Recording: Video capture and analysis

**Skills to Create**:
- Move existing `ios-development` → `ios/ios-development`
- Create `ios/swiftui` skill (if needed)
- Create `ios/testing` skill (if needed)

**Implementation Tasks**:
1. Create ios/ directory in `.claude/agents/`
2. Create ios/implementer.md, ios/tester.md, ios/simulator.md
3. Move/reorganize skills to `.claude/skills/ios/`
4. Update debugger.md to mention ios/simulator delegation
5. Update tester.md to mention ios/tester delegation
6. Test command routing to iOS agents

**Success Criteria**:
- 3 iOS platform agents created
- iOS skills organized in `.claude/skills/ios/`
- Agent prompts under 200 lines each
- Skills properly categorized

---

### Phase 6: Android Platform Agents (2 hours)

**Status**: Pending
**Focus**: Android platform specialization
**Dependencies**: Phase 2
**Deliverables**: 2 Android platform agents, Android skills

**Agents to Create**:

1. **android/implementer.md** (150-200 lines)
   - Role: Kotlin implementation for Android
   - Language: Kotlin
   - UI: Jetpack Compose (primary)
   - Architecture: MVVM, MVI
   - State: ViewModel, Flow, StateFlow

2. **android/tester.md** (150-200 lines)
   - Role: Android testing and quality
   - Unit testing: JUnit
   - UI testing: Espresso, Compose testing
   - Performance: Profiler, benchmarking

**Skills**:
- Move existing skills → `android/` (if any)
- Create `android/android-development` skill

**Implementation Tasks**:
1. Create android/ directory in `.claude/agents/`
2. Create android/implementer.md, android/tester.md
3. Move/organize skills to `.claude/skills/android/`
4. Update implementer.md and tester.md for Android delegation

**Success Criteria**:
- 2 Android platform agents created
- Agent prompts under 200 lines
- Skills organized and discoverable

---

### Phase 7: CLI Build (8 hours)

**Status**: Pending
**Focus**: Distribution command-line tool
**Dependencies**: Phases 0-6
**Deliverables**: `npx epost-kit` fully functional CLI

**CLI Commands to Implement**:

1. **install** (2h)
   - `npx epost-kit install` - Install all to Claude Code (default)
   - `npx epost-kit install --target cursor` - Install to Cursor
   - `npx epost-kit install --target copilot` - Install to Copilot
   - `npx epost-kit install --platform web` - Web components only
   - `npx epost-kit install --platform ios` - iOS components only

2. **list** (1.5h)
   - `npx epost-kit list` - Show all components by platform
   - `npx epost-kit list --platform web` - Web components only
   - Grouped by type (agents, skills, commands)
   - Searchable/filterable

3. **create** (2h)
   - `npx epost-kit create skill {platform} {name}` - Scaffold skill
   - `npx epost-kit create agent {name}` - Scaffold agent
   - `npx epost-kit create command {category} {name}` - Scaffold command
   - Generates from templates in `.claude/templates/`

4. **validate** (1.5h)
   - `npx epost-kit validate` - Check spec compliance
   - Validates agent YAML frontmatter
   - Validates skill structure
   - Reports errors and warnings
   - Checks for size limit violations

**Core Modules**:

- **discovery.ts** (150 lines) - Scan and catalog components
- **installer.ts** (200 lines) - Install to targets
- **converter.ts** (250 lines) - Convert between formats
- **resolver.ts** (150 lines) - Resolve dependencies
- **targets.ts** (100 lines) - Platform path mappings
- **lock.ts** (100 lines) - Track installations

**Package Configuration**:
```json
{
  "name": "epost-kit",
  "version": "0.1.0",
  "description": "Multi-platform agent kit CLI",
  "bin": { "epost-kit": "dist/index.js" },
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src/",
    "start": "node dist/index.js"
  }
}
```

**Implementation Tasks**:
1. Set up TypeScript project with build configuration
2. Implement discovery module (scan .claude/ directory)
3. Implement installer module (copy files to targets)
4. Implement converter module (Claude → Cursor/Copilot formats)
5. Implement resolver module (dependency resolution)
6. Implement targets module (path mappings per platform)
7. Implement lock module (installation tracking)
8. Create Commander.js CLI interface
9. Create scaffolding templates
10. Add error handling and user feedback
11. Write comprehensive tests

**Success Criteria**:
- `npm run build` compiles without errors
- All 4 CLI commands work correctly
- Installation creates valid files
- Conversion is lossless (100% fidelity)
- Tests pass with 80%+ coverage
- CLI completes `install` in < 30 seconds

---

### Phase 8: Platform Sync (4 hours)

**Status**: Pending
**Focus**: Generate platform-specific distributions
**Dependencies**: Phase 7
**Deliverables**: Cursor and Copilot ready distributions

**Conversion Tasks**:

1. **Cursor Distribution** (1.5h)
   - Generate `AGENTS.md` from `.claude/agents/`
   - Convert `.claude/rules/` → `.cursor/rules/*.mdc`
   - Convert `.claude/skills/*/SKILL.md` → `.cursor/commands/*.md`
   - Generate `.cursor/commands.mdc` (combined commands)
   - Validate Cursor spec compliance

2. **Copilot Distribution** (1.5h)
   - Convert `.claude/agents/` → `.github/agents/*.agent.md`
   - Convert `.claude/rules/` → `.github/instructions/*.instructions.md`
   - Convert `.claude/skills/` → `.github/prompts/*.prompt.md`
   - Generate handoffs for workflow transitions
   - Validate GitHub Copilot spec compliance

3. **Platform Testing** (1h)
   - Test Cursor AGENTS.md loads correctly
   - Test all rules apply in Cursor
   - Test commands available in Copilot
   - Verify no conversion errors

**File Generation Examples**:

**AGENTS.md** (from Claude agents):
```markdown
## orchestrator
Top-level task router and project manager

Routes tasks to appropriate global agents, detects platform context, manages project structure.

### Subdelegates
- architect
- implementer
- reviewer
- researcher
- debugger
- tester
- documenter
- git-manager

## web/implementer
Implements features in Next.js and React

Features implementation in React/Next.js ecosystem.
```

**Cursor Rules** (.mdc):
```yaml
---
description: Primary Development Workflow
alwaysApply: true
---
## Development Workflow
[Markdown content from primary-workflow.md]
```

**Copilot Agents** (.agent.md):
```yaml
---
name: orchestrator
description: Top-level task router and project manager
tools: ['read', 'edit/editFiles', 'search/codebase']
handoffs:
  - label: "Plan Architecture"
    agent: architect
    prompt: "Plan the architecture for this task"
---
[Prompt content]
```

**Success Criteria**:
- Cursor: `AGENTS.md` valid and complete
- Cursor: All rules converted to `.mdc` format
- Cursor: Commands accessible via `/` prefix
- Copilot: All agents have valid YAML
- Copilot: All instructions apply to correct files
- Copilot: Prompts work in Chat interface

---

### Phase 9: E2E Verification (3 hours)

**Status**: Pending
**Focus**: Cross-platform validation and testing
**Dependencies**: Phase 8
**Deliverables**: Verification report, ready for launch

**Testing Matrix**:

| Feature | Claude Code | Cursor | Copilot |
|---------|-------------|--------|---------|
| Agent Loading | ✓ | ✓ | ✓ |
| Agent Delegation | ✓ | N/A | ✓ |
| Commands Work | ✓ | ✓ | ✓ |
| Rules Apply | ✓ | ✓ | ✓ |
| Skills Discoverable | ✓ | ✓ | ✓ |
| Cross-Platform Parity | ✓ | ✓ | ✓ |

**Test Scenarios**:

1. **Claude Code** (45 min)
   - Load all subagents and verify prompts
   - Execute `/cook` command → routes to implementer
   - Execute `/web:cook` → routes to web/implementer
   - Execute `/test`, `/debug`, `/plan` commands
   - Verify rules loaded from CLAUDE.md
   - Verify skills accessible
   - Test agent auto-delegation
   - Verify no errors or warnings

2. **Cursor** (45 min)
   - Load AGENTS.md and verify completeness
   - Enable rules from `.cursor/rules/`
   - Test all commands via `/` prefix
   - Verify file-scoped rules apply correctly
   - Test global rules always applied
   - Verify agent hierarchy works
   - Test platform detection

3. **GitHub Copilot** (30 min)
   - Load agents from `.github/agents/`
   - Verify instructions apply to files
   - Test prompts in Chat interface
   - Verify handoffs work
   - Test VS Code integration (if available)
   - Verify web interface works

**Documentation Review** (45 min):
- [ ] README.md complete with examples
- [ ] Installation guide accurate
- [ ] All commands documented
- [ ] Architecture diagrams clear
- [ ] Examples work as written
- [ ] Troubleshooting covers common issues
- [ ] API reference complete
- [ ] No broken internal links

**Final Checklist**:
- [ ] All phases 0-8 complete
- [ ] All tests pass
- [ ] Documentation reviewed and approved
- [ ] Security review passed
- [ ] Performance targets met
- [ ] Cross-platform parity verified
- [ ] No known bugs or issues
- [ ] Ready for public launch

**Success Criteria**:
- All verification tests pass
- All platforms function identically
- Documentation complete and accurate
- Zero blocking issues
- Ready for v0.1.0 release

---

## Milestone Summary

### Milestone 1: Foundation (Phases 0-2)
**Timeline**: Week 1, Days 1-3
**Effort**: 7 hours
**Deliverable**: Restructured global agent architecture
**Success Criteria**:
- Rules created
- 9 global agents restructured
- Old agents removed
- Commands updated

### Milestone 2: Platform Support (Phases 3-6)
**Timeline**: Week 1-2
**Effort**: 11 hours
**Deliverable**: Platform agents for web, iOS, Android
**Success Criteria**:
- All platform agents created
- Skills reorganized by platform
- Delegation tests pass
- Functional verification complete

### Milestone 3: Distribution (Phases 7-9)
**Timeline**: Week 2-3
**Effort**: 15 hours
**Deliverable**: CLI tool and multi-platform distribution
**Success Criteria**:
- CLI fully functional
- `npx epost-kit install` works
- All platforms supported
- E2E tests pass
- Ready for v0.1.0 release

---

## Resource Requirements

### Development Team

**Estimated Roles**:
- **Lead Developer**: Phases 0, 1, 2, 7, 8, 9 (all coordination)
- **Platform Specialists**:
  - Web: Phase 3, 4 testing
  - iOS: Phase 5, E2E testing
  - Android: Phase 6, E2E testing

**Estimated Hours per Role**:
- Lead: 20 hours (planning, architecture, CLI, sync)
- Web: 4 hours (testing, verification)
- iOS: 4 hours (testing, verification)
- Android: 2 hours (testing, verification)
- QA: 2 hours (cross-platform testing)

### Tools & Infrastructure

- **Development**: Node.js 18+, TypeScript 5+, Git
- **Testing**: Vitest, Playwright, manual IDE access
- **CI/CD**: GitHub Actions (optional for Phase 9)
- **Documentation**: Markdown, GitHub Wiki or Pages

---

## Risk Mitigation

### High-Risk Items

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Agent prompt too large | Medium | High | Enforce 200-line limit, code review |
| Cross-platform conversion bugs | High | High | Extensive testing, manual verification |
| CLI dependency issues | Low | Medium | Lock versions, vendor if needed |
| Performance regression | Low | Medium | Benchmark, profile during Phase 7 |

### Contingency Plans

**If agent restructuring is slower** (Phase 2 overrun):
- Extend Phase 2 by 2-4 hours
- Compress Phase 3-4 with parallel work
- Consider reducing Phase 5-6 scope initially

**If CLI development is complex** (Phase 7 overrun):
- Defer advanced features (Phase 2) to v0.2
- Focus on core install/list commands first
- Add create/validate as post-launch updates

**If cross-platform conversion has issues** (Phase 8):
- Implement manual conversion fallback
- Document workarounds
- Plan enhanced automation for v0.2

---

## Success Metrics

### Launch Criteria

- [ ] All phases 0-9 complete
- [ ] Zero blocking bugs
- [ ] Cross-platform tests pass
- [ ] Documentation complete and reviewed
- [ ] Performance targets met (< 30s install)
- [ ] Security review passed

### Post-Launch Metrics

- Teams using epost-kit
- Skills created per week
- GitHub stars and forks
- Bug reports and resolution time
- User satisfaction scores

---

## Future Roadmap (v0.2+)

### Phase 10: Enhancement & Polish
- Performance optimization
- Advanced CLI features
- Extended platform support
- Community feedback integration

### Phase 11: Ecosystem Growth
- Third-party skill marketplace
- Agent templates and generators
- IDE extension support
- CI/CD integration

### Phase 12: Maturity
- Version 1.0 release
- Enterprise features
- Paid tiers or support
- Global distribution

---

## Communication & Status

### Status Reports
- Weekly summary to stakeholders
- Phase completion announcements
- Risk escalation if needed

### Stakeholder Updates
- Architecture review after Phase 1
- Platform validation after Phase 4
- Distribution readiness after Phase 7
- Launch decision before Phase 9

### Public Communication
- GitHub releases for each phase
- Blog post announcing v0.1.0 launch
- Community feedback channels

---

**Last Updated**: 2026-02-05
**Owner**: Phuong Doan
**Status**: Planning Phase
**Next Review**: After Phase 0 Completion
