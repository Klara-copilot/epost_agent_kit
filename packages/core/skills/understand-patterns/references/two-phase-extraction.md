# Two-Phase Extraction

## Problem

Mixing deterministic structural extraction with LLM semantic annotation in a single pass produces:
- Non-reproducible outputs (LLM re-reads files differently each run)
- Wasted tokens (LLM parses syntax it doesn't need to interpret)
- No caching (can't reuse structural facts independently of semantic annotation)

## Pattern

Split file analysis into two strictly ordered phases:

**Phase 1 — Structural Extraction (script/deterministic)**
- Run a script (Node.js, Python, bash) against source files
- Extract: functions, classes, interfaces, exports, imports, line counts, config keys, table schemas
- Output: raw structured facts (JSON, no natural language)
- Deterministic: same input → same output every run
- Does NOT consume LLM context tokens

**Phase 2 — Semantic Annotation (LLM)**
- Read Phase 1 output (not raw source files)
- Produce: summaries, complexity ratings, tags, contextual notes
- LLM acts as annotator, not parser
- Output: enriched nodes with human-readable fields added to Phase 1 facts

## ePost Application

```
// get-started: Step 2 (detect docs state)
Phase 1: Read project markers via Glob/Read tools (deterministic)
         → extract tech stack, file counts, entry points

Phase 2: LLM synthesizes facts into structured onboarding report
         → names, explanations, priority ordering

// docs --init: knowledge discovery
Phase 1: Script scans docs/ structure, reads index.json (deterministic)
         → file paths, categories, sizes, ages

Phase 2: LLM annotates gaps, suggests migrations, writes KB entries
```

## Key Constraint

Phase 2 MUST read Phase 1 output — not re-read raw source files.
If Phase 2 re-reads source, the two-phase separation has failed.

## When to Use

- Any agent that reads multiple files and then produces descriptions
- Workflows that may re-run (Phase 1 output can be cached/reused)
- Parallel file analysis (each worker runs Phase 1; LLM aggregates in Phase 2)

## When to Skip

- Single-file analysis where caching adds no value
- Tasks where the LLM output is not derived from file structure
- Interactive Q&A (no bulk extraction needed)
