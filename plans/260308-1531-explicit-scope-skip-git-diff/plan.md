---
id: 260308-1531-explicit-scope-skip-git-diff
title: Skip git diff when explicit scope is provided
status: done
effort: 30m
phases: 2
---

# Plan: Skip git diff when explicit scope is provided

## Problem

Every review/audit always runs `git diff --name-only` first, even when the user explicitly names the files or component to review. This is wasteful and sometimes wrong — the user's intent is to review THAT specific thing, not just what changed.

**Current behavior**:
```
/review --code src/features/Payments/PaymentForm.tsx
→ git diff --name-only (runs anyway)
→ also loads PaymentForm.tsx
```

**Desired behavior**:
```
/review --code src/features/Payments/PaymentForm.tsx
→ explicit scope detected → skip git diff
→ use PaymentForm.tsx directly as scope
```

## Scope Resolution Logic (new)

```
IF user provides file paths OR component name in arguments
  → explicit scope mode: use provided paths/names as audit scope
  → skip git diff entirely
ELSE
  → implicit scope mode: run git diff --name-only to discover scope
```

Explicit signals:
- File path argument (e.g. `src/features/foo.tsx`)
- Component name with `--ui` flag (e.g. `--ui Button`)
- Explicit `--files` list
- Direct audit request ("audit this file: X")

## Touch Points

| File | Current | Fix |
|------|---------|-----|
| `packages/core/agents/epost-code-reviewer.md` | "Scout changed files (`git diff --name-only`) before reviewing" | Add scope resolution rule before scout step |
| `packages/core/skills/code-review/SKILL.md` | Step 2: "Identify changed files via `git diff` or `git log`" | Add explicit-scope check before git diff |
| `packages/core/skills/audit/references/ui.md` | INTEGRITY gate: "Scan modified files (git diff, staged files, **or files listed in the audit request**)" | Already partially correct — strengthen the explicit-files branch |
| `packages/core/skills/core/references/workflow-code-review.md` | "Scan changed files via `git diff`" | Add explicit-scope check |

## Phases

### Phase 1 — Add scope resolution rule (core agent + skill)

Files:
- `packages/core/agents/epost-code-reviewer.md` — add Scope Resolution section before Key Constraints
- `packages/core/skills/code-review/SKILL.md` — update Review Process step 2 + Template A dispatch line

### Phase 2 — Align audit + workflow references

Files:
- `packages/core/skills/audit/references/ui.md` — strengthen INTEGRITY gate explicit-files branch
- `packages/core/skills/core/references/workflow-code-review.md` — align scout step

## Out of Scope

- `git-manager`, `docs`, `skill-discovery` git diff references — unrelated to review/audit flows
- No changes to how git diff works for commit/push workflows
