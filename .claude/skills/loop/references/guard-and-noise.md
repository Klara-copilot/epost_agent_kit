# Guard and Noise

Regression guards prevent improvements from breaking existing functionality. Noise tolerance prevents false discards from metric fluctuation.

## Guard Command Design

The guard must:
1. Exit 0 on pass, non-zero on fail
2. Complete in < 60 seconds (or loop becomes impractical)
3. Cover the minimum necessary — not the full test suite

### Recommended Guards by Loop Type

| Loop Goal | Guard Command |
|-----------|--------------|
| Test coverage | `npm test -- --passWithNoTests` |
| Bundle size | `npm run build` |
| Lint errors | `npm run typecheck` |
| Lighthouse score | `npm run build && npm run start & sleep 5 && curl -s http://localhost:3000 > /dev/null` |
| Custom | Any command exiting 0/non-zero |

### Fast Guards

For slow test suites, use a scoped guard:

```bash
# Only test changed files
npx jest --findRelatedTests $(git diff --name-only HEAD~1) --passWithNoTests

# Only test a specific module
npx jest src/auth/ --passWithNoTests
```

### Guard Failure = Discard

When the guard fails, discard immediately — do NOT try to fix the failing guard:
- Guard failure means the change broke something
- Attempting to fix the guard in the same iteration violates atomicity
- Start a new iteration with a more conservative approach

## Noise Tolerance

Some metrics fluctuate between identical runs. This causes false discards.

### Identifying Noise

Run the Verify command 3x without making any changes. If results vary:
- Coverage: usually stable (deterministic)
- Bundle size: ±1-5kB from chunk splitting variance
- Lighthouse: ±3-5 points from network timing
- Lint: fully deterministic (0 noise)

### Setting Min-Delta

Set `Min-Delta` above the noise floor:

```
Min-Delta = (max_observed - min_observed) * 1.5 + 1 unit
```

Example: Lighthouse scores over 3 runs: 82, 84, 83
```
Noise floor = 84 - 82 = 2
Min-Delta = 2 * 1.5 + 1 = 4 points
```

So only accept improvements ≥ 4 Lighthouse points to avoid keeping noisy changes.

### Smoothing (Advanced)

For high-noise metrics, run Verify 3x and take the median:

```bash
# Run lighthouse 3 times, take median
for i in 1 2 3; do npx lighthouse http://localhost:3000 --output json --quiet 2>/dev/null | jq '.categories.performance.score * 100 | round'; done | sort -n | sed -n '2p'
```

This costs 3x verification time but eliminates false discards from noise.

## Noise vs Plateau

| Signal | Interpretation |
|--------|---------------|
| Random discards (not consecutive) | Noise — increase Min-Delta |
| Consecutive discards (same strategy) | Plateau — shift strategy |
| Consecutive discards (all strategies) | True plateau — stop |
