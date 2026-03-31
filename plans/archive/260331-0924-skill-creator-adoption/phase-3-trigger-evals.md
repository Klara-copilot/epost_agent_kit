---
phase: 3
title: "Trigger Evals for Top 5 Skills"
effort: 0.5h
depends: [1]
---

# Phase 3: Trigger Evals for Top 5 Skills

## Context Links
- [Plan](./plan.md)
- [Phase 1](./phase-1-eval-infrastructure.md) — eval-schema.md defines trigger-evals.json format
- `packages/core/skills/skill-discovery/SKILL.md` — skill routing logic

## Overview
- Priority: P2
- Status: Pending
- Effort: 0.5h
- Description: Write 20 trigger eval queries per skill (10 should-trigger, 10 should-not) for plan, debug, code-review, security, docs

## Requirements
### Functional
- 5 skills get `evals/trigger-evals.json`
- Each file has 20 queries: 10 that should trigger the skill, 10 that should NOT
- Queries include edge cases and ambiguous prompts

### Non-Functional
- Queries should be natural language (how real users talk)
- Should-not queries must include plausible false positives

## Related Code Files
### Files to Create
- `packages/core/skills/plan/evals/trigger-evals.json`
- `packages/core/skills/debug/evals/trigger-evals.json`
- `packages/core/skills/code-review/evals/trigger-evals.json`
- `packages/core/skills/security/evals/trigger-evals.json`
- `packages/core/skills/docs/evals/trigger-evals.json`

### Files to Modify
- None

## Implementation Steps

1. **Plan trigger evals**
   - Should-trigger (10): "plan the auth flow", "how should we architect X", "create a roadmap", "design the API", "what's the approach for", "spec out the migration", "break this down into phases", "let's plan the refactor", "create an implementation plan", "what steps do we need"
   - Should-NOT (10): "fix the auth flow" (→debug), "review my plan" (→review), "implement the plan" (→cook), "what is a plan" (→conversational), "document the plan" (→docs), "test the plan output" (→test), "commit the plan" (→git), "is this plan good" (→review), "research how to plan" (→research), "delete the old plan" (→git)

2. **Debug trigger evals**
   - Should-trigger (10): "this crashes", "why does X fail", "trace this error", "diagnose the issue", "it's not working", "getting TypeError", "stack trace shows", "performance is slow", "memory leak in", "infinite loop detected"
   - Should-NOT (10): "add error handling" (→build), "test the error path" (→test), "document the bug" (→docs), "review error handling code" (→review), "plan how to fix" (→plan), "commit the fix" (→git), "what is a TypeError" (→research), "create an error component" (→build), "remove the debug logs" (→build), "audit for errors" (→audit)

3. **Code-review trigger evals**
   - Should-trigger (10): "review this code", "check my PR", "is this implementation good", "look at this before merge", "quality check", "any issues with this", "suggest improvements", "code audit this file", "review the changes", "check for anti-patterns"
   - Should-NOT (10): "fix this code" (→fix), "write tests for this" (→test), "refactor this" (→build), "document this function" (→docs), "plan the review process" (→plan), "commit after review" (→git), "who reviewed this" (→conversational), "debug the reviewer" (→debug), "research review best practices" (→research), "audit accessibility" (→a11y)

4. **Security trigger evals**
   - Should-trigger (10): "check for vulnerabilities", "security audit", "STRIDE analysis", "OWASP check", "is this safe", "injection risk", "auth bypass possible", "XSS in this component", "secrets in code", "permission escalation"
   - Should-NOT (10): "add authentication" (→build), "fix the security bug" (→fix), "test security" (→test), "plan security hardening" (→plan), "document security policy" (→docs), "review code quality" (→review), "what is CORS" (→research), "commit security fix" (→git), "audit accessibility" (→a11y), "debug auth flow" (→debug)

5. **Docs trigger evals**
   - Should-trigger (10): "write docs for this", "update the README", "document this API", "add JSDoc", "write a spec", "init docs", "reorganize documentation", "add component docs", "write a guide for", "document the architecture"
   - Should-NOT (10): "read the docs" (→conversational), "fix typo in docs" (→fix), "review the docs" (→review), "plan documentation" (→plan), "test doc generation" (→test), "commit docs" (→git), "research doc tools" (→research), "debug doc build" (→debug), "what does this doc mean" (→conversational), "audit doc quality" (→audit)

## Todo List
- [ ] Create plan/evals/trigger-evals.json
- [ ] Create debug/evals/trigger-evals.json
- [ ] Create code-review/evals/trigger-evals.json
- [ ] Create security/evals/trigger-evals.json
- [ ] Create docs/evals/trigger-evals.json

## Success Criteria
- 5 files, each with exactly 20 queries (10 should / 10 should-not)
- Queries are diverse, natural-sounding, include edge cases
- Each should-not query has a reason annotation pointing to the correct routing target

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Trigger queries too obvious | Low | Include 3+ ambiguous/borderline cases per skill |
| False positive patterns not realistic | Med | Base on actual observed mis-routes from journal entries |

## Security Considerations
- None — data files only

## Next Steps
- Phase 4 registers skill-creator and updates indexes
