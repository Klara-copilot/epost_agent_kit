# TDD Skill Creation

**Date**: 2026-03-27
**Agent**: epost-fullstack-developer
**Epic**: kit

## What was implemented / fixed

Created the `tdd` skill in `packages/core/skills/tdd/` with 5 files:
- `SKILL.md` — workflow, anti-patterns, checklist (111 lines)
- `references/test-quality.md` — good vs bad test examples with Jest/RTL patterns
- `references/mocking-boundaries.md` — boundary mocking rules, DI patterns, MSW, stack-specific guidance
- `references/interface-design.md` — 3 principles: accept deps, return results, small surface
- `references/deep-modules.md` — deep vs shallow module principle with ASCII diagrams

Added entry to `skill-index.json`: count 46→47, development-tools 11→12.

## Key decisions and why

- **Decision**: Folded `refactoring.md` into the Refactor step of SKILL.md as a table.
  **Why**: Spec said to fold it, not create a separate file. 5 refactor candidates fit cleanly in a table row each.

- **Decision**: Kept SKILL.md at 111 lines (under the 180 target).
  **Why**: The workflow is concise. Padding to 180 would violate YAGNI. The ASCII anti-pattern diagram and checklist carry the skill's value.

- **Decision**: Did not create a planning checklist section.
  **Why**: Spec explicitly excluded it — our `/plan` skill handles planning.

## What almost went wrong

- skill-index.json path for core-local skills uses `tdd/SKILL.md` (relative), not `../../../.claude/skills/tdd/SKILL.md` — the index is generated output at `.claude/` level but source lives in `packages/core/skills/`. Used relative path matching the package structure.
