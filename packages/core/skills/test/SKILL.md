---
name: test
description: (ePost) Detects platform and runs the appropriate test suite with coverage reporting. Use when user says "run tests", "add tests", "check coverage", "write unit tests", or "validate this works" — detects platform and runs the appropriate test suite (Jest, XCTest, JUnit, Espresso)
user-invocable: true
context: fork
agent: epost-tester
metadata:
  argument-hint: "[--unit | --ui | --visual | --coverage | test description]"
  keywords:
    - test
    - coverage
    - unit-test
    - e2e
    - test-suite
  triggers:
    - /test
    - run tests
    - add test coverage
    - write tests for
    - check coverage
---

## Delegation — REQUIRED

This skill MUST run via `epost-tester`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/test`
- **Arguments**: `$ARGUMENTS` (full argument string from Skill invocation)
- If no arguments: state "no arguments — use auto-detection"

# Test — Unified Test Command

Run tests with automatic platform detection.

## Step 0 — Flag Override

| Flag | Behavior |
|------|----------|
| `--visual` | Load `references/visual-mode.md` and run Playwright screenshot comparison tests |
| `--visual --update` | Load `references/visual-mode.md` and update baseline screenshots |
| `--unit` | Unit tests only |
| `--ui` | UI/E2E tests only |
| `--coverage` | Include coverage report |
| `--scenario` | Generate edge cases (user types, input extremes, timing, scale) — see `references/scenario-mode.md` |

If `$ARGUMENTS` starts with `--visual`: load `references/visual-mode.md` and follow its steps. Skip platform detection.

## Platform Detection

Detect platform per `skill-discovery` protocol.

## Arguments

- `--unit` — unit tests only
- `--ui` — UI/E2E tests only
- `--visual` — visual regression tests (Playwright screenshot comparison)
- `--coverage` — include coverage report
- Test target name — run specific target

## Aspect Files

| File | Purpose |
|------|---------|
| `references/visual-mode.md` | Visual regression testing with Playwright screenshot comparison |
| `references/report-template.md` | Test report output format |

## Execution

1. Detect platform
2. Route to platform-specific agent
3. Run appropriate test commands
4. Report results with pass/fail counts and coverage

## Output Format

Use `references/report-template.md` for all test reports.

Key requirements:
- Header: Date, Agent, Plan (if applicable), Status
- Executive Summary first
- Results table with Check, Result (PASS/FAIL/SKIP), Evidence
- Coverage section when coverage data available
- Verdict: `PASS` | `FAIL` | `PARTIAL`
- Unresolved questions footer always present

<request>$ARGUMENTS</request>

**IMPORTANT:** Analyze the skills catalog and activate needed skills for the detected platform.
