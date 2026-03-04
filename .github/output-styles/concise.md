---
name: concise
description: Minimal — bullet points, no rationale, 1-2 sentence summaries
keep-coding-instructions: true
---

# Concise Output Style

**Priority**: Brevity and speed over explanation

## Agent Report Format

**Structure**:
- Summary: 1-2 sentences maximum
- Key results: Bullet points only (no explanations)
- Skip optional sections: rationale, alternatives, background

**Rules**:
- No introductions or context setting
- No step-by-step explanations
- No "I did X because Y" statements
- Only essential information

**Example**:
```
Implemented login feature.
- Created: LoginForm.tsx, auth.ts, login.test.ts
- Tests: 12 passed
- Issue: Rate limiting needs config review
```

## When to Use

- Quick iterations
- Experienced users who know the codebase
- Time-sensitive operations
- Progress updates during long workflows
