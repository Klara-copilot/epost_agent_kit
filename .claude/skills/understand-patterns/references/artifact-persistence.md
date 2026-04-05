# Intermediate Artifact Persistence

## Problem

Multi-agent pipelines that pass data through agent context suffer from:
- Context bloat (each agent inherits full prior context)
- Lost work on failure (if Agent 3 fails, Agents 1-2 must re-run)
- No parallelism (agents can't share state without passing it via context)
- Token waste (intermediate data travels through conversation, not disk)

## Pattern

Each agent writes its output to a named JSON file on disk. Downstream agents read from disk, not from context.

**Storage location (UA convention):** `.understand-anything/intermediate/{phase}.json`
**ePost convention:** `.epost-cache/artifacts/{skill}-{slug}.json`

**Protocol:**
1. Agent completes its phase
2. Agent writes structured JSON to artifact file
3. Agent reports: "Output written to `.epost-cache/artifacts/{file}`"
4. Next agent reads the artifact file before starting
5. On re-run: check artifact exists and is fresh → skip phase if unchanged

## Artifact Schema Convention

Every artifact file should include:

```json
{
  "schema": "1.0",
  "agent": "epost-{name}",
  "timestamp": "2026-04-04T07:27:00Z",
  "plan": "plans/{slug}/",
  "payload": { ... }
}
```

`payload` is the phase-specific data. `schema`, `agent`, and `timestamp` are universal metadata.

## ePost Application

```
// docs --init: discovery artifact
epost-researcher writes:
  .epost-cache/artifacts/docs-discovery-{slug}.json

epost-docs-manager reads this artifact before generating KB entries.
On re-run: if artifact is <24h old and no source files changed → skip researcher phase.

// get-started: research report
Currently written to reports/ (Markdown).
Can migrate to .epost-cache/artifacts/ if cross-agent sharing becomes needed.
```

## Recovery Behavior

If a downstream agent starts and the expected artifact is missing:
1. Check if the upstream phase already wrote a partial artifact
2. If partial: resume from last complete entry, not from the beginning
3. If missing: re-run the upstream phase (not the whole pipeline)

## When to Use

- Pipelines with 3+ sequential agents
- Any workflow that may fail partway and need to resume
- Workflows where upstream output is large (>500 lines of structured data)
- Cross-agent data sharing (two agents need the same intermediate output)

## When to Skip

- Single-agent tasks (no cross-agent sharing needed)
- Outputs that are inherently ephemeral (UI state, user choices)
- Artifacts that change every run (no caching benefit)
