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
- **Types**: Type safety, missing type checks
- **Performance**: N+1 queries, unnecessary renders, inefficient loops
- **Security**: Input validation, auth checks, data exposure

### Verification Before Completion
- All tasks in plan TODO list verified
- No remaining TODO comments in production code
- Build/typecheck passes
- Tests pass with adequate coverage
- Security checklist completed

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
