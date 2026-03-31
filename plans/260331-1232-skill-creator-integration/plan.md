---
title: "Integrate Skill-Creator Python Scripts into Kit Hooks/Scripts"
status: active
created: 2026-03-31
updated: 2026-03-31
effort: 5h
phases: 4
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

## Problem

Anthropic's skill-creator toolkit (`packages/core/skills/skill-creator/scripts/`) provides Python-based validation, eval, benchmarking, and packaging tools. These run standalone but are not wired into kit infrastructure (Node.js hooks, npm scripts, report pipeline). Devs must manually invoke Python scripts with correct paths.

## Success Criteria

- `quick_validate.py` runs automatically when SKILL.md written/edited (soft gate, non-blocking)
- `run_eval.py` + `aggregate_benchmark.py` accessible via npm script
- `generate_report.py` output routed to `reports/` with correct naming
- `package_skill.py` wirable from skill-creator skill flow
- Python availability checked gracefully; all bridges degrade to warning if python3 missing

## Key Dependencies

- Python 3 on dev machine (PyYAML for quick_validate)
- `packages/core/hooks/lib/build-gate.cjs` — existing hook pattern for subprocess calls
- `packages/core/skills/skill-creator/SKILL.md` — skill-creator workflow references
- `packages/core/package.yaml` — scripts registration

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Validation gate | 1.5h | pending | [phase-1](./phase-1-validation-gate.md) |
| 2 | Eval workflow | 1.5h | pending | [phase-2](./phase-2-eval-workflow.md) |
| 3 | Description optimizer wiring | 1h | pending | [phase-3](./phase-3-description-optimizer.md) |
| 4 | Report + package pipeline | 1h | pending | [phase-4](./phase-4-report-package-pipeline.md) |

## Critical Constraints

- epost skills use extra frontmatter fields (`user-invocable`, `tier`, `context`, `agent`) that `quick_validate.py` flags as non-standard. Validation gate must distinguish spec-compliance warnings from hard errors.
- All Python calls via `child_process.spawn`/`execSync` with timeout + error capture.
- Hook must not block writes on validation failure (soft gate = warn, not reject).
- `packages/core/` is source of truth, never edit `.claude/` directly.

## Architecture

```
Hook trigger (PostToolUse:Write/Edit on SKILL.md)
  └── skill-validate.cjs (new)
        └── child_process.spawn('python3', ['quick_validate.py', skillDir])
              └── parse exit code + stdout → JSON result
                    └── stderr warning if non-standard fields (expected for epost)
                    └── hard error if missing name/description

npm run skill:eval -- <skill-path>
  └── node scripts/run-skill-eval.cjs
        └── spawn python3 -m scripts.run_eval ...

npm run skill:report -- <workspace>
  └── node scripts/run-skill-report.cjs
        └── spawn python3 -m scripts.generate_report ...
              └── output → reports/YYMMDD-HHMM-{skill}-skill-eval.html
```
