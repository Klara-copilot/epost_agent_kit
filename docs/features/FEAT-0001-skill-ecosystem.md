# Skill Ecosystem: 67 Skills Across 4 Packages

**Status**: Current as of v2.0.0 (2026-03-05)

## Overview

67 skills organized into 4 packages. Each skill provides patterns, constraints, and guidelines. Skills are passive knowledge + activation triggers.

## Package Organization

### core (35+ skills)
Universal, cross-platform skills. Always loaded for core agents.

**Core Operations**
- `core` — Operational boundaries, decision authority, environment safety
- `problem-solving` — Systematic debugging protocol
- `error-recovery` — Resilience patterns: retry, timeout, circuit breaker
- `sequential-thinking` — Step-by-step reasoning for complex problems
- `knowledge-capture` — How to document learned patterns
- `knowledge-retrieval` — Internal-first knowledge search (docs → RAG → skills → codebase → external)

**Development Workflow**
- `cook` — Build/implement features (auto-detects platform via skill-discovery)
- `fix` — Fix bugs/errors (routes to specialist via detection)
- `test` — Testing & coverage (platform-specific)
- `debug` — Debugging & tracing (platform-specific)
- `plan` — Architecture & design (with --fast/--deep flags)
- `bootstrap` — Scaffold new projects/modules
- `convert` — Prototype conversion & migration

**Code Quality**
- `code-review` — Code review standards + receiving-code-review sub-skill
- `auto-improvement` — Continuous optimization
- `review` — Review protocol (extends code-review)
- `scout` — Codebase analysis & metrics (--fast/--deep flags)
- `repomix` — Codebase compaction for analysis

**Documentation & Knowledge**
- `docs` — Documentation authoring standards
- `docs-seeker` — External documentation retrieval (Context7, WebSearch)
- `research` — Multi-source investigation
- `doc-coauthoring` — Collaborative doc writing

**Git & Version Control**
- `git` — Git workflow & best practices
- `subagent-driven-development` — Parent-child agent delegation patterns

**Platform-Specific**
- `backend-javaee` — Jakarta EE, WildFly, REST, CDI, ORM
- `backend-databases` — PostgreSQL, MongoDB, Hibernate
- `ios-development` — Swift 6, SwiftUI, XCTest
- `ios-rag` — iOS codebase RAG patterns
- `ios-ui-lib` — iOS theme components
- `android-development` — Kotlin, Jetpack Compose, MVVM, Hilt
- `android-ui-lib` — Android theme components
- `web-frontend` — React, Next.js, Tailwind
- `web-nextjs` — Next.js 14 App Router specifics
- `web-api-routes` — REST API patterns
- `web-auth` — Authentication & authorization
- `web-testing` — Jest, RTL, Playwright
- `web-modules` — Module architecture
- `web-i18n` — Internationalization
- `web-rag` — Web codebase RAG patterns
- `web-ui-lib` — Web theme components

**Infrastructure & Domains**
- `infra-docker` — Docker & containerization
- `infra-cloud` — GCP patterns & infrastructure
- `domain-b2b` — B2B modules (monitoring, inbox, communities, etc.)
- `domain-b2c` — B2C mobile patterns
- `data-store` — Agent persistent data convention
- `epost` — epost-specific patterns
- `get-started` — Onboarding protocol

**Utility**
- `simulator` — iOS/Android simulator management
- `skill-discovery` — Context-aware lazy skill loading

### a11y (8 skills)
Accessibility specialist skills (extends package).

**Base + Platform Variants**
- `a11y` — WCAG 2.1 AA foundation (POUR principles, scoring)
- `ios-a11y` — iOS VoiceOver, UIKit/SwiftUI accessibility
- `android-a11y` — Android TalkBack, Compose/Views accessibility
- `web-a11y` — Web ARIA, keyboard, semantic HTML

**Audit & Review**
- `audit` — Parent skill for audit workflows (--a11y, --close flags)
- (Integrated into audit via parent skill + flags)

### kit (9 skills)
Kit authoring skills for creating agents, skills, commands, hooks.

**Authoring**
- `kit` — Kit ecosystem reference
- `kit-agents` — Agent definitions, naming conventions
- `kit-agent-development` — Agent frontmatter, system prompts
- `kit-skill-development` — Skill authoring, CSO principles
- `kit-cli` — CLI development (cac framework, TypeScript)
- `kit-hooks` — Hook event types, I/O contracts
- `kit-verify` — Kit validation & health checks

### design-system (10 skills)
Design system & UI component development.

**Design Tokens & Variables**
- `web-figma` — Figma MCP patterns, design token extraction
- `web-figma-variables` — Vien 2.0 variable architecture (1,059 variables, 42 collections)

**Component Development**
- `web-ui-lib` — Web component catalog (React/Next.js)
- `web-ui-lib-dev` — klara-theme development pipeline
- `web-prototype` — Prototype to production conversion (style/token/component migration)

## Consolidation Patterns (Mar 2026)

### Flag-Based Variants
Skills now use **flags** instead of separate variant skills:

| Old Pattern | New Pattern | Skill | Flags |
|-------------|-------------|-------|-------|
| cook, cook-fast, cook-parallel | `cook` | cook | --fast, --parallel |
| plan, plan-fast, plan-deep, plan-parallel | `plan` | plan | --fast, --deep, --parallel |
| debug, debug-deep | `debug` | debug | --deep |
| scout, scout-fast, scout-deep | `scout` | scout | --fast, --deep |
| fix, fix-deep, fix-ui, fix-a11y, fix-ci | `fix` | fix | --deep, --ui, --a11y, --ci |

### Variant Content Location
Variant-specific patterns moved to `references/` subdirectory:
```
skills/cook/
├── SKILL.md                     # Main + flag documentation
├── references/
│   ├── cook-fast-patterns.md
│   └── cook-parallel-patterns.md
└── assets/
```

### A11y Workflow Integration
A11y uses specialized flag pattern:
- `audit --a11y` (instead of audit-a11y, audit-close-a11y)
- `fix --a11y` (instead of fix-a11y)
- `review --a11y` (instead of review-a11y)
- References in `a11y/skills/a11y/references/`

## Skill Discovery Protocol

### How Skills Load
1. Agent specifies `skills:` list in frontmatter
2. skill-index.json queried to resolve names → paths
3. SKILL.md files loaded into context
4. skill-discovery protocol adds contextual skills based on task signals

### Example: iOS Task
```
User: "Fix SwiftUI state bug"
    ↓
Platform Signal: ".swift" in diff
    ↓
skill-discovery loads: ios-development, ios-ui-lib, error-recovery
    ↓
Agent executes with iOS-specific patterns
```

### Discovery Signals

| Signal | Skills | Platforms |
|--------|--------|-----------|
| `.swift`, "iOS", "SwiftUI" | ios-development, ios-ui-lib, ios-rag | ios |
| `.kt/.kts`, "Android", "Kotlin", "Compose" | android-development, android-ui-lib | android |
| `.tsx/.ts`, "React", "Next.js", "web" | web-frontend, web-nextjs, web-testing, web-rag | web |
| `.java`, "Jakarta EE", "WildFly", "backend" | backend-javaee, backend-databases | backend |
| `epost-agent-kit-cli/` path, "kit cli" | kit-cli | cli |
| Figma, design tokens, klara | web-figma, web-ui-lib, web-ui-lib-dev | design |
| `.md`, "docs", "documentation" | docs, docs-seeker | all |
| a11y, WCAG, accessibility | a11y + platform-a11y variant | all |

## Skill Frontmatter Fields

### Required
```yaml
name: skill-name
description: "Trigger-only condition (use when...)"
```

### Optional
```yaml
user-invocable: true|false         # Hide from discovery if false
context: fork|inline               # Memory isolation model
agent: agent-name                  # Specific agent affinity
disable-model-invocation: true|false  # Block model from suggesting
extends: [parent-skill]            # Inheritance
requires: [dep-skill]              # Dependencies
keywords: [tag1, tag2]             # Search tags
```

### NO `version:` Field
- Versioning at package level (package.yaml)
- All skills in package share version

## Related Documentation

- [System Architecture](./architecture.md) — Package topology, delegation model
- [Agent Framework](./agent-framework.md) — Agent frontmatter, skill bindings
- [Package Structure](./package-structure.md) — Source file organization
- `packages/*/skills/skill-index.json` — Skill metadata registry
- `packages/*/skills/*/SKILL.md` — Individual skill files

## Quick Reference

### By Agent Affinity
- **epost-orchestrator**: core, problem-solving, sequential-thinking, skill-discovery
- **epost-implementer**: cook, fix, test, debug, bootstrap, platform-specific
- **epost-reviewer**: code-review, review, scout, auto-improvement
- **epost-debugger**: debug, problem-solving, sequential-thinking, error-recovery
- **epost-tester**: test, bootstrap, web-testing, platform-specific
- **epost-researcher**: research, docs-seeker, knowledge-retrieval
- **epost-documenter**: docs, docs-seeker, knowledge-capture
- **epost-git-manager**: git, subagent-driven-development
- **epost-a11y-specialist**: a11y + platform-a11y variants
- **epost-kit-designer**: kit, kit-agent-development, kit-skill-development, kit-cli
- **epost-muji**: web-figma, web-ui-lib, web-ui-lib-dev, web-prototype

### By Task Type
- **Implement**: cook, bootstrap, convert
- **Fix**: fix, error-recovery, debug
- **Plan**: plan, architect, sequential-thinking
- **Test**: test, scout
- **Review**: review, code-review
- **Document**: docs, knowledge-capture
- **Research**: research, docs-seeker, knowledge-retrieval
- **A11y**: a11y + platform variants

---

**Maintainer**: @than
**Last Updated**: 2026-03-05
**Version**: 2.0.0
**Total Skills**: 67 across 4 packages
