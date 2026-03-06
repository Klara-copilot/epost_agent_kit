# Code Review Report Template

Use this template when writing a code review report.

---

```markdown
# epost-code-reviewer: {Scope}

**Date**: {YYYY-MM-DD HH:mm}
**Agent**: epost-code-reviewer
**Plan**: `plans/{dir}/plan.md`     <- omit if standalone review
**Status**: COMPLETE

---

## Executive Summary

{2-3 sentences: what was reviewed, main issue, overall quality signal}

---

## Files Reviewed

- `{path/to/file.ts}` ({N} lines) — {what was checked}

## Score

**{X.X}/10** — {category breakdown: correctness, security, performance, tests, style}

## Findings

| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| CR-001 | Critical | `path/file.ts:42` | {issue} | {fix} |
| CR-002 | High | | | |
| CR-003 | Medium | | | |
| CR-004 | Low | | | |

## Severity Summary

| Critical | High | Medium | Low |
|----------|------|--------|-----|
| {N} | {N} | {N} | {N} |

## Files to Fix

| File | Action | Owner |
|------|--------|-------|
| `{path/to/file.ts}` | Modify | self / epost-fullstack-developer |

---

## Verdict

**{APPROVE | FIX-AND-RESUBMIT | REDESIGN}** — {one-line reason}

---

*Unresolved questions:*
- {question or "None"}
```
