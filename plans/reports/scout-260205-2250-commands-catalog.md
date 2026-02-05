# Claude Commands Catalog Report

**Generated**: 2026-02-05 22:50  
**Directory**: `.claude/commands/`  
**Total Files**: 30 command files  
**Total LOC**: 1,727 lines  
**Subdirectories**: 8 (android, core, design, docs, fix, git, ios, web)

---

## Executive Summary

The epost_agent_kit command system provides 30 commands organized across 8 functional categories. Commands follow a hierarchical pattern with platform-specific delegation (web, ios, android) and cross-platform utilities (core). The architecture supports orchestration-based workflows where global commands coordinate with platform-specific implementations.

**Key Characteristics:**
- Agent-driven command execution (each command routes to specific agent)
- YAML frontmatter metadata (title, description, agent, allowed-tools, argument-hint)
- Hierarchical routing with platform prefixes (`/web:`, `/ios:`, `/android:`, `/fix:`, `/git:`, `/design:`, `/docs:`)
- Emphasis on workflow sequencing (Plan → Cook → Test → Review)
- Comprehensive documentation for each command

---

## Directory Structure Overview

```
.claude/commands/
├── core/              # 8 commands - Cross-platform orchestration
├── web/               # 2 commands - Web platform (Next.js/React)
├── ios/               # 4 commands - iOS platform (Swift/SwiftUI)
├── android/           # 2 commands - Android platform (Kotlin)
├── fix/               # 5 commands - Bug fixing specialized commands
├── git/               # 5 commands - Git workflow automation
├── design/            # 1 command - UI design helpers
└── docs/              # 2 commands - Documentation management
```

---

## Command Catalog by Category

### CORE Commands (Cross-Platform Orchestration)

Global commands that coordinate workflows across all platforms.

#### 1. `/ask` - Ask Command
- **Agent**: epost-researcher
- **Purpose**: Get answers about your codebase
- **Arguments**: [question about codebase]
- **Use Cases**: 
  - How does [feature] work?
  - Where is [component] used?
  - What's the architecture of [feature]?
  - Why is this implemented this way?
- **Process**:
  1. Parse the question
  2. Activate docs-seeker skill for documentation lookup
  3. Search for relevant files (Grep, Glob, Read)
  4. Analyze code and architecture
  5. Cross-reference with latest docs
  6. Formulate comprehensive answer
- **Output Format**: Direct answer + relevant files + code examples + line numbers

#### 2. `/bootstrap` - Initialize New Project
- **Agent**: epost-implementer
- **Purpose**: Initialize a new project from scratch with best practices
- **Arguments**: [project description]
- **Process**:
  1. Ask for project type if not specified
  2. Recommend tech stack based on requirements
  3. Create project structure
  4. Install dependencies
  5. Generate initial files
- **Tech Stack Recommendations**:
  - Web app: Next.js + shadcn-ui
  - API: Node.js + Express/Fastify
  - Library: TypeScript
  - Mobile: React Native
- **Output**: Project type, tech stack, files created, next steps

#### 3. `/brainstorm` - Technical Evaluation
- **Agent**: epost-brainstormer
- **Purpose**: Evaluate technical approaches and design decisions before implementation
- **Arguments**: [design question or technical decision]
- **Use Cases**:
  - Choosing between technologies/libraries
  - Deciding on architecture patterns
  - Evaluating design alternatives
  - Resolving technical debates
  - Pre-implementation validation
- **Analysis Criteria**:
  - Architecture fit with existing system
  - Performance characteristics
  - Maintenance complexity
  - Team expertise match
  - Scalability implications
  - Development time vs. technical debt
- **Output**: Multiple viable approaches + pros/cons + recommendation + gotchas + validation steps

#### 4. `/cook` - Main Implementation Command
- **Agent**: epost-implementer
- **Purpose**: Implement features from plans or descriptions (primary development command)
- **Arguments**: [feature description] or [path/to/plan.md]
- **Conditional Workflows**:
  - **If plan file provided**: Read → Implement → Test → Update docs
  - **If only description**: Ask → Create plan → Implement
- **Implementation Steps**:
  1. Validate file ownership (if plan provided)
  2. Check phase dependencies are complete
  3. Install dependencies (if needed)
  4. Create files in order (follow plan sequencing)
  5. Modify existing files (only owned files)
  6. Write comprehensive tests
  7. Update documentation
  8. Verify compilation and functionality
- **Rules**:
  - Follow plans exactly when provided
  - Always write tests for new code
  - Update relevant docs
  - Report progress per file
- **Output**: Files created [count] + Files modified [count] + Tests written [count] + Verification steps

#### 5. `/debug` - Root Cause Investigation
- **Agent**: epost-debugger
- **Purpose**: Find and explain root causes of issues
- **Arguments**: [issue description] or [error log]
- **Debug Framework**:
  1. Use scout first to locate relevant files
  2. Understand the symptom
  3. Gather context (git logs, error messages, stack traces, logs)
  4. Investigate code using scout results
  5. Use specialized tools (psql for DB, gh for GitHub, docs-seeker for docs)
  6. Identify root cause
  7. Suggest targeted fix with code snippets
- **Output**: Root cause identified + Affected files + Suggested fix (diff) + Verification steps

#### 6. `/plan` - Create Implementation Plans
- **Agent**: epost-architect
- **Purpose**: Create detailed implementation plans before coding
- **Arguments**: [feature description]
- **Process**:
  1. Parse the feature request
  2. Spawn 3 researcher agents in parallel:
     - Best practices research
     - Existing codebase analysis
     - Dependencies check
  3. Aggregate findings and identify key insights
  4. Create detailed plan with YAML frontmatter
  5. Define file ownership (phase-XX-name.md format)
  6. Identify success criteria
  7. Save to plans/ directory with proper structure
- **Output**: Plan created at plans/[filename].md + Research summary + Implementation steps count + Files to create/modify + Estimated complexity

#### 7. `/review` - Code Review & Quality Assurance
- **Agent**: epost-reviewer
- **Purpose**: Comprehensive code review for quality, security, and performance
- **Arguments**: [optional path/to/plan.md]
- **Analysis Areas**:
  - Security vulnerabilities
  - Performance implications
  - Code quality and maintainability
  - Test coverage
  - Documentation adequacy
- **Verification** (if plan provided):
  - All implementation steps completed
  - File ownership respected
  - Success criteria met
  - Risk mitigation addressed
- **Output**: Code quality assessment + Security findings + Performance recommendations + Coverage analysis + Plan verification + Approved/improvements needed

#### 8. `/scout` - Codebase Search
- **Agent**: epost-scout
- **Purpose**: Fast codebase search and file discovery
- **Arguments**: [search query] or [keywords] or [component name]
- **Search Strategy**:
  1. Parse search query
  2. Search for relevant files using:
     - Glob patterns for file names
     - Grep for content matching
     - Context-aware file prioritization
  3. Prioritize by:
     - Exact name matches
     - Import/export statements
     - Architecture relevance
     - Recent modifications
- **Output**: List of relevant files with paths + Relevance scores + Context snippets + File type/size + Related files network map
- **Common Use Cases**: Finding where function is used + Locating all tests for component + Discovering related modules + Mapping feature surface area

#### 9. `/test` - Run Test Suite
- **Agent**: epost-tester
- **Purpose**: Run tests and analyze coverage
- **Arguments**: [optional test file path]
- **Process**:
  1. Identify test framework (Jest, Vitest, Pytest, Go test, etc.)
  2. Detect platform (Node, Python, Go, etc.)
  3. Run the appropriate test suite
  4. Parse results and handle platform-specific output
  5. Calculate code coverage
  6. Report findings with severity
- **Failure Handling**:
  1. Identify which tests failed
  2. Analyze why they failed
  3. Suggest fixes
- **Output**: Total tests run + Pass/fail counts + Coverage percentage + Failure details + Recommendations

---

### WEB Commands (Next.js/React/TypeScript)

Web platform-specific implementations.

#### 10. `/web:cook` - Web Feature Implementation
- **Agent**: epost-web-developer
- **Description**: Implement web features directly using Next.js, React, TypeScript (bypasses global routing)
- **Tech Stack**:
  - Next.js 15+ (App Router)
  - React 19+
  - TypeScript 5+
  - Tailwind CSS 4+
  - shadcn/ui components
  - Better Auth (if auth needed)
- **Skills Activated**: web/nextjs, web/frontend-development, web/backend-development
- **Process**:
  1. Read and understand feature requirements
  2. Verify Next.js project structure and dependencies
  3. Implement feature following Next.js 15 App Router conventions
  4. Run build and lint to verify quality
  5. Report completion with file changes
- **Quality Checks**:
  - TypeScript strict mode compliance
  - Build successful (`npm run build` or `bun run build`)
  - Lint passing (`npm run lint` or `bun run lint`)
  - Responsive design (mobile-first)
  - Accessibility (WCAG AA)
- **Principles**: YAGNI, KISS, DRY

#### 11. `/web:test` - Web Testing
- **Agent**: epost-web-developer
- **Description**: Run and write web tests using Vitest, Playwright, React Testing Library
- **Test Frameworks**:
  - **Unit/Integration**: Vitest + React Testing Library
  - **E2E**: Playwright
  - **API**: Vitest + MSW (Mock Service Worker)
- **Test Commands**:
  - Unit/Integration: `npm test` or `bun test`
  - E2E: `npx playwright test`
  - Coverage: `npm test -- --coverage`
- **Coverage Goals**:
  - Minimum 80% overall coverage
  - 90%+ for critical UI paths
  - All error paths tested
- **Process**:
  1. Understand what needs testing (components, APIs, E2E flows)
  2. Check existing test patterns and framework setup
  3. Write tests using appropriate framework
  4. Run test suites and analyze results
  5. Report coverage and recommendations
- **Best Practices**: Test behavior not implementation + Use descriptive names + Keep tests fast

---

### iOS Commands (Swift/SwiftUI/UIKit)

iOS platform-specific implementations with XcodeBuildMCP integration.

#### 12. `/ios:cook` - iOS Feature Implementation
- **Agent**: epost-ios-developer
- **Description**: Implement iOS features from plans or descriptions with Swift 6, iOS 18+, SwiftUI support
- **Arguments**: [plan file] or [feature description]
- **Allowed Tools**: Read, Grep, Glob, Bash, Edit, Write, TaskCreate, XcodeBuildMCP tools
- **Tech Stack**:
  - Swift 6
  - iOS 18+
  - SwiftUI (default) / UIKit (when needed)
  - MVVM / TCA architecture patterns
- **Process**:
  1. Parse request and read plan if provided
  2. Reference development skill for patterns
  3. Discover project using MCP (fallback: Glob for .xcodeproj)
  4. Identify UI framework (SwiftUI default, UIKit when needed)
  5. Implement in order: Models → ViewModels → Views → Networking → Tests
  6. Build verification (use MCP or xcodebuild)
  7. Report completion with file changes
- **Key Rules**:
  - Default to SwiftUI for new code
  - Use @Observable (iOS 17+) instead of ObservableObject
  - Use async/await, not completion handlers
  - Use MainActor for UI updates
  - Write XCTest for new code
  - Always use `describe_ui` before UI interactions (MCP)
  - Run `doctor` when encountering unexpected errors (MCP)
- **Completion Report**: Files created + Architecture pattern + Tests written + Build verification status

#### 13. `/ios:test` - iOS Unit & UI Tests
- **Agent**: epost-ios-developer
- **Description**: Run iOS unit tests and UI tests using xcodebuild or XcodeBuildMCP
- **Arguments**: [--unit | --ui | --coverage | test-target]
- **Allowed Tools**: Read, Grep, Glob, Bash, XcodeBuildMCP test tools
- **Process**:
  1. Reference tester skill for testing patterns
  2. Discover project (MCP preferred, fallback Glob)
  3. Parse arguments (--unit, --ui, --coverage, test target)
  4. Run tests using MCP or xcodebuild
  5. Parse results and calculate coverage
  6. Report with failure diagnostics
- **Rules**:
  - Use MCP tools when available
  - Always run unit tests before UI tests
  - Capture logs for debugging failures
  - Provide specific file:line references for failures
  - Suggest fixes for common test issues
- **Completion Report**: Tests run (total/passed/failed) + Execution time + Coverage metrics + Failed tests analysis

#### 14. `/ios:debug` - iOS Debugging
- **Agent**: epost-ios-developer
- **Description**: Debug iOS crashes, concurrency issues, SwiftUI state problems, and performance issues
- **Arguments**: [issue description] or [error log]
- **Allowed Tools**: Read, Grep, Glob, Bash, XcodeBuildMCP debug & logging tools
- **Issue Categories**:
  - **Concurrency Issues**: MainActor checker errors, data races, actor isolation, task cancellation
  - **SwiftUI State Problems**: @Observable not working, view not updating, @Binding issues
  - **Memory Issues**: Retain cycles, memory leaks, strong reference cycles
  - **Build/Signing Issues**: Code signing errors, provisioning profile problems
- **Process**:
  1. Reference development skill for debugging patterns
  2. Understand the symptom
  3. Gather context (crash logs, Xcode console, recent changes)
  4. Capture logs using MCP tools (start/stop log capture)
  5. Investigate relevant Swift code
  6. Identify root cause
  7. Explain and suggest fix
- **Rules**:
  - Find root cause, not symptoms
  - Provide file:line references
  - Capture logs when available (MCP)
  - Suggest prevention strategies
  - Recommend Instruments usage for performance issues
- **Completion Report**: Issue description + Root cause + Issue category + Evidence + Affected files + Recommended fix + Verification steps

#### 15. `/ios:simulator` - iOS Simulator Management
- **Agent**: epost-ios-developer
- **Description**: List, boot, shutdown, and manage iOS simulators using XcodeBuildMCP or xcrun simctl
- **Arguments**: [--list | --boot | --shutdown | --install | --launch | --screenshot]
- **Allowed Tools**: Read, Grep, Glob, Bash, XcodeBuildMCP simulator tools
- **Actions**:
  - `--list`: List available simulators
  - `--boot <name>`: Boot specific simulator
  - `--shutdown`: Shutdown booted simulator
  - `--install <app>`: Install app on simulator
  - `--launch <bundleId>`: Launch app by bundle ID
  - `--screenshot`: Take screenshot of simulator
- **MCP Tools Available**:
  - list_sims, boot_sim, open_sim, install_app_sim, launch_app_sim, stop_app_sim, screenshot, describe_ui
- **Fallback Commands** (without MCP): xcrun simctl CLI equivalents
- **Rules**:
  - Use MCP tools when available
  - Always use `list_sims` to get device UDIDs before booting
  - Shutdown simulators when done to free resources
  - Use simulator for faster iteration, device for final validation
- **Completion Report**: Action performed status + Simulator details + App details + Output + Next steps

---

### ANDROID Commands (Kotlin/Jetpack Compose)

Android platform-specific implementations.

#### 16. `/android:cook` - Android Feature Implementation
- **Agent**: epost-android-developer
- **Description**: Implement Android features with Kotlin and Jetpack Compose
- **Arguments**: [plan file] or [feature description]
- **Status**: ⚠️ SKELETON COMMAND - Populate patterns before use
- **Allowed Tools**: Read, Grep, Glob, Bash, Edit, Write, TaskCreate
- **Tech Stack**:
  - Kotlin
  - Jetpack Compose
  - Android 14+
  - MVVM architecture
- **Process**:
  1. Parse request and read plan if provided
  2. Understand feature requirements
  3. Create models (data classes, Room entities)
  4. Create ViewModels with StateFlow
  5. Create Composables
  6. Implement networking
  7. Write JUnit tests
  8. Build verification (`./gradlew assembleDebug`)
- **Output**: Files created + Architecture pattern (MVVM) + Build verification status

#### 17. `/android:test` - Android Testing
- **Agent**: epost-android-developer
- **Description**: Run Android unit tests and instrumented tests using Gradle
- **Arguments**: [--unit | --instrumented | --coverage]
- **Status**: ⚠️ SKELETON COMMAND
- **Allowed Tools**: Read, Grep, Glob, Bash
- **Process**:
  1. Parse arguments
     - `--unit`: `./gradlew test`
     - `--instrumented`: `./gradlew connectedAndroidTest`
     - `--coverage`: `./gradlew jacocoTestReport`
  2. Run tests and capture output
  3. Parse results and calculate coverage
  4. Report findings
- **Output**: Tests run (total/passed/failed) + Coverage metrics + Failed tests analysis

---

### FIX Commands (Bug Fixing Specialized)

Specialized commands for different bug fix scenarios.

#### 18. `/fix:fast` - Quick Bug Fixes
- **Agent**: epost-debugger
- **Purpose**: Quick fixes for simple, obvious bugs
- **Arguments**: [bug description]
- **Examples**: typo in login button, simple logic errors, missing imports
- **When to Use**: Typos, simple logic errors, missing imports, obvious bugs, quick fixes (under 5 minutes)
- **When NOT to Use**: Complex issues (use /fix:hard), performance problems, architecture changes, security issues
- **Process**:
  1. Diagnose the issue
  2. Apply the fix
  3. Verify it works
  4. Add test if needed
- **Output**: Issue found + Fix applied + Files changed + Verification method

#### 19. `/fix:hard` - Complex Bug Fixes
- **Agent**: epost-debugger
- **Purpose**: Tackle complex bugs requiring systematic investigation
- **Arguments**: [description of the issue]
- **Examples**: Users getting logged out randomly, Database connection pooling exhausted, Memory leak in background worker
- **Process**:
  1. Reproduce the issue
  2. Gather relevant logs and data
  3. Analyze stack traces
  4. Identify root cause
  5. Implement fix
  6. Add tests to prevent regression
  7. Document the issue and fix
- **Output**: Root cause analysis + Fixed code + Test cases + Documentation updates

#### 20. `/fix:test` - Fix Failing Tests
- **Agent**: epost-tester
- **Purpose**: Diagnose and fix failing tests
- **Arguments**: [test name] or [description]
- **Examples**: User authentication tests failing, Async test timing out, Mock not working correctly
- **Process**:
  1. Analyze failing test output
  2. Identify why test fails
  3. Check if test is valid or needs update
  4. Fix code or update test
  5. Ensure all tests pass
- **Output**: Fixed code or tests + Improved test coverage + Better test isolation + Updated test documentation

#### 21. `/fix:ui` - Fix UI Bugs
- **Agent**: epost-debugger
- **Purpose**: Fix visual bugs, layout issues, and UI problems
- **Arguments**: [description of UI issue]
- **Examples**: Button not aligning properly on mobile, Modal not closing on backdrop click, Text overflow in card component
- **Process**:
  1. Reproduce the UI issue
  2. Identify root cause (CSS, component logic, etc.)
  3. Implement fix
  4. Test across browsers/devices
  5. Check accessibility impact
- **Output**: Fixed CSS/styling + Updated components + Responsive design fixes + Accessibility improvements

#### 22. `/fix:ci` - Fix CI/CD Pipeline Failures
- **Agent**: epost-debugger
- **Purpose**: Diagnose and fix CI/CD pipeline failures
- **Arguments**: [job name] or [error description]
- **Examples**: Tests failing in GitHub Actions, Build error: module not found, Deployment failing with timeout
- **Process**:
  1. Examine CI logs
  2. Identify failure point
  3. Reproduce locally if possible
  4. Fix the issue
  5. Verify with new run
  6. Update CI config if needed
- **Output**: Fixed CI configuration + Updated dependencies + Fixed tests or code + Documentation for CI setup

---

### GIT Commands (Version Control)

Git workflow automation commands.

#### 23. `/git:commit` - Create Professional Commits
- **Agent**: epost-git-manager
- **Description**: Stage and commit with conventional commits
- **Arguments**: (none)
- **Process**:
  1. Run `git status` to see changes
  2. Run `git diff` to see details
  3. Categorize changes (feat, fix, refactor, docs, test, chore)
  4. Generate conventional commit message
  5. Stage relevant files
  6. Create commit
  7. Run pre-commit hooks if configured
- **Commit Message Format**:
  ```
  <type>(<scope>): <description>
  
  [optional body]
  
  [optional footer]
  ```
- **Rules**:
  - Never commit sensitive files (.env, secrets)
  - Never include Claude credentials
  - Use conventional commit format
  - Keep description under 72 chars
  - Include body for significant changes
- **Output**: Files staged + Commit message + Commit hash + Any hooks run

#### 24. `/git:push` - Commit and Push to Remote
- **Agent**: epost-git-manager
- **Description**: Commit changes and push to remote repository
- **Arguments**: (none)
- **Process**:
  1. Complete the commit workflow (see /git:commit)
  2. Check current branch
  3. Validate target branch (confirmation for protected branches)
  4. Push to remote
  5. Report completion
- **Rules**:
  - Never force push to main/master/release/production
  - Always confirm before pushing to protected branches
  - Show commit hash and branch before pushing
  - Handle push conflicts gracefully
- **Output**: Commit hash + Branch pushed + Remote URL + Any conflicts encountered

#### 25. `/git:pr` - Create GitHub Pull Request
- **Agent**: epost-git-manager
- **Description**: Create GitHub pull request from current branch
- **Arguments**: (none)
- **Process**:
  1. Check if GitHub CLI (gh) is installed
  2. Analyze branch and commits
  3. Generate PR description from diff
  4. Create draft PR (never direct to main)
  5. Report PR URL
- **PR Description Template**:
  ```markdown
  ## Summary
  [Concise summary of changes]
  
  ## Changes
  - [Categorized list of changes]
  
  ## Type of Change
  - [ ] Bug fix / New feature / Breaking change / Documentation update
  
  ## Related Issues
  Closes #[issue-number]
  
  ## Testing
  [Testing approach and results]
  
  ## Checklist
  - [ ] Tests pass locally
  - [ ] Documentation updated
  - [ ] No new warnings
  ```
- **Rules**:
  - Never create PR directly to main/master
  - Always use draft for review first
  - Generate description from actual changes
  - Link related issues
- **Output**: PR URL + Branch and base + Commit count

#### 26. `/git:cp` - Git Push Alias
- **Description**: Alias for `/git:push`
- **Note**: Use `/git:push` instead

#### 27. `/git:cm` - Git Commit Alias
- **Description**: Alias for `/git:commit`
- **Note**: Use `/git:commit` instead

---

### DESIGN Commands (UI Design Helpers)

#### 28. `/design:fast` - Quick UI Design Implementation
- **Agent**: epost-implementer
- **Description**: Quickly implement simple UI components and designs
- **Arguments**: [description of UI needed]
- **Best For**: Simple components, quick layout fixes, basic styling updates, minor UI tweaks
- **Examples**:
  - Create a simple button component
  - Add a loading spinner
  - Make this card responsive
- **Process**:
  1. Understand requirements
  2. Create/update component
  3. Apply appropriate styling
  4. Ensure responsiveness
  5. Check accessibility
- **Output**: UI component implementation + Styling (CSS/Tailwind/etc.) + Responsive layout

---

### DOCS Commands (Documentation Management)

#### 29. `/docs:init` - Initialize Documentation
- **Agent**: epost-architect
- **Description**: Scan codebase and generate comprehensive documentation
- **Arguments**: [scan entire codebase and create docs/]
- **Files Generated** (in `docs/` directory):
  1. **codebase-summary.md**: Project overview, tech stack, directory structure, key files, getting started
  2. **code-standards.md**: Naming conventions, code patterns, linting/formatting, testing approach
  3. **system-architecture.md**: High-level overview, core modules, data flow, key patterns
  4. **api-routes.md** (if applicable): REST endpoints table
  5. **data-models.md** (if applicable): Database schema, TypeScript types, state management
  6. **deployment-guide.md**: Environment variables, build process, deployment platforms, CI/CD
- **Process**:
  1. Scan the codebase using Glob, Grep, Read
  2. Explore directory structure
  3. Find key patterns (imports, exports, types)
  4. Read key files (package.json, tsconfig, configs)
  5. Identify: framework, language, database, deployment
  6. Generate documentation files with proper formatting
- **Analysis Rules**:
  - Scan EVERYTHING - don't skip directories
  - Look for config files
  - Check for Docker files, CI configs
  - Find test files to understand testing approach
  - Look for README files
  - Examine imports/exports to understand dependencies
- **Output**: Files created [count] + docs/ directory location + Summary of findings + Next steps

#### 30. `/docs:update` - Update Existing Documentation
- **Agent**: epost-documenter
- **Description**: Update existing documentation to reflect code changes
- **Arguments**: [what needs updating]
- **Examples**:
  - API changes for user service
  - Add new component examples
  - Update installation instructions
- **Process**:
  1. Identify what changed in code
  2. Find relevant documentation
  3. Update docs to match
  4. Verify examples still work
  5. Check for consistency
- **Output**: Updated documentation files + New or updated examples + Consistency checks

---

## Command Invocation Patterns

### Global Routing (Automatic Platform Detection)
```
/ask [question]
/bootstrap [description]
/brainstorm [topic]
/cook [description] or /cook plans/[file].md
/debug [issue]
/plan [feature]
/review or /review plans/[file].md
/scout [query]
/test or /test [file]
```

### Platform-Specific Direct Access
```
/web:cook [description]
/web:test
/ios:cook [description]
/ios:test [--unit|--ui|--coverage]
/ios:debug [issue]
/ios:simulator [--list|--boot|--shutdown|--install|--launch|--screenshot]
/android:cook [description]
/android:test [--unit|--instrumented|--coverage]
```

### Fix Commands
```
/fix:fast [bug]
/fix:hard [issue]
/fix:test [test]
/fix:ui [UI issue]
/fix:ci [CI error]
```

### Git Commands
```
/git:commit
/git:push
/git:pr
/git:cp (alias for push)
/git:cm (alias for commit)
```

### Design Commands
```
/design:fast [UI description]
```

### Documentation Commands
```
/docs:init
/docs:update [what to update]
```

---

## Agent Routing Map

| Command | Agent | Platform | Category |
|---------|-------|----------|----------|
| /ask | epost-researcher | Core | Orchestration |
| /bootstrap | epost-implementer | Core | Orchestration |
| /brainstorm | epost-brainstormer | Core | Orchestration |
| /cook | epost-implementer | Core | Orchestration |
| /debug | epost-debugger | Core | Orchestration |
| /plan | epost-architect | Core | Orchestration |
| /review | epost-reviewer | Core | Orchestration |
| /scout | epost-scout | Core | Orchestration |
| /test | epost-tester | Core | Orchestration |
| /web:cook | epost-web-developer | Web | Platform-specific |
| /web:test | epost-web-developer | Web | Platform-specific |
| /ios:cook | epost-ios-developer | iOS | Platform-specific |
| /ios:test | epost-ios-developer | iOS | Platform-specific |
| /ios:debug | epost-ios-developer | iOS | Platform-specific |
| /ios:simulator | epost-ios-developer | iOS | Platform-specific |
| /android:cook | epost-android-developer | Android | Platform-specific |
| /android:test | epost-android-developer | Android | Platform-specific |
| /fix:fast | epost-debugger | Core | Fix |
| /fix:hard | epost-debugger | Core | Fix |
| /fix:test | epost-tester | Core | Fix |
| /fix:ui | epost-debugger | Core | Fix |
| /fix:ci | epost-debugger | Core | Fix |
| /git:commit | epost-git-manager | Core | VCS |
| /git:push | epost-git-manager | Core | VCS |
| /git:pr | epost-git-manager | Core | VCS |
| /git:cp | epost-git-manager | Core | VCS |
| /git:cm | epost-git-manager | Core | VCS |
| /design:fast | epost-implementer | Core | Design |
| /docs:init | epost-architect | Core | Docs |
| /docs:update | epost-documenter | Core | Docs |

---

## Platform-Specific vs Cross-Platform Analysis

### Cross-Platform (Global) Commands: 9
- Core orchestration workflow
- Platform detection and routing
- Work across web, iOS, Android, backend

### Web Platform Commands: 2
- Next.js 15+ with App Router
- React 19+, TypeScript 5+, Tailwind CSS 4+
- Direct platform bypass available

### iOS Platform Commands: 4
- Swift 6, iOS 18+, SwiftUI/UIKit
- XcodeBuildMCP integration for build/test/debug
- Comprehensive simulator management

### Android Platform Commands: 2
- Kotlin, Jetpack Compose
- Gradle-based build system
- Status: Skeleton commands (patterns needed)

### Specialized Fix Commands: 5
- Independent bug fixing workflows
- Categorized by issue type (fast/hard/test/ui/ci)
- Faster iteration than full plan/cook cycle

---

## Workflow Sequences

### Standard Feature Development Flow
```
1. /plan [feature description]           → Create implementation plan
2. /cook plans/[plan].md                 → Implement from plan
3. /test                                 → Run test suite
4. /review plans/[plan].md               → Code review against plan
5. /git:commit                           → Commit changes
6. /git:push                             → Push to remote
7. /git:pr                               → Create pull request
```

### Quick Bug Fix Flow
```
1. /fix:fast [bug description]           → Quick fix for simple bugs
   OR
1. /debug [issue description]            → Investigate complex issues
2. /fix:hard [issue]                     → Complex bug fix
3. /fix:test [test]                      → Fix failing tests (if needed)
4. /test                                 → Verify tests pass
5. /git:commit → /git:push               → Commit and push
```

### UI/UX Development Flow
```
1. /design:fast [UI description]         → Quick UI implementation
2. /web:cook [feature]                   → Full feature implementation
3. /web:test                             → Run web tests
4. /fix:ui [UI issue]                    → Fix visual issues
5. /review                               → Code review
```

### iOS Development Flow
```
1. /plan [feature]                       → Create plan
2. /ios:cook plans/[plan].md             → Implement iOS feature
3. /ios:simulator --boot "iPhone 16"     → Boot simulator
4. /ios:simulator --launch [bundleId]    → Launch app
5. /ios:test --unit                      → Run unit tests
6. /ios:debug [issue]                    → Debug if needed
7. /review                               → Code review
```

### Documentation Workflow
```
1. /docs:init                            → Generate initial documentation
2. /cook [feature]                       → Implement feature
3. /docs:update [what changed]           → Update docs to match changes
4. /git:commit → /git:push               → Commit documentation
```

---

## Key Metadata Patterns

### YAML Frontmatter Structure
```yaml
---
title: [Command Title]
description: [Emoji and brief description]
agent: [agent-name]
argument-hint: [emoji] [argument format]
slug: [optional slug for platform-specific]
allowed-tools: [optional list of allowed tools]
---
```

### Argument Patterns
- Simple: `[question]`, `[description]`, `[command]`
- Optional: `[optional path/to/file.md]`
- Flags: `[--flag | --flag | --flag]`
- Emoji hints: 💡, 👉👉👉, ✨, 🔍, 📚, 🤖, ⭑.ᐟ

### Agent Naming Convention
- Global: `epost-[role]` (researcher, implementer, brainstormer, debugger, etc.)
- Platform-specific: `epost-[platform]-[role]` (web-developer, ios-developer, android-developer)

---

## Skills Integration Points

Commands reference and activate skills from the skill catalog:

### Core Skills
- docs-seeker: Documentation lookup and research
- sequential-thinking: Complex problem solving
- problem-solving: Root cause analysis
- code-review: Code quality assessment

### Platform-Specific Skills
- web/nextjs, web/frontend-development, web/backend-development
- ios-development: iOS development patterns, debugging, testing
- android-development: Android patterns, Kotlin, Compose
- mobile-development: Cross-platform mobile patterns

### Specialized Skills
- repomix: Repository analysis and structure
- database-admin: Database schema and queries
- git-workflow: Version control best practices

---

## Tool Access Matrix

### Read/Glob/Grep (Available in All Commands)
- Standard file reading and searching
- No restrictions

### Write/Edit/Bash (Platform-Specific Restrictions)
- Controlled based on file ownership
- Platform agents only modify designated files
- Prevents cross-platform conflicts

### MCP Tools (iOS Specific)
- XcodeBuildMCP integration for:
  - Project discovery (discover_projs, list_schemes)
  - Building (build_sim)
  - Testing (test_sim, test_device)
  - Debugging (log capture, doctor)
  - Simulation (list_sims, boot_sim, install_app_sim, launch_app_sim, screenshot, describe_ui)

### External Tools (Command-Specific)
- `psql`: Database queries for /debug
- `gh`: GitHub CLI for /git commands, /ask research
- `xcodebuild`: iOS build system (fallback)
- `xcrun simctl`: Simulator control (fallback)

---

## Configuration & Extensibility

### How Commands Are Discovered
- Auto-scanned from `.claude/commands/` directory
- YAML frontmatter parsed for metadata
- Organized by subdirectory categories
- Agent assignment from metadata

### How Commands Are Routed
1. User enters `/[command]` or `/[category]:[command]`
2. System checks for exact match
3. Falls back to global command if platform-specific not found
4. Agent specified in metadata is invoked

### Adding New Commands
1. Create `.md` file in appropriate subdirectory
2. Add YAML frontmatter with title, description, agent, arguments
3. Document process, rules, and output format
4. Command automatically available on next scan

### Customizing Commands
- Modify agent assignment in YAML
- Update allowed-tools for permission changes
- Edit process steps and rules
- Commands hot-reload without restart

---

## Best Practices & Conventions

### Command Design
- Keep scope focused (one main purpose)
- Use consistent naming (kebab-case)
- Always specify agent and tools
- Provide clear argument hints with emojis
- Document edge cases and limitations

### Workflow Integration
- Use /plan before complex /cook implementations
- Always run /test after /cook
- Use /review as quality gate before push
- Chain related commands for efficiency

### Agent Delegation
- Global commands coordinate, platform agents execute
- Respect file ownership boundaries
- Use sequential chaining for dependencies
- Use parallel execution for independent tasks

### Error Handling
- /debug for root cause investigation
- /fix:* commands for targeted fixes
- /test for verification
- /review as final quality check

---

## Notable Features & Limitations

### Strengths
- Comprehensive workflow coverage (plan → cook → test → review → commit → push)
- Strong platform specialization (web, iOS, Android)
- Multi-agent orchestration for scalability
- Integrated MCP support for iOS tooling
- Flexible routing (global vs platform-specific)

### Limitations
- Android commands marked as skeleton (need pattern population)
- No explicit command for performance profiling
- Limited built-in command composition/chaining
- No undo/rollback mechanisms

### Skeleton Commands Requiring Implementation
- `/android:cook` - Needs Kotlin/Compose patterns
- `/android:test` - Needs JUnit/Espresso patterns

### Aliases (Convenience Shortcuts)
- `/git:cp` → `/git:push`
- `/git:cm` → `/git:commit`

---

## Unresolved Questions & Observations

1. **Android Commands**: Both android:cook and android:test are marked as SKELETON commands. Implementation patterns need to be populated before production use.

2. **Command Composition**: Currently no mechanism for chaining commands in sequence (e.g., /cook → /test → /git:push) automatically. Workflows are manual.

3. **Rollback Support**: No explicit rollback commands for reverting cook operations or commits if issues arise.

4. **Performance Profiling**: No dedicated command for profiling or performance analysis across platforms.

5. **Cross-Platform Orchestration**: While platform detection exists, no explicit command to run parallel implementations across web+iOS+Android simultaneously.

6. **Test Parallelization**: /test command doesn't specify if tests run in parallel or sequentially across multiple platforms.

7. **MCP Fallback Strategy**: While iOS has explicit fallback commands for non-MCP scenarios, unclear if other platforms have equivalent fallbacks.

8. **Command Versioning**: No mechanism for versioning commands or deprecating old commands in the catalog.

9. **Interactive Command Parameters**: No indication of interactive prompts for commands with optional arguments (e.g., /bootstrap asking for project type).

10. **Error Recovery**: While /debug and /fix commands exist, no automated error recovery or self-healing mechanisms in failed command chains.

---

**Report Complete** | Scanned: Feb 5, 2026 | CWD: `/Users/ddphuong/Projects/agent-kit/epost_agent_kit`
