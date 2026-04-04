---
name: test
description: (ePost) Detects platform and runs the appropriate test suite with coverage reporting. Use when user says "run tests", "add tests", "check coverage", "write unit tests", or "validate this works" — detects platform and runs the appropriate test suite (Jest, XCTest, JUnit, Espresso)
argument-hint: "[--unit | --ui | --visual | --coverage | test description]"
user-invocable: true
context: fork
agent: epost-tester
metadata:
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
| `--scenario` | Run edge case analysis before tests — delegates to `/scenario` skill. Generates test targets across 12 dimensions. |

If `$ARGUMENTS` starts with `--visual`: load `references/visual-mode.md` and follow its steps. Skip platform detection.

## Fingerprint Pre-Check (Skip Unchanged Test Targets)

Before running tests, check `.epost-cache/fingerprints.json`:

1. If file exists: load stored hashes
2. For each source file in test scope: run `shasum -a 256 <file> | cut -c1-8` and compare to stored hash
3. Skip test targets whose source files are all unchanged — log `"unchanged: {path}"`
4. Run tests only for changed files or when `--coverage` flag is present (always full run)
5. After test run: update `.epost-cache/fingerprints.json` with new hashes

Report: `"{N} test targets run, {M} skipped (source unchanged)"`

See `core/references/file-fingerprinting-protocol.md` for hash format, batch command, and invalidation rules.

**Exception**: `--coverage` flag always triggers full test run regardless of fingerprints.

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
