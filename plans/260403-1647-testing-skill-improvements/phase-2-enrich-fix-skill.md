---
phase: 2
title: "Enrich /fix with prevention gate + complexity routing"
effort: 30 min
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- File: `packages/core/skills/fix/SKILL.md`
- Rationale: After fixing a bug, the skill must enforce: (1) add a regression test, (2) verify the fix with fresh command output. Without a prevention gate, the same bug class recurs. Complexity routing prevents over-engineering simple fixes and under-investing in complex ones.

## Tasks

### Add prevention gate

After the "Error Type Auto-Detection" section, add:

```markdown
## Prevention Gate (MANDATORY after every fix)

Before closing the fix:

1. **Add regression test** — write a test that fails WITHOUT the fix and passes WITH it. This is non-negotiable. No "I'll add tests later."
2. **Verify with fresh output** — run the exact command that was failing. Read the output. Do not claim "done" from memory.
3. **Check for recurrence** — grep the codebase for the same pattern. Fix all instances, not just the reported one.

If verification fails → loop back to diagnosis (max 3 attempts). After 3 failures, stop and discuss architecture with the user.
```

### Add complexity routing

Before "Error Type Auto-Detection", add:

```markdown
## Complexity Assessment

Classify the issue before routing to epost-debugger:

| Level | Signals | Approach |
|---|---|---|
| **Simple** | Single file, clear error message, type/lint | Quick fix: diagnose → fix → verify → prevent |
| **Moderate** | Multi-file, root cause unclear, failing tests | Standard: scout → diagnose → fix → verify → prevent |
| **Complex** | Architecture impact, 3+ modules, systemic | Deep: research → diagnose → plan fix → implement → verify → prevent |

Pass the complexity classification to epost-debugger in the dispatch prompt.
```

### Add anti-rationalization table

Insert after the delegation block:

```markdown
## Anti-Rationalization

| Thought | Reality |
|---|---|
| "I can see the problem, let me fix it" | Symptoms ≠ root cause. Diagnose first. |
| "Quick fix for now, investigate later" | "Later" never comes. Fix properly now. |
| "Just try changing X" | Random fixes create new bugs. Diagnose first. |
| "One more fix attempt" (after 2+ failures) | 3+ failures = wrong approach. Question architecture. |
| "The test already covers this" | Add a SPECIFIC regression test for this exact bug. |
```

## File Ownership

| File | Action |
|---|---|
| `packages/core/skills/fix/SKILL.md` | UPDATE — add prevention gate, complexity assessment, anti-rationalization table |
