# Changelog

All notable changes to the epost_agent_kit ecosystem will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [2.1.0] - 2026-04-02

### Architecture

- **`packages/core/rules/`** — New always-on rules directory, installed to `.claude/rules/` via `package.yaml`. Follows claudekit pattern: rules load every session for every user without agent skill bindings.
- Migrated all 8 files from `packages/core/skills/core/references/` to permanent homes: 5 behavioral rules → `rules/`, 3 agent-specific refs → owning skills (`code-review/references/`, `docs/references/`)
- Deleted `packages/core/skills/core/references/` directory entirely

### Rules

- `rules/development-rules.md` — Added YAGNI·KISS·DRY as always-on principles; "update existing files, never create enhanced copies"; compile/lint after code changes; Visual Explanations section (maps `/preview` skill); Documentation Lookup section (maps `knowledge`/`research` skills)
- `rules/file-organization.md` — Added Code File Size guideline (200 lines for code files); strengthened slug naming rationale for LLM tool readability
- `rules/orchestration-protocol.md` — Added Agent Dispatch table; Subagent Status Protocol (DONE/DONE_WITH_CONCERNS/BLOCKED/NEEDS_CONTEXT); Context Isolation anti-patterns table
- `rules/development-rules.md` — New file: commit hygiene, code change boundaries, packages-as-source-of-truth, verification discipline

### Output Styles

- Simplified output modes from 3 → 2: dropped `exec` (redundant with CC Default) and `teach` (redundant with CC Explanatory)
- Added `report` mode: structured task completion format (Status / Agent / Summary / Findings / Risks)
- Kept `transparency` mode: full agent trace with routing, skill args, timing, trace ID (no CC equivalent)
- Removed `output-mode` skill entirely — modes are hook-driven only via `session-init.cjs`
- Default mode changed: `exec` → `report`

### claudekit Adoption (Phases 1–12)

- Phase 1: cook `--auto` flag, anti-rationalization rules, Finalize step
- Phase 12: `rules/` architecture migration (see Architecture above)
- Cross-reference sweep: updated stale `core/references/*` paths across 15+ agent and skill files

### Research

- Added configurable search engine support via `$EPOST_RESEARCH_ENGINE`
- Removed Gemini CLI integration from research tooling

### Web i18n

- Added `pull.cjs` and `push.cjs` scripts for sheet sync
- Expanded validate, pull, push references with real-world findings

## [2.0.0] - 2026-03-05

### Knowledge Layer
- Added `knowledge-base`, `knowledge-retrieval`, `knowledge-capture` skills to core package
- Added knowledge-first search patterns to 9 existing skills (code-review, debugging, planning, research, docs-seeker, error-recovery, problem-solving, repomix, sequential-thinking)
- Added `memory: project` to 10 agents for cross-session knowledge persistence

### Plan Tracking
- Added plan lifecycle directories: `active/`, `completed/`, `archived/`
- Added `INDEX.md` and `index.json` plan indexes with 15 tracked plans
- Added `PLAN_FORMAT.md` standardized template and `PLAN_TRACKING_FLOW.md` visual flow
- Added Plan Storage & Index Protocol to `planning` skill
- Added plan index reporting instructions to 9 agents

### Agents
- Moved `epost-brainstormer` and `epost-journal-writer` from meta-kit-design to core
- Added skill bindings across agents (knowledge-retrieval, knowledge-base, code-review, debugging, error-recovery, docs-seeker, planning)
- Added Plan Index Maintenance section to orchestrator (new section 7)

### Skills
- Removed `databases` skill (replaced by `backend/databases` in platform-backend)
- Removed `web/backend-development` skill (replaced by `web/api-routes` in platform-web)
- Added `web/api-routes` skill for Next.js API route patterns
- Updated skill indexes with knowledge skills and package-specific entries
- Major skill consolidation: variants (cook-fast, fix-deep, etc.) merged into parent skills via flags
- Removed epost-agent-cli embedded subdirectory; standalone CLI is now separate repo
- A11y workflow refactor: audit-a11y, fix-a11y, review-a11y merged into parent skills with flags

### CLI
- Added runtime skill-index.json generation during `epost-kit init`
- Fixed file attribution tracking to prevent prior-package overwrite

### Profiles
- Added `rag-web` as optional to web-b2b, web-b2b-fullstack, web-ui-lib profiles
- Added `rag-ios` as optional to ios-b2c, mobile-b2c, ios-ui-lib profiles
- Added `rag-web` and `rag-ios` to full profile

### Changelogs
- Added changelogs for root ecosystem and all 12 packages
- Added CLI changelog

## [1.0.0] - 2026-02-08

Initial release of the epost_agent_kit ecosystem.

### Ecosystem

- 12-package layered architecture (core, 4 platform, 3 domain/arch, 2 RAG, 1 ui-ux, 1 meta)
- 20 agents across all packages
- 30+ skills covering development, testing, debugging, planning, and knowledge management
- 25+ slash commands for common workflows
- 14 developer profiles with team-based auto-detection

### Knowledge Layer

- Added `knowledge-base` skill for ADR/pattern/finding persistence
- Added `knowledge-retrieval` skill for internal-first knowledge search
- Added `knowledge-capture` skill for post-task learning workflows

### RAG Integration

- Added `rag-web` package with vector search for klara-theme and Next.js codebase
- Added `rag-ios` package with vector search across 3 iOS repositories

### CLI

- `epost-kit` CLI v0.1.0 with init, doctor, update, uninstall, versions, new commands
- Package-based installation with profile selection and dependency resolution
- File-level metadata tracking with SHA-256 checksums
- Smart merge/conflict resolution for updates

### Profiles

- Added `web-b2b` — Web B2B frontend developer
- Added `web-b2b-backend` — Web B2B backend developer
- Added `web-b2b-fullstack` — Web B2B fullstack developer
- Added `ios-b2c` — iOS app developer
- Added `android-b2c` — Android app developer
- Added `mobile-b2c` — Cross-platform mobile developer
- Added `mobile-b2c-backend` — Mobile backend developer
- Added `web-ui-lib` — Web UI library developer
- Added `ios-ui-lib` — iOS UI library developer
- Added `android-ui-lib` — Android UI library developer
- Added `cloud-architect` — Cloud infrastructure architect
- Added `kit-designer` — Kit development and design
- Added `full` — Complete kit with all packages

See package-specific CHANGELOGs in `packages/*/CHANGELOG.md` for detailed changes.

[Unreleased]: https://github.com/Klara-copilot/epost_agent_kit/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/Klara-copilot/epost_agent_kit/releases/tag/v2.0.0
[1.0.0]: https://github.com/Klara-copilot/epost_agent_kit/releases/tag/v1.0.0
