---
title: "Remove Perplexity, perfect Gemini CLI integration"
status: done
created: 2026-03-08
updated: 2026-03-08
effort: 3h
phases: 3
platforms: [all]
breaking: false
---

# Remove Perplexity — Perfect Gemini CLI Integration

## Problem

The research engine layer added Perplexity as a first-class option alongside Gemini. Based on a deep scan of claudekit (the reference implementation), Perplexity was never part of that design. claudekit uses Gemini CLI as the primary external research engine, with WebSearch as fallback. The Perplexity integration in this kit:

- Adds a dependency on a paid API key that most users won't have
- Pollutes the config schema with a parallel `perplexity` key
- Creates dead-weight in `epost-config-utils.cjs`, `session-init.cjs`, `engines.md`, `SKILL.md`
- Introduces a helper script (`perplexity-search.cjs`) that is not pattern-matched by claudekit

The Gemini integration, while partially correct, is **incomplete vs claudekit's approach**:
- Missing `.gemini/settings.json` → `.claude/.mcp.json` symlink setup (enables MCP tools in Gemini)
- `GEMINI.md` system prompt needs to reflect epost_agent_kit project context more precisely
- `engines.md` lacks the symlink setup step and the critical `echo | gemini` vs `-p` flag distinction
- No `GEMINI_API_KEY` guidance for users

## Solution

1. **Purge Perplexity** from all layers: config schema, defaults, env export, research SKILL, engines ref, CLI command
2. **Perfect Gemini** following claudekit's exact patterns:
   - Document symlink setup (`.gemini/settings.json` → `.claude/.mcp.json`) in `engines.md`
   - Add `GEMINI_API_KEY` setup step to `GEMINI.md` and `engines.md`
   - Clarify stdin-piping vs `-p` flag (critical: `-p` skips MCP init)
   - Sharpen `GEMINI.md` system prompt for epost_agent_kit context
3. **Simplify config** — `skills.research` keeps only `engine` + `gemini.model`; perplexity block removed

## Files to Change

### Phase 1 — Remove Perplexity
| File | Change |
|------|--------|
| `packages/core/hooks/lib/perplexity-search.cjs` | **Delete** |
| `packages/core/hooks/lib/epost-config-utils.cjs` | Remove `perplexity` from `DEFAULT_CONFIG`, remove `perplexityModel` from `getResearchConfig()` |
| `packages/core/hooks/lib/__tests__/epost-config-utils.test.cjs` | Remove perplexity test cases |
| `packages/core/hooks/session-init.cjs` | Remove `EPOST_PERPLEXITY_MODEL` export, perplexity branch in console.log |
| `packages/core/.epost-kit.json` | Remove `perplexity` key from `skills.research` |
| `packages/core/skills/research/references/engines.md` | Remove Perplexity engine section |
| `packages/core/skills/research/SKILL.md` | Remove perplexity invocation block + Sub-Skill Routing row |

### Phase 2 — Perfect Gemini (assets + reference docs)
| File | Change |
|------|--------|
| `packages/core/assets/GEMINI.md` | Improve system prompt: add MCP proxy mode instructions, `GEMINI_API_KEY` setup note, sharpen research assistant persona |
| `packages/core/skills/research/references/engines.md` | Add symlink setup step, stdin vs `-p` warning, `GEMINI_API_KEY` note, `gemini auth` note |

### Phase 3 — CLI cleanup
| File | Change |
|------|--------|
| `packages/core/hooks/lib/__tests__/epost-config-utils.test.cjs` (already in Phase 1) | Ensure `getResearchConfig` tests reflect 2-option engine (gemini/websearch) |

> Note: `.claude/` is generated — edit only under `packages/`. Run `epost-kit init` after changes to regenerate.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Remove Perplexity | 1.5h | done | [phase-1](./phase-1-remove-perplexity.md) |
| 2 | Perfect Gemini integration | 1h | done | [phase-2](./phase-2-perfect-gemini.md) |
| 3 | CLI config cleanup | 0.5h | done | [phase-3](./phase-3-cli-cleanup.md) |

## Success Criteria

- `perplexity-search.cjs` deleted; no Perplexity references remain in `packages/core/`
- `getResearchConfig()` returns `{ engine, geminiModel }` only (no `perplexityModel`)
- `session-init.cjs` exports only `EPOST_RESEARCH_ENGINE` and `EPOST_GEMINI_MODEL`
- `skills.research.engine` accepts only `"gemini"` | `"websearch"` (perplexity removed)
- `GEMINI.md` has correct MCP proxy mode instructions + `GEMINI_API_KEY` setup note
- `engines.md` documents symlink setup + stdin-piping pattern from claudekit
- All existing tests pass; perplexity test cases removed
- `.claude/` regenerated via `epost-kit init` to reflect changes

## Reference: claudekit Gemini Patterns

Key findings from `/Users/than/Projects/claudekit`:

1. **System prompt** (`GEMINI.md` at project root): Instructs Gemini to act as MCP proxy, return JSON-only for MCP calls, plain Markdown for research. Auto-loaded by gemini CLI.
2. **Stdin piping** (CRITICAL): `echo "prompt" | gemini -y -m <model>` — NOT `gemini -p "prompt"` (the `-p` flag skips MCP server init, tools unavailable)
3. **MCP setup**: `.gemini/settings.json` symlinks to `.claude/.mcp.json` so Gemini CLI sees the same MCP servers as Claude
4. **Config key**: `gemini.model` in `.ck.json` (maps to `skills.research.gemini.model` in `.epost-kit.json`)
5. **Toggle**: `skills.research.useGemini: true/false` (claudekit) → epost uses `skills.research.engine: "gemini"` (equivalent)
6. **Availability check**: `which gemini` before use; fallback to WebSearch if not found
