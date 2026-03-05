# ClaudeKit Hooks Research & Brainstorm
*Research source: `/Users/than/Projects/claudekit/` — local fork of [claudekit/claudekit](https://github.com/claudekit/claudekit)*

---

## 1. Claude Code Hook Event Reference

| Event | Fires | Matcher support |
|---|---|---|
| `SessionStart` | Once — startup, resume, clear, compact | source keyword |
| `SubagentStart` | Each Task tool call begins | agent_type |
| `SubagentStop` | Each Task tool call ends | agent_type |
| `UserPromptSubmit` | Every user prompt | — |
| `PreToolUse` | Before tool executes | tool name |
| `PostToolUse` | After tool succeeds | tool name |
| `PostToolUseFailure` | After tool fails | tool name |
| `Stop` | Agent finishes response | — |
| `Notification` | Claude sends a notification | — |

**Control flow options per event:**
- `PreToolUse` → `allow`, `block`, `deny` (with reason), modify tool input, inject `additionalContext`
- `PostToolUse` → inject `additionalContext`, cannot block
- `SubagentStart` → `hookSpecificOutput.additionalContext` (system prompt injection)
- `UserPromptSubmit` → inject context (appended to conversation)
- `Stop` / `Notification` → side effects only (metrics, notifications)

---

## 2. ClaudeKit Hooks Inventory

### Active hooks in `settings.json`

| Hook file | Event | Matcher | What it does |
|---|---|---|---|
| `session-init.cjs` | `SessionStart` | startup/resume/clear/compact | Detects project type, PM, framework, git info; resolves active plan; writes 20+ env vars to `CLAUDE_ENV_FILE`; injects coding level guidelines; warns on compact about lost approval state |
| `dev-rules-reminder.cjs` | `UserPromptSubmit` | — | Injects session info, rules, modularization reminders, plan context; skips if recently injected (`wasRecentlyInjected`) |
| `usage-context-awareness.cjs` | `UserPromptSubmit` + `PostToolUse(Bash|Edit|Write|MultiEdit|NotebookEdit)` | — | Fetches Claude OAuth usage limits from Anthropic API; caches to tmpdir (60s TTL); reads creds from macOS Keychain or `~/.claude/.credentials.json` |
| `subagent-init.cjs` | `SubagentStart` | `*` | Injects plan/reports/naming context into subagent system prompt via `hookSpecificOutput.additionalContext`; trust passphrase support; per-agent custom context |
| `team-context-inject.cjs` | `SubagentStart` | `*` | Detects `name@team-name` agent_id pattern; injects peer list + task summary + CK context for agent teams |
| `scout-block.cjs` | `PreToolUse` | `Bash|Glob|Grep|Read|Edit|Write` | Blocks `node_modules`, `.git`, `dist`, etc. from `.ckignore` |
| `privacy-block.cjs` | `PreToolUse` | `Bash|Glob|Grep|Read|Edit|Write` | Blocks sensitive files (`.env`, credentials, secrets) |
| `descriptive-name.cjs` | `PreToolUse` | `Write` | Enforces descriptive file naming before writes |
| `post-edit-simplify-reminder.cjs` | `PostToolUse` | `Edit|Write|MultiEdit` | Counts edits per session; after 5+ edits injects reminder to run `code-simplifier` agent; throttled (10 min cooldown) |
| `cook-after-plan-reminder.cjs` | `SubagentStop` | `Plan` | After Plan subagent finishes, outputs reminder to run `/cook --auto` with absolute plan path |
| `task-completed-handler.cjs` | (team task events) | — | Handles task lifecycle for agent teams |
| `teammate-idle-handler.cjs` | — | — | Agent team coordination |
| `notifications/notify.cjs` | `Stop`, `SubagentStop`, `Notification` | — | Multi-provider notifications (Telegram, Discord, Slack); 5-min throttle; env cascade |

### Key library patterns in `lib/`
- `ck-config-utils.cjs` — `isHookEnabled(name)` — per-hook disable via config without touching settings.json
- `context-builder.cjs` — `wasRecentlyInjected(transcript_path)` — dedup context injection by scanning transcript
- `git-info-cache.cjs` — `invalidateCache()` — git state caching with invalidation on edits
- `hook-logger.cjs` — structured JSONL logging
- `project-detector.cjs` — shared detection logic (also used by OpenCode plugin)
- Crash wrapper pattern — every hook: `try { ... } catch(e) { appendFileSync(.logs/hook-log.jsonl); exit(0); }`

---

## 3. Our Current Hooks (epost_agent_kit)

| Hook | Event | Status |
|---|---|---|
| `session-init.cjs` | `SessionStart` | ✅ Active |
| `dev-rules-reminder.cjs` | `UserPromptSubmit` | ✅ Active |
| `subagent-init.cjs` | `SubagentStart` | ✅ Active |
| `scout-block.cjs` | `PreToolUse` | ✅ Active |
| `privacy-block.cjs` | `PreToolUse` | ✅ Active |
| `session-metrics.cjs` | `Stop` | ✅ Active |
| `lesson-capture.cjs` | `Stop` | ✅ Active |
| `notifications/notify.cjs` | `Stop` | ✅ Active |

**Unused events:** `SubagentStop`, `PostToolUse`, `PostToolUseFailure`, `Notification`

---

## 4. Gap Analysis (ClaudeKit has, we don't)

| Feature | ClaudeKit hook | Priority |
|---|---|---|
| Per-hook enable/disable via config | `isHookEnabled()` in all hooks | HIGH — UX win |
| Crash logging to `.logs/hook-log.jsonl` | Outer crash wrapper pattern | HIGH — reliability |
| Context dedup (`wasRecentlyInjected`) | `context-builder.cjs` | HIGH — prevents token waste |
| Edit count → simplify reminder | `post-edit-simplify-reminder` / `PostToolUse` | MED |
| Workflow chain: plan done → cook | `cook-after-plan-reminder` / `SubagentStop` | MED |
| Team peer context in subagents | `team-context-inject` / `SubagentStart` | LOW (no agent teams yet) |
| Claude usage limits tracking | `usage-context-awareness` | LOW |
| Compact context approval-state warning | Inside `session-init` on `source=compact` | MED |
| Descriptive file name enforcement | `descriptive-name` / `PreToolUse(Write)` | LOW |

---

## 5. New Ideas for epost_agent_kit

### A. Reliability / Infrastructure

**`hook-crash-wrapper`** (pattern, not a hook)
- Wrap every hook in outer try/catch that logs to `.epost-data/logs/hook-crashes.jsonl`
- Critical — currently any crash in a hook is silent
- Pattern: `{ ts, hook, status: "crash", error: e.message }`

**`hook-enable-toggle`** (pattern + lib)
- `isHookEnabled(name)` reads `.epost-kit.json` → `hooks.disabled: ["lesson-capture"]`
- Lets users disable noisy hooks per-project without editing `settings.json`
- Already in our packages via `ck-config-utils`-style config

### B. PreToolUse Guards

**`packages-guard`** — PreToolUse(Write|Edit)
- **Unique to epost_agent_kit** — block writes to `.claude/` directly
- Error: "`.claude/` is generated output. Edit `packages/` instead, then run `epost-kit init`."
- Most expensive mistake in this project, automated enforcement is high value

**`plan-file-guard`** — PreToolUse(Write)
- Block writes outside `plans/` or `docs/` for `.md` files unless path is confirmed
- Enforce "DO NOT create markdown files out of plans/ or docs/ directories"

**`commit-message-validator`** — PreToolUse(Bash)
- Detect `git commit -m` in command; validate conventional commit format
- Block if no `type:` prefix; inject correct format example
- Matcher: `Bash`, parse stdin `tool_input.command`

### C. PostToolUse Triggers

**`post-edit-skill-reminder`** — PostToolUse(Edit|Write)
- After editing a SKILL.md, remind to run `generate-skill-index`
- Detect SKILL.md in `tool_input.file_path`; inject reminder
- Fixes a recurring gotcha: forget to regenerate index after skill edits

**`post-init-validate`** — PostToolUse(Bash)
- Detect `epost-kit init` in command; after success, auto-trigger kit verify steps
- Inject: "Run `node .claude/scripts/validate-role-scenarios.cjs` to verify"

### D. SubagentStop Workflow Chains

**`cook-after-plan-reminder`** — SubagentStop(Plan | epost-planner)
- Mirror ClaudeKit: after plan subagent finishes → remind `/cook {plan.md}`
- Matcher: `Plan` or `epost-planner`

**`review-after-cook-reminder`** — SubagentStop(Cook | epost-developer)
- After cook subagent finishes → remind `/review --code` or run tests
- Enforces the cook → review → git workflow

### E. SessionStart Enhancements

**Compact warning** (extend `session-init.cjs`)
- Already done by ClaudeKit, we should add: detect `source=compact`, inject approval-state warning
- Low risk add to existing hook

**Kit health hint** (extend `session-init.cjs`)
- Detect if `.claude/skills/skill-index.json` is stale (older than newest SKILL.md)
- If stale: inject warning "skill-index.json may be stale — run generate-skill-index"

### F. UserPromptSubmit Enhancements

**`platform-signal-inject`** — UserPromptSubmit
- Parse prompt for file extension signals (`.tsx`, `.swift`, `.kt`, `.java`)
- Inject relevant platform skill hint: "Detected web context — `web-*` skills available"
- Lightweight routing assist without full skill loading

**`active-plan-reminder`** — UserPromptSubmit (throttled)
- If active plan exists and not recently injected, add one-line reminder
- "Active plan: `plans/260305-1234-my-feature/` — use `/cook` to continue"
- Prevents losing plan context between prompts

### G. Notification / Stop

**`kit-session-summary`** — Stop
- Replace the broken `type:prompt` Stop hook we removed
- Command hook: writes structured session summary to `.epost-data/sessions/`
- Fields: skills activated (from transcript scan), files changed, hooks fired
- Read by `auto-improvement` / `review --improvements`

---

## 6. Prioritized Implementation List

| Priority | Hook idea | Event | Value |
|---|---|---|---|
| 1 | Crash wrapper pattern (all hooks) | — | Reliability |
| 2 | `packages-guard` | PreToolUse(Write|Edit) | Kit integrity |
| 3 | `isHookEnabled()` toggle system | — | UX / installability |
| 4 | Compact warning in session-init | SessionStart | Safety |
| 5 | `post-edit-skill-reminder` (SKILL.md guard) | PostToolUse | Kit workflow |
| 6 | `cook-after-plan-reminder` | SubagentStop | Workflow chain |
| 7 | `active-plan-reminder` | UserPromptSubmit | Context retention |
| 8 | `commit-message-validator` | PreToolUse(Bash) | Git quality |
| 9 | `plan-file-guard` | PreToolUse(Write) | Structure enforcement |
| 10 | `kit-session-summary` | Stop | Metrics recovery |

---

## 7. Architecture Recommendations

1. **Shared lib/** — extract common patterns: `isHookEnabled`, crash wrapper, transcript dedup, git cache → `packages/core/hooks/lib/`
2. **Fail-open always** — every hook exits 0 on error; never block the agent due to hook crash
3. **Token budget awareness** — `wasRecentlyInjected` pattern prevents context bloat from repeated injection
4. **`SubagentStop` matchers** — underused event; powerful for workflow chaining (plan→cook→review pipeline)
5. **`PostToolUseFailure`** — untapped; useful for retry hints, error pattern detection

---

*Unresolved questions:*
- Does `SubagentStop` matcher work on agent filename (e.g. `epost-planner`) or on a free-form string the agent declares?
- Can `PreToolUse` modify `tool_input` (e.g. rewrite a git commit message) or only block/allow?
- Is `CLAUDE_ENV_FILE` available in our hooks the same way ClaudeKit uses it for env var persistence?
