# epost-planner: Update epost-code-reviewer Agent and Related Code

**Date**: 2026-03-07 11:59
**Agent**: epost-planner
**Plan**: `plans/260307-1159-update-code-reviewer/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Plan created to slim down the 289-line epost-code-reviewer agent to ~60-80 lines by removing duplicated OWASP, severity, and report template content that already exists in the `code-review` skill. Also fixes stale references to non-existent files (`development-rules.md`, `Explore agent`) and updates legacy sub-skill names in skill files.

---

## Plan Details

- **Directory**: `plans/260307-1159-update-code-reviewer/`
- **Phases**: 2 phases
- **Effort**: 2h
- **Platforms**: all (kit authoring)

## Sources Analyzed

- `packages/core/agents/epost-code-reviewer.md` — agent source of truth
- `packages/core/skills/code-review/SKILL.md` — skill with review methodology
- `packages/core/skills/code-review/references/report-template.md` — canonical report template
- `packages/core/skills/code-review/references/receiving.md` — receiving feedback protocol
- `packages/core/skills/review/SKILL.md` — unified review command
- `packages/core/skills/review/references/code.md` — ultrathink review workflow
- `.claude/skills/core/references/workflow-code-review.md` — scout-first workflow
- `.claude/skills/subagent-driven-development/references/` — spec + quality reviewer prompts

## Files to Touch

| File | Action | Phase |
|------|--------|-------|
| `packages/core/agents/epost-code-reviewer.md` | Rewrite (slim) | Phase 1 |
| `packages/core/skills/code-review/SKILL.md` | Update routing table, add OWASP ref | Phase 2 |
| `packages/core/skills/review/references/code.md` | Fix stale `epost-git-manager` ref | Phase 2 |

## Key Dependencies

- Must edit in `packages/`, not `.claude/` (generated output)
- Run `epost-kit init` after changes to regenerate `.claude/`

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent loses critical context after slimming | Med | All content verified to exist in skill files |
| Stale skill-index after changes | Low | Regenerate via init |

---

## Verdict

**READY** — straightforward cleanup, all content already exists in skills

---

*Unresolved questions:*
- Should OWASP checklist be added inline to `code-review/SKILL.md` or as a separate reference file `code-review/references/security-checklist.md`? Recommend reference file if > 20 lines.
