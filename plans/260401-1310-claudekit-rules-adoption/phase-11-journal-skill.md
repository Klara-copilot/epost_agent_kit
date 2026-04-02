---
phase: 11
title: "journal — Standalone reflective journal skill"
effort: 25m
depends: []
---

# Phase 11: Journal Skill

Standalone `/journal` skill for reflective session and sprint writing. Kept separate from `/retro` — retro is data-driven (git metrics), journal is narrative (reflection).

## Files to Create / Modify

- `packages/core/skills/journal/SKILL.md` (create — or update if already exists)
- `packages/core/package.yaml` (modify — add `journal` to provides.skills if not present)

## Changes

### 1. Check existing journal skill

Before creating, check if `packages/core/skills/journal/` already exists. If yes: read current content and update to match spec below.

### 2. journal/SKILL.md

```yaml
---
name: journal
description: Use when the user asks to write a journal entry, session log, sprint reflection, or 'what did we do today'. Generates structured narrative reflections. Agent-invoked only.
version: 1.0.0
user-invocable: false
context: inline
---
```

Content:
```markdown
# Journal

Generates structured reflective journal entries for sessions or sprints.

## Invocation

Agent-invoked only (not a user slash command). Claude applies this skill when the user asks for a journal entry or session reflection. Flags can be inferred from context or stated explicitly by the user.

## Flags

| Flag | Description |
|------|-------------|
| `--prompt TEXT` | Seed the reflection with a specific question or topic |
| `--since DATE` | Scope git context to this date (default: today) |
| `--save` | Write output to `reports/YYMMDD-HHMM-journal.md` |

## Protocol

### Step 1 — Gather Context

- Recent git log (last 20 commits or `--since` range)
- Active plan status (any plan in `plans/` with status: active)
- Current branch name

### Step 2 — Write Entry

```
## Journal: DATE

### What we did
[Summary of commits / tasks completed]

### What worked
[Patterns, approaches, tools that were effective]

### What was hard
[Blockers, friction, unexpected complexity]

### What I'd do differently
[Honest reflection — no sugar-coating]

### Next
[1-3 clear next steps or open questions]
```

If `--prompt TEXT` passed: use the prompt as the anchor for "What I'd do differently".

### Step 3 — Save (if --save)

Write to `reports/YYMMDD-HHMM-journal.md`.
```

### 3. package.yaml — add journal

Add `journal` to `provides.skills` if not already present.

## Todo

- [ ] Check if `packages/core/skills/journal/` already exists
- [ ] Create or update `journal/SKILL.md` with flags + protocol
- [ ] Read package.yaml and add `journal` to provides.skills if missing

## Success Criteria

- `/journal` is user-invocable
- `--prompt`, `--since`, `--save` flags documented
- 5-section output structure present
- Saves to `reports/` only (never production paths)
- Kept completely separate from `/retro`

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing journal/ dir has different structure | Low | Read before overwriting |
| --save writes to wrong path | Low | Hardcode `reports/` prefix |

## Security Considerations

None — reads git log only, writes to reports/ only.
