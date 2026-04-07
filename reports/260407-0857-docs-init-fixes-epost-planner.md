---
date: 2026-04-07
agent: epost-planner
plan: plans/260407-0857-docs-init-fixes/
status: READY
---

# Plan Report — Fix `/docs --init` index.json Blockers

## Executive Summary

Batch `/docs --init` run across 10 repos produced 4 blocker categories in generated `index.json` files. Root cause: `packages/core/skills/docs/references/init.md` has correct schema examples but weak validation instructions — the model skips required fields. Fix is prompt-engineering only (no scripts): strengthen Pre-Write Validation gate + add explicit ID format anti-pattern guidance + annotate template.

## Blockers Addressed

| # | Blocker | Affected | Root Cause |
|---|---------|----------|------------|
| 1 | Missing `.business.domain` | 8/10 | §5.5 gate is soft ("verify" not "STOP") |
| 2 | Missing/incomplete `.dependencies` | 2/10 | Gate checks object existence only, not nested `internal.libraries/apiServices/external` |
| 3 | Wrong `id` format (`"auth-token-refresh"` vs `"0001"`) | luz_payment | No ID format spec + no anti-pattern table |
| 4 | Missing `.entries[].path` | luzcomp_scripts | `path` not listed in validation checklist |

## Plan Details

**Location**: `plans/260407-0857-docs-init-fixes/`
**Phases**: 3 (sequential — phases 1 & 2 edit same file)
**Effort**: 2-3h total

| Phase | Scope | Effort |
|-------|-------|--------|
| 1 | Rewrite Pre-Write Validation §5.5 gate (3 locations) as 8-row blocking checklist with STOP preamble | 45m |
| 2 | Add §4.9 Entry Schema & ID Format subsection with Correct/Incorrect tables + annotate template | 30m |
| 3 | Sync to `.claude/`, run `/docs --init` on test repo, validate with jq, write verification report | 45m |

**File ownership**:
- Phases 1–2: `packages/core/skills/docs/references/init.md`
- Phase 3: test repo (read-only) + verification report

**Key insight**: The canonical schema in `knowledge/references/knowledge-base.md` is already correct. Only the instruction file that tells the model how to build the JSON needs tightening. No schema migration, no JSON validator script — YAGNI.

## Platform Implications

Kit-only change. Affects every future `/docs --init` run on every repo. No runtime impact; only documentation generation.

## Dependencies

None. Phase 3 depends on 1+2 landing; no cross-plan dependencies. `plans/index.json` scan found no conflicting active plans touching `skills/docs/`.

## Risks

1. Wording may still be skippable — Phase 3 verification catches this; iterate if needed (capped at 2 loops).
2. init.md bloat — budget ≤ +40 net lines.

## Verdict

**READY** — Plan activated. Run `/cook` to begin implementation.

## Unresolved Questions

None.
