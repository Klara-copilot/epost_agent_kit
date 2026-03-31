---
title: "Whitelist Tool Model + Skill Description Compliance"
status: active
created: 2026-03-31
updated: 2026-03-31
effort: 3h
phases: 4
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Whitelist Tool Model + Skill Description Compliance

## Summary

Harden agent security via allowedTools whitelists (replacing blacklist guidance), add description validation checklist, audit 25+ core skill descriptions for CSO compliance, and document consensus-voting pattern for multi-agent decisions.

## Key Dependencies

- `packages/core/agents/*.md` — all 9 core agents
- `packages/design-system/agents/epost-muji.md`, `packages/a11y/agents/epost-a11y-specialist.md`
- `packages/kit/skills/kit/references/` — agent-development, add-agent, agents docs
- `packages/core/skills/*/SKILL.md` — 25+ skill descriptions

## Execution Strategy

Sequential phases. Phase 1 establishes checklist before Phase 2 audit. Phase 3 is independent. Phase 4 is the largest change (agents + docs).

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Description Validation Checklist | 15m | pending | [phase-1](./phase-1-description-checklist.md) |
| 2 | Audit 25 Skill Descriptions | 1h | pending | [phase-2](./phase-2-description-audit.md) |
| 3 | Document Consensus-Voting Pattern | 20m | pending | [phase-3](./phase-3-consensus-voting.md) |
| 4 | Whitelist Tool Model | 1h 30m | pending | [phase-4](./phase-4-whitelist-tools.md) |

## Critical Constraints

- `packages/` is source of truth; `.claude/` is generated — never edit `.claude/` directly
- `epost-git-manager` already has `tools:` field — needs migration to `allowedTools:` pattern
- `allowedTools` is ecosystem field (not upstream-confirmed) — same status as `disallowedTools`

## Success Criteria

- [ ] Description validation checklist added to skill-development.md
- [ ] All 25+ core skill descriptions pass checklist (trigger-only, no workflow summary)
- [ ] Consensus-voting reference doc created
- [ ] All 11 agents have explicit `allowedTools:` in frontmatter
- [ ] Kit docs updated: `disallowedTools` guidance replaced with `allowedTools` standard
- [ ] After `epost-kit init`, `.claude/agents/` reflects new allowedTools
