# Claude Commands Analysis Report

**Created by**: Phuong Doan
**Date**: 2026-02-05
**Agent**: general-purpose (a52556b)

## Overview

Complete analysis of all command files in `.claude/commands/` directory. Total commands analyzed: **70+ commands** across multiple categories.

## Command Categories

### 1. Core Development Commands

#### `/bootstrap` - Project Initialization (⚡⚡⚡⚡⚡)
- **Purpose**: Step-by-step project bootstrapping with full workflow
- **Key Features**:
  - Git initialization check
  - Research phase with parallel researcher agents
  - Tech stack selection and approval
  - Wireframe & design phase with UI/UX designer
  - Implementation with multimodal AI assets
  - Testing, code review, documentation
  - Onboarding and configuration
- **Workflow**: Research → Tech Stack → Design → Implementation → Testing → Review → Documentation → Onboarding → Final Report
- **Variants**: `/bootstrap:auto`, `/bootstrap:auto/fast`, `/bootstrap:auto/parallel`

#### `/cook` - Feature Implementation (⚡⚡⚡)
- **Purpose**: Implement features step by step with internal planning
- **Key Features**:
  - Integrated planning (no separate `/plan` needed)
  - Question-driven approach with AskUserQuestion
  - Research, plan, implementation, testing phases
  - Code review and project management
  - YAGNI/KISS/DRY principles enforcement
- **Workflow**: Research → Plan → Implementation → Testing → Code Review → Documentation → Onboarding → Final Report
- **Variants**: `/cook:auto`, `/cook:auto/fast`, `/cook:auto/parallel`

#### `/plan` - Create Implementation Plans (⚡⚡⚡)
- **Purpose**: Intelligent plan creation with prompt enhancement
- **Key Features**:
  - Active vs suggested plan detection
  - Routes to `/plan:fast` or `/plan:hard` based on complexity
  - Progressive disclosure structure
  - YAML frontmatter with metadata
- **Workflow**: Analyze task → Decide complexity → Execute appropriate slash command → Activate planning skill

#### `/code` - Execute Plans (⚡⚡⚡)
- **Purpose**: Start coding & testing an existing plan
- **Key Features**:
  - 6-step workflow with validation gates
  - TodoWrite tracking for all steps
  - Interactive review-fix cycle (max 3 cycles)
  - User approval required at Step 4 (blocking gate)
  - Parallel status updates and auto-commit
- **Workflow**: Plan Detection → Analysis & Task Extraction → Implementation → Testing → Code Review & Approval → Finalize
- **Variants**: `/code:auto`, `/code:parallel`, `/code:no-test`

### 2. Planning Commands

#### `/plan:fast` (⚡⚡)
- **Purpose**: No research, analyze and create plan quickly
- **Workflow**: Pre-creation check → Use planner subagent → Create plan with progressive disclosure
- **Output**: Plan directory with YAML frontmatter, plan.md, phase files

#### `/plan:hard` (⚡⚡⚡)
- **Purpose**: Research, analyze, and create comprehensive plan
- **Key Features**:
  - Max 2 parallel researcher agents (max 5 tool calls each)
  - Scout codebase if needed
  - Optional post-plan validation
- **Workflow**: Research (parallel) → Analyze codebase → Create plan → Optional validation interview
- **Variants**: `/plan:validate`, `/plan:parallel`, `/plan:cro`, `/plan:two`, `/plan:ci`, `/plan:archive`

### 3. Fix Commands

#### `/fix` - Intelligent Issue Routing (⚡⚡)
- **Purpose**: Analyzes issues and routes to specialized fix command
- **Decision Tree**:
  - Type Errors → `/fix:types`
  - UI/UX Issues → `/fix:ui`
  - CI/CD Issues → `/fix:ci`
  - Test Failures → `/fix:test`
  - Log Analysis → `/fix:logs`
  - Multiple Issues → `/fix:parallel`
  - Complex Issues → `/fix:hard`
  - Simple Fixes → `/fix:fast`

#### `/fix:fast` (⚡)
- **Purpose**: Quick fixes for small issues
- **Workflow**: Analyze → Debug → Fix → Test → Report

#### `/fix:hard` (⚡⚡⚡)
- **Purpose**: Plan and fix hard issues with subagents
- **Key Features**:
  - Multimodal analysis for screenshots/videos
  - Sequential thinking and problem-solving skills
  - Debug → Research → Plan → Code
- **Variants**: `/fix:logs`, `/fix:parallel`, `/fix:test`, `/fix:types`, `/fix:ci`, `/fix:ui`

### 4. Testing & Debugging Commands

#### `/test` (⚡)
- **Purpose**: Run tests locally and analyze summary report
- **Key Features**: Uses tester subagent, no implementation

#### `/debug` (⚡⚡)
- **Purpose**: Debug technical issues and provide solutions
- **Key Features**: Uses debugger subagent, no automatic fix implementation

### 5. Design Commands

#### `/design:good`
- **Purpose**: Create immersive design with top-tier UI/UX
- **Required Skills** (Priority Order):
  1. `ui-ux-pro-max` - Design intelligence database (ALWAYS FIRST)
  2. `frontend-design` - Screenshot analysis and design replication
- **Key Features**:
  - Multi-domain searches (product, style, typography, color)
  - Research about design trends
  - AI multimodal for asset generation and verification
  - Background removal tools
  - Storytelling designs, 3D experiences, micro-interactions
- **Workflow**: ui-ux-pro-max searches → Research → Design → Review → Update guidelines
- **Variants**: `/design/video`, `/design/screenshot`, `/design/3d`, `/design/describe`, `/design/fast`

### 6. Content Creation Commands

#### `/content:good`
- **Purpose**: Write good creative & smart copy
- **Workflow**: Multimodal analysis (if media) → Research (parallel) → Scout → Plan → Write copy
- **Variants**: `/content:cro`, `/content:fast`, `/content:enhance`

### 7. Documentation Commands

#### `/docs:init` (⚡⚡⚡⚡)
- **Purpose**: Analyze codebase and create initial documentation
- **Phase 1**: Parallel codebase scouting
  - Calculate LOC per directory (skip credentials, cache, external modules)
  - Spawn multiple scout subagents (each <200K tokens context)
  - Merge scout reports
- **Phase 2**: Documentation creation (docs-manager agent)
  - README.md (<300 lines)
  - docs/project-overview-pdr.md
  - docs/codebase-summary.md
  - docs/code-standards.md
  - docs/system-architecture.md
  - docs/project-roadmap.md
  - docs/deployment-guide.md [optional]
  - docs/design-guidelines.md [optional]
- **Phase 3**: Size check (post-generation)
  - Check LOC against docs.maxLoc (default: 800)
  - Report oversized files
- **Variants**: `/docs:update`, `/docs:summarize`

### 8. Scout Commands

#### `/scout` (⚡⚡)
- **Purpose**: Scout directories to respond to user's requests
- **Key Features**:
  - Fast, token efficient agents
  - Parallel exploration with multiple Explore subagents
  - 3-minute timeout per agent
  - Intelligent directory assignment
- **Arguments**: [user-prompt] [scale] (defaults to 3)
- **Variants**: `/scout:ext`

### 9. Git Commands

#### `/git:pr`
- **Purpose**: Create a pull request
- **Workflow**:
  1. Ensure remote is synced (fetch + push)
  2. Analyze REMOTE diff (critical - always compare remote branches)
  3. Generate PR content from remote diff
  4. Create PR with gh cli
- **Important**: Always use remote branches, not local changes

#### `/git:cm`
- **Purpose**: Stage all files and create commits
- **Key Features**: Categorize commits, split if necessary, DO NOT push
- **Variants**: `/git:cp` (cherry-pick), `/git:merge`

### 10. Code Review Commands

#### `/review:codebase` (⚡⚡⚡)
- **Purpose**: Scan & analyze the codebase
- **Workflow**: Research (2 parallel agents, max 5 sources) → Scout → Code Review (parallel) → Plan → Final Report
- **Variants**: `/review:codebase/parallel`

### 11. Utility Commands

#### `/worktree`
- **Purpose**: Create isolated git worktree for parallel development
- **Key Features**:
  - Auto-detect branch prefix from keywords (fix, feat, refactor, docs, test, chore, perf)
  - Monorepo support with project selection
  - Auto-copy .env*.example files
  - AI-guided dependency installation
- **Commands**: create, remove, info, list
- **Error Codes**: MISSING_ARGS, PROJECT_NOT_FOUND, BRANCH_CHECKED_OUT, WORKTREE_EXISTS, etc.

#### `/use-mcp`
- **Purpose**: Utilize Model Context Protocol (MCP) server tools
- **Execution**:
  1. Primary: Execute via Gemini CLI with stdin pipe (preserves context budget)
  2. Fallback: Use mcp-manager subagent
- **Important**: MUST use stdin piping, NOT -p flag (deprecated, skips MCP init)

#### `/kanban`
- **Purpose**: AI agent orchestration board (Coming Soon)
- **Features**: Plan cards with progress bars, phase status breakdown, timeline/Gantt visualization, activity heatmap
- **Usage**: `/kanban [dir]`, `/kanban --stop`
- **Execution**: Run as CC background task with `run_in_background: true`, timeout 300000ms

#### `/preview`
- **Purpose**: Universal viewer for markdown files and directories
- **Usage**: `/preview <file.md>`, `/preview <directory/>`, `/preview --stop`
- **Execution**: Uses markdown-novel-viewer skill, runs as CC background task

#### `/journal` (⚡)
- **Purpose**: Write journal entries
- **Key Features**: Uses journal-writer subagent to explore memories and code changes
- **Output**: Concise entries in ./docs/journals/

#### `/watzup` (⚡)
- **Purpose**: Review recent changes and wrap up work
- **Output**: Detailed summary of all changes (modified, added, removed)

#### `/ask` (⚡)
- **Purpose**: Answer technical and architectural questions
- **Role**: Senior Systems Architect with 4 specialized advisors:
  1. Systems Designer - system boundaries, interfaces, component interactions
  2. Technology Strategist - tech stacks, frameworks, patterns
  3. Scalability Consultant - performance, reliability, growth
  4. Risk Analyst - issues, trade-offs, mitigation
- **Output Format**: Architecture Analysis → Design Recommendations → Technology Guidance → Implementation Strategy → Next Actions

#### `/brainstorm` (⚡⚡)
- **Purpose**: Brainstorm a feature
- **Key Features**: Activates brainstorming skill, solution brainstormer expert

#### `/ck-help`
- **Purpose**: ClaudeKit usage guide
- **Key Features**:
  - Intent validation with keyword matching
  - Translation to English before processing
  - Output type detection (@CK_OUTPUT_TYPE:<type>)
  - Types: comprehensive-docs, category-guide, command-details, search-results, task-recommendations
- **Execution**: `python .claude/scripts/ck-help.py "$ARGUMENTS"`

#### `/coding-level`
- **Purpose**: Set coding experience level for tailored explanations
- **Levels**: 0 (ELI5), 1 (Junior), 2 (Mid-Level), 3 (Senior), 4 (Tech Lead), 5 (God Mode - default)
- **How It Works**: Set codingLevel in .claude/.ck.json, auto-injected on session start

### 12. Skill Management Commands

#### `/skill:create`
- **Purpose**: Create a new agent skill
- **Key Features**:
  - Token consumption efficient
  - Progressive disclosure
  - SKILL.md is short and concise
  - Handles URLs, GitHub repos (with repomix), multiple files
- **Important**: Skills are practical instructions, not documentation

#### `/skill:add`, `/skill:update`, `/skill:optimize`, `/skill:plan`, `/skill:fix-logs`
- Various skill management and optimization commands

### 13. Integration Commands

#### `/integrate:sepay`, `/integrate:polar`
- Integration-specific commands for external services

### 14. Test Commands

#### `/test:ui`
- UI-specific testing command

## Key Patterns & Best Practices

### 1. Subagent Orchestration
- **Parallel Execution**: Multiple researcher/scout/explorer agents for speed
- **Sequential Chaining**: Planning → Implementation → Testing → Review
- **Token Efficiency**: Each subagent <200K tokens context
- **Task Tool Pattern**: `Task(subagent_type="[type]", prompt="[task]", description="[brief]")`

### 2. Progressive Disclosure
- Plan directory structure:
  ```
  plans/{timestamp}-{slug}/
  ├── research/
  ├── reports/
  ├── scout/
  ├── plan.md (YAML frontmatter + overview <80 lines)
  └── phase-XX-{name}.md (detailed sections)
  ```

### 3. Validation Gates
- **Code Command**: Step 4 requires user approval (blocking gate)
- **Testing**: 100% pass rate required before proceeding
- **Code Review**: Critical issues must be 0 or user-approved

### 4. Naming Conventions
- Reports: `{agent}-{timestamp}-{slug}.md`
- Plans: `{timestamp}-{slug}/`
- Phases: `phase-XX-{name}.md`

### 5. Core Principles (All Commands)
- **YAGNI** (You Aren't Gonna Need It)
- **KISS** (Keep It Simple, Stupid)
- **DRY** (Don't Repeat Yourself)
- **Token Efficiency**: Sacrifice grammar for concision in reports
- **List unresolved questions** at end of reports

### 6. Multimodal AI Usage
- Image generation: `ai-multimodal` skill
- Image analysis: `ai-multimodal` skill (verify quality)
- Background removal: Background Removal Tool
- Image editing: ImageMagick (crop, resize)
- Video analysis: `ai-multimodal` (video-analysis)

## Command Complexity Ratings

| Rating | Description | Examples |
|--------|-------------|----------|
| ⚡ | Basic/Quick | /test, /debug, /watzup, /journal |
| ⚡⚡ | Moderate | /plan:fast, /fix, /scout, /brainstorm |
| ⚡⚡⚡ | Advanced | /cook, /code, /plan:hard, /fix:hard, /review:codebase |
| ⚡⚡⚡⚡ | Complex | /docs:init |
| ⚡⚡⚡⚡⚡ | Ultra Complex | /bootstrap |

## Common Workflows

### Feature Development
1. `/plan:hard <task>` - Research and create plan
2. `/code <plan-path>` - Execute plan with validation gates
3. `/watzup` - Review changes
4. `/git:cm` - Commit changes
5. `/git:pr` - Create pull request

### Quick Feature (Auto Mode)
1. `/cook <task>` - Internal planning + implementation
2. `/watzup` - Review changes
3. `/git:cm` - Commit

### New Project
1. `/bootstrap <requirements>` - Full project setup
2. `/docs:init` - Generate documentation
3. `/git:cm` - Initial commit

### Bug Fixing
1. `/fix <issues>` - Routes to appropriate fix command
2. `/test` - Verify fix
3. `/git:cm` - Commit fix

### Design Work
1. `/design:good <requirements>` - Create immersive design
2. Review and iterate
3. Update design guidelines

## Integration Points

### Skills Activation
- Commands analyze skills catalog
- Activate needed skills during process
- Skills examples: `ui-ux-pro-max`, `frontend-design`, `ai-multimodal`, `planning`, `debugging`, `problem-solving`, `brainstorming`, `chrome-devtools`, `imagemagick`

### External Tools
- **gh** - GitHub CLI for PR/issue management
- **gemini** - Gemini CLI for MCP operations
- **repomix** - Repository summarization
- **chrome-devtools** - Frontend verification
- **ImageMagick** - Image processing

### Report Outputs
- Research: `≤150 lines` per report
- Plans: Overview `<80 lines`, phases with detailed sections
- Documentation: README `<300 lines`, other docs `<800 lines` (default)

## Unresolved Questions

None - all command structures are well-documented and consistent.

---

**Total Commands**: 70+
**Categories**: 14
**Key Principles**: YAGNI, KISS, DRY, Token Efficiency
**Architecture**: Subagent orchestration with parallel/sequential execution
**Output**: Progressive disclosure with validation gates
