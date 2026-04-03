---
updated: 2026-04-03
title: "Testing Skill Improvements"
status: active
created: 2026-04-03
effort: 2.5h
phases: 4
platforms: [web, all]
breaking: false
---

## Summary

Uplift our testing/fixing skills based on structural gaps found by comparing against claudekit's `ck:scenario`, `ck:test`, `ck:web-testing`, `ck:fix`, and `ck:security-scan`.

## Evaluation

### Structural gaps (architectural)

| Gap | Severity | Finding |
|---|---|---|
| `/scenario` is a flag on `/test`, not standalone | High | Scenario = pre-implementation analysis, not test execution. Should be invocable independently during planning/coding, not only when running tests. |
| `/fix` lacks prevention gate | High | After fixing a bug, there's no explicit requirement to add a regression test. claudekit's fix has a hard "Verify + Prevent" step. Our fix dispatches to epost-debugger which has good diagnosis but no prevention enforcement. |
| `/fix` lacks complexity routing | Medium | claudekit classifies simple/moderate/complex/parallel before routing. Our fix does auto-detection of error type but no complexity-based workflow selection. |

### Content gaps (reference library)

| Gap | Severity | Finding |
|---|---|---|
| `web-testing` has no testing strategy guidance | High | No Pyramid/Trophy/Honeycomb model — agents default to unit-heavy when integration-heavy is right for SPAs |
| No CI/CD gate ordering | Medium | No shared definition of lint→unit→integration→E2E order |
| No coverage targets | Medium | No coverage bar |
| No flakiness mitigation reference | Medium | Our E2E has hard waits today |
| No test data management reference | Medium | No factory/Faker pattern guidance |

### What's already good (no changes needed)

| Area | Why fine |
|---|---|
| `/security` | Richer than claudekit's (STRIDE + OWASP + dependency audit + `--scan` flag) |
| `/debug` | Has iron law, 5-step methodology, state diagram tracing |
| `/test` orchestration | Platform detection + delegation pattern is solid |
| `--scenario` content | The 12-dimension framework is already excellent |

## Phases

| # | Phase | Effort | File | Depends |
|---|---|---|---|---|
| 1 | Extract `/scenario` as standalone skill | 30 min | [phase-1](./phase-1-extract-scenario-skill.md) | — |
| 2 | Enrich `/fix` with prevention gate + complexity routing | 30 min | [phase-2](./phase-2-enrich-fix-skill.md) | — |
| 3 | Uplift `web-testing/SKILL.md` | 30 min | [phase-3](./phase-3-uplift-web-testing.md) | — |
| 4 | Add 3 references to `web-testing/references/` | 45 min | [phase-4](./phase-4-add-web-testing-references.md) | — |

All phases are independent — can run in parallel.

## Success Criteria

- [ ] `/scenario` is a standalone invocable skill with its own SKILL.md
- [ ] `/test --scenario` still works (delegates to `/scenario` for backward compat)
- [ ] `/fix` has explicit prevention gate step (add regression test after fix)
- [ ] `/fix` has complexity classification (simple/moderate/complex)
- [ ] `web-testing` has strategy section (Trophy for SPAs), CI/CD gates, coverage targets
- [ ] `web-testing/references/testing-strategy.md` created
- [ ] `web-testing/references/test-flakiness-mitigation.md` created
- [ ] `web-testing/references/test-data-management.md` created
- [ ] All changes in `packages/` (source of truth)
- [ ] `epost-kit init --full --source .` + skill index regeneration succeed

## Constraints

- All content must be Layer 0 (org-wide) — no ePost project-specific examples in references
- Adapt claudekit content to our stack (Jest/Playwright, not Vitest/k6)
- Keep SKILL.md bodies lean — push depth into references
- YAGNI: do NOT add k6, contract testing, or multi-language runners (not our stack)
