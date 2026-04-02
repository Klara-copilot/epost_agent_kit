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
| `--optimize` | Autonomous iterative loop — keep improving until threshold met or N iterations cap. |
| *(none)* | Auto-detect: simple lookup → fast, evaluation/comparison → deep, "our code" → codebase |

## --optimize Flag

Autonomous iterative research loop. Use when the user wants to keep improving a result until a measurable threshold is met.

### Usage
```
/research --optimize [--iterations N] [--goal "description"] <topic>
```

### Protocol

1. **Baseline**: Run standard research, store result as iteration 0.
2. **Loop** (up to N iterations, default 5):
   a. Identify the weakest section based on: missing sources, low confidence claims, unanswered questions.
   b. Run targeted follow-up research to address the weakest section.
   c. Merge findings into the result.
   d. Evaluate: count remaining open questions + low-confidence claims.
3. **Stop conditions** (any one):
   - 0 open questions AND 0 low-confidence claims remaining
   - N iterations reached
   - Two consecutive iterations with no improvement (stuck detection)
4. **Output**: Final result + iteration summary (what improved each round, final quality score).

### Quality Score

```
Score = (sources cited / claims made) × (1 - open_questions / total_questions)
```

Pass threshold: score ≥ 0.8 OR open_questions = 0.

### --optimize Sub-flags

| Flag | Default | Behavior |
|------|---------|---------|
| `--iterations N` | 5 | Max iteration cap |
| `--goal "text"` | none | Natural language stop condition (agent judges when met) |
| `--commit` | false | Commit research output to `reports/` after completion |

## Auto-Detection

- Single library/API name → `--fast`
- "compare", "evaluate", "should we use", "alternatives" → `--deep`
- "our codebase", "existing pattern", "how do we" → `--codebase`
- Ambiguous → `--fast`, escalate to `--deep` if findings are insufficient

<request>$ARGUMENTS</request>
