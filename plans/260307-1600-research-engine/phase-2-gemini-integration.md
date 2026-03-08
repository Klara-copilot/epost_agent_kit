# Phase 2 — GEMINI.md Asset + Gemini Invocation Pattern

## Goal

Create `GEMINI.md` (Gemini CLI system prompt for MCP proxy mode) as a managed asset, and document the exact Gemini invocation pattern in the research skill reference.

## Background (from claudekit research)

- Gemini CLI reads `GEMINI.md` from the project root as its system prompt
- Invocation: `echo "prompt" | gemini -y -m <model>` (stdin pipe — the `-p` flag skips MCP init)
- Output must be JSON-only when used as MCP proxy; plain text for direct research queries
- The `-y` flag auto-confirms prompts without interactive pause

## Tasks

### 2.1 Create `packages/core/assets/GEMINI.md`

This file is the system prompt Gemini CLI loads when invoked from this project.

```markdown
# Gemini Research Assistant

You are a research assistant for the epost_agent_kit project.

## Output Rules

- Return concise, factual answers
- For research queries: plain Markdown (no JSON wrapper)
- Cite sources with URLs where available
- If asked to act as MCP proxy: return JSON-only, no prose

## Constraints

- Do not hallucinate URLs or library versions
- Note when information may be outdated (cutoff: check your training date)
- Prefer official documentation over blog posts
- Flag uncertainties explicitly
```

### 2.2 Wire GEMINI.md into `epost-kit init`

File: `packages/kit/src/domains/init/` (or equivalent init domain)

When `epost-kit init` runs:
- Check if `GEMINI.md` exists at project root
- If absent: copy `packages/core/assets/GEMINI.md` → `{projectRoot}/GEMINI.md`
- If present: do not overwrite (user may have customized it)
- Log: `[epost-kit] GEMINI.md → created at project root`

> **Note**: The init wiring is best-effort. If the CLI path is complex, document this as a manual step in the migration guide instead, and defer CLI wiring to a follow-up.

### 2.3 Create `packages/core/skills/research/references/engines.md`

This reference file documents the invocation pattern, limits, and fallback behaviour for each engine.

```markdown
# Research Engine Reference

## Engine: gemini

Invocation:
```bash
echo "$RESEARCH_PROMPT" | gemini -y -m "$EPOST_GEMINI_MODEL"
```

- Requires: `gemini` CLI installed and authenticated (`gemini auth login`)
- System prompt: loaded from `GEMINI.md` at project root
- Output: plain Markdown (for research), JSON (for MCP proxy mode)
- Fallback trigger: `gemini` binary not found in PATH → log coverage gap → use WebSearch

## Engine: perplexity

See phase-3 for REST call details.

- Requires: `PERPLEXITY_API_KEY` env var
- Fallback trigger: API key absent → log coverage gap → use WebSearch

## Engine: websearch

Built-in Claude `WebSearch` tool. Always available.
No configuration required.

## Fallback Chain

```
configured engine → (if unavailable) → websearch
```

Log unavailability in the Methodology coverage gaps section.
```

## Acceptance

- [ ] `packages/core/assets/GEMINI.md` created
- [ ] `epost-kit init` copies GEMINI.md if absent (or manual step documented)
- [ ] `packages/core/skills/research/references/engines.md` created with all three engines documented
