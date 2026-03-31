# Status: Core Skills Consolidation

**Updated**: 2026-03-30 (phases 2 & 3 complete)

## Progress

| Phase | Title | Status |
|-------|-------|--------|
| 1 | Merge flag-based skills (security-scan, predict, scenario, retro, llms) | Done |
| 2 | Create unified knowledge skill | Done |
| 3 | Update registries and regenerate indexes | Done |

## Key Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-03-30 | `--scan` added to security flags table (not Step 0 `if` chain) | security has existing flag table; consistent pattern |
| 2026-03-30 | `--retro` added to git Step 0 `if` chain + Aspect Files table | git has no standalone flag table; matches existing pattern |
| 2026-03-30 | `--llms` added to docs Step 0 `if` chain + Aspect Files table | docs uses `if $ARGUMENTS starts with` pattern throughout |
| 2026-03-30 | `--predict` added to plan Mode Reference table | plan already has Mode Reference table; clean fit |
| 2026-03-30 | `--scenario` added to test Step 0 flag table | test has flag table in Step 0; consistent |
| 2026-03-30 | knowledge SKILL.md under 300 LOC (241 LOC); capture moved to references/capture.md | target met |
| 2026-03-30 | clean-code directory kept, removed from package.yaml only | plan.md says "stays separate"; phase-4 says remove from registry |
| 2026-03-30 | journal added to package.yaml (was missing from original) | consistent with directory presence |

## Architecture Reference

- 5 standalone skills merged into parent skills as flags
- Content moved to `references/*.md` files under each parent
- skill-index.json still has stale entries — Phase 3 will clean up

## Not Yet Started

None — all phases complete.
