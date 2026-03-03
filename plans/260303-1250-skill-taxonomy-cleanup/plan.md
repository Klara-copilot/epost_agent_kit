---
title: "Skill Taxonomy Cleanup"
description: "Fix missing variant-to-parent links, eliminate action/methodology duplication, and correct a11y agent platform bundling"
status: done
priority: P1
effort: 3h
branch: master
tags: [skills, taxonomy, dedup, hub-context]
created: 2026-03-03
---

# Skill Taxonomy Cleanup

## Overview

Audit found 6 structural issues in skill taxonomy: missing parent links, duplicate action/methodology pairs, undeclared cross-skill relationships, and overly static platform bundling in a11y agent.

## Current State

- Variant skills (`bootstrap-fast`, `bootstrap-parallel`) declare `extends: [bootstrap]` in YAML but `bootstrap` has empty `connections` (no `enhances` back-link)
- Same pattern for `plan-*` variants
- `plan` (action command) vs `planning` (methodology skill) -- dual identity, unclear routing
- `debug` (action) vs `debugging` (methodology) -- same pattern
- `code-review` (methodology) vs `review-code` (action) -- same pattern
- `convert` (action) references `web-prototype` in body but no `connections` link
- `a11y` agent bundles no platform-a11y skills in `skills:` list (correct) but `skill-discovery` doesn't address a11y platform routing

## Target State

- All parent skills list their variants in `connections.enhances`
- Action/methodology pairs linked via `connections` (action extends methodology)
- `convert` linked to `web-prototype` via requires
- hub-context a11y routing validated as already dynamic (no fix needed)

## Implementation Phases

1. [Phase 01: Add parent-to-variant back-links](./phase-01-parent-backlinks.md)
2. [Phase 02: Link action/methodology pairs](./phase-02-action-methodology-links.md)
3. [Phase 03: Regenerate skill-index.json](./phase-03-regen-index.md)

## Key Dependencies

- All edits in `packages/` (source of truth), NOT `.claude/`
- Must run `epost-kit init` after to regenerate `.claude/`

## Success Criteria

- [ ] Every variant skill's parent has `enhances` listing its variants
- [ ] Action commands link to their methodology skill via `extends`
- [ ] `convert` declares `requires: [web-prototype]`
- [ ] `skill-index.json` reflects all connection changes
- [ ] `epost-kit lint` passes with no new warnings

## Risk Assessment

Low risk -- metadata-only changes to YAML frontmatter. No behavioral changes.
