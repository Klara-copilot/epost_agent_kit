---
title: "Fix: Test"
description: (ePost) Fix failing tests
agent: epost-tester
argument-hint: [test failure description]
---

# Fix Failing Tests

Direct test fix — skip auto-detection, run test suite and fix failures.

<issue>$ARGUMENTS</issue>

## Process

1. **Run test suite** — execute relevant tests to identify failures
2. **Analyze failures** — parse error output, identify root cause of each failure
3. **Fix root cause** — fix the production code (not the test) unless the test is wrong
4. **Re-run** — repeat until all tests pass (100% green gate)

## Rules

- Fix root causes, not symptoms
- Do not comment out or skip failing tests
- Do not change test assertions to make them pass
- Do not use fake data to bypass tests
- If a test is genuinely wrong, explain why before changing it
