# Adopt ai-multimodal Skill into packages/core

**Date**: 2026-04-09
**Agent**: epost-fullstack-developer
**Epic**: ai-multimodal-adoption
**Plan**: plans/260409-1755-ai-multimodal-adoption/

## What was implemented / fixed

Adopted the external `ai-multimodal` skill (Google Gemini multimodal processing) from `/Users/than/Downloads/ai-multimodal/` into `packages/core/skills/ai-multimodal/`. The skill provides audio transcription, image understanding, video analysis, document extraction (PDF), and image generation via the Gemini API.

4 phases executed:
1. Sanitized frontmatter (removed `allowed-tools`, `license`; added `user-invocable`, `context`), rewrote env lookup chain, removed all `.factory` path references from 3 Python scripts, created `document-extraction.md` stub.
2. Installed into `packages/core/skills/ai-multimodal/` and registered in `package.yaml`.
3. Appended Installation section to SKILL.md with venv-explicit pip/python commands. Syntax-verified all 3 scripts (no errors). Pip install pending user approval.
4. Regenerated skill-index.json (80 skills), verify.cjs passes (5 checks, 0 errors, 3 warnings — all pre-existing or acceptable). Activated plan, updated plans/index.json (PLAN-0105).

## Key decisions and why

- **Decision**: Remove Vietnamese fragment from description
  **Why**: epost skill descriptions are English-only. The fragment (`Sử dụng khi: AI, LLM...`) was a duplicate triggering hint; the English description already covers those cases.

- **Decision**: Walk-up search for project root `.env` instead of hardcoded path depth
  **Why**: The original `.factory` chain was framework-specific. A walk-up search (up to 6 levels) is portable regardless of where scripts are invoked from — matches how Node-based tools find project roots.

- **Decision**: Manually copy to `.claude/skills/` rather than waiting for `epost-kit init`
  **Why**: `generate-skill-index.cjs` only scans `.claude/skills/`. Without the copy, the skill would exist in `packages/` but not be accessible to agents until the next init. Manual copy mimics exactly what init does and will be safely overwritten on next init.

## What almost went wrong

- `generate-skill-index.cjs` scans `.claude/skills/`, not `packages/` — the plan's Phase 4 success criterion ("skill-index.json contains ai-multimodal") would fail silently if you only install to `packages/`. The cook skill should document this gap: after installing a new skill into `packages/`, always sync to `.claude/` before regenerating the index. [kit-add-skill should handle this]
- Smoke test blocked by missing pip deps — surfaced to user rather than auto-installing per Requires Approval rules.
