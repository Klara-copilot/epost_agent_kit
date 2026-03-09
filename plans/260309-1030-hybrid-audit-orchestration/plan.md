# Plan: Hybrid Audit Orchestration Fix

## Problem

Subagents cannot spawn further subagents — neither Agent tool nor Task tool is available in subagent context. The audit skill has `context: fork` + `agent: epost-code-reviewer`, so `/audit` always runs AS code-reviewer (a subagent). Code-reviewer then cannot dispatch muji for hybrid audits.

```
Current (broken):
  Main → [Agent tool] → epost-code-reviewer (subagent)
                           → [Agent tool] → epost-muji  ❌ BLOCKED
```

## Solution

Change audit skill to run **inline** in the main context. Main context orchestrates hybrid audits by dispatching specialist agents directly.

```
Fixed:
  Main (runs audit/SKILL.md inline)
    → [Agent tool] → epost-muji (subagent)        ✅
    → [Agent tool] → epost-code-reviewer (subagent) ✅
    → Main merges reports into final report.md
```

## Key Design Decisions

1. **audit/SKILL.md**: Remove `context: fork` — skill runs inline in main context
2. **Main context is the orchestrator** for hybrid audits — creates session folder, dispatches agents, merges reports
3. **Simple audits still dispatch a single agent** — `--ui` dispatches muji, `--code` dispatches code-reviewer, `--a11y` dispatches a11y-specialist
4. **Hybrid detection**: klara-theme target with 20+ files → hybrid mode (muji + code-reviewer)
5. **Sequential, not parallel**: muji runs first (UI rules), then code-reviewer gets muji's report path to dedup

## Phase 1: Update audit/SKILL.md ✅

- [x] Remove `context: fork` and `agent: epost-code-reviewer` from frontmatter
- [x] Add hybrid orchestration flow:
  ```
  Hybrid (klara-theme 20+ files):
    1. mkdir -p session folder
    2. Dispatch epost-muji via Agent tool (Template A+)
    3. WAIT for muji report
    4. Dispatch epost-code-reviewer via Agent tool with muji report path
    5. WAIT for code-reviewer report
    6. Read both reports, write merged report.md + session.json
    7. Update reports/index.json
  ```
- [x] Keep simple dispatch for non-hybrid: `--ui` → muji, `--code` → code-reviewer, `--a11y` → a11y-specialist

## Phase 2: Simplify code-review/SKILL.md

- [x] Remove hybrid orchestration from code-review/SKILL.md (no longer code-reviewer's job)
- [x] Code-reviewer becomes a pure reviewer: reads files, applies code-review-standards.md rules, writes report
- [x] Keep: "if muji report path provided, dedup against muji findings by file:line"
- [x] Remove: pre-flight checklist, Template A+ dispatch, muji WAIT logic

## Phase 3: Simplify epost-code-reviewer.md

- [x] Remove hybrid sequential delegation from Delegation Rules table
- [x] Code-reviewer no longer dispatches muji — it receives muji's report path as input
- [x] Keep: "read muji report if provided, dedup, run SEC/PERF/TS/ARCH/STATE/LOGIC"

## Phase 4: Update delegation-templates.md

- [x] Templates A/A+ now dispatched by main context, not code-reviewer
- [x] Update "Report back to" field: `{calling_agent}` → main context
- [x] Add note: "These templates are used by the main conversation (audit/SKILL.md), not by subagents"

## Phase 5: Update output-contract.md

- [x] Hybrid audit orchestrator: main context (not code-reviewer)
- [x] Update Responsibility Matrix to reflect main context as session folder creator and report merger

## Phase 6: Sync + verify

- [x] Run `npx epost-kit init --source . --yes`
- [x] Verify `.claude/` matches

## File Changes

| File | Action |
|------|--------|
| `packages/core/skills/audit/SKILL.md` | Remove fork context, add hybrid orchestration |
| `packages/core/skills/code-review/SKILL.md` | Remove hybrid dispatch, simplify to pure reviewer |
| `packages/core/agents/epost-code-reviewer.md` | Remove hybrid delegation, add "receives muji report" |
| `packages/core/skills/audit/references/delegation-templates.md` | Update caller context |
| `packages/core/skills/audit/references/output-contract.md` | Update orchestrator reference |

## Constraint Documentation

Add to `orchestration.md`:
```
## Subagent Spawn Constraint

Subagents (agents spawned via Agent tool) CANNOT spawn further subagents.
Neither Agent tool nor Task tool is available in subagent context.

Implication: Multi-agent workflows (hybrid audit, parallel research) must be
orchestrated from the main conversation context, not from within a subagent.

Pattern:
  Main context → [Agent tool] → specialist-1 (independent)
  Main context → [Agent tool] → specialist-2 (independent)
  Main context merges results
```
