# Bug Fixing Workflow

## Trigger
User reports a bug or issue.

## Steps

### 1. Code Search
**Command**: `/scout [search query]`
**Agent**: Explore agent
**Output**: List of relevant files

The scout agent:
- Searches codebase for related files
- Uses grep and glob patterns
- Prioritizes files by relevance
- Provides context snippets

### 2. Investigation
**Command**: `/debug [issue description]`
**Agent**: epost-debugger (enhanced)
**Output**: Root cause analysis with file locations

The debugger agent:
- Uses scout results for file context
- Gathers debug info (logs, errors, stack traces)
- Reproduces the issue (uses psql, gh, docs-seeker)
- Identifies root cause
- Suggests targeted fix

### 3. Fix Implementation
**Agent**: epost-fullstack-developer (enhanced)
**Output**: Fixed code with regression test

The implementer agent:
- Applies the fix
- Writes regression test
- Updates related docs

### 4. Verification
**Command**: `/test`
**Agent**: epost-tester (enhanced)
**Output**: Test results including regression tests

The tester agent:
- Runs full test suite
- Validates regression tests pass
- Checks fix doesn't introduce new failures

### 5. Code Review
**Command**: `/review`
**Agent**: epost-code-reviewer (enhanced)
**Output**: Fix quality verification

The reviewer agent:
- Verifies fix correctness
- Checks for edge cases
- Validates test coverage

### 6. Commit
**Command**: `/git-commit`
**Agent**: epost-git-manager
**Output**: Commit with `fix:` type

## Flow Diagram
```mermaid
graph LR
    A[Bug Report] --> B[/scout command]
    B --> C[Explore agent]
    C --> D[Relevant files found]
    D --> E[/debug command]
    E --> F[epost-debugger]
    F --> G[Root cause identified]
    G --> H[epost-fullstack-developer]
    H --> I[/test command]
    I --> J[epost-tester]
    J --> K[Tests pass?]
    K -->|No| H
    K -->|Yes| L[/review command]
    L --> M[epost-code-reviewer]
    M --> N[/git-commit command]
    N --> O[epost-git-manager]
    O --> P[Fixed and committed]
```

## Bug Categories

### Simple Bugs (use /epost:fix with short description)
- Typos
- Missing imports
- Simple logic errors
- Configuration issues

### Complex Bugs (use /epost:fix with detailed description)
- Race conditions
- Memory leaks
- Performance issues
- Architecture problems
- Security vulnerabilities

## Estimated Time
- Simple bug: 2-5 minutes
- Complex bug: 15-45 minutes
