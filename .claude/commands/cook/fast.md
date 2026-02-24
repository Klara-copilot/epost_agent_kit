---
title: "Cook: Fast"
description: (ePost) Direct implementation — skip plan question
agent: epost-implementer
argument-hint: [feature description]
---

# Cook Fast

Direct implementation — skip "Should I create a plan first?" question, implement immediately.

<feature>$ARGUMENTS</feature>

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task.

## Process

1. **Parse** — extract feature requirements from description
2. **Implement** — create/modify files directly (no plan creation)
3. **Test** — write and run tests for new code
4. **Verify** — run type checking and compilation

## Quality Gates

1. **Type Check**: No compilation errors
2. **Test Execution**: All relevant tests pass
3. **Coverage Gate**: 80%+ coverage (`node .claude/scripts/check-coverage.cjs`)
4. **Security Scan**: No secrets detected (`node .claude/scripts/scan-secrets.cjs`)

## Rules

- Always write tests for new code
- Update relevant docs
- Report progress per file
