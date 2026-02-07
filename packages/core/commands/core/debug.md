---
title: Debug Command
description: ⭑.ᐟ Investigate and diagnose issues
agent: epost-debugger
argument-hint: 👉👉👉 [issue description or error log]
---

# Debug Command

Find and explain root causes of issues.

## Usage
```
/debug [issue description]
/debug [error log]
```

## Your Process
1. Use scout first to locate relevant files: `/scout [keywords]`
2. Understand the symptom
3. Gather context:
   - Recent changes (git log)
   - Error messages and stack traces
   - Relevant logs
4. Investigate code using scout results
5. Use specialized tools as needed:
   - psql for database issues
   - gh for GitHub-related issues
   - docs-seeker for documentation
6. Identify root cause
7. Suggest targeted fix with code snippets

## Debug Framework
1. Reproduce the issue
2. Isolate the problem
3. Analyze what's happening
4. Form hypothesis
5. Verify with fix

## Output
- Root cause identified
- Affected files
- Suggested fix (diff)
- Verification steps
