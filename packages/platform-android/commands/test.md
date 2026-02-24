---
title: Android Test
description: (ePost) Run Android unit tests and instrumented tests using Gradle
agent: epost-android-developer
argument-hint: [--unit | --instrumented | --coverage]
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# Android Test Command

Run Android unit tests (JUnit) and instrumented tests (Espresso) using Gradle.

**⚠️ SKELETON COMMAND**: This command uses a skeleton agent. Populate android-tester with real patterns before use.

## Usage

```
/android:test                    # Run all tests
/android:test --unit             # Unit tests only
/android:test --instrumented     # Instrumented tests only
/android:test --coverage         # With coverage report
```

## Your Process

1. **Parse Arguments**
   - `--unit`: `./gradlew test`
   - `--instrumented`: `./gradlew connectedAndroidTest`
   - `--coverage`: `./gradlew jacocoTestReport`

2. **Run Tests**
   - Execute Gradle command
   - Capture test output

3. **Parse Results**
   - Count passed/failed tests
   - Calculate coverage if requested

4. **Report**
   - Summary of test results
   - Coverage metrics
   - Failure diagnostics

## Completion Report

```markdown
## Android Test Results

### Tests Run

- Total: X
- Passed: ✓ X
- Failed: ✗ X

### Coverage

- Statements: X%

### Failed Tests

- `TestName` - Reason
```

---

_[android:test] is a ClaudeKit command (SKELETON)_
