# Project Initialization Workflow

## Trigger
User wants to start a new project.

## Steps

### 1. Bootstrap
**Command**: `/bootstrap [project description]`
**Agent**: implementer
**Output**: New project structure

The developer agent:
- Asks for project type
- Recommends tech stack
- Creates project structure
- Generates initial files
- Sets up configuration

### 2. Initial Commit
**Command**: `/git:cm`
**Agent**: git-manager
**Output**: First commit

## Flow Diagram
```mermaid
graph LR
    A[New Project] --> B[/bootstrap command]
    B --> C[implementer]
    C --> D[Project created]
    D --> E[/git:cm command]
    E --> F[git-manager]
    F --> G[Initial commit]
```

## Tech Stack Recommendations

### Web Application
- **Framework**: Next.js 14 (App Router)
- **UI**: klara-theme or shadcn/ui
- **Styling**: Tailwind CSS + SCSS
- **State**: Redux Toolkit + Redux Persist
- **DB**: PostgreSQL + Prisma

### API
- **Runtime**: Node.js
- **Framework**: Next.js API Routes + Server Actions
- **Validation**: Zod
- **Docs**: OpenAPI

### Library
- **Language**: TypeScript
- **Builder**: tsup/unbuild
- **Test**: Jest
- **Docs**: TypeDoc

## Initial Files Created
- README.md
- .gitignore
- package.json
- tsconfig.json
- src/
- .claude/ (with ClaudeKit)

## Estimated Time
5-10 minutes
