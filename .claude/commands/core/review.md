---
title: Review Command
description: ⭑.ᐟ Review code changes for quality, security, and performance
agent: epost-reviewer
argument-hint: ✨ [optional path/to/plan.md]
---

# Review Command

Comprehensive code review for quality assurance.

## Usage

```
/review
/review plans/[plan-file].md
```

## Your Process

1. Gather context:
   - Get staged and unstaged changes (git diff)
   - Read recent commits (git log)
   - If plan provided, verify TODO completion

2. Analyze code for:
   - Security vulnerabilities
   - Performance implications
   - Code quality and maintainability
   - Test coverage
   - Documentation adequacy

3. Verify against plan (if provided):
   - All implementation steps completed
   - File ownership respected
   - Success criteria met
   - Risk mitigation addressed

4. Generate comprehensive report

## Output

- Code quality assessment
- Security findings (if any)
- Performance recommendations
- Coverage analysis
- Plan verification (if applicable)
- Approved for merge or improvements needed
