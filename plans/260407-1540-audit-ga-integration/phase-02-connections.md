---
phase: 2
title: "Frontmatter connections + package.yaml sync"
effort: 30m
depends: [1]
---

# Phase 2 — Frontmatter Connections + Package.yaml Sync

## Context

Both skills exist but have no formal dependency linkage. The audit skill must declare web-analytic as a conditional dependency (web platform only). web-analytic must declare it enhances audit.

## Overview

Wire bidirectional connections in YAML frontmatter so skill-discovery and kit-verify can validate the relationship.

## Requirements

### 2.1 — audit/SKILL.md frontmatter

Update `connections` block:

```yaml
connections:
  enhances: [code-review, ui-lib-dev]
  requires: [knowledge]
  optional: [web-analytic]    # ← NEW: loaded when web platform detected
```

Use `optional` (not `requires`) because audit works without web-analytic on non-web platforms.

### 2.2 — web-analytic/SKILL.md frontmatter

Add `connections` block:

```yaml
connections:
  enhances: [audit, code-review]  # ← NEW
```

### 2.3 — core/package.yaml — optional dependency

Add `optional-dependencies` to core package:

```yaml
optional-dependencies:
  - platform-web   # For web-analytic GA check in audit
```

This signals that core's audit skill can leverage platform-web's web-analytic when available, but core installs independently.

## Files to Modify

| File | Change |
|------|--------|
| `packages/core/skills/audit/SKILL.md` | Add `optional: [web-analytic]` to connections |
| `packages/platform-web/skills/web-analytic/SKILL.md` | Add `connections.enhances: [audit, code-review]` |
| `packages/core/package.yaml` | Add `optional-dependencies: [platform-web]` |

## Validation

- [ ] `audit/SKILL.md` frontmatter has `optional: [web-analytic]`
- [ ] `web-analytic/SKILL.md` frontmatter has `connections.enhances: [audit, code-review]`
- [ ] `core/package.yaml` has `optional-dependencies: [platform-web]`
- [ ] No circular dependency (core→platform-web is optional, platform-web→core is required — DAG preserved)
