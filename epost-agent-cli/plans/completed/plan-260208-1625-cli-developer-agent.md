# PLAN-0018: Dedicated CLI Developer Agent

**Status**: completed
**Created**: 2026-02-08
**Authors**: epost-implementer
**Tags**: agents, cli, platform-agent

## Summary

Created `epost-cli-developer` as a dedicated platform agent for CLI development, matching the pattern of `epost-web-developer`, `epost-ios-developer`, and `epost-android-developer`. Previously CLI work was handled directly by `epost-implementer` — now it delegates to the specialized agent.

## Changes

### NEW files (1)
1. `.claude/agents/epost-cli-developer.md` — CLI platform specialist agent with:
   - Tech stack reference (Commander, @inquirer/prompts, picocolors, cli-table3, ora, vitest)
   - Implementation patterns (command handler, UI module usage, package/profile APIs)
   - Testing patterns (vitest, dynamic imports for env-dependent tests)
   - Build commands, completion report format, rules
   - Skills: `core`, `cli-development`, `code-review`, `debugging`

### MODIFIED files (7)
2. `.claude/agents/epost-implementer.md` — Delegates to `epost-cli-developer` instead of direct implementation; removed `cli-development` skill (now on dedicated agent)
3. `.claude/agents/epost-orchestrator.md` — Platform routing updated: CLI → `epost-cli-developer (implementation + testing)`
4. `.claude/commands/cli/cook.md` — Agent changed from `epost-implementer` → `epost-cli-developer`
5. `.claude/commands/cli/test.md` — Agent changed from `epost-tester` → `epost-cli-developer`
6. `.claude/commands/cli/doctor.md` — Agent changed from `epost-debugger` → `epost-cli-developer`
7. `.claude/skills/agents/SKILL.md` — Agent count 20→21, added `epost-cli-developer.md` to directory tree
8. `.claude/skills/skill-index.json` — Added `epost-cli-developer` to `cli-development` agent-affinity
9. `CLAUDE.md` — Agent count 20→21, CLI Platform agent updated to `epost-cli-developer`

## Platform Agent Comparison

| Platform | Agent | Skills | Commands |
|----------|-------|--------|----------|
| CLI | `epost-cli-developer` | cli-development | /cli:cook, /cli:test, /cli:doctor |
| Web | `epost-web-developer` | nextjs, frontend-development, api-routes | /web:cook, /web:test |
| iOS | `epost-ios-developer` | ios-development | /ios:cook, /ios:test, /ios:debug |
| Android | `epost-android-developer` | android-development | /android:cook, /android:test |
| Backend | `epost-backend-developer` | javaee, databases | /backend:cook, /backend:test |
