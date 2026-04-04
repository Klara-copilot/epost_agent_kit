---
name: docs
description: "(ePost) Use when: \"write docs\", \"update docs\", \"document this\", \"init docs\", \"reorganize documentation\", \"add component docs\". Detects docs intent (init, update, migrate, component) and runs the right workflow."
argument-hint: "[--init | --migrate | --reorganize | --scan | --verify | --batch [category]]"
user-invocable: true
context: fork
agent: epost-docs-manager
metadata:
  keywords:
    - docs
    - documentation
    - knowledge-base
    - kb-init
    - changelog
  triggers:
    - /docs
    - document this
    - update docs
    - init knowledge base
    - write documentation
  connections:
    enhances: []
    requires: [knowledge]
---

## Delegation — REQUIRED

This skill MUST run via `epost-docs-manager`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/docs`
- **Arguments**: `$ARGUMENTS` (full argument string from Skill invocation)
- If no arguments: state "no arguments — use auto-detection"

# Docs — Unified Documentation Command

Auto-detect and execute the appropriate documentation workflow following `knowledge/references/knowledge-base.md` structure.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--init`: load `references/init.md`, execute in generation mode.
If `$ARGUMENTS` starts with `--migrate`: load `references/init.md`, execute in migrate mode.
If `$ARGUMENTS` starts with `--reorganize`: load `references/update.md`, execute in reorganize mode.
If `$ARGUMENTS` starts with `--scan`: load `references/update.md`, execute in scan mode.
If `$ARGUMENTS` starts with `--verify`: load `references/update.md`, execute in verify mode.
If `$ARGUMENTS` starts with `--batch`: load `references/component.md`, execute in batch mode. Pass remaining args as category filter.
If `$ARGUMENTS` starts with `--llms`: load `references/llms.md`, generate llms.txt output.
Otherwise: continue to Auto-Detection.

## Aspect Files

| File | Purpose |
|------|---------|
| `references/init.md` | Scan codebase and generate or migrate KB documentation |
| `references/update.md` | Update, scan, verify, or reorganize existing documentation |
| `references/component.md` | Document a klara-theme component (Figma data + prop mapping) |
| `references/coauthoring.md` | Collaborative doc writing workflow (PRD, RFC, ADR, spec) |
| `references/llms.md` | Generate llms.txt / llms-full.txt (llmstxt.org spec) |

## Fingerprint Gate (--scan / --update)

Before scanning source files, check `.epost-cache/fingerprints.json`:

1. If file exists: load stored hashes
2. For each source file in scan scope: run `shasum -a 256 <file> | cut -c1-8` and compare
3. Skip files where hash matches — log `"unchanged: {path}"`
4. Scan only changed files; merge results with prior cached analysis
5. After scan: update `.epost-cache/fingerprints.json` with new hashes

If a matching `docs-discovery-{slug}.json` artifact exists in `.epost-cache/artifacts/` and is < 24h old AND all source files are unchanged (all hashes match): skip the scan entirely and serve from cache.

See `core/references/file-fingerprinting-protocol.md` for hash format and skip logic.

## Discovery Artifact Write (--init / --scan)

After completing `--init` or `--scan`, persist discovery output:

```
File: .epost-cache/artifacts/docs-discovery-{slug}.json
```

```json
{
  "schema": "1.0",
  "agent": "epost-docs-manager",
  "timestamp": "<ISO 8601>",
  "type": "docs-discovery",
  "data": {
    "apiServices": ["AuthService", "UserService", "..."],
    "libraries": ["next-intl", "redux-toolkit", "..."],
    "docsIndex": { }
  }
}
```

`{slug}` = project name or plan slug (kebab-case). `docsIndex` mirrors the generated `docs/index.json` structure.

Report: "Discovery written to `.epost-cache/artifacts/docs-discovery-{slug}.json`"

Downstream consumers: `epost-planner` (knows what APIs exist), `epost-researcher` (knows KB coverage).

See `core/references/artifact-persistence-protocol.md` for envelope format and cleanup rules.

## Auto-Detection

1. Check if `docs/index.json` exists in the project root
2. Check intent signals in `$ARGUMENTS` or user message
3. Check if args reference a specific component or library key
4. Check platform-specific paths (web: `packages/`, iOS: `Sources/`, Android: `app/`)

### Decision Matrix

| Condition | Load Reference | Mode |
|-----------|---------------|------|
| `docs/index.json` absent, flat docs present | `references/init.md` | migrate |
| `docs/index.json` absent, no docs | `references/init.md` | generation |
| Intent: reorganize, structure, orphan, inconsistent, KB audit | `references/update.md` | reorganize |
| Intent: migrate, convert flat docs, restructure | `references/init.md` | migrate |
| Intent: scan, staleness, health, gaps | `references/update.md` | scan |
| Args match a component/library key AND component source exists | `references/component.md` | — |
| `docs/index.json` present (default) | `references/update.md` | update |

## Execution

Load the reference file and execute its workflow.
