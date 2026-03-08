# Workflow: Code Review

Scout-first review pattern. Edge-case detection before quality audit.

## Steps

### 1. Scout Phase
**Agent**: epost-code-reviewer (uses Explore subagent internally)

**Scope resolution (always first):**
- If user provided explicit file paths, component name, or `--files` list → use those directly; **skip git diff**
- Otherwise → scan changed files via `git diff`

- Search for related code across codebase
- Map dependencies that might be affected
- Identify patterns that need cross-checking

### 2. Quality Audit

**Klara-theme feature module (20+ files or multi-subdir)**:
- Use hybrid sequential audit (not parallel)
- Dispatch muji FIRST via Template A+, wait for completion
- Read muji report, then run SEC/PERF/TS with dedup
- See `code-review/SKILL.md` Dispatch Protocol for full 7-step sequence

Review changed code for:

| Category | Checks |
|---|---|
| **Security** | Input validation, SQL injection, XSS, CSRF, secrets exposure |
| **Performance** | N+1 queries, unnecessary re-renders, missing indexes, caching |
| **Correctness** | Edge cases, null handling, error paths, race conditions |
| **Standards** | Naming conventions, file structure, import patterns |
| **Tests** | Coverage of new paths, edge cases tested, no fake data |

**Example**: Reviews PR → finds missing input validation on API endpoint → potential SQL injection in raw query → N+1 performance issue in user list → password stored in plain text logs → suggests extracting duplicate code to utility function

### 3. Feedback Format

```markdown
## Review Summary
- X issues found (Y critical, Z suggestions)

### Critical
1. [file:line] Issue description + fix suggestion

### Suggestions
1. [file:line] Improvement idea
```

### 4. Receiving Review (Addressing Feedback)

When YOUR code is being reviewed:
1. Read all feedback before responding
2. Fix critical issues immediately
3. Discuss suggestions — accept or explain why not
4. Re-request review after fixes

### 5. Knowledge Capture

After review, if new patterns or conventions identified:
- Record as CONV entry in `docs/` via `knowledge-capture`
- Update code standards if convention is project-wide
