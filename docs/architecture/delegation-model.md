# Parent-Child Delegation Model

## Workflow Flow

```
User Request
    ↓
/command or /platform:command
    ↓
Orchestrator Agent
    ├─ Analyzes request context
    ├─ Detects platform (file types, markers)
    └─ Routes to appropriate Global Agent
        ↓
    Global Agent (architect, implementer, reviewer, etc.)
    ├─ Analyzes task requirements
    ├─ Detects if platform-specific
    └─ Delegates to Platform Agent (if needed)
        ↓
    Platform Agent (web/impl, ios/impl, android/impl)
    ├─ Executes in platform context
    ├─ Uses platform-specific skills
    └─ Returns results to Global Agent
        ↓
    Global Agent aggregates and returns to user
```

## Request Routing Examples

### Auto-detection (e.g., `/cook`)
```
User: /cook (build login page for web)
  ↓ Orchestrator detects: .tsx files in src/, package.json with React
  ↓ Routes to Implementer
  ↓ Implementer detects: web platform
  ↓ Delegates to web/implementer
  ↓ web/implementer executes (writes React components)
```

### Explicit platform (e.g., `/web:cook`)
```
User: /web:cook (build login page)
  ↓ Routes directly to web/implementer (no detection needed)
  ↓ Executes immediately
```

### Non-platform work (e.g., `/document`)
```
User: /document (update README)
  ↓ Routes to Documenter
  ↓ Executes directly (no platform agent)
  ↓ Returns documentation
```

## Data Flow & Communication

### Agent Communication Pattern

```
Global Agent → Platform Agent Communication

1. Global Agent receives task
   - Has context about overall workflow
   - Knows about project constraints
   - Detects platform

2. Global Agent delegates to Platform Agent
   - Passes task description
   - Provides project context
   - Specifies platform requirements

3. Platform Agent executes
   - Uses platform-specific skills
   - Accesses platform tools
   - Returns results

4. Global Agent aggregates
   - Receives results from platform agents
   - Validates across platforms (if multi-platform)
   - Returns to user
```

### Context Preservation

When delegating, context is passed as:
- Task description and requirements
- Relevant code/files (via Read tool)
- Project structure and markers
- Previous decisions and constraints
- Expected output format

Example delegation context:
```
From: implementer
To: web/implementer

Task: Implement user authentication
Context:
  - Project: Next.js + TypeScript
  - Framework: React with hooks
  - UI Library: shadcn/ui
  - Auth Method: OAuth + JWT
  - Files: pages/auth/*, types/auth.ts
  - Constraints: Must use Next.js middleware
```

---

**Last Updated**: 2026-02-06
