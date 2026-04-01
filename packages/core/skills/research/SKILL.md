---
name: research
description: (ePost) Researches technologies, libraries, best practices, and documentation. Use when user says "research", "how does X work", "best practices for", "compare A vs B", "look up", "find docs for", or "what's the best way to" — dispatches to epost-researcher for multi-source synthesis
user-invocable: true
context: fork
agent: epost-researcher
metadata:
  argument-hint: "[topic | --fast | --deep | --codebase]"
  agent-affinity:
    - epost-researcher
    - epost-planner
  keywords:
    - research
    - investigate
    - look up
    - best practices
    - compare
    - documentation
    - how does
    - evaluate
    - library
    - framework
  platforms:
    - all
  connections:
    enhances: [plan, docs, knowledge]
  triggers:
    - /research
    - research
    - how does
    - best practices for
    - compare
    - look up docs
---

# Research

## Delegation — REQUIRED

This skill MUST run via `epost-researcher`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/research`
- **Arguments**: `$ARGUMENTS` (full argument string)
- If no arguments: state "no arguments — ask user for topic"

## Flags

| Flag | Behavior |
|------|----------|
| `--fast` | Single-source lookup — official docs or Context7 only. For quick API/syntax checks. |
| `--deep` | Full multi-source sweep — docs + GitHub + community + cross-reference. Writes report to `reports/`. |
| `--codebase` | Internal only — Grep/Glob the project, no web search. For "how is X done in our code". |
| *(none)* | Auto-detect: simple lookup → fast, evaluation/comparison → deep, "our code" → codebase |

## Search Engine

Read `$EPOST_RESEARCH_ENGINE` — see `references/engines.md` for WebSearch vs Gemini configuration.
If claudekit is installed and Gemini is preferred, `ck:research` is an alternative with Gemini-first approach.

## Auto-Detection

- Single library/API name → `--fast`
- "compare", "evaluate", "should we use", "alternatives" → `--deep`
- "our codebase", "existing pattern", "how do we" → `--codebase`
- Ambiguous → `--fast`, escalate to `--deep` if findings are insufficient

<request>$ARGUMENTS</request>
