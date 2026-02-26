---
title: epost
description: (ePost) Smart hub — single entry point that routes to the right command via intent detection
argument-hint: [what you want to do, or leave blank for discovery menu]
---

# Smart Hub — `/epost`

The single intelligent entry point to the epost agent ecosystem. Detects intent from natural language and routes to the appropriate command/agent.

## Usage

```
/epost                          → Show discovery menu (help)
/epost fix the login timeout    → Routes to /fix:fast or /fix:deep
/epost plan a notification system → Routes to /plan:fast or /plan:deep
/epost review my changes        → Routes to /review:code
/epost cook the auth feature    → Routes to /cook:fast
```

## Intent Detection

Analyze `$ARGUMENTS` and route based on intent keywords:

| Intent Keywords | Routes To | Agent |
|----------------|-----------|-------|
| plan, design, architect | `/plan:fast` or `/plan:deep` (based on complexity) | epost-architect |
| cook, implement, build, create | `/cook:fast` or `/cook:parallel` | epost-implementer |
| fix, debug, error, crash, broken | `/fix:fast` or `/fix:deep` | epost-debugger |
| test, coverage, validate | Platform test command | epost-tester |
| review, check, audit | `/review:code` | epost-reviewer |
| commit, push, pr, git | `/git:commit`, `/git:push`, or `/git:pr` | epost-git-manager |
| docs, document, write docs | `/docs:init` or `/docs:update` | epost-documenter |
| scout, search, find, explore | Spawn epost-scout | epost-scout |
| ask, research, what is, how does | Spawn epost-researcher | epost-researcher |
| brainstorm, think, evaluate, compare | Spawn epost-brainstormer | epost-brainstormer |
| guide, help me, how do I, wizard | Show discovery menu or spawn epost-guide | epost-guide |
| a11y, accessibility | `/a11y:review` | epost-a11y-specialist |
| convert, prototype, migrate | `/web:convert` | epost-web-developer |
| bootstrap, init, scaffold | `/bootstrap:fast` or `/bootstrap:parallel` | epost-implementer |

### Platform Prefix Detection

If `$ARGUMENTS` starts with a platform name, route to platform-specific commands:

| Prefix | Routes To |
|--------|-----------|
| `ios ...` | `/ios:cook`, `/ios:test`, `/ios:debug` based on intent |
| `android ...` | `/android:cook`, `/android:test`, `/android:debug` based on intent |
| `web ...` | `/web:cook`, `/web:test`, `/web:debug` based on intent |
| `backend ...` | `/backend:cook`, `/backend:test`, `/backend:debug` based on intent |

### Complexity Scoring

For plan/fix intents, estimate complexity to choose variant:

- **Simple** (score 1): Single file, clear fix, known pattern → fast variant
- **Moderate** (score 2-3): Multiple files, some unknowns → fast or deep
- **Complex** (score 4-5): Multi-module, research needed → deep variant

## Discovery Menu

When invoked with no arguments (`/epost`), display this menu:

```
## What do you want to do?

| Action | Command |
|--------|---------|
| Build a feature | `/epost build ...` or `/cook:fast` |
| Fix an issue | `/epost fix ...` or `/fix:fast` |
| Plan something | `/epost plan ...` or `/plan:fast` |
| Review code | `/epost review` or `/review:code` |
| Run tests | `/epost test` or platform test command |
| Git operations | `/git:commit`, `/git:push`, `/git:pr` |
| Documentation | `/docs:init`, `/docs:update` |
| Explore codebase | `/epost scout ...` |
| Ask a question | `/epost ask ...` |
| Brainstorm approaches | `/epost brainstorm ...` |
| Interactive wizard | `/epost guide` |
| Accessibility review | `/a11y:review` |

### Platform Commands
| iOS | Android | Web | Backend |
|-----|---------|-----|---------|
| `/ios:cook` | `/android:cook` | `/web:cook` | `/backend:cook` |
| `/ios:test` | `/android:test` | `/web:test` | `/backend:test` |
| `/ios:debug` | `/android:debug` | `/web:debug` | `/backend:debug` |

### Advanced
| Fix Variants | Plan Variants | Build Variants |
|-------------|---------------|----------------|
| `/fix:fast` | `/plan:fast` | `/cook:fast` |
| `/fix:deep` | `/plan:deep` | `/cook:parallel` |
| `/fix:ci` | `/plan:parallel` | `/bootstrap:fast` |
| `/fix:test` | `/plan:validate` | `/bootstrap:parallel` |
| `/fix:types` | | |
| `/fix:ui` | | |
| `/fix:logs` | | |
```

## Routing Process

1. **Parse arguments** — Extract intent keywords and platform prefix
2. **Detect platform** — Check for explicit prefix or infer from context
3. **Classify intent** — Match keywords to intent category
4. **Score complexity** — Estimate task complexity for variant selection
5. **Route** — Invoke the matched command with remaining arguments
6. **Report** — Show user which command was selected and why

## Rules

- If no clear intent detected → show discovery menu
- If ambiguous between two intents → ask user to clarify (max 1 question)
- Always show the user which command you're routing to before executing
- Prefer fast variants unless complexity clearly warrants deep
