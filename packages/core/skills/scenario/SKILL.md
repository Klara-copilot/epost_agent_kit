---
name: scenario
description: "(ePost) Use when analyzing edge cases before implementing a feature, generating test targets, or stress-testing a feature design. Use before writing tests or during planning — generates scenarios across 12 dimensions (auth, timing, scale, data integrity, etc.)"
user-invocable: true
context: fork
agent: epost-tester
metadata:
  argument-hint: "<file path or feature description>"
  keywords: [scenario, edge-case, test-planning, risk, dimensions, pre-implementation]
  triggers: [/scenario, edge cases, test scenarios, scenario analysis, before writing tests]
  platforms: [all]
  agent-affinity: [epost-tester, epost-planner, epost-fullstack-developer]
  connections:
    enhances: [test, plan, code-review]
---

## Delegation — REQUIRED

This skill MUST run via `epost-tester`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/scenario`
- **Arguments**: `$ARGUMENTS` (full argument string from Skill invocation)
- If no arguments: state "no arguments — analyze the current feature or file in context"

# Scenario — Edge Case Analysis

12-dimension edge case framework. Generates structured test scenarios before implementation to prevent regressions and coverage gaps.

## When to Use

- Before writing tests for a new feature
- When requirements feel incomplete
- When reviewing test coverage for a critical path
- Pre-implementation to inform design decisions

## 12 Dimensions

| # | Dimension | Examples |
|---|-----------|---------|
| 1 | User Types | Anonymous, authenticated, admin, concurrent users, disabled accounts |
| 2 | Input Extremes | Empty, null, max length, special chars, Unicode, negative numbers, zero |
| 3 | Timing | Race conditions, timeout, out-of-order events, stale data, clock skew |
| 4 | Scale | 1 user, 10K concurrent, DB at 99% capacity, large payloads |
| 5 | State Transitions | Mid-process failure, retry after partial success, interrupted workflows |
| 6 | Environment | Offline/slow network, missing env vars, degraded dependencies |
| 7 | Error Cascades | Upstream service down, partial data response, DB timeout mid-transaction |
| 8 | Authorization | Role escalation, cross-tenant access, CSRF, token expiry mid-session |
| 9 | Data Integrity | Duplicate submission, stale cache, partial write, concurrent modification |
| 10 | Integration | 3rd party unavailable, API version mismatch, response schema drift |
| 11 | Compliance | GDPR data exposure, data retention limits, audit trail completeness |
| 12 | Business Logic | Domain rule edge cases, calculation rounding, unit/currency conversion |

## Workflow

### Step 1 — Filter Dimensions

For the feature under analysis, identify relevant dimensions. Skip dimensions with no applicable scenarios (e.g., skip Compliance for an internal logging utility).

State which dimensions are active and why.

### Step 2 — Generate Scenarios

For each active dimension, generate 3–5 specific, concrete scenarios. Each scenario should be:
- Testable (has clear input + expected output)
- Non-obvious (not the happy path)
- Realistic (could happen in production)

### Step 3 — Classify Severity

| Severity | Criteria |
|----------|---------|
| **Critical** | Data loss, security breach, auth bypass, system unavailability |
| **High** | User data corruption, silent failures, major UX breakage |
| **Medium** | Degraded performance, recoverable errors, partial feature failure |
| **Low** | Edge case UX issues, cosmetic problems, minor inconsistencies |

### Step 4 — Output

```markdown
## Scenario Analysis: [Feature Description]

### Active Dimensions
[List of dimensions and why they apply]

### Scenarios

| # | Dimension | Scenario | Severity | Test Seed |
|---|-----------|---------|----------|-----------|
| 1 | User Types | Admin deletes own account while impersonating another user | Critical | [test description] |
| 2 | Input Extremes | Submit form with 0-byte file upload | High | [test description] |
...

### Test Seeds (for /test)
[Bullet list of test-ready descriptions, copied from Test Seed column]
```

## Integration with `/test`

Pass the Test Seeds section directly into `/test` as context:

```
/test — use these scenarios: [paste scenario table or seeds]
```

## Integration with `/plan`

Feed Critical/High rows into plan risk assessment. High-severity scenarios should appear as explicit test requirements in the plan's success criteria.

<request>$ARGUMENTS</request>
