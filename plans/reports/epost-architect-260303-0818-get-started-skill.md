# Plan Report: /get-started Skill

**Agent**: epost-architect
**Date**: 2026-03-03
**Plan**: `/Users/than/Projects/epost_agent_kit/plans/260303-0818-get-started-skill/`

## Summary

Created a 2-phase plan for a new `/get-started` skill. The skill onboards devs to new or existing projects by scanning the codebase, reading/creating `docs/`, reporting staleness, and offering to delegate to `docs-init` or `docs-update`.

## Phases

| # | Phase | Effort | Key Files |
|---|-------|--------|-----------|
| 1 | Create skill SKILL.md | 1h | `packages/core/skills/get-started/SKILL.md` (create) |
| 2 | Wire routing + index | 1h | hub-context, skill-discovery, CLAUDE.md (modify) |

## Total Effort: 2h

## Key Decisions

- **Agent**: `epost-researcher` (read-heavy, exploratory task)
- **Lightweight**: Summarizes, doesn't exhaustively generate (differentiates from docs-init)
- **Delegation pattern**: Offers docs-init/docs-update as next actions rather than reimplementing
- **Two flows**: new project (create minimal docs) vs existing project (read + check staleness)

## Dependencies

- `docs-init` skill (delegation target)
- `docs-update` skill (delegation target)
- `epost-kit init` (regenerates .claude/ with new skill)

## Risks

- Trigger word overlap with `bootstrap` and `docs-init` — mitigated by distinct intent words
- CLAUDE.md may be templated (.hbs) — need to verify edit target during implementation

## Unresolved Questions

1. Is CLAUDE.md at project root generated from a handlebars template, or edited directly?
2. Should the skill also detect and summarize `.claude/` kit configuration (agents, skills count)?
3. Should staleness threshold be configurable or hardcoded (30/90 days)?
