---
phase: 8
title: "retro — New data-driven retrospective skill"
effort: 45m
depends: []
---

# Phase 8: Retro Skill

Adapted from claudekit's `ck:retro` pattern. Creates a new `/retro` skill that generates data-driven retrospectives from git metrics.

## Files to Create / Modify

- `packages/core/skills/retro/SKILL.md` (create)
- `packages/core/skills/retro/references/metrics.md` (create)
- `packages/core/package.yaml` (modify — add `retro` to provides.skills)

## Changes

### 1. retro/SKILL.md

```yaml
---
name: retro
description: Use when asked for a retrospective, sprint review, team metrics, or 'how did we do' analysis. Generates data-driven insights from git history.
version: 1.0.0
user-invocable: true
context: fork
agent: epost-researcher
---
```

Content:
```markdown
# Retro Skill

Generates data-driven retrospectives from git history metrics.

## Flags

| Flag | Description |
|------|-------------|
| `--since DATE` | Start date (default: 2 weeks ago) |
| `--until DATE` | End date (default: today) |
| `--compare` | Compare this period to previous equal period |
| `--team` | Break down metrics per author |
| `--format report\|table\|brief` | Output format (default: report) |

## Protocol

See `references/metrics.md` for the full metric extraction and reporting protocol.
```

### 2. retro/references/metrics.md

```markdown
# Retro Metrics Protocol

## Step 1 — Extract Git Metrics

```bash
# Commits per day
git log --since="DATE" --until="DATE" --format="%ad" --date=short | sort | uniq -c

# LOC delta
git log --since="DATE" --until="DATE" --shortstat | grep -E "insertions|deletions"

# Commit type distribution (conventional commits)
git log --since="DATE" --until="DATE" --format="%s" | sed 's/(.*//' | sort | uniq -c | sort -rn

# Hotspot files (most-changed)
git log --since="DATE" --until="DATE" --name-only --format="" | sort | uniq -c | sort -rn | head -10

# Authors (--team mode only)
git log --since="DATE" --until="DATE" --format="%an" | sort | uniq -c | sort -rn
```

## Step 2 — Compute Summary Stats

| Metric | Formula |
|--------|---------|
| Velocity | total commits / calendar days |
| Churn rate | (deletions / insertions) × 100% |
| Focus score | top 3 files LOC delta / total LOC delta |
| Commit health | feat+fix / total commits |

## Step 3 — Identify Patterns

- **Hotspot risk**: file changed 5+ times → flag as refactor candidate
- **Commit type skew**: chore/docs > 40% → flag low feature velocity
- **Velocity cliff**: commits/day drops >50% mid-period → flag blockers
- **High churn**: churn rate > 60% → flag instability

## Step 4 — Compare Period (--compare)

For each metric: compute delta % vs prior period. Flag regressions (velocity -20%, churn +20%).

## Step 5 — Report Format

```
## Retrospective: DATE_FROM → DATE_TO

### Summary
- X commits over Y days (Z/day velocity)
- +A insertions / -B deletions (C% churn)
- Top commit types: feat (N), fix (N), chore (N)

### Hotspot Files
1. path/to/file — N changes

### Patterns
- [finding]

### Recommendations
- [actionable]
```
```

### 3. package.yaml — add retro

Add `retro` to the `provides.skills` list.

## Todo

- [ ] Create `packages/core/skills/retro/` directory
- [ ] Create `retro/SKILL.md` with frontmatter + flags table + protocol reference
- [ ] Create `retro/references/metrics.md` with 5-step protocol
- [ ] Read package.yaml and add `retro` to provides.skills

## Success Criteria

- `/retro` is user-invocable
- `--since`, `--until`, `--compare`, `--team`, `--format` flags documented
- Metrics extraction uses standard git commands (no external tools)
- Hotspot, churn, velocity metrics all present
- package.yaml updated

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| git log commands vary by repo/platform | Medium | Use POSIX-compatible flags, skip gracefully if no history |
| LOC delta parsing brittle | Low | Use `--shortstat` format which is stable |
| `--compare` requires 2× the date range | Low | Documented in flags table |

## Security Considerations

- Reads git history only — no file content exposed.
- `--team` mode shows author names — note this in skill description.
