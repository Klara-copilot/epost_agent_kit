# Planning Pipeline Improvements — Status

> Quick-glance overview of what's done, what's next, and key decisions.
> **This is the first file to update when something changes.**

---

## Progress

| Phase | Description | Status |
|-------|-------------|--------|
| 1. Living status.md template | Add status-template.md + auto-generate status.md in plan fast/deep/parallel modes | Done |
| 2. Knowledge-retrieval in fast plan | Insert Step 2.5 (Quick Knowledge Check) in fast-mode.md | Done |
| 3. Batch checkpoints in cook | Pause after every 3 file changes for self-check | Done |
| 4. Error mutation discipline | Force approach change on 2nd retry in error-recovery | Done |
| 5. Enforce review gates + auto-validate | Non-skippable stage gates, auto-validate after deep/parallel plans | Done |

## Not Yet Started
- Nothing — all phases complete

## Deferred
- None

---

## Known Bugs
None currently tracked.

### Recently Fixed
- None

---

## Key Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-11 | Copy modified files to .claude/ directly (not via init) | No init script available at root; packages/ is source of truth but .claude/ must stay in sync for runtime |
| 2026-03-11 | Step 2.5 injects "Prior Art" into Step 4 analysis block | Avoids a separate output section — context flows naturally into the analysis |
| 2026-03-11 | Batch checkpoints skip .md files | Documentation changes don't need type/lint checks |
| 2026-03-11 | Error mutation = different approach, not minor tweak | Prevents disguised retries (changing a variable name ≠ mutation) |
| 2026-03-11 | Quality reviewer has explicit BLOCKED pre-check | Gate enforced in prompt template, not just instructions |
| 2026-03-11 | Auto-validate skippable, not blocking | User can say "skip" to proceed — validation improves plans but shouldn't slow urgent work |

## Open Decisions

| # | Question | Status |
|---|----------|--------|
| 1 | Should Grep/Glob count from 2.5 come out of the 5-search budget or be separate? | Open |

---

## Architecture Reference

**Skill files modified by this plan:**
- `packages/core/skills/plan/references/fast-mode.md` — Step 2.5 + Prior Art in Step 4
- `packages/core/skills/cook/references/fast-mode.md` — Batch Checkpoint Protocol in Step 2 + mutation discipline in auto-escalation
- `packages/core/skills/cook/SKILL.md` — Complexity note: "batch checkpoints active for >3 file changes"
- `packages/core/skills/error-recovery/SKILL.md` — Section 4: Error Mutation Discipline + implementation retry row in Decision Matrix
- `packages/core/skills/subagent-driven-development/SKILL.md` — Iron Law + Never Do section for two-stage review gates
- `packages/core/skills/subagent-driven-development/references/code-quality-reviewer-prompt.md` — Pre-Check gate (BLOCKED if no spec pass)
- `packages/core/skills/subagent-driven-development/references/implementer-prompt.md` — Checklist item 9: batch checkpoints
- `packages/core/skills/plan/SKILL.md` — Auto-Validation section
- `packages/core/skills/plan/references/deep-mode.md` — Step 9: Validate Plan (auto-triggered)
- `packages/core/skills/plan/references/parallel-mode.md` — Step 8: Validate Plan (auto-triggered)

All .claude/ files mirror packages/ (manual copy until init automation exists).

---

*Last updated: 2026-03-11*
