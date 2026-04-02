---
phase: 6
title: "research — --optimize autonomous iteration loop"
effort: 30m
depends: []
---

# Phase 6: Research --optimize Loop

Adapted from claudekit's `ck:autoresearch` pattern: an autonomous optimization loop that runs N iterations with a mechanical stop condition.

## Files to Modify

- `packages/core/skills/research/SKILL.md`

## Change

Add `--optimize` flag section to the research skill:

```markdown
## --optimize Flag

Autonomous iterative research loop. Use when the user wants to keep improving a result until a measurable threshold is met.

### Usage
```
/research --optimize [--iterations N] [--goal "description"] <topic>
```

### Protocol

1. **Baseline**: Run standard research, store result as iteration 0.
2. **Loop** (up to N iterations, default 5):
   a. Identify the weakest section based on: missing sources, low confidence claims, unanswered questions.
   b. Run targeted follow-up research to address the weakest section.
   c. Merge findings into the result.
   d. Evaluate: count remaining open questions + low-confidence claims.
3. **Stop conditions** (any one):
   - 0 open questions AND 0 low-confidence claims remaining
   - N iterations reached
   - Two consecutive iterations with no improvement (stuck detection)
4. **Output**: Final result + iteration summary (what improved each round, final quality score).

### Quality Score

```
Score = (sources cited / claims made) × (1 - open_questions / total_questions)
```

Pass threshold: score ≥ 0.8 OR open_questions = 0.

### Flags

| Flag | Default | Behavior |
|------|---------|---------|
| `--iterations N` | 5 | Max iteration cap |
| `--goal "text"` | none | Natural language stop condition (agent judges when met) |
| `--commit` | false | Commit research output to `reports/` after completion |
```

## Todo

- [ ] Read research/SKILL.md fully before editing
- [ ] Add `--optimize` to the flags table in SKILL.md
- [ ] Add `## --optimize Flag` section with protocol, stop conditions, quality score

## Success Criteria

- SKILL.md flags table includes `--optimize`
- Protocol section has stuck detection (2 consecutive no-improvement)
- Stop conditions explicitly listed
- Quality score formula present

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Loop runs indefinitely | High | Hard cap at N iterations + stuck detection |
| Quality score formula too mechanical | Low | `--goal` flag provides natural-language override |

## Security Considerations

- `--commit` flag writes to `reports/` only — no production paths.
