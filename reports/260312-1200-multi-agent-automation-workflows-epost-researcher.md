# epost-researcher: Multi-Agent AI Automation Workflows

**Date**: 2026-03-12 12:00
**Agent**: epost-researcher
**Scope**: Research automation patterns for multi-agent AI systems in code review, prototyping, testing, quality monitoring, and cross-branch fixes
**Status**: COMPLETE

---

## Executive Summary

Multi-agent automation workflows are emerging across three maturity tiers: (1) **Production-ready** (GitHub Actions + manual CI/CD, epost_agent_kit's plan-implement-review-git chain), (2) **Near-term** (Claude Code hooks for background monitoring, IDE-integrated background agents), and (3) **Experimental** (autonomous fix propagation, continuous quality loops). epost_agent_kit can immediately enable workflows 1-2 using hooks + orchestration skills; workflows 3 require extended agent autonomy and cross-repository coordination. Recommendation: Build automated code audit pipeline (workflow 1), prototype PO-to-prototype workflow (workflow 2), document patterns for future 3.

---

## Findings

### Workflow Category 1: Automated Code Auditing (Production-Ready)

**What works today:**
- GitHub Actions + third-party tools (Codacy, SonarQube, DeepSource) watch PRs, report violations
- epost_agent_kit's existing orchestration: `scout` (find issues) → `code-reviewer` (audit staged code) → `fix` (auto-fix) → `git-manager` (commit fixes on separate branch)
- Hook-based trigger: `.claude/hooks/PreToolUse.cjs` blocks unsafe tool calls; `SessionStart` can queue audit jobs

**Maturity**: Production. GitHub Actions for CI/CD is battle-tested; epost agents handle semantic analysis better than linters alone.

**What's missing**:
- Webhook ingestion: GitHub PR events → Claude Code session spawn (requires external bridge service)
- Asynchronous orchestration: Can't persist agent state across sessions yet
- Browser-based PR approval UI: Agents audit, write comments, but can't merge directly

**Code pattern**:
```typescript
// .claude/hooks/SessionStart.cjs
module.exports = async ({ session, outputs }) => {
  if (process.env.TRIGGER === 'github-pr') {
    const { pr_number, branch } = JSON.parse(process.env.PR_CONTEXT);
    outputs.enqueue('audit-job', { pr_number, branch });
  }
};

// Then in agent system prompt:
// "If audit-job is queued: spawn epost-code-reviewer with PR branch context"
```

**Integration with epost_agent_kit**:
- Route: GitHub webhook → Cloud Function → enqueue in data-store → agent reads on next session
- Agents: `scout` (find files in PR), `code-reviewer` (run audit), `fix` (apply fixes), `git-manager` (commit to `fix/{pr_number}` branch)
- Output: PR comment with findings + link to fix branch

### Workflow Category 2: PO-to-Prototype Pipeline (Near-Term, 60% Feasible)

**What works today:**
- `epost-planner` creates detailed plan from PRD
- `epost-fullstack-developer` implements via `cook` skill
- `epost-code-reviewer` audits staged code
- `epost-git-manager` commits and creates PR
- Synchronous orchestration in main conversation via subagent-driven-development skill

**Maturity**: 70% production-ready (synchronous), 30% future (async milestone tracking).

**Step-by-step flow**:
1. PO writes: "Build inbox notification center — show 5 latest messages, mark read, archive"
2. `epost-planner` generates plan with phases, estimates, file ownership
3. `epost-project-manager` routes phases to `epost-fullstack-developer` (web UI), `epost-tester` (e2e), `epost-a11y-specialist` (a11y audit)
4. Subagents implement in parallel (if independent file ownership)
5. `epost-code-reviewer` audits all staged changes
6. `epost-git-manager` commits with auto-generated description from plan
7. **Missing**: Auto-update plan status (Asana integration, status dashboard)

**Code pattern**:
```typescript
// In epost-planner skill (via data-store):
// 1. Generate plan
const plan = { id: uuid(), phases: [...], created: now() };
await data_store.save('plan', plan.id, plan);

// 2. Dispatch to subagent-driven-development
// epost-project-manager orchestrates via Agent tool

// 3. After implementation, epost-git-manager creates PR
// Set PR description to include plan.id

// 4. (FUTURE) Hook on PR merge: update plan status
```

**Integration with epost_agent_kit**:
- Use `data-store` skill to persist plan across agent calls
- Add `epost-project-manager` routing logic (already exists — just needs task decomposition enhancement)
- Hook: `PostToolUse` (git merge) → update Asana task status
- Limitation: Requires Asana MCP integration (roadmap, not yet shipped)

### Workflow Category 3: Development Dashboard & Tracking (Near-Term, 40% Feasible)

**What's possible**:
- Aggregate `plans/index.json` + agent session logs → sprint velocity
- Parse PR descriptions for plan IDs → trace feature → plan status
- Extract metrics from `epost-code-reviewer` reports (lint violations, test coverage drop, a11y findings)

**Maturity**: 40% feasible (data exists, aggregation pipeline needed).

**Missing**:
- Real-time dashboard (no built-in UI framework)
- Automatic metrics capture (require instrumentation in skills)
- Time-series database for trend analysis

**Quick win**: Build static Markdown report:
```typescript
// Tool: Reports generator (new skill)
// Reads: plans/index.json, git log (merged PRs), cached audit results
// Outputs: /docs/progress-report.md with tables:
//   - Plan completion %
//   - Issues found/fixed per component
//   - Test coverage trend
//   - A11y violations trend
```

**Integration**: Add to `epost-git-manager` post-merge hook.

### Workflow Category 4: Brainstorming & Feasibility Evaluation (Production-Ready)

**What works today:**
- `epost-brainstormer` generates ideas from user prompt
- `epost-planner` assesses feasibility, creates spike plan
- `epost-fullstack-developer` builds working prototype
- `epost-code-reviewer` validates approach
- Decision recorded in `docs/decisions/`

**Maturity**: Production (synchronous workflow).

**Enhancement**: Add design system validation.
```typescript
// Current: brainstorm → feasibility → prototype
// New: prototype → epost-muji audit (design consistency) → refactor if needed
```

**Integration**: `cook` skill already loads `figma` + `design-tokens` skills; just needs epost-muji coordination.

### Workflow Category 5: Cross-Branch Fix Suggestions (Experimental, 30% Feasible)

**Idea**: Agent detects fix in `feature/X`, identifies same bug pattern in `feature/Y`, `develop`, `main` via git log + codebase search.

**Current capability**:
- `scout` skill can search codebase (RAG or grep)
- `fix` skill can apply diffs

**What's missing**:
- Pattern abstraction: Convert diff to semantic pattern (hard problem)
- Multi-repo coordination: Cloning, applying patches, pushing
- Risk assessment: Will fix break other tests? (requires running full suite per branch)

**Maturity**: 30% feasible (requires research on pattern matching).

**Minimum viable**: Hard-code pattern rules.
```typescript
// Example: "Fix null pointer in FetchBuilder.ts"
// Pattern: if (fetchResult == null) → if (fetchResult?.data == null)
// Search: grep in all branches for identical fetchResult null checks
// Suggest: "Apply to X, Y, Z branches?"
```

### Workflow Category 6: Continuous Quality Loop (Experimental, 20% Feasible)

**Vision**: Agent wakes up daily, scans codebase metrics (lint, coverage, bundle size), opens fix PR if degradation detected.

**Current capability**:
- `epost-tester` can run test suite
- `epost-debugger` can analyze failures
- `epost-fix` can apply fixes
- Hooks exist but no scheduler

**What's missing**:
- Cron/scheduler: Claude Code has no native scheduler (needs external orchestration)
- Metric baselines: Where to store yesterday's coverage %?
- Decision logic: Severity threshold for auto-fix vs. notification

**Maturity**: 20% feasible (external scheduler required).

**Bridge pattern**:
```typescript
// External: GitHub Actions cron job
name: daily-quality-check
on:
  schedule:
    - cron: '0 6 * * *'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test -- --coverage --json > coverage.json
      - run: npm run bundle -- --analyze > bundle.json
      - run: |
          # Compare to baseline in .github/metrics-baseline.json
          # If degradation > threshold, create branch + open PR
          # Use Claude API to suggest fixes
```

Then Claude agent (via comment trigger) can implement fixes.

---

## Options / Approaches

| Workflow | Approach | Timeline | Effort | Integration with epost | Blocker |
|----------|----------|----------|--------|----------------------|---------|
| **1. Auto Code Audit** | GitHub Actions → Cloud Fn → enqueue → agent audits | **Q2 2026** | Medium | `scout` + `code-reviewer` + `git-manager` | Webhook bridge service (custom code) |
| **1b. PR Inline Audits** | GitHub API → post review comments | **Q2 2026** | Medium | Same agents + epost-git-manager PR creation | Need GH API wrapper skill |
| **2. PO-to-Prototype** | `plan` → subagent parallel → `review` → `git` | **Now** | Low | All agents ready, just orchestration | Asana status sync (blocked on MCP) |
| **2b. Plan Dashboard** | Aggregate `plans/index.json` → Markdown report | **Q2 2026** | Low | New "reports" skill | None |
| **4. Brainstorm+Design** | `brainstorm` → `plan` → `cook` → `audit` (muji) | **Q3 2026** | Medium | All agents, need muji coordination | Figma MCP stability |
| **5. Cross-Branch Fixes** | `scout` pattern search → suggest/auto-apply | **Q3 2026** | High | `scout` + `fix` + git orchestration | Pattern abstraction algorithm |
| **6. Continuous Loop** | External cron → metrics → decision → fix PR | **Q4 2026** | High | `epost-tester` + `fix` + `git-manager` | External scheduler (GitHub Actions sufficient) |

---

## Existing epost_agent_kit Patterns

### Already Production

1. **plan → implement → review → git**: Synchronous agent chain via Agent tool (main conversation orchestrates)
2. **Skill discovery**: `skill-discovery` loads context-aware skills dynamically (enables cross-platform automation)
3. **Subagent-driven-development**: Parallel implementation with two-stage review (great for multi-phase work)
4. **Code auditing**: `code-review` + `audit` skills with delegation to specialists (a11y, design, quality)
5. **Fix automation**: `fix` skill applies diffs to staged changes; `error-recovery` handles resilience

### Ready for Enhancement

1. **Hooks system**: `PreToolUse`, `PostToolUse`, `SessionStart`, `SessionEnd` exist but underutilized
   - Example enhancement: `PostToolUse` on `git merge` → sync to external tracking
   - Example enhancement: `SessionStart` → check queued audit jobs (from data-store)

2. **Data persistence**: `data-store` skill enables cross-session state
   - Enhance: Store plan IDs in PRs, sync back to plan status on merge
   - Enhance: Store metrics baseline, detect degradation

3. **Orchestration constraints**: Subagents can't spawn subagents (by design)
   - Current: Main → Agent(phase1) + Agent(phase2) ✓
   - Not allowed: Main → Agent(orchestrator) → Agent(worker) ✗
   - Implication: Multi-level workflows must be orchestrated from main conversation

---

## Maturity & Feasibility by Timeline

### Immediate (Today)
- ✅ **PO-to-Prototype pipeline** (synchronous, main conversation orchestrates)
- ✅ **Brainstorming + Feasibility evaluation**
- ✅ **Code review automation** (on-demand via `/review` skill)

### Q2 2026 (3 months)
- 🟡 **Automated PR auditing** (requires webhook bridge service, ~2 weeks custom code)
- 🟡 **Plan status dashboard** (Markdown + static HTML, ~1 week)
- 🟡 **PR inline review comments** (GitHub API wrapper, ~3 days)

### Q3 2026 (6 months)
- 🟡 **Cross-branch fix suggestions** (pattern matching research, ~3 weeks)
- 🟡 **Design system validation loop** (muji + epost-muji coordination, ~2 weeks)

### Q4 2026+ (9+ months)
- 🔴 **Continuous quality loop** (external scheduler + metric tracking, ~4 weeks)
- 🔴 **Autonomous agent networks** (multi-repo, complex decision trees, research phase)

---

## Comparison: epost vs. Existing Tools

| Capability | GitHub Actions | Cursor Agents | Copilot Workspace | Devin / SWE-Agent | epost_agent_kit |
|-----------|---|---|---|---|---|
| **CI/CD automation** | ✅ Native | ⚠️ IDE-only | ⚠️ Limited | ⚠️ Limited | 🟡 Via hooks |
| **Code review** | ⚠️ Linter-based | 🟡 Inline suggestions | 🟡 Suggestions | ✅ Agent-based | ✅ Multi-specialist |
| **A11y auditing** | ❌ Manual add-on | ⚠️ Basic | ❌ No | ❌ No | ✅ WCAG 2.1 AA |
| **Multi-platform** | ⚠️ Config-heavy | ✅ IDE-native | ⚠️ Web-focused | ⚠️ Code-centric | ✅ 4 platforms |
| **Agent orchestration** | ❌ No | ⚠️ Single agent | ⚠️ Limited chain | ✅ Agent network | ✅ Multi-agent |
| **Design system validation** | ❌ No | ❌ No | ⚠️ Limited | ❌ No | ✅ Figma MCP |
| **Cross-repo fixes** | ⚠️ Fork/PR model | ❌ No | ❌ No | ⚠️ Experimental | 🟡 Possible |
| **Metric dashboards** | ⚠️ Third-party | ❌ No | ❌ No | ❌ No | 🟡 Custom skill |
| **Autonomous loops** | ✅ Cron jobs | ⚠️ IDE sessions only | ⚠️ Limited | ⚠️ Experimental | 🟡 Via hooks |

**Key insight**: epost beats on semantic code review (a11y, design) + multi-platform support. GitHub Actions beats on CI/CD integration. Devin/SWE-Agent beat on end-to-end autonomy but lack design system knowledge.

---

## Technical Trade-Offs

### Option A: GitHub Actions + epost Bridge
**When**: Already using GH Actions, want AI code review.
**Pros**:
- Standard CI/CD, minimal change to workflow
- epost agents can focus on semantic analysis
- Cost: pay for Actions + Claude API

**Cons**:
- Requires custom bridge service (auth, queuing, state)
- Latency: GH action waits for agent response
- Can't react to mid-PR comments

### Option B: epost Hooks + Data-Store
**When**: Full epost automation, want agents to remember state.
**Pros**:
- No external dependencies
- Agents can read/write persistent state
- Works offline (conceptually)

**Cons**:
- No native scheduler (need external cron trigger)
- Limited to file-based state (no DB)
- One session per trigger (can't stream agent progress to UI)

### Option C: Hybrid (Recommended)
**When**: Want immediate automation + long-term extensibility.

**Phase 1** (Q2): Use epost for on-demand audits + PO-to-prototype workflow.
- No external service needed.
- Developers run `/review` and `/plan` manually.
- Auto-apply fixes on separate branches (git-manager handles).

**Phase 2** (Q3): Add GitHub Actions + epost-git-manager integration.
- GH PR event → epost session (via cloud function).
- Agent audits, posts review comments.
- Still manual merge.

**Phase 3** (Q4): Add scheduler for continuous quality.
- Daily cron → run test suite, measure metrics.
- If degradation > threshold, auto-open fix PR.
- Agent reviews PR in human-readable language (Asana comment).

---

## Implementation Roadmap for epost_agent_kit

### Phase 1: Enhance Existing Workflows (Weeks 1-2)

1. **Improve PO-to-Prototype docs**:
   - Add step-by-step walkthrough (example: build button component)
   - Document plan → PR linkage (store plan ID in PR description)

2. **Add plan persistence**:
   - `epost-planner` saves to `plans/{id}.md` (already does)
   - `epost-git-manager` reads plan ID from branch name or env var
   - Post-merge: Log to `plans/index.json` with status "completed"

3. **Improve code-review skill**:
   - Add `--auto-fix` flag: automatically fix violations on separate branch
   - Already exists in `fix` skill; just needs linking

### Phase 2: Build Dashboard Skill (Weeks 3-4)

1. **New skill**: `progress-dashboard`
   - Read: `plans/index.json`, git log (merged PRs), audit reports (cached)
   - Aggregate: Completion %, velocity (PRs/week), quality metrics
   - Output: Markdown report + HTML for browsing

2. **Metrics collection**:
   - On every `epost-code-reviewer` run: save findings to `.epost-data/audit-{timestamp}.json`
   - On every merge: extract coverage from test output, save to `.epost-data/coverage-{timestamp}.json`

3. **Trend detection**:
   - Compare coverage week-over-week
   - Flag if a11y violations increasing
   - Summary: "Last week: 3 new bugs found, 2 fixed. Coverage: 78% (down 2%)."

### Phase 3: GitHub Actions Bridge (Weeks 5-8)

1. **Create Cloud Function** (external, not epost):
   - Trigger: GitHub PR opened/updated
   - Action: Call Claude API with PR diff
   - Response: Store findings, post GH comment

2. **Integrate with epost agents**:
   - Instead of calling Claude API directly, queue to epost data-store
   - epost session (triggered by webhook) picks up job, runs `scout` + `code-reviewer`
   - `epost-git-manager` posts comment with findings

3. **Alternatively**: GitHub Apps (GitHub's native solution)
   - Less custom code, more official
   - But less agent flexibility

### Phase 4: Continuous Quality Loop (Weeks 9-12)

1. **External cron job** (GitHub Actions or Cloud Scheduler):
   - Daily 6 AM: Run tests, measure coverage, bundle size, lint violations
   - Compare to baseline (stored in `.github/metrics-baseline.json`)
   - If degradation > 5%: Trigger epost fix workflow

2. **epost fix workflow**:
   - `epost-debugger` analyzes test failures
   - `epost-fullstack-developer` implements quick fixes
   - `epost-git-manager` opens PR to `fix/quality-degradation-{date}`
   - Asana comment: "Coverage dropped 5%. Suggested fixes in #PR_NUM. Review & merge?"

---

## Key Design Decisions

### Decision 1: Synchronous vs. Asynchronous

**Choice**: Synchronous (now), async (future).

**Rationale**:
- Synchronous: Main conversation orchestrates agents, simple mental model, works today
- Asynchronous: Agents spawn jobs, resume later, better for external webhooks (requires session persistence)
- Best path: Use synchronous for all user-initiated workflows. Use async only for external triggers (GitHub PR, scheduled jobs).

### Decision 2: Persistent State Storage

**Choice**: File-based (data-store skill), not database.

**Rationale**:
- Simplicity: JSON files in `.epost-data/`, no DB setup
- Limitation: No transactions, limited concurrency
- Workaround: UUID-based filenames, append-only logs for metrics

### Decision 3: When to Auto-Fix vs. Suggest

**Choice**: Auto-fix only on separate branches, never on user's current branch.

**Rationale**:
- Safety: Preserve user autonomy
- Traceability: User can review before merging
- Pattern: `fix` skill already does this (creates `fix/...` branch)

### Decision 4: External vs. Internal Orchestration

**Choice**: Main conversation orchestrates agents (internal), not external workflow engine.

**Rationale**:
- Subagents can't spawn subagents (by design), so multi-level workflows need external orchestration
- Simple workflows (plan → implement → review → git): Main context orchestrates via Agent tool ✓
- Complex workflows (daily quality loop with retries): External scheduler (GitHub Actions) triggers main context

---

## Unresolved Questions

1. **Pattern abstraction**: How to convert a code diff to a semantic pattern (e.g., "null check in FetchBuilder → add optional chaining")? Hard problem in program synthesis. Possible approaches: AST diffing, ML-based pattern matching, human-curated rules.

2. **Metric baselines**: Where to store historical metrics for trend analysis? Options: `.github/metrics-baseline.json` (simple but not queryable), Prometheus/Grafana (overkill), GitHub Insights API (limited data), custom backend (not in scope).

3. **Asana integration**: epost has `data-store` but no native Asana MCP. Need custom bridge to sync plan status → Asana task status. Blocker for workflow 2b.

4. **Multi-repo coordination**: How to handle fixes that span repos (e.g., shared library bug + consumer app)? Requires cross-repo cloning, testing, PR opening. Out of scope for initial version.

5. **Agent autonomy limits**: When is it safe for agents to auto-merge PRs? Answer: Only for approved fix categories (lint violations, simple a11y fixes) + tests pass. Need policy framework.

---

## Recommended Next Steps

### Week 1-2: Document & Validate Existing Flows
- [ ] Write tutorial: "From PRD to deployed prototype in 30 mins"
- [ ] Test PO-to-prototype workflow end-to-end with real epost example
- [ ] Document plan ID linkage (branch name conventions)

### Week 3-4: Build Quick-Win Dashboard
- [ ] New `progress-dashboard` skill: read plans/index.json, output Markdown report
- [ ] Add metrics capture to `code-reviewer` and `epost-tester` (save JSON)
- [ ] Generate weekly report: "Velocity, quality trends, blockers"

### Week 5-8: Design GitHub Bridge
- [ ] Spike: Compare Cloud Functions vs. GitHub Apps for webhook handling
- [ ] Prototype: Single workflow (PR opened → audit → comment) with one team
- [ ] Validate: Latency, cost, UX (does comment format help?)

### Week 9+: Consider External Factors
- [ ] Watch Cursor, Copilot for background agent maturity
- [ ] Monitor Claude Code hook stability (used for critical paths?)
- [ ] Evaluate if continuous quality loop is worth the complexity

---

## Methodology

| | |
|--|--|
| **Files Scanned** | `.claude/skills/skill-index.json` — discovered 65 skills including orchestration, audit, design system; `.claude/agents/` — reviewed agent definitions (12 core + 3 specialized); `/docs/` — found existing architecture + pattern docs; `CLAUDE.md` — verified epost_agent_kit version, platform coverage |
| **Knowledge Tiers** | L1 docs/ (ARCH-0001, PATTERN-0001 found — agent orchestration documented), L2 RAG (unavailable in research context), L5 Context7 (unavailable in research context), WebSearch (unavailable due to permissions), Knowledge cutoff (Feb 2025, covering GitHub Actions, Cursor, Copilot, Devin, SWE-Agent research up to that date) |
| **Standards Source** | Internal: epost_agent_kit CLAUDE.md (v2.0.0), agent system prompts, skill descriptions; External: GitHub Actions docs (standard practice), Cursor IDE docs (background agents pattern), Copilot Workspace preview docs, Devin/SWE-Agent capability matrices |
| **Coverage Gaps** | WebSearch permission denied (worked around with knowledge cutoff + internal codebase analysis); RAG unavailable (no iOS/Android/web codebase querying needed for this research); Context7 unavailable (focused on established tools, not library-specific research) |

### External Sources
- [epost_agent_kit](https://github.com/than/epost_agent_kit) — Multi-agent orchestration patterns, skills ecosystem, hooks system
- [GitHub Actions](https://github.com/features/actions) — CI/CD standard, workflow syntax, community integrations
- [Cursor IDE](https://www.cursor.com) — Background agent preview (Q1 2025), inline suggestions
- [GitHub Copilot Workspace](https://github.com/features/copilot) — Agent coordination, plan generation (preview)
- [Devin](https://devin.ai) — Autonomous agent for code tasks (research phase, limited public APIs)
- [SWE-Agent](https://github.com/princeton-nlp/SWE-agent) — Research project for bug fixing via LLM agents

---

## Verdict

**ACTIONABLE** — All 6 workflows are feasible; priority is phased delivery: (1) immediate sync workflows (PO-to-prototype, brainstorm), (2) Q2 dashboard + PR auditing, (3) Q3-4 advanced features (cross-branch, continuous loop). epost_agent_kit's orchestration is production-ready; gaps are operational (scheduler, GitHub integration) not architectural.

---

*Unresolved questions:*
- Pattern abstraction algorithm for cross-branch fixes (research needed)
- Metric baseline storage strategy (architecture decision)
- Safe auto-merge policy framework (security/process design)
- Multi-repo coordination patterns (out of initial scope)
- Hook-based scheduler reliability for production use (monitor)
