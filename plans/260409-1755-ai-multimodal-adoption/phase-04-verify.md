---
phase: 4
title: Verify (kit-verify, skill-index regen, plan activation)
effort: 20m
depends: [3]
---

## Context

Final verification phase. Regenerates the skill index, runs kit-verify, updates `plans/index.json`, and activates this plan.

## Files (ownership — exclusive to Phase 4)

- `.claude/skills/skill-index.json` (regenerated — NOT hand-edited)
- `plans/index.json` (append entry)
- `plans/260409-1755-ai-multimodal-adoption/plan.md` (status stamp via script only)

## Tasks

1. From repo root run:
   ```bash
   node .claude/scripts/generate-skill-index.cjs
   ```
   Confirm exit 0. Grep `.claude/skills/skill-index.json` for `ai-multimodal` — must be present.
2. Run kit-verify:
   ```bash
   node packages/core/scripts/verify.cjs
   ```
   Read full output. Acceptable outcomes:
   - Pass → proceed.
   - New errors only on `ai-multimodal` frontmatter → fix in `packages/core/skills/ai-multimodal/SKILL.md` (NOT `.claude/`), regenerate, retry (max 3 iterations).
   - Pre-existing unrelated errors → note and proceed (not this plan's responsibility).
3. Update `plans/index.json`:
   - Bump `counts.active` by 1, `counts.total` by 1.
   - Update `updated` to `2026-04-09`.
   - Insert new plan entry at top of `plans` array:
     ```json
     {
       "id": "PLAN-0105",
       "title": "Adopt external ai-multimodal skill into packages/core",
       "type": "implementation",
       "status": "active",
       "created": "2026-04-09",
       "authors": ["epost-planner"],
       "tags": ["skill-adoption", "python", "gemini", "multimodal", "packages-core"],
       "file": "plans/260409-1755-ai-multimodal-adoption/plan.md"
     }
     ```
   - Verify next plan ID by reading current max ID in file before assigning.
4. Activate the plan:
   ```bash
   node .claude/scripts/set-active-plan.cjs plans/260409-1755-ai-multimodal-adoption
   ```
5. Do NOT commit. User will decide whether to commit via `epost-git-manager`.

## Validation

- [ ] `skill-index.json` contains `ai-multimodal` entry with correct path.
- [ ] `verify.cjs` exits 0 (or only pre-existing unrelated warnings).
- [ ] `plans/index.json` contains new PLAN-0xxx entry for this plan.
- [ ] `plan.md` frontmatter shows `status: active`.
- [ ] No writes to `.claude/` other than `skill-index.json` (script-generated) and `plan.md` stamp.

## Success Criteria

- All plan success criteria from `plan.md` satisfied.
- Kit passes verification.
- Plan is active and ready for `/cook` or direct git commit.
- User notified: "ai-multimodal adopted into packages/core. Run `/git --commit` to ship."
