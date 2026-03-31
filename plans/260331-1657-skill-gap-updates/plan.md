---
title: "Skill Gap Updates: watzup, preview, deploy"
status: active
created: 2026-03-31
updated: 2026-03-31
effort: 3h
phases: 3
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Skill Gap Updates: watzup, preview, deploy

## Summary

Add three missing capabilities: `--watzup` EOD summary flag to git skill, extend mermaidjs into a multi-format `preview` skill with `--explain`/`--ascii`/`--html` flags, and create a new `deploy` skill with auto-detected platform support.

## Key Dependencies

- `packages/core/skills/git/SKILL.md` — existing git skill (add flag + reference)
- `packages/core/skills/mermaidjs/SKILL.md` — existing skill (extend with flags)
- `packages/core/package.yaml` — register new deploy skill
- No external dependencies

## Execution Strategy

Sequential, simplest-first. Each phase is independently committable.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Git --watzup flag | 30m | pending | [phase-1](./phase-1-git-watzup.md) |
| 2 | Mermaidjs preview flags | 1h | pending | [phase-2](./phase-2-preview-flags.md) |
| 3 | Deploy skill | 1.5h | pending | [phase-3](./phase-3-deploy-skill.md) |

## Critical Constraints

- All edits in `packages/core/` (never `.claude/` directly)
- Skills use flags, not separate command files
- New skills must register in `packages/core/package.yaml`
- Progressive disclosure: keep SKILL.md lean, details in `references/`

## Success Criteria

- [ ] `/git --watzup` produces EOD summary from branch + recent commits
- [ ] `/mermaidjs --explain`, `--ascii`, `--html` produce distinct output formats
- [ ] `/deploy` auto-detects platform and runs deploy for 6 supported targets
- [ ] All new skills registered in package.yaml
- [ ] No bare SKILL.md exceeds 160 lines
