# Orchestration Protocol

Rules for agent delegation, context passing, execution modes, and escalation.

## Context Passing

Every subagent invocation MUST include:

```
Task: [specific task description]
Work context: [project path]
Reports: [plans/reports/ path]
Plans: [plans/ path]
Platform: [detected platform or "all"]
Active plan: [plan path if exists, or "none"]
```

Hooks inject most of this automatically. Agents must verify context is present before starting work.

## Delegation Config

### Who Delegates
- **epost-project-manager** — top-level router, delegates to any agent
- **epost-planner** — delegates to researchers (parallel fan-out)
- **epost-fullstack-developer** — delegates to subagents per phase (via `subagent-driven-development`)
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

For plans with 3+ independent tasks, use the `subagent-driven-development` skill:

```
Per task:
  1. Dispatch implementer subagent (fresh context + task spec)
  2. Spec review subagent (does code match spec?)
  3. Quality review subagent (code quality check)
  4. Fix loop (max 3 iterations if review fails)
  5. Mark task done, move to next
```

This gives each task a clean context window and two-stage review.

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

- Location: `plans/reports/{agent}-{date}-{slug}.md`
- Naming: kebab-case, descriptive, self-documenting
- Content: concise, bullets over paragraphs, unresolved questions at end
- Max: 150 lines (research reports), 80 lines (status reports)

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
