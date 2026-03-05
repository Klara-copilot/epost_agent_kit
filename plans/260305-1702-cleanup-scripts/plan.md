---
title: "Cleanup scripts - keep only developer-facing ones"
status: active
created: 2026-03-05
updated: 2026-03-05
effort: 1.5h
phases: 2
platforms: [all]
breaking: false
---

# Cleanup Scripts

## Summary

Remove kit-internal scripts from `packages/core/scripts/` so only developer-facing scripts (plan lifecycle + skill index generation) get installed into `.claude/scripts/` when a user runs `epost-kit init`. Move validation/CI scripts to the CLI repo where they belong.

## Current State

13 scripts in `packages/core/scripts/`. All are blindly copied to `.claude/scripts/` via `files: scripts/: scripts/` mapping in `package.yaml`.

## Classification

### KEEP in packages/core/scripts/ (installed to user projects)

| Script | Reason |
|--------|--------|
| `get-active-plan.cjs` | Used by plan skill |
| `set-active-plan.cjs` | Used by plan skill |
| `complete-plan.cjs` | Used by plan skill |
| `archive-plan.cjs` | Used by plan skill |
| `generate-skill-index.cjs` | Used by skill-discovery |

### REMOVE from packages/core/scripts/ (not developer-facing)

| Script | Disposition |
|--------|-------------|
| `agent-profiler.cjs` | Remove — referenced in error-recovery example but not actually called |
| `detect-improvements.cjs` | Remove — auto-improvement/review internal; move to CLI `lint`/`verify` |
| `check-coverage.cjs` | Remove — CI tool, not agent workflow |
| `scan-secrets.cjs` | Remove — CI tool, not agent workflow |
| `test-fixes.cjs` | Remove — tests the above scripts; no longer needed |
| `validate-command-descriptions.cjs` | Remove — already ported to CLI `lint` command |
| `validate-skill-connections.cjs` | Remove — already ported to CLI `verify` command |
| `validate-role-scenarios.cjs` | Remove — already ported to CLI `verify` command |

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Remove scripts + update package.yaml | 0.5h | pending | [phase-1](./phase-01-remove-scripts.md) |
| 2 | Update skill references | 1h | pending | [phase-2](./phase-02-update-references.md) |

## Success Criteria

- [ ] `packages/core/scripts/` contains only 5 plan/skill-index scripts
- [ ] `packages/core/package.yaml` scripts list has only 5 entries
- [ ] No skill references broken scripts (grep for removed script names returns 0 hits)
- [ ] Plan lifecycle still works (`set-active-plan`, `complete-plan`, `archive-plan`)
