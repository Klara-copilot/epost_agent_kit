---
title: "Add /get-started skill"
description: "Onboarding skill that scans codebase, creates/reads docs, gives project insights, and offers doc maintenance"
status: done
priority: P2
effort: 2h
branch: master
tags: [skill, onboarding, docs, kit]
created: 2026-03-03
---

# Add /get-started Skill

## Overview

New `/get-started` skill activated when devs ask "how to start", "begin with project", "what is this project". Scans codebase, creates/reads `docs/`, provides project insights, and offers doc update suggestions.

## Current State

- `docs-init` — full codebase scan, generates docs from scratch (heavy)
- `docs-update` — updates existing docs (needs explicit target)
- `repomix` — generates codebase summary XML (raw output)
- No skill bridges "onboarding" with "doc maintenance awareness"

## Target State

- `/get-started` detects new vs existing project context
- Creates `docs/` if missing (lightweight version of docs-init)
- Reads existing `docs/` and summarizes for user
- Reports doc staleness, suggests updates
- Offers to regenerate or update specific sections

## Platform Scope
- [x] All (platform-agnostic, works in any project)

## Implementation Phases

1. [Phase 01: Create get-started skill](./phase-01-create-skill.md)
2. [Phase 02: Wire into routing and index](./phase-02-wire-routing.md)

## Key Dependencies

- Existing `docs-init` skill (reuse scan patterns)
- Existing `docs-update` skill (delegate updates)
- `skill-index.json` (must add entry)
- `hub-context` / CLAUDE.md routing table (must add intent mapping)

## Success Criteria

- [ ] `/get-started` activates on "how to start", "get started", "new to project"
- [ ] Detects existing `docs/` and reads it
- [ ] Creates lightweight `docs/` if missing
- [ ] Reports staleness and suggests specific updates
- [ ] Registered in skill-index.json and routing tables

## Risk Assessment

- Overlap with `docs-init` — mitigated by making get-started lightweight (summary-focused, not exhaustive)
- Scope creep into full doc generation — mitigated by delegating heavy work to `docs-init`/`docs-update`
