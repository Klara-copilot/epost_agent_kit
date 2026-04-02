---
phase: 1
title: "cook — Anti-Rationalization Gate + Mandatory Finalize + --auto"
effort: 45m
depends: []
---

# Phase 1: cook Enhancements

## Files to Modify

- `packages/core/skills/cook/SKILL.md`
- `packages/core/skills/cook/references/fast-mode.md`
- `packages/core/skills/cook/references/parallel-mode.md`

## Changes

### cook/SKILL.md

**1. Add `--auto` to the Flags table** (after `--plan`):
```
| `--auto` | Auto-approve all gates when review finds 0 critical issues |
```

**2. Add Anti-Rationalization table** after the Gate block, before "Auto-skip gate":
```markdown
### Anti-Rationalization

Before bypassing the gate, verify you are NOT rationalizing with any of:

| Thought | Reality |
|---------|---------|
| "This is too simple to plan" | Simplicity is judged after design, not before |
| "I already know the solution" | Unknown unknowns exist — research confirms |
| "The user wants it fast" | Fast + broken costs more time than planned + correct |
| "The codebase is familiar" | Familiarity breeds assumption errors |
| "It's just a small change" | Small changes cause large regressions |
| "I'll fix it later" | Later never comes — design now |

If you caught yourself with any of the above: stop and run `/plan` first.
```

**3. Add `--auto` handling** to Step 1 Flag Override block:
```
If `$ARGUMENTS` contains `--auto`: set auto_approve=true — review gates auto-approve when 0 critical issues found.
```

---

### cook/references/fast-mode.md

**1. Add Step 3.5 Simplify** (between Step 3 Review Gate and Step 4 Test):
```markdown
## Step 3.5 — Simplify

Inline simplification pass before testing:
- Duplication: any block that could be extracted or reused?
- Over-engineering: simpler data structure or control flow available?
- File size: any file approaching 200 LOC → split

Skip for documentation-only changes.
```

**2. Expand Step 5 Finalize** to make 3 sub-steps mandatory:
```markdown
## Step 5 — Finalize (MANDATORY)

Do not skip any sub-step.

### 5a. Plan Sync-Back
If working from a plan, update `{plan_dir}/status.md`:
- Progress table: mark completed phase as `Done`
- Key Decisions: add significant choices made
- Architecture Reference: note any discovered structure

### 5b. Docs Impact Assessment
State explicitly:
```
Docs impact: none | minor | major
```
- `none` — internal logic only, no public API change
- `minor` — config change, new param — update inline
- `major` — new feature, behavior change, new API → trigger `epost-docs-manager`

### 5c. Commit Offer
Ask: "Commit? [Y/n]" → delegate to `epost-git-manager` if yes.

### 5d. Change Summary Output
```
Files changed: N
Tests added: N  
Behavior change: [yes/no + 1 line]
Docs impact: [none|minor|major]
Follow-up: [any new issues discovered]
```
```

---

### cook/references/parallel-mode.md

Add same Step 3.5 Simplify and expanded Finalize as fast-mode, adapted for parallel context (after Integrate step).

## Todo

- [ ] Read cook/SKILL.md fully before editing
- [ ] Add `--auto` to flags table
- [ ] Add Anti-Rationalization table after gate block
- [ ] Add `--auto` handling to Step 1 Flag Override
- [ ] Read fast-mode.md fully before editing
- [ ] Add Step 3.5 Simplify to fast-mode.md
- [ ] Expand Step 5 Finalize in fast-mode.md
- [ ] Read parallel-mode.md fully before editing
- [ ] Add Step 3.5 Simplify to parallel-mode.md
- [ ] Add expanded Finalize to parallel-mode.md

## Success Criteria

- Flags table in cook/SKILL.md has `--auto`
- Anti-Rationalization table is present in cook/SKILL.md
- fast-mode.md has Step 3.5 Simplify
- fast-mode.md Step 5 has 5a/5b/5c/5d sub-steps
- parallel-mode.md mirrors fast-mode finalize

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| cook/SKILL.md is large — edit collision | Medium | Read full file first, use targeted edits |
| Anti-rationalization tone is too preachy | Low | Keep table short (6 rows max) |

## Security Considerations

None — markdown documentation only.
