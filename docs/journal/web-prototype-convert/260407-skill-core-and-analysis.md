# Web Prototype Convert — Skill Core and Analysis Checklist

**Date**: 2026-04-07
**Agent**: epost-fullstack-developer
**Epic**: web-prototype-convert
**Plan**: plans/260407-1240-web-prototype-convert-redesign/

## What was implemented

Rewrote `packages/platform-web/skills/web-prototype-convert/SKILL.md` to describe the 4-phase agentic pipeline (UNDERSTAND → DECIDE → IMPLEMENT → VALIDATE). Created `packages/platform-web/skills/web-prototype-convert/references/analysis-checklist.md` as the Phase A questionnaire.

Key changes to SKILL.md:
- `user-invocable: false` → `true` (skill was previously disabled)
- Removed "Note: References not yet written. This skill is disabled" paragraph
- Updated description with new trigger phrases matching the 4-phase pipeline
- Replaced 6-step flat workflow with structured 4-phase pipeline body
- Phase B spec format rules embedded inline (plain language first, bold keyword questions, two-pass auto-decide)
- Phase C confidence-tiered live read table (HIGH/MEDIUM/LOW)
- Phase D validation checklist

## Key decisions and why

- **Decision**: Embed Phase B spec format rules directly in SKILL.md rather than a reference file.
  **Why**: Phase B behavior is core to the pipeline contract — agents need it in active context without an extra file read. Reference files load on demand; Phase B rules need to be always present.

- **Decision**: Confidence-tiered live read in Phase C (HIGH → skip, MEDIUM → stories only, LOW → tsx + stories).
  **Why**: Minimizes unnecessary file reads while guaranteeing freshness for uncertain mappings. Token efficiency without sacrificing correctness.

## What almost went wrong

- analysis-checklist.md initially hit 211 lines (cap: 200). Trimmed by collapsing `---` separators between sections and removing redundant step numbering prefixes. Content preserved fully.
