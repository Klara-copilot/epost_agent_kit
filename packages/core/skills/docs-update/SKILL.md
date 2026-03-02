---
name: docs-update
description: "(ePost) Update existing documentation"
user-invocable: true
context: fork
agent: epost-documenter
metadata:
  argument-hint: "[what to update]"
---

# Docs Update Command

Update existing documentation to reflect code changes.

## Usage

```
/docs-update [what needs updating]"
```

## Examples

- `/docs-update API changes for user service`
- `/docs-update Add new component examples`
- `/docs-update Update installation instructions`

## Process

1. Identify what changed in code
2. Find relevant documentation
3. Update docs to match
4. Verify examples still work
5. Check for consistency

## Output

- Updated documentation files
- New or updated examples
- Consistency checks
