---
phase: 3
title: "Improve orchestration summary"
effort: 30m
depends: [1, 2]
---

# Phase 3: Improve Orchestration Summary

## Changes

### File: `packages/core/CLAUDE.snippet.md`

### 1. Replace Multi-Step Workflow Detection with concise orchestration block

**Before** (scattered bullet list + hybrid audit table):
```
### Multi-Step Workflow Detection
- Multi-intent ("plan and build X") → epost-project-manager → workflow-feature-development
- Research then plan → ...
- Bug report with context → ...
[+ 20-line Hybrid Audit Protocol table]
```

**After** (compact decision tree):

```markdown
### Orchestration

**Single intent** → spawn the matched agent directly via Agent tool.

**Multi-intent** ("plan and build X", "research then implement") → spawn `epost-project-manager`, which decomposes and delegates sequentially.

**Parallel work** (3+ independent tasks, cross-platform) → use `subagent-driven-development` skill from main context.

**Subagent constraint**: Subagents cannot spawn further subagents. Multi-agent workflows (hybrid audits, parallel research) must be orchestrated from the main conversation.

**Escalation**: 3 consecutive failures → surface findings to user. Ambiguous request → ask 1 question max.

See `core/references/orchestration.md` for full protocol.
```

### 2. Inline the Hybrid Audit Protocol as a single rule

Replace the 10-line table with:
```
**Hybrid audits** (klara-theme code): Orchestrated from main context via `audit/SKILL.md`. Dispatch muji (Template A+) first, then code-reviewer with muji's report. Never free-form prompt muji for audits.
```

### 3. Consolidate Context Boost + Rules into one block

Merge the two small sections into:
```markdown
### Routing Rules

1. Explicit slash command → execute directly, skip routing
2. TypeScript/build errors in context → route to Fix first
3. Staged files → boost Review or Git intent
4. Active plan exists → boost Build ("continue" → cook)
5. Ambiguous after context boost → ask user (max 1 question)
6. All delegations follow `core/references/orchestration.md`
```

## Validation

- Orchestration is <=15 lines (down from ~40)
- Hybrid audit protocol is 2 lines (down from 10)
- Context boost + rules merged into single 6-line block
- Total CLAUDE.md <= 150 lines
