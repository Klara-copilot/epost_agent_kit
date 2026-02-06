# Project Changelog

All notable changes to the epost_agent_kit project are documented here. This file tracks features, bug fixes, security updates, and architectural changes across all components.

**Format**: Follows [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/) conventions.

---

## [1.1.0] - 2026-02-06

### Added

#### Cook Command Variants (Phase 1)
- **4 new cook command variants** with routing and auto-selection:
  - `/cook` - Standard implementation with context analysis
  - `/cook:auto` - Auto-select best approach (AI-driven)
  - `/cook:auto:fast` - Fast implementation (cache-aware, minimal research)
  - `/cook:auto:parallel` - Parallel multi-module implementation
- Router analyzes task scope, dependencies, and parallelization potential
- Delegation to implementers with context and constraints

#### New Agents (Phase 2)
- **4 new agents** expanding from 15 to 19 total agents:
  - `designer` - UI/UX design specialist (component creation, layouts, accessibility)
  - `copywriter` - Content & messaging expert (microcopy, documentation, UX text)
  - `journal-writer` - Session notes and learnings capture
  - `mcp-manager` - MCP (Model Context Protocol) integration and management
- All agents follow epost naming conventions and YAML frontmatter structure
- Integrated with existing orchestrator delegation model

#### Android Skill Completion (Phase 3)
- **14 new Android development files**:
  - 5 compose UI templates (button, card, form, list, input)
  - 4 design patterns (MVVM, dependency injection, state management, error handling)
  - 5 test examples (unit, integration, UI, snapshot, espresso)
- Jetpack Compose patterns and best practices
- Full test coverage examples for Android development

#### Skill Discovery System (Phase 4)
- **Automated skill indexing and discovery**:
  - `skill-index.json` generation with metadata (name, description, platform, category)
  - Skill activation hooks for automatic loading
  - Metadata-driven skill selection and recommendations
- CLI discovery system with `/find-skills` command
- Performance optimized for quick skill lookup

#### Quality Gates & Security (Phase 5)
- **Enhanced quality enforcement**:
  - Coverage threshold enforcement (minimum 80% coverage)
  - Security scanning integration (secrets detection, vulnerability checks)
  - Code review cycle tracking and enforcement
  - Pre-commit validation scripts
- **3 new quality scripts**:
  - `check-coverage.cjs` - Verify test coverage meets thresholds
  - `scan-secrets.cjs` - Detect hardcoded credentials and sensitive data
  - `generate-skill-index.cjs` - Build metadata index for skills
- Integration with CI/CD pipeline
- Failure reports with remediation steps

#### Advanced Features (Phase 6)
- **Output style profiles** - 5 templates for different output formats:
  - `minimal` - Concise, essential info only
  - `detailed` - Comprehensive with examples
  - `technical` - Code-heavy, architecture focused
  - `narrative` - Story-style, context-rich
  - `structured` - JSON/YAML formatted output
- **Agent execution profiler** - Performance metrics (time, tokens, decision chains)
- **Error recovery skill** - Automated recovery strategies for common failures
- **Interactive confirmations** - User approval prompts for critical operations

### Documentation Updates
- System architecture: Added 4 new agents and skill discovery subsystem
- Code standards: Added quality gates section and enforcement patterns
- CLI reference: Updated with 4 cook variants and quality gate commands
- Project roadmap: Updated Phase 1-6 completion and metrics

### Test Coverage
- 106 tests passing (100% pass rate)
- All quality gates validated
- Cross-platform compatibility verified
- Performance profiling benchmarks established

---

## [Unreleased]

### Added

#### Splash Pattern Architecture (2026-02-06)
- **Phase 3: Parallel Planning Variant** (Complete)
  - File ownership matrix prevents concurrent write conflicts
  - Dependency graph validation (DAG support, cycle detection)
  - Conflict resolution strategy (earliest phase wins)
  - Parallelization info per phase (exclusive files, blocking/blocked phases)
  - Execution batches enable safe parallel agent execution
  - Constraint validation (≤7 phases, machine-parseable output)
  - New command: `/plan:parallel` with dependency tracking

- **Phase 4: Session State Management & Hook Integration** (Complete)
  - State management scripts for plan persistence
    - `set-active-plan.cjs` (95 LOC) - Set active plan in session
    - `get-active-plan.cjs` (44 LOC) - Read active plan from session
  - Hook integration in `context-builder.cjs`
    - Automatic plan status detection
    - Context injection for plan metadata
    - Session state awareness in hook processing
  - YAML frontmatter schema for plan metadata
    - Title, description, status, priority, effort
    - Branch tracking, tags, created/updated timestamps
  - 12-section phase structure template for plans
    - Context links, overview, key insights, requirements
    - Architecture, related code files, implementation steps
    - Todo list, success criteria, risk assessment
    - Security considerations, next steps
  - Session persistence via `/tmp/ck-session-{sessionId}.json`

#### Test Coverage
- 24 comprehensive state management tests
  - Basic functionality: Set plan, session state creation
  - Error handling: Missing args, invalid paths, missing session ID
  - Path resolution: Relative paths, absolute paths, trailing slashes
  - Session management: CK_SESSION_ID warning, state preservation
  - Get script: Correct plan return, "none" default, corruption recovery
  - Integration: Round-trip set/get, multiple updates, JSON validity
  - Edge cases: Paths with spaces, long paths, Unicode characters
- 100% test pass rate (24/24 passing, 1.26s execution)

#### Documentation
- Migration guide: `docs/migration-splash-pattern.md`
- CLI reference updates: `/plan:fast`, `/plan:hard`, `/plan:parallel` documentation
- System architecture updates: Splash pattern router section
- CLAUDE.md updates: Splash pattern features documented

### Changed

- Project roadmap updated with splash pattern milestones
- Plan.md YAML frontmatter now includes created/updated timestamps
- Hook integration enhanced to support plan context injection
- Planning skill expanded with 12-section phase template

### Known Issues

- **Security**: Session state files store absolute paths (risk of directory structure exposure)
  - Mitigation: Document security considerations, plan path sanitization for v0.2

- **Hook String Matching**: Plan status detection via `includes('Plan: none')` (brittle)
  - Mitigation: Should use structured plan status enum in future

- **Race Conditions**: Concurrent state file access without locking
  - Mitigation: Atomic writes needed for production use with concurrent agents

- **CLI Build**: 6 TypeScript errors in epost-agent-cli (non-critical to framework)
  - Errors: Missing exports, type mismatches in init.ts, new.ts, smart-merge.ts
  - Impact: Blocks CLI deployment but not splash pattern framework

---

## [0.1.0-alpha] - 2026-02-06

### Project Structure

- Unified architecture implementation plan created
  - 10 phases (0-9) covering agent restructuring through E2E verification
  - 32 hours estimated effort
  - Parent-child delegation model (global orchestrate, platform execute)

- epost-kit CLI parallel track started
  - Phase 01: Project Setup Complete (4h effort)
  - 14 files created (9 source + 5 documentation)
  - Full TypeScript/Vitest/ESLint setup
  - Build: Compiles successfully
  - Tests: 1/1 passing
  - Review score: 9.5/10

- Documentation foundation
  - System architecture documented
  - Code standards defined
  - CLI reference complete (30+ commands)
  - Project roadmap with 9-phase structure
  - Glossary for terminology reference

### Roadmap Status

**epost_agent_kit Main Track**:
- Phase 00-02: Foundation (audit, rules, global agents) - Pending
- Phase 03-04: Splash Pattern Architecture - **COMPLETE** (2026-02-06)
- Phase 05-06: Platform Agents (iOS, Android) - Pending
- Phase 07-09: CLI & Distribution - Pending

**epost-kit CLI Track**:
- Phase 01: Project Setup - **COMPLETE** (2026-02-06)
- Phases 02-09: Core implementation - Pending

**Overall Progress**: 20% epost_agent_kit (splash pattern foundation), 11% CLI (setup)

---

## Versioning Strategy

- **v1.1.0**: Enhancement phase (Phase 1-6 complete) - Cook variants, 4 new agents, Android completion, skill discovery, quality gates, advanced features (2026-02-06)
- **v1.0.0**: Stable release with splash pattern + session state management (target: 2026-02-20)
- **v1.2.0**: Extended platform support and ecosystem growth (Q1-Q2 2026)
- **v2.0.0**: Major refactor with marketplace integration (H2 2026)

---

## Future Roadmap (v0.2+)

### Planned Features

- **Phase 10**: Performance optimization and advanced CLI features
- **Phase 11**: Ecosystem growth (skill marketplace, agent templates)
- **Phase 12**: Maturity (v1.0 release, enterprise features)

### Under Consideration

- Third-party skill marketplace integration
- Agent template generator
- IDE extension support (VS Code, JetBrains)
- CI/CD pipeline integration
- Paid tiers / support options

---

## Success Metrics (Launch)

- [ ] All phases 0-9 complete
- [ ] Zero blocking bugs
- [ ] Cross-platform tests pass (Claude Code, Cursor, Copilot)
- [ ] Documentation complete and reviewed
- [ ] Performance targets met (install < 30s)
- [ ] Security review passed

---

**Maintained by**: Phuong Doan
**Last Updated**: 2026-02-06
**Repository**: git@github.com:Klara-copilot/epost_agent_kit.git
