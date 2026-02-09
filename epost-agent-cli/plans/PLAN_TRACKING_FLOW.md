# Plan Tracking Flow

How plans and reports flow through the epost_agent_kit agent ecosystem.

---

## Overview

```
 User Request
      |
      v
 +-----------------+
 | epost-orchestrator|  Routes task, tracks progress
 +-----------------+
      |
      +---> epost-architect     (creates plans)
      +---> epost-implementer   (executes phases)
      +---> epost-debugger      (investigates issues)
      +---> epost-tester        (validates quality)
      +---> epost-reviewer      (reviews code)
      +---> epost-researcher    (gathers info)
      +---> epost-documenter    (writes docs)
      +---> epost-brainstormer  (evaluates approaches)
      |
      v
  Agent writes report
      |
      v
  +-----------------------------+
  | Plan Storage & Index Protocol|  (defined in planning skill)
  +-----------------------------+
      |
      +---> 1. Save report to plans/reports/
      +---> 2. Append row to INDEX.md
      +---> 3. Append entry to index.json
      |
      v
  Orchestrator verifies index
```

---

## Lifecycle: From Request to Indexed Report

```
Phase 1: PLAN CREATION
========================

  User: "/plan add dark mode"
         |
         v
  +------------------+
  | epost-orchestrator|
  +------------------+
         |
         | routes to
         v
  +------------------+     spawns 3x      +------------------+
  | epost-architect  | -----------------> | epost-researcher |
  +------------------+                    +------------------+
         |                                        |
         | aggregates research                    | returns findings
         |<---------------------------------------+
         |
         v
  Writes plan file:
    plans/active/{agent}-{YYMMDD}-{HHMM}-{slug}.md
         |
         v
  Updates index:
    plans/INDEX.md   (append row under Active)
    plans/index.json (append entry, bump counts.active)


Phase 2: PLAN EXECUTION
========================

  User: "/cook plans/active/feature-plan.md"
         |
         v
  +------------------+
  | epost-orchestrator|
  +------------------+
         |
         | routes to
         v
  +------------------+     per phase      +---------------------+
  | epost-implementer| ----------------> | platform agent       |
  +------------------+                   | (web/ios/android)    |
         |                               +---------------------+
         |                                        |
         | collects results                       | returns output
         |<---------------------------------------+
         |
         v
  Writes phase report:
    plans/completed/{agent}-{YYMMDD}-{HHMM}-{slug}.md
         |
         v
  Updates index:
    plans/INDEX.md   (append row under Completed)
    plans/index.json (append entry, bump counts.completed)


Phase 3: VALIDATION
========================

  +------------------+     reviews       +------------------+
  | epost-tester     | <---------------- | epost-orchestrator|
  +------------------+                   +------------------+
         |                                        ^
         v                                        |
  Runs tests, writes report                       |
         |                                        |
         v                                        |
  +------------------+     reviews                |
  | epost-reviewer   | <-------------------------+
  +------------------+
         |
         v
  Reviews code, writes report
         |
         v
  Both update index:
    plans/INDEX.md
    plans/index.json
```

---

## Report Writing Flow (All 9 Agents)

```
  Agent completes task
         |
         v
  +-------------------------------+
  | 1. WRITE REPORT               |
  |                               |
  | Use hooks-injected naming:    |
  | {agent}-{YYMMDD}-{HHMM}-     |
  |   {short-description}.md      |
  |                               |
  | Save to directory by status:  |
  |   plans/active/    (in prog)  |
  |   plans/completed/ (done)     |
  |   plans/archived/  (obsolete) |
  +-------------------------------+
         |
         v
  +-------------------------------+
  | 2. UPDATE INDEX.md            |
  |                               |
  | Append row to Completed table:|
  |                               |
  | | PLAN-NNNN | Title | agent   |
  | | | date | [link](link) |     |
  +-------------------------------+
         |
         v
  +-------------------------------+
  | 3. UPDATE index.json          |
  |                               |
  | - Increment counts.completed  |
  | - Increment counts.total      |
  | - Append to plans[] array:    |
  |   {                           |
  |     id, title, type,          |
  |     status, created,          |
  |     authors, tags, file       |
  |   }                           |
  +-------------------------------+
         |
         v
  +-------------------------------+
  | 4. ORCHESTRATOR VERIFIES      |
  |                               |
  | - Counts match actual files   |
  | - All reports indexed         |
  | - Status fields accurate      |
  +-------------------------------+
```

---

## Plan Lifecycle

```
  +----------+     +----------+     +-----------+     +----------+
  |  DRAFT   | --> |  ACTIVE  | --> | COMPLETED | --> | ARCHIVED |
  +----------+     +----------+     +-----------+     +----------+
       |                |                 |                 |
       v                v                 v                 v
   plans/active/    plans/active/   plans/completed/  plans/archived/


  Status transitions:
  -------------------
  draft     -> active       Plan work begins
  active    -> completed    All tasks done, verified
  active    -> archived     Superseded by newer plan
  completed -> archived     No longer relevant

  Note: plans/reports/ is LEGACY only (PLAN-0001 to PLAN-0015).
  All new plans use the lifecycle directories above.
```

---

## Directory Structure

```
epost-agent-cli/plans/
  |
  +-- INDEX.md              <-- Master index (human-readable)
  +-- index.json            <-- Master index (machine-readable)
  +-- PLAN_FORMAT.md        <-- Template for new plans
  +-- PLAN_TRACKING_FLOW.md <-- This document
  |
  +-- reports/              <-- LEGACY only (PLAN-0001 to PLAN-0015)
  |     +-- {agent}-{date}-{slug}.md
  |     +-- ... (15 reports, do not add new files here)
  |
  +-- active/               <-- New plans in progress
  |     +-- .gitkeep
  |
  +-- completed/            <-- Finished plans (future)
  |     +-- .gitkeep
  |
  +-- archived/             <-- Superseded/obsolete (future)
        +-- .gitkeep
```

---

## Which Agents Report

```
REPORTING AGENTS (9)                  NON-REPORTING AGENTS (11)
========================              ========================
epost-architect      [plans]          epost-git-manager     [inline output]
epost-implementer    [phases]         epost-scout           [returns findings]
epost-orchestrator   [status]         epost-mcp-manager     [tool output]
epost-debugger       [investigations] epost-journal-writer  [journals only]
epost-tester         [test results]   epost-web-developer   [delegates up]
epost-reviewer       [code reviews]   epost-ios-developer   [delegates up]
epost-researcher     [research]       epost-a11y-specialist [delegates up]
epost-documenter     [doc reviews]    epost-android-developer [delegates up]
epost-brainstormer   [evaluations]    epost-backend-developer [delegates up]
                                      epost-database-admin  [delegates up]
                                      epost-muji            [delegates up]
```

---

## Index Schema

### INDEX.md format

```markdown
| ID | Title | Agent | Date | File |
|----|-------|-------|------|------|
| PLAN-0015 | Title | agent | 2026-02-08 | [reports/file.md](reports/file.md) |
```

### index.json format

```json
{
  "version": "1.0.0",
  "updated": "2026-02-08",
  "counts": { "active": 0, "completed": 15, "archived": 0, "total": 15 },
  "plans": [{
    "id": "PLAN-0015",
    "title": "Changelog & Plans Tracking",
    "type": "implementation",
    "status": "completed",
    "created": "2026-02-08",
    "authors": ["epost-architect"],
    "tags": ["changelog", "tracking"],
    "file": "reports/plan-260208-1337-changelog-plans-tracking.md"
  }]
}
```

### ID Assignment

Next available ID: Check last entry in index.json, increment by 1.

```
PLAN-0001 through PLAN-0015  (assigned)
PLAN-0016                     (next available)
```

---

## Quick Reference

| When | Who | Does What |
|------|-----|-----------|
| Plan created | epost-architect | Write plan + update index |
| Phase executed | epost-implementer | Write phase report + update index |
| Tests run | epost-tester | Write test report + update index |
| Code reviewed | epost-reviewer | Write review report + update index |
| Bug investigated | epost-debugger | Write debug report + update index |
| Research done | epost-researcher | Write research report + update index |
| Docs reviewed | epost-documenter | Write doc report + update index |
| Approach evaluated | epost-brainstormer | Write evaluation + update index |
| All done | epost-orchestrator | Verify index, update plan status |
