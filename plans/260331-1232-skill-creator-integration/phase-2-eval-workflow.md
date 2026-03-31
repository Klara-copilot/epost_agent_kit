---
phase: 2
title: "Eval Workflow — npm scripts for run_eval + aggregate_benchmark"
effort: 1.5h
depends: [1]
---

# Phase 2: Eval Workflow

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/skill-creator/scripts/run_eval.py` — eval runner
- `packages/core/skills/skill-creator/scripts/aggregate_benchmark.py` — benchmark aggregator
- `packages/core/skills/skill-creator/SKILL.md:228-232` — existing invocation pattern

## Overview
- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Create Node.js bridge scripts that wrap Python eval/benchmark tools. Register as npm scripts for local dev use.

## Requirements

### Functional
- `npm run skill:eval -- <skill-path> [--model <id>]` runs evaluation suite
- `npm run skill:benchmark -- <workspace>/iteration-N [--skill-name <name>]` runs aggregation
- Both validate python3 availability before attempting spawn
- Pass through all CLI args to Python scripts
- Capture and display output in real-time (pipe stdout/stderr)

### Non-Functional
- Bridge scripts under 80 LOC each
- No new npm dependencies (use child_process only)

## Related Code Files

### Files to Create
- `packages/core/scripts/run-skill-eval.cjs` — Bridge for `run_eval.py`
- `packages/core/scripts/run-skill-benchmark.cjs` — Bridge for `aggregate_benchmark.py`

### Files to Modify
- Root `package.json` — Add `skill:eval` and `skill:benchmark` scripts (if exists; otherwise document manual invocation)
- `packages/core/package.yaml` — Register new scripts in `scripts:` list

### Files to Delete
- None

## Implementation Steps

1. **Create `run-skill-eval.cjs`**
   - Parse CLI args: `--skill-path` (required), `--model` (optional, defaults to current)
   - Resolve python module path: `python3 -m scripts.run_eval` with cwd set to skill-creator dir
   - Use `child_process.spawn` with `{ stdio: 'inherit' }` for real-time output
   - Exit with Python process exit code

2. **Create `run-skill-benchmark.cjs`**
   - Parse CLI args: workspace path (required), `--skill-name` (optional)
   - Resolve: `python3 -m scripts.aggregate_benchmark <workspace> --skill-name <name>`
   - Same spawn pattern as eval script

3. **Register in package.yaml**
   - Add to `scripts:` list:
     - `run-skill-eval.cjs`
     - `run-skill-benchmark.cjs`

4. **Python environment check**
   - Shared helper: `checkPython()` in `packages/core/hooks/lib/skill-validate.cjs` (reuse from Phase 1)
   - If missing: print install instructions and exit 1

## Todo List
- [ ] Create `packages/core/scripts/run-skill-eval.cjs`
- [ ] Create `packages/core/scripts/run-skill-benchmark.cjs`
- [ ] Register scripts in `packages/core/package.yaml`
- [ ] Test: `node .claude/scripts/run-skill-eval.cjs --help` shows usage
- [ ] Test: run eval on a test skill with evals.json

## Success Criteria
- Devs can run skill evals from project root without knowing Python paths
- Real-time output visible (not buffered)
- Missing python3 gives actionable error message

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `run_eval.py` needs `claude -p` CLI | High | Document prerequisite; check `claude` on PATH |
| Python module path resolution | Med | Set cwd to skill-creator dir, use `-m scripts.run_eval` |

## Security Considerations
- Scripts pass user-provided paths to Python subprocess — paths are validated by Python script
- No shell interpolation (use spawn, not exec)
