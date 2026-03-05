# PLAN-0017: Agent & Skill Ecosystem for CLI/Kit Development

**Status**: completed
**Created**: 2026-02-08
**Authors**: epost-architect, epost-implementer
**Tags**: agents, skills, cli, commands, ecosystem

## Summary

Added CLI/kit development support to the agent ecosystem. Previously 0 agents, 0 skills, and 0 commands recognized CLI work. Now epost-implementer detects CLI platform, orchestrator routes CLI tasks, and 3 dedicated commands exist.

## Changes

### NEW files (4)
1. `.claude/skills/cli/SKILL.md` — CLI development skill (~1,500 words): tech stack, architecture, patterns, testing, build commands
2. `.claude/commands/cli/cook.md` — `/cli:cook` command → epost-implementer
3. `.claude/commands/cli/test.md` — `/cli:test` command → epost-tester
4. `.claude/commands/cli/doctor.md` — `/cli:doctor` command → epost-debugger

### MODIFIED files (5)
5. `.claude/agents/epost-implementer.md` — Added CLI platform detection, `cli-development` skill binding, CLI in delegation list
6. `.claude/agents/epost-orchestrator.md` — Added CLI routing path, CLI in platform detection, CLI in platform routing
7. `.claude/skills/skill-index.json` — Count 31→32, added `cli-development` entry with keywords/triggers/affinity
8. `.claude/skills/agents/SKILL.md` — Updated directory tree: agent count 19→20, commands 37→40, skills 22→23, added cli/ entries
9. `CLAUDE.md` — Added "CLI Platform (epost-kit)" section with tech stack, commands, agent, skill

## Verification

- `/cli:cook` auto-discovered and visible in skills list
- `/cli:test` auto-discovered and visible in skills list
- `/cli:doctor` auto-discovered and visible in skills list
- `cli-development` skill auto-discovered as `cli:` in skills list
- skill-index.json count = 32
- CLAUDE.md has CLI Platform section
- No TypeScript code changed (ecosystem-only changes)
