---
title: "Fix All Kit Skill Audit Findings"
status: active
created: 2026-04-03
updated: 2026-04-03
effort: 2h
phases: 2
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

## Summary

Fix 19 audit findings + delete the `/kit` dispatcher entirely. Action skills become directly user-invocable. All findings pre-identified — no research needed.

## Scope Rationale

- **Problem**: Broken references, inaccurate frontmatter docs (contradicts ARCH-0005), CSO-violating descriptions, orphaned reference files, unnecessary dispatcher indirection
- **Why now**: Kit skills are foundational — other skills/agents reference them for authoring guidance
- **Dispatcher removal**: `/kit` was just indirection — now that action skills are standalone, CSO descriptions + user-invocable flags handle routing directly (KISS)

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Fix content in existing skills | 1h | pending | [phase-1](./phase-1-fix-existing-skills.md) |
| 2 | Promote refs, make action skills invocable, delete /kit | 1h | pending | [phase-2](./phase-2-promote-references.md) |

## Constraints

- All edits in `packages/kit/skills/` (source of truth), never `.claude/`
- Run `epost-kit init --full --source .` + `node .claude/scripts/generate-skill-index.cjs` after all changes
- ARCH-0005 is the authoritative spec for Claude Code frontmatter fields

## Success Criteria

- [ ] Zero broken references across all kit skills (grep for deleted file names returns 0)
- [ ] kit-agent-development and kit-agents frontmatter tables match ARCH-0005
- [ ] All kit skill descriptions follow CSO trigger format ("Use when...")
- [ ] 3 new standalone skills: kit-optimize, kit-cli, kit-verify
- [ ] kit-add-agent, kit-add-skill, kit-add-hook, kit-optimize are user-invocable with context: fork
- [ ] `packages/kit/skills/kit/` directory deleted entirely
- [ ] package.yaml lists 10 skills (no `kit` dispatcher)
- [ ] `epost-kit init` + skill index regeneration succeeds
