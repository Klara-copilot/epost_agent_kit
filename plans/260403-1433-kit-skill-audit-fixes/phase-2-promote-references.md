---
phase: 2
title: "Promote references to standalone skills + update dispatcher"
effort: 1h
depends: [1]
---

## Context

- Plan: [plan.md](./plan.md)
- Phase 1 must complete first (optimize.md gets its broken ref fixed in Phase 1 before promotion)

## Overview

Promote 3 orphaned reference files to standalone skills. Make action skills user-invocable. Delete the `/kit` dispatcher entirely. Update package.yaml. Run init.

## File Ownership

| File | Action |
|------|--------|
| `packages/kit/skills/kit-optimize/SKILL.md` | CREATE — promote from `kit/references/optimize.md` |
| `packages/kit/skills/kit-cli/SKILL.md` | CREATE — promote from `kit/references/cli.md` |
| `packages/kit/skills/kit-verify/SKILL.md` | CREATE — promote from `kit/references/verify.md` |
| `packages/kit/skills/kit/` | DELETE ENTIRE DIRECTORY (dispatcher no longer needed) |
| `packages/kit/skills/kit-add-agent/SKILL.md` | UPDATE — set user-invocable: true, add context: fork, agent: epost-fullstack-developer |
| `packages/kit/skills/kit-add-skill/SKILL.md` | UPDATE — set user-invocable: true, add context: fork, agent: epost-fullstack-developer |
| `packages/kit/skills/kit-add-hook/SKILL.md` | UPDATE — set user-invocable: true, add context: fork, agent: epost-fullstack-developer |
| `packages/kit/package.yaml` | UPDATE — remove `kit`, add kit-optimize/kit-cli/kit-verify (total: 10) |

## Tasks

### Promote optimize.md (fix 14)

- [ ] Create `packages/kit/skills/kit-optimize/SKILL.md` with:
  - Frontmatter: name `kit-optimize`, description `"(ePost) Use when optimizing an existing skill for token efficiency, progressive disclosure, or CSO compliance."`, `user-invocable: false`, `metadata.keywords: [optimize, skill, CSO, token-efficiency, progressive-disclosure]`, `metadata.platforms: [all]`, `metadata.agent-affinity: [epost-fullstack-developer]`
  - Body: content from `optimize.md` (with broken ref already fixed in Phase 1)
- [ ] Delete `packages/kit/skills/kit/references/optimize.md`

### Promote cli.md (fix 15)

- [ ] Create `packages/kit/skills/kit-cli/SKILL.md` with:
  - Frontmatter: name `kit-cli`, description `"(ePost) Use when developing the epost-kit CLI, adding new commands, or debugging CLI behavior. Reference: tech stack (Node.js/cac/TypeScript), project structure, key commands, conventions."`, `user-invocable: false`, `metadata.keywords: [cli, epost-kit, commands, typescript, node]`, `metadata.platforms: [all]`, `metadata.agent-affinity: [epost-fullstack-developer]`
  - Body: content from `cli.md` with hardcoded path `/Users/than/Projects/epost-agent-kit-cli` replaced by `(standalone repo, sibling to epost_agent_kit)`
- [ ] Delete `packages/kit/skills/kit/references/cli.md`

### Promote verify.md (fix 16)

- [ ] Create `packages/kit/skills/kit-verify/SKILL.md` with:
  - Frontmatter: name `kit-verify`, description `"(ePost) Use when running a pre-release audit, verifying kit integrity before init, or checking for broken references and stale connections."`, `user-invocable: false`, `metadata.keywords: [verify, audit, integrity, pre-release, references]`, `metadata.platforms: [all]`, `metadata.agent-affinity: [epost-fullstack-developer]`
  - Body: content from `verify.md`
- [ ] Delete `packages/kit/skills/kit/references/verify.md`

### Make action skills user-invocable (fix 17)

For each of `kit-add-agent`, `kit-add-skill`, `kit-add-hook`:
- [ ] Set `user-invocable: true`
- [ ] Add `context: fork`
- [ ] Add `agent: epost-fullstack-developer`
- [ ] Add `## Delegation — REQUIRED` block at top of body (same pattern as old kit/SKILL.md)

kit-optimize gets same treatment when created (already spec'd in its creation task above).

### Delete kit dispatcher (fix 18)

- [ ] Delete `packages/kit/skills/kit/` directory (entire directory including references/)
- [ ] This removes: kit/SKILL.md, kit/references/optimize.md, kit/references/cli.md, kit/references/verify.md (all deleted via directory removal)

### Update package.yaml (fix 19)

- [ ] Remove `kit` from provides.skills
- [ ] Add `kit-optimize`, `kit-cli`, `kit-verify`
- [ ] Final list (10 skills): kit-add-agent, kit-add-skill, kit-add-hook, kit-optimize, kit-agent-development, kit-skill-development, kit-hooks, kit-agents, kit-cli, kit-verify

### Regenerate

- [ ] Run `cd /Users/than/Projects/epost_agent_kit && epost-kit init --full --source .`
- [ ] Run `node .claude/scripts/generate-skill-index.cjs`
- [ ] Verify: `ls .claude/skills/ | grep kit` shows 10 kit skills (no plain `kit`)
- [ ] Verify: `ls .claude/skills/kit` returns "not found"

## Validation

- `ls packages/kit/skills/` shows 10 directories (no `kit/`)
- `grep "^  - kit$" packages/kit/package.yaml` returns 0 matches
- `grep "kit-optimize\|kit-cli\|kit-verify" packages/kit/package.yaml` returns 3 matches
- `epost-kit init` completes without errors
