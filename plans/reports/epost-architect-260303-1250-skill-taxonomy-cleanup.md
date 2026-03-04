---
agent: epost-architect
created: 2026-03-03
task: skill-taxonomy-cleanup
status: plan-complete
---

# Skill Taxonomy Audit Report

## Issues Verified

| # | Issue | Valid? | Fix Required? |
|---|-------|--------|---------------|
| 1 | bootstrap variants don't link to parent bootstrap | YES | Add `enhances` to parent, variants already have `extends` |
| 2 | plan variants don't link to parent plan | YES | Same fix |
| 3 | `plan` vs `planning` -- duplicate? | NO (different roles) | Link via `requires`/`enhances` |
| 4 | `convert` relationship to `web-prototype` | YES (undeclared) | Add `requires: [web-prototype]` |
| 5 | `debug` vs `debugging` -- duplicate? | NO (different roles) | Link via `requires`/`enhances` |
| 6 | hub-context static platform bundling for a11y | NO (already dynamic) | No fix needed |

## Analysis: Action vs Methodology Pattern

The codebase follows a consistent **two-layer pattern**:

| Layer | Role | User-invocable | Loaded via | Example |
|-------|------|---------------|------------|---------|
| **Action** | Entry point, router, thin | Yes | `/command` | `plan`, `debug`, `review-code`, `convert` |
| **Methodology** | Deep knowledge, patterns | No | Agent `skills:` list | `planning`, `debugging`, `code-review`, `web-prototype` |

These are NOT duplicates. The action skill is the router; the methodology is the knowledge. But they lack explicit connection metadata.

### Variant Pattern (also valid)

| Layer | Role | Example |
|-------|------|---------|
| **Parent** | Auto-detects complexity, routes to variant | `cook`, `plan`, `fix`, `bootstrap` |
| **Variant** | Specific mode (fast, deep, parallel) | `cook-fast`, `plan-deep`, `fix-ci` |

Variants correctly declare `extends: [parent]`, but parents don't declare `enhances: [variants]`.

## hub-context / a11y Platform Bundling (Issue #6)

**Validated as non-issue.** The a11y agent at `packages/a11y/agents/epost-a11y-specialist.md` has:
```yaml
skills: [core, a11y, audit-a11y, fix-a11y, review-a11y, audit-close-a11y]
```

No platform-specific a11y skills (`ios-a11y`, `android-a11y`, `web-a11y`) are statically bundled. The agent body explicitly says "Activate ONLY the skills needed for the detected platform." These are loaded dynamically via `skill-discovery` at runtime.

The `hub-context` skill also delegates platform detection to `skill-discovery` -- it does not hardcode platform skill lists.

## Plan Created

- **Path**: `plans/260303-1250-skill-taxonomy-cleanup/`
- **Phases**: 3
- **Effort**: ~2h (metadata-only changes)
- **Risk**: Low (YAML frontmatter edits only)

## Unresolved Questions

1. Should `test` (action) also get a `testing` methodology skill eventually? Currently no methodology pair exists. Not blocking.
2. Should `cook` (action) get a `cooking`/`implementation` methodology? Currently no pair. Not blocking.
