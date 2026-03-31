# Merge knowledge-retrieval + knowledge-capture → knowledge

**Date**: 2026-03-30
**Agent**: epost-fullstack-developer
**Epic**: skill-consolidation
**Plan**: plans/260330-1614-skill-consolidation/

## What was implemented / fixed

- Created `packages/core/skills/knowledge/` with SKILL.md (241 LOC) and 4 reference files
- knowledge-retrieval default behavior stays as the main body; knowledge-capture moves to `references/capture.md` behind `--capture` flag
- Deleted `knowledge-retrieval/` and `knowledge-capture/` directories
- Updated `package.yaml`, `generate-skill-index.cjs` (CATEGORY_MAP + CONNECTION_MAP), and 24 files with cross-references
- Regenerated skill-index.json

## Key decisions and why

- **Decision**: Merge into unified `knowledge` skill with `--capture` flag pattern
  **Why**: Reduces skill count, aligns with the flag pattern established in Phase 1 (security-scan→security, retro→git, etc.). knowledge-capture required knowledge-retrieval anyway; unified skill eliminates the dependency edge.

- **Decision**: SKILL.md body = retrieval protocol; capture = reference file only
  **Why**: Retrieval is the primary use case (every agent does it constantly); capture is occasional. Default mode should be the most common use case.

- **Decision**: clean-code directory kept, removed from package.yaml only
  **Why**: Plan contradicted itself (intro says "stays separate", phase-4 says remove). Compromise: remove from registry (package.yaml) but don't delete the directory since the plan never said to delete it.

## What almost went wrong

- Plan.md and phase-4.md contradicted each other on clean-code. The plan intro said "clean-code stays separate" but phase-4.1 listed it for removal from package.yaml. [plan skill] cross-references between plan phases created ambiguity that required judgment rather than mechanical execution.
- `journal` was absent from the original package.yaml despite having a directory. Caught during count validation — would have produced wrong skill count.
