# Project Initialization Workflow

## Trigger
User wants to start a new project.

## Steps

### 1. Bootstrap
**Command**: `/bootstrap [project description]`
**Agent**: epost-fullstack-developer (enhanced)
**Output**: New project structure

The implementer agent:
- Asks for project type
- Recommends tech stack
- Creates project structure
- Generates initial files
- Sets up configuration

### 2. Initial Documentation
**Agent**: epost-docs-manager (enhanced)
**Output**: Initial documentation suite

The documenter agent:
- Creates docs/codebase-summary.md (via repomix)
- Creates docs/code-standards.md
- Creates docs/system-architecture.md
- Sets up development-roadmap.md
- Initializes project-changelog.md

### 3. Initial Commit
**Command**: `/git-commit`
**Agent**: epost-git-manager
**Output**: First commit with docs

## Flow Diagram
```mermaid
graph LR
    A[New Project] --> B[/bootstrap command]
    B --> C[epost-fullstack-developer]
    C --> D[Project structure created]
    D --> E[epost-docs-manager]
    E --> E1[Initial docs created]
    E1 --> F[/git-commit command]
    F --> G[epost-git-manager]
    G --> H[Initial commit]
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
