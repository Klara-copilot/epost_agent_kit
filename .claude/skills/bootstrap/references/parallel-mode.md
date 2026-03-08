# Bootstrap Parallel Mode

Parallel bootstrap — skip mode detection, split into independent modules immediately.

<user-requirements>$ARGUMENTS</user-requirements>

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task.

## Workflow

### 1. Setup
- Check if Git is initialized; if not, use `epost-git-manager` to init (`main` branch)

### 2. Research & Planning
- Use 2 `epost-researcher` subagents (max 5 sources each) for idea validation + tech stack
- Use `epost-planner` to create implementation plan with parallel phases at `./plans/`

### 3. Design (if UI project)
- Use `epost-muji` for design guidelines at `./docs/design-guidelines.md`

### 4. Implementation (Parallel)
- Split into independent modules based on plan
- Implement each module with separate agents in parallel
- Integrate modules after all are complete

### 5. Testing & Review
- Use `epost-tester` to run tests; use `epost-debugger` to fix failures
- Use `epost-code-reviewer` for code review; iterate until clean

### 6. Documentation
- Create/update: `README.md`, `project-overview-pdr.md`, `code-standards.md`, `system-architecture.md`

### 7. Final
- Use `epost-git-manager` to commit (DO NOT push)
- Report summary to user

## Rules

- YAGNI, KISS, DRY
- Sacrifice grammar for concision in reports
