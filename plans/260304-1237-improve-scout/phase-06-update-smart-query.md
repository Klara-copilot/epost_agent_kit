# Phase 06: Update Smart Query & Retrieval Skills

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: Phase 05 (reference files exist)
- Ref: `web-rag/references/smart-query.md`, `ios-rag/references/smart-query.md`, `knowledge-retrieval/references/search-strategy.md`

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Update smart-query and knowledge-retrieval to leverage server-side query expansion awareness
**Implementation Status**: Complete

## Key Insights
- `smart-query.md` says "Generate 3-5 variant queries" with synonym examples -- server already expands synonyms
- Double-expansion: agent generates "Button CSS transition hover effect", server expands "transition" -> more terms -- bloated embeddings, score dilution
- Better: agent generates HyDE passage (still valuable, server can't do this) + 1-2 structural variants (different angle/scope)
- `knowledge-retrieval/references/search-strategy.md` has "Keyword Expansion Techniques" (line 292) with manual synonym table -- should note server handles this
- Scout filter extraction (Step 4) should reference canonical component names from Phase 05 references

## Requirements
### Functional
- Update `smart-query.md` (both platforms): note server-side expansion, reduce variant recommendation from 3-5 to 1-2 structural-only
- Update `knowledge-retrieval/references/search-strategy.md`: add server-side vs agent-side expansion table
- Add canonical component name reference to scout filter extraction guidance
### Non-Functional
- Surgical edits, not rewrites

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/platform-web/skills/web-rag/references/smart-query.md` [OWNED]
- `packages/platform-ios/skills/ios-rag/references/smart-query.md` [OWNED]
- `packages/core/skills/knowledge-retrieval/references/search-strategy.md` [OWNED]
### Modify (minor addition)
- `packages/core/skills/scout/SKILL.md` -- add canonical component name note to Step 4

## Implementation Steps

### 1. Update web `smart-query.md`

Replace "## Notes" section with:

```markdown
## Server-Side Expansion

The RAG server auto-expands queries with:
- **Synonym expansion**: "btn" -> "button", "loading" -> "fetching pending spinner", etc. (60+ groups)
- **Component recognition**: "TextField" -> detected, canonical "text-field" injected into query
- **Multi-word phrase matching**: "design token" -> expanded with klara-theme, scss variable, etc.
- **Punctuation stripping**: "(color, typography)" -> both words expanded correctly

See `references/synonym-groups.md` for full expansion categories.
See `references/component-mappings.md` for canonical component names.

### Impact on Smart Query Strategy

| Technique | Still Needed? | Why |
|-----------|:---:|-----|
| HyDE passage | YES | Server can't generate hypothetical code |
| Structural variants (different angle) | YES (1-2 max) | "Button hover states" vs "ButtonBase motion config" |
| Synonym variants | NO | Server handles "btn"/"button", "animation"/"transition" |
| Component filter with canonical name | YES | Use name from component-mappings.md |

**Before** (3-5 variants, most redundant):
- Original + HyDE + "Button CSS transition" + "btn animation" + "component hover effect"

**After** (HyDE + 1-2 structural):
- Original + HyDE + "ButtonBase motion variants framer-motion" (structural, different scope)
```

### 2. Update iOS `smart-query.md`

Same changes, iOS-specific notes:
- iOS server does word-by-word expansion only (no phrase matching -- see Phase 07)
- Reference iOS component-mappings.md and synonym-groups.md
- Same structural-variant-only recommendation
- Note: multi-word synonym keys in iOS config (e.g. "dependency injection") are NOT matched as phrases yet

### 3. Update `knowledge-retrieval/references/search-strategy.md`

In "## Keyword Expansion Techniques" section (after line 292), add:

```markdown
### Server-Side vs Agent-Side Expansion

RAG servers auto-expand queries before embedding. Know what each side handles:

| Expansion Type | Who Does It | When |
|---------------|-------------|------|
| Synonym expansion | RAG server (auto) | Every query -- "btn"->"button", "a11y"->"accessibility" |
| Component recognition | RAG server (auto) | When alias in query -- "TextField"->injects "text-field" |
| Multi-word phrases | Web RAG server (auto) | "design token" -> klara-theme, scss variable, etc. |
| HyDE passage | Agent (manual) | Conceptual queries only -- server can't generate code |
| Structural variants | Agent (manual) | When < 3 results -- different angle, not synonyms |
| Filter extraction | Agent (manual) | Always -- use canonical names from component-mappings.md |

**Rule**: Don't duplicate server-side expansions. Focus agent effort on HyDE and structural variants.
**See**: `web-rag/references/synonym-groups.md`, `ios-rag/references/synonym-groups.md` for what's auto-expanded.
```

### 4. Update scout SKILL.md Step 4

Add to "Filter extraction" bullet:

```markdown
- **Filter extraction** — extract relevant filters from query. Use canonical component names from
  `web-rag/references/component-mappings.md` or `ios-rag/references/component-mappings.md`
  (e.g., "datepicker" -> component: "date-picker", "btn" -> component: "button")
```

## Todo List
- [x] Update web smart-query.md (server-side expansion section, reduce variants)
- [x] Update iOS smart-query.md (same + iOS-specific notes)
- [x] Update knowledge-retrieval search-strategy.md (expansion type table)
- [x] Update scout SKILL.md Step 4 (canonical component name reference)

## Success Criteria
- smart-query.md recommends 1-2 structural variants (not 3-5 synonym variants)
- search-strategy.md distinguishes server-side vs agent-side expansion
- Scout references canonical component mappings for filter extraction

## Risk Assessment
**Risks**: Reducing variants may reduce recall for edge cases
**Mitigation**: HyDE still provides semantic diversity; server synonyms cover the rest. If < 3 results, agent falls through to broader search.

## Security Considerations
None.

## Next Steps
After completion: Phase 07 (iOS query expansion code parity)
