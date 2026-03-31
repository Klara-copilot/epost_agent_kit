---
plan: 260331-1232-skill-creator-integration
updated: 2026-03-31
---

# Status: Skill-Creator Integration

## Progress

| Phase | Title | Status |
|-------|-------|--------|
| 1 | Validation Gate | Done |
| 2 | Eval workflow | Done |
| 3 | Description optimizer wiring | Done |
| 4 | Report + package pipeline | Done |

## Key Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-03-31 | Classify "Unexpected key(s)" as INFO when all keys are epost-standard | epost adds 10+ extra fields; marking them as warnings would be noise for every SKILL.md edit |
| 2026-03-31 | Hook matcher uses separate `Write\|Edit` entry, not merged into existing `Edit\|Write\|MultiEdit` entry | Keeps skill-validation concern isolated; easier to remove or tune independently |
| 2026-03-31 | Bridge scripts use `spawn` with `stdio: 'inherit'` not `execSync` | Real-time output required; eval/optimize scripts are long-running (minutes) |
| 2026-03-31 | `run-skill-optimize.cjs` writes JSON to `<skill-path>/optimization-output.json` | Predictable path enables `run-skill-report.cjs` to auto-find it without manual path passing |

## Architecture Reference

```
PostToolUse(Write|Edit on **/SKILL.md)
  └── skill-validation-gate.cjs (hook entry)
        └── lib/skill-validate.cjs (python bridge)
              └── python3 quick_validate.py <skillDir>
                    └── exit 0 = valid, exit 1 = issues
                          → classify: ERROR if missing required fields
                          → INFO if only epost extra fields flagged
```

## Known Bugs
(none)

## Recently Fixed
(none)
