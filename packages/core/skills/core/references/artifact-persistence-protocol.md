# Artifact Persistence Protocol

## Purpose

Convention for `.epost-cache/` shared artifact directory — cross-agent intermediate results, debug traces, and fingerprints.

## Directory Structure

```
.epost-cache/
  fingerprints.json                     # file hash store (see file-fingerprinting-protocol.md)
  traces/                               # debug agent outputs
    {YYMMDD-HHMM}-{slug}.json
  artifacts/                            # cross-agent results
    {agent}-{slug}.json
    docs-discovery-{slug}.json          # /docs --init|--scan output
```

## Artifact Envelope Format

Every file in `artifacts/` and `traces/` MUST use this envelope:

```json
{
  "schema": "1.0",
  "agent": "epost-{name}",
  "timestamp": "2026-04-04T07:47:00Z",
  "type": "debug-trace | docs-discovery | phase-output | ...",
  "data": { }
}
```

| Field | Type | Required |
|-------|------|----------|
| `schema` | string | Yes — always `"1.0"` |
| `agent` | string | Yes — `epost-{agent-name}` |
| `timestamp` | ISO 8601 | Yes |
| `type` | string | Yes — describes payload shape |
| `data` | object | Yes — phase-specific payload |

## Reading Artifacts

Before starting a phase, check for prior output:

```bash
# Check if artifact exists and is fresh (< 24h)
ls -la .epost-cache/artifacts/{agent}-{slug}.json
```

Read with: `Read(".epost-cache/artifacts/{agent}-{slug}.json")`

Freshness rule: artifact is valid if `timestamp` is within 24 hours of current time.

## Writing Artifacts

After completing a phase:

1. Compute `{slug}` from plan name or task description (kebab-case, max 30 chars)
2. Write to `.epost-cache/artifacts/{agent}-{slug}.json`
3. Report: "Output written to `.epost-cache/artifacts/{file}`"

## Cleanup Rule

Artifacts older than 7 days MUST be pruned before writing new ones.

```bash
# Find and remove artifacts older than 7 days
find .epost-cache/ -name "*.json" -mtime +7 -not -name "fingerprints.json" -delete
```

Fingerprints are exempt from cleanup — they accumulate and are valid until file content changes.

## .gitignore

`.epost-cache/` MUST be excluded from version control. Add to project `.gitignore`:

```
.epost-cache/
```

## Recovery

If downstream agent starts and expected artifact is missing:
1. Check for partial artifact — resume from last complete entry if present
2. If fully missing — re-run upstream phase only, not the whole pipeline

## Cross-References

- `understand-patterns/references/artifact-persistence.md` — pattern rationale and recovery behavior
- `core/references/file-fingerprinting-protocol.md` — fingerprint format and skip logic
