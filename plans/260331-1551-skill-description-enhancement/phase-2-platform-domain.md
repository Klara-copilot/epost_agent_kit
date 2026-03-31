---
phase: 2
title: "Platform + Domain + A11y + Design skill descriptions"
effort: 1h
depends: [1]
---

# Phase 2: Platform + Domain + A11y + Design Skill Descriptions

## Context Links
- [Plan](./plan.md)
- `packages/a11y/skills/*/SKILL.md` — 4 skills
- `packages/platform-web/skills/*/SKILL.md` — 8 skills
- `packages/platform-ios/skills/*/SKILL.md` — 5 skills
- `packages/platform-android/skills/*/SKILL.md` — 2 skills
- `packages/platform-backend/skills/*/SKILL.md` — 2 skills
- `packages/design-system/skills/*/SKILL.md` — 4 skills
- `packages/domains/skills/*/SKILL.md` — 2 skills

## Overview
- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Prepend capability summary to all platform, domain, a11y, and design-system skill descriptions

## Files to Modify

### packages/a11y/skills/ (4 skills)

| Skill | Capability Summary to Prepend |
|-------|-------------------------------|
| `a11y/SKILL.md` | Enforces cross-platform WCAG 2.1 AA compliance with POUR-based scoring and remediation workflows. |
| `android-a11y/SKILL.md` | Diagnoses and fixes Android accessibility issues across Compose and Views/XML. |
| `ios-a11y/SKILL.md` | Diagnoses and fixes iOS accessibility issues across UIKit and SwiftUI. |
| `web-a11y/SKILL.md` | Diagnoses and fixes web accessibility issues — ARIA, keyboard nav, focus management, screen readers. |

### packages/platform-web/skills/ (8 skills)

| Skill | Capability Summary to Prepend |
|-------|-------------------------------|
| `web-api-routes/SKILL.md` | Implements API endpoints, server actions, and FetchBuilder HTTP client patterns. |
| `web-auth/SKILL.md` | Configures NextAuth + Keycloak authentication, session management, and feature flags. |
| `web-frontend/SKILL.md` | Builds React components, hooks, and Redux Toolkit state management patterns. |
| `web-i18n/SKILL.md` | Configures next-intl, manages translations, and handles locale routing. |
| `web-modules/SKILL.md` | Wires B2B module screens — binds APIs, stores, and routes into the module shell. |
| `web-nextjs/SKILL.md` | Implements Next.js 14 App Router patterns — Server Components, Server Actions, layouts, and middleware. |
| `web-testing/SKILL.md` | Configures and writes Jest + RTL unit tests and Playwright E2E tests. |
| `web-ui-lib/SKILL.md` | Provides klara-theme component APIs, props, variants, spacing tokens, and theme patterns. |

### packages/platform-ios/skills/ (5 skills)

| Skill | Capability Summary to Prepend |
|-------|-------------------------------|
| `asana-muji/SKILL.md` | *(skip — already has capability summary)* |
| `ios-development/SKILL.md` | Builds SwiftUI/UIKit views, manages Xcode builds, and debugs iOS crashes. |
| `ios-rag/SKILL.md` | Searches the iOS Swift codebase via vector search for existing patterns and implementations. |
| `ios-ui-lib/SKILL.md` | Provides iOS theme SwiftUI component APIs, design tokens, and platform token mappings. |
| `simulator/SKILL.md` | Manages iOS simulators — list, boot, open, and launch apps. |
| `theme-color-system/SKILL.md` | *(skip — already has capability summary)* |

### packages/platform-android/skills/ (2 skills)

| Skill | Capability Summary to Prepend |
|-------|-------------------------------|
| `android-development/SKILL.md` | Builds Kotlin/Compose screens, manages Gradle builds, and debugs Android crashes. |
| `android-ui-lib/SKILL.md` | Provides Android theme Compose component APIs, design tokens, and Material theme mappings. |

### packages/platform-backend/skills/ (2 skills)

| Skill | Capability Summary to Prepend |
|-------|-------------------------------|
| `backend-databases/SKILL.md` | Provides PostgreSQL and MongoDB persistence patterns for the epost backend. |
| `backend-javaee/SKILL.md` | Implements Jakarta EE patterns — JAX-RS, CDI/EJB, JPA/Hibernate, WildFly deployment. |

### packages/design-system/skills/ (4 skills)

| Skill | Capability Summary to Prepend |
|-------|-------------------------------|
| `design-tokens/SKILL.md` | Maps Vien 2.0 design tokens to platform-native formats across web, iOS, and Android. |
| `figma/SKILL.md` | Extracts Figma data, maps design tokens to code, and compares implementations against designs. |
| `launchpad/SKILL.md` | Builds bold, craft-first landing pages and promotional sites. |
| `ui-lib-dev/SKILL.md` | Manages the Figma-to-code UI library pipeline — plan, implement, audit, fix, document. |

### packages/domains/skills/ (2 skills)

| Skill | Capability Summary to Prepend |
|-------|-------------------------------|
| `domain-b2b/SKILL.md` | Provides B2B module context — Inbox, Monitoring, Composer, Smart Send, and related domains. |
| `domain-b2c/SKILL.md` | Provides consumer app context — B2C mail, documents, notifications on iOS and Android. |

## Implementation Steps

1. **For each skill in the tables above** (skip marked "skip"):
   - Read current `description:` from `packages/{pkg}/skills/{name}/SKILL.md`
   - Prepend capability summary
   - Edit `description:` field in SKILL.md frontmatter
   - Verify total length < 1024 chars

2. **Regenerate skill-index.json**:
   - Run `node .claude/scripts/generate-skill-index.cjs`

3. **Mirror to .claude/skills/**:
   - Copy updated SKILL.md files to `.claude/skills/` equivalents

## Todo List

- [ ] Update 4 a11y skill descriptions
- [ ] Update 8 web skill descriptions
- [ ] Update 3 iOS skill descriptions (skip 2 already done)
- [ ] Update 2 Android skill descriptions
- [ ] Update 2 backend skill descriptions
- [ ] Update 4 design-system skill descriptions
- [ ] Update 2 domain skill descriptions
- [ ] Regenerate skill-index.json
- [ ] Mirror to .claude/skills/

## Success Criteria

- All ~25 skills (minus 2 skips) have capability + trigger format
- skill-index.json consistent
- No description > 1024 chars

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Description > 1024 chars | Low | Shorten capability sentence |
| asana-muji/theme-color-system already correct | None | Skip — already flagged |

## Security Considerations
- None — metadata-only changes

## Next Steps
- Run trigger evals to validate no regressions
