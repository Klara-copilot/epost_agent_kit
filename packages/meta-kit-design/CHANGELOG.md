# Changelog: meta-kit-design

All notable changes to the `meta-kit-design` package will be documented in this file.

## [Unreleased]

### Added
- Command Development skill from anthropics/claude-code (834 lines + 7 references + 2 examples)
- Interactive command generator: `/meta:generate-command`
- Splash command generator: `/generate-command:splash` (creates router + variants)
- Simple command generator: `/generate-command:simple` (creates standalone command)

### Changed
- Moved `epost-brainstormer` agent to core package
- Moved `epost-journal-writer` agent to core package
- Updated package description to reflect agent removals

## [1.0.0] - 2026-02-08

Initial release.

### Agents

- Added `epost-scout` — Multi-platform codebase exploration and file discovery
- Added `epost-mcp-manager` — MCP server integration management

### Skills

- Added `agents/claude/agent-development` — Agent creation and maintenance patterns
- Added `agents/claude/skill-development` — Skill authoring and frontmatter conventions
- Added `agents/mental-model` — Mental model development patterns
