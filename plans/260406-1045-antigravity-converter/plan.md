---
title: "Antigravity Converter — GEMINI.md + AGENTS.md Target"
status: active
created: 2026-04-06
updated: 2026-04-06
effort: 7h
phases: 3
platforms: [cli]
breaking: false
blocks: []
blockedBy: []
---

## Scope Rationale

1. **Problem**: epost-kit has no converter for Antigravity (Google's agentic IDE, public preview Nov 2025)
2. **Why this way**: Reuse JetBrains adapter pattern — both are single-file-at-root targets with no agent/skill/hook directories
3. **Why now**: Antigravity is gaining traction; GEMINI.md format is simple and stable enough to support
4. **Simplest value**: Generate `GEMINI.md` (primary) + `AGENTS.md` (cross-tool compat) at project root
5. **Cut 50%**: Drop skill export and `.agent/rules/` generation — Antigravity format is too young, wait for stability

## ⚠️ Research Correction (2026-04-06)

Initial research incorrectly described Antigravity as "single-agent with no agent definitions." **Fact-check verdict: INACCURATE.** Verified against official Google Codelabs + Google Developers Blog:

- **Multi-agent orchestration**: Agent Manager ("Mission Control") spawns multiple agents in parallel
- **Custom agent definitions**: `.antigravity/agents/*.yaml` — YAML format, defines role/model/tools/response format
- **Three agent types**: Simple, Expert, Module
- **Subagent dispatch**: Main agent spawns specialized subagents (browser, domain specialists)
- **Skills invocation**: `skills/*/SKILL.md` ARE invocable via `/` slash commands (comparable to Claude Code)
- **`.agent/rules/`**: Workspace-scoped rules supplements (distinct from agent definitions)

Converter scope is expanded — agent conversion is now viable.

## What Antigravity Supports

| Feature | Antigravity equivalent | Converter action |
|---------|----------------------|-----------------|
| Root instructions | `GEMINI.md` (highest priority) | Generate from package snippets |
| Cross-tool instructions | `AGENTS.md` (second priority) | Generate (same as JetBrains adapter) |
| Platform rules | `.agent/rules/*.md` | Generate from CURSOR.snippet.md per platform |
| Agent definitions | `.antigravity/agents/*.yaml` | Convert from `.claude/agents/*.md` |
| Skills | `skills/*/SKILL.md` (Markdown-only, invocable via `/`) | Convert — strip YAML frontmatter |
| Hooks | None | N/A |
| Commands/Prompts | None | N/A |
| MCP | Native via MCP Store | N/A (config not transferable) |

## Out of Scope (and why)

- **Hook conversion**: No hook system in Antigravity
- **Command/prompt conversion**: No equivalent
- **Model mapping**: Antigravity uses Gemini primary; Claude Sonnet/Opus as secondary — no frontmatter mapping needed (Antigravity selects model via settings, not per-agent frontmatter)
- **`.antigravity/agents/*.yaml` full format**: YAML schema not fully documented yet — use best-effort conversion from known fields (name, description, role, model, tools)

## Transformation Reference

| Claude Code | Antigravity | Notes |
|-------------|-------------|-------|
| `CLAUDE.md` | `GEMINI.md` + `AGENTS.md` | Two files for priority layering |
| `.claude/agents/name.md` | `.antigravity/agents/name.yaml` | YAML format, fields: name/description/role/model/tools |
| `.claude/skills/x/SKILL.md` | `skills/x/SKILL.md` | Strip YAML frontmatter, keep body |
| `.claude/settings.json` hooks | N/A | No equivalent |
| `.claude/commands/*.md` | N/A | No equivalent |
| `model: sonnet` | `model: claude-sonnet-4-6` | Full model ID in YAML |
| `permissionMode: plan` | `readonly: true` in YAML | Restrict write tools |
| `disallowedTools: Write` | Omit write tools from `tools:` | |
| CURSOR.snippet.md content | `.agent/rules/{platform}.md` | Platform-scoped rules |

## Phases

| # | Phase | Effort | Depends | Files |
|---|-------|--------|---------|-------|
| 1 | [AntigravityAdapter + GEMINI.md + AGENTS.md](phase-01-antigravity-adapter.md) | 3h | — | antigravity-adapter.ts, target-adapter.ts, init.ts |
| 2 | [Agent + Skill Conversion](phase-02-agent-skill-conversion.md) | 3h | 1 | antigravity-adapter.ts |
| 3 | [Verification](phase-03-verification.md) | 1h | 1,2 | tests, manual smoke test |

## Success Criteria

1. `epost-kit init --target antigravity` produces `GEMINI.md` + `AGENTS.md` at project root
2. `epost-kit init --target antigravity` produces `.antigravity/agents/*.yaml` for each epost agent
3. `epost-kit init --target antigravity` produces `skills/*/SKILL.md` with YAML stripped
4. `epost-kit init --target antigravity` produces `.agent/rules/{platform}.md` from platform snippets
5. No `.claude/` path references in any output file
6. All existing tests pass (301+)
