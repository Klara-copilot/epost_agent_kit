---
phase: 2
title: "Merge decision-boundaries + environment-safety → agent-rules.md"
effort: 20m
depends: []
---

# Phase 2: Merge → agent-rules.md

## Files to Modify

- DELETE: `packages/core/skills/core/references/decision-boundaries.md`
- DELETE: `packages/core/skills/core/references/environment-safety.md`
- CREATE: `packages/core/skills/core/references/agent-rules.md`

## Content Mapping

| Section | Source | Keep |
|---------|--------|------|
| Autonomous Actions | decision-boundaries.md | Yes |
| Requires Approval | decision-boundaries.md | Yes |
| Escalation Rules | decision-boundaries.md | Yes |
| Option Presentation | decision-boundaries.md | Yes |
| Pre-Execution Checks | environment-safety.md | Yes |
| File Operations | environment-safety.md | Yes |
| Path Handling | environment-safety.md | Yes |
| Error Prevention | environment-safety.md | Yes |

## Trimming Rules

Cut from merge:
- Both `## Purpose` sections (~12 lines)
- Both `## Table of Contents` sections (~10 lines)
- Merge the two `## Related Documents` into one section at bottom

## Frontmatter

```yaml
---
name: agent-rules
description: Decision boundaries, environment safety, and pre-execution rules for all agents.
---
```

## Todo

- [ ] Read decision-boundaries.md and environment-safety.md
- [ ] Create agent-rules.md with merged content
- [ ] Apply trimming rules — target ≤ 125 lines
- [ ] Merge Related Documents sections at bottom
- [ ] Delete both source files

## Success Criteria

- `agent-rules.md` exists with all decision boundary AND safety rules
- Line count ≤ 125
- Both source files deleted
