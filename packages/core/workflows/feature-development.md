# Feature Development Workflow

## Trigger
User wants to add a new feature.

## Steps

### 1. Plan Creation
**Command**: `/plan [feature description]`
**Agent**: epost-architect (enhanced)
**Output**: `plans/YYMMDD-feature.md` with YAML frontmatter

The architect agent:
- Spawns 3 researchers in parallel (best practices, codebase analysis, dependencies)
- Analyzes existing codebase and architecture
- Creates detailed implementation plan with file ownership
- Defines success criteria

### 2. Implementation
**Command**: `/cook plans/YYMMDD-feature.md`
**Agent**: epost-implementer (enhanced)
**Output**: Working feature with tests

The implementer agent:
- Validates file ownership and phase dependencies
- Follows the plan precisely
- Creates/modifies files in correct order
- Writes comprehensive tests
- Updates documentation

### 3. Testing
**Command**: `/test`
**Agent**: epost-tester (enhanced)
**Output**: Test results with coverage

The tester agent:
- Runs multi-framework test suite
- Analyzes code coverage
- Reports failures with root cause analysis
- Validates performance requirements

### 4. Code Review
**Command**: `/review`
**Agent**: epost-reviewer (enhanced)
**Output**: Security and quality report

The reviewer agent:
- Checks code quality and security
- Analyzes performance implications
- Verifies plan completion
- Validates documentation updates

### 5. Documentation
**Agent**: epost-documenter (enhanced)
**Output**: Updated docs

The documenter agent:
- Updates relevant documentation
- Maintains roadmap and changelog
- Ensures API documentation is current

### 6. Commit
**Command**: `/git:commit`
**Agent**: epost-git-manager
**Output**: Clean git commit

The git-manager agent:
- Analyzes changes
- Generates conventional commit message
- Stages and commits
- Runs pre-commit hooks

## Flow Diagram
```mermaid
graph LR
    A[User Request] --> B[/plan command]
    B --> C[epost-architect]
    C --> C1[3 researchers in parallel]
    C1 --> D[Plan created with file ownership]
    D --> E[/cook command]
    E --> F[epost-implementer]
    F --> G[/test command]
    G --> H[epost-tester]
    H --> I{Tests pass?}
    I -->|No| F
    I -->|Yes| J[/review command]
    J --> K[epost-reviewer]
    K --> L[epost-documenter]
    L --> M[/git:commit command]
    M --> N[epost-git-manager]
    N --> O[Committed]
```

## Estimated Time
- Simple feature: 5-10 minutes
- Medium feature: 15-30 minutes
- Complex feature: 30-60 minutes

## Success Criteria
- Plan reviewed and approved
- All tests passing
- Code review approved
- Committed with conventional message
- Documentation updated
