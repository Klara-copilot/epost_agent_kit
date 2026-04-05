---
phase: 4
title: "Backend/iOS/Android stubs"
effort: 1h
depends: [1]
---

# Phase 4: Backend/iOS/Android Rule Stubs

## Context

- Plan: [plan.md](./plan.md)
- Depends on: Phase 1 (cross-cutting boundary defined)
- Blocks: none (parallel with P3, P5)

## Overview

Create minimal but real `code-review-rules.md` stubs for backend, iOS, and Android platform skills. Each has 5-10 rules specific to that platform. Extensible later — the structure matters more than completeness now.

## Files Owned (Phase 4 ONLY)

- `packages/platform-backend/skills/backend-javaee/references/code-review-rules.md` — NEW
- `packages/platform-ios/skills/ios-development/references/code-review-rules.md` — NEW
- `packages/platform-android/skills/android-development/references/code-review-rules.md` — NEW

## Tasks

### Backend (Java EE)

- [x] Create `backend-javaee/references/code-review-rules.md`
- [x] Add 8 rules across 2 categories:
  - **JPA** (4 rules): JPA-001 N+1 lazy load, JPA-002 unbounded query, JPA-003 entity equality, JPA-004 transaction scope
  - **CDI** (4 rules): CDI-001 scope mismatch injection, CDI-002 circular dependency, CDI-003 qualifier missing, CDI-004 EJB/CDI mixing
- [x] Scope: "Jakarta EE / WildFly backend services"

### iOS (Swift)

- [x] Create `ios-development/references/code-review-rules.md`
- [x] Add 6 rules across 2 categories:
  - **SWIFT** (3 rules): SWIFT-001 force unwrap without guard, SWIFT-002 retain cycle in closure, SWIFT-003 main thread UI update
  - **UIKIT** (3 rules): UIKIT-001 missing accessibility label, UIKIT-002 hardcoded color/font, UIKIT-003 async without MainActor
- [x] Scope: "Swift 6 / SwiftUI+UIKit iOS apps"

### Android (Kotlin)

- [x] Create `android-development/references/code-review-rules.md`
- [x] Add 6 rules across 2 categories:
  - **COMPOSE** (3 rules): COMPOSE-001 unstable parameter in composable, COMPOSE-002 side effect in composition, COMPOSE-003 missing remember
  - **HILT** (3 rules): HILT-001 missing @Inject constructor, HILT-002 scope mismatch, HILT-003 manual instantiation bypassing DI
- [x] Scope: "Kotlin / Jetpack Compose / Hilt Android apps"

### All stubs

- [x] Same frontmatter pattern as web rules file (name, description, user-invocable: false, disable-model-invocation: true)
- [x] Same table format: Rule ID, Rule, Severity, Pass, Fail
- [x] Add "## Extending" section: "Add rules following the ID pattern: {CATEGORY}-{NNN}. Keep severity scale consistent with cross-cutting rules."
- [x] Each file under 80 lines

## Validation

```bash
for f in packages/platform-backend/skills/backend-javaee/references/code-review-rules.md \
         packages/platform-ios/skills/ios-development/references/code-review-rules.md \
         packages/platform-android/skills/android-development/references/code-review-rules.md; do
  test -f "$f" && echo "exists: $f" || echo "MISSING: $f"
done

# Rule counts
grep -c "^| [A-Z]" packages/platform-backend/skills/backend-javaee/references/code-review-rules.md
# Expected: 8
grep -c "^| [A-Z]" packages/platform-ios/skills/ios-development/references/code-review-rules.md
# Expected: 6
grep -c "^| [A-Z]" packages/platform-android/skills/android-development/references/code-review-rules.md
# Expected: 6
```

## Success Criteria

- [x] All 3 files exist at correct paths
- [x] Backend: 8 rules (JPA + CDI)
- [x] iOS: 6 rules (SWIFT + UIKIT)
- [x] Android: 6 rules (COMPOSE + HILT)
- [x] Each file under 80 lines (55 / 51 / 53 lines)
- [x] Each has "Extending" section
