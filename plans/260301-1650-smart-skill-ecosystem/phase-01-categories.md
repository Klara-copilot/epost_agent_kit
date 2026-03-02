# Phase 01: Category Taxonomy + Index Schema

## Context Links
- Parent: [plan.md](./plan.md)
- Current index: `.claude/skills/skill-index.json`
- ClaudeKit reference: 16 categories (auth, AI/ML, backend, design, web, testing, cloud, databases, dev-tools, docs, code-quality, debugging, documents, e-commerce, payments, meta)

## Overview
**Date**: 2026-03-01
**Priority**: P1
**Description**: Define 10 categories adapted from ClaudeKit to epost domain. Add `category` field to every skill in index. Update generator script.
**Implementation Status**: Pending

## Key Insights

ClaudeKit uses 16 categories — too granular for 93 skills. epost needs ~10 categories that map to our package structure while adding semantic grouping within `core`.

### Proposed Category Taxonomy (10 Categories)

| Category | Description | Skill Count | Maps To Package |
|----------|-------------|-------------|-----------------|
| **platform-web** | Next.js, React, TypeScript, web APIs | 10 | platform-web |
| **platform-ios** | Swift, SwiftUI, UIKit, XCTest | 4 | platform-ios |
| **platform-android** | Kotlin, Compose, Room, Hilt | 3 | platform-android |
| **platform-backend** | Java EE, WildFly, Hibernate, databases | 2 | platform-backend |
| **accessibility** | WCAG, a11y auditing/fixing (all platforms) | 8 | a11y |
| **design-system** | Figma, UI libraries, design tokens | 4 | design-system |
| **dev-workflow** | Commands: cook, fix, plan, test, debug, git, bootstrap, scout, convert | 30 | core (commands) |
| **knowledge** | Debugging, planning, research, knowledge-base, problem-solving, reasoning | 14 | core (knowledge) |
| **kit-authoring** | Agent/skill/command/hook development, CLI | 13 | kit |
| **domain** | B2B modules, B2C patterns | 2 | domains |

### Full Skill-to-Category Mapping

**platform-web** (10):
`web-frontend`, `web-nextjs`, `web-api-routes`, `web-modules`, `web-prototype`, `web-rag`, `web-a11y` -> accessibility, `web-figma` -> design-system, `web-ui-lib` -> design-system, `web-ui-lib-dev` -> design-system

Corrected:
- `web-frontend`, `web-nextjs`, `web-api-routes`, `web-modules`, `web-prototype`, `web-rag` = 6

**platform-ios** (4):
`ios-development`, `ios-ui-lib`, `ios-rag`, `ios-a11y` -> accessibility

Corrected:
- `ios-development`, `ios-ui-lib`, `ios-rag` = 3

**platform-android** (3):
`android-development`, `android-ui-lib`, `android-a11y` -> accessibility

Corrected:
- `android-development`, `android-ui-lib` = 2

**platform-backend** (2):
`backend-javaee`, `backend-databases`

**accessibility** (8):
`a11y`, `ios-a11y`, `android-a11y`, `web-a11y`, `audit-a11y`, `audit-close-a11y`, `fix-a11y`, `review-a11y`

**design-system** (4):
`web-figma`, `web-figma-variables`, `web-ui-lib`, `web-ui-lib-dev`

**dev-workflow** (30):
`cook`, `cook-fast`, `cook-parallel`, `fix`, `fix-deep`, `fix-ci`, `fix-ui`, `plan`, `plan-fast`, `plan-deep`, `plan-parallel`, `plan-validate`, `test`, `debug`, `scout`, `convert`, `simulator`, `epost`, `bootstrap`, `bootstrap-fast`, `bootstrap-parallel`, `git-commit`, `git-push`, `git-pr`, `review-code`, `review-improvements`, `docs-init`, `docs-update`, `docs-component`, `auto-improvement`

**knowledge** (14):
`core`, `code-review`, `debugging`, `planning`, `problem-solving`, `error-recovery`, `sequential-thinking`, `research`, `docs-seeker`, `doc-coauthoring`, `knowledge-base`, `knowledge-retrieval`, `knowledge-capture`, `repomix`, `hub-context`, `skill-discovery`, `data-store`, `verification-before-completion`, `receiving-code-review`, `subagent-driven-development`, `infra-cloud`, `infra-docker`

Refined split — separate infrastructure:
- **knowledge** (16): `core`, `code-review`, `debugging`, `planning`, `problem-solving`, `error-recovery`, `sequential-thinking`, `research`, `docs-seeker`, `doc-coauthoring`, `knowledge-base`, `knowledge-retrieval`, `knowledge-capture`, `repomix`, `hub-context`, `skill-discovery`, `data-store`, `verification-before-completion`, `receiving-code-review`, `subagent-driven-development`
- Move `infra-cloud`, `infra-docker` to **dev-workflow** (infra is workflow)

**kit-authoring** (13):
`kit-agents`, `kit-agent-development`, `kit-skill-development`, `kit-commands`, `kit-hooks`, `kit-cli`, `kit-add-agent`, `kit-add-skill`, `kit-add-command`, `kit-add-hook`, `kit-optimize-skill`, `cli-cook`, `cli-doctor`, `cli-test`

**domain** (2):
`domain-b2b`, `domain-b2c`

**Total**: 6+3+2+2+8+4+32+20+14+2 = 93

## Requirements
### Functional
- Add `category` string field to each skill entry in `skill-index.json`
- Categories must be one of the 10 defined values
- Generator script must auto-derive category from package + path
### Non-Functional
- Backward-compatible: existing consumers ignore unknown fields
- Category names are kebab-case

## Architecture

```json
// skill-index.json schema addition
{
  "name": "web-frontend",
  "category": "platform-web",
  "description": "...",
  "tier": "discoverable",
  ...
}
```

Optional: Add `categories` summary at top level:
```json
{
  "categories": {
    "platform-web": { "count": 6, "description": "Web platform skills" },
    ...
  },
  "skills": [...]
}
```

## Related Code Files
### Modify (EXCLUSIVE)
- `.claude/skills/skill-index.json` — Add category field to all 93 entries [OWNED]
- `.claude/scripts/generate-skill-index.cjs` — Auto-derive category from package path [OWNED]
### Read-Only
- `packages/*/package.yaml` — Package-to-category mapping source

## Implementation Steps
1. Define `CATEGORY_MAP` in generator: package name -> category
2. Add special-case logic for `core` package (split into dev-workflow vs knowledge)
3. Add `category` field to generated output
4. Add `categories` summary object at top level
5. Regenerate index
6. Validate all 93 skills have a category

## Todo List
- [ ] Update generator with category mapping
- [ ] Add category field to all entries
- [ ] Add categories summary
- [ ] Validate no orphaned skills

## Success Criteria
- Every skill has exactly 1 category
- Categories match the 10-category taxonomy
- Generator produces correct categories on re-run

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Core package split ambiguity | Wrong category | Manual override map for edge cases |

## Security Considerations
None — metadata-only change.

## Next Steps
Feed categories into Phase 02 connection graph and Phase 03 loader.
