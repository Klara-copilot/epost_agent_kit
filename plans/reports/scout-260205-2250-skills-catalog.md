# Skills Catalog - epost_agent_kit

**Generated**: 2026-02-05  
**Scope**: Complete skills ecosystem (.claude/skills/)  
**Total Skills**: 17 documented skills across 5 categories  

## Executive Summary

The epost_agent_kit provides 17 interconnected skills organized into five categories:
- **Core Cognitive Skills** (5): Planning, debugging, code review, problem solving, sequential thinking
- **Web Platform Skills** (5): Frontend development, backend development, Next.js, shadcn-ui, Better Auth
- **Mobile Platform Skills** (2): iOS development (with 3 sub-skills), Android development (skeleton)
- **Shared Infrastructure Skills** (3): Databases, Docker, Research
- **Utility Skills** (2): Repomix (codebase summarization), Documentation Seeker

All skills follow consistent activation triggers based on user intent or keyword mentions and expose expertise in specific domains.

---

## 1. CORE COGNITIVE SKILLS

### 1.1 Planning Skill
**Location**: `.claude/skills/planning/SKILL.md`  
**Priority**: High (foundational)

**Purpose**: Transform requirements into actionable implementation plans

**When Active**:
- User uses `/plan` command
- User asks for implementation plan
- Before starting feature development

**Key Expertise**:
- Requirements analysis (clarification, edge cases, functional/non-functional separation)
- Task breakdown (decomposition, subtasks, complexity estimation, dependency ordering)
- Dependency identification (external packages, internal code, blocking issues, parallelization)
- Risk assessment (technical, timeline, resource risks with mitigation)
- Resource estimation (time per task, complexity levels, developer hours)
- Timeline planning (critical path, milestones, buffer allocation, sprints)

**Output Format**:
```markdown
# Plan: [Feature]
## Overview
## Tasks (with estimates)
## Dependencies (external/internal)
## Risks (with mitigations)
## Success Criteria
```

**Integration**: 
- Works with researcher agents to conduct preliminary research
- Creates phase files in `./plans/{YYYYMMDD-HHMM-descriptor}/`
- References documented requirements and architecture

**Best Practices**:
- Be specific about files to create/modify
- Include database migrations if needed
- Note breaking changes clearly
- Consider testing strategy upfront
- Create YAML frontmatter with metadata
- Estimate conservatively, track actuals

---

### 1.2 Debugging Skill
**Location**: `.claude/skills/debugging/SKILL.md`  
**Priority**: High (critical for quality)

**Purpose**: Systematic debugging methodology for resolving complex issues

**When Active**:
- User uses `/debug` command
- User reports errors or unexpected behavior
- CI/CD failures reported

**Core Process** (6-step method):
1. Understand: What's the symptom?
2. Reproduce: Can you reproduce it?
3. Isolate: What's the minimal case?
4. Analyze: What's actually happening?
5. Hypothesize: What could cause this?
6. Verify: Does the fix work?

**Specialized Techniques**:
- Log analysis (parse error messages, follow stack traces, identify patterns, contextual logging)
- Stack trace interpretation (read top-down, identify root cause frame, distinguish cause from symptom)
- Reproduction strategies (minimal reproduction, environment matching, data setup)
- Root cause analysis (5 Whys technique, fishbone diagrams, timeline analysis)
- Fix validation (regression testing, edge case testing, performance impact, side effect analysis)

**Defense-in-Depth Patterns**:
- Input validation (reject invalid early)
- Business logic validation (enforce invariants)
- Output validation (verify results before return)

**Error Handling Strategy**:
- Catch: Only where you can handle meaningfully
- Transform: Convert to domain-specific errors
- Log: Include context (not just message)
- Propagate: Let upstream handle if you can't

**Common Issues Covered**:
- TypeScript: Type mismatches, missing imports, Any type abuse, generic constraints
- React: Stale closures, missing dependencies, re-render loops, state timing
- Async: Race conditions, promise rejection, missing await, callback hell

**Tools**:
- Browser DevTools (breakpoints, profiling)
- Node debugger (--inspect flag)
- Console logging (structured format)
- Source maps (correct line numbers)
- Test suite (regression testing)

---

### 1.3 Code Review Skill
**Location**: `.claude/skills/code-review/SKILL.md`  
**Priority**: High (quality gate)

**Purpose**: Comprehensive code quality assessment and verification before commit/merge

**When Active**:
- User uses `/review` command
- User asks for code review
- Before committing code to repository
- Before creating pull requests

**Review Process** (5-step):
1. Read plan file and understand requirements
2. Identify changed files via `git diff` or `git log`
3. Systematic review: structure → logic → types → performance → security
4. Categorize findings: Critical > High > Medium > Low
5. Update plan TODO status

**Systematic Review Categories**:
- **Structure**: File organization, module boundaries, separation of concerns
- **Logic**: Algorithm correctness, edge cases, boundary conditions
- **Types**: Type safety, missing type checks, incorrect types
- **Performance**: N+1 queries, unnecessary renders, inefficient loops, memory leaks
- **Security**: Input validation, auth checks, data exposure, injection vulnerabilities

**Severity Classification**:
- **Critical**: Security vulnerabilities, data loss, breaking changes
- **High**: Performance issues, type safety violations, missing error handling
- **Medium**: Code smells, maintainability issues, documentation gaps
- **Low**: Style inconsistencies, minor optimizations

**Verification Before Completion**:
- All tasks in plan TODO list verified
- No remaining TODO comments in production code
- Build/typecheck passes
- Tests pass with adequate coverage
- Security checklist completed

---

### 1.4 Problem Solving Skill
**Location**: `.claude/skills/problem-solving/SKILL.md`  
**Priority**: Medium (debugging support)

**Purpose**: Root cause analysis and complex problem resolution

**When Active**:
- User reports bug or system behaving unexpectedly
- Debugging feels stuck
- Need deeper problem analysis

**Core Techniques**:
1. **Root Cause Analysis (5 Whys)**: Ask "why" 5 times to dig past symptoms
2. **Inversion**: Ask "what would make this fail?" then prevent those conditions
3. **Collision Zone Thinking**: Find where multiple systems interact (bugs live at boundaries)
4. **Simplification Cascades**: Remove complexity until problem disappears, add back until it returns

**When Stuck** (5-step recovery):
1. Change perspective (explain to rubber duck)
2. Bisect the problem (binary search for root cause)
3. Check assumptions (what are you taking for granted?)
4. Sleep on it (context switch resets mental model)
5. Zoom out (is this really the right problem?)

**Root Cause Analysis Format**:
```
Problem: [Observed behavior]
Why 1: [Immediate cause]
Why 2: [What caused that]
Why 3: [Layer deeper]
Why 4: [Systemic issue]
Why 5: [Fundamental cause]
Fix: [Address root, not symptom]
```

**Bisection Strategy**:
- Create minimal failing test
- Remove half the code
- Does it still fail? If yes, problem is in remaining half
- Repeat until isolated

---

### 1.5 Sequential Thinking Skill
**Location**: `.claude/skills/sequential-thinking/SKILL.md`  
**Priority**: Medium (analysis support)

**Purpose**: Structured step-by-step analysis for complex problems

**When Active**:
- Debugging complex issues
- Test planning
- Architecture decisions
- Root cause analysis
- Complex design problems

**Core Patterns**:
1. **Linear Decomposition**: Break problem into ordered steps, each builds on previous
2. **Branching Analysis**: Explore multiple paths, evaluate each independently
3. **Revision Loop**: After conclusion, revisit assumptions and check for gaps

**Standard Thought Structure**:
1. State the problem clearly
2. List known facts
3. Identify unknowns
4. Form hypothesis
5. Test hypothesis with evidence
6. Revise if needed
7. State conclusion with confidence level

**Debug Trace Format**:
```
Problem: [What's broken]
Symptoms: [Observable behavior]
Step 1: [What happens first]
Step 2: [What happens next]
...
Root Cause: [Why it happened]
Fix: [Solution]
```

**Hypothesis Testing Format**:
```
Hypothesis: [Your guess]
Evidence for: [Supporting facts]
Evidence against: [Contradicting facts]
Conclusion: [Accept/Reject/Uncertain]
```

**Best Practices**:
- Write your thinking, don't keep it mental
- Verify each step before moving to next
- Challenge assumptions explicitly
- Consider multiple root causes
- Document your reasoning trail

---

## 2. WEB PLATFORM SKILLS

### 2.1 Frontend Development Skill
**Location**: `.claude/skills/web/frontend-development/SKILL.md`  
**Platform**: Web only  
**Priority**: High

**Purpose**: React/Next.js frontend patterns and best practices

**When Active**:
- User mentions React, frontend, UI components, hooks
- Building React components
- State management questions
- Performance optimization needed

**Expertise Areas**:
- **React Hooks**: useState, useEffect, useContext, custom hooks, dependency array optimization
- **Component Composition**: Compound components, render props, children prop, slot pattern
- **State Management**: Context API, Zustand (client), React Query (server state), react-hook-form (forms)
- **Performance**: React.memo, useMemo, useCallback, code splitting with React.lazy
- **TypeScript**: Interface vs type, generic components, utility types, type narrowing
- **Testing**: React Testing Library patterns, fireEvent vs userEvent, query selectors, mocking

**Key Patterns**:
```typescript
// Custom Hook
function useFeature() {
  const [state, setState] = useState(null);
  useEffect(() => { /* setup */ }, []);
  return { state, actions };
}

// Component with Types
interface Props { prop1: string; onAction: () => void; }
export function Component({ prop1, onAction }: Props) { /* impl */ }
```

**Dependencies**: React 18+, TypeScript, React Testing Library, Tailwind CSS

---

### 2.2 Backend Development Skill
**Location**: `.claude/skills/web/backend-development/SKILL.md`  
**Platform**: Web only  
**Priority**: High

**Purpose**: Node.js backend patterns and best practices

**When Active**:
- User mentions API, backend, server, endpoints
- API design questions
- Request validation
- Authentication/authorization needed

**Expertise Areas**:
- **REST API Design**: Resource naming, HTTP semantics, status codes, pagination
- **Error Handling**: Custom error classes, error middleware, consistent responses, logging
- **Validation**: Zod schemas, request validation middleware, response validation
- **Authentication**: JWT tokens, session-based, OAuth, API keys
- **Middleware**: Request logging, rate limiting, CORS, body parsing
- **Database**: Connection pooling, transactions, query builders, ORM patterns
- **Documentation**: OpenAPI/Swagger, JSDoc, type definitions, example requests

**Key Pattern** (Route Handler):
```typescript
app.post('/api/resource',
  validateBody(schema),
  authenticate,
  async (req, res) => {
    try {
      const result = await handler(req.body);
      res.json(result);
    } catch (error) { next(error); }
  }
);
```

**Dependencies**: Node.js 20+/Bun, Fastify/Express/Hono, Zod, Prisma/Drizzle

---

### 2.3 Next.js Skill
**Location**: `.claude/skills/web/nextjs/SKILL.md`  
**Platform**: Web only  
**Priority**: High (framework-specific)

**Purpose**: Next.js 15 App Router expertise

**When Active**:
- User mentions Next.js, App Router, Server Components
- Building Next.js applications
- Route configuration needed
- Server-side rendering questions

**Expertise Areas**:
- **App Router**: app/ directory structure, route groups with (), parallel routes, intercepting routes
- **Server vs Client**: Server components by default, 'use client' directive, server composition, client boundaries
- **Server Actions**: 'use server' directive, form actions, progressive enhancement, error handling
- **Route Handlers**: route.ts files, HTTP methods, response helpers, CORS
- **Data Fetching**: async/await, fetch with caching, static generation, dynamic rendering
- **Optimization**: Image with next/image, fonts with next/font, script loading, bundle analysis
- **Middleware**: middleware.ts, request modification, auth redirects, locale detection

**Key Patterns**:
```typescript
// Server Component (default)
export default async function Page() {
  const data = await fetch('...');
  return <div>{data}</div>;
}

// Client Component
'use client';
export function Interactive() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Server Action
'use server';
export async function createAction(formData: FormData) { /* logic */ }

// Route Handler
export async function GET() { return Response.json({ data: '...' }); }
```

**Dependencies**: Next.js 15+, React 19+, TypeScript

---

### 2.4 shadcn-ui Skill
**Location**: `.claude/skills/web/shadcn-ui/SKILL.md`  
**Platform**: Web only  
**Priority**: Medium (component library)

**Purpose**: Radix UI + Tailwind component patterns

**When Active**:
- User mentions shadcn, Radix, accessible components
- Building accessible UI
- Component theming
- Dialog/form interactions

**Expertise Areas**:
- **Component Installation**: npx shadcn@latest add, manual setup, dependencies, Tailwind config
- **Component Composition**: Compound components, slot composition, AsChild pattern, provider composition
- **Theming**: CSS variables for colors, dark mode, custom themes, Tailwind extend
- **Accessibility**: ARIA attributes, keyboard navigation, screen reader, focus management
- **Form Integration**: react-hook-form, zod validation, form components, field components
- **Dialog Patterns**: Dialog, Sheet, Popover, AlertDialog usage

**Key Pattern** (Component Usage):
```typescript
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>Content</DialogContent>
    </Dialog>
  );
}
```

**Dependencies**: shadcn-ui, Radix UI primitives, Tailwind CSS, class-variance-authority, clsx/cn

---

### 2.5 Better Auth Skill
**Location**: `.claude/skills/web/better-auth/SKILL.md`  
**Platform**: Web only  
**Priority**: Medium (auth-specific)

**Purpose**: Authentication implementation with better-auth framework

**When Active**:
- User mentions auth, login, OAuth, better-auth
- Implementing user authentication
- Session management
- OAuth provider setup

**Expertise Areas**:
- **Setup**: Installation, database adapter, environment config, base URL configuration
- **Providers**: Google OAuth, GitHub OAuth, email/password, magic links, multi-provider setup
- **Session Management**: Creation, validation, refresh, termination
- **Protected Routes**: Server-side checks, client-side checks, middleware protection, API guards
- **TypeScript**: Type-safe sessions, user types, provider types, schema inference
- **Testing**: Mock sessions, test user creation, provider mocks, route protection tests

**Key Patterns**:
```typescript
// Auth Config
export const auth = betterAuth({
  database: adapter,
  emailAndPassword: { enabled: true },
  socialProviders: { google: { clientId, clientSecret }, github: {...} }
});

// Server-side Session
export async function getSession() {
  return await auth.api.getSession({ headers: headers() });
}

// Protected Route
export const GET = auth((req) => {
  if (!req.user) return new Response('Unauthorized', { status: 401 });
});

// Client-side Hook
export function UserProfile() {
  const { data: session } = useSession();
  if (!session) return <LoginButton />;
  return <Welcome user={session.user} />;
}
```

**Dependencies**: better-auth, database adapter (Prisma/Drizzle), OAuth credentials

---

## 3. MOBILE PLATFORM SKILLS

### 3.1 iOS Development Skill
**Location**: `.claude/skills/ios/ios-development/SKILL.md`  
**Platform**: iOS only  
**Priority**: High

**Purpose**: Modern iOS development with Swift 6, iOS 18+, SwiftUI, UIKit, and XcodeBuildMCP automation

**When Active**:
- User mentions iOS, Swift, SwiftUI, UIKit
- Building iPhone/iPad apps
- iOS-specific operations
- Xcode automation commands

**Specialized Sub-Skills** (3 referenced files):

#### Sub-Skill 1: Development Patterns (`development.md`)
- Swift 6 concurrency (async/await, Sendable, Actors)
- SwiftUI vs UIKit strategy selection
- Architecture patterns (MVVM, TCA)
- State management (@Observable, property wrappers)
- NavigationStack implementation
- Networking with URLSession
- Persistence (SwiftData, Core Data)
- Common UI components
- Debugging patterns

#### Sub-Skill 2: Build & Simulator Management (`build.md`)
- Xcode project configuration
- Build settings and schemes
- Swift Package Manager
- Dependency management (SPM, CocoaPods)
- Asset catalogs and resources
- Code signing and provisioning
- Build optimization
- Simulator management (xcrun simctl + XcodeBuildMCP)
- Common build errors and fixes
- MCP tool patterns (discover_projs, list_schemes, build_sim, etc.)

#### Sub-Skill 3: Testing Strategies (`tester.md`)
- XCTest patterns (unit tests)
- XCUITest patterns (UI tests)
- Mock dependencies setup
- Given-When-Then structure
- Async/await testing
- Coverage goals and reporting
- Test organization
- Accessibility identifiers for UI testing
- MCP test automation (test_sim, test_device)

**XcodeBuildMCP Integration** (when available):
- **Autonomous Operations**: Auto-discover projects, build automation, simulator management, testing automation
- **UI Automation**: Tap, swipe, type, screenshot, describe_ui hierarchy
- **Log Capture**: Stream simulator/device logs
- **Environment Validation**: Run diagnostics
- **Prerequisites**: macOS 14.5+, Xcode 16.x+, `claude mcp add XcodeBuildMCP npx xcodebuildmcp@latest`

**Core Expertise**:
- Swift 6 concurrency patterns
- SwiftUI vs UIKit tradeoffs
- MVVM and TCA architecture
- State management with @Observable
- Dependency injection
- NavigationStack patterns
- Async URLSession networking
- SwiftData/Core Data persistence
- XCTest and XCUITest

**Key Patterns**:
```swift
// @Observable (iOS 17+)
@Observable
class ProductsViewModel {
    var products: [Product] = []
    var isLoading = false
    
    func loadProducts() async {
        isLoading = true
        defer { isLoading = false }
        products = try await productService.fetch()
    }
}

// NavigationStack
enum Route: Hashable { case product(Product); case settings }
struct AppView: View {
    @State private var path: [Route] = []
    var body: some View {
        NavigationStack(path: $path) {
            HomeView()
                .navigationDestination(for: Route.self) { route in /* handle */ }
        }
    }
}

// Actor for Thread-Safety
actor NetworkManager {
    func fetch(_ url: URL) async throws -> Data { /* thread-safe */ }
}
```

**MCP Workflow Examples**:
```swift
// Build for Simulator
mcp__xcodebuildmcp__discover_projs({ workspaceRoot: '.' })
mcp__xcodebuildmcp__list_schemes({ workspacePath: 'MyApp.xcworkspace' })
mcp__xcodebuildmcp__build_sim({
  workspacePath: 'MyApp.xcworkspace',
  scheme: 'MyApp',
  simulatorId: 'iPhone-16-Pro-UUID'
})

// Run Tests
mcp__xcodebuildmcp__test_sim({
  projectPath: 'MyApp.xcodeproj',
  scheme: 'MyApp',
  simulatorId: 'UUID'
})

// UI Automation (always describe_ui first!)
mcp__xcodebuildmcp__describe_ui({ simulatorId: 'UUID' })
mcp__xcodebuildmcp__tap({ simulatorId: 'UUID', x: 100, y: 200 })
```

**Tech Stack**: iOS 18+ SDK, Swift 6.0+, SwiftUI (primary)/UIKit (fallback), SwiftData, XCTest/XCUITest, XcodeBuildMCP

---

### 3.2 Android Development Skill
**Location**: `.claude/skills/android/android-development/SKILL.md`  
**Platform**: Android only  
**Status**: Skeleton (placeholder)  
**Priority**: Medium (future)

**Purpose**: Android development patterns with Kotlin and Jetpack Compose

**When Active**:
- User mentions Android, Kotlin, Jetpack Compose
- Building Android features or platform-specific functionality

**Future Content** (not yet populated):
- Kotlin coding patterns (Coroutines, Flow, sealed classes, data classes)
- Jetpack Compose UI (Composables, state management, navigation, theming)
- Android architecture (MVVM, Clean Architecture, repository pattern)
- Gradle build (variants, dependencies, plugins, ProGuard)
- Android testing (JUnit 5, Espresso, MockK, coroutine testing)
- Platform APIs (permissions, background work, notifications, sensors)

**Status**: This is a placeholder skill awaiting population with comprehensive patterns

---

## 4. SHARED INFRASTRUCTURE SKILLS

### 4.1 Databases Skill
**Location**: `.claude/skills/databases/SKILL.md`  
**Platform**: All  
**Priority**: High

**Purpose**: Database design and query optimization

**When Active**:
- User mentions database, SQL, schema, migration
- Database design questions
- Query performance problems
- Schema architecture decisions

**Expertise Areas**:
- **Schema Design**: Entity relationships, normalization (1NF-3NF), denormalization strategies, index selection
- **Indexing**: Primary keys, foreign key indexes, composite indexes, partial indexes, covering indexes
- **Query Optimization**: EXPLAIN analysis, query patterns, JOIN optimization, subquery vs JOIN, N+1 prevention
- **Migrations**: Version control, rollback strategies, data preservation, breaking changes
- **ORM Usage**: Prisma patterns, Drizzle ORM, type-safe queries, transaction handling
- **Relationships**: One-to-one, one-to-many, many-to-many, polymorphic relations

**Key Patterns** (Prisma):
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}

// Transactions
await prisma.$transaction(async (tx) => {
  await tx.user.create({ data: {...} });
  await tx.post.create({ data: {...} });
});

// Query with Relations
const user = await prisma.user.findUnique({
  where: { id },
  include: { posts: true }
});

// Migrations
prisma migrate dev --name add_users_table
```

**Design Principles**:
- Normalize to 3NF initially
- Add indexes for frequent queries
- Consider denormalization for read-heavy workloads
- Use transactions for multi-step operations
- Foreign keys for referential integrity
- Cascade delete/update cautiously

**Dependencies**: PostgreSQL (recommended), Prisma/Drizzle ORM, migration tools

---

### 4.2 Docker Skill
**Location**: `.claude/skills/docker/SKILL.md`  
**Platform**: All  
**Priority**: High

**Purpose**: Containerization for development and deployment

**When Active**:
- User mentions Docker, containers, deployment
- Dockerfile optimization
- Container orchestration
- Development environment setup

**Expertise Areas**:
- **Dockerfile Patterns**: Multi-stage builds, layer optimization, caching strategies, security scanning
- **Docker Compose**: Service definition, volume management, network config, environment variables
- **Build Optimization**: Layer ordering, .dockerignore, BuildKit features, cache mounts
- **Production Patterns**: Minimal base images, non-root user, health checks, signal handling
- **Volume Management**: Named volumes, bind mounts, volume drivers, backup strategies
- **Network Configuration**: Bridge networks, overlay networks, service discovery, load balancing

**Key Patterns**:
```dockerfile
# Multi-stage Node.js Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/index.js"]
```

```yaml
# Development Compose
version: '3.8'
services:
  app:
    build: .
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
  db:
    image: postgres:15
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

volumes:
  postgres-data:
```

**.dockerignore**:
```
node_modules
npm-debug.log
.git
.env
*.md
```

**Best Practices**:
- Use specific version tags
- Run as non-root user
- Minimize layers
- COPY before RUN for cache efficiency
- Use health checks
- Don't bundle development dependencies

**Dependencies**: Docker Engine 20+, Docker Compose v2

---

### 4.3 Research Skill
**Location**: `.claude/skills/research/SKILL.md`  
**Platform**: All  
**Priority**: Medium

**Purpose**: Multi-source information gathering and validation

**When Active**:
- User asks for research, best practices, technology comparisons
- Before architecture decisions
- Exploring unfamiliar technologies
- Conducting technical due diligence

**Expertise Areas**:
- **Source Evaluation**: Check documentation currency, verify author credibility, cross-reference claims, identify outdated info
- **Information Synthesis**: Combine multiple sources, identify consensus, note conflicts, extract patterns
- **Cross-Validation**: Verify across 3+ sources, check citations, test code examples, validate recency
- **Documentation Navigation**: Find relevant sections, understand API references, follow guides, read examples
- **Code Example Discovery**: GitHub repos, CodeSandbox, official examples, Stack Overflow snippets
- **Trend Analysis**: Recent developments, deprecations, new best practices, community direction

**Research Process**:
1. Define: What are we researching?
2. Search: Multiple sources (docs, blogs, repos)
3. Evaluate: Source credibility and recency
4. Synthesize: Combine findings
5. Validate: Cross-check across sources
6. Document: Organize findings

**Source Priority**:
1. Official documentation (highest)
2. Official examples/tutorials
3. Well-known community resources
4. GitHub repos with activity
5. Stack Overflow (for specific issues)

**Output Format**:
```markdown
# Research: [Topic]

## Summary
[2-3 sentence overview]

## Key Findings
- Finding 1 (sources: A, B, C)
- Finding 2 (sources: D, E)

## Sources Reviewed
- Source 1 (Date) - [key takeaway]
- Source 2 (Date) - [key takeaway]

## Recommendations
[Based on research and cross-validation]

## Confidence Level
[High/Medium/Low] - based on source consistency

## Caveats
[Limitations, version-specific info, conflicting opinions]
```

**Advanced Techniques**:
- **Query Fan-Out**: Ask multiple related questions in parallel to reduce total research time
- **Source Validation**: Cross-reference claims across 3+ sources, check if multiple sources cite same research
- **Technology Trend ID**: Check GitHub stars/activity, review changelogs, community sentiment, maintenance status
- **Code Example Validation**: Test in isolated environment, verify version match, check error handling, check performance

**Best Practices**:
- Prioritize official docs
- Check publication dates (prefer <2 years)
- Verify code examples work
- Note version-specific info clearly
- Cite sources with URLs and dates
- Cross-validate findings
- Document contradictions
- Track confidence level per finding

---

## 5. UTILITY SKILLS

### 5.1 Repomix Skill
**Location**: `.claude/skills/repomix/SKILL.md`  
**Platform**: All  
**Priority**: Medium (utility)

**Purpose**: Generate comprehensive codebase summaries for analysis and understanding

**When Active**:
- User needs codebase overview
- Unfamiliar with repository structure
- Preparing for full codebase analysis
- Onboarding new developers
- Before major refactoring

**Usage**:
```bash
# Local project
repomix
# Output: repomix-output.xml

# Remote repository
repomix --remote https://github.com/owner/repo

# With configuration
# Create .repomixignore (same syntax as .gitignore)
```

**Common Patterns**:
- Generate summary before full codebase review
- Create `docs/codebase-summary.md` from repomix output
- Check freshness: regenerate if >2 days old
- Use for unfamiliar codebases and onboarding

**Output Analysis**:
- Extract file structure and size metrics
- Identify key entry points
- Understand module organization
- Find documentation files
- Note configuration files

**Integration with Other Skills**:
- **With Code Review**: Use summary to understand scope
- **With Debugging**: Use for context before deep dive
- **With Documentation**: Extract structure for docs
- **With Planning**: Use to assess complexity

**Best Practices**:
- Generate fresh summary at project start
- Include summary in onboarding docs
- Update when major restructuring happens
- Use .repomixignore for large monorepos
- Reference summary in documentation
- Cross-check with actual repo structure

---

### 5.2 Documentation Seeker Skill
**Location**: `.claude/skills/docs-seeker/SKILL.md`  
**Platform**: All  
**Priority**: Medium (utility)

**Purpose**: Finding and reading documentation for packages, libraries, and frameworks

**When Active**:
- User needs documentation
- Unfamiliar with a library
- Need API reference
- Exploring library features

**Search Strategy** (priority order):
1. **Context7 MCP (preferred)**: `resolve-library-id` then `query-docs` for up-to-date docs
2. **WebSearch**: "[library name] documentation [version] [topic]"
3. **Official Docs**: Use WebFetch to read official documentation websites
4. **GitHub Repository**: Use `gh` CLI or repomix to read source docs

**Source Priority**:
1. Official docs (most authoritative)
2. Context7 library docs
3. GitHub repository README/docs
4. Community resources (Stack Overflow, blogs)

**Effective Query Patterns**:
- "[library] [version] [topic]" - precise searches
- "how to [task] in [library]" - task-oriented
- "[error message]" - for debugging docs
- "[library] examples" - for code samples

**Error Handling**:
- If Context7 fails, fall back to WebSearch
- If no docs found, check package README (npm/PyPI/CocoaPods)
- Always note when documentation may be outdated
- Verify version-specific info matches target

**Best Practices**:
- Always specify version when searching
- Check documentation date (prefer recent)
- Look for official examples first
- Read Getting Started before API reference
- Cross-reference with source code if unclear
- Note breaking changes between versions

---

## SKILLS ORGANIZATION & INTEGRATION

### Category Summary

| Category | Skills | Platform | Priority |
|----------|--------|----------|----------|
| Core Cognitive | Planning, Debugging, Code Review, Problem Solving, Sequential Thinking | All | High |
| Web Platform | Frontend Dev, Backend Dev, Next.js, shadcn-ui, Better Auth | Web | High |
| Mobile Platform | iOS Dev (3 sub), Android Dev (skeleton) | Mobile | High/Medium |
| Shared Infrastructure | Databases, Docker, Research | All | High/Medium |
| Utilities | Repomix, Docs Seeker | All | Medium |

### Skill Activation Triggers

**Keyword-Based Triggers**:
- "plan" / "planning" → Planning Skill
- "debug" / "error" / "not working" → Debugging Skill
- "review" / "code review" → Code Review Skill
- "problem" / "stuck" → Problem Solving + Sequential Thinking
- "React" / "frontend" / "UI" → Frontend Development
- "API" / "backend" / "server" → Backend Development
- "Next.js" / "Server Components" → Next.js Skill
- "shadcn" / "Radix" → shadcn-ui Skill
- "auth" / "login" / "OAuth" → Better Auth Skill
- "iOS" / "Swift" / "SwiftUI" → iOS Development
- "Android" / "Kotlin" / "Compose" → Android Development
- "database" / "SQL" / "schema" / "migration" → Databases Skill
- "Docker" / "container" / "deployment" → Docker Skill
- "research" / "best practices" / "comparison" → Research Skill
- "documentation" / "docs" / "API reference" → Docs Seeker Skill
- "codebase" / "structure" / "overview" → Repomix Skill

**Command-Based Triggers**:
- `/plan` → Planning Skill
- `/debug` → Debugging Skill
- `/review` → Code Review Skill

### Skill Dependencies & Relationships

```
Planning Skill
  ├→ depends on: Research Skill
  ├→ feeds into: Implementation phase
  └→ supports: Code Review, Debugging

Debugging Skill
  ├→ integrates: Sequential Thinking, Problem Solving
  ├→ platform-specific: iOS, Android, Web tools
  └→ validates: Code Review

Code Review Skill
  ├→ verifies: Planning outcomes
  ├→ checks: Debugging thoroughness
  └→ gates: Commit/push

Problem Solving & Sequential Thinking
  ├→ support: Debugging
  ├→ support: Architecture decisions
  └→ support: Root cause analysis

Platform Skills (Web/iOS/Android)
  ├→ implement per: Planning Skill
  ├→ validated by: Code Review + Debugging
  └→ documented by: Research + Docs Seeker

Infrastructure Skills (DB, Docker, Research)
  ├→ shared across: All platforms
  ├→ used by: Planning, Architecture
  └→ documented by: Docs Seeker

Utility Skills (Repomix, Docs Seeker)
  ├→ support: All other skills
  ├→ enable: Onboarding, research
  └→ facilitate: Discovery
```

### Invocation Methods

**1. Explicit Command Delegation**:
```
User: "/plan build authentication system"
→ Planning Skill activates
→ May delegate to Research Skill for OAuth patterns
→ Creates plan file in ./plans/

User: "/review the authentication implementation"
→ Code Review Skill activates
→ Reads plan file for context
→ Reviews recent commits/diffs
→ Generates review report

User: "/debug login failing with 401"
→ Debugging Skill activates
→ Systematic 6-step debugging process
→ May use Sequential Thinking for complex analysis
```

**2. Keyword-Based Activation**:
```
User: "I'm building a React component for user profiles"
→ Frontend Development Skill auto-activates
→ Provides React patterns, hooks advice

User: "Database queries are slow, how do I optimize?"
→ Databases Skill auto-activates
→ Provides indexing, query analysis guidance
```

**3. Problem-Detected Activation**:
```
If build fails:
→ Debugging Skill may auto-activate
→ Requests error logs for analysis

If tests fail:
→ Problem Solving + Debugging
→ Conducts root cause analysis
```

### Configuration & Setup Requirements

Most skills require:
- **Node.js 20+** (for web, backend, frontend)
- **Xcode 16.x** (for iOS development with MCP)
- **PostgreSQL 15+** (recommended for database skill)
- **Docker 20+** (for containerization)
- **TypeScript** (for type safety across skills)

Optional:
- **XcodeBuildMCP** (for iOS automation)
- **Context7 MCP** (for documentation lookups)
- **Repomix CLI** (for codebase summarization)

---

## BEST PRACTICES & USAGE GUIDELINES

### For Skill Activation

1. **Use explicit commands when clear about scope**: `/plan`, `/review`, `/debug`
2. **Rely on keyword matching for exploratory work**: Just mention what you're working on
3. **Chain skills sequentially for complex tasks**: Plan → Research → Implement → Review → Debug (if needed)
4. **Use platform detection to load appropriate skills**: File extension or project structure determines platform skills loaded

### For Skill Integration

1. **Planning always precedes implementation**: Ensures clear requirements and architecture
2. **Code Review gates commits**: Catches issues before they enter codebase
3. **Debugging validates fixes**: Ensures root cause addressed, not symptoms
4. **Research supports decision-making**: Validates technical choices
5. **Documentation Seeker enables all skills**: Keeps teams aligned on latest patterns

### For Multi-Skill Workflows

**Feature Development** (Sequential):
```
1. Planning: Define scope, break into tasks
2. Research: Explore relevant technologies/patterns
3. Implementation: Code per platform (Web, iOS, Android)
4. Testing: Test coverage and integration
5. Code Review: Quality gate
6. Documentation: Update docs
```

**Bug Investigation** (Parallel investigation, Sequential fix):
```
1. Debugging: Reproduce and isolate
2. Sequential Thinking: Analyze root cause
3. Problem Solving: Evaluate hypotheses
4. Code Review: Validate fix approach
5. Implementation: Apply fix
6. Testing: Regression testing
```

**Architecture Decision**:
```
1. Research: Explore options
2. Sequential Thinking: Analyze tradeoffs
3. Planning: Document decision and migration path
4. Implementation: Roll out
5. Code Review: Validate against architecture
```

---

## UNRESOLVED QUESTIONS

1. **Android Development Completion**: When will the Android Development skill be fully populated with Kotlin/Compose patterns?
2. **XcodeBuildMCP Availability**: Is XcodeBuildMCP available in current environment? (Required for iOS MCP automation)
3. **Context7 MCP Availability**: Is Context7 MCP configured for documentation lookups? (Preferred for docs-seeker)
4. **Skill Versioning**: How are skill versions tracked and updated across the agent kit? (Important for long-term maintenance)
5. **Custom Skill Extension**: Mechanism for adding new skills to catalog? (For project-specific requirements)

---

**Report Generated**: 2026-02-05 22:50  
**Total Skills Documented**: 17  
**Total Sub-Skills**: 3 (iOS)  
**Skeleton Skills**: 1 (Android)  
**Lines of Code Analyzed**: ~3,028 LOC

