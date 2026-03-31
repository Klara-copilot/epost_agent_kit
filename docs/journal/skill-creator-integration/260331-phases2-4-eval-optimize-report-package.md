# Skill-Creator Integration: Eval, Optimize, Report, Package Bridges

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: skill-creator-integration
**Plan**: plans/260331-1232-skill-creator-integration/

## What was implemented / fixed

Six Node.js bridge scripts wrapping the skill-creator Python toolkit:
- `run-skill-eval.cjs` — run_eval.py
- `run-skill-benchmark.cjs` — aggregate_benchmark.py
- `run-skill-optimize.cjs` — run_loop.py (full optimization loop, writes optimization-output.json)
- `run-skill-improve-desc.cjs` — improve_description.py
- `run-skill-report.cjs` — generate_report.py + auto-registers HTML report in reports/index.json
- `run-skill-package.cjs` — package_skill.py (default output: dist/skills/)

All registered in `packages/core/package.yaml` and synced to `.claude/scripts/`. skill-creator SKILL.md updated with a "Kit Integration" table listing all npm aliases.

## Key decisions and why

- **Decision**: Use `spawn` with `stdio: 'inherit'` throughout
  **Why**: run_loop.py and run_eval.py are long-running (minutes); buffered output would make the terminal appear frozen

- **Decision**: `findSkillCreatorDir()` checks both `.claude/skills/skill-creator` and `packages/core/skills/skill-creator`
  **Why**: Scripts must work whether run from a project with init'd .claude/ or directly from the source repo

- **Decision**: Optimize script writes output JSON to `<skill-path>/optimization-output.json`
  **Why**: Predictable path allows `run-skill-report.cjs` to find it automatically without requiring manual path passing

## What almost went wrong

Python availability check needed to be in each script independently (not imported from skill-validate.cjs) because the bridge scripts live in `scripts/` not `hooks/lib/` — requiring across those directories without a shared module pattern would have created a fragile dependency. Kept `findPython()` as a local helper per script (acceptable duplication given KISS).
