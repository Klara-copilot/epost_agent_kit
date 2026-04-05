---
title: "Audit/Code-Review Phase 1: Platform-Aware Code Review"
status: active
created: 2026-04-05
updated: 2026-04-05
effort: 8h
phases: 5
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Plan: Audit/Code-Review Phase 1 — Platform-Aware Code Review

## Scope Rationale

1. **Problem**: code-review-standards.md accumulates all platform rules (web PERF/TS/STATE, backend JPA/CDI, future iOS/Android). Grows unbounded, loaded even when reviewing single-platform code.
2. **Why this way**: Platform rules belong with platform skills. Cross-cutting rules (SEC/ARCH/LOGIC/DEAD) are universal. code-review becomes an orchestrator that detects platform + loads the right rules.
3. **Why now**: Adding backend/iOS/Android rules to the monolithic file will double debt. Splitting now prevents that.
4. **Simplest value**: Strip platform-specific rules out of code-review-standards.md into platform skill references. Add platform detection to code-review/SKILL.md.
5. **Cut 50%**: Drop iOS/Android rule authoring (Phase 4 creates stubs only). Drop output contract unification (defer to later).

## Architectural Decision: Subagent vs Inline

**Decision: Option A — Flag Injection (code-review stays subagent)**

code-review remains a subagent spawned by audit or standalone. Platform dispatch happens via the *caller* (main context or audit SKILL.md) detecting platforms from file extensions and passing the platform + rules path in the dispatch prompt. No Agent-within-Agent needed.

**Rationale**:
- code-review already works as subagent — no execution model change
- Platform rules are reference files, not agents — they're loaded via Read, not dispatched via Agent tool
- Caller says: "Platform: web. Load `web-frontend/references/code-review-rules.md` for PERF/TS/STATE rules."
- code-review reads the referenced file and applies those rules alongside cross-cutting SEC/ARCH/LOGIC/DEAD
- Zero subagent constraint violation

**Flow**:
```
/review (or /audit --code)
  └─ caller detects platform from file extensions
       ├─ .tsx/.ts/.scss → platform=web
       ├─ .java → platform=backend
       ├─ .swift → platform=ios
       └─ .kt → platform=android
  └─ dispatches epost-code-reviewer with:
       "Platform: {detected}. Platform rules: {path to rules file}."
  └─ code-reviewer loads cross-cutting rules (always)
       + platform rules (from passed path)
       + merges findings → unified report
```

## Summary

Five phases — Phases 1→2 sequential (P2 depends on P1 boundary). Phases 3+4+5 parallel (non-overlapping files).

1. **Cross-cutting extraction** — strip PERF/TS/STATE out of code-review-standards.md, keep only SEC/ARCH/LOGIC/DEAD
2. **Platform dispatch skeleton** — rewrite code-review/SKILL.md with platform detection + rule loading
3. **Web rules file** — create web-frontend/references/code-review-rules.md with PERF/TS/STATE/klara rules
4. **Backend/iOS/Android stubs** — create stub rule files (5-10 rules each, extensible)
5. **Entry points + output contract** — clarify audit vs review routing, unify verdict formula

## Phases

| # | Phase | Effort | Depends | Status | File |
|---|-------|--------|---------|--------|------|
| 1 | Cross-cutting rules extraction | 1.5h | — | pending | [phase-01](./phase-01-cross-cutting-extraction.md) |
| 2 | Platform dispatch skeleton | 2h | Phase 1 | pending | [phase-02](./phase-02-platform-dispatch-skeleton.md) |
| 3 | Web rules file | 1.5h | Phase 1 | pending | [phase-03](./phase-03-web-rules-file.md) |
| 4 | Backend/iOS/Android stubs | 1h | Phase 1 | pending | [phase-04](./phase-04-platform-stubs.md) |
| 5 | Entry points + output contract | 2h | — | pending | [phase-05](./phase-05-entry-points-output-contract.md) |

**Parallelism**: P1 first (sequential). Then P2, P3, P4, P5 all parallel (non-overlapping files).

## Success Criteria

- [ ] code-review-standards.md contains ONLY cross-cutting rules: SEC, ARCH, LOGIC, DEAD (~90 lines)
- [ ] PERF/TS/STATE rules live in `web-frontend/references/code-review-rules.md`
- [ ] code-review/SKILL.md has platform detection logic + rule loading protocol
- [ ] Backend/iOS/Android each have a stub `code-review-rules.md` with 5-10 rules
- [ ] `/audit --code` and `/review` both pass platform context to code-reviewer
- [ ] Backward-compatible: `/audit --ui`, `/audit --a11y` unchanged

## Constraints

- All edits in `packages/` (never `.claude/` directly)
- No new dependencies
- Backward-compatible: existing flags still work
- code-review stays as subagent (Option A — flag injection)
- Stub rule files for iOS/Android: real but minimal, extensible later
- Each phase <= 15 files

## Cross-Plan Dependencies

- PLAN-0065 (audit-rules-standardization): created code-review-standards.md — we restructure it
- PLAN-0066 (hybrid-audit-orchestration): fixed subagent constraint — we preserve it (Option A)
- PLAN-0069 (audit-report-organization): established output-contract.md — Phase 5 extends it
