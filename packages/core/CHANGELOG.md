# Changelog: core

All notable changes to the `core` package will be documented in this file.

## [Unreleased]

### Added
- Added `knowledge-base` skill — ADR/pattern/finding persistence
- Added `knowledge-retrieval` skill — Internal-first knowledge search
- Added `knowledge-capture` skill — Post-task learning capture
- Added knowledge-first patterns and Related Skills cross-references to 9 skills (code-review, debugging, planning, research, docs-seeker, error-recovery, problem-solving, repomix, sequential-thinking)
- Added Plan Storage & Index Protocol to `planning` skill
- Added plan index reporting instructions to 9 agents (architect, implementer, orchestrator, debugger, tester, reviewer, researcher, documenter, brainstormer)
- Added Plan Index Maintenance section to `epost-orchestrator` (new section 7)
- Added `memory: project` to architect, orchestrator, implementer, debugger, tester, reviewer, documenter agents
- Added `knowledge-retrieval` skill binding to architect, orchestrator, reviewer
- Added `knowledge-base` skill binding to debugger, documenter
- Added `code-review`, `debugging`, `error-recovery`, `knowledge-retrieval` skill bindings to implementer
- Added `docs-seeker` skill binding to researcher, documenter
- Added `error-recovery` skill binding to tester
- Added `planning` skill binding to orchestrator

### Changed
- Moved `epost-brainstormer` from meta-kit-design to core package
- Moved `epost-journal-writer` from meta-kit-design to core package
- Replaced `databases` skill with `backend-databases` (now in platform-backend)
- Updated skill-index.json: 22 → 25 skills with knowledge entries
- Renumbered orchestrator sections 7→8 (Documentation Coordination) and 8→9 (Documentation Update Triggers)

## [1.0.0] - 2026-02-08

Initial release.

### Agents

- Added `epost-orchestrator` — Top-level task router and project manager
- Added `epost-architect` — Architecture planning and implementation design
- Added `epost-implementer` — Feature implementation from plans and specifications
- Added `epost-reviewer` — Code review for security, quality, and performance
- Added `epost-debugger` — Root cause analysis and issue diagnosis
- Added `epost-tester` — Test suite management and coverage analysis
- Added `epost-researcher` — Multi-source information gathering and validation
- Added `epost-documenter` — Technical documentation management
- Added `epost-git-manager` — Git workflow automation
- Added `epost-brainstormer` — Creative ideation and problem-solving
- Added `epost-journal-writer` — Technical journal documentation

### Skills

- Added `core` — Operational boundaries, safety rules, and documentation standards
- Added `code-review` — Comprehensive code quality assessment
- Added `debugging` — Systematic debugging methodology with root cause analysis
- Added `planning` — Requirements-to-plan transformation with task breakdown
- Added `problem-solving` — Root cause analysis and complex problem resolution
- Added `error-recovery` — Standardized error handling, retries, and fallback strategies
- Added `repomix` — Codebase summary generation for analysis
- Added `docs-seeker` — Documentation discovery via Context7 and web search
- Added `sequential-thinking` — Structured step-by-step analysis
- Added `research` — Multi-source information gathering and validation
- Added `knowledge-base` — Project knowledge management (ADRs, patterns, findings)
- Added `knowledge-retrieval` — Internal-first knowledge search before external sources
- Added `knowledge-capture` — Post-task knowledge capture workflow

### Commands

- Added `/core:cook` — Implement features from plans or descriptions
- Added `/core:cook:auto` — Trust-based fast track implementation
- Added `/core:cook:auto:fast` — No-research fast implementation
- Added `/core:cook:auto:parallel` — Parallel phase execution with implementer agents
- Added `/core:plan` — Intelligent plan creation with prompt enhancement
- Added `/core:review` — Code review for quality, security, and performance
- Added `/core:test` — Run test suite and analyze coverage
- Added `/core:debug` — Investigate and diagnose issues
- Added `/core:scout` — Search codebase for files related to a topic
- Added `/core:ask` — Ask questions about the codebase
- Added `/core:brainstorm` — Evaluate technical approaches before implementation
- Added `/core:bootstrap` — Initialize a new project from scratch
- Added `/plan:fast` — Quick plan from codebase analysis only
- Added `/plan:deep` — Deep plan with sequential research
- Added `/plan:parallel` — Dependency-aware plan with file ownership matrix
- Added `/fix:deep` — Complex bug fixes requiring investigation
- Added `/fix:fast` — Quick fixes for simple bugs
- Added `/fix:test` — Fix failing tests
- Added `/fix:ci` — Fix CI/CD pipeline failures
- Added `/fix:ui` — Fix UI bugs and visual issues
- Added `/git:commit` — Stage and commit with conventional commits
- Added `/git:push` — Commit changes and push to remote
- Added `/git:pr` — Create GitHub pull request from current branch
- Added `/git:cm` — Alias for /git:commit
- Added `/git:cp` — Alias for /git:push
- Added `/docs:init` — Scan codebase and generate documentation
- Added `/docs:update` — Update existing documentation
