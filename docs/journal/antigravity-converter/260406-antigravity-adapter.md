# Antigravity Converter — Phases 1 + 2

**Date**: 2026-04-06
**Agent**: epost-fullstack-developer
**Epic**: antigravity-converter
**Plan**: plans/260406-1045-antigravity-converter/

## What was implemented / fixed

Created `AntigravityAdapter` with full Claude Code → Antigravity conversion:
- `GEMINI.md` (Antigravity primary) + `AGENTS.md` (cross-tool compat) at project root
- `.antigravity/agents/*.yaml` — converted from `.claude/agents/*.md` with frontmatter field mapping
- `skills/*/SKILL.md` — YAML frontmatter stripped, body preserved (invocable via Antigravity slash commands)
- `.agent/rules/{platform}.md` — platform-scoped rules from package snippets
- Wired into `init.ts` (validTargets, short-circuit block), `target-adapter.ts` (TargetName union + factory), `init-wizard.ts` (editor picker ×2, targetLabel, installDirName)

## Key decisions and why

- **`generatePlatformRules` as standalone function in init.ts, not adapter method**: Matches cursor's `generateSplitMdcFiles` pattern. Adapter stays stateless and testable; generation logic sits with the init flow that owns the snippet data.
- **Phases 1+2 implemented together**: Agent/skill conversion methods were already needed to complete `runAntigravityInit`, so splitting into two passes would have left dead code. Both phases share the same `antigravity-adapter.ts` file.
- **Simple YAML serializer instead of yaml library dependency**: Antigravity YAML schema is minimal (name, description, role, model, readonly, restrictedTools). Adding a full YAML library for 5 fields is YAGNI.

## What almost went wrong

JSDoc block comment containing `*/SKILL.md` closed the `/* ... */` comment block early, causing 10+ TypeScript parse errors. Changed to `//` line comments. [knowledge skill should flag: avoid `*/` inside JSDoc comment blocks]

Model mapping haiku/sonnet/opus → full IDs required because Antigravity YAML uses full model identifiers, unlike Claude Code frontmatter which uses short aliases.
