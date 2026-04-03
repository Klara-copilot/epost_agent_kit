---
phase: 4
title: "Add 3 references to web-testing/references/"
effort: 45 min
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Source: claudekit `web-testing/references/` — adapt to Jest/Playwright (not Vitest/k6)
- Target: `packages/platform-web/skills/web-testing/references/`
- Layer check: all content must be org-wide (Layer 0) — no ePost-specific examples

## Tasks

### Create `testing-strategy.md`

Source: claudekit `references/testing-pyramid-strategy.md`

Adapt:
- Keep all 4 models (Pyramid, Trophy, Honeycomb, Diamond) + ratios table
- Keep priority matrix (P0–P3)
- Keep coverage targets
- CI/CD order — use Jest/Playwright commands (not Vitest)
- Remove Vitest references

### Create `test-flakiness-mitigation.md`

Source: claudekit `references/test-flakiness-mitigation.md`

Adapt:
- Keep all content — Playwright patterns are identical
- Add our `test.setTimeout(120000)` E2E pattern from current `web-testing/SKILL.md`
- Keep retry strategies, explicit waits, animation disabling, network stubbing

### Create `test-data-management.md`

Source: claudekit `references/test-data-management.md`

Adapt:
- Keep Faker + Factory (Fishery) patterns — library-agnostic, works with Jest
- Keep worker-isolation prefix pattern for Playwright parallel workers
- Keep anti-patterns section
- Remove Testcontainers (database-testing scope, YAGNI for now)

## File Ownership

| File | Action |
|---|---|
| `packages/platform-web/skills/web-testing/references/testing-strategy.md` | CREATE |
| `packages/platform-web/skills/web-testing/references/test-flakiness-mitigation.md` | CREATE |
| `packages/platform-web/skills/web-testing/references/test-data-management.md` | CREATE |
