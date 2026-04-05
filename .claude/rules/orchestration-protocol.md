# Orchestration Protocol

Rules for agent delegation, context passing, execution modes, and escalation.

## Context Passing

Every subagent invocation MUST include:

```
Task: [specific task description]
Work context: [project path]
Reports: [reports/ path]
Plans: [plans/ path]
Platform: [detected platform or "all"]
Active plan: [plan path if exists, or "none"]
```

Hooks inject most of this automatically. Agents must verify context is present before starting work.

### Skill Injection at Spawn Time

Orchestrator detects platform from surface signals (file extensions, active plan, user hint).
When spawning an agent, inject relevant platform/domain skills in the prompt body — not frontmatter.

Example: `Platform: web. Apply web-frontend and web-nextjs patterns.`

Agents own their default skills (via `skills:` frontmatter). Orchestrator adds extras at spawn time.
Platform-specific agents (muji, a11y) keep platform skills pre-wired — no injection needed.

### Output Contract

Skill output format is identical whether executed inline or via agent spawn.
Never vary report structure, status blocks, or file naming based on execution mode.
Execution mode is an implementation detail invisible to the user.

## Delegation Config

### Who Delegates
- **epost-project-manager** — top-level router, delegates to any agent
- **epost-planner** — delegates to researchers (parallel fan-out)
- **epost-fullstack-developer** — delegates to subagents per phase (via `subagents-driven`)
- **Any agent** — can delegate to Explore subagent for codebase search

### Delegation Rules
1. Include full context (see above)
2. One clear task per subagent (no multi-intent delegation)
3. Subagent gets fresh context — don't assume it knows prior conversation
4. Wait for subagent result before next step (unless parallel-safe)
5. Review subagent output before presenting to user

## Execution Modes

### Smart Detection (Default)

Analyze task to auto-select mode:

| Signal | Mode |
|---|---|
| Plan has phases with non-overlapping file ownership | Parallel |
| Plan has sequential dependencies between phases | Sequential |
| 3+ independent tasks in plan | Subagent-driven (per-task dispatch) |
| Single task or tightly-coupled work | Direct execution (no subagents) |
| Cross-platform work (iOS + Android + Web) | Parallel (one agent per platform) |

### Force Override
- `--parallel` — force parallel execution (user confirms file ownership is safe)
- `--sequential` — force sequential (when uncertain about conflicts)

### Parallel Execution Rules
1. Extract file ownership from phase files
2. Verify NO overlap between any two phases
3. If overlap → warn user, suggest resolution, or fall back to sequential
4. Each subagent works in isolation — no shared state
5. Reviewer checks for ownership violations after all phases complete

## Subagent-Driven Development Integration

For plans with 3+ independent tasks, use the `subagents-driven` skill:

```
Per task:
  1. Dispatch implementer subagent (fresh context + task spec)
  2. Spec review subagent (does code match spec?)
  3. Quality review subagent (code quality check)
  4. Fix loop (max 3 iterations if review fails)
  5. Mark task done, move to next
```

This gives each task a clean context window and two-stage review.

## Consensus-Voting Pattern (Advanced)

For high-stakes decisions where no clear best practice exists, use consensus voting across independent agents.

**When to use:**
- Architecture tradeoffs with significant long-term impact
- Multi-perspective analysis where domain bias matters
- Design decisions where feasibility, performance, and maintainability conflict

**When NOT to use:**
- Single-option tasks (only one viable path)
- Time-sensitive fixes (clear best practice exists)
- CRUD or routine implementation work

**Flow** (all dispatched from main context — never from within a subagent):

```
Main context → [Agent tool] → brainstormer   (generates 3 independent options)
Main context → [Agent tool] → researcher     (evaluates options against criteria)
Main context → [Agent tool] → planner        (selects winner, writes implementation spec)
```

**Evaluation criteria template:**

| Dimension | Weight | What to assess |
|-----------|--------|----------------|
| Feasibility | High | Can we build it given current constraints? |
| Maintenance | High | How hard is ongoing upkeep? |
| Performance | Medium | Does it meet latency/throughput requirements? |
| Alignment | High | Does it match our architecture patterns? |
| Risk | Medium | What can go wrong, and how bad is it? |

**Output**: planner produces a spec with the selected option, rationale, and rejected alternatives. The spec becomes the input for the next implementation phase.

**Constraint**: Respects subagent spawn constraint — all three agents are dispatched independently from the main context, not chained.

## Subagent Spawn Constraint

Subagents (agents spawned via Agent tool) **cannot spawn further subagents**. Neither Agent tool nor Task tool is available in subagent context.

**Implication**: Multi-agent workflows (hybrid audit, parallel research) must be orchestrated from the **main conversation context**, not from within a subagent.

**Pattern**:
```
Main context → [Agent tool] → specialist-1 (independent subagent)
Main context → [Agent tool] → specialist-2 (independent subagent)
Main context reads both results and merges
```

**Anti-pattern** (will fail):
```
Main context → [Agent tool] → agent-A (subagent)
                                 → [Agent tool] → agent-B  ❌ BLOCKED
```

Skills that orchestrate multi-agent workflows (e.g., `audit/SKILL.md` hybrid mode) must NOT use `context: fork` — they run inline in the main context.

## Skill Execution Mode

When you load a skill, check its frontmatter before executing:

| Frontmatter | How to execute |
|-------------|---------------|
| `context: fork` + `agent: {name}` | **MUST** spawn `{name}` via Agent tool **with skill arguments**. Do NOT execute inline. Do NOT use raw Bash. |
| `context: inline` | Execute the skill content directly in the main conversation. |
| No `context` field | Execute inline (default). |

**Iron Law**: A skill with `context: fork` is a dispatch instruction, not a script to run yourself. Seeing `context: fork` means: stop, spawn the named agent, pass it the task **and all arguments**.

### Argument Forwarding

When dispatching a `context: fork` agent, the Agent tool prompt **MUST** include:

```
Task: Execute /{skill-name} {arguments}
Skill: {skill-name}
Arguments: {raw argument string from Skill invocation}
```

If no arguments were provided, state `Arguments: none — use auto-detection`.

The skill name and arguments are what differentiate `/docs --init` from `/docs --migrate`. Dropping them causes the agent to guess or greet — the **#1 cause of silent skill failures**.

**Common failure mode**: Skipping the Skill tool entirely and running raw Bash/shell commands instead. This bypasses routing, skips build gates, skips all skill-level safety checks. Never do this for git, research, planning, or any workflow that has a dedicated agent.

## Context Budget

**Performance variance breakdown** (quantified evidence — not intuition):
- Token usage: **80%** of agent performance variance
- Tool call count: **~10%** of variance
- Model choice: **~5%** of variance

→ If an agent underperforms, fix token bloat first. Upgrading the model is almost never the answer.

**Thresholds — act on these numbers:**

| Context % | Action |
|-----------|--------|
| < 70% | Normal — continue |
| 70–80% | Plan compaction — identify what to compress |
| 80–90% | Execute compaction now |
| > 90% | Immediate action — compact or start new session |

**Usage limits (5-hour rolling window):**
| Usage % | Action |
|---------|--------|
| < 70% | Normal |
| 70–90% | Reduce parallelization, use Haiku for lighter tasks |
| > 90% | Essential tasks only — wait for reset |

**Multi-agent cost:** ~15x single-agent token baseline. Justify only for context isolation, not for "role-play" or agent personality. The ~15x cost pays off when work genuinely can't fit in one context window.

**Tool count target:** Keep total tools under 20. Evidence: reducing 17→2 tools yielded 3.5x faster execution, 37% fewer tokens, +20% task success rate. Fewer, well-described tools beat many narrow tools.

**Anchored Iterative compression template** (use when context > 80%):

```markdown
## Session Intent
Original goal: [preserved verbatim]

## Files Modified
- path/to/file.ts: [what changed]

## Decisions Made
- [decision]: [rationale]

## Current State
[one paragraph summary of where things stand]

## Next Steps
1. [next action]
```

**Artifact trail** — the most commonly missed context discipline: In long sessions, explicitly track every file created, modified, read, and every function/variable name introduced. This is the weakest point in agent context management (scores 2.2–2.5/5.0 in evaluations). If you're in a long task, maintain a running artifact list.

## Subagent Status Protocol

Every subagent **MUST** end its response with a structured status block:

```
**Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
**Summary:** [1–2 sentence summary of what was completed]
**Concerns/Blockers:** [if applicable — omit if DONE]
```

### Controller Handling Rules

| Status | Controller Action |
|--------|------------------|
| `DONE` | Proceed to next step |
| `DONE_WITH_CONCERNS (correctness)` | Address concern before continuing |
| `DONE_WITH_CONCERNS (tech debt)` | Note for future, proceed |
| `BLOCKED` | Provide context / simplify task / escalate — do NOT retry same approach |
| `NEEDS_CONTEXT` | Provide missing context → re-dispatch |
| 3+ failures on same task | Escalate to user — never retry blindly |

### Context Isolation Principle

Every subagent invocation MUST be self-contained. Use this prompt template:

```
Task: [specific task description]
Files to modify: [list]
Files to read for context: [list]
Acceptance criteria: [list]
Constraints: [relevant constraints]
Plan reference: [phase file path if applicable]
Work context: [project path]
Reports: [reports path]
```

**Anti-patterns:**

| ❌ Vague | ✅ Explicit |
|---------|-----------|
| "Continue from where we left off" | "Implement X per spec in phase-02.md" |
| "Fix the issues we discussed" | "Fix null check in auth.ts:45" |
| "You know what to do" | "Add the missing error handler to login.ts" |

Subagent gets fresh context — never assume it knows prior conversation.

## Escalation Rules

| Situation | Action |
|---|---|
| Test failure | debugger investigates → fix → re-test (max 3 loops) |
| Review rejection | implement fix → re-review (max 3 loops) |
| 3 consecutive failures | Escalate to user with findings summary |
| Ambiguous request | Ask user (max 1 question) |
| Multi-intent request | Route to project-manager for decomposition |
| File ownership conflict | Ask user to resolve before parallel execution |
| Build/CI failure | Route to debugger with error logs |

## Report Output

See `code-review/references/report-standard.md` for full report format, naming, size limits, and verdict values.

## Docs Impact Assessment

After every implementation completion, the executing agent MUST state docs impact explicitly:

```
Docs impact: none | minor | major
```

| Level | Criteria | Action |
|-------|----------|--------|
| `none` | Internal refactor, logic-only change, no behavior change | No docs update needed |
| `minor` | New config option, renamed param, small API delta | Agent updates inline |
| `major` | New public feature, behavior change, new API surface, removed capability | Trigger `epost-docs-manager` |

**When to trigger docs-manager**: docs impact = `major` only. Minor updates can be made inline by the implementing agent.

**Integration**: The `cook` finalize step (5b) and `/git --ship` pipeline both check docs impact before closing.

## Commit Convention

| Type | When |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code restructuring (no behavior change) |
| `test:` | Tests only |
| `chore:` | Build, config, tooling |

No "Generated with Claude Code" or AI attribution in commits or PRs.

## Agent Dispatch

Always delegate via Agent tool. Never handle these inline in the main context.

| Intent | Dispatch to | Never |
|--------|-------------|-------|
| Plan / Design / Spec | `epost-planner` | Built-in `Plan` subagent_type (read-only, no Write) |
| Git (commit, push, PR, ship) | `epost-git-manager` | Inline git commands |
| Build / Implement | `epost-fullstack-developer` | Inline code writing |
| Fix / Debug | `epost-debugger` | Inline diagnosis |
| Test | `epost-tester` | Inline test runs |
| Research | `epost-researcher` | Inline web search |
| Docs | `epost-docs-manager` | Inline documentation |

**Critical**: Built-in `Plan` subagent_type has NO Write/Edit tools. Always use `epost-planner`.
