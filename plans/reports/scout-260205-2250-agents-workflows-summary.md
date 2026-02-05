# epost_agent_kit: Agents & Workflows Architecture Summary

**Report Generated**: 2026-02-05  
**Scope**: .claude/agents/ (15 files), .claude/workflows/ (3 files)  
**Total LOC**: ~3,520 lines  

---

## Executive Summary

epost_agent_kit is a comprehensive multi-platform agent orchestration framework with 15 specialized agents and 3 workflow patterns. The system implements hierarchical parent-child delegation: global agents orchestrate tasks, platform agents execute implementations across web (Next.js/React/TypeScript), iOS (Swift/SwiftUI), and Android (Kotlin/Jetpack Compose).

**Key Architecture**: Task routing → global agent specialization → platform delegation → parallel execution → unified reporting.

---

## Directory Overview

### `.claude/agents/` (15 agents, ~3,234 LOC)
Specialized agents handling distinct responsibilities in multi-platform development lifecycle.

### `.claude/workflows/` (3 workflows, ~286 LOC)
Predefined orchestration patterns for feature development, bug fixing, and project initialization.

---

## Part 1: Global Orchestration Agents (9 agents)

### 1. **epost-orchestrator** (~157 LOC)
**Model**: haiku | **Color**: green  
**Purpose**: Top-level task router and project manager

**Core Responsibilities**:
- Analyzes user requests and detects platform context (.tsx, .swift, .kt)
- Routes tasks to specialized agents (architect, implementer, reviewer, etc.)
- Tracks progress across all platforms and milestones
- Manages implementation plan lifecycle in `./plans` directory
- Collects and synthesizes reports from delegated agents
- Updates project documentation when phase status changes
- Verifies YAML frontmatter in plan files (title, description, status, priority, effort, branch, tags, created)

**Routing Logic**:
```
User Request
├── Planning → epost-architect
├── Implementation → epost-implementer (then platform agent)
├── Bug/Debug → epost-debugger (then platform agent)
├── Testing → epost-tester (then platform agent)
├── Code Review → epost-reviewer (then platform agent)
├── Documentation → epost-documenter
├── Git Operations → epost-git-manager
├── Research → epost-researcher
└── Project Oversight → (self - analysis & coordination)
```

**Key Outputs**: Clear delegation, platform context identification, task requirements summary, plan updates, documentation coordination triggers, next steps/priorities.

---

### 2. **epost-architect** (~193 LOC)
**Model**: opus | **Color**: blue  
**Purpose**: Architecture planning and detailed implementation plan creation

**Core Process**:
1. Parse feature requirements
2. Spawn 3 researchers in parallel (best practices, codebase analysis, dependencies)
3. Aggregate research findings
4. Create implementation plan with file ownership

**Plan Template Requirements**:
- YAML frontmatter: title, description, status (pending/in-progress/completed/cancelled), priority (P1/P2/P3), effort, branch, tags, created date
- Summary section
- Key Dependencies
- Research Findings (3 sections: best practices, codebase patterns, dependencies & conflicts)
- Implementation Steps (numbered)
- Phase Links
- Files to Create/Modify
- Risk Assessment
- Test Cases
- Estimated Complexity
- Next Steps

**Output**: `plans/YYMMDD-HHMM-{slug}/plan.md` with comprehensive breakdown and phase files.

---

### 3. **epost-researcher** (~185 LOC)
**Model**: haiku | **Color**: purple  
**Purpose**: Expert technology research and technical decision support

**Research Methodology** (4 phases):
1. **Question Analysis**: Parse concepts, identify search terms, define research scope
2. **Multi-Source Gathering**: WebSearch, WebFetch, GitHub, docs-seeker, community consensus
3. **Information Synthesis**: Cross-reference, verify accuracy, identify patterns
4. **Findings Organization**: Extract best practices, code examples, trade-offs, recommendations

**Research Categories**:
- Best Practices Research (patterns, performance, security)
- Technology Evaluation (alternatives comparison)
- Codebase Analysis (existing patterns via Glob/Grep)
- Dependency & Package Research (compatibility, vulnerabilities)
- Documentation Lookup (official docs and guides)

**Source Priority**: Official documentation > GitHub repositories > Web search > Community discussions

**Output Format**: Research report with sources, key findings, best practices, technology comparisons, code examples, trade-offs, consensus vs experimental approaches, unresolved questions.

---

### 4. **epost-implementer** (~135 LOC)
**Model**: sonnet | **Color**: green  
**Purpose**: Implementation agent executing phases from parallel plans

**Execution Process**:
1. **Phase Analysis**: Read phase file, verify file ownership, understand parallelization
2. **Pre-Implementation Validation**: Confirm file exclusivity, read project docs, verify dependencies complete
3. **Implementation**: Execute steps sequentially, modify ONLY owned files, follow architecture exactly
4. **Quality Assurance**: Type checks (npm run typecheck), tests (npm test), fix errors
5. **Completion Report**: Document modifications, task status, test results

**File Ownership Rules** (CRITICAL):
- NEVER modify files not listed in phase's "File Ownership" section
- NEVER read/write files owned by other parallel phases
- STOP immediately if file conflict detected
- Only proceed with confirmed exclusive ownership

**Platform Delegation**:
- Web: `web/implementer` (Next.js/React/TypeScript)
- iOS: `ios/implementer` (Swift/SwiftUI)
- Android: `android/implementer` (Kotlin/Jetpack Compose)

**Output**: Phase implementation report with files modified, tasks completed, tests status, issues encountered, next steps.

---

### 5. **epost-tester** (~161 LOC)
**Model**: haiku | **Color**: yellow  
**Purpose**: Comprehensive QA and testing validation

**Core Responsibilities**:
1. **Test Execution**: Run unit, integration, E2E test suites
2. **Coverage Analysis**: Generate reports, identify gaps, target 80%+
3. **Error Scenario Testing**: Edge cases, exceptions, boundary conditions
4. **Performance Validation**: Benchmarks, test execution time, resource issues
5. **Build Process Verification**: Success validation, dependency resolution, CI/CD compatibility

**Multi-Framework Support**:
- JS/TS: npm test, yarn test, pnpm test, bun test
- Python: pytest, unittest
- Go: go test
- Rust: cargo test
- Flutter: flutter test

**Platform Delegation**:
- Web: `web/tester` (Vitest, Playwright, React Testing Library)
- iOS: `ios/tester` (XCTest, XCUITest, Swift Testing)
- Android: `android/tester` (JUnit, Espresso, Compose UI tests)

**Output**: Summary report with test overview, coverage metrics, failed tests details, performance metrics, build status, critical issues, recommendations, next steps.

---

### 6. **epost-reviewer** (~264 LOC)
**Model**: sonnet | **Color**: yellow  
**Purpose**: Comprehensive code review and security analysis

**Review Process**:
1. Start with plan context, identify TODO tasks
2. Use scout for relevant code files
3. Establish review scope
4. Assess code quality (structure, organization, logic correctness, type safety, error handling)
5. Security audit (OWASP Top 10)
6. Performance analysis (algorithms, queries, resources)
7. Task completion verification
8. Build/deploy validation

**Security Coverage** (OWASP Top 10):
- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection
- A04: Insecure Design
- A05: Security Misconfiguration
- A06: Vulnerable Components
- A07: Authentication Failures
- A08: Data Integrity Failures
- A09: Logging & Monitoring Gaps
- A10: SSRF

**Severity Prioritization**: Critical (security vulns, data loss, build failures) → High (performance, type issues, missing error handling) → Medium (code smells, docs gaps) → Low (style, minor optimizations)

**Output**: Code review summary with scope, assessment, critical issues, high/medium/low findings, task completion status, OWASP coverage, positive observations, recommendations, metrics, next steps.

---

### 7. **epost-debugger** (~216 LOC)
**Model**: sonnet | **Color**: red  
**Purpose**: Root cause analysis and systematic issue diagnosis

**Investigation Methodology** (5 stages):
1. **Initial Assessment**: Symptoms, affected components, severity, recent changes
2. **Data Collection**: Database queries (psql), logs, CI/CD pipelines (gh), metrics
3. **Analysis Process**: Event correlation, pattern identification, execution path tracing
4. **Root Cause Identification**: Systematic elimination, hypothesis validation, chain of events
5. **Solution Development**: Targeted fixes, optimizations, preventive measures

**Systematic Debugging Framework**:
1. Reproduce (consistent issue reproduction)
2. Isolate (minimal reproduction case)
3. Analyze (actual code execution)
4. Hypothesize (possible causes)
5. Verify (fix validation)

**Platform Delegation** (for fix implementation):
- Web: `web/implementer` or `web/tester`
- iOS: `ios/implementer` or `ios/tester`
- Android: `android/implementer` or `android/tester`

**Output**: Debug analysis with issue description, root cause, evidence (file:line), affected files, recommended fix, verification steps, prevention strategies, related issues.

---

### 8. **epost-documenter** (~203 LOC)
**Model**: haiku | **Color**: blue  
**Purpose**: Technical documentation management and maintenance

**Core Responsibilities**:
1. **Standards & Implementation**: Establish API design guidelines, testing strategies, security protocols
2. **Documentation Analysis**: Analyze existing docs, identify gaps/inconsistencies, cross-reference with codebase
3. **Code-to-Doc Synchronization**: Track changes, update affected docs, document breaking changes
4. **PDR Creation**: Define functional/non-functional requirements, acceptance criteria, technical constraints
5. **Developer Productivity**: Minimize time-to-understanding, provide quick references, onboarding docs

**Key Documents Managed**:
- `./docs/code-standards.md` - Codebase structure and conventions
- `./docs/system-architecture.md` - System design and components
- `./docs/development-roadmap.md` - Project phases and milestones
- `./docs/project-changelog.md` - Significant changes and features
- `./docs/codebase-summary.md` - High-level overview (generated via repomix)
- `./docs/project-overview-pdr.md` - Product Development Requirements

**Large File Handling**:
- Gemini CLI for 2M context: `echo "[question] in [path]" | gemini -y -m gemini-2.5-flash`
- Chunked Read with offset/limit
- Targeted Grep searches

**Output**: Documentation updates, gaps identified, recommendations, metrics (coverage %, update frequency), maintenance status.

---

### 9. **epost-git-manager** (~402 LOC)
**Model**: haiku | **Color**: purple  
**Purpose**: Git workflow automation with security scanning

**Strict Execution** (2-4 tool calls only):
- TOOL 1: Stage + Security + Metrics + Split Analysis (compound command)
- TOOL 2: Split Strategy (if needed)
- TOOL 3: Generate Commit Message
- TOOL 4: Commit + Push

**TOOL 1 Output Analysis**:
- LINES: total insertions + deletions
- FILES: number of files changed
- SECRETS: count of secret patterns detected
- FILE GROUPS: categorized file list

**Split Decision Logic** (multiple commits if):
1. Different types mixed (feat + fix, feat + docs, code + deps)
2. Multiple scopes in code (frontend + backend, auth + payments)
3. Config/deps + code mixed
4. FILES > 10 with unrelated changes

**Keep single commit if**:
- All files same type/scope
- FILES ≤ 3, LINES ≤ 50
- All files logically related

**Commit Message Format**: `type(scope): description` (<72 chars)
- Types: feat, fix, docs, style, refactor, test, chore, perf, build, ci
- NO AI attribution (CRITICAL)

**Pull Request Workflow**:
1. Sync and analyze remote state
2. Generate PR title and body
3. Create PR with gh command

**Token Optimization**: 3 tools @ 5K tokens = $0.015/commit (vs baseline $0.078, 81% savings)

**Output**: Staged summary (files, security status), commit info (hash, message), push status, or multi-commit breakdown.

---

## Part 2: Platform-Specific Developer Agents (3 agents)

### 10. **epost-web-developer** (~341 LOC)
**Model**: sonnet | **Color**: green  
**Tech Stack**: Next.js 15+, React 19+, TypeScript 5+, Tailwind CSS 4+, shadcn/ui, Better Auth, Vitest, Playwright

**Core Competencies**:
- Frontend implementation (responsive React/Next.js)
- Full-stack development (API routes, server components, DB integration)
- Testing & quality (unit, E2E, type checking, build validation)
- Design implementation (Figma to code with Tailwind)
- Performance optimization (code splitting, lazy loading)

**Implementation Steps**:
1. Verify project context (Next.js structure, package.json)
2. Activate skills: web/nextjs, web/frontend-development, web/backend-development, web/shadcn-ui, web/better-auth
3. Implement code (App Router, TypeScript strict mode, Tailwind utilities, React Server Components)
4. Design implementation (analyze layouts, select components, implement layout, add interactivity, ensure accessibility)
5. Testing (component, hook, API, E2E tests)
6. Quality verification (build, lint, type check)

**File Structure**:
- `app/` - App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Utilities and shared logic
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions

**Accessibility Checklist**: Semantic HTML, ARIA labels, keyboard navigation, focus indicators, WCAG AA color contrast, alt text, form labels.

**Coverage Goals**: Minimum 80% overall, components 90%+, utilities 95%+, API routes 80%+.

**Build Commands**: dev (npm run dev), build (npm run build), lint (npm run lint), typecheck (npx tsc --noEmit), test (npm test), coverage (npm test -- --coverage), E2E (npx playwright test).

---

### 11. **epost-ios-developer** (~313 LOC)
**Model**: sonnet | **Color**: blue  
**Tech Stack**: Swift 6, iOS 18+, SwiftUI (default), UIKit (when needed), XCTest, XCUITest, Swift Testing, async/await, actors, @MainActor

**Core Competencies**:
- Implementation (models with @Model, ViewModels with @Observable, SwiftUI views, URLSession networking)
- Testing (XCTest unit tests, XCUITest UI tests, Swift Testing framework iOS 18+)
- Simulator management (lifecycle, app operations, diagnostics)
- Build verification (xcodebuild, error reporting)

**Project Discovery**:
- Primary: `mcp__xcodebuildmcp__discover_projs` (MCP tool)
- Fallback: Glob for *.xcodeproj, *.xcworkspace
- List schemes: `mcp__xcodebuildmcp__list_schemes`

**Build Verification**:
- Primary: `mcp__xcodebuildmcp__build_sim`
- Fallback: `xcodebuild -scheme <name> -sdk iphonesimulator build`
- Diagnostics: `mcp__xcodebuildmcp__doctor`

**Testing Strategy**:
- Unit tests (XCTest) for ViewModels, models, networking
- UI tests (XCUITest) for critical flows
- Edge cases (empty states, errors, timeouts)
- Concurrency tests (async/await correctness)
- Coverage target: 80%+ overall, 90%+ for business logic

**Test Execution**:
- Primary: `mcp__xcodebuildmcp__test_sim`
- Fallback: `xcodebuild test -scheme <name> -sdk iphonesimulator`

**Simulator Commands**: list devices, boot, install app, launch, screenshot, video recording, reset.

**Rules**: SwiftUI first (UIKit when needed), use @Observable (not ObservableObject), async/await (not completion handlers), @MainActor for UI updates, write business logic tests, build after each step, Swift Testing for new tests (iOS 18+), XCTest for backward compatibility.

---

### 12. **epost-android-developer** (~290 LOC)
**Model**: sonnet | **Color**: green  
**Tech Stack**: Kotlin, Android 14+ (API 34+), Jetpack Compose, MVVM with ViewModel + StateFlow, JUnit, Espresso, Kotlin Coroutines, Flow

**Core Responsibilities**:
1. **Pre-Implementation Validation**: File ownership, docs review, dependency verification
2. **Implementation**: Data classes/Room entities, ViewModels with StateFlow, Jetpack Compose UI, Retrofit/Ktor networking, JUnit tests
3. **Quality Assurance**: Linting (./gradlew lint, ktlintCheck), unit tests (./gradlew test), instrumentation tests (./gradlew connectedAndroidTest), coverage (./gradlew jacocoTestReport)
4. **Completion Report**: Files modified, tasks completed, tests status, build verification

**File Ownership Rules** (CRITICAL):
- NEVER modify files not listed in phase's "File Ownership" section
- NEVER read/write files owned by other parallel phases
- STOP and report immediately if conflict detected

**Build Commands**:
- Development: ./gradlew assembleDebug, ./gradlew installDebug, ./gradlew build, ./gradlew clean build
- Testing: ./gradlew test, ./gradlew connectedAndroidTest, ./gradlew jacocoTestReport
- Linting: ./gradlew lint, ./gradlew ktlintCheck

**Testing Patterns**:
- Unit tests (JUnit) for ViewModels, repositories, use cases
- Compose UI tests for composables
- Instrumentation tests (Espresso) for critical flows
- Coverage goals: 80% overall, 90% ViewModels, 95% utilities, 70% UI

**Development Guidelines**: MVVM with ViewModel/StateFlow (not LiveData), Coroutines + Flow, Jetpack Compose (no XML), Material 3 design, light/dark themes, edge case handling, code standards compliance.

---

## Part 3: Specialized Support Agents (3 agents)

### 13. **epost-scout** (~147 LOC)
**Model**: haiku | **Color**: green  
**Purpose**: Multi-platform codebase exploration and file discovery

**Core Mission**: Rapidly locate relevant files across large codebases using parallel search strategies (Glob, Grep, Read).

**Multi-Platform Awareness**:
- **Platform Detection**: File extensions (.swift/.m/.h = iOS, .kt/.java = Android, .ts/.tsx/.js/.jsx = Web)
- **Project Structure**: Package.swift (iOS), build.gradle (Android), package.json (Web)
- **Explicit Prefix**: /web:, /ios:, /android: in query

**Cross-Platform Search Strategy**:
- **Shared code**: lib/, utils/, types/, shared/, constants/
- **Platform-specific**: app/web/, app/ios/, app/android/, packages/web/, packages/ios/, packages/android/
- **Configuration**: *.config.ts/.js, gradle.properties, xcconfig, .env
- **Dependencies**: package.json, Podfile, build.gradle, pubspec.yaml

**Platform-Specific Patterns**:
- **Web**: Routes (app/api/, app/routes/, pages/), Components (components/, features/), Utilities (lib/, utils/), Types (types/, interfaces/), Tests (__tests__/, *.test.ts)
- **iOS**: Views (Views/, Screens/, *View.swift), ViewModels (*ViewModel.swift), Models (Models/, Domain/), Services (Services/, Network/), Tests (*Tests.swift, Test/)
- **Android**: Activities/Compose (ui/screens/, ui/activity/), ViewModels (*ViewModel.kt), Models (model/, domain/), Repositories (repository/, data/), Tests (*Test.kt, androidTest/)

**Operational Protocol**:
1. Analyze search request and identify key directories
2. Divide codebase into logical sections for parallel searching
3. Craft precise search queries for each section
4. Execute Glob, Grep, Read tools in parallel
5. Synthesize results by deduplication, organization, platform grouping, relevance ranking

**Output**: Concise file list organized by category/platform with platform-specific context for downstream agent delegation.

---

### 14. **epost-brainstormer** (~91 LOC)
**Model**: haiku | **Color**: purple  
**Purpose**: Creative ideation and multi-platform problem-solving

**Core Principles**: YAGNI, KISS, DRY + multi-platform system architecture expertise.

**Expertise**: Multi-platform architecture, cross-platform constraints (web/iOS/Android), risk assessment, development time optimization, UX/DX optimization, technical debt management, performance bottlenecks.

**Approach**:
1. **Question Everything**: Ask probing questions about requirements, constraints, platform specifics, true objectives
2. **Brutal Honesty**: Provide frank feedback on feasibility, over-engineering, platform incompatibility
3. **Explore Alternatives**: Present 2-3 viable solutions with clear pros/cons
4. **Challenge Assumptions**: Question initial approaches
5. **Consider All Stakeholders**: Impact on users, developers, operations, business

**Multi-Platform Coordination**:
- Cross-platform concerns: API contracts, data sync, auth flows, offline capabilities
- Platform variations: Native performance, OS constraints, UI/UX guidelines
- Shared logic: Identify platform-agnostic vs platform-specific code
- Integration points: Design clean interfaces between shared and platform-specific

**Process**: Discovery (clarifying Qs) → Research (gather info) → Analysis (evaluate) → Debate (present options) → Consensus (align) → Documentation (summary) → Finalization (ask for detailed plan).

**Output**: NOT implementation, only brainstorming, advice, markdown summary with problem statement, evaluated approaches, recommendations, multi-platform considerations, risks/mitigation, success metrics, next steps.

---

### 15. **epost-database-admin** (~147 LOC)
**Model**: sonnet | **Color**: red  
**Purpose**: Database optimization, schema design, performance tuning

**Expertise**: PostgreSQL, MySQL, MongoDB (web), SQLite (iOS/Android), Room (Android), Core Data (iOS). Advanced query optimization, schema design, index strategy, backup/recovery, replication/HA, performance monitoring.

**Process**:
1. **Initial Assessment**: Identify DB system/version/platform, review schema/indexes, assess metrics
2. **Diagnostic Analysis**: EXPLAIN ANALYZE on slow queries, table statistics, index usage, resource utilization
3. **Optimization Strategy**: Balance read/write, design partitioning, implement caching, configure parameters
4. **Implementation**: Provide executable SQL, include rollback procedures, test non-production first
5. **Security & Reliability**: User roles, encryption, backup schedules, monitoring alerts
6. **Comprehensive Reporting**: Summary, current state, prioritized optimizations, step-by-step plan, SQL scripts

**Multi-Platform Database Context**:
- **Web/Backend** (PostgreSQL/MySQL): EXPLAIN ANALYZE, connection pooling, replication, full backup
- **Android** (SQLite/Room): Mobile optimization, Room migrations, local performance, cloud backup
- **iOS** (Core Data/SQLite): Core Data optimization, persistent store coordination, sync strategies

**Tools**: psql (PostgreSQL), database CLI, EXPLAIN/ANALYZE, system monitoring, official docs, databases skill.

**Working Principles**: Validate assumptions with data, prioritize integrity/availability, consider app context, provide quick wins + long-term improvements, document all changes, error handling, least privilege.

**Output**: Database systems analyzed, performance issues identified (severity), recommendations (prioritized), SQL scripts (with rollback), expected improvements, timeline, unresolved questions.

---

## Part 4: Workflows (3 orchestration patterns)

### Workflow 1: **Feature Development** (~105 LOC)
**Trigger**: User wants to add a new feature

**Steps**:
1. **Plan Creation** (`/plan [description]`)
   - Agent: epost-architect
   - Output: plans/YYMMDD-feature.md with YAML frontmatter
   - Spawns 3 researchers in parallel, creates plan with file ownership

2. **Implementation** (`/cook plans/YYMMDD-feature.md`)
   - Agent: epost-implementer
   - Output: Working feature with tests
   - Validates file ownership, follows plan, creates/modifies files, writes tests

3. **Testing** (`/test`)
   - Agent: epost-tester
   - Output: Test results with coverage
   - Runs multi-framework suite, analyzes coverage, reports failures with root cause

4. **Code Review** (`/review`)
   - Agent: epost-reviewer
   - Output: Security and quality report
   - Checks quality, security, performance, verifies plan completion

5. **Documentation**
   - Agent: epost-documenter
   - Output: Updated docs
   - Updates docs, maintains roadmap/changelog, ensures API docs current

6. **Commit** (`/git:cm`)
   - Agent: epost-git-manager
   - Output: Clean git commit
   - Analyzes changes, generates conventional message, stages, commits, runs pre-commit hooks

**Estimated Time**: Simple (5-10 min), Medium (15-30 min), Complex (30-60 min)

**Success Criteria**: Plan reviewed, tests passing, code review approved, conventional commit, docs updated.

---

### Workflow 2: **Bug Fixing** (~84 LOC)
**Trigger**: User reports a bug or issue

**Steps**:
1. **Code Search** (`/scout [query]`)
   - Agent: epost-scout
   - Output: List of relevant files
   - Uses grep/glob, prioritizes by relevance, provides context

2. **Investigation** (`/debug [description]`)
   - Agent: epost-debugger
   - Output: Root cause analysis with file locations
   - Uses scout results, gathers debug info, reproduces issue, identifies root cause

3. **Fix Implementation**
   - Agent: epost-implementer
   - Output: Fixed code with regression test
   - Applies fix, writes regression test, updates docs

4. **Verification** (`/test`)
   - Agent: epost-tester
   - Output: Test results including regression tests
   - Runs full suite, validates regression tests, checks no new failures

5. **Code Review** (`/review`)
   - Agent: epost-reviewer
   - Output: Fix quality verification
   - Verifies correctness, checks edge cases, validates coverage

6. **Commit** (`/git:cm`)
   - Agent: epost-git-manager
   - Output: Commit with `fix:` type

**Bug Categories**:
- Simple bugs (use /fix:fast): Typos, missing imports, simple logic, config issues
- Complex bugs (use /fix:hard): Race conditions, memory leaks, performance, architecture, security

**Estimated Time**: Simple (2-5 min), Complex (15-45 min)

---

### Workflow 3: **Project Initialization** (~80 LOC)
**Trigger**: User wants to start a new project

**Steps**:
1. **Bootstrap** (`/bootstrap [description]`)
   - Agent: epost-implementer
   - Output: New project structure
   - Asks project type, recommends tech stack, creates structure, generates initial files, sets configuration

2. **Initial Documentation**
   - Agent: epost-documenter
   - Output: Initial documentation suite
   - Creates docs/codebase-summary.md (via repomix), code-standards.md, system-architecture.md, development-roadmap.md, project-changelog.md

3. **Initial Commit** (`/git:cm`)
   - Agent: epost-git-manager
   - Output: First commit with docs

**Tech Stack Recommendations**:
- **Web Application**: Next.js 15, shadcn-ui, Tailwind CSS, better-auth, PostgreSQL + Prisma
- **API**: Node.js/Bun, Fastify/Hono, Zod, OpenAPI
- **Library**: TypeScript, tsup/unbuild, Vitest, TypeDoc

**Initial Files**: README.md, .gitignore, package.json, tsconfig.json, src/, .claude/ (with ClaudeKit)

**Estimated Time**: 5-10 minutes

---

## Key Architectural Patterns

### 1. **Parent-Child Delegation**
- Global agents orchestrate, detect platform
- Global agents spawn platform agents via Task tool
- Platform agents execute within domain
- Platform agents report back to global agent

### 2. **Parallel Execution**
- Multiple researchers in parallel for planning
- Multi-platform simultaneous development
- Independent phases with well-defined file ownership
- Merge strategy planned before execution

### 3. **File Ownership Model**
- Each phase owns exclusive file set
- NO overlaps between parallel phases
- CRITICAL: Enforce strictly to prevent conflicts
- Phase dependencies track data flow, not file coupling

### 4. **Report Aggregation**
- Orchestrator collects reports from all agents
- Synthesizes findings into project status
- Updates plans with completion status
- Triggers documentation coordination

### 5. **Hierarchical Routing**
- Orchestrator → global agent → (platform agent if needed)
- Each level makes specific decision
- Explicit platform context passed downstream
- Clear separation of concerns

---

## Integration Points & Dependencies

### Critical Integration Points:
1. **Plan Files** (`./plans/{date}-{slug}/`): Store implementations plans with phase files, ownership lists
2. **Documentation** (`./docs/`): code-standards.md, system-architecture.md, codebase-summary.md maintained by documenter
3. **Git Workflow**: All code changes committed via git-manager following conventional commits
4. **Skill Activation**: Each agent activates relevant skills from `.claude/skills/*`
5. **Test Frameworks**: Multi-language test execution (JS/TS, Python, Go, Rust, Flutter)

### Cross-Cutting Patterns (8 required):
1. **Progress Tracking**: Monitor work across all platforms
2. **Task Completeness**: Verify all tasks completed
3. **Report Collection**: Gather findings from agents
4. **Plan Updates**: Update status, efforts in YAML frontmatter
5. **Documentation**: Link to related architecture docs
6. **Quality Assurance**: Validate approach and outputs
7. **Multi-Platform Awareness**: Consider platform implications
8. **Dependency Verification**: Ensure dependencies satisfied

---

## Security & Compliance

### Built-In Security Checks:
- **git-manager**: Secret detection (API keys, tokens, passwords, credentials) blocks commits
- **reviewer**: OWASP Top 10 coverage analysis
- **debugger**: Database query analysis for SQL injection patterns
- **documenter**: NO secrets in documentation, credential protection

### Code Quality Standards:
- **File Size Management**: Keep files under 200 LOC
- **Type Safety**: TypeScript strict mode, Swift concurrency
- **Error Handling**: try-catch, proper validation
- **Testing**: 80%+ coverage minimum
- **Linting**: Pre-commit hooks, no syntax errors

---

## Token Efficiency Strategy

### git-manager Optimization:
- Compound commands (2-3 tool calls vs 15 baseline)
- Single-pass data gathering
- Delegate to Gemini for heavy lifting ($0.075/$0.30 per 1M vs $1/$5 for Haiku)
- 81% cost reduction per commit

### Overall Approach:
- Haiku for orchestration/routing (fast, cheap)
- Sonnet for complex work (planning, implementation, debugging)
- Opus for architecture (deep reasoning)
- Gemini Flash for heavy analysis (price/performance optimization)

---

## Notable Design Insights

### 1. **Strict Execution Model**
epost-git-manager executes in 2-4 tool calls ONLY. No exploration phase. This enforces token efficiency and fast iteration.

### 2. **File Ownership as Conflict Prevention**
Phase files explicitly list file ownership. This prevents race conditions in parallel development and enables truly concurrent implementation.

### 3. **Research-Driven Planning**
epost-architect spawns 3 parallel researchers to gather information before planning. This ensures plans reflect current best practices and codebase patterns.

### 4. **Platform-Agnostic Orchestration**
All global agents remain platform-agnostic. Platform delegation happens at lowest level possible (implementer, tester, reviewer detect platform and delegate).

### 5. **Multi-Source Intelligence**
epost-researcher uses query fan-out: WebSearch, WebFetch, GitHub, docs-seeker, community. This validates information across sources.

### 6. **Report-Driven Coordination**
Orchestrator collects all reports, synthesizes findings. Creates single source of truth for project progress. Updates plans and documentation based on report insights.

### 7. **Security by Design**
git-manager blocks commits with secrets before they happen. reviewer audits against OWASP. documenter prevents secrets in docs. Multiple layers.

---

## Unresolved Questions

1. How are shared skills (.claude/skills/shared) documented and versioned?
2. What triggers automatic codebase regeneration (repomix → codebase-summary.md)?
3. How do error scenarios in platform delegation get handled (e.g., if iOS simulator unavailable)?
4. What's the maximum reasonable plan file size before splitting required?
5. How are merge conflicts handled in multi-platform parallel development?
6. Is there versioning/rollback capability for major documentation changes?
7. How do performance benchmarks/regression testing integrate into workflow?

---

## Recommendations

1. **Documentation**: Create visual flowcharts for each workflow in PlantUML/Mermaid
2. **Tooling**: Add automated validation for plan file YAML frontmatter
3. **Reporting**: Create dashboard/summary view across all active plans
4. **Skills**: Document skill activation patterns by agent type
5. **Error Handling**: Standardize error response format across all agents
6. **Testing**: Add integration tests for multi-phase workflows
7. **Performance**: Track agent execution times to identify bottlenecks

