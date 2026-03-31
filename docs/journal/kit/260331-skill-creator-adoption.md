# Install Anthropic skill-creator skill

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: kit
**Plan**: plans/260331-0924-skill-creator-adoption/

## What was implemented

Fetched and installed Anthropic's official `skill-creator` skill from anthropics/skills@98669c1 into epost_agent_kit. Mirrors the full directory structure (18 files: SKILL.md, 3 agent prompts, 9 Python scripts, 2 HTML viewers, 1 reference schema, LICENSE). Wired into skill-index as category=quality with enhances=[cook, plan]. Added routing hints to CLAUDE.md and CLAUDE.snippet.md.

## Key decisions and why

- **Decision**: Install under `packages/core/skills/` (source of truth) and mirror to `.claude/skills/`
  **Why**: Project rule — `.claude/` is generated output, always edit under packages/

- **Decision**: category=quality, not a new 'kit' category
  **Why**: skill-creator is a discipline/process skill like tdd and clean-code, not kit authoring tooling

- **Decision**: Zero content modifications — exact as-is from Anthropic
  **Why**: Task requirement; also avoids divergence from upstream

## What almost went wrong

- raw.githubusercontent.com returned 503 — `gh api` with base64 decode was the reliable path. `skill-discovery` has no pattern for GitHub raw-fetch failures.
