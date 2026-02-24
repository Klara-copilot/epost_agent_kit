---
title: "Bootstrap: Fast"
description: (ePost) Linear bootstrap for single-module projects
agent: epost-implementer
argument-hint: [project description]
---

# Bootstrap Fast

Linear bootstrap — skip mode detection, go straight to single-module flow.

<user-requirements>$ARGUMENTS</user-requirements>

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task.

## Workflow

### 1. Setup
- Check if Git is initialized; if not, use `epost-git-manager` to init (`main` branch)

### 2. Research & Planning
- Use `epost-researcher` (max 5 sources) to explore tech stack
- Use `epost-architect` to create implementation plan at `./plans/`

### 3. Design (if UI project)
- Use `epost-muji` for design guidelines at `./docs/design-guidelines.md`

### 4. Implementation
- Follow the plan step by step (linear, sequential)
- Run type checking and compile to catch syntax errors

### 5. Testing & Review
- Use `epost-tester` to run tests; use `epost-debugger` to fix failures
- Use `epost-reviewer` for code review; iterate until clean

### 6. Documentation
- Create/update: `README.md`, `project-overview-pdr.md`, `code-standards.md`

### 7. Final
- Use `epost-git-manager` to commit (DO NOT push)
- Report summary to user

## Rules

- YAGNI, KISS, DRY
- Sacrifice grammar for concision in reports
