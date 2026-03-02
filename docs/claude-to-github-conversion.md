# Plan: Convert .claude → .github (Full Replacement)

## TL;DR

Migrate the entire epost agent system (~170 files) from Claude Code format (`.claude/`) to VS Code GitHub Copilot format (`.github/`). This is a full replacement — `.claude/` will be deleted after conversion. The target uses native Copilot customization: `.agent.md`, `.prompt.md`, `.instructions.md`, `SKILL.md`, and hooks JSON.

**Scope**: 20 agents, 38 commands, 52 skills, 7 hooks (+8 lib modules), 10 scripts, 5 output styles, 3 workflows, 3 assets, 4 config files

---

## Format Mapping Reference

### Agent Format: `.claude/agents/*.md` → `.github/agents/*.agent.md`

| Claude Frontmatter | Copilot Frontmatter | Notes |
|---|---|---|
| `name` | `name` | Direct map |
| `description` | `description` | Direct map |
| `model: sonnet` | `model: Claude Sonnet 4 (copilot)` | Qualified name required |
| `model: opus` | `model: Claude Opus 4 (copilot)` | Qualified name required |
| `model: haiku` | `model: Claude Haiku 3.5 (copilot)` | Qualified name required |
| `tools: Read, Write, Edit...` | `tools: [editFiles, terminalLastCommand, ...]` | YAML array, VS Code tool names |
| `skills: [core, web-nextjs]` | Body: `#skill:core`, `#skill:web-nextjs` | Inline skill references |
| `color` | _(drop)_ | Not supported |
| `memory` | _(drop)_ | Not supported |
| `permissionMode: plan` | Omit `editFiles`/`runInTerminal` from tools | Simulate read-only |
| `disallowedTools: Write, Edit` | Omit `editFiles` from tools | Whitelist approach |
| _(none)_ | `agents: [name1, name2]` | Declare sub-agents |
| _(none)_ | `handoffs: [name1]` | Declare handoff agents |
| _(none)_ | `user-invokable: true\|false` | Default true |
| _(none)_ | `disable-model-invocation: true\|false` | Prevent auto-routing |

### Tool Name Mapping

| Claude Tool | Copilot Tool |
|---|---|
| `Read` | `readFile` |
| `Write` | `editFiles` |
| `Edit` | `editFiles` |
| `Bash` | `runInTerminal` |
| `Grep` | `codeSearch` |
| `Glob` | `listFiles` |
| `Task` (subagent) | `agents` frontmatter + `handoffs` |
| `mcp__xcodebuildmcp__*` | `xcodebuildmcp/*` (MCP wildcard) |
| `WebFetch` | `fetchWebpage` |

### Command Format: `.claude/commands/*.md` → `.github/prompts/*.prompt.md`

| Claude Frontmatter | Copilot Frontmatter | Notes |
|---|---|---|
| `title` | _(used in description)_ | |
| `description` | `description` | Direct map |
| `agent` | `agent` | Agent name reference |
| `argument-hint` | _(drop)_ | Not supported; use `${input:varname}` in body |
| `$ARGUMENTS` | `${input:args}` | Variable substitution syntax |

### Skill Format: `.claude/skills/*/SKILL.md` → `.github/skills/*/SKILL.md`

Skills share the same open standard. Minor normalization needed:

| Claude Frontmatter | Copilot Frontmatter | Notes |
|---|---|---|
| `name` | `name` | Direct map |
| `description` | `description` | Direct map |
| `user-invocable` | `user-invokable` | Note spelling difference |
| `tier` | _(drop or keep)_ | Custom field, harmless |
| `metadata` | _(drop or keep)_ | Custom field, harmless |

### Hook Format: `.claude/settings.json` hooks → `.github/hooks/*.json`

| Claude Hook Event | Copilot Hook Event | Notes |
|---|---|---|
| `SessionStart` | `onStart` | Session startup |
| `SubagentStart` | _(none)_ | **GAP** — embed in agent body |
| `UserPromptSubmit` | `onMessage` | Each user message |
| `PreToolUse` | `onToolCall` | Before tool execution |
| `PostToolUse` | `onToolCallResult` | After tool execution |
| `Stop` | `onStop` | Session/turn end |

Hook JSON structure in Copilot:
```json
{
  "hooks": {
    "onStart": [{ "command": "node .github/hooks/scripts/session-init.cjs" }],
    "onMessage": [{ "command": "..." }],
    "onToolCall": [{ "command": "...", "events": ["editFile", "runInTerminal"] }],
    "onStop": [{ "command": "..." }]
  }
}
```

---

## Phase 0: Scaffolding

Create the target directory structure under `.github/`:

```
.github/
├── copilot-instructions.md          # Already exists (371 lines) — update
├── agents/                          # 20 agent files
├── prompts/                         # 38 prompt files (from commands)
├── skills/                          # 52 skill directories
│   └── skill-index.json
├── instructions/                    # Context-scoped instructions
├── hooks/
│   ├── lifecycle.json               # Hook event config
│   └── scripts/
│       ├── lib/                     # 8 shared modules
│       ├── scout-block/             # 4 scout modules
│       ├── notifications/           # Notification system
│       └── *.cjs                    # 7 hook scripts
├── scripts/                         # 10 utility scripts
├── output-styles/                   # 5 style instructions
├── workflows/                       # 3 workflow prompts
└── assets/                          # 3 asset files
```

**Steps:**
1. Create all directories listed above
2. Update `.github/copilot-instructions.md` — append section pointing to agents, skills, and instructions
3. Remove any `.claude`-specific references from `copilot-instructions.md` body

---

## Phase 1: Agents (20 files)

Convert each `.claude/agents/*.md` → `.github/agents/*.agent.md`

### Conversion per agent:

| # | Source | Target | Model | Tools | Special |
|---|---|---|---|---|---|
| 1 | `epost-orchestrator.md` | `epost-orchestrator.agent.md` | `Claude Haiku 3.5 (copilot)` | readFile, listFiles, codeSearch, runInTerminal, editFiles | Add `agents:` listing all 19 other agents. Hub router. |
| 2 | `epost-architect.md` | `epost-architect.agent.md` | `Claude Opus 4 (copilot)` | readFile, listFiles, codeSearch | `permissionMode: plan` → omit editFiles/runInTerminal. Add `handoffs: [epost-implementer]` |
| 3 | `epost-implementer.md` | `epost-implementer.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch | Add `handoffs: [epost-web-developer, epost-ios-developer, epost-android-developer, epost-backend-developer]` |
| 4 | `epost-web-developer.md` | `epost-web-developer.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch | |
| 5 | `epost-ios-developer.md` | `epost-ios-developer.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch, xcodebuildmcp/* | MCP tool reference |
| 6 | `epost-android-developer.md` | `epost-android-developer.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch | |
| 7 | `epost-backend-developer.md` | `epost-backend-developer.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch | |
| 8 | `epost-debugger.md` | `epost-debugger.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch | |
| 9 | `epost-tester.md` | `epost-tester.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch | |
| 10 | `epost-reviewer.md` | `epost-reviewer.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, listFiles, codeSearch | `disallowedTools: Write, Edit` → omit editFiles/runInTerminal |
| 11 | `epost-documenter.md` | `epost-documenter.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, listFiles, codeSearch | |
| 12 | `epost-researcher.md` | `epost-researcher.agent.md` | `Claude Haiku 3.5 (copilot)` | readFile, listFiles, codeSearch, fetchWebpage | Read-only + web |
| 13 | `epost-scout.md` | `epost-scout.agent.md` | `Claude Haiku 3.5 (copilot)` | readFile, listFiles, codeSearch | Read-only, `disable-model-invocation: true` |
| 14 | `epost-git-manager.md` | `epost-git-manager.agent.md` | `Claude Haiku 3.5 (copilot)` | readFile, runInTerminal, listFiles, codeSearch | Git operations only |
| 15 | `epost-guide.md` | `epost-guide.agent.md` | `Claude Haiku 3.5 (copilot)` | readFile, listFiles, codeSearch | Kit knowledge, read-only |
| 16 | `epost-brainstormer.md` | `epost-brainstormer.agent.md` | `Claude Haiku 3.5 (copilot)` | readFile, listFiles, codeSearch | Read-only |
| 17 | `epost-a11y-specialist.md` | `epost-a11y-specialist.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch | |
| 18 | `epost-muji.md` | `epost-muji.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch | Design system agent |
| 19 | `epost-kit-designer.md` | `epost-kit-designer.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch | Meta-agent for kit authoring |
| 20 | `epost-cli-developer.md` | `epost-cli-developer.agent.md` | `Claude Sonnet 4 (copilot)` | readFile, editFiles, runInTerminal, listFiles, codeSearch | CLI specialist |

### Per-file conversion steps:
1. Read source `.claude/agents/{name}.md`
2. Transform frontmatter per mapping table above
3. Replace `skills: [a, b, c]` → body references: `#skill:a`, `#skill:b`, `#skill:c`
4. Replace any `$ARGUMENTS` → `${input:args}`
5. Replace `.claude/` paths → `.github/` paths in body text
6. Replace `Task tool` / `subagent` references → `@agent-name` mentions
7. Write to `.github/agents/{name}.agent.md`

---

## Phase 2: Commands → Prompts (38 files)

Convert `.claude/commands/**/*.md` → `.github/prompts/*.prompt.md`

### Naming Convention
Flatten `namespace/sub.md` → `namespace-sub.prompt.md`:

| # | Source | Target | Agent |
|---|---|---|---|
| 1 | `cook.md` | `cook.prompt.md` | epost-implementer |
| 2 | `cook/fast.md` | `cook-fast.prompt.md` | epost-implementer |
| 3 | `cook/parallel.md` | `cook-parallel.prompt.md` | epost-implementer |
| 4 | `fix.md` | `fix.prompt.md` | epost-debugger |
| 5 | `fix/a11y.md` | `fix-a11y.prompt.md` | epost-a11y-specialist |
| 6 | `fix/ci.md` | `fix-ci.prompt.md` | epost-debugger |
| 7 | `fix/deep.md` | `fix-deep.prompt.md` | epost-debugger |
| 8 | `fix/ui.md` | `fix-ui.prompt.md` | epost-muji |
| 9 | `debug.md` | `debug.prompt.md` | epost-debugger |
| 10 | `plan.md` | `plan.prompt.md` | epost-architect |
| 11 | `plan/fast.md` | `plan-fast.prompt.md` | epost-architect |
| 12 | `plan/deep.md` | `plan-deep.prompt.md` | epost-architect |
| 13 | `plan/parallel.md` | `plan-parallel.prompt.md` | epost-architect |
| 14 | `plan/validate.md` | `plan-validate.prompt.md` | epost-architect |
| 15 | `test.md` | `test.prompt.md` | epost-tester |
| 16 | `epost.md` | `epost.prompt.md` | epost-orchestrator |
| 17 | `convert.md` | `convert.prompt.md` | epost-implementer |
| 18 | `bootstrap.md` | `bootstrap.prompt.md` | epost-implementer |
| 19 | `simulator.md` | `simulator.prompt.md` | epost-ios-developer |
| 20 | `git/commit.md` | `git-commit.prompt.md` | epost-git-manager |
| 21 | `git/push.md` | `git-push.prompt.md` | epost-git-manager |
| 22 | `git/pr.md` | `git-pr.prompt.md` | epost-git-manager |
| 23 | `review/code.md` | `review-code.prompt.md` | epost-reviewer |
| 24 | `review/a11y.md` | `review-a11y.prompt.md` | epost-a11y-specialist |
| 25 | `review/improvements.md` | `review-improvements.prompt.md` | epost-reviewer |
| 26 | `audit/a11y.md` | `audit-a11y.prompt.md` | epost-a11y-specialist |
| 27 | `audit-close/a11y.md` | `audit-close-a11y.prompt.md` | epost-a11y-specialist |
| 28 | `docs/init.md` | `docs-init.prompt.md` | epost-documenter |
| 29 | `docs/update.md` | `docs-update.prompt.md` | epost-documenter |
| 30 | `docs/component.md` | `docs-component.prompt.md` | epost-documenter |
| 31 | `kit/add-agent.md` | `kit-add-agent.prompt.md` | epost-kit-designer |
| 32 | `kit/add-command.md` | `kit-add-command.prompt.md` | epost-kit-designer |
| 33 | `kit/add-hook.md` | `kit-add-hook.prompt.md` | epost-kit-designer |
| 34 | `kit/add-skill.md` | `kit-add-skill.prompt.md` | epost-kit-designer |
| 35 | `kit/optimize-skill.md` | `kit-optimize-skill.prompt.md` | epost-kit-designer |
| 36 | `cli/cook.md` | `cli-cook.prompt.md` | epost-cli-developer |
| 37 | `cli/doctor.md` | `cli-doctor.prompt.md` | epost-cli-developer |
| 38 | `cli/test.md` | `cli-test.prompt.md` | epost-cli-developer |

### Per-file conversion steps:
1. Read source command file
2. Transform frontmatter: keep `description`, add `agent`, add `tools` if command needs specific tools
3. Replace `$ARGUMENTS` → `${input:args}` in body
4. Replace `/command:variant` cross-references → mention prompt name
5. Replace `.claude/` paths → `.github/` paths
6. Write to `.github/prompts/{name}.prompt.md`

---

## Phase 3: Skills (52 directories)

Skills use the **same open standard** (SKILL.md with YAML frontmatter) — mostly a copy operation.

### Steps per skill directory:
1. Copy `.claude/skills/{name}/` → `.github/skills/{name}/`
2. In `SKILL.md`, normalize frontmatter:
   - Ensure `user-invokable` spelling (not `user-invocable`)
   - Keep `name`, `description`
   - Keep or drop `metadata` (harmless custom field)
   - Drop `tier` if present (harmless but unnecessary)
3. Copy all `references/` subdirectories as-is
4. Replace `.claude/` paths → `.github/` paths in SKILL.md body text

### Full skill list (52):

| # | Skill | Agent Affinity | Has References |
|---|---|---|---|
| 1 | a11y | epost-a11y-specialist | Check |
| 2 | android-a11y | epost-a11y-specialist | Check |
| 3 | android-development | epost-android-developer | Check |
| 4 | android-ui-lib | epost-android-developer | Check |
| 5 | auto-improvement | _(meta)_ | Check |
| 6 | backend-databases | epost-backend-developer | Check |
| 7 | backend-javaee | epost-backend-developer | Check |
| 8 | code-review | epost-reviewer | Check |
| 9 | core | _(all agents)_ | Yes |
| 10 | data-store | _(meta)_ | Check |
| 11 | debugging | epost-debugger | Check |
| 12 | doc-coauthoring | epost-documenter | Check |
| 13 | docs-seeker | epost-researcher | Check |
| 14 | domain-b2b | _(all)_ | Yes (10 module files) |
| 15 | domain-b2c | _(all)_ | Check |
| 16 | error-recovery | epost-debugger | Check |
| 17 | hub-context | epost-orchestrator | Check |
| 18 | infra-cloud | epost-backend-developer | Check |
| 19 | infra-docker | epost-backend-developer | Check |
| 20 | ios-a11y | epost-a11y-specialist | Yes (11 files) |
| 21 | ios-development | epost-ios-developer | Check |
| 22 | ios-rag | epost-ios-developer | Check |
| 23 | ios-ui-lib | epost-ios-developer | Check |
| 24 | kit-agent-development | epost-kit-designer | Check |
| 25 | kit-agents | epost-kit-designer | Check |
| 26 | kit-cli | epost-cli-developer | Check |
| 27 | kit-commands | epost-kit-designer | Check |
| 28 | kit-hooks | epost-kit-designer | Check |
| 29 | kit-skill-development | epost-kit-designer | Check |
| 30 | knowledge-base | epost-documenter | Check |
| 31 | knowledge-capture | epost-documenter | Check |
| 32 | knowledge-retrieval | epost-researcher | Check |
| 33 | planning | epost-architect | Check |
| 34 | problem-solving | epost-debugger | Check |
| 35 | receiving-code-review | epost-implementer | Check |
| 36 | repomix | epost-researcher | Check |
| 37 | research | epost-researcher | Check |
| 38 | sequential-thinking | _(all)_ | Check |
| 39 | skill-discovery | _(meta)_ | **Convert to .instructions.md** |
| 40 | subagent-driven-development | epost-implementer | Check |
| 41 | verification-before-completion | _(all)_ | Check |
| 42 | web-a11y | epost-a11y-specialist | Check |
| 43 | web-api-routes | epost-web-developer | Check |
| 44 | web-figma | epost-muji | Check |
| 45 | web-figma-variables | epost-muji | Check |
| 46 | web-frontend | epost-web-developer | Check |
| 47 | web-modules | epost-web-developer | Check |
| 48 | web-nextjs | epost-web-developer | Check |
| 49 | web-prototype | epost-web-developer | Check |
| 50 | web-rag | epost-web-developer | Check |
| 51 | web-ui-lib | epost-muji | Check |
| 52 | web-ui-lib-dev | epost-muji | Check |

### Special skills:
- **skill-discovery** — Convert to `.github/instructions/skill-discovery.instructions.md` (always-on instruction that tells agents how to find skills)
- **core** — Keep as skill but also merge key rules into `copilot-instructions.md`
- **hub-context** — Reference `.github/` paths instead of `.claude/`

### Skill Index:
- Copy `.claude/skills/skill-index.json` → `.github/skills/skill-index.json`
- Update all `path` fields (relative paths stay the same)

---

## Phase 4: Hooks (7 scripts + infrastructure)

### 4a. Create hook configuration

Create `.github/hooks/lifecycle.json`:

```json
{
  "hooks": {
    "onStart": [
      {
        "command": "node .github/hooks/scripts/session-init.cjs"
      }
    ],
    "onMessage": [
      {
        "command": "node .github/hooks/scripts/dev-rules-reminder.cjs"
      }
    ],
    "onToolCall": [
      {
        "command": "node .github/hooks/scripts/scout-block.cjs",
        "events": ["editFile", "runInTerminal", "readFile", "listFiles", "codeSearch"]
      },
      {
        "command": "node .github/hooks/scripts/privacy-block.cjs",
        "events": ["editFile", "runInTerminal", "readFile", "listFiles", "codeSearch"]
      }
    ],
    "onToolCallResult": [
      {
        "command": "npm run lint -- --fix 2>/dev/null || true",
        "events": ["editFile"]
      }
    ],
    "onStop": [
      {
        "command": "node .github/hooks/scripts/session-metrics.cjs 2>/dev/null || true"
      },
      {
        "command": "node .github/hooks/scripts/lesson-capture.cjs 2>/dev/null || true"
      },
      {
        "command": "node .github/hooks/scripts/notifications/notify.cjs 2>/dev/null || true"
      }
    ]
  }
}
```

### 4b. SubagentStart gap workaround

Copilot has no `SubagentStart` event. Workaround: embed `subagent-init.cjs` logic into agent body instructions or use `onStart` (fires once only, acceptable if subagent init is idempotent).

### 4c. PostToolUse build hook

The Claude config has a `PostToolUse` hook that runs `npm run build` after Write/Edit. In Copilot, map to `onToolCallResult` with `events: ["editFile"]`. Consider if build-on-every-edit is too aggressive — might drop this and keep lint-only.

### 4d. Stop verification prompt

Claude has a `prompt` type hook on Stop: `"Verify all requested tasks are complete..."`. Copilot hooks only support `command` type. Workaround: convert to a script that outputs the verification reminder as stdout, or embed this instruction in agent body text.

### 4e. Copy hook scripts

| Source | Target |
|---|---|
| `.claude/hooks/session-init.cjs` | `.github/hooks/scripts/session-init.cjs` |
| `.claude/hooks/subagent-init.cjs` | `.github/hooks/scripts/subagent-init.cjs` |
| `.claude/hooks/dev-rules-reminder.cjs` | `.github/hooks/scripts/dev-rules-reminder.cjs` |
| `.claude/hooks/scout-block.cjs` | `.github/hooks/scripts/scout-block.cjs` |
| `.claude/hooks/privacy-block.cjs` | `.github/hooks/scripts/privacy-block.cjs` |
| `.claude/hooks/session-metrics.cjs` | `.github/hooks/scripts/session-metrics.cjs` |
| `.claude/hooks/lesson-capture.cjs` | `.github/hooks/scripts/lesson-capture.cjs` |
| `.claude/hooks/lib/*.cjs` (8 files) | `.github/hooks/scripts/lib/*.cjs` |
| `.claude/hooks/scout-block/*.cjs` (4+) | `.github/hooks/scripts/scout-block/*.cjs` |
| `.claude/hooks/scout-block/vendor/` | `.github/hooks/scripts/scout-block/vendor/` |
| `.claude/hooks/notifications/*` | `.github/hooks/scripts/notifications/*` |

### 4f. Update require() paths in all scripts

Every `require('./lib/...')` and `require('./scout-block/...')` path stays the same (relative), but any reference to `path.dirname(__dirname)` resolving to `.claude/` must be updated to resolve to `.github/`.

Search-and-replace in all `.cjs` files:
- `.claude/` → `.github/` (for path references like `.ckignore` location)
- `path.join(claudeDir, '.ckignore')` → update to `.github/.ckignore` or `.github/hooks/ignore-patterns.txt`

---

## Phase 5: Supporting Files

### 5a. Scripts (10 files)

Copy `.claude/scripts/*.cjs` → `.github/scripts/*.cjs` (+ `*.js`):
- `agent-profiler.cjs`
- `check-coverage.cjs`
- `detect-improvements.cjs`
- `generate-skill-index.cjs`
- `get-active-plan.cjs`
- `render-graphs.js`
- `scan-secrets.cjs`
- `set-active-plan.cjs`
- `test-fixes.cjs`
- `validate-role-scenarios.cjs`

Update any `.claude/` path references in these scripts.

### 5b. Output Styles → Instructions (5 files)

Convert `.claude/output-styles/*.md` → `.github/instructions/output-style-*.instructions.md`:

| Source | Target | ApplyTo |
|---|---|---|
| `standard.md` | `output-style-standard.instructions.md` | `**/*` (always-on default) |
| `concise.md` | `output-style-concise.instructions.md` | _(manual activation)_ |
| `developer.md` | `output-style-developer.instructions.md` | _(manual activation)_ |
| `documenter.md` | `output-style-documenter.instructions.md` | _(manual activation)_ |
| `verbose.md` | `output-style-verbose.instructions.md` | _(manual activation)_ |

The `standard.md` style should be merged into `copilot-instructions.md` as the default output format. Others become opt-in instructions files without `applyTo` (user explicitly references them).

### 5c. Workflows → Prompts (3 files)

Convert `.claude/workflows/*.md` → `.github/prompts/workflow-*.prompt.md`:

| Source | Target |
|---|---|
| `feature-development.md` | `workflow-feature-development.prompt.md` |
| `bug-fixing.md` | `workflow-bug-fixing.prompt.md` |
| `project-init.md` | `workflow-project-init.prompt.md` |

These become multi-step prompt files that reference agents via `agent:` frontmatter or `@agent` mentions.

### 5d. Config Files

| Source | Target | Strategy |
|---|---|---|
| `.claude/.ck.json` | `.github/project-config.json` | Copy, update paths |
| `.claude/.ckignore` | `.github/hooks/ignore-patterns.txt` | Copy as-is, referenced by scout-block script |
| `.claude/settings.json` | `.github/hooks/lifecycle.json` + `copilot-instructions.md` | Hooks → lifecycle.json (Phase 4). Permissions → agent tool arrays. Env → instructions. |
| `.claude/settings.local.json` | _(drop or merge)_ | Local overrides not supported in Copilot; merge needed config into instructions |

### 5e. Assets (3 files)

Copy `.claude/assets/` → `.github/assets/`:
- `.expansions-version`
- `known-findings-schema.json`
- `query_expansions.yaml`

### 5f. Tests

Copy `.claude/hooks/__tests__/` → `.github/hooks/scripts/__tests__/`
Copy `.claude/hooks/tests/` → `.github/hooks/scripts/tests/`
Copy `.claude/hooks/scout-block/tests/` → `.github/hooks/scripts/scout-block/tests/`
Copy `.claude/scripts/__tests__/` → `.github/scripts/__tests__/`

Update import paths in all test files.

---

## Phase 6: Update copilot-instructions.md

The existing `.github/copilot-instructions.md` (371 lines) already has comprehensive project instructions. Add sections for:

1. **Agent System Overview** — List available agents and their roles (brief table)
2. **Skill Discovery** — How to find and load skills from `.github/skills/`
3. **Core Rules** — Merge key content from `core` skill (decision authority, safety constraints)
4. **Default Output Style** — Merge `standard.md` output style rules
5. **Path References** — Update any `.claude/` references to `.github/`

Also update `CLAUDE.md` (root) → rename to `AGENTS.md` or `COPILOT.md`, update all `.claude/` path references to `.github/`.

---

## Phase 7: Cleanup & Verification

### 7a. Path Reference Sweep

Global search-and-replace across entire `.github/` tree:
- `.claude/agents/` → `.github/agents/`
- `.claude/commands/` → `.github/prompts/`
- `.claude/skills/` → `.github/skills/`
- `.claude/hooks/` → `.github/hooks/scripts/`
- `.claude/scripts/` → `.github/scripts/`
- `.claude/output-styles/` → `.github/instructions/`
- `.claude/workflows/` → `.github/prompts/workflow-`
- `.claude/assets/` → `.github/assets/`
- `.claude/.ckignore` → `.github/hooks/ignore-patterns.txt`
- `.claude/.ck.json` → `.github/project-config.json`
- `.claude/settings.json` → `.github/hooks/lifecycle.json`

### 7b. Cross-reference integrity

- Every `agent:` reference in `.prompt.md` files points to an existing `.agent.md`
- Every `#skill:name` reference in agent files points to an existing `.github/skills/name/SKILL.md`
- Every `handoffs:` and `agents:` entry in agent files is a valid agent name
- Every script path in `lifecycle.json` exists on disk

### 7c. Smoke tests

1. Open VS Code, verify agents appear in Copilot Chat (`@epost-` prefix)
2. Run a prompt file (`/cook-fast`), verify it activates correct agent
3. Verify skills are loadable via `#skill:core`
4. Run `node .github/hooks/scripts/session-init.cjs < echo '{}'` — verify no path errors
5. Run `node .github/hooks/scripts/scout-block.cjs` with test input — verify blocks work
6. Check hooks fire on start/message/tool-call/stop

### 7d. Create README

Create `.github/README.md` documenting the agent system:
- How to use agents (`@agent-name` in chat)
- How to run prompts (`/prompt-name` in chat)
- How skills work
- How hooks are configured
- Migration notes from `.claude/`

---

## Gap Analysis & Workarounds

| Feature | Claude Support | Copilot Support | Workaround |
|---|---|---|---|
| `SubagentStart` hook | Native | None | Embed init logic in agent body or use `onStart` |
| `prompt` type hook | Native | Command only | Convert to script that outputs reminder text |
| `matcher` on hooks | Tool name patterns | `events` array | Map tool matchers to Copilot event names |
| `permissionMode` | `plan`/`full` | None | Control via tool array (omit editFiles/runInTerminal) |
| `disallowedTools` | Blocklist | None | Use allowlist (only list permitted tools) |
| `color` | Agent color | None | Drop |
| `memory` | `project`/`global` | None | Drop |
| `argument-hint` | Command hints | None | Use `${input:varname}` pattern |
| Output styles | Dynamic selection | Instructions only | Default in copilot-instructions.md, others as `.instructions.md` |
| `statusLine` | Custom status | None | Drop |
| `.ckignore` | Scout blocking | Via hook script | Hook script reads ignore file, blocks tool calls |
| `settings.local.json` | Local overrides | None | Drop or merge into instructions |
| `env` vars | `CLAUDEKIT_AGENT_STYLE` | None | Embed as instruction text |

---

## Execution Order

1. **Phase 0** — Scaffolding (create dirs) — 10 min
2. **Phase 3** — Skills first (most are copy-paste, least transformation) — 2 hours
3. **Phase 1** — Agents (depend on skills existing) — 3 hours
4. **Phase 2** — Prompts (depend on agents existing) — 2 hours
5. **Phase 4** — Hooks (independent but complex) — 2 hours
6. **Phase 5** — Supporting files — 1 hour
7. **Phase 6** — Update copilot-instructions.md — 30 min
8. **Phase 7** — Cleanup & verification — 1 hour

**Estimated total**: ~12 hours of implementation work

---

## Decisions

- **Full replacement**: `.claude/` will be deleted after conversion — no dual-system maintenance
- **Model mapping**: Use qualified Copilot model names (`Claude Sonnet 4 (copilot)` etc.)
- **Tool allowlist**: Copilot uses allowlist-only (no blocklist) — simulate `disallowedTools` by omitting
- **Flatten commands**: `namespace/sub.md` → `namespace-sub.prompt.md` (Copilot prompts are flat)
- **Skills standard**: Skills already use open standard — minimal conversion needed
- **SubagentStart gap**: Embed in agent body text (acceptable loss)
- **Output styles**: Default (`standard`) baked into `copilot-instructions.md`, others as opt-in instructions
- **Hook events mapping**: Claude `matcher` patterns → Copilot `events` arrays where possible
