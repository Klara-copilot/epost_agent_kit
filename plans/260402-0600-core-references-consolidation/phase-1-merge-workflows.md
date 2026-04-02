---
phase: 1
title: "Merge 5 workflow files → workflows.md"
effort: 30m
depends: []
---

# Phase 1: Merge 5 Workflow Files → workflows.md

## Files to Modify

- DELETE: `packages/core/skills/core/references/workflow-feature-development.md`
- DELETE: `packages/core/skills/core/references/workflow-bug-fixing.md`
- DELETE: `packages/core/skills/core/references/workflow-code-review.md`
- DELETE: `packages/core/skills/core/references/workflow-architecture-review.md`
- DELETE: `packages/core/skills/core/references/workflow-project-init.md`
- CREATE: `packages/core/skills/core/references/workflows.md`

## Content Structure

```
# Workflows

## Feature Development
## Bug Fixing
## Code Review
## Architecture Review
## Project Initialization
```

## Trimming Rules

When merging, cut:
- `**Agent**: epost-*` labels within steps — redundant in core context
- `**Example**: ...` prose blocks — illustrative, not rules
- `**Trigger**: ...` lines — already in CLAUDE.md routing
- `## Bug Categories` table in bug-fixing — keep complexity categories but inline it
- File Ownership YAML example in feature-dev — already covered in orchestration.md

Keep:
- All step titles and bullet content
- All tables
- Failure loop descriptions
- `epost-journal-writer` → replace with `journal` skill reference

## epost-journal-writer Replacements

| Location | Old | New |
|----------|-----|-----|
| workflow-bug-fixing.md Step 6 | `**Agent**: epost-journal-writer` | `**Skill**: journal (auto-trigger)` |
| workflow-architecture-review.md Step 4 | `**Agent**: epost-journal-writer` | `**Skill**: journal` |

## Todo

- [ ] Read all 5 workflow-*.md files
- [ ] Create workflows.md with 5 H2 sections
- [ ] Apply trimming rules — target ≤ 185 lines
- [ ] Replace all epost-journal-writer references
- [ ] Delete all 5 source files

## Success Criteria

- `workflows.md` exists with all 5 H2 sections
- Line count ≤ 185
- `epost-journal-writer` absent
- All 5 source files deleted
