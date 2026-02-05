# System Architecture

## Architecture Overview

epost_agent_kit implements a **parent-child delegation architecture** where global agents orchestrate work and platform-specific agents execute within their domain. This design enables single-source-of-truth component definitions that automatically convert across multiple IDEs.

### Core Principles

1. **Separation of Concerns**: Global agents coordinate; platform agents execute
2. **Single Source of Truth**: Define once, deploy everywhere
3. **Explicit Delegation**: Parent agents never write platform-specific code
4. **Modular Components**: Agents, skills, rules, commands organized by platform
5. **Cross-Platform Parity**: Same functionality across Claude Code, Cursor, Copilot

---

## Parent-Child Delegation Model

### Workflow Flow

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

### Request Routing Examples

**Auto-detection (e.g., `/cook`)**:
```
User: /cook (build login page for web)
  ↓ Orchestrator detects: .tsx files in src/, package.json with React
  ↓ Routes to Implementer
  ↓ Implementer detects: web platform
  ↓ Delegates to web/implementer
  ↓ web/implementer executes (writes React components)
```

**Explicit platform (e.g., `/web:cook`)**:
```
User: /web:cook (build login page)
  ↓ Routes directly to web/implementer (no detection needed)
  ↓ Executes immediately
```

**Non-platform work (e.g., `/document`)**:
```
User: /document (update README)
  ↓ Routes to Documenter
  ↓ Executes directly (no platform agent)
  ↓ Returns documentation
```

---

## Global Agents (Orchestration Layer)

### Agent Roles & Responsibilities

#### 1. Orchestrator
**Role**: Top-level router and project manager

**Responsibilities**:
- Route incoming tasks to appropriate global agents
- Detect platform from context (file types, project structure)
- Manage project structure and dependencies
- Coordinate cross-cutting concerns

**Delegates To**: All other global agents

**Example Workflow**:
```
User: I'm building a mobile app
  ↓ Orchestrator detects: Swift files, Package.swift
  ↓ Asks: "iOS or Android?" or assumes iOS
  ↓ Routes to Architect to plan architecture
  ↓ Architect detects iOS context
  ↓ Delegates to ios/implementer for implementation
```

#### 2. Architect
**Role**: Design, planning, and technical research

**Responsibilities**:
- Design system architecture
- Create implementation plans
- Research technical approaches
- Propose solutions to complex problems

**Delegates To**: Implementer (if platform-specific decision reached)

**Example Workflow**:
```
User: Design authentication system
  ↓ Architect researches OAuth, JWT, session approaches
  ↓ Proposes design document
  ↓ If implementation needed, delegates to implementer
```

#### 3. Implementer
**Role**: Feature implementation delegator

**Responsibilities**:
- Coordinate implementation across platforms
- Detect platform from context
- Delegate to platform-specific implementers
- Aggregate results from platform agents

**Delegates To**: web/implementer, ios/implementer, android/implementer

**Example Workflow**:
```
User: /cook (implement login feature)
  ↓ Implementer receives task
  ↓ Detects platform: web (React project detected)
  ↓ Delegates to web/implementer
  ↓ web/implementer writes React components, hooks
  ↓ Returns implementation to user
```

#### 4. Reviewer
**Role**: Code review and performance analysis

**Responsibilities**:
- Review code for quality and best practices
- Analyze performance metrics
- Security validation
- Suggest improvements

**Delegates To**: web/tester (for platform-specific review), ios/tester

**Example Workflow**:
```
User: /review (check my code)
  ↓ Reviewer reads code
  ↓ Detects platform: web
  ↓ Delegates to web/tester for framework-specific review
  ↓ Returns comprehensive review with suggestions
```

#### 5. Researcher
**Role**: Multi-source research and validation

**Responsibilities**:
- Conduct multi-source research
- Validate technical approaches
- Gather context from documentation
- No platform-specific knowledge (global capability)

**Delegates To**: None (executes directly)

**Example Workflow**:
```
User: Research best practices for React authentication
  ↓ Researcher searches multiple sources
  ↓ Validates approaches against React docs
  ↓ Returns curated findings
```

#### 6. Debugger
**Role**: Debugging coordination

**Responsibilities**:
- Diagnose issues and bugs
- Coordinate debugging sessions
- Delegate to platform debuggers for runtime issues

**Delegates To**: web/debugger, ios/simulator, android/debugger

**Example Workflow**:
```
User: /debug (crashes when clicking button)
  ↓ Debugger analyzes error
  ↓ Detects platform: iOS
  ↓ Delegates to ios/simulator for debugging
  ↓ ios/simulator runs app, captures stack trace
  ↓ Returns diagnosis and fix
```

#### 7. Tester
**Role**: Test orchestration

**Responsibilities**:
- Plan test strategy
- Coordinate test execution
- Aggregate test results
- Delegate to platform testers

**Delegates To**: web/tester, ios/tester, android/tester

**Example Workflow**:
```
User: /test (run all tests)
  ↓ Tester detects project has web + mobile
  ↓ Delegates to web/tester AND ios/tester (parallel)
  ↓ Aggregates results: X passed, Y failed
  ↓ Returns summary
```

#### 8. Documenter
**Role**: Cross-platform documentation

**Responsibilities**:
- Generate and maintain documentation
- Create README, API docs, guides
- Ensure consistency across platforms
- No platform specialization (global)

**Delegates To**: None (executes directly)

**Example Workflow**:
```
User: /document (generate API docs)
  ↓ Documenter analyzes code
  ↓ Generates markdown documentation
  ↓ Updates API reference
```

#### 9. Git-Manager
**Role**: Git operations coordination

**Responsibilities**:
- Manage commits, branches, PRs
- Coordinate version control
- No platform-specific git work (global)

**Delegates To**: None (executes directly)

**Example Workflow**:
```
User: /git:pr (create PR for feature)
  ↓ Git-manager creates branch, commits changes
  ↓ Opens PR with description
  ↓ Returns PR link
```

---

## Platform Agents (Execution Layer)

### Platform Specialization

#### Web Platform (`web/`)

**Technologies**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui

**Agents**:
- **web/implementer** - Implements features in React/Next.js
  - Component creation (functional, hooks-based)
  - State management (Zustand, Context API)
  - Routing (Next.js App Router)
  - API integration

- **web/tester** - Web testing and QA
  - Unit tests (Vitest)
  - Component tests (Testing Library)
  - E2E tests (Playwright)
  - Performance testing

- **web/designer** - Design system integration
  - shadcn/ui component selection
  - Figma variable implementation
  - Tailwind styling
  - Accessibility (WCAG 2.1 AA)

**Skills**:
- `web/nextjs` - Next.js patterns and best practices
- `web/frontend-development` - React, TypeScript, hooks
- `web/shadcn-ui` - Component library integration
- `web/backend-development` - API routes, middleware

**Command Example**:
```typescript
// /web:cook executes in web/implementer context
const component = await webImplementer.implement({
  task: "Build login form",
  framework: "React",
  pattern: "functional component with hooks"
});
```

#### iOS Platform (`ios/`)

**Technologies**: Swift 6, SwiftUI, UIKit, XCTest

**Agents**:
- **ios/implementer** - Swift implementation
  - SwiftUI views and modifiers
  - ViewModels and state management
  - Core Data integration
  - Networking

- **ios/tester** - iOS testing
  - XCTest unit tests
  - XCUITest UI tests
  - Performance profiling

- **ios/simulator** - Simulator management
  - Launch and configure simulators
  - Run apps in simulators
  - Capture crashes and logs
  - Screenshot and video recording

**Skills**:
- `ios/ios-development` - Swift, SwiftUI, best practices
- Shared database skills (Core Data)
- Shared debugging skills

#### Android Platform (`android/`)

**Technologies**: Kotlin, Jetpack Compose, Espresso

**Agents**:
- **android/implementer** - Kotlin implementation
  - Compose UI implementation
  - State management (ViewModel, Flow)
  - Data persistence (Room)
  - Networking

- **android/tester** - Android testing
  - JUnit unit tests
  - Espresso UI tests
  - Performance profiling

**Skills**:
- `android/android-development` - Kotlin, Compose, best practices
- Shared database skills
- Shared debugging skills

---

## Shared Components

### Global Skills (All Platforms)

| Skill | Purpose |
|-------|---------|
| `planning` | Project planning and roadmapping |
| `research` | Multi-source research and validation |
| `debugging` | General debugging and troubleshooting |
| `skill-creator` | Create new skills (from anthropics) |
| `find-skills` | Discover existing skills (from vercel-labs) |

### Shared Skills (Multiple Platforms)

| Skill | Platforms | Purpose |
|-------|-----------|---------|
| `databases` | web, ios, android | Database design and queries (SQL, NoSQL) |
| `docker` | web, ios (ci), android (ci) | Containerization and orchestration |
| `git` | All | Git operations (built into git-manager) |

---

## Cross-Platform Component Mapping

### Component Conversion Matrix

| Component Type | Claude Code | Cursor | GitHub Copilot |
|---|---|---|---|
| **Agent** | `.claude/agents/*.md` (YAML frontmatter) | `AGENTS.md` (plain markdown) | `.github/agents/*.agent.md` (YAML frontmatter) |
| **Global Rule** | `CLAUDE.md` sections | `.cursor/rules/*.mdc` (alwaysApply) | `.github/copilot-instructions.md` |
| **File-Scoped Rule** | N/A | `.cursor/rules/*.mdc` (globs) | `.github/instructions/*.instructions.md` (applyTo) |
| **Command/Skill** | `.claude/skills/*/SKILL.md` | `.cursor/commands/*.md` | `.github/prompts/*.prompt.md` |

### Conversion Details

**Agents**:
```yaml
# Claude Code: .claude/agents/implementer.md
---
name: implementer
description: Delegates to platform implementers
tools: Read, Glob, Grep, Bash
---
Body content...

↓ Converts to:

# Cursor: AGENTS.md
## implementer
Delegates to platform implementers
...

↓ Converts to:

# Copilot: .github/agents/implementer.agent.md
---
name: implementer
description: Delegates to platform implementers
tools: ['read', 'edit/editFiles']
---
Body content...
```

**Rules**:
```markdown
# Claude Code: CLAUDE.md
## Code Standards Section
- Use TypeScript strict mode
- Prefer interfaces over types

↓ Converts to:

# Cursor: .cursor/rules/code-standards.mdc
---
description: Code standards
alwaysApply: true
---
- Use TypeScript strict mode
- Prefer interfaces over types

↓ Converts to:

# Copilot: .github/instructions/code-standards.instructions.md
---
description: Code standards
applyTo: "**/*.ts"
---
- Use TypeScript strict mode
- Prefer interfaces over types
```

**Commands**:
```markdown
# Claude Code: .claude/skills/web/cook/SKILL.md
Implement features using Next.js and React...

↓ Converts to:

# Cursor: .cursor/commands/cook.md
Implement features using Next.js and React...

↓ Converts to:

# Copilot: .github/prompts/cook.prompt.md
---
description: Cook - Implement features
agent: agent
---
Implement features using Next.js and React...
```

---

## Distribution Architecture

### Two-Layer Distribution Model

```
Layer 1: Skills Only
  npx skills add Klara-copilot/epost_agent_kit
  ↓
  Installs: .claude/skills/*/SKILL.md only
  Use case: Minimal installation, only skills

Layer 2: Full Ecosystem
  npx epost-kit install
  ↓
  Installs: agents, rules, commands, skills, workflows
  Use case: Full agent kit with delegation
```

### Installation Targets

| Target | Location | Contains |
|--------|----------|----------|
| `claude` | `.claude/` | Agents (YAML), skills, commands, rules in CLAUDE.md |
| `cursor` | `.cursor/`, `AGENTS.md` | Rules (.mdc), commands (.md), AGENTS.md hierarchy |
| `copilot` | `.github/` | Agents (.agent.md), instructions, prompts |

### CLI Command Flow

```
npx epost-kit install [options]
  ↓
Discover Components (scan .claude/)
  ├─ Find agents: .claude/agents/*.md
  ├─ Find skills: .claude/skills/*/SKILL.md
  ├─ Find rules: .claude/rules/*.md
  └─ Find commands: .claude/commands/*.md
  ↓
Filter by Platform (if --platform specified)
  ├─ Include: web/ or ios/ or android/
  ├─ Include: shared components
  └─ Exclude: other platforms
  ↓
Convert Components (based on --target)
  ├─ Claude Code: No conversion (native format)
  ├─ Cursor: Convert to AGENTS.md, .mdc, commands
  └─ Copilot: Convert to agent.md, instructions, prompts
  ↓
Install to Target
  ├─ Create directories if needed
  ├─ Write converted files
  └─ Validate installation
  ↓
Generate Lock File
  └─ Track installed components + versions
```

---

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

## Extension Points

### Adding New Agents

1. **Create agent file**: `.claude/agents/{name}.md`
2. **Add YAML frontmatter**: name, description, tools
3. **Write agent prompt**: Clear instructions
4. **Register in AGENTS.md**: Add to Cursor version
5. **Create Copilot version**: `.github/agents/{name}.agent.md`

### Adding New Platform

1. **Create platform directory**: `.claude/agents/{platform}/`
2. **Create platform agents**: implementer, tester, etc.
3. **Create platform skills**: `.claude/skills/{platform}/`
4. **Update CLI targets**: Add platform to installer
5. **Create conversion templates**: Format for new IDE

### Adding New Skills

1. **Create skill file**: `.claude/skills/{platform}/{name}/SKILL.md`
2. **Add frontmatter**: name, description, platform
3. **Write skill content**: Detailed instructions
4. **Test on platform**: Verify functionality
5. **Document**: Add to CLI discovery

---

## Safety & Security

### Tool Restrictions

Global agents have limited tool access:
- `Read` - Read files
- `Glob` - Search files
- `Grep` - Search content
- `Bash` - Execute commands (restricted)

Platform agents inherit tool access but can specialize:
- web/implementer adds `Edit`, `Write`
- ios/implementer adds platform-specific tools
- git-manager restricts to git operations only

### Credential Management

- No agent stores secrets
- Credentials passed via environment variables
- CLI validates for secrets before installation
- Documentation warns about .env files

### Validation

- Agent prompts validated for size limits
- Commands validated for syntax
- Cross-platform parity checked
- Tool references validated on all platforms

---

## Performance Considerations

### Agent Load Times

- **Startup**: Only agent names/descriptions loaded initially
- **On-Use**: Full agent prompt loaded when invoked
- **Caching**: IDE caches agent definitions

### Delegation Overhead

- Minimal: One extra routing step
- Negligible for typical tasks (minutes of work)
- Worth the clarity and maintainability trade-off

### Scalability

- 100+ agents supported
- 50+ platform combinations possible
- CLI installation linear time O(n) components
- No hierarchical nesting beyond global→platform

---

**Last Updated**: 2026-02-05
**Architecture Owner**: Phuong Doan
**Status**: Design Phase
