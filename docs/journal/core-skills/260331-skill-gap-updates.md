# Skill Gap Updates: watzup, mermaid flags, deploy

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: core-skills
**Plan**: plans/260331-1657-skill-gap-updates/

## What was implemented / fixed

Three skill additions to fill gaps identified in the skill gap analysis:

1. `/git --watzup` — EOD/handoff summary flag. Runs git log + diff + status, outputs structured session wrap-up with what changed, impact scope, and next steps.
2. `/mermaidjs --explain|--ascii|--html` — extended the mermaid skill with three visual modes: combined ASCII+Mermaid+prose explanation, terminal ASCII only, and self-contained HTML file.
3. `/deploy` — new skill for project deployment with platform auto-detection (Vercel, Netlify, Cloudflare, Railway, Fly.io, Docker). Always confirms before executing. 6 platform reference files.

## Key decisions and why

- **Decision**: Added `--watzup` to git skill rather than creating a standalone skill
  **Why**: `--watzup` is a git-state operation; piggybacking on existing git dispatch is lower overhead and keeps related context together.

- **Decision**: Kept mermaid flags in the parent SKILL.md dispatch block, references in sub-files
  **Why**: Follows established pattern (cook, git, fix all use this layout). Keeps main SKILL.md scannable.

- **Decision**: `deploy` always requires explicit user confirmation before executing
  **Why**: Deployment is irreversible; auto-execute would violate the core safety rule for production actions.

## What almost went wrong

Nothing notable — all three were clean additive changes with no conflicts.
