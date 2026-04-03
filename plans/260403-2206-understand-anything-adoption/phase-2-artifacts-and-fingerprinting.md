---
phase: 2
title: "Intermediate Artifacts + File Fingerprinting"
effort: 3.5h
depends: [0]
---

# Phase 2: Intermediate Artifacts + File Fingerprinting

## Context

- Plan: [plan.md](./plan.md)
- Pattern refs: `understand-patterns/references/artifact-persistence.md`, `understand-patterns/references/file-fingerprinting.md`
- Cross-plan: `epost_knowledge_base: plans/260403-1430-frontend-api-discovery/` (modifies `docs/references/init.md` — different file, no conflict)

## Overview

Two capabilities: (A) Intermediate artifact persistence — agents write structured JSON traces to `.epost-cache/` for cross-agent reuse. (B) File fingerprinting — content hash tracking so `/audit`, `/test`, and `/docs` can skip unchanged files.

**Connection to `frontend-api-discovery` plan**: That plan adds a 2-pass discovery algorithm to `docs/references/init.md` (what to scan). This phase adds fingerprinting to `docs/SKILL.md` (when to skip re-scanning). Together: discovery runs once, result cached as artifact — subsequent runs fingerprint-gate the expensive scan and serve from `.epost-cache/` if nothing changed.

## Files to Create

| File | Purpose |
|------|---------|
| `packages/core/skills/core/references/artifact-persistence-protocol.md` | Convention for `.epost-cache/` directory structure, JSON format, cleanup |
| `packages/core/skills/core/references/file-fingerprinting-protocol.md` | Hash algorithm, storage format, cache invalidation rules |

## Files to Modify

| File | Change |
|------|--------|
| `packages/core/skills/audit/SKILL.md` | Add fingerprint check step: skip unchanged files |
| `packages/core/skills/test/SKILL.md` | Add fingerprint check step: skip unchanged test targets |
| `packages/core/skills/debug/SKILL.md` | Add artifact output step: persist trace graph to `.epost-cache/traces/` |
| `packages/core/skills/cook/SKILL.md` | Add artifact consumption: read prior phase outputs from `.epost-cache/` |
| `packages/core/skills/docs/SKILL.md` | Add fingerprint check to `--scan`/`--update`; write discovery result to `.epost-cache/artifacts/docs-discovery-{slug}.json` |

## Artifact Directory Convention

```
.epost-cache/
  fingerprints.json                        # {filePath: {hash, mtime, size}}
  traces/                                  # debug agent trace outputs
    {YYMMDD-HHMM}-{slug}.json
  artifacts/                               # cross-agent intermediate results
    {agent}-{slug}.json
    docs-discovery-{slug}.json             # /docs --init|--scan output (API deps, structure)
```

## Requirements

1. **Fingerprint format**: `{relativePath: {hash: "sha256-hex-first-8", mtime: epoch, size: bytes}}`
2. **Hash computation**: agent runs `shasum -a 256` on changed files; store in `.epost-cache/fingerprints.json`
3. **Skip logic**: before auditing/testing/scanning a file, compare current hash to stored; skip if identical
4. **Artifact format**: JSON with `{agent, timestamp, type, data}` envelope
5. **Docs discovery artifact**: `/docs --init` and `--scan` persist their dependency discovery output to `.epost-cache/artifacts/docs-discovery-{slug}.json` — reusable by planner (knows what APIs exist), researcher (knows KB coverage)
6. **Fingerprint gate for docs**: if source files unchanged since last `--init`/`--scan`, serve cached discovery artifact instead of re-running the expensive 2-pass algorithm (from `frontend-api-discovery` plan)
7. **Cleanup**: artifacts older than 7 days auto-pruned (document convention; agents honor it)
8. **`.gitignore`**: `.epost-cache/` must be gitignored — add note to project `.gitignore` guidance
9. Cross-reference Phase 0 pattern docs

## Cross-Plan Coordination

| Plan | File touched | Section | Order |
|------|-------------|---------|-------|
| `understand-anything` Phase 2 (this) | `docs/SKILL.md` | fingerprint step + artifact write | Either order |
| `frontend-api-discovery` Phase 2 | `docs/references/init.md` | Step 4.5 discovery algorithm | Either order |

No file conflict — safe to execute in either order or in parallel. The fingerprinting step in SKILL.md references the discovery algorithm in `init.md` by name but doesn't duplicate it.

## Acceptance Criteria

- [ ] `.epost-cache/` convention documented in core references
- [ ] `/audit` SKILL.md includes fingerprint skip step
- [ ] `/test` SKILL.md includes fingerprint skip step
- [ ] `/debug` SKILL.md includes trace artifact output step
- [ ] `/cook` SKILL.md includes artifact consumption step
- [ ] `/docs` SKILL.md includes fingerprint gate for `--scan`/`--update` and artifact write for `--init`/`--scan`
- [ ] Docs discovery artifact format specified (connects to `frontend-api-discovery` output schema)
- [ ] Fingerprint JSON format specified with example
- [ ] `epost-kit verify` passes
