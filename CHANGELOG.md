# Changelog

All notable changes to the epost_agent_kit ecosystem will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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

[Unreleased]: https://github.com/Klara-copilot/epost_agent_kit/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Klara-copilot/epost_agent_kit/releases/tag/v1.0.0
