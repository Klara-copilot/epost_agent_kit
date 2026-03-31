---
plan: 260329-1414-claudekit-adoption
phase: research
type: researcher
date: 2026-03-29
---

# ClaudeKit v2.14 Adoption Research

## Status: DONE

## Key Findings

### High-Value Additions (adopt)

**1. ck-predict — 5-Persona Pre-Impl Debate**
5 independent experts (Architect, Security, Performance, UX, Devil's Advocate) debate before coding. Conflict resolution is context-weighted, not majority vote. Output: GO/CAUTION/STOP verdict with risk summary. No epost equivalent — fills the gap between planning and code review.

**2. ck-scenario — 12-Dimension Edge Case Explorer**
Mechanical decomposition across User Types, Input Extremes, Timing, Scale, State Transitions, Environment, Error Cascades, Authorization, Data Integrity, Integration, Compliance, Business Logic. Generates test seed list + severity-ranked risk catalog. Bridges plan → test gap.

**3. ck-loop — Git-Memory Optimization Loop**
Autonomous N-iteration metric improvement (coverage, bundle size, lint count). Atomicity constraint (one change = one sentence). Git commit before verify — git IS the memory. `git revert` not `git reset` for discard. Stuck detection at 5 and 10 consecutive discards. Resumable by design.

**4. ck-security — STRIDE + OWASP Audit**
Full audit: STRIDE threat modeling → OWASP Top 10 mapping → dep audit → secret detection → severity ranking. Optional `--fix` mode uses loop-style auto-patch. Critical/High/Medium/Low/Info severity levels. Redacts secrets in output (first 4 + last 2 chars).

**5. ck-security-scan — Pre-Commit Scanner**
Lightweight: injection patterns, XSS, command exec, path traversal, unsafe randomness, eval. No external deps. Output: Pass/Warn/Block with file:line. Staged-files mode by default.

**6. Subagent Status Protocol**
Mandatory completion format: `Status: DONE|DONE_WITH_CONCERNS|BLOCKED|NEEDS_CONTEXT`. Controllers MUST handle BLOCKED/NEEDS_CONTEXT (don't silently retry). >3 failures on same task → escalate.

**7. Diff-Aware Tester**
5 mapping strategies (co-located, mirror dir, import graph, config change, high fan-out). Auto-escalate to full suite if config changed or >70% tests mapped. 5-10x faster test cycles for day-to-day work. Massive UX improvement.

**8. retro — Sprint Retrospective**
Git-metric-only (no hallucination). Commit frequency, churn hotspots, test-to-code ratio, plan completion rate, velocity delta (--compare flag). Per-author breakdown.

### Lower Priority (adopt later)

**ck:ship** — comprehensive release pipeline (merge→test→review→version→changelog→PR). Significant overlap with epost-git-manager. Evaluate after Phase 1-4 complete.

**ck:llms** — llms.txt generator per llmstxt.org spec. Nice-to-have for discoverability.

**deploy** — multi-platform deployment auto-detection. Not immediately relevant.

### Context Isolation Pattern (adopt immediately)

CK uses strict prompt templates for subagent delegation:
```
Task: [specific]
Files to modify: [list]
Files to read: [list]
Acceptance criteria: [list]
Work context: [path]
```
Anti-pattern: "continue from where we left off" → ✅ "implement X per phase-02.md"

### Hooks Worth Adopting

**cook-after-plan-reminder.cjs** — fires SubagentStop after plan agent, reminds main to run cook. Low effort, prevents "planned but forgot to implement" workflow gaps.

## Not Adopting

- ck:team (multi-session parallel teams) — epost subagent model is different
- ck:stitch (Google Stitch) — epost uses Figma pipeline instead
- ck:context-engineering — epost already has context management in core
- hook dedup (skill-dedup.cjs) — marked disabled in claudekit itself (race conditions)

## Architecture Note

ClaudeKit still uses slash commands as primary UX (`/ck:predict`). epost uses skills + agent routing. Our approach is architecturally superior for skill injection (subagent gets skills via frontmatter, not invocation). Adopt CK content, not CK command structure.

## Unresolved Questions

1. Should `predict` route to epost-planner or epost-code-reviewer? Either makes sense — recommend epost-planner since it's pre-impl.
2. `loop` + monorepo: verify command must output single number across web+backend. Need custom examples.
3. `retro` plan completion counting: epost plans are markdown files — need to define "completed" signal (status: field in plan.md).
