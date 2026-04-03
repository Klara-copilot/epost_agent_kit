---
phase: 1
title: "Extract /scenario as standalone skill"
effort: 30 min
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Rationale: Scenario analysis is pre-implementation (planning/coding), not test execution. As a flag on `/test` it's hidden and implies you must run tests to use it. Standalone makes it discoverable and usable earlier in the workflow.

## Tasks

### Create `packages/core/skills/scenario/SKILL.md`

Extract content from `packages/core/skills/test/references/scenario-mode.md` into a standalone skill.

Frontmatter:
```yaml
---
name: scenario
description: "(ePost) Use when analyzing edge cases before implementing a feature, generating test targets, or stress-testing a feature design. Use before writing tests or during planning — generates scenarios across 12 dimensions (auth, timing, scale, data integrity, etc.)"
user-invocable: true
context: fork
agent: epost-tester
metadata:
  argument-hint: "<file path or feature description>"
  keywords: [scenario, edge-case, test-planning, risk, dimensions, pre-implementation]
  triggers: [/scenario, edge cases, test scenarios, scenario analysis, before writing tests]
  platforms: [all]
  agent-affinity: [epost-tester, epost-planner, epost-fullstack-developer]
  connections:
    enhances: [test, plan, code-review]
---
```

Body: content from `scenario-mode.md` — keep the 12-dimension table, workflow (filter → generate → classify → output), severity criteria, output format. Add:
- Integration with `/test`: "Pass the Test Seeds section directly into `/test` as context"
- Integration with `/plan`: "Feed Critical/High rows into plan risk assessment"

### Update `packages/core/skills/test/SKILL.md`

Change `--scenario` flag entry from:
> `--scenario` Generate edge cases (user types, input extremes, timing, scale) — see `references/scenario-mode.md`

To:
> `--scenario` Run edge case analysis before tests — delegates to `/scenario` skill. Generates test targets across 12 dimensions.

The flag still works but now explicitly delegates to the standalone skill.

### Update `packages/core/skills/test/references/scenario-mode.md`

Replace body with a redirect:
```markdown
# Scenario Mode — Moved

This content has been promoted to the standalone `/scenario` skill.

See `packages/core/skills/scenario/SKILL.md`.
```

### Register in `packages/core/package.yaml`

Add `scenario` to `provides.skills` list.

## File Ownership

| File | Action |
|---|---|
| `packages/core/skills/scenario/SKILL.md` | CREATE |
| `packages/core/skills/test/SKILL.md` | UPDATE — `--scenario` flag description |
| `packages/core/skills/test/references/scenario-mode.md` | UPDATE — redirect to standalone skill |
| `packages/core/package.yaml` | UPDATE — add `scenario` to provides.skills |
