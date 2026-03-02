---
name: code-review
description: Use when reviewing code, checking quality before commit, or auditing changed files for issues
tier: core

metadata:
  agent-affinity: [epost-reviewer, epost-implementer]
  keywords: [review, code-quality, security, performance, testing, verification]
  platforms: [all]
  triggers: ["/review", "code review", "review code"]
---

# Code Review Skill

## Purpose
Comprehensive code quality assessment and verification.

## When Active
User uses /review, asks for code review, or before committing code.

## Expertise

### Review Process
1. Read the plan file and understand requirements
2. Identify changed files via `git diff` or `git log`
3. Systematic review: structure, logic, types, performance, security
4. Categorize findings: Critical > High > Medium > Low
5. Update plan TODO status

### Systematic Review
- **Structure**: File organization, module boundaries
- **Logic**: Algorithm correctness, edge cases
- **State Machines**: For stateful components — all states have exits, error/timeout handled, transitions guarded, no implicit hidden states, concurrent mutations safe
- **Types**: Type safety, missing type checks
- **Performance**: N+1 queries, unnecessary renders, inefficient loops
- **Security**: Input validation, auth checks, data exposure

### Verification Before Completion

See `verification-before-completion` skill for the full gate protocol.

### Severity Classification
- **Critical**: Security vulnerabilities, data loss, breaking changes
- **High**: Performance issues, type safety violations, missing error handling
- **Medium**: Code smells, maintainability issues, documentation gaps
- **Low**: Style inconsistencies, minor optimizations

## Patterns

### Code Review Template
```markdown
# Code Review: [Feature]

## Summary
[Overall assessment]

## Critical Issues
- [Issue] - [Severity]

## Findings by Category
- Structure: [findings]
- Logic: [findings]
- Types: [findings]

## Recommendations
- [Action item]
- [Action item]

## Approval: [Approved/Needs Revision]
```

## Best Practices
- Review for intent first, details second
- Suggest improvements with examples
- Praise good patterns
- Balance strictness with pragmatism
- Check tests alongside code changes

Use `knowledge-capture` skill to persist learnings after this task.

## Sub-Skill Routing

When this skill is active and user intent matches a sub-skill, delegate:

| Intent | Sub-Skill | When |
|--------|-----------|------|
| Review code | `review-code` | `/review-code`, "review my code" |
| Review improvements | `review-improvements` | `/review-improvements`, improvement suggestions |
| Run tests | `test` | `/test`, "run tests", "check coverage" |
| Verify completion | `verification-before-completion` | Before claiming task done |
| Receive review | `receiving-code-review` | Processing feedback from reviewers |

### Related Skills
- `knowledge-base` — Knowledge storage format
- `knowledge-capture` — Post-task capture workflow
- `auto-improvement` — Convention violations auto-detected across sessions via metrics
