---
title: Test
description: (ePost) Run tests — auto-detects platform
agent: epost-tester
argument-hint: [--unit | --ui | --coverage | test description]
---

# Test — Unified Test Command

Run tests with automatic platform detection.

## Platform Detection

1. Check `$ARGUMENTS` for explicit platform hint (ios, android, web, backend)
2. If no hint, detect from changed files:
   - `.tsx/.ts/.jsx/.js` → web: Jest + RTL + Playwright (`npm test`, `npx playwright test`)
   - `.swift` → ios: XCTest via XcodeBuildMCP or xcodebuild
   - `.kt/.kts` → android: Gradle JUnit/Espresso (`./gradlew test`, `./gradlew connectedAndroidTest`)
   - `.java` → backend: Maven JUnit (`mvn test`)
3. If mixed → delegate to epost-orchestrator
4. If no files → ask user

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
