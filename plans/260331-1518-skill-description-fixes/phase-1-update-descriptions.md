---
phase: 1
title: "Update 11 Skill Descriptions"
effort: 1h
depends: []
---

# Phase 1: Update 11 Skill Descriptions

## Context Links

- [Plan](./plan.md)

## Overview

- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Update `description` field in 11 SKILL.md files that failed trigger evals. Apply CSO principles: natural language triggers, no file extensions, no quoted literals, specific enough to avoid false positives.

## Requirements

### Functional

- Each description must trigger on its true eval queries
- Each description must NOT trigger on its false eval queries
- Follow `(ePost) Use when...` prefix convention

### Non-Functional

- Descriptions under 200 characters
- No file extension triggers (`.kt`, `.swift`) — use natural language
- No quoted literal phrases — use flexible wording

## Files to Modify

### Package Sources (edit these)

| # | Skill | File | Current Issue |
|---|-------|------|---------------|
| 1 | android-development | `packages/platform-android/skills/android-development/SKILL.md` | File-extension focused, not intent-focused |
| 2 | android-ui-lib | `packages/platform-android/skills/android-ui-lib/SKILL.md` | "Android theme" too vague |
| 3 | ios-development | `packages/platform-ios/skills/ios-development/SKILL.md` | File-extension focused |
| 4 | ios-rag | `packages/platform-ios/skills/ios-rag/SKILL.md` | False positives from SwiftUI implementation queries |
| 5 | ios-ui-lib | `packages/platform-ios/skills/ios-ui-lib/SKILL.md` | "iOS theme" lookup queries don't match |
| 6 | kit | `packages/kit/skills/kit/SKILL.md` | Quoted literals don't match natural language |
| 7 | knowledge | `packages/core/skills/knowledge/SKILL.md` | "external API/library documentation" too broad |
| 8 | loop | `packages/core/skills/loop/SKILL.md` | "loop" pattern matches non-improvement queries |
| 9 | mermaidjs | `packages/core/skills/mermaidjs/SKILL.md` | "ER diagram" false positive on code-gen queries |
| 10 | simulator | `packages/platform-ios/skills/simulator/SKILL.md` | Quoted literals don't match natural language |
| 11 | thinking | `packages/core/skills/thinking/SKILL.md` | Missing "think deeply", "extended thinking" keywords |

### Also Update

- `packages/core/skills/skill-index.json` — description field for each skill
- `.claude/skills/skill-index.json` — mirror (or regenerate via init)

## Proposed Description Changes

### 1. android-development

**Before**: `Use when working with .kt/.kts files, Gradle builds, Jetpack Compose, or Android-specific features`
**After**: `Use when working on Android — Kotlin/Compose screens, Gradle builds, Hilt DI, Room DB, or fixing Android crashes and Kotlin coroutine issues`
**Why**: Replaces `.kt/.kts` file extensions with natural language terms that match how devs describe Android tasks.

### 2. android-ui-lib

**Before**: `Use when referencing Android theme Compose components, design tokens, or Material theme integration`
**After**: `Use when looking up Android theme Compose component APIs, Android design tokens, or Material theme color/typography mappings`
**Why**: "looking up" + "APIs" makes component-lookup intent clearer.

### 3. ios-development

**Before**: `Use when working with .swift files, Xcode projects, SwiftUI/UIKit, or iOS-specific features`
**After**: `Use when working on iOS — SwiftUI/UIKit views, Xcode builds, XCTest, or fixing iOS crashes and Swift issues`
**Why**: Adds XCTest (eval query term), removes `.swift` file extension, adds "fixing iOS crashes".

### 4. ios-rag

**Before**: `Use when searching iOS codebase for Swift views, UIKit/SwiftUI patterns, or design system tokens via vector search`
**After**: `Use when searching or finding existing patterns in the iOS Swift codebase — vector search for views, implementations, or design token usage. NOT for implementing new code.`
**Why**: "NOT for implementing" blocks false positives. "finding existing patterns" matches search intent.

### 5. ios-ui-lib

**Before**: `Use when referencing iOS theme SwiftUI components, design tokens, or platform-specific token mappings`
**After**: `Use when looking up iOS theme SwiftUI component APIs, iOS design tokens, or platform-specific color/typography token mappings`
**Why**: Parallel structure with android-ui-lib fix. "looking up" + "APIs" clarifies lookup intent.

### 6. kit

**Before**: `Use when user says "create an agent", "add a skill", "write a hook", "optimize a skill", or "kit authoring"`
**After**: `Use when creating, editing, or improving kit content — agents, skills, hooks; or when user says "kit authoring", "scaffold a skill", "add an agent", "write a hook"`
**Why**: Intent-first wording before quoted examples. "creating, editing, or improving" matches natural language. Removes "create an agent" exact-match that could false-positive on "review the agent configuration".

### 7. knowledge

**Before**: `Use when you need prior art, past decisions, existing patterns, or external API/library documentation — activates knowledge retrieval from internal docs and external sources. Also use to capture learnings after completing a task.`
**After**: `Use when retrieving prior decisions, internal patterns, or known context — NOT for general how-to questions about external libraries. Also use to capture learnings after completing a non-trivial task.`
**Why**: Removes "external API/library documentation" which caused false positive on "how does React work". Adds explicit NOT clause.

### 8. loop

**Before**: `Use when user wants to improve a metric like "test coverage", "bundle size", "lint errors", or "Lighthouse score" over multiple iterations — runs autonomous improvement loop until target is met`
**After**: `Use when user wants to autonomously improve a metric over multiple iterations — test coverage, bundle size, lint errors, Lighthouse score. Key phrases: "keep improving", "fix all X", "improve until target is met". NOT for polling or status checks.`
**Why**: Adds NOT clause to block "check deploy status every 5 minutes". Removes quoted metric names, uses natural language.

### 9. mermaidjs

**Before**: `Use when user asks to "create a diagram", "draw a flow chart", "visualize this system", or "show the architecture" — generates Mermaid diagrams (flow, sequence, ER, state machine, Gantt)`
**After**: `Use when user wants a Mermaid diagram — flow chart, sequence diagram, state machine, Gantt, or architecture visualization using Mermaid syntax specifically. NOT for generating code-based data models or ER schemas.`
**Why**: "using Mermaid syntax specifically" narrows scope. NOT clause blocks "generate an ER diagram in code".

### 10. simulator

**Before**: `Use when user says "list simulators", "boot a simulator", "launch the app", "open simulator", or "manage simulators"`
**After**: `Use when user wants to list, boot, open, or manage iOS simulators, or launch the app on a simulator`
**Why**: Removes quoted literals. Natural language with verbs covers fuzzy matching ("list available iOS simulators").

### 11. thinking

**Before**: `Use when stuck after 2+ failed attempts, hitting complexity spirals, or facing complex analysis that requires step-by-step hypothesis testing before acting`
**After**: `Use when user says "think deeply", "use extended thinking", "step-by-step analysis", or when stuck after multiple failed attempts and needs systematic hypothesis testing`
**Why**: Adds explicit trigger phrases "think deeply" and "extended thinking" that appear in eval queries.

## Implementation Steps

1. **Update 11 SKILL.md files** — Edit `description` field in each file listed above
2. **Update skill-index.json** — Match description in both `packages/core/skills/skill-index.json` and `.claude/skills/skill-index.json`
3. **Verify** — Run trigger evals to confirm pass rate improves

## Todo List

- [ ] Edit android-development SKILL.md description
- [ ] Edit android-ui-lib SKILL.md description
- [ ] Edit ios-development SKILL.md description
- [ ] Edit ios-rag SKILL.md description
- [ ] Edit ios-ui-lib SKILL.md description
- [ ] Edit kit SKILL.md description
- [ ] Edit knowledge SKILL.md description
- [ ] Edit loop SKILL.md description
- [ ] Edit mermaidjs SKILL.md description
- [ ] Edit simulator SKILL.md description
- [ ] Edit thinking SKILL.md description
- [ ] Update skill-index.json (both locations)
- [ ] Run trigger evals to verify

## Success Criteria

- All 11 descriptions updated in `packages/` source files
- `skill-index.json` in sync
- Trigger eval pass rate: 50/50 or 47+/50

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| New description causes different false positive | Med | Run full eval suite, not just the 11 fixed |
| Description too specific, misses edge queries | Low | Include both intent phrases and key terms |
| Forgetting to update skill-index.json | Low | Checklist item, verify at end |

## Security Considerations

- None identified — description-only changes, no code logic
