---
date: 2026-03-20
agent: epost-fullstack-developer
plan: plans/260319-0538-kit-rationalization/
phase: phase-2-consolidate-agents
status: partial
---

# Phase 2: Consolidate Agent Responsibilities

## Executed Phase
- Phase: phase-2-consolidate-agents
- Plan: plans/260319-0538-kit-rationalization/
- Status: partial (epost-kit init and workflow tests deferred — no kit CLI available in this session)

## Files Modified

| File | Before | After | Reduction |
|------|--------|-------|-----------|
| `packages/core/agents/epost-debugger.md` | 141 lines | 89 lines | −37% |
| `packages/core/agents/epost-tester.md` | 227 lines | 81 lines | −64% |
| `packages/core/agents/epost-git-manager.md` | 518 lines | 292 lines | −44% |
| `packages/core/agents/epost-fullstack-developer.md` | 174 lines | 106 lines | −39% |

All 4 copied to `.claude/agents/`. Nav headers regenerated via `packages/core/scripts/generate-agent-nav-headers.cjs`.

## Tasks Completed
- [x] Audit all 4 agents for generic vs domain content
- [x] Slim epost-debugger
- [x] Slim epost-tester
- [x] Slim epost-git-manager
- [x] Slim epost-fullstack-developer
- [ ] Run epost-kit init (no CLI in session)
- [ ] Test workflows (manual follow-up)

## What Was Cut Per Agent

### epost-debugger (−37%)
- Generic Investigation Methodology (5-step process any senior dev knows)
- Generic Investigation Tools list (Read, Grep, Bash — Claude already knows these)
- Kept: Platform Delegation routing, error-recovery integration, escalation rule, knowledge-capture trigger

### epost-tester (−64%)
- Core Responsibilities 1-5 (standard QA tasks: run tests, coverage, errors, perf, build — generic QA knowledge)
- Multi-framework test strategy (Python/Go/Rust/Flutter — unrelated to epost platforms)
- Working Process steps (generic: identify scope → run → analyze → report)
- Quality Standards list (test isolation, determinism — native Claude knows these)
- Bun test framework example (boilerplate, not epost-specific)
- Coverage enforcement env vars (COVERAGE_THRESHOLD, CORE_COVERAGE_THRESHOLD — undocumented project config)
- Kept: Platform Delegation (Jest/RTL, XCTest, JUnit, Espresso routing), 80% coverage requirement, report format

### epost-git-manager (−44%)
- "Why Clean Commits Matter" section (5 bullet points of motivation, not operational)
- Commit message bad examples + expanded good examples (format table sufficient)
- Token Optimization Strategy math ($$ analysis, 13x cheaper, etc.)
- Performance Targets table (metrics table, not operational)
- Split Commit Examples section (4 illustrative examples — concept already clear from split decision rules)
- Kept: Full Strict Execution Workflow (operational), PR workflow, commit standard format, Interactive Confirmations, Error Handling, Critical Instructions for Haiku

### epost-fullstack-developer (−39%)
- Code Quality Standards section (clean code, TypeScript strict mode, handle errors — generic)
- Verbose Output Format template (condensed to inline compact form)
- Implementation Workflow per-file checklist (steps already covered in Execution Process)
- Kept: Execution Process (5 phases), File Ownership Rules, Parallel Execution Safety, Platform-Adaptive Implementation mapping

## Borderline Items (Flag for Review)

1. **git-manager: Split Commit Examples** — Removed 4 illustrative examples. Could help Haiku understand the intent better. Low risk to keep if users notice splitting quality degraded.

2. **tester: Coverage env vars** (COVERAGE_THRESHOLD, CORE_COVERAGE_THRESHOLD) — Removed as they reference undocumented project config. If these are actually used in some project, the tester won't know about them. Recommend documenting in `docs/conventions/` if real.

3. **debugger: Investigation Methodology steps** — The 5-step process was cut as generic, but step "Check docs/ for prior findings" is epost-specific (our docs knowledge base). Preserved this logic in the condensed Investigation Protocol section.

## Issues Encountered

- `.claude/scripts/generate-agent-nav-headers.cjs` has a broken `__dirname` path (`../../..` resolves to `/Users/than/Projects` instead of repo root). Used `packages/core/scripts/generate-agent-nav-headers.cjs` instead. The `.claude/` copy should be fixed in a future pass or during next `epost-kit init`.

## Next Steps
- Run `epost-kit init` to regenerate full `.claude/` from `packages/`
- Smoke test: `/plan`, `/cook`, `/fix`, `/review` to confirm routing still works
- Phase 3: Prune analysis/reasoning skills
