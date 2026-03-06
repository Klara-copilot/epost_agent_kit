# PLAN-0054: Kit-Dev Hooks (packages/kit)

**Status:** `in-progress`
**Branch:** `master`
**Context:** Companion to PLAN-0053. Hooks that help developers working on epost_agent_kit itself — NOT installed to user projects. Lives in `packages/kit/` with `settings_strategy: merge`.

---

## Goal

4 hooks specifically for kit developers, placed in `packages/kit/hooks/`. They only activate when `packages/` exists (kit repo context), so they're safe to ship in the kit package without affecting end-users who don't have that directory.

---

## Architecture Change

`packages/kit/package.yaml` needs:
```yaml
files:
  agents/: agents/
  skills/: skills/
  hooks/: hooks/          # ADD
  settings.json: settings.json   # ADD

settings_strategy: merge  # CHANGE from skip
```

`packages/kit/settings.json` — new file, registers all 4 hooks.

---

## Hooks

### 1. `packages-guard.cjs` — PreToolUse(Write|Edit)

**Trigger:** Any Write or Edit tool call
**Guard:** `packages/` dir must exist (exits 0 if not — safe in user projects)
**Action:** Hard block (exit 2, `decision: "block"`) if `file_path` targets `.claude/`

```
.claude/ is generated output — wiped on next epost-kit init.
Edit under packages/ instead, then run: epost-kit init
```

**Implementation notes:**
- Resolve `tool_input.file_path` to absolute path
- Compare against `path.resolve(cwd, '.claude')` with path separator suffix
- Block on match; allow all else

---

### 2. `post-skill-md-edit-reminder.cjs` — PostToolUse(Edit|Write|MultiEdit)

**Trigger:** Edit/Write/MultiEdit where `file_path` matches `packages/**SKILL.md`
**Guard:** file_path must be under `packages/` AND named `SKILL.md`
**Action:** Inject `additionalContext` reminder (non-blocking)

```
[Kit Dev] SKILL.md edited under packages/. Skill discovery index is now stale.
Run: node .claude/scripts/generate-skill-index.cjs
```

**Implementation notes:**
- Check `filePath.includes('/packages/')` AND `filePath.endsWith('SKILL.md')` OR `filePath.includes('SKILL.md')`
- Use `hookSpecificOutput.additionalContext` format for PostToolUse injection

---

### 3. `kit-session-check.cjs` — SessionStart

**Trigger:** Every session start (startup, resume, compact)
**Guard:** `packages/` dir must exist
**Action:** Check mtime of `packages/core/skills/skill-index.json` vs newest SKILL.md in `packages/`. Warn if stale. Always exits 0.

```
⚠️ [Kit Dev] skill-index.json is stale — a SKILL.md was modified after the last index build.
Run: node .claude/scripts/generate-skill-index.cjs
```

**Implementation notes:**
- Recursive mtime scan of `packages/` for `SKILL.md` files
- Wrap scan in try/catch — silently skip on any error
- Output via `console.log` (SessionStart context is injected as system-reminder)

---

### 4. `post-package-edit-reminder.cjs` — PostToolUse(Edit|Write|MultiEdit)

**Trigger:** Edit/Write/MultiEdit where `file_path` matches package-level files:
- `packages/**package.yaml`
- `packages/**agents/*.md` (agent definitions)
- `packages/**hooks/*.cjs` (hook files)

**Guard:** file_path must be under `packages/`
**Action:** Inject `additionalContext` reminder (non-blocking)

```
[Kit Dev] packages/ file edited. .claude/ won't reflect this until re-initialized.
Run: epost-kit init
```

**Dedup:** Only remind once per 10 minutes (tmpfile throttle) — hook edits fire on every file, and a typical init flow touches many files in sequence.

**Implementation notes:**
- Pattern match: `file_path.includes('/packages/')` AND one of:
  - ends with `package.yaml`
  - path contains `/agents/` and ends with `.md`
  - path contains `/hooks/` and ends with `.cjs`
- Throttle: read/write `/tmp/ck-pkg-edit-reminded.json` with timestamp

---

## Settings Registration

`packages/kit/settings.json`:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          { "type": "command", "command": "node .claude/hooks/kit-session-check.cjs" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "node .claude/hooks/packages-guard.cjs" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          { "type": "command", "command": "node .claude/hooks/post-skill-md-edit-reminder.cjs" },
          { "type": "command", "command": "node .claude/hooks/post-package-edit-reminder.cjs" }
        ]
      }
    ]
  }
}
```

---

## File Manifest

**New files:**
- `packages/kit/hooks/packages-guard.cjs`
- `packages/kit/hooks/post-skill-md-edit-reminder.cjs`
- `packages/kit/hooks/kit-session-check.cjs`
- `packages/kit/hooks/post-package-edit-reminder.cjs`
- `packages/kit/settings.json`

**Modified:**
- `packages/kit/package.yaml` — add hooks/+settings.json mapping, change to `merge`
- `.claude/hooks/` — add 4 hook files (installed because kit package is installed here)
- `.claude/settings.json` — merged output with kit hooks registered

---

## Phases

- [ ] **Phase 1** — Architecture: update `packages/kit/package.yaml`, create `packages/kit/settings.json`
- [ ] **Phase 2** — `packages-guard.cjs` (PreToolUse hard block)
- [ ] **Phase 3** — `post-skill-md-edit-reminder.cjs` (PostToolUse, packages/ SKILL.md)
- [ ] **Phase 4** — `kit-session-check.cjs` (SessionStart, stale index)
- [ ] **Phase 5** — `post-package-edit-reminder.cjs` (PostToolUse, package.yaml + agents + hooks, throttled)
- [ ] **Phase 6** — Sync `.claude/` and verify all 4 hooks fire correctly

---

## Success Criteria

- [ ] `packages/kit/` ships with 4 hooks + settings.json; installs to `.claude/` for kit devs
- [ ] `packages-guard` hard-blocks writes to `.claude/` with clear message pointing to `packages/`
- [ ] `post-skill-md-edit-reminder` fires after any SKILL.md edit under `packages/`
- [ ] `kit-session-check` warns at session start when skill-index is stale
- [ ] `post-package-edit-reminder` fires (throttled) after package.yaml / agent / hook edits under `packages/`
- [ ] All 4 hooks exit 0 immediately in user projects (no `packages/` dir)
- [ ] All 4 hooks have outer crash wrapper (fail-open pattern from PLAN-0053)

---

## Key Design Decisions

- **`packages/` existence is the universal guard** — all 4 hooks check this first, making them inert in user projects with zero behavior change
- **Throttle on `post-package-edit-reminder`** — prevents reminder spam during a multi-file init or refactor; 10-minute cooldown via tmpfile
- **`kit-session-check` is a second SessionStart hook** — runs alongside `session-init.cjs` from core; does not replace or modify it
- **Settings merge** — kit's `settings.json` merges on top of core's; both SessionStart arrays concatenate, not override
