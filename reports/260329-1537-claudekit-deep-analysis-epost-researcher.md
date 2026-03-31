---
date: 2026-03-29
type: strategic-analysis
---

# ClaudeKit vs epost_agent_kit — Deep Comparative Analysis

## Score

| Dimension | claudekit | epost |
|-----------|-----------|-------|
| Total skills | 85 | 43 |
| Total agents | 14 | 10 |
| Total hooks | 15 | 11 |
| Review sophistication | 3-stage adversarial | 1-stage |
| Plan discipline | Hard-gate enforced | Optional |
| Domain depth | Generalist (85 skills) | Focused (ePost platform) |
| Novelty per skill | Medium (breadth>depth) | High (domain depth) |

---

## Part 1: Architecture Gaps (HOW we build, not WHAT)

These are the most impactful improvements — they apply to every agent interaction.

### A. 3-Stage Adversarial Code Review

**What claudekit does:** Stage 1 spec compliance → Stage 2 code quality → Stage 3 adversarial red-team (always-on, scope-gated: skip only if ≤2 files ≤30 LOC). Each stage is a separate subagent. Stage 2 blocked until Stage 1 passes.

**What epost does:** Single-stage review. epost-code-reviewer is not adversarial.

**What adversarial finds that single-stage misses:** Edge cases that aren't in spec, security holes in "working" code, race conditions, privilege escalation paths.

**Gap to close:** Add Stage 3 adversarial pass to `epost-code-reviewer`. Scope gate keeps it cheap (only on ≥3 files OR ≥30 LOC). Red-team verdict system: Accept (must fix) / Reject (false positive) / Defer (create GitHub issue).

**Effort:** M | **Impact:** HIGH

### B. Edge Case Scouting (Pre-Review Gate)

**What claudekit does:** Before code review, mandatory `scout` phase — fast parallel scan for edge cases, boundary conditions, unexpected inputs.

**What epost does:** Code review starts immediately. No pre-scan phase.

**Gap:** Add mandatory scout gate to `review` skill and `epost-code-reviewer` system prompt. Scout runs first, findings inform the review. Total cost: one extra lightweight subagent.

**Effort:** S | **Impact:** HIGH

### C. Cross-Plan Dependency Detection

**What claudekit does:** When creating a plan, planner scans ALL existing plans for `blockedBy`/`blocks` relationships. New plans are flagged if they conflict with or depend on in-progress work.

**What epost does:** Plans are isolated. No cross-plan awareness.

**Gap:** Add step 0 to `plan` skill: scan `plans/index.json` for active plans → detect conflicts → surface `blocks`/`blockedBy`. Add these fields to plan frontmatter.

**Effort:** M | **Impact:** HIGH for complex roadmaps

### D. Hard-Gate Planning Discipline

**What claudekit does:** `ck:cook` REFUSES to write code if no plan exists. If plan exists, REFUSES to code until plan is approved. Gates: Research → Plan → Code → Test → Finalize.

**What epost does:** Can "just code it" without a plan.

**Gap:** Add pre-flight check to `cook` skill: "Does `plans/` have an active plan? If not → redirect to /plan first." Configurable: `--no-gate` to bypass.

**Effort:** S | **Impact:** MEDIUM (discipline, consistency)

### E. Verification-Before-Completion Enforcement

**What claudekit does:** NO agent can claim "done" without fresh evidence: tests passing, build succeeding, bug reproduced. "Claimed completion" without evidence = protocol violation.

**What epost does:** Partial — `verification-before-completion` skill exists but isn't enforced as hard gate.

**Gap:** Embed verification requirement in `epost-fullstack-developer` system prompt as a hard rule, not optional skill.

**Effort:** S | **Impact:** HIGH

---

## Part 2: Agent Upgrades

### F. epost-code-reviewer → Add Adversarial + Edge Case Scout

From CK: code-reviewer spawns edge-case scout → runs 3-stage review → manages fix-review cycles (max 3) → produces verdict per finding (Accept/Reject/Defer).

**What to add to epost-code-reviewer:**
- Edge case scout phase before review
- Adversarial Stage 3 (scope-gated)
- Verdict system per finding
- Fix-diff-only optimization (re-review only the changed diff, not full file)
- Task-managed pipeline for 3+ file reviews

**Effort:** M

### G. epost-planner → Add Cross-Plan Blocking + Scope Challenge

From CK planner: Step 0 is "scope challenge" (5-why analysis — is this the right problem?). Then cross-plan dependency scan. Then research phase (spawn 2 researchers in parallel).

**What to add to epost-planner:**
- Scope challenge pre-step (5-why)
- Cross-plan blocking detection
- Parallel researcher fan-out (already done in epost, validate it's working)
- Red-team review before sign-off (for complex plans)

**Effort:** M

### H. epost-tester → Diff-Aware Mode (already in Phase 1 plan)

Already identified. 5 mapping strategies, auto-escalation at >70% mapped.

**Effort:** S (already planned)

---

## Part 3: New Skills to Create

### Immediate (S effort, prompt-based)

| Skill | What it is | Category |
|-------|-----------|----------|
| `problem-solving` | Meta-cognitive framework: complexity spirals, assumption busting, simplification cascades. When stuck, use this before trying harder. | workflow |
| `sequential-thinking` | Step-by-step analysis with revision: form hypothesis → collect evidence → test → revise. Not a chain-of-thought prompt — structured cycle. | workflow |
| `mermaidjs` | Generate Mermaid v11 diagrams: flowchart, sequence, ER, Gantt, state, architecture. Agent-friendly — output blocks Claude can render. | knowledge |

### Medium (M effort, workflow-based)

| Skill | What it is | Category |
|-------|-----------|----------|
| `predict` | 5-persona debate (Architect/Security/Performance/UX/Devil's Advocate) → GO/CAUTION/STOP | workflow |
| `scenario` | 12-dimension edge case explorer → severity-ranked test seed list | workflow |
| `loop` | Git-memory autonomous optimization loop (metric-driven) | workflow |
| `security` | STRIDE + OWASP audit + dep scan + secret detection | quality |
| `security-scan` | Lightweight pre-commit scanner | quality |
| `retro` | Sprint retrospective from git metrics only | workflow |
| `llms` | Generate llms.txt at project root from docs/index.json | knowledge |

### Domain Expansion (L effort — new capabilities)

| Skill | What it is | Priority |
|-------|-----------|----------|
| `ui-ux-pro-max` | 50+ styles, 161 color palettes, 57 font pairings, 99 UX guidelines — encyclopedic design reference | HIGH for muji agent |
| `copywriting` | Conversion copy: headline formulas, CTA patterns, email templates, landing page copy | MEDIUM |
| `payment-integration` | Stripe, Paddle, Polar, SePay checkout/subscription patterns | LOW (not ePost domain yet) |
| `bootstrap` | Project initialization: tech stack research, design system selection, planning, first implementation | MEDIUM |
| `mermaidjs` | Already in immediate above | S |

---

## Part 4: Hook Improvements

| Hook to Add | Event | Purpose | Effort |
|-------------|-------|---------|--------|
| `usage-context-awareness.cjs` | PostToolUse (5min throttle) | Inject context % + usage limits into every session | S |
| `descriptive-name.cjs` | PreToolUse (Write) | Block non-kebab-case file names | S |
| `post-edit-simplify-reminder.cjs` | PostToolUse (Edit/Write) | Suggest simplification review after edits | S |
| `cook-after-plan-reminder.cjs` | SubagentStop (planner) | Remind to /cook after plan agent completes | S |
| `dev-rules-reminder.cjs` | UserPromptSubmit | Inject YAGNI/KISS/DRY before each prompt | S |

---

## Part 5: What epost Has That's Better

Don't lose these advantages when adopting CK patterns:

| epost Advantage | Preserve by |
|-----------------|-------------|
| build-gate-hook — prevents bad code from being committed | Keep as PreToolUse hook |
| known-findings-surfacer — surfaces known issues at the right moment | Keep, not in CK |
| lesson-capture — captures learnings at Stop | Keep, not in CK |
| a11y skills (web/ios/android) — deep WCAG 2.1 AA | Keep, CK only has surface a11y |
| knowledge-base KB structure | Keep, richer than CK docs |
| Design tokens + Figma pipeline | Keep, more mature than CK design |
| ePost domain skills (B2B/B2C) | Keep, CK is generalist |

---

## Prioritized Roadmap

### Tier 1 — High Impact, Small Effort (do first)
1. Edge case scouting gate in `epost-code-reviewer`
2. Verification-before-completion as hard rule (not optional skill)
3. `problem-solving` skill
4. `sequential-thinking` skill
5. `mermaidjs` skill
6. `cook-after-plan-reminder.cjs` hook
7. `descriptive-name.cjs` hook
8. `usage-context-awareness.cjs` hook

### Tier 2 — High Impact, Medium Effort (Phase 1-4 plan already covers)
9. Adversarial Stage 3 on `epost-code-reviewer`
10. Cross-plan dependency detection in `epost-planner`
11. Diff-aware `epost-tester`
12. `predict`, `scenario`, `loop`, `security`, `security-scan`, `retro` skills
13. `--ship` flag on git skill

### Tier 3 — Domain Expansion (after Tier 2)
14. `ui-ux-pro-max` for muji agent
15. `copywriting` skill
16. `bootstrap` skill
17. Hard-gate planning enforcement in `cook`

---

## Unresolved Questions

1. Does epost-code-reviewer need a scope gate for adversarial (≤2 files ≤30 LOC = skip)? Recommend yes.
2. Cross-plan detection: should we auto-block or just warn? Recommend warn first (non-breaking).
3. `ui-ux-pro-max` — should this go in epost core or `packages/design-system`? Recommend design-system since muji uses it.
4. `copywriting` skill — is there an ePost use case (marketing landing pages, B2B onboarding copy)? If yes, add. If not, skip.
5. Hook order matters: when both `usage-context-awareness` and `dev-rules-reminder` fire on UserPromptSubmit, which runs first? Order in settings.json.
