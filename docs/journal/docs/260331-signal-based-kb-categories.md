# Signal-Based KB Category Selection

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: docs
**Plan**: plans/260330-2325-docs-skill-signal-categories/

## What was implemented / fixed

Added signal-based category selection to the `docs` skill's init workflow. Before creating KB directories or generating docs, agents now scan the codebase for signals (Docker files, REST routes, SDK imports, etc.) and only activate the categories that apply. Added 3 new categories: API, INFRA, INTEG. Registry lives in `kb-categories.json` alongside `init.md`.

## Key decisions and why

- **Decision**: Keep `kb-categories.json` as a JSON file co-located with `init.md` rather than embedding the category list in the skill body.
  **Why**: Agents can read it independently during init; easier to extend without editing the main skill logic. Separation of data from instructions.

- **Decision**: CONV stays `core: true` even though it has signals (eslint, tsconfig).
  **Why**: Conventions are universal — even repos without config files have naming conventions detectable from code. Signals serve as enrichment hints, not activation gates.

- **Decision**: index.json template shows all 10 categories as a reference example; instruction says "omit skipped" rather than showing a pruned example.
  **Why**: Agents need to see the full schema to understand what's possible; the prune instruction is easier to follow than inferring what was removed from a partial example.

## What almost went wrong

Step numbering in Smart Init and Generation Mode diverged after insertions — the cross-references "step 3.5" and "step 4" in Smart Init pointed to the wrong steps in Generation Mode post-renumber. Caught and fixed manually. [docs skill] init.md's cross-references between modes are fragile when steps are renumbered — worth checking on any future edits.
