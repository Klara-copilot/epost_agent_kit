# PLAN-0053: Hook Improvements

**Status:** `in-progress`
**Branch:** `master`
**Source:** `plans/reports/research-260305-1913-hook-ideas-validation.md`

---

## Goal

Implement 7 validated hook improvements across 4 categories:
1. Crash safety on all existing hooks
2. Session-init enhancements (compact warning + stale index hint)
3. Three new hooks (packages-guard, skill-reminder, plan→cook chain)
4. Session-metrics transcript scan (repair broken session data pipeline)

All changes live in `packages/core/hooks/` — source of truth. `.claude/hooks/` is regenerated.

---

## Constraints

- All hooks must **fail-open** (exit 0 always) — never block the agent
- No new npm dependencies — Node.js builtins only
- Crash wrapper outer catch must use only `fs`, `path` (builtins) — no lib/ requires
- New hooks registered in both `packages/core/settings.json` AND `.claude/settings.json`
- After changes: run `epost-kit init` to sync `.claude/`

---

## Phase 1 — Crash wrapper on all existing hooks

**Files:** all 8 hooks in `packages/core/hooks/*.cjs`
**What:** Wrap entire module execution in outer try/catch. Inner try/catches stay. Outer catch logs to `.logs/hook-log.jsonl` using only Node builtins.

**Pattern to apply:**
```js
// TOP OF FILE — before any require() calls
try {

  // ... entire existing hook code ...

} catch (e) {
  // Minimal crash logging — only Node builtins, no lib/ deps
  try {
    const fs = require('fs');
    const p = require('path');
    const logDir = p.join(__dirname, '.logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(
      p.join(logDir, 'hook-log.jsonl'),
      JSON.stringify({ ts: new Date().toISOString(), hook: p.basename(__filename, '.cjs'), status: 'crash', error: e.message }) + '\n'
    );
  } catch (_) {}
  process.exit(0); // fail-open
}
```

**Hooks to wrap:**
- [ ] `session-init.cjs`
- [ ] `dev-rules-reminder.cjs`
- [ ] `subagent-init.cjs`
- [ ] `privacy-block.cjs`
- [ ] `scout-block.cjs`
- [ ] `session-metrics.cjs`
- [ ] `lesson-capture.cjs`
- [ ] `notifications/notify.cjs` (if applicable)

**Settings change:** None — no new hooks registered.

---

## Phase 2 — Extend session-init.cjs

Two enhancements added to the existing `main()` function in `packages/core/hooks/session-init.cjs`.

### 2a. Compact context approval-state warning

**Trigger:** `data.source === 'compact'`
**Output:** Warning injected via `console.log` (shown in system-reminder)

```
⚠️ CONTEXT COMPACTED — APPROVAL STATE CHECK:
If you were waiting for user approval (e.g. AskUserQuestion gate),
you MUST re-confirm before proceeding. Do NOT assume approval was given.
```

**Where to insert:** After plan resolution block, before `buildContextOutput()` call.

### 2b. Stale skill-index.json detection

**Trigger:** `packages/` directory exists in CWD (kit repo context only)
**Logic:**
1. Get mtime of `packages/core/skills/skill-index.json`
2. Find newest SKILL.md under `packages/` (recursive glob)
3. If any SKILL.md is newer than index → inject one-line warning

**Output:**
```
⚠️ skill-index.json may be stale — run: node .claude/scripts/generate-skill-index.cjs
```

**Where to insert:** After compact warning block.
**Guard:** Skip silently if `packages/` not found (non-kit-repo context).

---

## Phase 3 — New hooks

### 3a. `packages-guard.cjs` — PreToolUse(Write|Edit)

**Purpose:** Block direct writes to `.claude/` in kit repos (source of truth is `packages/`)

**File:** `packages/core/hooks/packages-guard.cjs`

**Logic:**
```
1. Read stdin → parse tool_input.file_path
2. If packages/ dir does NOT exist → exit 0 (not a kit repo, safe to edit .claude/)
3. If file_path starts with .claude/ (or absolute equivalent) → BLOCK
4. Output: { "decision": "block", "reason": ".claude/ is generated output..." }
5. Else → exit 0 (allow)
```

**Block message:**
```
`.claude/` is generated output — wiped on next `epost-kit init`.
Edit under `packages/` instead, then run: epost-kit init
```

**Settings registration:**
```json
"PreToolUse": [
  {
    "matcher": "Write|Edit",
    "hooks": [{ "type": "command", "command": "node .claude/hooks/packages-guard.cjs" }]
  }
]
```

---

### 3b. `post-edit-skill-reminder.cjs` — PostToolUse(Edit|Write)

**Purpose:** Remind to regenerate skill-index.json after any SKILL.md edit

**File:** `packages/core/hooks/post-edit-skill-reminder.cjs`

**Logic:**
```
1. Read stdin → parse tool_name + tool_input.file_path
2. If tool_name not in [Edit, Write, MultiEdit] → exit 0
3. If file_path does NOT contain "SKILL.md" → exit 0
4. Output additionalContext reminder
5. Exit 0
```

**additionalContext output:**
```
[Skill Index Reminder] SKILL.md was modified. Run:
  node .claude/scripts/generate-skill-index.cjs
...to update skill discovery. Skipping this breaks skill routing.
```

**Settings registration:**
```json
"PostToolUse": [
  {
    "matcher": "Edit|Write|MultiEdit",
    "hooks": [{ "type": "command", "command": "node .claude/hooks/post-edit-skill-reminder.cjs" }]
  }
]
```

---

### 3c. `cook-after-plan-reminder.cjs` — SubagentStop

**Purpose:** After a plan subagent completes, remind to run `/cook` before implementing

**File:** `packages/core/hooks/cook-after-plan-reminder.cjs`

**Logic:**
```
1. Read stdin → parse agent_type (or agent_id if agent_type unavailable)
2. Check if agent matches planning agent: contains "plan" or "planner" (case-insensitive)
3. If no match → exit 0
4. Output reminder to stdout
5. Exit 0
```

**Output:**
```
Plan subagent completed. Before implementing:
  Run /cook {plan.md} to start implementation from a fresh context.
```

**Matcher note:** Use `*` matcher in settings, then filter by agent_type/agent_id inside the hook. This avoids the unresolved question about matcher semantics — the hook self-filters.

**Settings registration:**
```json
"SubagentStop": [
  {
    "matcher": "*",
    "hooks": [{ "type": "command", "command": "node .claude/hooks/cook-after-plan-reminder.cjs" }]
  }
]
```

---

## Phase 4 — Extend session-metrics.cjs (transcript scan)

**Purpose:** Recover rich session data (tool usage, skill activations) without the broken prompt hook

**Context:** The removed `type:prompt` Stop hook was the only source of skills/errors/rework data. Without it, `session-metrics.cjs` only writes git stats. `lesson-capture.cjs` then has nothing to evaluate.

**Approach:** Use existing `lib/transcript-parser.cjs` to scan the last N entries of the session transcript.

**What to extract (scoped, safe):**
- Tool call counts by type (Read, Edit, Write, Bash, Agent, etc.) — from transcript tool_use blocks
- Skill activations — look for known skill name keywords in assistant messages (not fragile prompt parsing, just keyword presence)
- Subagent count — count Agent tool calls

**What NOT to extract (too fragile):**
- Error types from text
- Fix iteration count from conversation flow
- User approval state

**Implementation:**
1. In `session-metrics.cjs`, after git stats collection, check if `payload.transcript_path` is available in stdin
2. If yes, call `transcript-parser.cjs` with last-50-entries limit
3. Merge tool counts into the session record
4. If transcript unavailable → write session record without tool stats (existing behavior)

**Session record additions:**
```json
{
  "tools": { "Read": 12, "Edit": 8, "Write": 3, "Bash": 6, "Agent": 2 },
  "subagentCount": 2
}
```

**Guard:** transcript_path check — if field missing in Stop payload, skip scan entirely (safe fallback).

---

## Phase 5 — Settings registration + sync

**Files to update:**
- `packages/core/settings.json` — add new hook registrations for 3a, 3b, 3c
- `.claude/settings.json` — sync same changes (or run `epost-kit init`)

**Full new settings diff:**
```json
// ADD to PreToolUse:
{ "matcher": "Write|Edit", "hooks": [{ "type": "command", "command": "node .claude/hooks/packages-guard.cjs" }] }

// ADD to PostToolUse (new section if not present):
{ "matcher": "Edit|Write|MultiEdit", "hooks": [{ "type": "command", "command": "node .claude/hooks/post-edit-skill-reminder.cjs" }] }

// ADD SubagentStop section:
"SubagentStop": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node .claude/hooks/cook-after-plan-reminder.cjs" }] }]
```

---

## Phase 6 — Verification

- [ ] Run each hook manually with test stdin to verify output
- [ ] Run existing hook tests: `npm test` in packages/core/
- [ ] Trigger packages-guard manually: attempt to write `.claude/test.txt` → confirm block
- [ ] Trigger skill-reminder: edit a SKILL.md → confirm reminder appears
- [ ] Verify session-init compact warning: check `source=compact` code path
- [ ] Verify stale index hint: set clock back on skill-index.json, start session

---

## Success Criteria

- [ ] All 8 existing hooks have outer crash wrapper; `.logs/hook-log.jsonl` written on crash
- [ ] session-init emits compact warning when `source === 'compact'`
- [ ] session-init emits stale index hint when any SKILL.md is newer than skill-index.json
- [ ] `packages-guard` blocks `file_path` under `.claude/` when `packages/` dir exists
- [ ] `post-edit-skill-reminder` injects reminder after SKILL.md writes
- [ ] `cook-after-plan-reminder` outputs reminder after planning agent stops
- [ ] `session-metrics` writes `tools` + `subagentCount` fields when transcript available
- [ ] All existing tests pass
- [ ] No hook can block session when erroring (exits 0 always verified)

---

## File Manifest

**Modified:**
- `packages/core/hooks/session-init.cjs` — crash wrapper + compact warning + stale index hint
- `packages/core/hooks/dev-rules-reminder.cjs` — crash wrapper
- `packages/core/hooks/subagent-init.cjs` — crash wrapper
- `packages/core/hooks/privacy-block.cjs` — crash wrapper
- `packages/core/hooks/scout-block.cjs` — crash wrapper
- `packages/core/hooks/session-metrics.cjs` — crash wrapper + transcript scan
- `packages/core/hooks/lesson-capture.cjs` — crash wrapper
- `packages/core/settings.json` — register 3 new hooks
- `.claude/settings.json` — sync

**Created:**
- `packages/core/hooks/packages-guard.cjs`
- `packages/core/hooks/post-edit-skill-reminder.cjs`
- `packages/core/hooks/cook-after-plan-reminder.cjs`
