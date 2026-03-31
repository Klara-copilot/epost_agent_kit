# Skills Library Pruned: 67 → 46

**Date**: 2026-03-20
**Agent**: epost-fullstack-developer
**Epic**: kit-rationalization
**Plan**: plans/260319-0538-kit-rationalization/

## What was implemented

Executed Phase 3 of the kit rationalization: deleted 12 pure-redundant skills and merged 9 more into parent skills. Net result: 67 → 46 active skills (31% reduction).

**Deleted (encoded generic reasoning Claude does natively):**
sequential-thinking, problem-solving, auto-improvement, bootstrap, convert, epost, repomix, scout, simulator, data-store, infra-cloud, infra-docker

**Merged (content preserved as references):**
- 6 kit-* skills → `kit/references/` (agent-development.md, skill-development.md, hooks.md, cli.md, agents.md, verify.md)
- doc-coauthoring → `docs/references/coauthoring.md`
- web-prototype → `web-frontend/references/prototype.md`
- web-rag → `web-frontend/references/rag.md`

## Key decisions and why

- **Decision**: Keep `simulator` even though the phase listed it for deletion.
  **Why**: `simulator` is in `packages/platform-ios/skills/` (domain-protected). Phase rules say DO NOT touch platform-* skills. Correctly left untouched.

- **Decision**: Merge kit-* into `kit/references/` rather than CLAUDE.md.
  **Why**: The content is reference material for kit authoring, not general project guidance. Keeping it in `kit/references/` preserves progressive disclosure — only loaded when explicitly needed by kit authoring workflows.

- **Decision**: doc-coauthoring is a 390-line detailed workflow — kept full content in `docs/references/coauthoring.md`.
  **Why**: The workflow is genuinely specialized and domain-specific. Deleting it would lose real value; merging into docs parent as a reference preserves it with zero token cost unless needed.

## What almost went wrong

- `epost-debugger` agent had `problem-solving` in its `skills:` list — would have caused a broken skill load on every debug session. Caught by grepping agent files for deleted skill names.
- The `kit/references/add-agent.md`, `add-skill.md`, `add-hook.md`, and `optimize.md` files each had `requires:` connections to the deleted kit-* skills and instructions telling agents to load those skills. These would have silently failed at skill-dispatch time. Fixed all 4.
- The `skill-discovery/SKILL.md` task-type signals table referenced 6 deleted skills by name. The table is the primary dispatch table for skill discovery — agents would have tried to load non-existent skills. Fixed all entries.
