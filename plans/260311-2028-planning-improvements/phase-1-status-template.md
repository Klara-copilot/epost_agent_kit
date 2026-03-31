---
phase: 1
title: "Living status.md template + auto-generation"
effort: 2h
depends: []
---

# Phase 1: Living status.md Template + Auto-Generation

## Context Links
- [Plan](./plan.md)
- Reference implementation: `luz_next/plans/260307-1416-smartletter-status.md` (56 phases, 209 decisions)
- `packages/core/skills/plan/SKILL.md`
- `packages/core/skills/plan/references/fast-mode.md`
- `packages/core/skills/plan/references/deep-mode.md`
- `packages/core/skills/plan/references/parallel-mode.md`
- `packages/core/skills/cook/SKILL.md`

## Overview
- Priority: P0 (foundational — all other phases benefit from journey tracking)
- Description: Add a `status.md` template to the plan skill. Auto-generate it when a plan is created. Wire cook/fix/debug to update it during execution.

## Design: status.md Sections

Based on the SmartLetter pattern (single file, all context in one read):

```markdown
# {Plan Title} — Status

> Quick-glance overview of what's done, what's next, and key decisions.
> **This is the first file to update when something changes.**

---

## Progress

| Phase | Description | Status |
|-------|-------------|--------|
| 1. {name} | {description} | Pending |

## Not Yet Started
- {upcoming phases}

## Deferred
- {scope that was cut or postponed, with rationale}

---

## Known Bugs
None currently tracked.

### Recently Fixed
- {bug description} — {how it was fixed}

---

## Key Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| {YYYY-MM-DD} | {what was decided} | {why} |

## Open Decisions

| # | Question | Status |
|---|----------|--------|
| 1 | {unresolved question} | Open |

---

## Architecture Reference
{Living architecture notes — updated as implementation reveals structure}

---

*Last updated: {date}*
```

## Requirements

### Functional
1. **Template**: Create `packages/core/skills/plan/references/status-template.md` with the sections above
2. **Auto-generation**: All plan modes (fast/deep/parallel) generate `status.md` alongside `plan.md`
   - Pre-populate Progress table from plan.md phases
   - Key Decisions starts empty (filled during execution)
   - Architecture Reference starts with "TBD — will be populated during implementation"
3. **Update protocol**: Add "Update status.md" instruction to:
   - `cook` skill — after completing a phase: update Progress status, add Key Decisions, update Architecture
   - `fix` skill — after fixing a bug: add to Known Bugs → Recently Fixed
   - `debug` skill — after diagnosing: add findings to Key Decisions or Known Bugs
4. **Resume protocol**: When cook reads an active plan, read `status.md` FIRST to recover context

### Non-Functional
- status.md must be readable in <30 seconds (single-glance overview)
- No forced structure — sections can be empty, added, or removed as needed
- Works with all plan modes (fast/deep/parallel)

## Files to Create
- `packages/core/skills/plan/references/status-template.md` — template + generation rules

## Files to Modify
- `packages/core/skills/plan/references/fast-mode.md` — add status.md generation step
- `packages/core/skills/plan/references/deep-mode.md` — add status.md generation step
- `packages/core/skills/plan/references/parallel-mode.md` — add status.md generation step
- `packages/core/skills/cook/SKILL.md` — add "update status.md" after phase completion
- `packages/core/skills/cook/references/fast-mode.md` — add status.md update step
- `packages/core/skills/fix/SKILL.md` — add "update status.md Known Bugs" after fix
- `packages/core/skills/debug/SKILL.md` — add "update status.md" after diagnosis

## Implementation Steps

1. **Create status-template.md** with:
   - Template markdown (sections above)
   - Generation rules: how to pre-populate from plan.md
   - Update rules: when and what to update per agent

2. **Update fast-mode.md** — After Step 6 (Generate plan.md), add:
   ```
   ### 6.5. Generate status.md
   Create `{plan_dir}/status.md` from `references/status-template.md`:
   - Pre-populate Progress table from plan.md phases (all "Pending")
   - Leave Key Decisions, Known Bugs, Architecture empty
   ```

3. **Update deep-mode.md** — Same step after plan generation, plus:
   - Pre-populate Key Decisions with research-driven decisions (from researcher reports)

4. **Update parallel-mode.md** — Same step, plus:
   - Add Architecture Reference with file ownership matrix summary

5. **Update cook SKILL.md** — Add resume + update protocol:
   ```
   ### Status Tracking
   - On resume: read `{plan_dir}/status.md` FIRST to recover full context
   - After completing a phase: update Progress table status to "Done"
   - After making a design decision: add row to Key Decisions
   - After discovering architecture: update Architecture Reference
   ```

6. **Update fix/debug SKILL.md** — Add Known Bugs update rule

## Todo List
- [x] Create status-template.md with template + rules
- [x] Update fast-mode.md with status.md generation step
- [x] Update deep-mode.md with status.md generation step
- [x] Update parallel-mode.md with status.md generation step
- [x] Update cook SKILL.md with resume + update protocol
- [x] Update cook fast-mode.md with status.md update step
- [x] Update fix SKILL.md with Known Bugs update
- [x] Update debug SKILL.md with findings update
- [ ] Test: run /plan --fast, verify status.md generated with correct phases

## Success Criteria
- New plans auto-generate status.md with Progress table matching plan phases
- Cook updates status.md Progress after each phase
- Fix updates Known Bugs after fixing an issue
- Resuming a plan reads status.md first for context recovery

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Agents forget to update status.md | Med | Make it step 1 in cook completion checklist (same as SmartLetter's "always update STATUS first") |
| status.md grows too large | Low | Sections are optional; keep decisions concise (date + decision + rationale) |
| Duplicate info between plan.md and status.md | Med | plan.md = spec (what to build), status.md = journey (what happened). Different purposes. |
