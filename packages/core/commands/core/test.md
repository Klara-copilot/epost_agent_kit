---
title: Test Command
description: ⭑.ᐟ Run test suite and analyze coverage
agent: epost-tester
argument-hint: 👉👉👉 [optional test file path]
---

# Test Command

Run tests and analyze coverage.

## Usage
```
/test
/test [specific test file]
```

## Your Process
1. Identify test framework (Jest, Vitest, Pytest, Go test, etc.)
2. Detect platform (Node, Python, Go, etc.)
3. Run the appropriate test suite
4. Parse results and handle platform-specific output
5. Calculate code coverage
6. Report findings with severity

## Output
- Total tests run
- Pass/fail counts
- Coverage percentage
- Failure details (if any)
- Recommendations

## If Tests Fail
1. Identify which tests failed
2. Analyze why they failed
3. Suggest fixes
