---
phase: 3
title: "Description Optimizer — wire improve_description + run_loop"
effort: 1h
depends: [2]
---

# Phase 3: Description Optimizer Wiring

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/skill-creator/scripts/improve_description.py` — standalone optimizer
- `packages/core/skills/skill-creator/scripts/run_loop.py` — iterative improvement loop
- `packages/core/skills/skill-creator/SKILL.md:336-404` — description optimization flow

## Overview
- Priority: P2
- Status: Pending
- Effort: 1h
- Description: Wire `improve_description.py` and `run_loop.py` into the skill-creator skill invocation flow so they are discoverable and correctly pathed.

## Requirements

### Functional
- `npm run skill:optimize -- <skill-path> --eval-set <path> [--model <id>] [--max-iterations 5]` invokes `run_loop.py`
- `npm run skill:improve-desc -- <skill-path>` invokes `improve_description.py`
- Skill-creator SKILL.md references these npm scripts as the preferred invocation method
- `run_loop.py` output (JSON) captured for downstream report generation

### Non-Functional
- Bridge script under 60 LOC
- Real-time output via `stdio: 'inherit'`

## Related Code Files

### Files to Create
- `packages/core/scripts/run-skill-optimize.cjs` — Bridge for `run_loop.py`
- `packages/core/scripts/run-skill-improve-desc.cjs` — Bridge for `improve_description.py`

### Files to Modify
- `packages/core/package.yaml` — Register new scripts
- `packages/core/skills/skill-creator/SKILL.md` — Add "Kit Integration" section documenting npm script aliases

### Files to Delete
- None

## Implementation Steps

1. **Create `run-skill-optimize.cjs`**
   - Parse: `--skill-path`, `--eval-set`, `--model`, `--max-iterations`, `--verbose`
   - Spawn: `python3 -m scripts.run_loop --eval-set <eval> --skill-path <skill> --model <model> --max-iterations <n>`
   - Capture JSON output to temp file for Phase 4 report generation
   - Set cwd to skill-creator scripts parent directory

2. **Create `run-skill-improve-desc.cjs`**
   - Parse: skill path (positional arg)
   - Spawn: `python3 -m scripts.improve_description <skill-path>`
   - Pipe stdio directly

3. **Register scripts in package.yaml**
   - Add `run-skill-optimize.cjs` and `run-skill-improve-desc.cjs`

4. **Update skill-creator SKILL.md**
   - Add section: "## Kit Integration — npm Script Aliases"
   - Table mapping npm scripts to Python scripts
   - Note: scripts require `python3` + `pyyaml` + `claude` CLI on PATH

## Todo List
- [ ] Create `packages/core/scripts/run-skill-optimize.cjs`
- [ ] Create `packages/core/scripts/run-skill-improve-desc.cjs`
- [ ] Register in `packages/core/package.yaml`
- [ ] Add Kit Integration section to skill-creator SKILL.md
- [ ] Test: run optimize on a test skill

## Success Criteria
- `run_loop.py` accessible without knowing Python module paths
- JSON output captured for report pipeline
- Skill-creator SKILL.md documents all available npm aliases

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `run_loop.py` long-running (minutes) | Med | Use spawn with inherited stdio; add `--verbose` by default |
| Model ID mismatch | Low | Default to env var or explicit `--model` flag |

## Security Considerations
- None beyond standard subprocess spawning
