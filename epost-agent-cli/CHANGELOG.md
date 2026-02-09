# Changelog: epost-kit CLI

All notable changes to the `epost-kit` CLI tool will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Central UI utility module (`ui.ts`) with 17+ display primitives (boxes, tables, trees, badges, progress steps)
- Branded ASCII "e" logo and version display (`branding.ts`)
- `onboard` command: branded welcome screen, step progress (1-5), package detail table, "What's Next?" guide
- `init` command: 7-step progress indicators, package resolution tables, rich dry-run preview, per-package install details, success summary box
- `doctor` command: styled [PASS]/[WARN]/[FAIL] health check output with summary box
- `profile list`: tabular profile display with teams and package counts
- `profile show`: key-value metadata display
- `package list`: layer-grouped package listing with installed markers
- `cli-table3` dependency for table rendering (zero-dep, 15KB)
- 34 unit tests for UI module (`ui.test.ts`)
- Runtime skill-index.json generation during `epost-kit init` (replaces static copy)
- Plan tracking system: `plans/INDEX.md`, `plans/index.json`, lifecycle directories
- `PLAN_FORMAT.md` standardized plan template
- `PLAN_TRACKING_FLOW.md` visual flow diagrams for plan lifecycle
- `cli-development` skill (`.claude/skills/cli/SKILL.md`) with full CLI tech stack and architecture reference
- `epost-cli-developer` agent — dedicated CLI platform specialist (implementation + testing)
- CLI platform detection in `epost-implementer` agent with delegation to `epost-cli-developer`
- CLI routing in `epost-orchestrator` agent for kit development tasks
- `/cli:cook` command — implement CLI features via epost-cli-developer
- `/cli:test` command — run CLI tests via epost-cli-developer
- `/cli:doctor` command — debug CLI issues via epost-cli-developer
- CLI Platform section in `CLAUDE.md` with tech stack, commands, agent, and skill references

### Fixed
- File attribution tracking now prevents prior-package overwrite during directory copy
- Accurate agent/command/skill counts via post-install recount from installed files

## [0.1.0] - 2026-02-08

Initial release.

### Added

- `epost-kit init` — Install agent kit with profile selection, dependency resolution, and file-level tracking
- `epost-kit doctor` — Validate installation integrity, check for missing files and broken references
- `epost-kit update` — Self-update CLI from npm registry with changelog preview
- `epost-kit uninstall` — Remove installed kit files with metadata cleanup
- `epost-kit versions` — List available kit versions from GitHub releases
- `epost-kit new` — Scaffold new agents, skills, and commands from templates
- Package-based architecture with 12 packages across 4 layers
- Profile system with 14 profiles and team-based auto-detection
- File-level metadata tracking (`.epost-metadata.json`) with SHA-256 checksums
- Smart merge/conflict resolution for updates (detect user modifications)
- Skill index auto-generation from installed SKILL.md files
- CLAUDE.md assembly from package CLAUDE.snippet.md files
- Settings.json merge strategies (base, merge, skip)

[Unreleased]: https://github.com/Klara-copilot/epost_agent_kit/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Klara-copilot/epost_agent_kit/releases/tag/v0.1.0
