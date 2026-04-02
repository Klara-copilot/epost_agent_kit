---
name: journal
description: (ePost) Writes structured implementation journal entries for significant decisions and completions. Use after completing a significant feature phase, resolving a non-trivial bug, or making a key architectural decision — writes a structured journal entry to docs/journal/ for future reference
user-invocable: false
metadata:
  keywords:
    - journal
    - decision-log
    - post-mortem
    - implementation-history
    - lessons-learned
  agent-affinity:
    - epost-fullstack-developer
    - epost-debugger
    - epost-planner
  platforms:
    - all
  connections:
    enhances: [knowledge]
---

# Journal Skill

Write implementation history entries to `docs/journal/` after significant work. See `docs/journal/README.md` for epic naming conventions.

## When to Write

| Condition | Write? |
|-----------|--------|
| Non-trivial feature phase completed | Yes |
| Hard bug resolved (surprising root cause, >1 investigation step) | Yes |
| Key architectural decision or rejected alternative | Yes |
| Trivial fix, typo, routine task | No |

## File Path

```
docs/journal/{epic}/{filename}.md
```

**Epic**: plan slug or feature domain — e.g., `skill-discovery/`, `web-platform/`, `a11y/`, `kit/`, `design-system/`

**Filename per agent:**

| Agent | Filename |
|-------|----------|
| `epost-fullstack-developer` | `YYMMDD-{feature-slug}.md` |
| `epost-debugger` | `YYMMDD-fix-{bug-slug}.md` |
| `epost-planner` | `YYMMDD-decision-{slug}.md` |

## Entry Template

```markdown
# {Title}

**Date**: YYYY-MM-DD
**Agent**: epost-{name}
**Epic**: {epic-slug}
**Plan**: plans/{plan-slug}/ (if applicable)

## What was implemented / fixed
{concise description}

## Key decisions and why
- **Decision**: {what was decided}
  **Why**: {rationale, trade-offs considered}

## What almost went wrong
{risks encountered, near-misses, gotchas to remember}
```

## Rules

- Skip the entry if the task was trivial — journal should signal importance
- Keep entries concise; this is a reference artifact, not prose
- Use the same epic slug across related entries to group them
- Create the epic directory if it doesn't exist yet
- **Signal emission**: In "What almost went wrong", if a skill gap caused the issue or a workaround was needed, name the skill explicitly. Format: `[skill-name] did not cover X` or `workaround: used Y instead of X (skill-name should handle this)`

---

## Session Reflection Mode

For narrative session or sprint reflections (not implementation history). Triggered when the user asks "write a journal entry", "session log", or "what did we do today".

### Flags

| Flag | Description |
|------|-------------|
| `--prompt TEXT` | Seed the reflection with a specific question or topic |
| `--since DATE` | Scope git context to this date (default: today) |
| `--save` | Write output to `reports/YYMMDD-HHMM-journal.md` |

### Protocol

**Step 1 — Gather Context**

- Recent git log (last 20 commits or `--since` range)
- Active plan status (any plan in `plans/` with status: active)
- Current branch name

**Step 2 — Write Entry**

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

**Step 3 — Save (if --save)**

Write to `reports/YYMMDD-HHMM-journal.md`.
