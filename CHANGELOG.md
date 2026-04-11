# Changelog

All notable changes to the epost_agent_kit ecosystem will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### iOS Platform (`platform-ios`)

- **MCP servers**: Added XcodeBuildMCP (local) and sosumi (remote Apple docs → Markdown) via `settings.json` — auto-configured on `epost-kit init`
- **New skill**: `ios-testing` — XCTest, XCUITest, Swift Testing (@Test/#expect), snapshot testing, flakiness fixes
- **Code review rules expanded**: Added MEMORY-001..004 (retain cycles, NSTimer, Combine, addChild) and CONCURRENCY-001..004 (Swift 6 actor isolation, @unchecked Sendable, Task capture, async let scope)
- **RealmSwift rules**: 3 → 6 rules — added REALM-004 (encryption key from Keychain), REALM-005 (schema migration block), REALM-006 (notification token as instance property)
- **Alamofire rules**: 3 → 6 rules — added ALAMOFIRE-004 (SSL pinning via ServerTrustManager), ALAMOFIRE-005 (auth token via RequestInterceptor), ALAMOFIRE-006 (multipart uploads)
- **Build optimization**: AvdLee-inspired 4-step workflow (benchmark → hotspots → settings audit → verify) in `build.md`
- **Skill token efficiency**: `build.md` 559 → 150 lines, `development.md` 432 → 137 lines, `tester.md` 445 → 95 lines (73% combined reduction)

### Android Platform (`platform-android`)

- **MCP servers**: Added replicant-mcp (build/test/emulator control) and Google Developer Knowledge MCP (placeholder API key) via `settings.json`
- **New skill**: `android-testing` — Compose UI Testing, Hilt @TestInstallIn, Turbine Flow testing, MockK, Room in-memory
- **Code review rules expanded**: Added MEMORY-001..004 (Context leaks, BroadcastReceiver symmetry, View listener cleanup, Handler/Runnable) and LOGGING-001 (Timber required — Log.*/println() forbidden, CONV-0002)
- **Flow rules**: 4 → 5 rules — added FLOW-005 (stateIn with WhileSubscribed(5000) pattern)
- **Bug fix**: `error-handling.md` logging strategy replaced `Log.*` calls with Timber (was inconsistent with LOGGING-001/CONV-0002)
- **Skill optimization**: `compose-best-practices.md` 444 → 375 lines (removed generic Material 3/Dynamic Colors sections)

### Core

- **Code review schema**: Added MEMORY, CONCURRENCY, LOGGING category enums to `code-known-findings-schema.md`; updated REALM (001..006), ALAMOFIRE (001..006), FLOW (001..005) rule ranges
- **Audit skill**: Added iOS/Android build verification references (Step 6.5 in hybrid orchestration + single-agent delegation) — MCP-first with shell fallback
- **Build verification**: New `ios-build-verification.md` (XcodeBuildMCP → build-gate.cjs fallback) and `android-build-verification.md` (replicant-mcp → Gradle fallback)
- **Confidence scoring**: Two-pass LLM rule for findings with severity ≥ 4; confidence matrix (1.0/0.5/0.8/0.95/0.3) across 5 finding sources
- **Branch scan system**: `branch-scan-digest.cjs` — multi-repo support, periodic Slack digests, per-repo channel routing
- **media-ai skill**: Adopted from ai-multimodal — Gemini 2.5/2.0 multimodal processing, 5 reference guides, Python scripts

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
