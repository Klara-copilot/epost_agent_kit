---
phase: 1
title: "Fix dispatch architecture (inline vs fork)"
effort: 1h
depends: []
---

# Phase 1: Fix Dispatch Architecture

## Context Links

- [Plan](./plan.md)
- `packages/core/skills/fix/SKILL.md` -- current: `context: fork, agent: epost-debugger`
- `packages/core/skills/fix/references/ui-mode.md` -- has `context: fork, agent: epost-muji` (redundant/broken)
- `packages/core/skills/fix/references/a11y-mode.md` -- has no fork directive but references Agent tool dispatch

## Problem

`fix/SKILL.md` frontmatter: `context: fork, agent: epost-debugger` means ALL paths run inside epost-debugger. Modes that need to dispatch other agents (--ui -> muji, --a11y -> a11y-specialist) are blocked by Iron Law.

## Solution

Remove `context: fork` and `agent:` from `fix/SKILL.md` frontmatter. Add explicit "Dispatch to epost-debugger via Agent tool" instructions in the general/deep/ci code paths. The --ui and --a11y paths execute inline and dispatch their own specialist agents.

## Files to Modify

### 1. `packages/core/skills/fix/SKILL.md`

**Frontmatter change:**
```yaml
# REMOVE these lines:
context: fork
agent: epost-debugger

# Result: skill executes inline in main context
```

**Step 0 change -- add dispatch routing after flag detection:**

After the flag override section, before Error Type Auto-Detection, add:

```markdown
## Dispatch Routing

- `--ui` detected: execute `references/ui-mode.md` **inline** (main context dispatches epost-muji)
- `--a11y` detected: execute `references/a11y-mode.md` **inline** (main context dispatches epost-a11y-specialist)
- `--deep`, `--ci`, or auto-detect: **dispatch to epost-debugger via Agent tool** with full issue context
```

**Line 65-66 comments:** Keep `.epost-data/` paths as-is (correct per PLAN-0069).

### 2. `packages/core/skills/fix/references/ui-mode.md`

**Frontmatter change:**
```yaml
# REMOVE these lines (reference files don't need fork/agent):
context: fork
agent: epost-muji
```

The dispatch instruction in Step 3 ("Delegate to epost-muji via Agent tool") is correct and stays -- it now works because ui-mode runs inline in main context.

### 3. `packages/core/skills/fix/references/a11y-mode.md`

No frontmatter fork/agent to remove (already clean). But verify the instructions work when executed inline. The a11y-mode references platform-specific sub-files (ios-fix-mode.md, android-fix-mode.md) which contain fix templates -- these are fine as reference content, not agent dispatches.

**However**: a11y-mode does NOT currently dispatch to epost-a11y-specialist. It operates as a direct fixer. This is actually fine -- it reads known-findings and applies fix templates directly without needing a specialist agent. No change needed for a11y-mode dispatch pattern.

## Implementation Steps

1. Edit `packages/core/skills/fix/SKILL.md`:
   - Remove `context: fork` and `agent: epost-debugger` from frontmatter
   - Add "Dispatch Routing" section after Step 0 explaining inline vs fork paths
   - In Error Type Auto-Detection section, add "Dispatch to epost-debugger via Agent tool" as the first instruction

2. Edit `packages/core/skills/fix/references/ui-mode.md`:
   - Remove `context: fork` and `agent: epost-muji` from frontmatter

3. Verify `packages/core/skills/fix/references/a11y-mode.md` works inline (read-only check)

## Todo List

- [x] Remove fork/agent from fix/SKILL.md frontmatter
- [x] Add dispatch routing section to fix/SKILL.md
- [x] Add "dispatch to debugger" instruction in auto-detect path
- [x] Remove fork/agent from ui-mode.md frontmatter
- [x] Verify a11y-mode.md needs no changes

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing `fix` invocations expect debugger context | Med | General path still dispatches to debugger explicitly |
| Claude Code may cache old frontmatter | Low | Regenerate via `epost-kit init` after edit |
