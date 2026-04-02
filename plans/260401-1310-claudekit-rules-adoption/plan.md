---
title: "Adopt claudekit rules patterns into epost_agent_kit"
status: active
created: 2026-04-01
updated: 2026-04-01
effort: 7h15m
phases: 12
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# claudekit Rules Adoption

Adopting 5 patterns from claudekit's rules files that fill genuine gaps in epost_agent_kit's workflows.

## Source

**Rules files** (phases 1-5):
- `/Users/than/Projects/claudekit/.claude/rules/primary-workflow.md`
- `/Users/than/Projects/claudekit/.claude/rules/development-rules.md`
- `/Users/than/Projects/claudekit/.claude/rules/orchestration-protocol.md`
- `/Users/than/Projects/claudekit/.claude/rules/documentation-management.md`

**Workflow patterns** (phases 6-10):
- `ck:autoresearch` → phase 6 (`/research --optimize`)
- `ck:ship` → phase 7 (`/git --ship` pipeline)
- `ck:retro` → phase 8 (`/retro` skill)
- `ck:coding-level` → phase 9 (`/output-mode` skill — replaced 0-5 levels with 3 opinionated modes: Exec/Teach/Transparency)
- `ck:predict` → phase 10 (`--predict` mode in plan/brainstorm — trimmed to 3 personas)
- `find-skills` → **skipped** (epost is internal-only, no external marketplace)

**Architecture adoption** (phase 12):
- claudekit `.claude/rules/` pattern → `packages/core/rules/` installed to `.claude/rules/` via package.yaml

## Phases

### Rules Adoption (from claudekit rules files)

| # | Phase | Files | Effort | Status |
|---|-------|-------|--------|--------|
| 1 | cook — Anti-Rationalization + Mandatory Finalize + --auto | cook/SKILL.md, fast-mode.md, parallel-mode.md | 45m | done |
| 2 | plan — Parallel-mode phase template completeness | plan/references/parallel-mode.md | 20m | pending |
| 3 | preview — Wire into routing table | CLAUDE.snippet.md, preview/SKILL.md | 15m | pending |
| 4 | orchestration — Docs Impact Assessment section | orchestration.md | 15m | pending |
| 5 | git — Lint gate pre-commit + test gate pre-push | git/references/commit.md, push.md | 20m | pending |

### Workflow Adoption (from claudekit workflow patterns)

| # | Phase | Files | Effort | Status |
|---|-------|-------|--------|--------|
| 6 | research — --optimize autonomous iteration loop | research/SKILL.md | 30m | pending |
| 7 | git — Enhanced --ship pipeline (merge → test → review → commit → push → PR) | git/SKILL.md, epost-git-manager.md | 30m | pending |
| 8 | retro — Data-driven retrospective skill | retro/SKILL.md, retro/references/metrics.md, package.yaml | 45m | pending |
| 9 | output-mode — 3-mode output style (Exec / Teach / Transparency) + session hook | output-mode/SKILL.md, references/exec\|teach\|transparency.md, session-init.cjs, package.yaml | 35m | pending |
| 10 | debate — 5-persona expert debate (Architect/Security/Performance/UX/Devil's Advocate) | plan/SKILL.md, debate-mode.md, brainstorm/SKILL.md | 30m | pending |
| 11 | journal — Standalone reflective journal skill | journal/SKILL.md, package.yaml | 25m | pending |
| 12 | rules/ — Always-on agent dispatch + development rules (claudekit pattern) | packages/core/rules/*.md, package.yaml | 45m | done |

## Validation Summary

**Q: Should cook `--auto` require a named review score or just "0 critical issues"?**
→ Use "0 critical issues" only — no numeric score threshold. Simple and agent-readable.

**Q: Should simplification step invoke the simplify skill (fork) or run inline?**
→ Inline check — not a full skill fork. Just: check duplication, over-engineering, line counts.

**Q: Preview routing — inline or via agent?**
→ Inline. Preview has no `context: fork`. CLAUDE.snippet.md entry routes direct to skill.

**Q: Git test gate — new script or platform detection?**
→ Platform detection inline in push.md (npm test / gradle test). No new script needed.
