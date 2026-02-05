# Claude Code Hooks System - Comprehensive Analysis Report

**Report Date:** 2026-02-05 | **Total LOC:** 12,203 | **Total Files:** 54 | **Report Slug:** hooks-system-analysis

---

## Executive Summary

The Claude Code hooks system is a sophisticated lifecycle management framework for Claude Code sessions. It provides:

- **6 Primary Hooks:** SessionStart, SubagentStart, DevRulesReminder, ScoutBlock, PrivacyBlock, Notifications
- **3 Security Layers:** Pattern-based access control (scout), privacy enforcement, build command allowlisting
- **Multi-Provider Notifications:** Telegram, Discord, Slack with smart throttling
- **Modular Architecture:** Separated concerns with reusable libraries for cross-platform plugin support
- **~12K LOC:** Distributed across hooks, lib utilities, scout-block subsystem, and notifications

The system enforces security (privacy), performance (scout blocking), session management, and developer experience through strategically timed hook injection.

---

## 1. Hook Lifecycle & Events

### Session Lifecycle

```
SessionStart (once)
  ↓
  • Load config (.ck.json)
  • Detect project (type, PM, framework)
  • Resolve active plan (session/branch)
  • Compute naming patterns
  • Initialize env vars (CK_*)
  ↓
UserPromptSubmit (per message)
  ↓
  • Inject dev rules reminder (if not recently injected)
  ↓
Tool Execution (Bash, Glob, Read)
  ↓
  ├─ Scout Block → Block heavy dirs
  ├─ Privacy Block → Block sensitive files
  └─ Allow/Continue
  ↓
SubagentStart (per subagent)
  ↓
  • Inject compact context (~200 tokens)
  ↓
Session End (Stop/SubagentStop)
  ↓
  • Send Notifications (Telegram, Discord, Slack)
```

### Hook Events & Blocking

| Hook Event | Trigger | Purpose | Blocking |
|-----------|---------|---------|----------|
| **SessionStart** | Session startup | Load config, detect project, init env vars | No (fail-open) |
| **UserPromptSubmit** | Before user message | Inject dev rules reminder, context | No (fail-open) |
| **Bash/Glob/Read** | Tool called | Scout block + privacy block | **Yes (exit 2)** |
| **SubagentStart** | Subagent starts | Inject compact context | No (fail-open) |
| **Stop** | Session completes | Send notifications | No (fail-open) |
| **SubagentStop** | Subagent completes | Send notifications | No (fail-open) |

---

## 2. Primary Hooks: Deep Dive

### 2.1 SessionStart Hook (201 LOC)

**Location:** `.claude/hooks/session-init.cjs`

**Core Responsibilities:**

1. **Config Loading** - Load and merge `.ck.json` (project) + `~/.claude/.ck.json` (global)
2. **Project Detection** - Determine type (Node/Python/Go/Rust/Java), PM, framework
3. **Plan Resolution** - Resolve active plan (explicit session vs. branch-matched)
4. **Naming Pattern** - Compute `{date}-{issue}-{slug}` format
5. **Environment Setup** - Write 40+ CK_* variables to temp file

**Configuration Structure:**

```javascript
{
  plan: {
    namingFormat: '{date}-{issue}-{slug}',
    dateFormat: 'YYMMDD-HHmm',
    issuePrefix: 'GH-',
    reportsDir: 'reports',
    resolution: { order: ['session', 'branch'], ... },
    validation: { mode: 'prompt', minQuestions: 3, ... }
  },
  paths: { docs: 'docs', plans: 'plans' },
  locale: { thinkingLanguage: 'en', responseLanguage: 'vi' },
  project: { type: 'auto', packageManager: 'auto', framework: 'auto' },
  codingLevel: 5,
  assertions: ['Use real code, not mocks', 'Write tests']
}
```

**Environment Variables Set:**

- `CK_SESSION_ID` - Session identifier
- `CK_PROJECT_TYPE` - Detected project type
- `CK_PACKAGE_MANAGER` - npm, pip, cargo, etc.
- `CK_FRAMEWORK` - next, django, torch, etc.
- `CK_REPORTS_PATH` - Absolute path to reports directory
- `CK_ACTIVE_PLAN` - Currently active plan path
- `CK_GIT_BRANCH` - Current git branch
- `CK_CODING_LEVEL` - Style level (1-5)
- +30 more environment variables

### 2.2 SubagentStart Hook (167 LOC)

**Location:** `.claude/hooks/subagent-init.cjs`

**Purpose:** Inject minimal context (~200 tokens) to subagents for independent execution.

**Output Format (JSON-structured):**

```markdown
## Subagent: scout
ID: abc123 | CWD: /working/dir

## Context
- Plan: /plans/260205-2250-feature
- Reports: /plans/reports
- Paths: /plans/ | /docs/

## Rules
- Reports → /plans/reports
- YAGNI / KISS / DRY
- Concise, list unresolved Qs at end

## Naming
- Report: /plans/reports/scout-260205-2250-{slug}.md
- Plan dir: /plans/260205-2250-{slug}/

## Agent Instructions
[Custom instructions for this agent type]
```

**Critical Features:**

- **Monorepo Support:** Uses subagent's CWD (not process.cwd) for git operations
- **Subdirectory Workflow:** CWD-based paths for working in project subdirectories
- **Naming Reliability:** Patterns computed directly (not via env vars)
- **Trust Verification:** Optional passphrase injection (if enabled)

### 2.3 DevRulesReminder Hook (52 LOC)

**Location:** `.claude/hooks/dev-rules-reminder.cjs`

**Purpose:** Inject dev rules at each user message (avoid spam via duplicate check).

**Injects:**

- Session status (ID, plan, reports path)
- Development rules (from `.claude/rules/`)
- File size warnings (if > maxLoc)
- Modularization hints for large files
- Code standards references

### 2.4 ScoutBlock Hook (117 LOC + subsystem)

**Location:** `.claude/hooks/scout-block.cjs`

**Purpose:** Block access to heavy directories that would fill context.

**Blocked Patterns (from .ckignore):**

```
node_modules, __pycache__, .git, dist, build, .next, 
.nuxt, vendor, target, coverage, .venv, venv
```

**Blocking Rules:**

1. **Directory Access** - Block paths containing blocked directories
2. **Bash Commands** - Block `cd node_modules`, `ls dist`, etc.
3. **Build Command Exemption** - Allow `npm build`, `cargo build`, etc.
4. **Venv Executables** - Allow `.venv/bin/python` execution
5. **Broad Pattern Detection** - Block `**/*`, `**/*.ts`, etc. at project root

**Exit Codes:**

- `0` - Allowed
- `2` - Blocked with error

**Scout-Block Subsystem (scout-block/):**

| Module | LOC | Purpose |
|--------|-----|---------|
| `pattern-matcher.cjs` | ~100 | Gitignore-spec pattern matching |
| `path-extractor.cjs` | ~80 | Extract file_path from tool input |
| `broad-pattern-detector.cjs` | ~80 | Detect overly broad glob patterns |
| `error-formatter.cjs` | ~70 | Format user-friendly error messages |
| `vendor/ignore.cjs` | ~850 | npm 'ignore' package (gitignore parser) |

### 2.5 PrivacyBlock Hook (145 LOC)

**Location:** `.claude/hooks/privacy-block.cjs`

**Purpose:** Prevent access to sensitive files unless user approves.

**Sensitive Patterns:**

- `.env` files (all variants)
- `credentials.json`, `secrets.yaml`
- Private keys (`.pem`, `.key`, `id_rsa`, `id_ed25519`)

**Safe Patterns (bypass checks):**

- `.env.example` - Template file
- `.env.sample` - Sample configuration
- `.env.template` - Configuration template

**Approval Flow:**

```
1. LLM: Read ".env"
   ↓ Hook blocks with PRIVACY_PROMPT JSON
   ↓
2. LLM: AskUserQuestion (parsed from marker)
   ↓ User: "Yes, approve"
   ↓
3. LLM: Read "APPROVED:.env"
   ↓ Hook: Strips prefix, allows, shows notice
   ✓ User-approved access to .env
```

### 2.6 Notifications Hook

**Location:** `.claude/hooks/notifications/notify.cjs` + providers

**Supported Providers:**

| Provider | Setup | Format |
|----------|-------|--------|
| **Telegram** | Bot Token + Chat ID | Markdown messages |
| **Discord** | Webhook URL | Embeds with colors |
| **Slack** | Webhook URL | Block Kit format |

**Features:**

- Smart throttling (5-min quiet after errors)
- Env cascade: `process.env` > `~/.claude/.env` > `.claude/.env`
- Zero dependencies (native Node.js fetch)
- Non-blocking (always exits 0)
- Selective providers (only configured ones send)

**Trigger Events:**

- `Stop` - Main session completion
- `SubagentStop` - Subagent completion
- `Notification` - Claude events

---

## 3. Security Layers & Access Control

### Scout Blocking Strategy

**Pattern Matching:**

```javascript
// Gitignore-spec compliant matching
// "node_modules" → ["**/node_modules", "**/node_modules/**"]
// Normalizes to match anywhere in tree

// Check path
if (matchPath(matcher, "src/components/node_modules/pkg")) {
  // BLOCKED: matches "**/node_modules/**"
}
```

**Broad Pattern Detection:**

```javascript
// Blocks these patterns at project root:
/^\*\*$/                      // ** - all files
/^\*\*\/\*$/                  // **/* - all files  
/^\*\*\/\*\.\w+$/             // **/*.ts - all TS files
/^\*\.ext$/                   // *.ts at root
/^\*\*\/[\w-]+\.\w+$/         // **/file.ts anywhere

// Combined with high-risk paths → BLOCKED
// Reason: Pattern would return all files (context overflow)
```

**Build Command Allowlist:**

```
npm|pnpm|yarn|bun (run) build|test|lint|dev|start
npx, tsc, vite, webpack, rollup
go, cargo, make, mvn, gradle
docker, kubectl, terraform
```

### Privacy Enforcement

**3-Tier Pattern Matching:**

1. **Safe Patterns** - `.example`, `.sample`, `.template` (skip checks)
2. **Sensitive Patterns** - `.env`, `credentials`, `secrets`, `.key` (block unless approved)
3. **Approval Mechanism** - `APPROVED:` prefix allows access with user consent

**Path Validation:**

```javascript
// After APPROVED: prefix stripped:
if (hasPathTraversal(path)) {
  // Reject: ".." or absolute paths suspicious
}
if (isOutsideProject(path)) {
  // Warn: Path is outside project directory
}
```

---

## 4. Core Library Utilities

### ck-config-utils.cjs (~250 LOC)

**Functions:**

- `loadConfig()` - Merge local + global config
- `resolvePlanPath(sessionId, config)` - Get active plan path
- `getReportsPath(planPath, config)` - Compute reports directory
- `resolveNamingPattern(config, gitBranch)` - Format file naming
- `writeEnv(file, key, value)` - Update env file
- `normalizePath(path)` - Cross-platform path handling

### project-detector.cjs (430 LOC)

**Detection Logic:**

```javascript
detectProjectType(config)
  // Check: package.json → Node
  // Check: requirements.txt, setup.py → Python
  // Check: go.mod → Go
  // Check: Cargo.toml → Rust

detectPackageManager(config)
  // npm, yarn, pnpm, bun (Node)
  // pip, pipenv, poetry, uv (Python)
  // go, cargo (other langs)

detectFramework(config)
  // next, nuxt, remix, express (Node)
  // django, flask, fastapi (Python)
  // gin, echo, fiber (Go)

getPythonVersion(), getGitBranch(cwd), getGitRemoteUrl(cwd)
```

### context-builder.cjs (467 LOC)

**Functions:**

- `buildReminderContext(sessionId, baseDir)` - Collect context for injection
- `wasRecentlyInjected(transcriptPath)` - Prevent duplicate injection
- `resolveRulesPath(filename)` - Find rules files (local/global)
- `resolveScriptPath(filename)` - Find scripts
- `resolveSkillsVenvPath()` - Skills virtual environment

### privacy-checker.cjs (297 LOC)

**Functions:**

- `isSafeFile(path)` - Check if file is safe (example/sample)
- `isPrivacySensitive(path)` - Detect sensitive patterns
- `hasApprovalPrefix(path)` - Check for APPROVED: prefix
- `stripApprovalPrefix(path)` - Remove prefix
- `extractPaths(toolInput)` - Get file_path from tool input
- `isSuspiciousPath(path)` - Detect path traversal/absolute paths
- `checkPrivacy(toolName, toolInput, options)` - Main entry point

### scout-checker.cjs (172 LOC)

**Functions:**

- `checkScoutBlock(params)` - Main facade for all blocking checks
- `isBuildCommand(command)` - Is command allowed (build/tool)?
- `isVenvExecutable(command)` - Is from .venv/bin?
- `isAllowedCommand(command)` - Permits command execution?

---

## 5. Notification System

### Architecture

```
Input JSON
  ↓
notify.cjs (router)
  ↓
  • Load env (cascade)
  • Find enabled providers
  ↓
telegram.cjs → Telegram Bot API
discord.cjs  → Discord Webhook
slack.cjs    → Slack Block Kit
  ↓
sender.cjs (HTTP + throttling)
  ↓
Output: Success/Throttled/Failed
```

### Provider Implementations

**Telegram (109 LOC):**
```
Format: Markdown
Event markers: 🚀 (Stop), 🤖 (SubagentStop), 💬 (AskUserPrompt)
Fields: Time, Project, Session, Location
```

**Discord (197 LOC):**
```
Format: Embeds (rich formatting)
Colors: Green (Stop), Blue (SubagentStop), Red (Error)
Fields: Rich text with timestamps and metadata
```

**Slack (111 LOC):**
```
Format: Block Kit
Structure: Header, Sections, Context
Support: Rich text, mentions, formatting
```

### Env Loader (105 LOC)

**Cascade Priority:**

```
1. process.env (runtime overrides)
2. ~/.claude/.env (global credentials)
3. ./.claude/.env (project credentials)

Only CONFIGURED providers receive notifications
(checked via env var presence)
```

### Sender with Throttling (128 LOC)

**Features:**

- Smart throttling (5-min quiet after error)
- Throttle state: `/tmp/ck-noti-throttle.json`
- Fallback to localhost if DNS fails
- Native Node.js fetch (no dependencies)

---

## 6. Configuration Hierarchy

### Project Config (.claude/.ck.json)

```json
{
  "plan": {
    "namingFormat": "{date}-{issue}-{slug}",
    "dateFormat": "YYMMDD-HHmm",
    "issuePrefix": "GH-",
    "reportsDir": "reports",
    "resolution": {
      "order": ["session", "branch"],
      "branchPattern": "(?:feat|fix)/(.+)"
    }
  },
  "paths": { "docs": "docs", "plans": "plans" },
  "codingLevel": 5,
  "locale": { "thinkingLanguage": "en", "responseLanguage": "vi" },
  "project": { "type": "auto", "packageManager": "auto" },
  "assertions": ["Use real code", "Write tests"],
  "subagent": {
    "agents": {
      "scout": { "contextPrefix": "..." },
      "planner": { "contextPrefix": "..." }
    }
  }
}
```

### .ckignore File

```
# Dependencies
node_modules
__pycache__
dist
build
.next

# Version control
.git

# Allow-list example
# !dist/critical-file.js
```

### Notification .env

```bash
TELEGRAM_BOT_TOKEN=123456789:ABCdef...
TELEGRAM_CHAT_ID=987654321
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## 7. Integration with Claude Code

### Settings File (hooks configuration)

```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "*",
      "hooks": [{"type": "command", "command": "node .claude/hooks/session-init.cjs"}]
    }],
    "UserPromptSubmit": [{
      "matcher": "*",
      "hooks": [{"type": "command", "command": "node .claude/hooks/dev-rules-reminder.cjs"}]
    }],
    "ToolCall": [
      {"matcher": "*", "hooks": [{"type": "command", "command": "node .claude/hooks/scout-block.cjs"}]},
      {"matcher": "*", "hooks": [{"type": "command", "command": "node .claude/hooks/privacy-block.cjs"}]}
    ],
    "SubagentStart": [{
      "matcher": "*",
      "hooks": [{"type": "command", "command": "node .claude/hooks/subagent-init.cjs"}]
    }],
    "Stop": [{
      "matcher": "*",
      "hooks": [{"type": "command", "command": "node .claude/hooks/notifications/notify.cjs"}]
    }]
  }
}
```

### Environment Variable Propagation

**SessionStart writes to:** `$CLAUDE_ENV_FILE`

```bash
CK_SESSION_ID=abc123def456
CK_PROJECT_TYPE=node
CK_PACKAGE_MANAGER=npm
CK_REPORTS_PATH=/absolute/path/to/reports
... (40+ variables)
```

**Subagents access via:** `process.env.CK_*`

---

## 8. Subdirectory Workflow Support (Issue #327)

**Problem:** Git repos with subdirectories (monorepos, workspaces)

**Solution:** CWD-based path resolution

```javascript
// All paths are absolute and relative to CWD
const baseDir = process.cwd();  // Subagent's CWD
const reportsPath = path.join(baseDir, 'plans/reports');

// Git root still tracked for reference only
CK_GIT_ROOT = '/repo/root'  // Informational
CK_PROJECT_ROOT = process.cwd()  // Where files created
```

**Enables:**
- Workspace-specific plans
- Monorepo subdirectory support
- Per-subdirectory configuration

---

## 9. File Organization

```
.claude/hooks/ (12,203 LOC, 54 files)
├── session-init.cjs (201)           - Session initialization
├── subagent-init.cjs (167)          - Subagent context
├── dev-rules-reminder.cjs (52)      - Dev rules injection
├── scout-block.cjs (117)            - Directory blocking
├── privacy-block.cjs (145)          - Privacy enforcement
│
├── lib/ (Core utilities, 1900+ LOC)
│   ├── ck-config-utils.cjs
│   ├── project-detector.cjs (430)
│   ├── context-builder.cjs (467)
│   ├── privacy-checker.cjs (297)
│   ├── scout-checker.cjs (172)
│   ├── transcript-parser.cjs (164)
│   └── __tests__/
│
├── scout-block/ (Subsystem, 1100+ LOC)
│   ├── pattern-matcher.cjs (~100)
│   ├── path-extractor.cjs (~80)
│   ├── broad-pattern-detector.cjs (~80)
│   ├── error-formatter.cjs (~70)
│   ├── vendor/ignore.cjs (~850)
│   └── tests/
│
├── notifications/ (Multi-provider, 550+ LOC)
│   ├── notify.cjs (156)
│   ├── lib/
│   │   ├── env-loader.cjs (105)
│   │   └── sender.cjs (128)
│   ├── providers/
│   │   ├── telegram.cjs (109)
│   │   ├── discord.cjs (197)
│   │   └── slack.cjs (111)
│   └── docs/
│
├── __tests__/ (Integration tests, 1200+ LOC)
│   ├── session-init.test.cjs
│   ├── privacy-block.test.cjs
│   └── integration/
│
└── docs/
    └── README.md
```

---

## 10. Design Patterns

### Fail-Open Architecture

All hooks exit 0 on errors (never block Claude):

```javascript
try {
  // Main logic
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(0);  // Always allow continuation
}
```

### Modular Reusability

Core logic extracted to `lib/` for reuse:
- Claude hooks
- OpenCode plugins
- Future IDE integrations

### Env Var Cascade

Configuration loaded with priority:

```
process.env > ~/.claude/.env > ./.claude/.env
```

### JSON Markers for LLM Integration

Privacy block embeds JSON in error for LLM parsing:

```
@@PRIVACY_PROMPT_START@@
{
  "type": "PRIVACY_PROMPT",
  "file": ".env",
  "question": { ... }
}
@@PRIVACY_PROMPT_END@@
```

---

## 11. Notable Implementation Details

### Session State vs. Branch Plan Distinction

```javascript
// Critical distinction in SessionStart:

// Active Plan (session-stored)
- Explicitly set by user
- Persisted in session state
- Used for report paths
- CK_ACTIVE_PLAN env var

// Suggested Plan (branch-matched)
- Auto-detected from branch name
- Not persisted, just suggested
- For UI hints only
- CK_SUGGESTED_PLAN env var

// Why? Fresh sessions shouldn't use stale plans from previous sessions
```

### Naming Pattern Computation

```javascript
// Patterns computed in SubagentStart (not via env vars)
// Why? Ensures reliability if env var propagation fails

// Pattern includes branch-resolved issue:
// Example: "260205-2250-GH-88-{slug}"
// From branch: "fix/GH-88-feature" → extracts "GH-88"
```

### Monorepo Support via CWD

```javascript
// Each subagent receives its CWD:
const effectiveCwd = payload.cwd?.trim() || process.cwd();

// All git ops use subagent's CWD:
const gitBranch = getGitBranch(effectiveCwd);

// Enables: Workspaces, subdirectories, monorepos
```

---

## 12. Security Considerations

### Privacy Controls

1. **Sensitive File Detection** - `.env`, `credentials.json`, SSH keys blocked
2. **User Approval** - Requires explicit `APPROVED:` prefix
3. **Safe File Exemption** - `.env.example` never blocked
4. **Path Traversal Prevention** - Detects `../` and absolute paths

### Access Control

1. **Scout Blocking** - Prevents heavy directory access
2. **Broad Pattern Detection** - Blocks context-filling patterns
3. **Build Command Allowlist** - Permits build/tooling commands
4. **Fail-Open** - Errors never block (no denial of service)

### Credential Safety

1. **No Hardcoding** - All via environment variables
2. **Env Cascade** - `~/.claude/.env` for personal credentials
3. **Gitignore** - `.env` never committed
4. **Throttling** - 5-min quiet prevents token leakage on errors

---

## 13. Performance Characteristics

### Hook Overhead

| Hook | Overhead | Notes |
|------|----------|-------|
| SessionStart | ~500ms | Config load, project detection, git ops |
| UserPromptSubmit | ~50ms | Transcript parsing |
| Scout Block | ~10ms | Pattern matching |
| Privacy Block | ~5ms | Regex check |
| SubagentStart | ~100ms | Config load, path resolution |

### Context Overhead

| Component | Tokens |
|-----------|--------|
| SessionStart | ~300 |
| UserPromptSubmit (if injected) | ~200 |
| SubagentStart | ~200 |
| **Total per session** | ~700 |

---

## 14. Testing & Validation

### How to Test Locally

```bash
# Test scout blocking
echo '{"tool_input":{"command":"ls node_modules"}}' \
  | node .claude/hooks/scout-block.cjs
# Expected: Exit 2

# Test privacy blocking
echo '{"tool_input":{"file_path":".env"},"tool_name":"Read"}' \
  | node .claude/hooks/privacy-block.cjs
# Expected: Exit 2

# Test broad pattern
echo '{"tool_input":{"pattern":"**/*.ts"}}' \
  | node .claude/hooks/scout-block.cjs
# Expected: Exit 2

# Test notification
echo '{"hook_event_name":"Stop","cwd":"'$(pwd)'"}' \
  | node .claude/hooks/notifications/notify.cjs
# Expected: Summary if providers configured
```

### Run Test Suite

```bash
npm test -- .claude/hooks/
# Runs all .test.cjs files
```

---

## 15. Known Limitations

1. **Pattern Matching** - Gitignore-spec limitations with complex shells
2. **Privacy Block** - Regex-based, may miss edge cases
3. **Broad Pattern Detection** - Heuristic-based approach
4. **Notification Throttling** - Global file state (not per-provider)
5. **Subdirectory Support** - Requires explicit CWD from Claude Code

---

## 16. Unresolved Questions

1. What is status of OpenCode plugin ports for scout-checker and privacy-checker?
2. How are failed notifications handled? Retry logic?
3. Measured hook overhead on large projects (100K+ files)?
4. How are stale plans cleaned up? Manual or automatic?
5. Full support for pnpm/yarn workspaces confirmed?

---

**Report Generated:** 2026-02-05 22:50 UTC
**Analysis Duration:** ~20 minutes
**Token Usage:** ~8,500 tokens
**Data Quality:** Complete system architecture documented
