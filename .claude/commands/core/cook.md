---
title: Cook Command
description: ⭑.ᐟ Implement features from plans or descriptions
agent: epost-implementer
argument-hint: ✨ [feature description or path/to/plan.md]
---

# Cook Command

Implement features - the main development command.

## Usage

```
/cook [feature description]
/cook plans/[plan-file].md
```

## Your Process

### If plan file provided:

1. Read the plan
2. Implement precisely
3. Write tests
4. Update docs

### If only description:

1. Ask: should I create a plan first?
2. If yes: create plan, then implement
3. If no: implement directly

## Implementation Steps

1. Validate file ownership (if plan provided)
2. Check phase dependencies are complete
3. Install dependencies (if needed)
4. Create files in order (follow plan sequencing)
5. Modify existing files (only owned files)
6. Write comprehensive tests
7. Update documentation
8. Verify compilation and functionality

## Rules

- Follow plans exactly when provided
- Always write tests for new code
- Update relevant docs
- Report progress per file

## Completion

Report:

- Files created: [count]
- Files modified: [count]
- Tests written: [count]
- How to test
- Any issues
