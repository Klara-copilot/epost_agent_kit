---
plan: 260401-1310-claudekit-rules-adoption
updated: 2026-04-01
---

# Status: claudekit Rules Adoption

## Progress

| # | Phase | Status |
|---|-------|--------|
| 1 | cook — Anti-Rationalization + Mandatory Finalize + --auto | Done |
| 2 | plan — Parallel-mode phase template completeness | Done |
| 3 | preview — Wire into routing table | Done |
| 4 | orchestration — Docs Impact Assessment section | Done |
| 5 | git — Lint gate pre-commit + test gate pre-push | Done |
| 6 | research — --optimize autonomous iteration loop | Done |
| 7 | git — Enhanced --ship pipeline | Done |
| 8 | retro — Data-driven retrospective skill | Done |
| 9 | output-mode — 3-mode output style | Done |
| 10 | predict — 3-persona expert debate | Done |
| 11 | journal — Standalone reflective journal skill | Done |

## Key Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-04-01 | Anti-Rationalization placed after Flags table (not before Auto-skip) | Flags table establishes `--auto` first; anti-rationalization then guards against misuse of `--no-gate` |
| 2026-04-01 | Finalize in fast-mode uses step numbers 5a/5b/5c/5d; parallel-mode uses section headings | fast-mode already had numbered steps; parallel-mode uses a looser format |

## Architecture Reference

- cook skill: `packages/core/skills/cook/SKILL.md`
- fast-mode reference: `packages/core/skills/cook/references/fast-mode.md`
- parallel-mode reference: `packages/core/skills/cook/references/parallel-mode.md`

## Known Bugs

None.
