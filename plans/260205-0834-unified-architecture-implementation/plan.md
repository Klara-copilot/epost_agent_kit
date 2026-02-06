---
title: "Unified Architecture Implementation"
description: "Restructure agent kit into parent-child delegation + npx epost-kit CLI distribution"
status: in-progress
priority: P1
effort: 32h
branch: master
tags: [architecture, cli, multi-platform, agents]
created: 2026-02-05
updated: 2026-02-06
---

# Unified Architecture Implementation

## Goal

Transform epost_agent_kit into parent-child delegation architecture (global agents orchestrate, platform agents execute) and build `npx epost-kit` CLI for cross-platform distribution (Claude Code, Cursor, Copilot).

## Architecture

```
User -> /command -> Global Agent (orchestrate) -> Platform Agent (execute)
```

```
Global (orchestrate)          Platform (execute)
+--------------+         +----------------------+
| orchestrator |-------->| web/implementer      |
| architect    |-------->| web/tester           |
| implementer  |-------->| web/designer         |
| reviewer     |-------->| ios/implementer      |
| researcher   |         | ios/tester           |
| debugger     |-------->| ios/simulator        |
| tester       |-------->| android/implementer  |
| documenter   |         | android/tester       |
| git-manager  |         +----------------------+
+--------------+
```

## Current Inventory

- **11 agents**: planner, fullstack-developer, code-reviewer, debugger, tester, researcher, project-manager, docs-manager, git-manager, ui-designer, performance-analyst
- **11 skills**: planning, research, debugging, frontend-development, backend-development, nextjs, shadcn-ui, better-auth, databases, docker, ios-development
- **23 commands**: core/{ask,bootstrap,cook,debug,plan,test}, design/fast, docs/{init,update}, fix/{ci,fast,hard,test,ui}, git/{cm,commit,cp,pr,push}, ios/{cook,debug,simulator,test}
- **3 workflows**: bug-fixing, feature-development, project-init

## Research Reports

- [Cross-Platform Formats](research/researcher-01-cross-platform-formats.md) - Agent/skill specs for Claude, Cursor, Copilot
- [CLI Patterns](research/researcher-02-cli-patterns.md) - Commander.js, npx distribution, file discovery

## Phases

| # | Phase | File | Effort | Status | Progress |
|---|-------|------|--------|--------|----------|
| 0 | Dependencies & Audit | [phase-00](phase-00-dependencies-audit.md) | 1h | pending | 0% |
| 1 | Rules Foundation | [phase-01](phase-01-rules-foundation.md) | 2h | pending | 0% |
| 2 | Global Agents Restructuring | [phase-02](phase-02-global-agents.md) | 4h | pending | 0% |
| 3 | Parallel Planning Variant | [phase-03-parallel.md](phase-03-web-platform-agents.md) | 1h | complete | 100% ✓ |
| 3.5 | Web Platform Agents | [phase-03-web.md](phase-03-web-platform-agents.md) | 3h | pending | 0% |
| 4 | Session State + Verification | [phase-04](phase-04-functional-verification.md) | 3h | complete | 100% ✓ |
| 5 | iOS Platform Agents | [phase-05](phase-05-ios-platform-agents.md) | 3h | pending | 0% |
| 6 | Android Platform Agents | [phase-06](phase-06-android-platform-agents.md) | 2h | pending | 0% |
| 7 | CLI Build | [phase-07](phase-07-cli-build.md) | 8h | pending | 0% |
| 8 | Platform Sync | [phase-08](phase-08-platform-sync.md) | 4h | pending | 0% |
| 9 | E2E Verification | [phase-09](phase-09-e2e-verification.md) | 3h | pending | 0% |

## Key Design Decisions

1. Global agents delegate, never execute platform code
2. Platform agents are self-contained within their domain
3. Commands at both levels: `/cook` (global, auto-detect) and `/web:cook` (explicit)
4. Skills grouped by platform; shared skills at root level
5. Rules remain global; platform conventions live in agent prompts
6. Android as skeleton only (populated later)
7. CLI handles full ecosystem conversion across all 3 platforms
8. External skills (`skill-creator`, `find-skills`) installed as global dependencies

## Agent Renaming Map

| Current | Action | New | Notes |
|---------|--------|-----|-------|
| planner.md | RENAME | architect.md | Design/planning orchestrator |
| fullstack-developer.md | RENAME | implementer.md | Delegator to platform implementers |
| code-reviewer.md | RENAME | reviewer.md | + absorbs performance-analyst |
| docs-manager.md | RENAME | documenter.md | Stays global |
| project-manager.md | MERGE | orchestrator.md | PM absorbed into orchestrator |
| performance-analyst.md | MERGE | reviewer.md | Perf analysis part of review |
| ui-designer.md | MOVE | web/designer.md | Platform-specific |
| (new) | CREATE | orchestrator.md | Top-level router + PM duties |

---

Created by Phuong Doan | 2026-02-05
