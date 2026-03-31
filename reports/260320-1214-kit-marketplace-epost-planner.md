# Plan Report: Kit Marketplace — Modular Distribution + Terminal UI

**Date:** 2026-03-20
**Agent:** epost-planner
**Plan:** `plans/260320-1213-kit-marketplace/`
**Status:** READY

---

## Executive Summary

4-phase plan to evolve epost-kit CLI from fixed profiles into a modular marketplace with interactive terminal UI. Uses existing `@inquirer/prompts` + `cli-table3` stack (no new deps). Spans two repos: kit repo (bundles.yaml, skill-index) and CLI repo (commands, resolver, TUI).

## Plan Details

| Phase | What | Effort | Key Files |
|-------|------|--------|-----------|
| 1 - Registry + Bundles | bundles.yaml, .epost.json schema, dep resolver | 5h | `bundles.yaml`, `src/domains/resolver/` |
| 2 - CLI Commands | roles, add, remove, list, upgrade | 6h | `src/commands/{roles,add,remove,list}.ts` |
| 3 - Marketplace TUI | Interactive browse with card grid, tabs, search | 5h | `src/domains/ui/marketplace-*.ts` |
| 4 - GitHub Registry | Remote fetch, version compare, cache, offline | 4h | `src/domains/github/registry-*.ts` |

## Key Decisions

- **TUI: @inquirer/prompts, NOT ink** — already a dep, cli-table3 handles card grid, no React runtime overhead
- **7 roles** + `full` fallback + `kit-author`; profile aliases for backward compat
- **Role `extends`**: web-fullstack inherits web-frontend + web-backend (resolver merges)
- **GitHub raw content** for remote registry (no auth needed for public reads)
- **1-hour cache** for remote data; full offline support

## Verdict

**READY** — all phases independently shippable, no new deps required for Phase 1-3.

## Unresolved Questions

1. **Skill versioning**: tied to kit release or independent? Plan defaults to "1.0.0" for now. Decide when remote registry is live.
2. **Custom user bundles**: should `.epost.json` support user-defined roles? Deferred — YAGNI until requested.
3. **Bundle YAML location**: `bundles.yaml` at repo root vs `packages/core/bundles.yaml`? Plan uses repo root for simplicity. CLI needs to know where to find it at install time.
