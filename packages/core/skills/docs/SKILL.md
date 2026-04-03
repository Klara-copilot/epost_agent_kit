---
name: docs
description: (ePost) Generates and maintains project documentation with structured KB workflows. Use when user says "write docs", "update docs", "document this", "init docs", "reorganize documentation", or "add component docs" — detects docs intent (init, update, migrate, component) and runs the right workflow
user-invocable: true
context: fork
agent: epost-docs-manager
metadata:
  argument-hint: "[--init | --migrate | --reorganize | --scan | --verify | --batch [category]]"
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
