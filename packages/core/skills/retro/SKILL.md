---
name: retro
description: Use when asked for a retrospective, sprint review, team metrics, or 'how did we do' analysis. Generates data-driven insights from git history.
user-invocable: true
context: fork
agent: epost-researcher
metadata:
  argument-hint: "[--since DATE] [--until DATE] [--compare] [--team] [--format report|table|brief]"
  keywords:
    - retrospective
    - retro
    - sprint review
    - team metrics
    - how did we do
    - git metrics
  platforms:
    - all
---

# Retro

Generates data-driven retrospectives from git history metrics.

## Delegation — REQUIRED

This skill MUST run via `epost-researcher`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/retro`
- **Arguments**: `$ARGUMENTS` (full argument string from Skill invocation)
- If no arguments: state "no arguments — use defaults (--since 2 weeks ago, --format report)"

## Flags

| Flag | Description |
|------|-------------|
| `--since DATE` | Start date (default: 2 weeks ago) |
| `--until DATE` | End date (default: today) |
| `--compare` | Compare this period to previous equal period |
| `--team` | Break down metrics per author |
| `--format report\|table\|brief` | Output format (default: report) |

## Protocol

See `references/metrics.md` for the full metric extraction and reporting protocol.
