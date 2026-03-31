# Retro Mode (`--retro`)

Data-driven retrospective from git history. Never hallucinate metrics — if a value can't be computed, mark it `N/A`.

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--period` | `2w` | Period: `7d`, `2w`, `1m` |
| `--compare` | off | Compare with prior equivalent period |
| `--team` | off | Break down metrics per author |
| `--format` | `md` | Output format: `md` or `html` |

## Step 1 — Compute Metrics

Run these commands verbatim. Substitute `<SINCE>` with `--since="7 days ago"`, `--since="2 weeks ago"`, or `--since="1 month ago"` based on `--period`.

```bash
# Total commits in period
git log <SINCE> --oneline | wc -l

# Active development days
git log <SINCE> --format="%ad" --date=short | sort -u | wc -l

# Top 10 hotspot files (most-changed = churn/risk)
git log <SINCE> --name-only --format="" | grep -v "^$" | sort | uniq -c | sort -rn | head -10

# Lines added / deleted
git log <SINCE> --numstat --format="" | awk 'NF==3 {add+=$1; del+=$2} END {print "+" add " -" del}'

# Contributors
git log <SINCE> --format="%aN" | sort -u

# Last tag / release
git describe --tags --abbrev=0 2>/dev/null || echo "no tags"

# Commits since last tag
git log $(git describe --tags --abbrev=0 2>/dev/null)..HEAD --oneline 2>/dev/null | wc -l
```

**Test ratio** (run from repo root):
```bash
echo "Test files: $(find . -name "*.test.*" -o -name "*.spec.*" | grep -v node_modules | wc -l)"
echo "Source files: $(find . \( -name "*.ts" -o -name "*.tsx" -o -name "*.java" -o -name "*.kt" \) -not -name "*.test.*" -not -name "*.spec.*" | grep -v node_modules | wc -l)"
```

**Per-author breakdown** (only if `--team`):
```bash
git log <SINCE> --format="%aN" | sort | uniq -c | sort -rn
```

## Step 2 — Plan Completion (if active plan exists)

Run `node .claude/scripts/get-active-plan.cjs`. If plan found, read its `status.md` and count:
- Phases Done vs total phases
- Output: `{done}/{total} phases complete`

If no plan: mark `N/A`.

## Step 3 — Render Report

```markdown
# Sprint Retrospective — {period}

**Generated**: {date}
**Period**: {start} → {end}

## Velocity

| Metric | Value |
|--------|-------|
| Commits | {n} |
| Active days | {n} / {period-days} |
| Lines +/- | {+n / -n} |
| Contributors | {names} |

## Hotspot Files (Churn Risk)

| File | Changes |
|------|---------|
| {file} | {n} |

## Test Coverage Signal

| Metric | Value |
|--------|-------|
| Test files | {n} |
| Source files | {n} |
| Ratio | {n}% |

## Plan Completion

| Metric | Value |
|--------|-------|
| Phases complete | {n}/{total} |
| Last release | {tag or "no tags"} |
| Unreleased commits | {n} |

## Highlights (manual)

> Add qualitative notes here — what went well, what to improve.
```

## Iron Law

**Every metric must come from a git command.** If a command fails or returns empty:
- Output `N/A` for that field
- Do not estimate or guess
- Do not omit the row — show `N/A` explicitly

This ensures the retro is always accurate and never misleads.
