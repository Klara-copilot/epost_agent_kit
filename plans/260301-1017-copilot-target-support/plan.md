# Plan: GitHub Copilot (.github/) Target Support for epost-kit

## Context

The epost-kit CLI already has a target selection concept (`claude` | `cursor` | `github-copilot`) in its type system and init flow. Currently only `.claude/` output works. This plan adds real `.github/` output support so the same `packages/` source produces correct Copilot-format output.

**Approach**: NOT a separate converter. The kit's install pipeline gains a **target adapter** that transforms source files on-the-fly during installation. Same source, different output format.

---

## Reference Doc Corrections

The existing research doc (`docs/claude-to-github-conversion.md`) contains verified errors:

| Claim | Actual | Impact |
|-------|--------|--------|
| Hook events: `onStart`, `onMessage`, etc. | VS Code uses PascalCase: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop` — nearly identical to Claude Code | Hooks need minimal transformation |
| Model: `"Claude Sonnet 4 (copilot)"` | No `(copilot)` suffix. Use: `"Claude Sonnet 4.6"`, `"Claude Haiku 4.5"`, `"Claude Opus 4.6"` | Model mapping table needs update |
| Tool: `codeSearch` | Not confirmed. Actual: `codebase` (tool set) or `textSearch` | Tool mapping table needs update |
| Tool: `listFiles` | Actual: `listDirectory` | Tool mapping table needs update |
| Tool: `fetchWebpage` | Actual: `fetch` | Tool mapping table needs update |
| `#skill:name` in agent body | Does NOT exist. Skills auto-load via description matching or `/skill-name` slash command | No skill ref syntax needed in agent bodies |
| File: `lifecycle.json` | Any `.json` in `.github/hooks/` works. No special name required | Use `hooks.json` (simpler) |
| `user-invokable` vs `user-invocable` | Both spellings appear in official docs. VS Code primary uses `user-invokable` | Use `user-invokable` for Copilot output |
| Copilot skills support | **Confirmed** (Dec 2025, experimental). Same SKILL.md open standard | Skills are mostly copy-paste |

### Corrected Format Mappings

#### Model Mapping
| Claude Code | Copilot |
|-------------|---------|
| `haiku` | `Claude Haiku 4.5` |
| `sonnet` | `Claude Sonnet 4.6` |
| `opus` | `Claude Opus 4.6` |

#### Tool Mapping
| Claude Tool | Copilot Tool | Notes |
|-------------|-------------|-------|
| `Read` | `readFile` | |
| `Write` | `editFiles` | Copilot merges write+edit into one tool |
| `Edit` | `editFiles` | |
| `Bash` | `runInTerminal` | |
| `Grep` | `textSearch` | |
| `Glob` | `listDirectory` | |
| `WebFetch` | `fetch` | |
| `Agent` (subagent) | `handoffs` frontmatter | Workflow transitions via handoff config |
| `WebSearch` | _(none)_ | No built-in equivalent; use MCP or `fetch` |
| _(none)_ | `githubRepo` | Copilot-only: access GitHub repo data |
| _(none)_ | `usages` | Copilot-only: find symbol references |
| _(none)_ | `search` | Copilot-only: workspace symbol search |
| _(none)_ | `codebase` | Copilot-only: semantic codebase search |
| _(none)_ | `findTestFiles` | Copilot-only: locate test files |
| _(none)_ | `<server>/*` | All tools from an MCP server |

**Tool sets:** Copilot supports compound tool references like `search/codebase` (tool set variant). Unrecognized tool names are silently ignored — safe to include tools that may not be available in all environments.

#### Hook Event Mapping
| Claude Code | VS Code Copilot | Notes |
|-------------|----------------|-------|
| `SessionStart` | `SessionStart` | Identical |
| `SubagentStart` | `SubagentStart` | VS Code has this! |
| `UserPromptSubmit` | `UserPromptSubmit` | Identical |
| `PreToolUse` | `PreToolUse` | Identical |
| `PostToolUse` | `PostToolUse` | Identical |
| `Stop` | `Stop` | Identical |

The VS Code hook events are **PascalCase identical** to Claude Code. The hook JSON structure differs slightly (Copilot uses `bash`/`powershell` instead of `command`, has `version` field).

#### Hook JSON Structure (Copilot)
```json
{
  "version": 1,
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "bash": "node .github/hooks/session-init.cjs",
        "timeoutSec": 30
      }
    ]
  }
}
```

Key differences from Claude Code:
- `bash` field instead of `command`
- `timeoutSec` instead of `timeout` (and in seconds not ms)
- `version: 1` required at top level
- `matcher` → use event arrays or separate entries per tool
- `type: "prompt"` hooks → **Gap**: must convert to script that outputs text

---

## Architecture Decision

### Where transformation happens

```
packages/*/           (source — universal)
    │
    ├── epost-kit install --target claude
    │       └── .claude/          (current behavior, unchanged)
    │
    └── epost-kit install --target github-copilot
            └── .github/          (NEW: Copilot-format output)
                ├── agents/*.agent.md
                ├── prompts/*.prompt.md
                ├── skills/*/SKILL.md
                ├── hooks/*.json + hooks/scripts/*.cjs
                ├── instructions/*.instructions.md
                └── copilot-instructions.md
```

### Key design choice: Target Adapter pattern

A `TargetAdapter` interface with two implementations:
- `ClaudeAdapter` — current behavior (essentially pass-through)
- `CopilotAdapter` — transforms frontmatter, renames files, restructures hooks

The adapter is selected once at init time and called during the file-copy loop.

---

## Phase 0: Target Adapter Infrastructure (CLI)

### 0a. Define `TargetAdapter` interface

File: `epost-agent-cli/src/core/target-adapter.ts`

```typescript
interface TargetAdapter {
  name: string;                    // 'claude' | 'github-copilot'
  installDir: string;              // '.claude' | '.github'

  // File transformation
  transformAgent(source: string, manifest: AgentFrontmatter): string;
  transformCommand(source: string, manifest: CommandFrontmatter): string;
  transformSkill(source: string): string;
  transformHooks(settings: SettingsJson): string;       // → target hook format
  transformSettings(settings: SettingsJson): string;    // → target settings/instructions

  // Path mapping
  agentPath(name: string): string;     // → 'agents/name.md' or 'agents/name.agent.md'
  commandPath(name: string): string;   // → 'commands/name.md' or 'prompts/name.prompt.md'
  skillPath(name: string): string;     // → 'skills/name/SKILL.md' (same for both)
  hookScriptDir(): string;             // → 'hooks/' or 'hooks/scripts/'

  // Generation
  generateRootInstructions(ctx: ClaudeMdContext): string;  // CLAUDE.md or copilot-instructions.md
}
```

### 0b. Implement `ClaudeAdapter`

Pass-through adapter wrapping current behavior. No logic changes — just extracting existing behavior into the interface.

### 0c. Implement `CopilotAdapter`

Transformation logic for each file type (detailed in phases below).

### Files:
| File | Action |
|------|--------|
| `epost-agent-cli/src/core/target-adapter.ts` | Create — interface + factory |
| `epost-agent-cli/src/core/claude-adapter.ts` | Create — pass-through impl |
| `epost-agent-cli/src/core/copilot-adapter.ts` | Create — transform impl |

---

## Phase 1: Agent Transformation

### Complete Copilot Agent Frontmatter Reference (`.agent.md`)

All available YAML frontmatter fields for Copilot custom agents (verified via Context7 + official VS Code docs):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | **Yes** | Brief description shown as placeholder text in chat input |
| `name` | string | No | Display name for the agent. Defaults to filename if omitted |
| `argument-hint` | string | No | Hint text shown in chat input to guide user interaction |
| `tools` | string[] | No | Available tool/tool-set names. Omit = all tools enabled. `[]` = no tools. Supports `<server>/*` for MCP |
| `model` | string | No | AI model to use. Defaults to user's model picker selection |
| `target` | string | No | Target environment: `"vscode"` or `"github-copilot"` |
| `mcp-servers` | object | No | MCP server configurations for use with custom agents in GitHub Copilot |
| `handoffs` | list | No | Suggested next actions / workflow transitions (see below) |

**`handoffs` sub-fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Display text for the handoff button |
| `agent` | string | Yes | Identifier of the target agent (or `"agent"` for default agent mode) |
| `prompt` | string | Yes | Pre-filled prompt text to send to target agent |
| `send` | boolean | No | Auto-submit the prompt (`true`) or let user review first (`false`, default) |

**`mcp-servers` structure:**
```yaml
mcp-servers:
  server-name:
    command: npx
    args: ["-y", "@some/mcp-server"]
    env:
      API_KEY: "${input:api-key}"
```

**Built-in tool names available for `tools:` array:**

| Tool | Description |
|------|-------------|
| `readFile` | Read file contents |
| `editFiles` | Create/edit/write files |
| `runInTerminal` | Execute shell commands |
| `textSearch` | Search text in files (ripgrep-like) |
| `listDirectory` | List files/directories (glob patterns) |
| `fetch` | Fetch web content |
| `githubRepo` | Access GitHub repository data |
| `usages` | Find symbol usages/references |
| `search` | Workspace symbol search |
| `search/codebase` | Semantic codebase search (tool set variant) |
| `codebase` | Codebase search tool set |
| `findTestFiles` | Locate test files for source files |
| `<server>/*` | All tools from an MCP server |

**Body content:**
- Markdown with agent instructions, guidelines, constraints
- Reference tools with `#tool:<tool-name>` syntax (e.g., `#tool:githubRepo`)
- Reference other files via Markdown links for instruction reuse

### Input (Claude Code format)
```yaml
---
name: epost-web-developer
description: (ePost) Web platform specialist
model: sonnet
color: green
memory: project
permissionMode: plan
skills: [core, web-nextjs, web-frontend]
disallowedTools: Write, Edit
---
[body content]
```

### Output (Copilot format)
```yaml
---
name: epost-web-developer
description: (ePost) Web platform specialist
model: Claude Sonnet 4.6
tools: ['readFile', 'listDirectory', 'textSearch', 'fetch']
handoffs:
  - label: Review Code
    agent: epost-reviewer
    prompt: Review the implementation above for edge cases and quality.
    send: false
---
[body content with .claude/ → .github/ path replacements]
```

### Transformation rules
1. `model:` → mapped model name (see Corrected Format Mappings above)
2. `color:`, `memory:` → **drop** (no Copilot equivalent)
3. `skills: [...]` → **drop** from frontmatter (skills auto-load via description matching in Copilot)
4. `permissionMode: plan` → omit `editFiles`/`runInTerminal` from tools
5. `disallowedTools: Write, Edit` → omit `editFiles` from tools; include rest
6. Default tools: `['readFile', 'listDirectory', 'textSearch', 'editFiles', 'runInTerminal', 'fetch']` unless restricted
7. File extension: `.agent.md`
8. Body: replace `.claude/` paths → `.github/`
9. `argument-hint:` → **keep** (Copilot supports it natively)
10. **New**: Generate `handoffs` from agent workflow patterns where applicable (e.g., reviewer→implementer, planner→implementer)
11. **New**: `target: vscode` — add for workspace-scoped agents

### Files:
| File | Action |
|------|--------|
| `epost-agent-cli/src/core/copilot-adapter.ts` | Add `transformAgent()` |

---

## Phase 2: Command → Prompt Transformation

### Complete Copilot Prompt Frontmatter Reference (`.prompt.md`)

All available YAML frontmatter fields for Copilot prompt files (verified via Context7 + official VS Code docs):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | No | Short description of the prompt |
| `name` | string | No | Name used after typing `/` in chat. Defaults to filename |
| `argument-hint` | string | No | Hint text in chat input to guide user interaction |
| `mode` | string | No | Chat mode: `"ask"`, `"edit"`, `"agent"`. Default: current mode. If `tools` specified and mode is `ask`/`edit`, auto-switches to `agent` |
| `agent` | string | No | Agent to run the prompt: `"ask"`, `"edit"`, `"agent"`, or a custom agent name. **Note:** `mode` is the newer field; `agent` still works |
| `model` | string | No | AI model to use. Defaults to current model picker selection |
| `tools` | string[] | No | Available tool/tool-set names. Same syntax as agent tools. Supports `<server>/*` for MCP. Ignored tools are silently skipped |

**Supported variables in body:**

| Variable | Description |
|----------|-------------|
| `${workspaceFolder}` | Workspace root path |
| `${workspaceFolderBasename}` | Workspace folder name |
| `${selection}` / `${selectedText}` | Currently selected text |
| `${file}` | Current file path |
| `${fileBasename}` | Current file name |
| `${fileDirname}` | Current file directory |
| `${fileBasenameNoExtension}` | File name without extension |
| `${input:variableName}` | Prompt user for input |
| `${input:variableName:placeholder}` | Prompt with placeholder text |

**Body content:**
- Markdown with prompt instructions
- Reference tools with `#tool:<tool-name>` syntax
- Reference files via relative Markdown links (e.g., `[design-system](../docs/design-system/Form.md)`)

### Input (Claude Code format)
```yaml
---
description: (ePost) Fix issues — auto-detects error type and platform
agent: epost-debugger
argument-hint: [issue description]
---
[body with $ARGUMENTS]
```

### Output (Copilot format)
```yaml
---
description: (ePost) Fix issues — auto-detects error type and platform
name: fix
mode: agent
agent: epost-debugger
argument-hint: '[issue description]'
tools: ['readFile', 'editFiles', 'runInTerminal', 'listDirectory', 'textSearch', 'fetch']
---
[body with ${input:args} instead of $ARGUMENTS]
```

### Transformation rules
1. Keep `description`, `agent`
2. Add `mode: agent` (preferred Copilot field; `agent` as value means full agent mode with tools)
3. `argument-hint` → **keep** (Copilot supports it natively for prompt files)
4. `name` → derive from filename (e.g., `cook.prompt.md` → `name: cook`)
5. `allowed-tools` → map to Copilot `tools` array using tool mapping table
6. `$ARGUMENTS` → `${input:args}` in body
7. `$1`, `$2` → `${input:arg1}`, `${input:arg2}`
8. Flatten path: `review/code.md` → `review-code.prompt.md`
9. Body: replace `.claude/` paths → `.github/`
10. Body: replace `#file:` references → relative Markdown links

### Files:
| File | Action |
|------|--------|
| `epost-agent-cli/src/core/copilot-adapter.ts` | Add `transformCommand()` |

---

## Phase 3: Skills (Minimal Transform)

Skills use the **same open standard** (SKILL.md with YAML frontmatter). Confirmed working in Copilot since Dec 2025 (experimental).

**Skills auto-load in Copilot via description matching** — there is no `#skill:name` syntax. The model reads skill descriptions and loads relevant ones automatically. This means skill `description:` fields are critical for activation.

### Transformation rules
1. `user-invocable` → `user-invokable` (spelling normalization)
2. Keep all other frontmatter fields (`description`, `context`, `agent`, `disable-model-invocation`)
3. Body: replace `.claude/` paths → `.github/`
4. Copy `references/` subdirectories as-is
5. Skills directory: `.github/skills/*/SKILL.md` (same structure as `.claude/skills/*/SKILL.md`)

### Files:
| File | Action |
|------|--------|
| `epost-agent-cli/src/core/copilot-adapter.ts` | Add `transformSkill()` |

---

## Phase 4: Hooks Transformation

### Input (Claude Code `settings.json`)
```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "node .claude/hooks/session-init.cjs"
      }]
    }],
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "node .claude/hooks/session-metrics.cjs 2>/dev/null || true"
      }, {
        "type": "prompt",
        "prompt": "Verify all tasks complete..."
      }]
    }]
  }
}
```

### Output (Copilot `.github/hooks/hooks.json`)
```json
{
  "version": 1,
  "hooks": {
    "SessionStart": [{
      "type": "command",
      "bash": "node .github/hooks/scripts/session-init.cjs"
    }],
    "Stop": [{
      "type": "command",
      "bash": "node .github/hooks/scripts/session-metrics.cjs 2>/dev/null || true"
    }]
  }
}
```

### Transformation rules
1. Event names: identical (PascalCase in both)
2. `command` → `bash` field name
3. `timeout` (ms) → `timeoutSec` (seconds, divide by 1000)
4. `matcher` on hook groups → split into separate entries per matched tool or drop
5. `type: "prompt"` hooks → **drop** (Copilot doesn't support prompt hooks; embed text in instructions instead)
6. Add `"version": 1` at top level
7. Flatten nested `hooks` array structure → flat array per event
8. Path replace: `.claude/hooks/` → `.github/hooks/scripts/`

### Hook scripts
- Copy all `.cjs` files from `hooks/` → `hooks/scripts/` (different nesting)
- Copy `hooks/lib/` → `hooks/scripts/lib/`
- Update `require()` paths that reference `.claude/` → `.github/`

### Prompt hook workaround
The "Verify all tasks complete" prompt hook has no Copilot equivalent. Convert to a line in `copilot-instructions.md`:
```
## Completion Verification
Before claiming any task is complete, verify all requested tasks are finished.
```

### Files:
| File | Action |
|------|--------|
| `epost-agent-cli/src/core/copilot-adapter.ts` | Add `transformHooks()` |

---

## Phase 5: Settings & Instructions Generation

### Complete Copilot Instructions File Reference (`.instructions.md`)

All available YAML frontmatter fields for Copilot instruction files (verified via Context7 + official VS Code docs):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | No | Short description of the instructions file |
| `name` | string | No | Display name in UI. Defaults to filename |
| `applyTo` | glob | No | Glob pattern for auto-apply (e.g., `"**/*.ts"`, `"**/*.swift"`). If omitted, instructions must be manually attached |

**Instruction file types:**
- **Workspace instructions** (`.github/instructions/*.instructions.md`) — scoped to workspace
- **User instructions** — available across workspaces (stored in VS Code profile)
- **Root instructions** (`.github/copilot-instructions.md`) — auto-applies to ALL chat requests

**Special settings (via VS Code settings.json, not frontmatter):**
```json
{
  "github.copilot.chat.pullRequestDescriptionGeneration.instructions": [
    { "text": "Always include a list of key changes." }
  ],
  "github.copilot.chat.reviewSelection.instructions": [
    { "file": "guidance/backend-review-guidelines.md" }
  ]
}
```

### Complete Copilot Custom Chat Mode Reference (`.chat.md`)

Available in `.vscode/` directory. Defines reusable chat modes:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | No | Short description of the chat mode |
| `tools` | string[] | No | Available tools for this mode |

**Example:**
```yaml
---
description: Generate an implementation plan for new features or refactoring.
tools: ['codebase', 'fetch', 'findTestFiles', 'githubRepo', 'search', 'usages']
---
# Planning mode instructions
You are in planning mode. Generate an implementation plan.
Don't make any code edits, just generate a plan.
```

### Claude Code outputs
- `settings.json` (hooks, permissions, env, statusLine)
- `CLAUDE.md` (root instructions)

### Copilot outputs
- `.github/hooks/hooks.json` (hooks only — from Phase 4)
- `.github/copilot-instructions.md` (replaces CLAUDE.md role)
- `.github/instructions/*.instructions.md` (scoped instructions — **NEW**)
- No permissions concept (controlled via agent tool arrays)
- No env vars (embed as instruction text)
- No statusLine (drop)

### `copilot-instructions.md` generation
Use the same Handlebars template approach but different template:
- Template: `templates/copilot-instructions.md.hbs`
- Content: same snippets from `claude_snippet` fields in package.yaml
- Path references: `.github/` instead of `.claude/`
- Add: agent system overview, skill discovery section

### Scoped instructions generation (**NEW**)
Generate platform-specific `.instructions.md` files from existing skills with `applyTo` patterns:
```yaml
# .github/instructions/typescript.instructions.md
---
applyTo: "**/*.{ts,tsx}"
---
# TypeScript Conventions
[content derived from web-frontend, web-nextjs skills]
```

```yaml
# .github/instructions/swift.instructions.md
---
applyTo: "**/*.swift"
---
# Swift Conventions
[content derived from ios-development skill]
```

This is a Copilot-exclusive enhancement that leverages the `applyTo` glob pattern for automatic scoped instructions — something Claude Code does not have.

### Files:
| File | Action |
|------|--------|
| `epost-agent-cli/src/templates/copilot-instructions.md.hbs` | Create — root instructions template |
| `epost-agent-cli/src/templates/copilot-scoped-instructions.md.hbs` | Create — per-platform instructions template |
| `epost-agent-cli/src/core/copilot-adapter.ts` | Add `generateRootInstructions()`, `generateScopedInstructions()` |

---

## Phase 6: Wire into Init Pipeline

### 6a. Modify `runPackageInit` in `commands/init.ts`

Currently:
```typescript
const installDir = join(cwd, installDirName); // e.g. '.claude'
// ... file copy loop uses installDir directly
```

Change to:
```typescript
const adapter = createTargetAdapter(target); // factory
const installDir = join(cwd, adapter.installDir);
// ... file copy loop calls adapter.transform*() before writing
```

### 6b. File copy loop changes

For each package file:
- **Agent files** (`agents/*.md`): read → `adapter.transformAgent()` → write to `adapter.agentPath()`
- **Command files** (`commands/**/*.md`): read → `adapter.transformCommand()` → write to `adapter.commandPath()`
- **Skill files** (`skills/*/SKILL.md`): read → `adapter.transformSkill()` → write
- **Hook scripts** (`.cjs`): copy to `adapter.hookScriptDir()` with path fixups
- **Settings**: `adapter.transformHooks()` + `adapter.transformSettings()`
- **Other files** (scripts, assets, output-styles): copy with path adjustments

### 6c. Skill index generation

Same `generateSkillIndex()` works for both targets (Copilot supports SKILL.md format).

### 6d. Root instructions generation

```typescript
if (adapter.name === 'github-copilot') {
  adapter.generateRootInstructions(ctx);  // → .github/copilot-instructions.md
} else {
  generateClaudeMd(ctx);                  // → CLAUDE.md (existing)
}
```

### 6e. Reference validator

Currently hardcoded to `.claude/`. Parameterize:
- For `github-copilot`: scan `.github/agents/`, `.github/prompts/`, `.github/skills/`
- Adjust file extension patterns (`.agent.md`, `.prompt.md`)

### Files:
| File | Action |
|------|--------|
| `epost-agent-cli/src/commands/init.ts` | Modify — inject adapter |
| `epost-agent-cli/src/core/ref-validator.ts` | Modify — parameterize paths |
| `epost-agent-cli/src/commands/lint.ts` | Modify — read target from metadata |

---

## Phase 7: Dev Watcher

The `dev` command watches `packages/` and live-syncs to the target directory. Update to use the target adapter for on-the-fly transformation.

### Files:
| File | Action |
|------|--------|
| `epost-agent-cli/src/commands/dev.ts` | Modify — use adapter |

---

## All Files Summary

| # | File | Phase | Action |
|---|------|-------|--------|
| 1 | `src/core/target-adapter.ts` | 0 | Create — interface + factory |
| 2 | `src/core/claude-adapter.ts` | 0 | Create — pass-through |
| 3 | `src/core/copilot-adapter.ts` | 0-5 | Create — all transforms |
| 4 | `src/templates/copilot-instructions.md.hbs` | 5 | Create — root instructions template |
| 5 | `src/templates/copilot-scoped-instructions.md.hbs` | 5 | Create — per-platform instructions |
| 6 | `src/commands/init.ts` | 6 | Modify — inject adapter |
| 7 | `src/core/ref-validator.ts` | 6 | Modify — parameterize |
| 8 | `src/commands/lint.ts` | 6 | Modify — target-aware |
| 9 | `src/commands/dev.ts` | 7 | Modify — use adapter |

**New: 5 | Modified: 4 | Total: 9**

---

## Verification

```bash
# 1. Install for Copilot target
epost-kit init --target github-copilot --yes

# 2. Check output structure
ls .github/agents/*.agent.md
ls .github/prompts/*.prompt.md
ls .github/skills/*/SKILL.md
cat .github/hooks/hooks.json
cat .github/copilot-instructions.md

# 3. Verify agent frontmatter
head -10 .github/agents/epost-web-developer.agent.md
# Should show: model: Claude Sonnet 4.6, tools: [...]

# 4. Verify prompt frontmatter
head -10 .github/prompts/cook.prompt.md
# Should show: mode: agent, agent: epost-implementer

# 5. Verify no .claude/ path references in .github/
grep -r '\.claude/' .github/ | grep -v node_modules

# 6. Lint Copilot output
epost-kit lint --target github-copilot

# 7. VS Code smoke test
# Open VS Code → Copilot Chat → type @epost- → should see agents
# Type /cook → should see prompt
```

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| Copilot skills format is experimental | Skills confirmed Dec 2025. Fallback: embed skill content in agent instructions |
| Hook events may differ between VS Code versions | Use PascalCase (VS Code native). Both PascalCase and camelCase appear in docs |
| Tool names may change | Maintain mapping table in adapter; easy to update |
| `type: "prompt"` hooks have no Copilot equivalent | Embed verification text in copilot-instructions.md |
| Copilot `matcher` equivalent is limited | Convert tool-specific matchers to separate hook entries |
| `SubagentStart` gap in coding agent | VS Code desktop DOES support it (confirmed). Only coding agent lacks it |

---

## Copilot-Exclusive Enhancements (Enabled by Context7 Research)

Features that Copilot supports but Claude Code does not — added as bonus transformations:

| Feature | Copilot | Claude Code | Implementation |
|---------|---------|-------------|----------------|
| **Handoffs** | `handoffs:` in agent frontmatter | No equivalent | Generate from agent workflow patterns |
| **Scoped instructions** | `applyTo: "**/*.ts"` in `.instructions.md` | No equivalent | Generate from platform skills |
| **Custom chat modes** | `.chat.md` files in `.vscode/` | No equivalent | Optional: generate from commands with `permissionMode: plan` |
| **MCP servers in agents** | `mcp-servers:` in agent frontmatter | Separate config | Inline MCP config from settings into agents |
| **Target field** | `target: vscode` | No equivalent | Add to workspace-scoped agents |
| **Input variables** | `${input:name:placeholder}` | `$ARGUMENTS` | Richer prompt input experience |

### Handoff Generation Strategy

Generate `handoffs` for agents that have natural workflow successors:

| Agent | Handoff To | Label | Prompt |
|-------|-----------|-------|--------|
| `epost-architect` | `epost-implementer` | Implement Plan | Implement the plan outlined above. |
| `epost-implementer` | `epost-reviewer` | Review Code | Review the implementation for edge cases and quality. |
| `epost-reviewer` | `epost-git-manager` | Commit Changes | Stage and commit the reviewed changes. |
| `epost-debugger` | `epost-tester` | Run Tests | Verify the fix with relevant tests. |
| `epost-tester` | `epost-git-manager` | Commit | Commit the passing changes. |

---

## Out of Scope (v2)

- Dual-target install (both `.claude/` + `.github/` simultaneously)
- Cursor-specific adapter
- Auto-detect installed IDE and suggest target
- Copilot workspace settings generation (`.vscode/settings.json` for `github.copilot.*`)
- VS Code task integration (`.vscode/tasks.json` referencing agents)
- Extension-contributed tools mapping
