---
title: "Optimize audit and code-review flows + UI command parity with a11y"
status: complete
created: 2026-03-08
updated: 2026-03-08
effort: 6h
phases: 7
platforms: [all]
breaking: false
---

# Audit & Code-Review Flow Optimization + UI Command Parity

## Problem

Two scopes:

**Scope A — Flow optimization** (from deep flow analysis):
6 gaps found: duplicated report sections, consumer audit rules mixed into workflow, wrong agent skill lists, vague escalation instructions, undocumented lightweight review scope.

**Scope B — UI command parity** (from parity research):
A11y has a full 4-command workflow (audit/fix/review/close) backed by a known-findings DB. UI has only `/audit --ui`. Missing: `/fix --ui`, `/review --ui`, `/audit --close --ui`, and `.epost-data/ui/known-findings.json`.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Shared report schema | 1h | done | [phase-1](./phase-1-shared-report-schema.md) |
| 2 | Consumer audit standards extraction | 45m | done | [phase-2](./phase-2-consumer-audit-standards.md) |
| 3 | Agent skill list fixes + code-review scope docs | 45m | done | [phase-3](./phase-3-agent-wiring-scope.md) |
| 4 | Verify close-a11y.md (no-op) | 5m | done | [phase-4](./phase-4-verify-close-a11y.md) |
| 5 | UI known-findings DB schema | 30m | done | [phase-5](./phase-5-ui-known-findings-schema.md) |
| 6 | `/fix --ui` and `/review --ui` reference files | 1.5h | done | [phase-6](./phase-6-fix-review-ui-commands.md) |
| 7 | `/audit --close --ui` and audit persistence | 1h | done | [phase-7](./phase-7-close-ui-audit-persistence.md) |

**Dependencies:**
- Phases 1–4: independent, parallel-safe
- Phase 5 must complete before Phase 6 and 7 (schema is foundation)
- Phases 6 and 7 can run in parallel after Phase 5

## Success Criteria

**Scope A:**
- `report-standard.md` is the single authority for Methodology, Delegation Log, Executive Summary format
- Both report templates reference it (no duplication)
- Consumer audit rules in a dedicated standards file; `ui.md` is workflow-only
- epost-muji skills list does NOT include `a11y`
- epost-code-reviewer skills list includes `knowledge-retrieval`
- code-review SKILL.md has explicit escalation steps and lightweight scope table

**Scope B:**
- `.epost-data/ui/known-findings.json` schema defined with UI-specific fields
- `fix/references/ui-mode.md` exists — delegates to epost-muji, loads known-findings, applies surgical fix
- `review/references/ui-mode.md` exists — lightweight scan by focus area (structure|reuse|tokens|react|a11y|all)
- `audit/references/close-ui.md` exists — marks finding resolved in known-findings.json
- `audit/SKILL.md` routes `--close --ui <id>` to new close-ui.md
- `fix/SKILL.md` routes `--ui` flag to epost-muji via fix/references/ui-mode.md
- `review/SKILL.md` routes `--ui` flag to epost-muji via review/references/ui-mode.md
- audit/SKILL.md `--ui` persists findings to `.epost-data/ui/known-findings.json`

## Constraints

- ALL changes in `packages/` — never `.claude/`
- No iOS/Android checklists (YAGNI — they don't exist yet)
- No new delegation-protocol.md (YAGNI)
- Surgical edits only — don't rewrite working content
- Mirror a11y patterns exactly where applicable (same schema shape, same routing pattern)
