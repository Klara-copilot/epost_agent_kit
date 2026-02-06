# CLI Command Reference - epost_agent_kit

**Last Updated**: 2026-02-05
**Created by**: Phuong Doan
**Status**: Complete

---

## Overview

epost_agent_kit provides 31 commands organized into 8 categories. Commands are invoked using the `/` prefix and automatically routed to specialized agents based on platform context.

---

## Core Commands (9)

### /ask [question]

Get answers about your codebase with intelligent research.

**Agent**: `epost-researcher`
**Activates**: docs-seeker, research skills

**Examples**:
```
/ask How does the authentication flow work?
/ask Where is the user service used?
/ask What's the recommended pattern for error handling?
```

**Output**: Direct answer with file references, code examples, line numbers

---

### /bootstrap [description]

Initialize a new project from scratch with recommended tech stack.

**Agent**: `epost-implementer`
**Project Types Supported**: Web, API, Library, Mobile

**Examples**:
```
/bootstrap Build a Next.js SaaS application
/bootstrap Create a REST API with Node.js
/bootstrap Initialize a React component library
```

**Process**:
1. Determine project type
2. Recommend tech stack
3. Create directory structure
4. Install dependencies
5. Generate initial files

---

### /brainstorm [topic]

Evaluate technical approaches and design decisions.

**Agent**: `epost-brainstormer`

**Examples**:
```
/brainstorm Should we use Redux or Context API?
/brainstorm How to architect a microservices system?
/brainstorm Best approach for real-time data synchronization?
```

**Output**: Multiple viable approaches with pros/cons, recommendation, gotchas

---

### /cook [feature] or /cook plans/[plan].md

Implement features from description or detailed plan.

**Agent**: `epost-implementer`
**Modes**: Direct mode (from description) or Plan mode (from file)

**Examples**:
```
/cook Build user profile page with edit functionality
/cook plans/260205-2250-auth-implementation/plan.md
```

**Direct Mode Process**:
1. Parse feature request
2. Create implementation plan
3. Implement feature
4. Write tests
5. Update documentation

**Plan Mode Process**:
1. Read plan file
2. Validate file ownership
3. Implement per plan
4. Follow phase dependencies
5. Report completion

---

### /debug [issue] or [error log]

Root cause analysis and debugging.

**Agent**: `epost-debugger`
**Framework**: 6-step systematic debugging

**Examples**:
```
/debug Users getting logged out randomly
/debug "ReferenceError: window is not defined"
/debug Database query timing out in production
```

**Process**:
1. Understand symptoms
2. Reproduce issue
3. Isolate problem
4. Analyze code
5. Hypothesize causes
6. Verify fix

---

### /plan [feature]

Create implementation plan with intelligent routing to appropriate variant.

**Router**: Auto-routes to `/plan:fast`, `/plan:hard`, or `/plan:parallel` based on complexity analysis
**Agent**: `epost-architect`

**Examples**:
```
/plan Implement OAuth2 authentication system
/plan Build real-time notification system
/plan Migrate database schema v1 to v2
```

**Routing Logic**:
- Simple tasks (typos, logging, config) → `/plan:fast`
- Moderate tasks (single feature) → `/plan:hard`
- Complex tasks (multi-module, parallel work) → `/plan:parallel`

**Output**:
- File: `plans/YYMMDD-HHMM-{slug}/plan.md`
- YAML frontmatter with metadata
- Phase files with 12-section structure
- File ownership tracking (parallel variant only)

---

### /plan:fast [feature]

Create quick plan without research phase.

**Agent**: `epost-architect`
**Research**: None (codebase analysis only)

**Use When**:
- Simple bug fixes or config changes
- Well-understood patterns from existing code
- No external research needed

**Examples**:
```
/plan:fast Add logging to user service
/plan:fast Fix typo in login button text
/plan:fast Update API endpoint URL
```

**Output**: Plan in `plans/` with codebase-based implementation steps

---

### /plan:hard [feature]

Create deep plan with sequential research.

**Agent**: `epost-architect`
**Research**: 2 sequential researchers (patterns → dependencies)

**Use When**:
- New patterns or unfamiliar tech
- Significant architecture decisions
- Need best practices research

**Examples**:
```
/plan:hard Implement OAuth2 authentication system
/plan:hard Build real-time WebSocket notification system
/plan:hard Migrate from REST to GraphQL
```

**Output**: Plan with research reports, comprehensive analysis, risk assessment

---

### /plan:parallel [feature]

Create parallel-ready plan with file ownership matrix.

**Agent**: `epost-architect`
**Research**: 2 sequential researchers + parallelization analysis

**Use When**:
- Multi-module features (API + DB + UI)
- Work can be split across multiple agents
- Need dependency graph for coordination

**Examples**:
```
/plan:parallel Build dashboard with API, database, and UI components
/plan:parallel Implement user management with admin panel and API
```

**Output**: Plan with:
- File ownership matrix (exclusive/shared files)
- Dependency graph (blocking relationships)
- Execution batches (parallel vs sequential phases)
- Parallelization Info in each phase file

---

### /plan:validate [optional: plan-path]

**Status**: Planned (command file not yet implemented)

Validates plan structure, completeness, and adherence to standards.

**Agent**: `epost-architect` or `epost-reviewer`

**When to Use**:
- After creating/editing a plan to catch issues early
- Before executing implementation with `/code`
- For quality assurance in CI/CD pipelines
- To validate YAML frontmatter and phase file structure

**Configuration** (via session-init hook):
- `CK_VALIDATION_MODE`: `prompt` (interactive), `strict` (auto-fail), or `off`
- `CK_VALIDATION_MIN_QUESTIONS`: Minimum validation checks (3-8)

**Example**:
```bash
/plan:validate plans/260206-1325-splash-pattern-action-items/
```

**Validates**:
- YAML frontmatter: title, description, status, priority, effort, tags, created
- Phase files: 12 required sections (Overview, Requirements, Architecture, etc.)
- File paths: verify all referenced files exist
- Cross-references: check links between plan.md and phase files
- Naming conventions: kebab-case, descriptive slugs

**Output**: Validation report with:
- Pass/Fail status per check
- Line numbers for issues found
- Recommendations for fixes

---

### /review [optional: plans/file.md]

Comprehensive code review and quality assurance.

**Agent**: `epost-reviewer`
**Coverage**: Quality, security, performance, test coverage, task completion

**Examples**:
```
/review plans/260205-2250-feature/plan.md
/review
```

**Verification**:
- All tasks in plan TODO list ✓
- Security vulnerabilities (OWASP Top 10)
- Performance issues
- Code coverage analysis
- Type safety

---

### /scout [query]

Fast codebase search and file discovery.

**Agent**: `epost-scout`
**Strategy**: Glob, Grep, context-aware prioritization

**Examples**:
```
/scout where is UserService used?
/scout find all database migrations
/scout show me tests for payment flow
```

**Output**: Relevant files with paths, relevance scores, context snippets, related files

---

### /test [optional: test file path]

Run test suite and analyze coverage.

**Agent**: `epost-tester`
**Multi-Framework**: Jest, Vitest, Pytest, Go test, Cargo test

**Examples**:
```
/test
/test src/components/__tests__/Button.test.tsx
```

**Process**:
1. Detect framework
2. Run test suite
3. Parse results
4. Calculate coverage
5. Report failures with root causes

---

## Web Platform Commands (2)

### /web:cook [feature] or /web:cook plans/[plan].md

Implement web features directly (bypasses global routing).

**Agent**: `epost-web-developer`
**Tech Stack**: Next.js 15+, React 19+, TypeScript 5+, Tailwind CSS 4+, shadcn/ui, Better Auth

**Examples**:
```
/web:cook Implement responsive navigation component
/web:cook Add user dashboard with charts
```

**Verifications**:
- TypeScript strict mode compliance
- Build successful
- Lint passing
- Responsive design
- WCAG AA accessibility

---

### /web:test [optional: flags]

Run and write web tests (Vitest, Playwright, React Testing Library).

**Agent**: `epost-web-developer`
**Test Types**: Unit, Integration, E2E

**Examples**:
```
/web:test
/web:test src/components/Button.test.tsx
```

**Frameworks**:
- **Unit/Integration**: Vitest + React Testing Library
- **E2E**: Playwright
- **Coverage Target**: 80% minimum

---

## iOS Platform Commands (4)

### /ios:cook [feature] or /ios:cook plans/[plan].md

Implement iOS features with Swift 6, SwiftUI, UIKit.

**Agent**: `epost-ios-developer`
**Tech Stack**: Swift 6, iOS 18+, SwiftUI, XCTest, XcodeBuildMCP

**Examples**:
```
/ios:cook Implement login screen with biometric auth
/ios:cook Build product listing with image caching
```

**Process**:
1. Parse requirements
2. Create models (with @Model decorator)
3. Create ViewModels (with @Observable)
4. Create UI (SwiftUI first)
5. Implement networking
6. Write tests

---

### /ios:test [flags]

Run iOS unit and UI tests.

**Agent**: `epost-ios-developer`
**Flags**: `--unit`, `--ui`, `--coverage`

**Examples**:
```
/ios:test --unit
/ios:test --ui
/ios:test --coverage
```

**Coverage**: 80%+ minimum

---

### /ios:debug [issue]

Debug iOS crashes, concurrency issues, SwiftUI problems.

**Agent**: `epost-ios-developer`
**Categories**: Crashes, MainActor violations, memory leaks, build signing

**Examples**:
```
/ios:debug App crashing on startup with memory warning
/ios:debug SwiftUI view not updating after state change
/ios:debug Code signing failure for TestFlight build
```

---

### /ios:simulator [action]

Manage iOS simulator (list, boot, install, launch, screenshot).

**Agent**: `epost-ios-developer`
**Actions**: `--list`, `--boot`, `--shutdown`, `--install`, `--launch`, `--screenshot`

**Examples**:
```
/ios:simulator --list
/ios:simulator --boot "iPhone 16 Pro"
/ios:simulator --launch com.example.myapp
/ios:simulator --screenshot
```

---

## Android Platform Commands (2)

### /android:cook [feature] or /android:cook plans/[plan].md

Implement Android features with Kotlin, Jetpack Compose.

**Agent**: `epost-android-developer`
**Tech Stack**: Kotlin, Jetpack Compose, MVVM, ViewModel, StateFlow

**Examples**:
```
/android:cook Implement user profile screen
/android:cook Build product list with pagination
```

---

### /android:test [flags]

Run Android unit and instrumentation tests.

**Agent**: `epost-android-developer`
**Flags**: `--unit`, `--instrumented`, `--coverage`

**Examples**:
```
/android:test --unit
/android:test --instrumented
/android:test --coverage
```

---

## Fix Commands (5)

### /fix:fast [bug]

Quick fix for simple, obvious bugs (typos, logic errors).

**Agent**: `epost-debugger`
**Time Target**: <5 minutes

**Examples**:
```
/fix:fast Login button says "Logn" instead of "Login"
/fix:fast Missing import in utils/helpers.ts
```

---

### /fix:hard [issue]

Complex bug investigation and systematic fixing.

**Agent**: `epost-debugger`
**Process**: Root cause analysis + fix + regression tests

**Examples**:
```
/fix:hard Users randomly logged out after 30 minutes
/fix:hard Database connection pool exhausted in production
```

---

### /fix:test [test name]

Fix failing tests (update code or test logic).

**Agent**: `epost-tester`

**Examples**:
```
/fix:test User authentication tests failing
/fix:test Async test timing out
```

---

### /fix:ui [UI issue]

Fix visual bugs and layout issues.

**Agent**: `epost-debugger`

**Examples**:
```
/fix:ui Button not centering on mobile
/fix:ui Modal not scrolling on small screens
```

---

### /fix:ci [CI error]

Fix CI/CD pipeline failures.

**Agent**: `epost-debugger`

**Examples**:
```
/fix:ci GitHub Actions test job timing out
/fix:ci Build failing: "module not found"
```

---

## Git Commands (5)

### /git:commit

Stage changes and create conventional commit.

**Agent**: `epost-git-manager`
**Process**: Analyze changes → Detect type → Generate message → Commit

**Process**:
1. Run `git status` and `git diff`
2. Categorize changes (feat, fix, refactor, docs, test, chore)
3. Generate conventional commit message
4. Stage files
5. Create commit
6. Run pre-commit hooks

---

### /git:push

Commit changes and push to remote.

**Agent**: `epost-git-manager`

**Validations**:
- Never force push to main/master
- Confirm before protected branches
- Show commit hash before push

---

### /git:pr

Create GitHub pull request from current branch.

**Agent**: `epost-git-manager`

**Output**: PR URL, branch, base, commit count

**Rules**:
- Draft PR by default
- Never create PR to main/master
- Auto-generate from diff

---

### /git:cp

Alias for `/git:push`

---

### /git:cm

Alias for `/git:commit`

---

## Design Commands (1)

### /design:fast [UI description]

Quick UI component implementation.

**Agent**: `epost-implementer`
**Best For**: Simple layouts, quick styling, minor tweaks

**Examples**:
```
/design:fast Create a simple card component
/design:fast Make this layout responsive on mobile
/design:fast Add a loading spinner
```

---

## Documentation Commands (2)

### /docs:init

Generate initial documentation from codebase.

**Agent**: `epost-architect`

**Generates**:
- `docs/codebase-summary.md`
- `docs/code-standards.md`
- `docs/system-architecture.md`
- `docs/api-routes.md` (if applicable)
- `docs/data-models.md` (if applicable)

---

### /docs:update [what]

Update documentation to reflect code changes.

**Agent**: `epost-documenter`

**Examples**:
```
/docs:update API changes for user service
/docs:update Add new component examples
/docs:update Installation instructions
```

---

## Workflow Sequences

### Feature Development
```
/plan   [feature description]
/cook   plans/[plan].md
/test
/review plans/[plan].md
/git:commit
/git:push
/git:pr
```

### Bug Fixing
```
/scout  [query]
/debug  [issue]
/fix:*  [bug]
/test
/review
/git:commit
/git:push
```

### iOS Development
```
/plan       [feature]
/ios:cook   plans/[plan].md
/ios:test   --unit
/ios:simulator --boot "iPhone 16"
/ios:simulator --launch com.example.app
/review     plans/[plan].md
```

### Documentation
```
/docs:init
/cook       [feature]
/docs:update [what changed]
/git:commit
/git:push
```

---

## Command Arguments & Syntax

### Argument Types
- **Simple**: `[text]` - Single line text
- **Optional**: `[optional text]` - Can be omitted
- **Choice**: `[--option1 | --option2]` - Pick one
- **Path**: `plans/[file].md` - File path
- **Flags**: `[--flag1] [--flag2]` - Boolean flags

### Emoji Hints
- 💡 - Info/suggestion
- 👉👉👉 - Direct instruction
- ✨ - Generation/creation
- 🔍 - Search/discovery
- 📚 - Documentation
- 🤖 - Agent operation
- ⭑ - Special/important

---

## Platform Routing

### Automatic Detection
- **File Extension**: `.tsx` → web, `.swift` → iOS, `.kt` → Android
- **Project Structure**: `package.json` → web, `Package.swift` → iOS, `build.gradle` → Android
- **Command Prefix**: `/web:`, `/ios:`, `/android:` explicit

### Fallback Behavior
- Unknown context defaults to global orchestrator
- Global commands available everywhere
- Platform agents invoked when platform detected

---

## Common Patterns

### Parallel Execution
- Multiple `/cook` on different features (file ownership prevents conflicts)
- Multiple `/test` across platforms simultaneously
- Researcher agents run in parallel during `/plan`

### Sequential Dependencies
- `/plan` must complete before `/cook`
- `/cook` must complete before `/test`
- `/test` must pass before `/review`
- `/review` must pass before `/git:commit`

### File Ownership
- Each phase owns exclusive files
- No overlaps in parallel development
- Phase dependencies tracked separately

---

## Internal Scripts (Session Management)

### set-active-plan

Writes plan path to session state for cross-session persistence.

**Location**: `.claude/scripts/set-active-plan.cjs`
**Usage**: `node .claude/scripts/set-active-plan.cjs <plan-directory>`
**Environment**: Requires `CK_SESSION_ID` (set automatically in Claude Code)

**Exit Codes**:
- `0`: Success
- `1`: Error (missing argument, invalid path, write failure)

**Examples**:
```bash
# Absolute path
node .claude/scripts/set-active-plan.cjs /Users/ddphuong/Projects/agent-kit/epost_agent_kit/plans/260206-0003-my-feature

# Relative path (resolved from cwd)
node .claude/scripts/set-active-plan.cjs plans/260206-0003-my-feature
```

**Behavior**:
- Creates/updates `/tmp/ck-session-{sessionId}.json`
- Validates directory exists
- Normalizes paths (removes trailing slashes)
- Preserves existing session state (merge operation)
- Warns if `CK_SESSION_ID` not set (state won't persist)

---

### get-active-plan

Reads and prints current active plan path from session state.

**Location**: `.claude/scripts/get-active-plan.cjs`
**Usage**: `node .claude/scripts/get-active-plan.cjs`
**Returns**: Plan path or `"none"`

**Examples**:
```bash
# Get active plan
node .claude/scripts/get-active-plan.cjs
# Output: /Users/ddphuong/Projects/agent-kit/epost_agent_kit/plans/260206-0003-my-feature

# No active plan or no session
node .claude/scripts/get-active-plan.cjs
# Output: none
```

**Behavior**:
- Returns `"none"` if no session ID
- Returns `"none"` if no active plan set
- Gracefully handles corrupted session files (returns `"none"`)
- Exit code always `0`

---

## Troubleshooting Commands

### Debug Commands
```
/scout agents              # List all agents
/scout skills              # List all skills
/ask agent descriptions    # Get agent info
/review                    # Check current state
```

### Validation Commands
```
/plan:validate [plan-path]
npm run validate:agents
npm run validate:commands
npm run validate:hooks
npm run lint
npm run typecheck
```

---

**Created by**: Phuong Doan
**Last Updated**: 2026-02-06
**Total Commands**: 31 (+ 2 internal scripts)
**Version**: 0.2.0
