---
phase: 4
title: "Register Skill + Update Indexes"
effort: 0.5h
depends: [1, 2, 3]
---

# Phase 4: Register Skill + Update Indexes

## Context Links
- [Plan](./plan.md)
- `packages/core/package.yaml:19-43` — skill registration list
- `packages/core/scripts/generate-skill-index.cjs` — CATEGORY_MAP
- `CLAUDE.md` — routing table

## Overview
- Priority: P2
- Status: Pending
- Effort: 0.5h
- Description: Wire skill-creator into package.yaml, skill-index.json generation, and CLAUDE.md routing

## Requirements
### Functional
- `skill-creator` listed in `packages/core/package.yaml` skills array
- `run-skill-eval.cjs` listed in `packages/core/package.yaml` scripts array
- `generate-skill-index.cjs` CATEGORY_MAP maps `skill-creator` to `quality`
- Regenerated `skill-index.json` includes skill-creator
- CLAUDE.md routing mentions skill-creator for eval/quality intents

### Non-Functional
- `skill-index.json` count field accurate after regeneration

## Related Code Files
### Files to Modify
- `packages/core/package.yaml` — add `skill-creator` to skills, `run-skill-eval.cjs` to scripts
- `packages/core/scripts/generate-skill-index.cjs` — add CATEGORY_MAP entry
- `CLAUDE.md` (root) — add routing hint for skill quality intents
- `packages/core/CLAUDE.snippet.md` — add skill-creator to skill list if skill listing exists

### Files to Create
- None

## Implementation Steps

1. **Update `packages/core/package.yaml`**
   - Add `skill-creator` to `provides.skills` array (alphabetical position after `security`)
   - Add `run-skill-eval.cjs` to `scripts` array

2. **Update `generate-skill-index.cjs`**
   - Add `'skill-creator': 'quality'` to CATEGORY_MAP

3. **Regenerate skill-index.json**
   - Run `node packages/core/scripts/generate-skill-index.cjs`
   - Verify `skill-creator` appears with category `quality`
   - Verify count field is accurate

4. **Update CLAUDE.md routing**
   - Add to Intent Map or as a "Less common intents" entry: `"create evals", "test this skill", "measure skill quality" -> skill-creator`
   - Keep minimal — one line addition

5. **Run `epost-kit init`** (if available) to regenerate `.claude/` from packages
   - If not available: note that `.claude/skills/skill-creator/` will appear after next init

## Todo List
- [ ] Add skill-creator to package.yaml skills
- [ ] Add run-skill-eval.cjs to package.yaml scripts
- [ ] Add CATEGORY_MAP entry in generate-skill-index.cjs
- [ ] Regenerate skill-index.json
- [ ] Add routing hint in CLAUDE.md
- [ ] Verify skill-index.json count is accurate

## Success Criteria
- `skill-index.json` lists skill-creator with category=quality
- `package.yaml` has both the skill and script registered
- Routing table mentions skill-creator

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| skill-index count mismatch | Low | Script auto-computes count |
| CLAUDE.md edit conflicts with pending changes | Med | Keep addition to 1 line in "Less common intents" |

## Security Considerations
- None

## Next Steps
- Plan complete. Future work: automated `run_loop` for description optimization (requires LLM calls — out of scope for this plan)
