---
phase: 2
title: "Platform dispatch skeleton"
effort: 2h
depends: [1]
---

# Phase 2: Platform Dispatch Skeleton

## Context

- Plan: [plan.md](./plan.md)
- Depends on: Phase 1 (cross-cutting boundary must be defined first)
- Blocks: none

## Overview

Rewrite `code-review/SKILL.md` to be a platform-aware orchestrator. Add platform detection logic, rule loading protocol, and update the category table. The skill stays as a subagent — platform awareness comes via flag injection from the caller.

## Requirements

- Platform detection: `.tsx/.ts/.scss/.css` → web, `.java` → backend, `.swift` → ios, `.kt/.kts` → android
- Multi-platform support: if files span platforms, load multiple rule files
- Rule loading protocol: always load cross-cutting (code-review-standards.md) + platform rules (from caller-provided path or auto-detected)
- Update category table: split into "Cross-cutting (always)" and "Platform-specific (loaded on demand)"
- Update Lightweight vs Escalated tables for cross-cutting only; note platform rules follow same lightweight/escalated pattern
- Caller protocol: document how audit/SKILL.md and main context should pass platform info

## Files Owned (Phase 2 ONLY)

- `packages/core/skills/code-review/SKILL.md` — rewrite with platform dispatch logic

## Tasks

- [x] Add `## Platform Detection` section after "When Active":
  ```
  When invoked, detect platform from files in scope:
  1. If caller passed explicit `Platform:` context → use it
  2. Otherwise, scan file extensions in scope:
     - .tsx, .ts, .scss, .css → web
     - .java → backend  
     - .swift → ios
     - .kt, .kts → android
  3. Load platform rule file(s):
     - web: web-frontend/references/code-review-rules.md
     - backend: backend-javaee/references/code-review-rules.md
     - ios: ios-development/references/code-review-rules.md
     - android: android-development/references/code-review-rules.md
  4. Always load: code-review/references/code-review-standards.md (cross-cutting)
  5. If no platform detected: cross-cutting rules only
  ```
- [x] Update `### Systematic Review` category table:
  - Cross-cutting (always): SEC, ARCH, LOGIC, DEAD
  - Platform — Web: PERF, TS, STATE (+ klara if klara-theme files)
  - Platform — Backend: JPA, CDI, REST (future)
  - Platform — iOS: SWIFT, UIKIT (future)
  - Platform — Android: COMPOSE, HILT (future)
- [x] Update Lightweight vs Escalated Reference to reference cross-cutting rules only; add note: "Platform rules follow the same lightweight (first 50%) / escalated (all) pattern"
- [x] Add `## Caller Protocol` section documenting how audit/SKILL.md should pass platform:
  ```
  When dispatching epost-code-reviewer, include in prompt:
  Platform: {detected platform(s)}
  Platform rules: {path to platform code-review-rules.md}
  ```
- [x] Update the Escalation Gate table — no changes needed (escalation is about severity, not platform)
- [x] Verify code-review/SKILL.md still states it's a pure subagent (no Agent tool dispatch)

## Validation

```bash
# Verify platform detection section exists
grep "Platform Detection" packages/core/skills/code-review/SKILL.md
# Expected: found

# Verify caller protocol section exists  
grep "Caller Protocol" packages/core/skills/code-review/SKILL.md
# Expected: found

# Verify still claims subagent role
grep -i "subagent" packages/core/skills/code-review/SKILL.md
# Expected: found
```

## Success Criteria

- [x] Platform detection logic documented in SKILL.md
- [x] Category table split into cross-cutting + platform
- [x] Caller protocol documented
- [x] Subagent constraint preserved (no Agent tool dispatch from code-reviewer)
- [x] File under 200 lines (198 lines)
