# Autonomous Loop Protocol

8-phase iteration spec for metric-improvement loops.

## Phase 0 — Baseline

Before starting iterations:
1. Run Verify command → record baseline metric as `M0`
2. Run Guard command → confirm it passes (if guard fails at baseline, fix before looping)
3. Log: `loop-results.tsv` entry: `0 | baseline | {M0} | KEEP`
4. Report: "Baseline: {metric} = {M0}. Target: {goal}. Starting {N} iterations."

## Phase 1 — Strategy Selection

Choose a strategy for the first iteration batch. Strategies (ranked by risk):
1. **Remove dead code** — safest, always try first
2. **Improve existing logic** — moderate risk
3. **Restructure** — higher risk, more impactful
4. **Add missing coverage** — for coverage loops only
5. **Dependency optimization** — for bundle size loops only

## Phase 2 — Atomic Change

Make ONE change. Define "atomic" as:
- Single logical operation (add one test, remove one dead function, fix one lint error)
- Single file preferred; multi-file only if logically inseparable
- Describable in one sentence without "and"

## Phase 3 — Commit

```bash
git add -p   # Interactive staging — review what you're committing
git commit -m "loop[{n}/{N}]: {one-sentence description}"
```

Commit message format: `loop[3/10]: remove unused parseDate utility from utils.ts`

## Phase 4 — Verify

Run Verify command. Capture result as `Mn`.

Record delta: `Δ = Mn - M{n-1}` (positive = improvement for "increase" direction).

## Phase 5 — Guard

Run Guard command. Must exit 0.

If guard fails:
- Discard immediately (proceed to Phase 6)
- Do NOT attempt to fix the failure — it indicates the change was too large or wrong

## Phase 6 — Keep or Discard

**KEEP** if: `Δ ≥ Min-Delta` AND guard passed
```bash
# Log and continue
echo "{n}\t{description}\t{Mn}\tKEEP" >> loop-results.tsv
```

**DISCARD** if: `Δ < Min-Delta` OR guard failed
```bash
git revert HEAD --no-edit
echo "{n}\t{description}\t{Mn}\tDISCARD" >> loop-results.tsv
```

## Phase 7 — Stuck Check

After each discard, increment consecutive-discard counter:
- At 5: log "Strategy shift at iteration {n}" and pick a new strategy from Phase 1
- At 10: STOP — emit Phase 8 report

## Phase 8 — Completion Report

```markdown
## Loop Results: [Goal]

- Iterations: {completed}/{N}
- Baseline: {M0} → Final: {Mfinal}
- Total improvement: {Δtotal}
- Kept: {kept_count} / Discarded: {discarded_count}
- Stopped: [goal reached | N exhausted | plateau detected]

### Change Log
| Iter | Change | Metric | Result |
|------|--------|--------|--------|
| 1 | ... | ... | KEEP |
...
```
