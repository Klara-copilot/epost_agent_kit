# ClaudeKit Adoption Phase 1 — Orchestration + Diff-Aware Tester + Usage Hook

**Date**: 2026-03-29
**Agent**: epost-fullstack-developer
**Epic**: kit
**Plan**: plans/260329-1414-claudekit-adoption/

## What was implemented / fixed

Added three high-ROI patterns from claudekit v2.14 into the epost core:

1. **Subagent Status Protocol** — formalized DONE/DONE_WITH_CONCERNS/BLOCKED/NEEDS_CONTEXT lifecycle with controller handling rules in `orchestration.md`
2. **Context Isolation Principle** — prompt template + anti-pattern table ("Continue from where we left off" → specific file+line instructions)
3. **Diff-aware tester** — `epost-tester` now maps changed files to tests via 5 strategies (co-located, mirror dir, import graph, config change, high fan-out); auto-escalates to full suite when needed
4. **usage-context-awareness hook** — OAuth usage cache hook wired to PostToolUse `*`, throttled at 5 min per tool event

## Key decisions and why

- **Decision**: Hook wired to PostToolUse `*` matcher (not narrowed to specific tools)
  **Why**: The hook is self-throttling (5 min TTL on cache); a broad matcher ensures context is always fresh. Narrowing would mean gaps when doing rapid read/grep cycles.

- **Decision**: Rewrote CK hook without ck-config-utils / hook-logger dependencies
  **Why**: epost has a different lib structure (`epost-config-utils.cjs`, no `hook-logger.cjs`). The CK deps do logging/config checks that aren't critical for the core cache-write behavior. KISS applied.

- **Decision**: Diff-aware as default, not opt-in
  **Why**: Default-fast is better UX; `--full` override covers the escape hatch. Plan spec specified this explicitly.

## What almost went wrong

- `ck-config-utils.cjs` and `hook-logger.cjs` imports in the source hook would have caused immediate runtime failure. The phase spec noted "adapt from CK source" but didn't flag the dep difference explicitly. [skill-discovery did not cover: hook dependency mapping between source and target kit]
