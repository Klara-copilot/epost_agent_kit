---
updated: 2026-04-03
title: "Testing Skill Improvements"
status: active
created: 2026-04-03
effort: 1.5h
phases: 3
platforms: [web, all]
breaking: false
---

## Summary

Uplift our testing skills based on gaps found by comparing against claudekit's `ck:test` and `web-testing`. Our skills have good ePost-specific patterns but are missing strategy guidance, quality principles, flakiness mitigation, and test data management.

## Evaluation

### Our current state

| Skill | Strengths | Gaps |
|---|---|---|
| `core/skills/test` | Platform detection, `--scenario` (12-dimension, unique), `--visual`, delegation | No quality principles, no working process, no strategy guidance, thin execution |
| `platform-web/skills/web-testing` | Jest + RTL patterns, Playwright config, auth (storageState), PageHelper | No strategy model, no coverage targets, no CI/CD gates, no flakiness mitigation, no test data management |

### What claudekit has that we should adopt

| Capability | Source | Why adopt |
|---|---|---|
| Testing strategy models (Pyramid/Trophy/Honeycomb) + ratios | `web-testing/references/testing-pyramid-strategy.md` | Guides which test level to invest in — Trophy for Next.js SPAs |
| Flakiness mitigation patterns | `web-testing/references/test-flakiness-mitigation.md` | Explicit waits, retry strategies, isolation — org-wide useful |
| Test data management (Faker + Factory) | `web-testing/references/test-data-management.md` | Factory pattern + worker isolation — org-wide useful |
| CI/CD gate ordering | `web-testing/references/testing-pyramid-strategy.md` | lint → unit → integration → E2E — org-wide |
| Quality principles | `ck:test` SKILL.md | "NEVER IGNORE FAILING TESTS", test isolation, determinism |
| Typecheck-first working process | `ck:test` SKILL.md | Catch syntax errors before running test suite |
| Coverage targets | `web-testing/references/testing-pyramid-strategy.md` | Critical 100%, core 80–90%, overall 75–85% |

### What we do NOT adopt (YAGNI)

- k6 load testing — not in our stack
- Contract testing (Pact/MSW) — YAGNI
- Rust/Go/Flutter runners — not our stack
- claudekit-specific tool integrations (`ck:chrome-devtools`, `ck:ai-multimodal`) — different ecosystem

## Phases

| # | Phase | Effort | File |
|---|---|---|---|
| 1 | Uplift `core/skills/test/SKILL.md` | 20 min | [phase-1](./phase-1-uplift-core-test.md) |
| 2 | Uplift `platform-web/skills/web-testing/SKILL.md` | 30 min | [phase-2](./phase-2-uplift-web-testing.md) |
| 3 | Add 3 references to `web-testing/references/` | 45 min | [phase-3](./phase-3-add-references.md) |

## Success Criteria

- [ ] `core/skills/test` has quality principles and working process
- [ ] `core/skills/test` `--scenario` flag is prominent with link to scenario-mode.md
- [ ] `web-testing` has strategy section (Trophy for SPAs), CI/CD gate ordering, coverage targets
- [ ] `web-testing/references/testing-strategy.md` created
- [ ] `web-testing/references/test-flakiness-mitigation.md` created
- [ ] `web-testing/references/test-data-management.md` created
- [ ] All changes in `packages/` (never `.claude/`)
- [ ] `epost-kit init --full --source .` + skill index regeneration succeed

## Constraints

- All content must be Layer 0 (org-wide) — no ePost project-specific examples in references
- Adapt claudekit content to our stack (Jest/Playwright, not Vitest/k6)
- Keep SKILL.md bodies lean — push depth into references
