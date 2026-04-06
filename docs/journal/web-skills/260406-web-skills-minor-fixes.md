# Web Platform Skills Minor Fixes

**Date**: 2026-04-06
**Agent**: epost-fullstack-developer
**Epic**: web-skills
**Plan**: plans/260406-2304-web-skills-minor-fixes/

## What was implemented / fixed

All 3 phases of the web skills audit fix plan:
- Phase 1: Extracted inline code blocks from 5 SKILL.md files to their reference files (web-a11y, web-nextjs, web-forms, web-i18n, web-frontend). Total reduction: ~200 lines removed from skill files.
- Phase 2: Fixed `setupFilesAfterSetup` typo → `setupFilesAfterFramework` in web-testing; removed duplicate Test Commands block; added `paths:` frontmatter to web-auth for file-based auto-triggering.
- Phase 3: Added B2B-specific trigger keywords to web-modules; added `domain-b2b` connection; added staleness warning to web-ui-lib entry ID table.

## Key decisions and why

- **Decision**: Used `connections: uses: [domain-b2b]` for web-modules connection
  **Why**: The plan spec showed a plain list item `- domain-b2b` under `connections`, but YAML doesn't allow mixing keyed entries and plain list items. Existing schema uses named relation keys (`enhances`, `extends`). Added `uses:` as a consistent named key.

## What almost went wrong

- YAML connections structure mismatch — the plan spec contained invalid YAML syntax (`- domain-b2b` mixed under a keyed map). Caught during edit, fixed with valid `uses: [domain-b2b]` pattern. `[skill-creator]` / `[kit-add-skill]` connection spec should document all valid relation key names to prevent this.
