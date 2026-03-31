# Results Logging

Loop state persisted in `loop-results.tsv` for resumability and reporting.

## File Location

```
{project-root}/loop-results.tsv
```

Create at loop start. Append one row per iteration. Do NOT overwrite between runs (append-only).

## Schema

Tab-separated values (TSV):

```
iteration  description                              metric  result   timestamp
0          baseline                                 67.2    KEEP     2026-03-29T10:00:00Z
1          remove unused parseDate from utils.ts    68.1    KEEP     2026-03-29T10:01:30Z
2          add branch for empty array in filter     68.0    DISCARD  2026-03-29T10:02:45Z
3          cover error path in authMiddleware        69.4    KEEP     2026-03-29T10:04:10Z
```

| Field | Type | Description |
|-------|------|-------------|
| `iteration` | int | 0 = baseline, 1+ = loop iterations |
| `description` | string | Atomic change description (matches commit message) |
| `metric` | float | Verify command output for this iteration |
| `result` | enum | `KEEP` or `DISCARD` |
| `timestamp` | ISO 8601 | UTC timestamp of result |

## Writing Entries

```bash
# Baseline entry
echo -e "0\tbaseline\t${BASELINE}\tKEEP\t$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> loop-results.tsv

# Iteration entry
echo -e "${N}\t${DESC}\t${METRIC}\t${RESULT}\t$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> loop-results.tsv
```

## Reading for Resume

```bash
# Last KEEP iteration
tail -r loop-results.tsv | grep 'KEEP' | head -1

# Count consecutive discards
tail -r loop-results.tsv | awk '{if($4!="DISCARD")exit; count++} END{print count}'

# Total improvement
awk 'NR==1{base=$3} END{printf "%.1f → %.1f\n", base, $3}' loop-results.tsv
```

## Stuck Detection Logic

After each discard, count consecutive discards from the tail of the file:

```javascript
const rows = readTSV('loop-results.tsv').reverse(); // most recent first
let consecutive = 0;
for (const row of rows) {
  if (row.result === 'DISCARD') consecutive++;
  else break; // stop at first KEEP
}
if (consecutive >= 10) stopLoop('plateau');
if (consecutive >= 5) shiftStrategy();
```

## Archiving

After completing a loop, archive or delete `loop-results.tsv` to avoid confusion with future runs:

```bash
mv loop-results.tsv loop-results-$(date +%Y%m%d-%H%M).tsv
```

Or add to `.gitignore` if loop results are transient.
