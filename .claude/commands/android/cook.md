---
title: Android Cook
description: Implement Android features with Kotlin and Jetpack Compose
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

**⚠️ SKELETON COMMAND**: This command uses a skeleton agent. Populate android-implementer with real patterns before use.

## Usage
```
/android:cook [plan file or description]
/android:cook plans/240122-auth.md
/android:cook add user profile screen with Compose
```

## Your Process

1. **Parse Request**
   - Read plan file if provided
   - Understand feature requirements

2. **Implement in Order**
   - Create models (data classes, Room entities)
   - Create ViewModels with StateFlow
   - Create Composables
   - Implement networking
   - Write JUnit tests

3. **Build Verification**
   - Run `./gradlew assembleDebug`
   - Report compilation errors

## Completion Report

```markdown
## Android Implementation Complete

### Files Created: X
- `Path/To/File.kt` - Description

### Architecture
- Pattern: MVVM
- UI Framework: Jetpack Compose

### Build Verification
- Status: ✅ Success / ❌ Failed
```

---
*[android:cook] is a ClaudeKit command (SKELETON)*
