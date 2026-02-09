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

## Structured Review Cycle (Max 3 Iterations)

**Iteration Flow:**

1. **Analyze & Report** (Cycle X/3)
   - Categorize findings: Critical, High, Medium, Low
   - Display clear, actionable findings
   - Show severity labels (BLOCKING, SHOULD FIX, SUGGESTIONS, INFORMATIONAL)

2. **User Decision Gate**
   Present options via AskUserQuestion:
   - "Fix critical issues" → Implement critical fixes, re-run tests, re-review
   - "Fix all issues" → Implement all findings, re-run tests, re-review
   - "Approve as-is" → Proceed to commit (bypass remaining cycles)
   - "Abort" → Stop workflow immediately

3. **Re-review After Fixes**
   - Run tests to verify fixes
   - Perform incremental review on modified areas
   - Compare with previous cycle findings
   - Increment cycle count

4. **Final Approval**
   - After 3 cycles: require explicit user approval
   - Cannot proceed without approval or abort decision

## Output

- Code quality assessment
- Security findings (if any)
- Performance recommendations
- Coverage analysis
- Plan verification (if applicable)
- Approved for merge or improvements needed
