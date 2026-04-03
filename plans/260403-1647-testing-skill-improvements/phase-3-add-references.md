---
phase: 3
title: "Add 3 references to web-testing/references/"
effort: 45 min
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Source: claudekit `web-testing/references/` (adapted to Jest/Playwright stack, not Vitest/k6)
- Target: `packages/platform-web/skills/web-testing/references/`

## Overview

Create 3 reference files. Adapt claudekit content to our stack (Jest instead of Vitest, Playwright already matches). All content must be org-wide (Layer 0) — no ePost project-specific examples.

## Tasks

### Create `testing-strategy.md`

Source: claudekit `references/testing-pyramid-strategy.md`

Adapt:
- Keep all 4 models (Pyramid, Trophy, Honeycomb, Diamond) + ratios table
- Keep priority matrix (P0–P3)
- Keep coverage targets section
- Keep CI/CD order — replace `npm run test:unit` with Jest commands
- Remove Vitest references — we use Jest

### Create `test-flakiness-mitigation.md`

Source: claudekit `references/test-flakiness-mitigation.md`

Adapt:
- Keep as-is — Playwright patterns are identical
- Remove Vitest-specific retries — keep Playwright `test.describe.configure({ retries: 3 })`
- Add our `test.setTimeout(120000)` pattern from current web-testing skill

### Create `test-data-management.md`

Source: claudekit `references/test-data-management.md`

Adapt:
- Keep Faker + Factory (Fishery) patterns — library-agnostic, works with Jest
- Keep worker-isolation pattern for Playwright parallelism
- Remove Testcontainers (from database-testing.md) — not in scope

## File Ownership

| File | Action |
|---|---|
| `packages/platform-web/skills/web-testing/references/testing-strategy.md` | CREATE |
| `packages/platform-web/skills/web-testing/references/test-flakiness-mitigation.md` | CREATE |
| `packages/platform-web/skills/web-testing/references/test-data-management.md` | CREATE |
