# Component and Token Mapping Reference Files

**Date**: 2026-04-07
**Agent**: epost-fullstack-developer
**Epic**: web-prototype-convert
**Plan**: plans/260407-1240-web-prototype-convert-redesign/

## What was implemented

Created two reasoning guides for Phase B (DECIDE) and Phase C (IMPLEMENT) of the web-prototype-convert skill:

- `references/component-mapping.md` — teaches klara component vocabulary by semantic role; includes external→klara bridge table, no-match list, and confidence tiers for live read decisions
- `references/token-mapping.md` — teaches intent-based token reasoning; wrong→right examples with explicit reasoning chain, spacing scale, typography mapping, anti-patterns table

## Key decisions and why

- **Organize by semantic role, not component name**: Phase instructions already locked this — name matching leads to wrong picks when external names differ (e.g. Bootstrap `modal` maps to `Dialog`, not a `Modal` search)
- **Signal priority (DOM > Interaction > Visual)**: Prevents visual false positives (a blue box could be background, card, or alert — only role/aria distinguishes)
- **Confidence tiers for live read**: Avoids unnecessary file reads — HIGH confidence skips live read entirely, saving tokens during large conversions
- **Intent chain in token examples**: "Ask: what IS this?" pattern forces LLM to articulate intent before selecting token; prevents value-match shortcuts that bypass theming
- **🟡 flag for unmapped values**: Explicit escalation path is safer than silent approximation — design decisions belong to designers, not the converter

## What almost went wrong

- Temptation to list all 67+ components individually would have exceeded 200 lines. Solved by grouping variants under shared role rows ("one-of-N radio choice" covers RadioGroup without needing sub-rows).
- `token-mapping.md` pixel values in spacing table could become stale. Mitigated by marking the table as "illustrative" and explicitly pointing to live source — prevents hardcoded assumptions.
