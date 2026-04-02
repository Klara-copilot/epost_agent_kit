# CLAUDE.snippet.md: weight-based routing + core law-layer

**Date**: 2026-04-02
**Agent**: epost-fullstack-developer
**Epic**: kit-routing-redesign
**Plan**: plans/260402-0949-kit-routing-redesign/

## What was implemented

Rewrote the Routing section of `packages/core/CLAUDE.snippet.md`. Removed ~45 lines of prescriptive routing rules (11-row intent table, fuzzy matching block, 12 numbered routing rules, web examples) and replaced with 3 concise sections: weight-based execution rule, declarative agent catalogue, and embedded core law-layer (decision authority + never-do).

File went from 87 lines to 76 lines — well under the 120-line target.

## Key decisions and why

- **Decision**: Keep platform detection as a one-liner rather than full section
  **Why**: Platform signals are low-signal-noise in a snippet — just enough to orient; full detail lives in skill-discovery

- **Decision**: Drop Prompt Classification block entirely (not just the intent table)
  **Why**: Claude classifies prompts natively; the block was telling Claude what Claude already knows how to do

- **Decision**: Agent catalogue is declarative (name + purpose), not prescriptive (verb triggers)
  **Why**: Prescriptive routing duplicates Claude's intent classification and creates false confidence — catalogue is discovery aid, not decision tree

## What almost went wrong

Nothing significant. The phase spec was clear and the file was small enough to rewrite in one pass.
