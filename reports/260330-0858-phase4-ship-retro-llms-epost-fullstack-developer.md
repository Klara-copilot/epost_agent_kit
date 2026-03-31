## Phase Implementation Report
- Phase: phase-4-ship-retro-llms | Plan: plans/260329-1414-claudekit-adoption/ | Status: completed

### Files Modified
- `packages/core/skills/git/SKILL.md` — added `--ship` flag, Ship Pipeline section (9 steps, blocking/non-blocking conditions, token efficiency rules)
- `packages/core/package.yaml` — registered `retro`, `llms`
- `packages/core/scripts/generate-skill-index.cjs` — added retro + llms to CATEGORY_MAP + CONNECTION_MAP
- `packages/core/skills/skill-index.json` — regenerated (31 skills, 21 with connections)
- `.claude/skills/skill-index.json` — synced
- `.claude/skills/git/SKILL.md` — synced

### Files Created
- `packages/core/skills/retro/SKILL.md` — sprint retro skill, git-only metrics, Iron Law (no hallucination), flags: --period/--compare/--team/--format
- `packages/core/skills/llms/SKILL.md` — llmstxt.org spec, sources from docs/index.json KB, generates llms.txt + llms-full.txt
- `.claude/skills/retro/` — synced to output
- `.claude/skills/llms/` — synced to output

### Tasks Completed
- [x] git/SKILL.md extended with --ship flag and full pipeline definition
- [x] retro/SKILL.md created (git-metrics-only, no hallucination rule)
- [x] llms/SKILL.md created (llmstxt.org spec)
- [x] retro + llms registered in package.yaml
- [x] CATEGORY_MAP + CONNECTION_MAP updated
- [x] skill-index.json regenerated and synced
- [x] status.md updated (phase 4 → Done)

### Tests Status
No automated tests for skill files. Index generator ran cleanly: 31 skills indexed, 0 errors.

### Issues Encountered
None.

### Next Steps
Phase 5 (Agent Upgrades): adversarial code review, edge-case scout, cross-plan deps, verification-before-completion, cook hard-gate.
