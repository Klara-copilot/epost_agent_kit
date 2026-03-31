# Hooks Audit — packages/core/hooks/

**Date**: 2026-03-31
**Agent**: epost-code-reviewer
**Scope**: All 19 registered hooks in `packages/core/hooks/`
**Verdict**: FIX-AND-RESUBMIT

---

## Executive Summary

15 hooks pass. 4 issues found across 3 hooks: one wrong output format (blocks surfacing), one dead-field check (cook reminder never fires), and two minor portability risks with `/dev/stdin`. Two lib files (`config-counter.cjs`, `colors.cjs`) are orphaned from production code (test-only).

---

## Hook Status Table

| Hook | Event | Status | Finding |
|------|-------|--------|---------|
| `session-init.cjs` | SessionStart | ✅ OK | Reads stdin correctly, env write, fail-open |
| `subagent-init.cjs` | SubagentStart | ✅ OK | Correct `hookSpecificOutput.additionalContext` format |
| `context-reminder.cjs` | UserPromptSubmit | ✅ OK | `console.log` → plain text stdout, valid for injection |
| `dev-rules-reminder.cjs` | UserPromptSubmit | ⚠️ ISSUE | Uses `{ continue: true, stdout: ... }` — `stdout` key non-standard; see LOGIC-001 |
| `post-index-reminder.cjs` | PostToolUse(Edit\|Write\|MultiEdit) | ✅ OK | Correct `additionalContext` output, throttled |
| `post-edit-simplify-reminder.cjs` | PostToolUse(Edit\|Write\|MultiEdit) | ⚠️ ISSUE | Reads `/dev/stdin` (macOS-only path); see LOGIC-002 |
| `skill-validation-gate.cjs` | PostToolUse(Write\|Edit) | ✅ OK | Correct `additionalContext` output, lib require valid |
| `known-findings-surfacer.cjs` | PostToolUse(Read) | ❌ BROKEN | Wrong output format for PostToolUse; see LOGIC-003 |
| `usage-context-awareness.cjs` | PostToolUse(\*) | ✅ OK | Caches to tmp, non-blocking, valid `continue: true` |
| `descriptive-name.cjs` | PreToolUse(Write) | ✅ OK | `process.stdin.read` check is always-truthy but falls through correctly to `readFileSync('/dev/stdin')` — functional on macOS |
| `scout-block.cjs` | PreToolUse(Bash\|Glob\|Grep\|Read\|Edit\|Write) | ✅ OK | Correct exit 0/2, lib requires valid |
| `privacy-block.cjs` | PreToolUse(Bash\|Glob\|Grep\|Read\|Edit\|Write) | ✅ OK | Correct exit 0/2, exports for test |
| `build-gate-hook.cjs` | PreToolUse(Bash) | ✅ OK | Correct exit 0/2, dedup env var, lib require valid |
| `subagent-stop-reminder.cjs` | SubagentStop(\*) | ✅ OK | Uses `agent_type` (correct field), `console.log` plain text |
| `cook-after-plan-reminder.cjs` | SubagentStop(\*) | ❌ BROKEN | Dead — checks `agent_name`/`subagent_name` fields that don't exist in SubagentStop payload; see LOGIC-004 |
| `session-metrics.cjs` | Stop | ✅ OK | Appends JSONL, rotates, fail-open |
| `lesson-capture.cjs` | Stop | ✅ OK | Output format acceptable for Stop (plain text stdout from `console.log`) |
| `notifications/notify.cjs` | Stop | ✅ OK | Provider routing, env-loader require valid |
| `scripts/extract-signals.cjs` | Stop (script) | ✅ OK | Standalone script, `--silent` flag, idempotent |

---

## Findings

### LOGIC-003 — HIGH: `known-findings-surfacer.cjs` wrong PostToolUse output format

**File**: `packages/core/hooks/known-findings-surfacer.cjs:184-188`
**Event**: PostToolUse(Read)

Current output:
```js
const response = { type: 'text', text: warning };
process.stdout.write(JSON.stringify(response) + '\n');
```

Claude Code PostToolUse hooks expect `{ additionalContext: string }` to inject context. The `{ type: 'text', text: ... }` format is not a recognized PostToolUse output contract — the warning is silently dropped and never shown to the agent.

**Fix**: Change output to:
```js
process.stdout.write(JSON.stringify({ additionalContext: warning }) + '\n');
```

---

### LOGIC-004 — HIGH: `cook-after-plan-reminder.cjs` dead — wrong SubagentStop field names

**File**: `packages/core/hooks/cook-after-plan-reminder.cjs:21-29`
**Event**: SubagentStop(\*)

The hook filters by `input.agent_name || input.subagent_name`. Claude Code SubagentStop payload contains `agent_type` and `agent_id` — **not** `agent_name` or `subagent_name`. This means `agentName` is always `''`, the planner check never passes, and the hook is effectively dead.

Additionally, `tool_results` (line 29) is not a SubagentStop payload field — it will always be `[]`, so `planWritten` will always be `false` even if the name check were fixed.

Note: `subagent-stop-reminder.cjs` correctly uses `agent_type` and partially covers this use case, but `cook-after-plan-reminder` adds a different prompt message. The functionality overlap is worth reviewing.

**Fix options**:
1. Change field lookup to `input.agent_type || input.agent_id` (aligns with SubagentStop contract)
2. Remove this hook if `subagent-stop-reminder.cjs` is considered sufficient coverage

---

### LOGIC-001 — MEDIUM: `dev-rules-reminder.cjs` uses non-standard `stdout` JSON key

**File**: `packages/core/hooks/dev-rules-reminder.cjs:30,42`

Output: `{ continue: true, stdout: rules }`

The `stdout` key in a JSON hook response is not part of the Claude Code hook output contract for UserPromptSubmit. The recognized injection field is `additionalContext`. The message likely does not reach the model.

Note: `context-reminder.cjs` correctly uses `console.log(content)` (plain text stdout), which IS valid for UserPromptSubmit injection. `dev-rules-reminder` should do the same or switch to `{ additionalContext: rules }`.

**Fix**: Replace `process.stdout.write(JSON.stringify({ continue: true, stdout: rules }))` with `console.log(rules)` (matches working pattern in `context-reminder.cjs`).

---

### LOGIC-002 — LOW: `/dev/stdin` path in `post-edit-simplify-reminder.cjs` and `cook-after-plan-reminder.cjs`

**Files**:
- `packages/core/hooks/post-edit-simplify-reminder.cjs:13`
- `packages/core/hooks/cook-after-plan-reminder.cjs:12`

Both use `fs.readFileSync('/dev/stdin')`. This is a POSIX-only path (macOS/Linux). Other hooks use `fs.readFileSync(0, 'utf-8')` (file descriptor 0 = stdin) which is cross-platform and the established pattern in this codebase.

Low priority since platform is macOS, but inconsistent with the rest of the codebase.

**Fix**: Replace `readFileSync('/dev/stdin')` with `readFileSync(0, 'utf-8')` in both files.

---

## Lib Files Audit

| File | Used By | Status |
|------|---------|--------|
| `lib/build-gate.cjs` | `build-gate-hook.cjs` | ✅ Active |
| `lib/colors.cjs` | Tests only (`lib/__tests__/statusline.test.cjs`) | ⚠️ Production-orphaned |
| `lib/config-counter.cjs` | Tests only (`lib/__tests__/statusline.test.cjs`) | ⚠️ Production-orphaned |
| `lib/context-builder.cjs` | `context-reminder.cjs` | ✅ Active |
| `lib/epost-config-utils.cjs` | 9+ hooks | ✅ Active |
| `lib/error-parser.cjs` | `lib/build-gate.cjs` | ✅ Active (indirect) |
| `lib/privacy-checker.cjs` | `privacy-block.cjs` | ✅ Active |
| `lib/project-detector.cjs` | `session-init.cjs` | ✅ Active |
| `lib/scout-checker.cjs` | `scout-block.cjs` | ✅ Active |
| `lib/skill-validate.cjs` | `skill-validation-gate.cjs` | ✅ Active |
| `lib/transcript-parser.cjs` | `session-metrics.cjs` | ✅ Active |
| `notifications/lib/env-loader.cjs` | `notifications/notify.cjs` | ✅ Active |
| `notifications/lib/sender.cjs` | (check providers) | ⚠️ Unverified — not traced to providers |

`colors.cjs` and `config-counter.cjs` are test-only. Not dead files per se (tests are consumers), but they are not used in production hook execution paths. No action required unless test coverage is removed.

---

## Summary of Issues to Fix

| # | Severity | File | Action |
|---|----------|------|--------|
| 1 | HIGH | `known-findings-surfacer.cjs:184` | Change `{ type, text }` → `{ additionalContext: warning }` |
| 2 | HIGH | `cook-after-plan-reminder.cjs:21` | Fix field name: `agent_name` → `agent_type`; remove `tool_results` check (not in payload) |
| 3 | MEDIUM | `dev-rules-reminder.cjs:42` | Replace `{ continue: true, stdout: rules }` with `console.log(rules)` |
| 4 | LOW | `post-edit-simplify-reminder.cjs:13`, `cook-after-plan-reminder.cjs:12` | Replace `/dev/stdin` with fd `0` |

---

## Methodology

- Read all 19 hook .cjs files directly
- Verified all `require()` paths against actual `lib/` and `notifications/lib/` contents
- Checked output formats against Claude Code hook contracts (PostToolUse: `additionalContext`; PreToolUse: exit 0/2; SubagentStop/Stop: plain text stdout or no output)
- Checked SubagentStop payload field contract (`agent_type`, `agent_id` — not `agent_name`)
- No KB escalation needed (no security/critical findings)

---

## Unresolved Questions

1. Does `notifications/lib/sender.cjs` get used by the provider files (`discord.cjs`, `slack.cjs`, `telegram.cjs`)? Not traced — verify if `sender.cjs` is also orphaned or actively used.
2. Is `cook-after-plan-reminder.cjs` intentionally distinct from `subagent-stop-reminder.cjs`, or is it redundant? If redundant, consider removing it rather than fixing the field names.
3. `lesson-capture.cjs` emits `{ ok: false, reason: "..." }` as JSON to stdout. For Stop hooks Claude Code injects stdout as context — does the model correctly interpret raw JSON objects vs plain text prompts?
