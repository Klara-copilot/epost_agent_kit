---
date: 2026-03-31
agent: epost-planner
plan: plans/260331-1232-skill-creator-integration
status: READY
---

# Skill-Creator Integration Plan

## Executive Summary

Plan to bridge Anthropic's Python-based skill-creator toolkit into kit's Node.js hooks/scripts infrastructure. 4 phases, 5h total effort. Creates Node.js wrapper scripts that call Python via `child_process.spawn`, plus a PostToolUse validation hook for SKILL.md files.

## Plan Details

| Phase | What | Effort | Key Files |
|-------|------|--------|-----------|
| 1 | Validation gate — `quick_validate.py` in PostToolUse hook | 1.5h | `hooks/lib/skill-validate.cjs`, `hooks/skill-validation-gate.cjs` |
| 2 | Eval workflow — npm scripts for `run_eval.py` + `aggregate_benchmark.py` | 1.5h | `scripts/run-skill-eval.cjs`, `scripts/run-skill-benchmark.cjs` |
| 3 | Description optimizer — wire `improve_description.py` + `run_loop.py` | 1h | `scripts/run-skill-optimize.cjs`, `scripts/run-skill-improve-desc.cjs` |
| 4 | Report + package — route output to `reports/`, package to `.skill` | 1h | `scripts/run-skill-report.cjs`, `scripts/run-skill-package.cjs` |

## Key Decisions

- **Soft gate, not hard gate**: Validation warns but never blocks writes. epost skills intentionally use non-standard frontmatter fields.
- **spawn, not exec**: All Python bridges use `child_process.spawn` for real-time output and no shell injection risk.
- **Graceful degradation**: Every bridge checks python3 availability first; missing python = warning, not error.

## Verdict

**READY** — No blockers. Python scripts exist and work standalone. Integration is purely bridge/wiring work.

## Unresolved Questions

1. Should validation gate also check skill body structure (headings, length) or only frontmatter?
2. Should `run_eval.py` bridge auto-detect model ID from environment, or always require explicit `--model`?
3. Related plan PLAN-0043 ("Update kit-skill-development with Anthropic skill-creator") and PLAN-0087 ("Adopt Anthropic Skill-Creator Methodology") overlap in scope — may want to consolidate or declare dependency.
