---
phase: 1
title: "Rewrite routing for natural language"
effort: 1h
depends: []
---

# Phase 1: Rewrite Routing for Natural Language

## Problem

Current intent table uses rigid signal words. "cook, implement, build" maps to Build, but "make this better" or "I want to add a button" don't match cleanly.

## Changes

### File: `packages/core/CLAUDE.snippet.md`

### 1. Replace rigid intent table with intent categories + fuzzy examples

**Before** (17 rows, exact keywords):
```
| Build | cook, implement, build, create, add, make, continue | Spawn epost-fullstack-developer |
```

**After** (grouped by intent family, with natural language examples):

```
| Intent | Natural prompts | Agent |
|--------|----------------|-------|
| Build / Create | "add a button", "implement login", "make X work", "continue the plan", "I need a new..." | epost-fullstack-developer |
| Fix / Debug | "something is broken", "this crashes", "why does X happen", "it's not working" | epost-debugger |
| Plan / Design | "how should we build X", "I want to redesign...", "let's plan", "what's the approach" | epost-planner |
| Research | "how does X work", "what are best practices for", "compare A vs B", "investigate" | epost-researcher |
| Review | "check my code", "is this good", "review before merge", "audit this" | epost-code-reviewer |
| Test | "add tests", "is this covered", "validate this works" | epost-tester |
| Docs | "document this", "update the docs", "write a spec" | epost-docs-manager |
| Git | "commit", "push", "create a PR", "ship it" | /git command |
| Onboard | "what is this project", "I'm new", "get started" | /get-started |
```

### 2. Add fuzzy matching rule

After the table, add:
```
**Fuzzy matching**: If no exact signal word, classify by VERB TYPE:
- Creation verbs (add, make, create, build, set up) → Build
- Problem verbs (broken, wrong, failing, slow, crash) → Fix/Debug
- Question verbs (how, why, what, should, compare) → Research or Plan
- Quality verbs (check, review, improve, clean up, refactor) → Review or Simplify
- When still ambiguous: infer from git context (staged files → Review, active plan → Build, error in prompt → Fix)
```

### 3. Collapse rarely-used intents into footnotes

Move these to a "Less common intents" collapsed section or remove:
- Journal, MCP, Design, Convert, Scaffold (keep them but compact)

## Validation

- Prompt "something is broken in the login page" → routes to epost-debugger without asking
- Prompt "make the sidebar responsive" → routes to epost-fullstack-developer
- Prompt "how should we handle authentication" → routes to epost-planner or epost-researcher
- Prompt "is this code okay" → routes to epost-code-reviewer
