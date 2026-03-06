# PLAN-0055: Agent Report Templates

**Status:** `in-progress`
**Branch:** `master`
**Research:** `plans/reports/research-260305-2359-agent-output-inconsistencies.md`

---

## ⚠️ Prerequisite: Phase 0 (Agent Delegation) must complete before templates matter

Templates are pointless if agents aren't spawned. The root cause of inline execution:
- `plan` skill has `context: fork, agent: epost-planner` but no enforced delegation instruction in skill body
- `research` skill routes to `agent: Explore` (built-in), not `epost-researcher`
- CLAUDE.md routing says "route to X" but doesn't say "use Task tool to spawn X"
- Main Claude reads skills and runs inline instead of delegating

Phase 0 fixes this. Phases 1–7 (templates) follow after.

---

## Goal

Establish a consistent output standard across all agent reports:
- Common header block (Date, Agent, Plan, Status) with unified emoji + field set
- Executive Summary as first section, always
- Verdict line at end (one word: PASS / APPROVE / COMPLETE / BLOCKED)
- Unresolved questions footer always present

Plus 4 per-skill report templates embedded in skill references — loaded automatically when the skill activates.

---

## Common Report Standard

### Anatomy (all report types)

```markdown
# {AgentType}: {Title}

**Date**: YYYY-MM-DD HH:mm
**Agent**: {agent-name}
**Plan**: `plans/{dir}/plan.md`     ← omit if no active plan
**Status**: ✅ COMPLETE | ⚠️ PARTIAL | ❌ FAILED | 🔄 IN PROGRESS

---

## Executive Summary

2–3 sentences. What was done, what was found, what the outcome is.
<200 words.

---

{Body — agent-specific sections}

---

## Verdict

**{WORD}** — one-line justification.

---

*Unresolved questions:*
- Question (or "None")
```

### Status emoji — standardized

| Symbol | Meaning | When to use |
|---|---|---|
| ✅ COMPLETE | All work done, no blockers | Default success |
| ⚠️ PARTIAL | Done with caveats or skipped items | Partial execution |
| ❌ FAILED | Could not complete, blocker hit | Hard failure |
| 🔄 IN PROGRESS | Mid-execution report | Phase checkpoints |

### Verdict word — per agent type

| Agent | Valid verdicts |
|---|---|
| epost-planner | `READY` `NEEDS-RESEARCH` `BLOCKED` |
| epost-researcher | `ACTIONABLE` `INCONCLUSIVE` `NEEDS-MORE` |
| epost-code-reviewer | `APPROVE` `FIX-AND-RESUBMIT` `REDESIGN` |
| epost-tester | `PASS` `FAIL` `PARTIAL` |

---

## Phase 0 — Fix agent delegation (prerequisite)

**Problem:** `context: fork` in skill frontmatter is metadata only — nothing tells main Claude to USE the Task tool. Main Claude reads the skill and executes inline.

### 0a. Add delegation instruction to `plan` skill

**File:** `packages/core/skills/plan/SKILL.md`

Add at the top of the skill body (before existing content):

```markdown
## Delegation — REQUIRED

This skill MUST run via the `epost-planner` agent, not inline.

**When `/plan` or planning intent is detected:**
1. Use the **Task tool** to spawn `epost-planner`
2. Pass the full user request + active context (branch, plan dir, CWD)
3. Do NOT execute planning steps inline in the main conversation
```

### 0b. Fix `research` skill — route to `epost-researcher`, not `Explore`

**File:** `packages/core/skills/research/SKILL.md`

- Change frontmatter: `agent: Explore` → `agent: epost-researcher`
- Add delegation instruction at top:

```markdown
## Delegation — REQUIRED

This skill MUST run via the `epost-researcher` agent, not inline.

**When research intent is detected:**
1. Use the **Task tool** to spawn `epost-researcher`
2. Pass the research topic + scope + report path (`plans/reports/research-{date}-{slug}.md`)
3. Do NOT conduct research inline in the main conversation
```

### 0c. Update CLAUDE.md smart routing — add Task tool instruction

**File:** `packages/core/CLAUDE.snippet.md` (source of truth for CLAUDE.md routing section)

Update the Intent → Skill Map routing entries for `plan` and research to make delegation explicit:

```markdown
| Build | cook, implement... | Spawn `epost-fullstack-developer` via Task tool |
| Fix   | fix, broken...     | Spawn `epost-debugger` via Task tool |
| Plan  | plan, design...    | Spawn `epost-planner` via Task tool (`/plan` skill) |
| Research | research...    | Spawn `epost-researcher` via Task tool |
```

Also add a global routing rule:
```markdown
> When routing to a skill with `context: fork`: use the **Task tool** to spawn the
> skill's `agent:` value. Never execute fork-context skills inline.
```

### 0d. Multi-intent routing: "research + plan" → epost-project-manager

**File:** `packages/core/CLAUDE.snippet.md`

Add to Multi-Step Workflow Detection:
```markdown
- Research then plan ("research X, then plan") → `epost-project-manager` →
  spawns epost-researcher (report) → epost-planner reads report → creates plan
```

### Success criteria for Phase 0:

- [ ] `/plan {topic}` → Task tool spawns `epost-planner`; report appears in `plans/reports/`
- [ ] "research {topic}" → Task tool spawns `epost-researcher`; report appears in `plans/reports/`
- [ ] "research + plan" → routes to epost-project-manager → sequential agent delegation
- [ ] Main Claude never executes plan or research steps inline

---

## Phase 1 — Common standard document

**File:** `packages/core/skills/core/references/report-standard.md`

Add to this file:
- The anatomy template above
- Status emoji definitions
- Per-agent verdict word table
- Link to per-skill templates

**Referenced by:** `packages/core/skills/core/SKILL.md` — add to its references list so all agents load it.

---

## Phase 2 — Plan report template

**File:** `packages/core/skills/plan/references/report-template.md`

```markdown
# epost-planner: {Plan Title}

**Date**: {date}
**Agent**: epost-planner
**Plan**: `plans/{dir}/plan.md`
**Status**: ✅ COMPLETE

---

## Executive Summary

{2-3 sentences: what was planned, scope, approach}

---

## Plan Details

- **Directory**: `plans/{dir}/`
- **Phases**: {N} phases
- **Effort**: {estimate}
- **Platforms**: {web | ios | android | backend | kit | all}

## Key Dependencies

- {dep 1}
- {dep 2}

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| {risk} | High/Med/Low | {mitigation} |

---

## Verdict

**{READY | NEEDS-RESEARCH | BLOCKED}** — {one-line reason}

---

*Unresolved questions:*
- {question or "None"}
```

**Wire to:** `packages/core/agents/epost-planner.md` — add `Load references/report-template.md when writing plan summary report` instruction.

---

## Phase 3 — Research report template

**File:** `packages/core/skills/research/references/report-template.md`

```markdown
# epost-researcher: {Topic}

**Date**: {date}
**Agent**: epost-researcher
**Scope**: {1-line topic description}
**Status**: ✅ COMPLETE

---

## Executive Summary

{2-3 sentences: what was researched, key finding, recommendation}

---

## Findings

### {Finding 1}
{evidence, source, relevance}

### {Finding 2}
{evidence, source, relevance}

## Options / Approaches

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| {option} | | | |

## Sources

- [{title}]({url or file path})

---

## Verdict

**{ACTIONABLE | INCONCLUSIVE | NEEDS-MORE}** — {one-line reason}

---

*Unresolved questions:*
- {question or "None"}
```

**Wire to:** `packages/core/agents/epost-researcher.md` — replace current freeform output guidance with template reference.

---

## Phase 4 — Code review report template

**File:** `packages/core/skills/code-review/references/report-template.md`

```markdown
# epost-code-reviewer: {Scope}

**Date**: {date}
**Agent**: epost-code-reviewer
**Plan**: `plans/{dir}/plan.md`     ← omit if standalone review
**Status**: ✅ COMPLETE

---

## Executive Summary

{2-3 sentences: what was reviewed, main issue, overall quality signal}

---

## Score

**{X.X}/10** — {category breakdown: correctness, security, performance, tests, style}

## Findings

| ID | Severity | File:Line | Issue | Fix |
|---|---|---|---|---|
| CR-001 | 🔴 Critical | `path/file.ts:42` | {issue} | {fix} |
| CR-002 | 🟠 High | | | |
| CR-003 | 🟡 Medium | | | |
| CR-004 | ⚪ Low | | | |

## Severity Summary

| Critical | High | Medium | Low |
|---|---|---|---|
| {N} | {N} | {N} | {N} |

---

## Verdict

**{APPROVE | FIX-AND-RESUBMIT | REDESIGN}** — {one-line reason}

---

*Unresolved questions:*
- {question or "None"}
```

**Wire to:** `packages/core/skills/code-review/SKILL.md` — add output format section referencing the template.

---

## Phase 5 — Test/validation report template

**File:** `packages/core/skills/test/references/report-template.md`

```markdown
# epost-tester: {Scope}

**Date**: {date}
**Agent**: epost-tester
**Plan**: `plans/{dir}/plan.md`     ← omit if standalone test run
**Status**: ✅ COMPLETE

---

## Executive Summary

{2-3 sentences: what was tested, pass rate, critical failures}

---

## Results

| Check | Result | Evidence |
|---|---|---|
| {check name} | ✅ PASS | {file:line or test name} |
| {check name} | ❌ FAIL | {error message} |
| {check name} | ⚠️ SKIP | {reason} |

## Coverage (if applicable)

- **Overall**: {X}%
- **Critical paths**: {X}%
- **Uncovered**: `{file}` lines {N}–{N}

## Failures Detail

### {FAIL-001}: {Check name}
- **Expected**: {behavior}
- **Actual**: {behavior}
- **Fix**: {suggestion}

---

## Verdict

**{PASS | FAIL | PARTIAL}** — {one-line reason}

---

*Unresolved questions:*
- {question or "None"}
```

**Wire to:** `packages/core/skills/test/SKILL.md` — add output format section.

---

## Phase 6 — ClaudeKit-inspired plan templates

Create `plans/templates/` with plan-type templates (what to PLAN, not what to REPORT). Inspired by ClaudeKit's `plans/templates/` but adapted to epost_agent_kit conventions.

**Files to create:**

| File | When to use |
|---|---|
| `plans/templates/feature-plan.md` | New feature or capability |
| `plans/templates/bug-fix-plan.md` | Bug investigation + fix |
| `plans/templates/refactor-plan.md` | Code quality / architecture cleanup |
| `plans/templates/research-plan.md` | Technical research before implementation |
| `plans/templates/README.md` | Selection guide + token budget guidance |

Key differences from ClaudeKit:
- Use epost_agent_kit plan naming format (`{date}-{slug}/plan.md`)
- Include platform detection section (`web | ios | android | backend | kit`)
- Reference agent handoff protocol (planner → developer → reviewer)
- Token budget: `plan.md` target ≤80 lines (already in planner rules)

---

## Phase 7 — Wire agents to templates

Update agent definition files to include explicit template reference:

| Agent file | Change |
|---|---|
| `packages/core/agents/epost-planner.md` | Add: "Use report format from `plan/references/report-template.md`" |
| `packages/core/agents/epost-researcher.md` | Add: "Use report format from `research/references/report-template.md`" |
| `packages/core/agents/epost-code-reviewer.md` | Add: "Use report format from `code-review/references/report-template.md`" |
| `packages/core/agents/epost-tester.md` | Add: "Use report format from `test/references/report-template.md`" |

---

## File Manifest

**Created:**
- `packages/core/skills/core/references/report-standard.md`
- `packages/core/skills/plan/references/report-template.md`
- `packages/core/skills/research/references/report-template.md`
- `packages/core/skills/code-review/references/report-template.md`
- `packages/core/skills/test/references/report-template.md`
- `plans/templates/feature-plan.md`
- `plans/templates/bug-fix-plan.md`
- `plans/templates/refactor-plan.md`
- `plans/templates/research-plan.md`
- `plans/templates/README.md`

**Modified:**
- `packages/core/skills/core/SKILL.md` — reference `report-standard.md`
- `packages/core/skills/code-review/SKILL.md` — output format section
- `packages/core/skills/test/SKILL.md` — output format section
- `packages/core/agents/epost-planner.md` — template reference
- `packages/core/agents/epost-researcher.md` — template reference
- `packages/core/agents/epost-code-reviewer.md` — template reference
- `packages/core/agents/epost-tester.md` — template reference

---

## Phases Checklist

- [ ] **Phase 0** — Fix agent delegation (plan skill, research skill, CLAUDE.md routing)
- [ ] Phase 1 — `report-standard.md` + wire to core SKILL.md
- [ ] Phase 2 — Planner report template + wire agent
- [ ] Phase 3 — Researcher report template + wire agent
- [ ] Phase 4 — Code review report template + wire skill
- [ ] Phase 5 — Test report template + wire skill
- [ ] Phase 6 — plans/templates/ (ClaudeKit-inspired plan templates)
- [ ] Phase 7 — Wire all 4 agent .md files

---

## Success Criteria

- [ ] All 4 agent types produce reports with: standard header, exec summary, verdict line, unresolved Qs
- [ ] Status emojis are consistent: ✅ ⚠️ ❌ 🔄 — no freeform variants
- [ ] Verdict is always the last section before unresolved questions
- [ ] `plans/templates/` has 4 plan templates + README
- [ ] Agent definitions explicitly reference their report template
- [ ] Existing reports remain unchanged (templates apply to NEW output only)

---

## Key Design Decisions

- **Skill references are the load mechanism** — template files in `references/` are loaded automatically when the skill activates; no separate instruction needed in agent prompt
- **Common standard in core** — `report-standard.md` is loaded by the core skill which all agents inherit; establishes the shared vocabulary once
- **No retrofit of old reports** — 52 existing reports stay as-is; templates apply forward only
- **ClaudeKit plan templates are PLAN files** (what to do) not REPORT files (what was done) — kept separate in `plans/templates/`
