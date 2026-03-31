# Superpower Planning Skills — Comprehensive Research Report

**Date**: 2026-03-11
**Agent**: epost-researcher
**Scope**: Analysis of 4 core planning skills from skills.sh/sipengxie2024/superpower-planning
**Status**: ACTIONABLE

---

## Executive Summary

The superpower-planning skill suite (17 skills total, 4 analyzed here) introduces a **filesystem-as-memory** pattern using `.planning/` directories as persistent, session-spanning working memory. The core innovation is **persistent discovery capture**: every agent decision, error, finding is logged to markdown files (`findings.md`, `progress.md`) instead of lost to context limits.

**Key differentiators from epost_agent_kit patterns:**
1. **Two-action dispatch rule**: After every 2 reads/searches, save discoveries immediately (we don't have this systematic rule)
2. **Per-agent planning directories**: Each subagent role gets `.planning/agents/{role}/` for persistent role-specific findings (we aggregate into task-level findings)
3. **Mandatory two-stage review gates**: Spec compliance THEN code quality (we combine in one review)
4. **Historical archive checking**: Explicitly search `.planning/archive/` before planning new work (we rely on docs/ discovery)

**Applicability to epost_agent_kit**: Medium-high. Planning-foundation and writing-plans align well with our planner. Subagent-driven review gates could strengthen our `receiving-code-review` and `verification` disciplines. Executing-plans batch model differs from our parallel session approach but has merit for architect checkpoints.

---

## Skill 1: planning-foundation

### Full Content Extract

**Purpose**: Establishes persistent context management using markdown files as "working memory on disk"—filesystem serves as unlimited persistent storage while context window functions as volatile RAM.

**Directory Structure**:
```
.planning/                         # Gitignored, ephemeral session state
├── findings.md                    # Knowledge base
├── progress.md                    # Operations log
└── agents/                        # Per-role subdirectories
    ├── implementer/
    │   ├── findings.md
    │   └── progress.md
    ├── spec-reviewer/
    │   ├── findings.md
    │   └── progress.md
    └── [role]/
```

**Key Files & Purposes**:
- **findings.md** — Technical discoveries, architectural insights, rejected alternatives, edge cases, debugging root causes. Updated whenever something important is learned.
- **progress.md** — Task status via dashboard, phase transitions, file modifications, error logs with retry attempts, test results. Updated after any status change or action.

### Critical Rules

**Rule 1: Create Planning Directory First**
Never start complex tasks without establishing `.planning/`. Permanent plans belong in `docs/plans/`.

**Rule 2: The 2-Action Dispatch Rule** (NOVEL)
"After every 2 read/search/explore operations, IMMEDIATELY save to the appropriate file by content type."
- Content categorizes as discoveries (→ findings.md) or status/actions (→ progress.md)
- Prevents lost discoveries when context switches
- Enforces discipline of externalized thinking

**Rule 3: Read Before Deciding**
Refresh goal context by reviewing plan files before major decisions.

**Rule 4: Update After Acting**
Mark phase completions, log encountered errors, note modified files.

**Rule 5: Log ALL Errors**
Maintain error tables tracking attempts and resolutions to prevent repetition.

**Rule 6: Never Repeat Failures**
Track what was tried; mutate the approach on subsequent attempts.

### Error Recovery Protocol

| Attempt | Action |
|---------|--------|
| 1 | Diagnose root cause and apply targeted fix |
| 2 | Try alternative methods if same error recurs; never repeat exact failing action |
| 3 | Question assumptions broadly; search for different solutions; consider updating plan |
| 3+ | Escalate to user with explanation of attempts and specific errors encountered |

### Read vs Write Decision Matrix

| Situation | Action | Reason |
|-----------|--------|--------|
| Just wrote file | Don't re-read | Content remains in context |
| Viewed multimodal content | Write immediately | Capture before memory fades |
| Starting new phase | Read plan/findings | Re-orient stale context |
| Error occurred | Read relevant file | Determine current state |
| Resuming after gap | Read all planning files | Recover full state |

### The 5-Question Reboot Test

Verify solid context management by answering:
1. Where am I? (Task Status Dashboard in progress.md)
2. Where am I going? (Remaining phases)
3. What's the goal? (Goal statement in plan)
4. What have I learned? (findings.md)
5. What have I done? (progress.md)

### When to Apply

**Use for**: Multi-step tasks (3+), research, building projects, many tool calls, subagent orchestration
**Skip for**: Simple questions, single-file edits, quick lookups

### Per-Agent Planning

Each dispatched subagent receives its own planning directory: `.planning/agents/{role}/` with findings.md and progress.md. Use one directory per role (not per task). The orchestrator aggregates agent findings into top-level files after each task completes.

### Anti-Patterns to Avoid

- Using Task API for cross-session persistence (use progress.md instead)
- Stating goals once then ignoring them (re-read before decisions)
- Hiding errors and retrying silently (log everything)
- Storing all content in context (use files for large content)
- Immediate execution without planning (create plan first)
- Repeating failed actions (track attempts and vary approach)
- Losing subagent findings (aggregate into top-level findings.md)

### Templates & Scripts Available

- `templates/findings.md` — Research storage template
- `templates/progress.md` — Session logging template
- `templates/agent-context.md` — Subagent prompt injection rules
- `scripts/init-planning-dir.sh` — Directory initialization
- `scripts/check-complete.sh` — Phase verification
- `scripts/session-catchup.py` — Context recovery

### Novel Techniques vs epost_agent_kit

**Novel (not in our kit)**:
- 2-action dispatch rule with immediate save discipline
- Per-agent planning subdirectories (we use task-level findings only)
- Explicit error tables with retry mutation tracking
- 5-question reboot test for context validation
- Multi-level findings.md organization (discoveries vs rejected alternatives vs constraints)

**Alignment with existing patterns**:
- Our `plans/` directory + `index.json` aligns with their permanent plan storage
- Our TaskCreate/TaskUpdate for status tracking is parallel to their Task Status Dashboard
- Our knowledge-capture skill reflects similar "persist discoveries" intent

---

## Skill 2: writing-plans

### Full Content Extract

**Purpose**: Generates comprehensive implementation plans for engineers with minimal codebase context. Emphasizes complete documentation: affected files, code samples, testing procedures, and bite-sized tasks following TDD principles with frequent commits.

### Key Principles

- **Granularity**: Each task represents 2-5 minutes of work (write test → verify failure → implement → verify pass → commit)
- **DRY, YAGNI, TDD**: Minimize duplication, avoid unnecessary features, test-driven development
- **Completeness**: Include exact file paths, full code blocks, and specific commands with expected outputs
- **Documentation**: Log discoveries and decisions to `.planning/findings.md` after each task

### Mandatory Plan Structure

**Header requirements**:
- Feature name and goal statement
- 2-3 sentence architecture summary
- Technology stack listing
- Planning directory reference (`.planning/`)

**Task format**:
Each task specifies files affected (create/modify/test), then presents 5 sequential steps with code samples and expected outcomes.

### Critical Workflow Rules

1. **Historical Context**: Before planning, check `.planning/archive/*.md` for relevant precedents; incorporate lessons if applicable
2. **Auto-create planning directory** using init script; generates `progress.md` and `findings.md`
3. **Parallelism analysis**: Identify task dependencies and group parallelizable work; calculate parallelism score

### Execution Handoff

After saving the plan, present exactly three execution options (never omit, modify, or add alternatives):

1. **Subagent-Driven** (sequential, this session) → use `superpower-planning:subagent-driven`
2. **Team-Driven** (parallel, this session) → use `superpower-planning:team-driven`
3. **Parallel Session** (separate session) → use `superpower-planning:executing-plans`

**Recommendation logic**:
- Heavy parallelizable tasks → Team-Driven
- Light serial → Subagent-Driven
- Manual checkpoints desired → Parallel Session

### Plan Content Detail Level

**Files affected**:
- Create: `path/to/new-file.ext`
- Modify: `path/to/existing-file.ext`
- Test: `path/to/test-file.test.ext`

**Per task**:
1. Full code blocks (not pseudocode)
2. Exact terminal commands with expected output
3. Test assertions with failure/pass criteria
4. Verification steps (e.g., "curl endpoint, expect 200")

### Novel Techniques vs epost_agent_kit

**Novel**:
- Explicit 5-step task format with code samples inline (we provide less prescriptive task templates)
- Historical precedent checking (`.planning/archive/`) before planning (we skip this)
- Parallelism scoring (explicit count of parallelizable tasks)
- Three execution mode options as **mandatory format** (we provide these but less systematically)
- 2-5 minute task granularity emphasis (we aim for similar but don't always verify)

**Alignment with existing patterns**:
- Our `epost-planner` creates markdown plans to `docs/plans/`
- Our TaskCreate uses similar task structure
- Our `subagent-driven-development` skill references execution modes

---

## Skill 3: subagent-driven

### Full Content Extract

**Purpose**: Executes implementation plans by dispatching fresh subagents for each task with mandatory two-stage review gates: spec compliance first, then code quality. Each agent role maintains persistent planning directories for knowledge capture.

### Core Concept

**Fresh subagent per task** prevents context pollution. **Per-agent planning directories** capture discoveries persistently. **Two-stage review** (spec → quality) is non-negotiable. **Same-session execution** maintains continuity without context switches.

### The Process Flow

1. **Extract & Create Tasks**: Read plan file once, extract all tasks with full context, create tasks upfront
2. **Per-Task Cycle**:
   - Create agent planning dir (`.planning/agents/{role}/`)
   - Dispatch implementer subagent
   - Address any implementation questions
   - Implementer implements, tests, commits, self-reviews
   - Dispatch spec-reviewer subagent
   - If issues found, implementer fixes and spec-reviewer re-reviews
   - Dispatch quality-reviewer subagent
   - If issues found, implementer fixes and quality-reviewer re-reviews
3. **Aggregation**: Extract critical findings, append to top-level `.planning/findings.md` and `.planning/progress.md`
4. **Mark Complete**: Update Task Status Dashboard with both review statuses

### Planning Directory Structure

```
.planning/agents/
├── implementer/
│   ├── findings.md
│   └── progress.md
├── spec-reviewer/
│   ├── findings.md
│   └── progress.md
└── quality-reviewer/
    ├── findings.md
    └── progress.md
```

### Critical Rules (ENFORCEMENT-LEVEL)

- **Never skip reviews** — both MUST show PASS before task completion
- **Never dispatch multiple implementers in parallel** — causes conflicts
- **Never make subagents read plan files** — provide full text directly
- **Never accept "close enough" on spec compliance** — reviewer issues = task incomplete
- **Never review code quality before spec compliance passes** — wrong order

### Two-Stage Review Gates

**Stage 1: Spec Compliance Review**
- Validates implementation matches requirements exactly
- Checks for unimplemented features
- Verifies behavior against stated goals
- Result: PASS or FAIL with specific issues

**Stage 2: Code Quality Review**
- Ensures technical excellence
- Checks for DRY, YAGNI, performance
- Validates test coverage
- Result: PASS or FAIL with specific issues

Both must show PASS in Task Status Dashboard—no exceptions.

### Per-Agent Planning Structure (KEY DIFFERENTIATOR)

Rather than creating task-specific directories, the workflow maintains **one directory per role** (`.planning/agents/{role}/`) containing:
- `findings.md` — Critical discoveries and decisions
- `progress.md` — Step-by-step activity logs

This prevents knowledge loss across tasks while avoiding directory proliferation.

### Orchestrator Aggregation

After each task completes, findings from agent directories are extracted and consolidated into top-level `.planning/` files, updating the Task Status Dashboard and session logs.

### When to Use

Use subagent-driven when:
- Implementation plan exists
- Tasks are mostly independent
- Staying in same session

Use parallel executing-plans instead if tasks are tightly coupled requiring handoff.

### Integration Points

**Required skills**:
- git-worktrees
- writing-plans
- requesting-review
- finishing-branch

**Subagents use**: tdd skill for test-driven implementation

### Novel Techniques vs epost_agent_kit

**Novel (not in our kit)**:
- Mandatory two-stage review gates (spec THEN quality, both required)
- Per-agent planning subdirectories (role-based, not task-based)
- Never-read-plan-files rule (provide full text via context)
- Strict ordering: spec compliance must pass before quality review
- Explicit Task Status Dashboard tracking both review results

**Alignment with existing patterns**:
- We use fresh subagents per task (similar philosophy)
- Our `receiving-code-review` skill handles review feedback
- Our `verification` skill provides evidence-based completion checks
- We don't enforce mandatory two-stage review order (improvement opportunity)

---

## Skill 4: executing-plans

### Full Content Extract

**Purpose**: Orchestrates batch-based task execution with architect checkpoints, following a structured five-step process for implementing pre-written plans.

### The Five-Step Process

**Step 1: Load and Review Plan**
- Read the plan file thoroughly
- Critically assess for gaps, concerns, or ambiguities
- Raise issues with the user before proceeding
- Create tasks and proceed only if concerns are resolved

**Step 2: Execute Batch**
- Default batch size: first 3 tasks
- For each task: mark in-progress, follow steps exactly, run verifications
- Record discoveries to `.planning/findings.md` after each task
- Mark completed when verified

**Step 3: Report and Update Progress**
- Display implemented features and verification outputs
- Update `.planning/progress.md` with task status and batch summary
- Update `.planning/findings.md` with consolidated discoveries
- Communicate: "Ready for feedback"

**Step 4: Continue**
- Apply user feedback
- Execute subsequent batches
- Repeat until all tasks complete

**Step 5: Complete Development**
- Read `.planning/progress.md` for full summary
- Announce use of finishing-branch sub-skill
- Execute finishing-branch workflow

### Critical Stopping Points

Stop immediately when encountering:
- Mid-batch blockers (missing dependencies, test failures, unclear instructions)
- Plan gaps preventing task initiation
- Incomprehensible instructions
- Repeated verification failures

### Key Requirements

- Never start on main/master without explicit consent
- Record discoveries after each task
- Update both progress and findings files after each batch
- Review progress file before final reporting
- Don't skip verifications or force through blockers

### Related Skills

- **git-worktrees**: Set up isolated workspaces
- **writing-plans**: Creates executable plans
- **finishing-branch**: Completes development workflow

### Batch Execution Pattern

**Batch size**: Default 3 tasks per cycle
**Checkpoint**: After each batch, pause for architect/user feedback
**Discovery recording**: After each task completion
**Progress visibility**: User sees implemented features + verification outputs between batches

### Novel Techniques vs epost_agent_kit

**Novel (not in our kit)**:
- Explicit batch size (default 3 tasks) with checkpoint pattern
- Mandatory "Ready for feedback" communication between batches
- Required discoveries recording after each task
- Architect checkpoint design (explicit pause + user input loop)
- Step 5 finishing-branch delegation (structured cleanup)

**Alignment with existing patterns**:
- We use similar multi-step task execution
- Our plan execution follows similar sequence
- We capture discoveries to findings.md (similar pattern)
- We don't enforce batch-level checkpoints (could strengthen execution discipline)

---

## Cross-Cutting Patterns

### 1. Filesystem-as-Memory (Core Innovation)

All four skills build on persistent markdown files instead of context-only memory:
- `.planning/findings.md` — Technical discoveries, decisions, alternatives
- `.planning/progress.md` — Operations log, task status, error tracking
- `.planning/agents/{role}/` — Per-role persistent memory

**Why this matters**: Survives context switches, subagent transitions, long-running sessions. Error recovery can reference logged attempts without re-running.

### 2. 2-Action Dispatch Rule (Systematic Discipline)

After every 2 reads/searches/explores, immediately save to appropriate file. Enforces:
- Don't wait until task end to capture discoveries
- Discoveries live on disk, not just in context
- Decisions are logged in real-time

**Not in our kit**: We capture findings reactively, not on a fixed schedule.

### 3. Persistent Per-Agent Planning Directories

Each subagent role gets `.planning/agents/{role}/findings.md` + `progress.md`:
- One directory per role (not per task)
- Avoids directory explosion
- Prevents knowledge loss across tasks
- Top-level aggregates findings after each task completes

**Not in our kit**: We use task-level findings, aggregated at end.

### 4. Mandatory Two-Stage Review (Quality Gate)

Spec compliance review THEN code quality review. Both must pass:
- Never review code quality before spec is verified
- Never skip either review
- Spec-only pass = task incomplete

**Not in our kit**: We combine review concerns in single pass. This enforces stricter discipline.

### 5. Historical Precedent Checking (Before Planning)

Search `.planning/archive/*.md` before planning new work to reuse lessons:
- Avoids repeating past mistakes
- Incorporates proven patterns
- Builds institutional memory

**Alignment with our kit**: Our `knowledge-retrieval` skill checks `docs/` for prior decisions (similar but at different scope).

### 6. Batch Execution with Checkpoints

Execute N tasks (default 3), then pause for feedback before next batch:
- Provides architect control points
- Allows course correction mid-plan
- Reduces risk of wrong direction

**Not in our kit**: Our `executing-plans` skill provides similar structure but less prescriptive batch size.

### 7. Error Tracking & Mutation (3-Strike Protocol)

Log all errors with attempt counts; on 2nd failure, mutate approach:
- Attempt 1: Diagnose and fix target
- Attempt 2: Try different method (never repeat exact action)
- Attempt 3: Question assumptions broadly
- 3+ Failures: Escalate with full context

**Not in our kit**: We retry but don't enforce mutation discipline.

### 8. The 5-Question Reboot Test

Quick validation of context health: Where am I? Where going? What's goal? What learned? What done?

**Not in our kit**: We don't have a standardized context validation test.

---

## Novel Techniques (Not in epost_agent_kit)

### Tier 1: Directly Implementable (High ROI)

1. **2-Action Dispatch Rule** — Add systematic discovery capture after every 2 operations
   - Implement in `planning-foundation` skill or agent system prompt
   - Reduces lost findings, especially across subagent transitions
   - Enforcement: Task definition asks "saved findings?" every 2 ops

2. **Mandatory Two-Stage Review Gates** — Spec compliance THEN code quality
   - Modify `receiving-code-review` to require sequential gates
   - Enforce `SPEC_PASS` before `QUALITY_REVIEW` starts
   - Prevents "code looks good" overshadowing "doesn't implement requirements"

3. **Per-Agent Planning Directories** — `.planning/agents/{role}/` structure
   - Better than task-level (avoids directory explosion)
   - Orchestrator aggregates after each role completes task
   - Preserves role-specific context across tasks

4. **Batch Execution Checkpoints** — 3-task batches with architect pause
   - Add to `executing-plans` skill
   - Pause after batch with structured feedback request
   - Reduces risk of wrong direction mid-plan

### Tier 2: Conceptually Useful (Medium ROI)

5. **Historical Precedent Checking** — Search `.planning/archive/` before planning
   - Add to `epost-planner` workflow
   - Complements our `knowledge-retrieval` skill
   - Bridges session-level memory gap (what did we try in past sessions?)

6. **Error Mutation Discipline** — Track attempts, force approach change on 2nd failure
   - Add to `error-recovery` skill
   - Log error tables with attempt counts
   - Prevent infinite retry loops

7. **5-Question Reboot Test** — Context validation checkpoint
   - Add to `skill-discovery` or agent initialization
   - Quick sanity check before major decisions
   - Helps prevent context drift in long sessions

### Tier 3: Philosophical Alignment (Lower Priority)

8. **"Never read plan files" rule** — Always pass full text via context
   - Simplifies subagent prompts
   - Avoids I/O overhead
   - Assumes sufficient context window (true for modern models)

9. **Explicit Batch Size Guidance** — Default 3 tasks, explicit reasoning
   - Our execution lacks batch size discipline
   - 3-task batches enable quick feedback loops
   - Reduces cognitive load per batch

---

## Methodology

### Sources Consulted

1. **skills.sh portals** (primary)
   - https://skills.sh/sipengxie2024/superpower-planning/subagent-driven
   - https://skills.sh/sipengxie2024/superpower-planning/planning-foundation
   - https://skills.sh/sipengxie2024/superpower-planning/writing-plans
   - https://skills.sh/sipengxie2024/superpower-planning/executing-plans
   - Credibility: High (official skill repository)

2. **GitHub repository** (secondary)
   - https://github.com/sipengxie2024/superpower-planning
   - Raw SKILL.md files (attempted)
   - README overview
   - Credibility: High (canonical source)

### Coverage Gaps

- Could not fetch raw SKILL.md files directly from GitHub (404 on expected paths)
- Relied on skills.sh portal content, which provides good summaries but may not capture full implementation details
- Did not access skill reference files (templates, scripts, aspect files)
- Did not review other skills in the suite (17 total, analyzed 4)

### Confidence Level

- **High confidence** on skill purposes, critical rules, process flows (sourced from multiple summaries)
- **Medium confidence** on implementation details (summaries vs full SKILL.md files)
- **Medium confidence** on integration points (referenced but not fully explored)

---

## Verdict: ACTIONABLE

**Recommendation**: Incorporate planning-foundation and subagent-driven patterns into epost_agent_kit. These two skills provide immediately implementable improvements to our knowledge persistence and review discipline.

**Priority order**:
1. **planning-foundation** — Add per-agent directories + 2-action dispatch rule to all agents
2. **subagent-driven** — Enforce two-stage review gates in code review workflow
3. **writing-plans** — Already well-aligned; minor tuning for parallelism scoring
4. **executing-plans** — Adopt 3-task batch checkpoint pattern for safety

---

## Unresolved Questions

1. **Directory cleanup**: How long should `.planning/` persist? Session-only? Per-feature?
2. **Findings aggregation**: When orchestrator consolidates findings, how to prevent duplication across agent roles?
3. **Archive rotation**: Strategy for `.planning/archive/` maintenance (when to archive, retention policy)?
4. **Batch size tuning**: Is 3 tasks optimal for all contexts, or should it vary by task complexity?
5. **Cross-session findings**: How to migrate `.planning/findings.md` into permanent `docs/findings/` for reuse?
6. **Spec vs quality trade-off**: Can a task PASS quality review and FAIL spec compliance? (Implies redesign needed)
7. **Subagent context injection**: How detailed should `.planning/agents/{role}/agent-context.md` be for subagent prep?
8. **Integration with existing Task API**: Should `.planning/progress.md` Task Status Dashboard replace or complement TaskCreate/TaskUpdate?

---

## Sources

- skills.sh/sipengxie2024/superpower-planning portal
- https://github.com/sipengxie2024/superpower-planning
- Fetched via WebFetch tool, 2026-03-11

