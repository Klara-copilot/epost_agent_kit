---
title: Android Cook
description: (ePost) Implement Android features with Kotlin and Jetpack Compose
agent: epost-android-developer
argument-hint: [plan file or feature description]
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - Edit
  - Write
  - TaskCreate
---

# Android Cook Command

Implement Android features from plans or descriptions. Supports Kotlin, Jetpack Compose, and Android 14+.

## Usage

```
/android:cook [plan file or feature description]
/android:cook plans/240122-auth.md
/android:cook add user profile screen with Compose
```

## Available Templates

Reference templates in `.claude/skills/android-development/assets/`:

- **build-gradle-app.kts** - App module configuration
- **compose-screen-template.kt** - Screen with loading/error/success
- **viewmodel-template.kt** - ViewModel with StateFlow
- **room-entity-dao-template.kt** - Database setup
- **retrofit-service-template.kt** - API client
- **navigation-template.kt** - Navigation setup
- **hilt-module-template.kt** - DI configuration

See patterns in `.claude/skills/android-development/references/`:
- **mvvm-architecture.md** - Layer responsibilities
- **compose-best-practices.md** - State hoisting, recomposition
- **error-handling.md** - Result wrapper, custom exceptions

## Your Process

1. **Parse Request**
   - Read plan file if provided
   - Understand feature requirements
   - Identify which templates apply

2. **Implement in Order**
   - Create models (data classes, Room entities) - use room-entity-dao-template.kt
   - Create ViewModels with StateFlow - use viewmodel-template.kt
   - Create Composables - use compose-screen-template.kt
   - Implement networking - use retrofit-service-template.kt
   - Add navigation - use navigation-template.kt
   - Setup DI - use hilt-module-template.kt
   - Write JUnit tests - use test examples from scripts/ directory

3. **Build Verification**
   - Run `./gradlew assembleDebug`
   - Report compilation errors
   - Fix and rebuild if needed

4. **Quality Checks**
   - Run linting: `./gradlew lint`
   - Run tests: `./gradlew test`
   - Verify coverage meets thresholds

## Completion Report

```markdown
## Android Implementation Complete

### Files Created: X

- `Path/To/File.kt` - Description

### Templates Used

- compose-screen-template.kt for UI
- viewmodel-template.kt for state management
- room-entity-dao-template.kt for data layer

### Architecture

- Pattern: MVVM
- UI Framework: Jetpack Compose
- State: StateFlow
- DI: Hilt

### Build Verification

- Status: ✅ Success / ❌ Failed
- Tests: X passed, Y failed
- Coverage: X%
```

---

_[android:cook] is an epost_agent_kit command (PRODUCTION-READY)_
