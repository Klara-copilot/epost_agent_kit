# Phase 6: Android Platform Agents

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 4](phase-04-functional-verification.md)

## Overview
- **Priority**: P3
- **Status**: pending
- **Effort**: 2h
- **Description**: Create Android platform agents as skeletons (`android/implementer`, `android/tester`), create skeleton Android skill, and placeholder commands. These are minimal templates to be populated with real content later.

## Key Insights
- No existing Android agents, skills, or commands in the codebase
- Android is explicitly designated as "skeleton only" in the unified plan
- Kotlin + Jetpack Compose is the target stack
- No Android-specific MCP tools available currently

## Requirements

### Functional

**Create agents** (skeleton):
- `android/implementer.md` - Kotlin, Jetpack Compose, Android 14+
- `android/tester.md` - JUnit, Espresso

**Create skills** (skeleton):
- `skills/android/android-development/SKILL.md` - Basic Android development guidance

**Create commands** (skeleton):
- `commands/android/cook.md` - Android implementation
- `commands/android/test.md` - Android testing

### Non-Functional
- Clearly marked as skeleton/placeholder
- Minimal but valid (parseable YAML, correct structure)
- Ready for future population without structural changes

## Architecture

```
Global implementer (detects .kt, build.gradle, .gradle)
  |
  +-- Spawns android/implementer
        |
        +-- Uses skills: android/android-development
        +-- Uses shared skills: databases
        +-- Tools: Read, Write, Edit, Bash, Grep, Glob
        +-- Build: ./gradlew assembleDebug
        +-- Test: delegates to android/tester
```

## Related Code Files

### Create
- `.claude/agents/android/implementer.md`
- `.claude/agents/android/tester.md`
- `.claude/skills/android/android-development/SKILL.md`
- `.claude/commands/android/cook.md`
- `.claude/commands/android/test.md`

### Modify
- `.claude/agents/implementer.md` - Add android delegation target
- `.claude/agents/tester.md` - Add android delegation target

## Implementation Steps

### Step 1: Create directories
```bash
mkdir -p .claude/agents/android
mkdir -p .claude/skills/android/android-development
mkdir -p .claude/commands/android
```

### Step 2: Create android/implementer.md
```yaml
---
name: android-implementer
description: Android platform implementation specialist. Executes Kotlin, Jetpack Compose development tasks. Spawned by global implementer for Android-specific work.
tools: Read, Write, Edit, Bash, Grep, Glob
model: inherit
color: green
---
```
Body (skeleton):
- Tech stack: Kotlin, Jetpack Compose, Android 14+ (API 34+)
- Architecture: MVVM with ViewModel + StateFlow
- Build: `./gradlew assembleDebug`
- Note: "This agent is a skeleton. Populate with real patterns as Android development begins."

### Step 3: Create android/tester.md
```yaml
---
name: android-tester
description: Android platform testing specialist. Runs JUnit and Espresso tests. Spawned by global tester for Android-specific work.
tools: Read, Write, Edit, Bash, Grep, Glob
model: inherit
color: yellow
---
```
Body (skeleton): JUnit 5, Espresso, `./gradlew test`

### Step 4: Create android skill
```yaml
---
name: android-development
description: Android development patterns with Kotlin and Jetpack Compose. Use when building Android features, UI components, or platform-specific functionality.
---
# Android Development Skill

Skeleton skill — to be populated with:
- Kotlin coding patterns
- Jetpack Compose UI patterns
- Android architecture (MVVM, Clean Architecture)
- Gradle build configuration
- Android testing patterns
```

### Step 5: Create android commands
- `android/cook.md`: agent: android-implementer
- `android/test.md`: agent: android-tester

### Step 6: Update global agents
- Add android delegation targets to implementer.md and tester.md

## Todo List

- [ ] Create `.claude/agents/android/` directory
- [ ] Create android/implementer.md (skeleton)
- [ ] Create android/tester.md (skeleton)
- [ ] Create `.claude/skills/android/android-development/SKILL.md` (skeleton)
- [ ] Create android/cook.md command
- [ ] Create android/test.md command
- [ ] Update global implementer and tester delegation
- [ ] Verify all references

## Success Criteria

- 2 Android agents at `.claude/agents/android/{implementer,tester}.md`
- Android skill at `.claude/skills/android/android-development/SKILL.md`
- Android commands at `.claude/commands/android/{cook,test}.md`
- All files have valid YAML frontmatter
- Clearly marked as skeleton/placeholder

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Skeleton agents used prematurely | Poor quality Android code | Clear "skeleton" disclaimers in agent prompts |
| Gradle not installed in env | Build commands fail | Note in agent: "verify Gradle wrapper exists before running" |

## Security Considerations
- No new tool permissions
- No secrets handling

## Next Steps
- Phase 7 builds CLI that discovers Android agents alongside web/iOS
- Android agents populated with real content in a future initiative
