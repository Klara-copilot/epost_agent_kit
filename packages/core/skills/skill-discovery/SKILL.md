---
name: skill-discovery
description: (ePost) Reference catalogue of available skills by platform and task type. Use when you need to identify which skills apply to a given platform or task signal.
user-invocable: false

metadata:
  agent-affinity: [epost-planner, epost-fullstack-developer, epost-debugger, epost-tester, epost-code-reviewer, epost-project-manager]
  keywords: [platform, discovery, skills, catalogue]
  platforms: [all]
  triggers: []
---

# Skill Discovery

Reference catalogue of skills by platform and task type.

## Platform Signals

| Signal | Skills |
|--------|--------|
| `.swift`, iOS, Swift, SwiftUI | `ios-development`, `ios-ui-lib` |
| `.kt/.kts`, Android, Kotlin, Compose | `android-development`, `android-ui-lib` |
| `.tsx/.ts/.jsx/.scss`, React, Next.js, web | `web-frontend`, `web-nextjs` |
| `.java` + `pom.xml`, Java EE, WildFly, backend | `backend-javaee`, `backend-databases` |
| `epost-agent-kit-cli/` path, `src/domains/`, CLI | `kit` (load references/cli.md) |
| Figma, design tokens, klara, UI library | `figma`, `design-tokens`, `ui-lib-dev` |

Multiple platforms detected: ask user (max 1 question). If 80%+ files match one platform, use that.

## Task-Type Signals

| Task type | Skills to consider |
|-----------|-------------------|
| Bug, error, crash, stack trace | `debug`, `error-recovery` |
| Documentation, spec, RFC | `docs`, `knowledge` |
| Security concern, OWASP, vulnerability | `security` |
| Test writing, TDD, coverage | `test`, `tdd` |
| Git, commit, PR, ship | `git` |
| Design, UI, components, Figma pipeline | `figma`, `design-tokens`, `ui-lib-dev` |
| A11y, accessibility, WCAG, VoiceOver | `a11y` + platform-a11y variant |
| B2B module, inbox, monitoring, composer | `domain-b2b` |

## A11y Variants

| Platform | Skills |
|----------|--------|
| iOS | `a11y`, `ios-a11y` |
| Android | `a11y`, `android-a11y` |
| Web | `a11y`, `web-a11y` |
