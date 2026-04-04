# Plan Status: Adopt Understand-Anything Patterns

## Progress

| Phase | Title | Status | Completed |
|-------|-------|--------|-----------|
| 0 | UA Patterns Reference Skill | Done | 2026-04-04 |
| 1 | Two-Phase Extraction for get-started | Pending | — |
| 2 | Intermediate Artifacts + File Fingerprinting | Done | 2026-04-04 |
| 3 | Understand Skill (Graph Consumer) | Pending | — |
| 4 | Graph-Aware Planning and Debugging | Pending | — |

## Key Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-04-04 | SKILL.md kept at 2980 bytes (under 3KB limit) by trimming UA schema node/edge detail to a pointer to the research report | Research report is authoritative source; SKILL.md only needs the pattern catalogue and application map |

## Architecture Reference

Skill location: `packages/core/skills/understand-patterns/`
Files:
- `SKILL.md` — pattern catalogue + ePost application map
- `references/two-phase-extraction.md`
- `references/artifact-persistence.md`
- `references/fan-in-ordering.md`
- `references/file-fingerprinting.md`

## Known Bugs

None.
