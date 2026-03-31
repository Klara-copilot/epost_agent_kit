---
date: 2026-03-15
agent: epost-planner
plan: plans/260315-1311-agent-navigation-headers
status: READY
---

# Plan Report: Agent Navigation Headers

## Executive Summary

Plan to add structured navigation headers (HTML comment blocks) to all 15 agent files. Each header contains: one-line summary, intention routing table (who triggers this agent and how), section index with approximate line references. All edits target `packages/` source files; `.claude/` is regenerated.

## Plan Details

- **Directory**: `plans/260315-1311-agent-navigation-headers/`
- **Phases**: 2
- **Total effort**: 3h
- **Platforms**: all (agent files are platform-agnostic)
- **Breaking**: No

| Phase | What | Effort |
|-------|------|--------|
| 1 | Apply HTML comment navigation headers to all 15 agents in packages/ | 2.5h |
| 2 | Copy to .claude/agents/, validate frontmatter, spot-check | 0.5h |

## Key Decisions

- **HTML comment format** — `<!-- AGENT NAVIGATION ... -->` block is invisible to model parsing but visible in source
- **Approximate line numbers** — `~L{N}` notation since lines shift as files evolve
- **Per-agent routing data** — derived from CLAUDE.md intent map + each agent's own trigger documentation

## Verdict

**READY**

## Unresolved Questions

1. Should line numbers auto-update via a script, or remain manually maintained?
2. Should the header include handoff targets (who this agent hands off to)?
