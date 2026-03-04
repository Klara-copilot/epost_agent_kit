---
name: test
description: "(ePost) Run tests — auto-detects platform"
user-invokable: true
context: fork
agent: epost-tester
metadata:
  argument-hint: "[--unit | --ui | --coverage | test description]"
---

# Test — Unified Test Command

Run tests with automatic platform detection.

## Platform Detection

Detect platform per `skill-discovery` protocol.

## Arguments

- `--unit` — unit tests only
- `--ui` — UI/E2E tests only
- `--coverage` — include coverage report
- Test target name — run specific target

## Execution

1. Detect platform
2. Route to platform-specific agent
3. Run appropriate test commands
4. Report results with pass/fail counts and coverage

<request>$ARGUMENTS</request>

**IMPORTANT:** Analyze the skills catalog and activate needed skills for the detected platform.
