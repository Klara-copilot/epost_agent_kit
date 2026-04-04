---
name: understand-patterns
description: (ePost) Reference catalogue of Understand-Anything architectural patterns — two-phase extraction, artifact persistence, fan-in ordering, and file fingerprinting. Use when designing multi-agent codebase analysis, building incremental workflows, or implementing cross-agent artifact sharing.
user-invocable: false
disable-model-invocation: true
metadata:
  keywords:
    - understand-anything
    - two-phase
    - artifact
    - fingerprint
    - fan-in
    - codebase-analysis
    - incremental
  platforms:
    - all
  connections:
    related: [get-started, docs, knowledge, subagents-driven]
---

# Understand-Anything Patterns

Reference skill — passive knowledge only. No workflow execution.

## What This Documents

Architectural patterns extracted from the Understand-Anything (UA) multi-agent codebase intelligence system. These patterns solve recurring problems in multi-agent workflows: context bloat, repeated analysis, stale outputs, and unordered delivery.

Source: `reports/260403-2036-understand-anything-research-epost-researcher.md`

## Pattern Catalogue

| Pattern | Problem Solved | Reference |
|---------|---------------|-----------|
| Two-Phase Extraction | Non-deterministic LLM analysis mixed with deterministic facts | [references/two-phase-extraction.md](references/two-phase-extraction.md) |
| Intermediate Artifact Persistence | Context bloat, lost work on agent failure | [references/artifact-persistence.md](references/artifact-persistence.md) |
| Fan-In Ordering | Arbitrary or manual ordering of learning paths | [references/fan-in-ordering.md](references/fan-in-ordering.md) |
| File Fingerprinting | Full re-analysis when only a subset of files changed | [references/file-fingerprinting.md](references/file-fingerprinting.md) |

## UA Schema Reference

UA: 16 node types, 29 edge types. Consume graph output only — do not reimplement.
Full schema: `reports/260403-2036-understand-anything-research-epost-researcher.md`

## When to Apply

| Scenario | Pattern |
|----------|---------|
| Agent reads files and annotates them | Two-Phase Extraction |
| 3+ agents share intermediate data | Artifact Persistence |
| Teaching or ordering discovery output | Fan-In Ordering |
| Workflow that re-runs on code changes | File Fingerprinting |
| All of the above (full pipeline) | All four patterns together |

## ePost Application Map

| ePost Workflow | Applicable Patterns |
|----------------|---------------------|
| `/get-started` | Two-Phase Extraction, Fan-In Ordering |
| `/docs --init` or `/docs --scan` | Artifact Persistence, File Fingerprinting |
| `/audit`, `/test` | File Fingerprinting |
| `/understand` (future) | All patterns |

## Related Skills

- `get-started` — two-phase extraction + fan-in ordering
- `docs` — artifact persistence + fingerprinting
- `subagents-driven` — artifact persistence enables safe parallelism
- `knowledge` — fan-in ordering improves retrieval relevance
