# Phase 07: iOS Query Expansion Parity

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: Phase 05, Phase 06
- Ref: `epost_web_theme_rag/src/core/query_expansion.py` (reference), `epost_ios_rag/src/core/query_expansion.py` (target)

## Overview
**Date**: 2026-03-04
**Priority**: P2
**Description**: Port web's multi-word phrase matching, punctuation stripping, and canonical injection to iOS query_expansion.py
**Implementation Status**: Complete

## Key Insights

### Feature Comparison

| Feature | Web (240 lines) | iOS (151 lines) |
|---------|:---:|:---:|
| Word-by-word synonym matching | YES | YES |
| Multi-word phrase matching | YES (Phase 1) | NO |
| Punctuation stripping | YES (`_strip_punctuation`) | NO |
| Canonical component injection | YES | NO |
| Multi-word alias in recognize_component | YES (sort by length) | NO |
| `.expansions-version` logging | YES | NO |

### Why It Matters
- iOS config has multi-word keys ("dependency injection", "protocol-oriented") but they're never matched as phrases
- Query "(color, typography)" would fail to expand "color" or "typography" due to punctuation
- Component "PrimaryButton" recognized, but canonical name not injected into query for better embedding match

## Requirements
### Functional
- Port `_strip_punctuation` static method
- Port two-phase `expand_synonyms` (Phase 1: phrase matching, Phase 2: word-by-word with punctuation strip)
- Port multi-word alias handling in `recognize_component` (sort by length, phrase vs word match)
- Port canonical component injection in `expand_query`
- Add `.expansions-version` logging
### Non-Functional
- Same API: `expand_query(query) -> Dict[str, Any]`
- No new dependencies
- Backward compatible

## Related Code Files
### Modify (EXCLUSIVE)
- `epost_ios_rag/src/core/query_expansion.py` [OWNED]
### Read-Only
- `epost_web_theme_rag/src/core/query_expansion.py` -- reference implementation

## Implementation Steps

1. **Add `_strip_punctuation`**:
   ```python
   @staticmethod
   def _strip_punctuation(word: str) -> str:
       import re
       return re.sub(r'^[^\w]+|[^\w]+$', '', word)
   ```

2. **Replace `expand_synonyms`** with two-phase approach:
   - Phase 1: Multi-word phrase matching
     - For each synonym group, check if key (as phrase) appears in query_lower
     - For each synonym value, check if multi-word value appears in query_lower
     - Collect matched terms
   - Phase 2: Word-by-word matching
     - For each word, strip punctuation, check against single-word synonym keys/values
     - Skip multi-word keys (handled in Phase 1)
   - Merge: expanded_words + phrase-matched terms not already present

3. **Update `recognize_component`** for multi-word aliases:
   - Sort `self.component_mappings.keys()` by length (descending)
   - Multi-word or hyphenated aliases: check `alias_lower in query_lower` (phrase match)
   - Single-word aliases: check `alias_lower in query_words` (exact word match)

4. **Add canonical injection** to `expand_query`:
   ```python
   if recognized_component:
       applied_expansions.append("component_recognition")
       canonical = recognized_component
       if canonical.lower() not in expanded_query.lower():
           expanded_query += " " + canonical
           logger.debug(f"Injected canonical component name: '{canonical}'")
   ```

5. **Add version logging** to `_load_expansions`:
   ```python
   version_file = expansion_file.parent / ".expansions-version"
   if version_file.exists():
       version = version_file.read_text().strip()
       logger.info(f"Loaded query_expansions v{version}: {len(self.synonyms)} synonym groups, {len(self.component_mappings)} component mappings")
   else:
       logger.warning(f"Loaded ... (no version file -- may be out of sync with kit)")
   ```

## Todo List
- [x] Add `_strip_punctuation` static method
- [x] Replace `expand_synonyms` with two-phase approach
- [x] Update `recognize_component` for multi-word alias support
- [x] Add canonical component injection to `expand_query`
- [x] Add `.expansions-version` logging
- [ ] Test: "dependency injection pattern" matches as phrase (manual test in iOS RAG)
- [ ] Test: "(color, typography)" strips punctuation, expands both (manual test)
- [ ] Test: "PrimaryButton" recognized, canonical injected (manual test)

## Success Criteria
- `expand_synonyms("dependency injection pattern")` matches "dependency injection" as phrase, adds DI/inject/container/etc.
- `expand_synonyms("(color, typography)")` strips parens/commas, expands both words
- `recognize_component("show me the PrimaryButton")` returns "PrimaryButton" (not false positive on "primary")
- `expand_query("find PrimaryButton usage")` injects canonical if not present
- Existing queries produce same or better results (no regressions)

## Risk Assessment
**Risks**: iOS RAG is standalone repo -- changes don't go through kit CI
**Mitigation**: Backward-compatible API. Port proven code from web. Test manually.

## Security Considerations
None -- local config processing.

## Next Steps
After all phases: run `epost-kit init` to regenerate `.claude/` from `packages/`. Test end-to-end with sample queries.
