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
