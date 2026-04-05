---
name: get-started
description: "(ePost) Use when: \"get started\", \"I'm new to this project\", \"onboard me\", \"what is this codebase\", \"help me understand this project\". Discovers project state and delivers structured onboarding."
argument-hint: "[project path or question]"
user-invocable: true
context: inline
metadata:
  keywords:
    - onboard
    - get-started
    - begin
    - new-project
    - what-is-this
    - existing-project
  agent-affinity:
    - epost-researcher
  platforms:
    - all
  triggers:
    - /get-started
    - onboard me
    - I'm new to this project
    - what is this codebase
  connections:
    enhances: [docs-init, docs-update]
---

# Get Started

Full onboarding pipeline — detect project state, then dispatch researcher → documenter → implementer subagents in sequence.

## Arguments

- CONTEXT: $ARGUMENTS (optional — project path, specific question, or empty)

## What Onboarding Delivers

1. **Project snapshot** — tech stack, key commands, directory structure, entry points, codebase fan-in tour
2. **KB audit or init** — verifies/migrates/creates `docs/index.json` structured Knowledge Base
3. **Environment setup** — installs deps, builds project, launches on simulator/device (auto)
4. **Final summary** — what ran, what needs manual steps, next commands

## Phase Overview

| Phase | Agent | Condition |
|-------|-------|-----------|
| 1 — Research | `epost-researcher` | Only if docs state is `flat` or `none` |
| 2 — Documentation | `epost-docs-manager` | `none` (init) or `kb` (verify). `flat` → ask user first |
| 3 — Env Setup | `epost-fullstack-developer` | Always — install, build, launch |
| 4 — Summary | (inline) | Always — consolidate results |

**CRITICAL**: Phases run automatically in sequence with ONE exception: when `flat` docs are detected, pause after presenting the doc list and ask migrate-or-skip before dispatching Phase 2.

## Docs State Detection

Detect before Phase 1:
- `docs/index.json` found → `"kb"` (skip researcher)
- `docs/**/*.md` found but no `index.json` → `"flat"` (run researcher)
- No docs → `"none"` (run researcher)

## Rules

- **MUST run all phases** — one allowed pause: flat docs gate (ask migrate/skip before Phase 2)
- **Fast detection** — Steps 1–3 are lightweight scan only, < 15s
- **Sequential dispatch** — use Agent tool for each phase, wait for completion before next
- **Shared report** — researcher writes to `reports/`, other agents read from it
- Only stop early if the user has a specific question (answer from what was read, suggest `/scout` for deeper exploration)

## References

- `references/onboarding-workflow.md` — complete phase-by-phase execution: detection logic, all Step 2 branches, two-phase codebase extraction, subagent prompts, output format templates
