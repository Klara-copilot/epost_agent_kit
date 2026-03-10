---
updated: 2026-03-09
title: "iOS a11y cleanup + findings persistence workflow"
description: "Remove unnecessary iOS a11y references, add findings report storage to audit/fix/review skills"
status: archived
priority: P2
effort: 2h
branch: master
tags: [a11y, ios, skill-cleanup, workflow]
created: 2026-03-03
---

# iOS a11y Cleanup + Findings Persistence Workflow

## Overview

Two changes: (1) prune redundant iOS a11y reference files that duplicate content better suited to mode-specific refs or the base `a11y` skill, (2) add a findings persistence step to audit/fix/review so new violations get stored in `known-findings.json` automatically.

## Current State

- `ios-a11y` has 11 reference files (2950 lines) — significantly larger than android-a11y (1911 lines, 6 refs)
- `a11y-images.md` (299 lines) duplicates image-button content from `a11y-buttons.md` and generic image rules that belong in guidance mode, not a standalone reference
- `a11y-mode-audit.md`, `a11y-mode-fix.md`, `a11y-mode-guidance.md` are iOS-specific but audit/fix/review are cross-platform skills — mode refs should live in the cross-platform command skills, not inside `ios-a11y`
- Audit, review output JSON findings but NEVER persist them to `known-findings.json`
- Fix reads from `known-findings.json` but never writes back status changes
- No automated flow: audit -> store -> fix -> close

## Target State

- `ios-a11y` trimmed to ~7 reference files matching android-a11y's structure
- Mode references moved to their respective cross-platform command skills
- audit-a11y and review-a11y persist new findings to `known-findings.json`
- fix-a11y updates finding status after successful fix
- Consistent pipeline: audit/review -> auto-persist -> fix -> close

## Platform Scope
- [x] iOS (primary — cleanup target)
- [ ] Android (reference comparison only)
- [ ] Web (reference comparison only)

## Implementation Phases

1. [Phase 01: Prune iOS a11y references](./phase-01-prune-ios-refs.md)
2. [Phase 02: Add findings persistence to audit/fix/review](./phase-02-findings-persistence.md)

## Key Dependencies

- `packages/a11y/` is source of truth (not `.claude/`)
- Must run `epost-kit init` after changes to regenerate `.claude/`
- `known-findings-schema.json` may need version bump if fields added

## Success Criteria

- [ ] ios-a11y references <= 8 files, no content duplication with buttons ref
- [ ] Mode refs live in command skills, not platform skills
- [ ] audit-a11y outputs JSON AND persists new findings
- [ ] review-a11y outputs JSON AND persists new findings
- [ ] fix-a11y updates finding status on successful fix
- [ ] Schema version bumped if needed

## Risk Assessment

- Low risk: skill files are documentation, not runtime code
- Removing `a11y-images.md` could lose image-specific patterns not covered elsewhere — mitigation: merge unique content into `a11y-buttons.md` image-button section and `a11y-mode-guidance.md`
