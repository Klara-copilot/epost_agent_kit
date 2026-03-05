---
title: "Audit UI-Lib Component Skill (Cross-Platform)"
description: "Muji senior reviewer skill for auditing new member UI component code across web, iOS, Android"
status: draft
priority: P1
effort: 6h
branch: master
tags: [skill, code-review, audit, ui-lib, muji, cross-platform, web, ios, android]
created: 2026-03-04
---

# Audit UI-Lib Component Skill (Cross-Platform)

## Overview

Create a `audit-ui-component` skill that lets epost-muji (or any reviewer) audit a UI library component implementation. Persona: senior Muji developer reviewing new member's code for quality, platform consistency, performance, security, and design token compliance.

## Current State

- `web-ui-lib-dev` has `references/audit-ui.md` -- web-only, klara-theme specific, tied to Figma pipeline
- `code-review` skill -- generic code review, not UI-component-aware
- `review-code` skill -- edge-case discovery + parallel verification, not component-audit
- iOS/Android ui-lib skills have NO audit capability
- No cross-platform component audit exists

## Target State

- New skill `audit-ui-component` in `packages/design-system/skills/`
- Platform-specific checklist references for web, iOS, Android
- Shared audit-report JSON schema across platforms
- Configurable: run for one platform or all three
- No hardcoded paths/tools -- platform config via registry pattern
- Integrates with existing `code-review` and `web-ui-lib-dev` skills

## Platform Scope
- [x] Web (Next.js/React -- klara-theme)
- [x] iOS (Swift/SwiftUI -- EpostThemeUI)
- [x] Android (Kotlin/Compose -- epost-theme-compose)

## Implementation Phases

1. [Phase 01: Core Skill + Schema](./phase-01-core-skill-schema.md)
2. [Phase 02: Platform Checklists](./phase-02-platform-checklists.md)
3. [Phase 03: Wire to Skill Index + Connections](./phase-03-wire-skill-index.md)

## Key Dependencies

- Existing: `code-review`, `web-ui-lib-dev`, `web-ui-lib`, `ios-ui-lib`, `android-ui-lib`
- Existing: `subagent-driven-development/references/code-quality-reviewer-prompt.md` (pattern ref)

## Success Criteria

- [ ] `audit-ui-component` skill exists with SKILL.md + references
- [ ] Platform checklists cover tokens, patterns, performance, security per platform
- [ ] Audit report JSON schema is shared, platform field distinguishes
- [ ] Skill is registered in skill-index.json with correct connections
- [ ] No hardcoded values -- all platform specifics in checklist references
- [ ] Can audit single platform or all three in one pass

## Risk Assessment

- Checklist staleness: platform conventions evolve. Mitigate with staleness warnings + RAG cross-check step.
- Scope creep: keep audit focused on component code, not full app architecture.
