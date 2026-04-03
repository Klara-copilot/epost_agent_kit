---
updated: 2026-04-03
title: "Testing Skills: iOS, Android, Backend"
status: active
created: 2026-04-03
effort: 3h
phases: 3
platforms: [ios, android, backend]
breaking: false
---

## Summary

Create testing skills for iOS, Android, and Backend platforms. Based on research into XCTest/Swift Testing (iOS), Compose UI Testing/Hilt (Android), and Arquillian/Weld-JUnit/RestAssured (Backend).

## Evaluation Context

All 3 platforms currently have development skills but NO dedicated testing skill. Testing guidance is scattered or missing entirely. This closes the gap identified in the testing skill audit.

## Phases

| # | Phase | Effort | File | Depends |
|---|---|---|---|---|
| 1 | Create `ios-testing` skill | 45 min | [phase-1](./phase-1-ios-testing.md) | — |
| 2 | Create `android-testing` skill | 45 min | [phase-2](./phase-2-android-testing.md) | — |
| 3 | Create `backend-testing` skill | 45 min | [phase-3](./phase-3-backend-testing.md) | — |

All phases are independent — can run in parallel.

## Success Criteria

- [ ] `packages/platform-ios/skills/ios-testing/SKILL.md` created
- [ ] `packages/platform-ios/skills/ios-testing/references/xctest-patterns.md` created
- [ ] `packages/platform-ios/skills/ios-testing/references/swift-testing-migration.md` created
- [ ] `packages/platform-android/skills/android-testing/SKILL.md` created
- [ ] `packages/platform-android/skills/android-testing/references/compose-ui-testing.md` created
- [ ] `packages/platform-android/skills/android-testing/references/hilt-testing.md` created
- [ ] `packages/platform-backend/skills/backend-testing/SKILL.md` created
- [ ] `packages/platform-backend/skills/backend-testing/references/arquillian-patterns.md` created
- [ ] `packages/platform-backend/skills/backend-testing/references/jacoco-coverage.md` created
- [ ] All 3 skills registered in their `package.yaml`
- [ ] `epost-kit init --full --source .` + skill index regeneration succeed

## Constraints

- Layer 0 (org-wide) — no ePost project-specific paths or product names
- Adapt to actual stacks: XCTest (not Quick/Nimble), JUnit 4 (not JUnit 5), Arquillian (not Spring Boot Test)
- SKILL.md bodies lean — push depth into references
- YAGNI: no XCPerf harness details, no k6, no contract testing
