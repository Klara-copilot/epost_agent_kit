# Phase 04: Result Categorization

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: Phase 03 (RAG integration)

## Overview
**Date**: 2026-03-04
**Priority**: P2
**Description**: Group scout results into meaningful categories for readability
**Implementation Status**: Pending

## Key Insights
- Current scout dumps flat file lists -- hard to scan
- RAG results include metadata (topic, component, file_type) -- leverage it
- Grep results can be categorized by file extension and path patterns
- Categories should match what developers naturally look for

## Requirements
### Functional
- Categorize results into groups:
  - **Components** -- UI views, components, widgets
  - **Tokens/Styles** -- design tokens, colors, typography, SCSS
  - **Logic** -- services, utilities, state management, API clients
  - **Config** -- build configs, env files, manifests
  - **Tests** -- test files
  - **Docs** -- markdown, READMEs, ADRs
- Show category headers with file count
- Within each category: file path + brief context (matched line or RAG metadata)
### Non-Functional
- Categories should be stable/predictable
- Empty categories omitted

## Architecture

```
Raw results (RAG + Grep)
  |
  v
[Categorizer] -- by file extension + path + RAG topic
  |
  v
[Grouped Output]
  ## Components (3 files)
  - src/components/Button.tsx -- "Primary button with loading state"
  - src/components/Dialog.tsx -- "Modal dialog component"

  ## Tokens/Styles (2 files)
  - src/tokens/colors.ts -- "Brand and semantic color definitions"

  ## Logic (1 file)
  - src/services/auth.ts -- "Authentication service with JWT handling"
```

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/skills/scout/SKILL.md` -- add categorization rules [OWNED]

## Implementation Steps
1. Add "Result Categorization" section to scout SKILL.md:

   | Category | Path Patterns | Extensions | RAG Topics |
   |----------|--------------|------------|------------|
   | Components | */components/*, */views/*, */screens/* | .tsx, .jsx, .swift, .kt | ui |
   | Tokens/Styles | */tokens/*, */theme/*, */styles/* | .scss, .css, .json | design-system, theme |
   | Logic | */services/*, */utils/*, */hooks/*, */stores/* | .ts, .swift, .kt, .java | state-management, networking |
   | Config | root-level, */config/* | .json, .yaml, .xml, .plist | -- |
   | Tests | *test*, *spec*, *Test* | .test.tsx, .spec.ts, .swift | -- |
   | Docs | docs/*, *.md | .md | documentation |
   | Other | (fallback) | * | * |

2. Add output format template:
   ```
   ## {Category} ({count} files)
   - `{file_path}` -- {context_snippet}
   ```

3. Add sorting rules:
   - Categories in order: Components > Logic > Tokens > Config > Tests > Docs > Other
   - Within category: sort by relevance score (RAG) or match count (Grep)

## Todo List
- [ ] Write categorization rules table
- [ ] Write output format template
- [ ] Write sorting rules

## Success Criteria
- Scout output is grouped with clear headers
- Empty categories are omitted
- Categories cover 90%+ of typical project files

## Risk Assessment
**Risks**: Over-categorization making output verbose for simple queries
**Mitigation**: For <5 results, skip categorization and show flat list

## Security Considerations
None.

## Next Steps
After all phases complete: run `epost-kit init` to regenerate, test with sample queries.
