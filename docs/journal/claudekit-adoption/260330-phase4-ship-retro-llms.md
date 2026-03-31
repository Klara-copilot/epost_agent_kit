# Phase 4: Ship Pipeline + Sprint Retro + LLMs.txt

**Date**: 2026-03-30
**Agent**: epost-fullstack-developer
**Epic**: claudekit-adoption
**Plan**: plans/260329-1414-claudekit-adoption/

## What was implemented

Extended the `git` skill with a `--ship` flag defining a 9-step release pipeline. Created two new skills: `retro` (sprint metrics from git only) and `llms` (llmstxt.org spec generator). Registered both in package.yaml, updated the skill index generator, and regenerated skill-index.json (31 skills).

## Key decisions and why

- **Decision**: `--ship` as a flag on the existing `git` skill, not a standalone skill
  **Why**: The ship pipeline orchestrates native agents (tester, reviewer, docs-manager) + git operations. The user's mental model is "git: ship this", not a distinct domain. Avoids proliferating skills for what is essentially a git workflow extension.

- **Decision**: `retro` Iron Law — every metric must come from a git command, never estimated
  **Why**: Hallucinated sprint metrics would mislead retrospectives. Explicit `N/A` is always safer than a wrong number.

- **Decision**: `llms` uses docs/index.json KB as the source rather than scanning raw files
  **Why**: The KB is already curated and tagged; scraping raw files would produce noisy output. The Iron Law (verify file exists before including) ensures freshness.

## What almost went wrong

Nothing material. The `.claude/` sync (copy from packages/) is manual — no build tool enforces it post-edit. If someone edits `packages/core/skills/git/SKILL.md` but forgets to copy to `.claude/skills/git/SKILL.md`, the live system lags until next `epost-kit init`. [kit skill should document this risk more prominently under `references/cli.md` → "After editing skills" section.]
