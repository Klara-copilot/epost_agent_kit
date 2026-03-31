# Whitelist Tool Model + Skill Description Compliance

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: kit
**Plan**: plans/260331-1039-whitelist-and-compliance/

## What was implemented

All 4 phases in a single pass:

1. **Description validation checklist** — added 7-point checklist to skill-development.md + new `description-validation-checklist.md` reference file with examples and fail patterns
2. **Skill description audit** — audited 25 core skills; fixed 8 non-compliant descriptions (knowledge leaked workflow steps; mermaidjs/repomix/skill-creator had no trigger phrasing; loop described behavior not conditions; error-recovery/security/code-review lacked quoted phrases)
3. **Consensus-voting pattern** — new reference doc in SDD references/ documenting when to use, aggregation rules, concrete example, token cost warning
4. **Whitelist tool model** — all 11 agents migrated from no-restriction or `tools:` to `allowedTools:` whitelist; kit docs updated (agent-development.md, add-agent.md, agents.md)

## Key decisions and why

- **Decision**: Situational-trigger skills (core, journal, skill-discovery, thinking) exempt from "quoted user phrases" check
  **Why**: These skills trigger on behavioral conditions (start of task, after completing work, stuck after 2+ attempts) — not user speech. Forcing quoted phrases would make descriptions misleading.

- **Decision**: epost-git-manager allowedTools set to [Read, Bash] only (not Read + Write + Edit + Bash as the previous `tools:` implied)
  **Why**: Git operations only need to read files and run CLI commands. Write/Edit is not needed — git itself manages file state via Bash.

- **Decision**: Kept `tools:` entry in agents.md table as "(deprecated)" rather than deleting it
  **Why**: Migration reference — agents from other packages may still use it. Documenting the path to `allowedTools` is safer than silence.

## What almost went wrong

- The phase plan said to add the checklist to skill-development.md after the CSO section, but skill-development.md already referenced `references/description-validation-checklist.md` (line 109). Created both the inline summary section AND the reference file to be consistent with what was already documented.
- `epost-git-manager` previously had `tools: Read, Write, Edit, Bash, Grep, Glob` — much broader than needed. The new `allowedTools: [Read, Bash]` is a meaningful security reduction.
