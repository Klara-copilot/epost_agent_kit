---
title: "Kit Marketplace — Modular Distribution + Terminal UI"
status: archived
created: 2026-03-20
updated: 2026-03-20
effort: 20h
phases: 4
platforms: [cli]
breaking: false
---

# Kit Marketplace — Modular Distribution + Terminal UI

Evolve epost-kit CLI from fixed profiles to modular skill/role marketplace with interactive terminal UI.

## Context

- Research: `reports/260320-1127-modular-kit-distribution-epost-researcher.md`
- CLI repo: `/Users/than/Projects/epost-agent-kit-cli/` (cac + @inquirer/prompts, TypeScript)
- Kit repo: `/Users/than/Projects/epost_agent_kit/` (bundles.yaml, skill-index.json)
- No breaking changes to existing `init --profile` (deprecated gracefully)

## Design Decisions

1. `@inquirer/prompts` for TUI (not ink) — already a dep, simpler, sufficient for card layout via cli-table3
2. GitHub raw content for remote registry (not GitHub Packages)
3. Agents are role-scoped (bundled with role, not global)
4. Auto-update prompts user (not silent)
5. `epost-kit add` works post-init
6. No private bundles, no infra skills

## TUI Library Decision: @inquirer/prompts + cli-table3

**Why not ink:**
- ink requires React runtime in CLI (+200KB), new paradigm for codebase
- Existing CLI uses @inquirer/prompts everywhere — consistency matters
- cli-table3 already a dep — card layouts via styled tables
- ink's advantage (live-updating UI) not needed for browse/select flow

**How card layout works with current stack:**
- `cli-table3` renders card grid (name, description, status badge, version)
- `@inquirer/prompts` `select()` for tab switching (All Roles / Installed / Updates)
- `@inquirer/prompts` `search()` for keyword filter
- `picocolors` for status badges (green=installed, yellow=update, dim=available)

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Registry + Bundle Manifest | 5h | Done | [phase-1](./phase-1-registry-bundles.md) |
| 2 | Core CLI Commands | 6h | Done | [phase-2](./phase-2-cli-commands.md) |
| 3 | Marketplace TUI | 5h | Done | [phase-3](./phase-3-marketplace-tui.md) |
| 4 | GitHub Registry Integration | 4h | Done | [phase-4](./phase-4-github-registry.md) |

## Success Criteria

- [ ] `epost-kit roles` lists 7+ roles with descriptions
- [ ] `epost-kit add web-frontend` installs skill + resolves deps
- [ ] `epost-kit add --role ios-developer` installs full bundle
- [ ] `epost-kit browse` shows interactive card UI with tabs
- [ ] `epost-kit upgrade --check` compares local vs GitHub versions
- [ ] Existing `init --profile full` still works (deprecation warning)
- [ ] `.epost.json` tracks installed state per-project

## Resolved Decisions

1. **Skill versioning**: Tied to kit release semver (not per-skill). All skills share the kit's version. No `version` field in skill frontmatter — skill-index entries get version from kit release.
2. **`bundles.yaml` location**: Repo root (`/bundles.yaml`), not `packages/core/`. Easy to fetch via GitHub raw URL, easy to find.
3. **Custom user bundles**: NOT supported. Users install predefined role bundles or individual skills. `.epost.json` records installed state but has no custom bundle spec field.

## Validation Summary

To be filled after plan review.
