# web-i18n: Validate Docs Update (Real-World Findings)

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: web-i18n
**Plan**: plans/260331-i18n-validate-docs-update/

## What was implemented / fixed

Rewrote `references/validate.md` and updated `pull.md`, `push.md`, and `SKILL.md` to match the actual working implementation of `/i18n --validate` built against the real luz-epost Google Sheet.

Key corrections:
- `validate.md`: full rewrite — public fetch (no auth), all-variable tracking, dot normalization, feature-tab vs fallback-tab key format, file-name column headers
- `pull.md`: replaced mandatory `authenticate()` with `fetchPublicTab()` for public sheets; documented file-name headers
- `SKILL.md`: added `validate.cjs` to scripts table; moved `GOOGLE_SERVICE_ACCOUNT_KEY` from Required to Write-ops-only block
- `push.md`: rewrote Step 2 key extraction to match validate.cjs behavior

## Key decisions and why

- **Cross-reference push.md → validate.cjs**: rather than duplicating the full extraction algorithm in push.md, added a note pointing to validate.cjs as the source of truth. Avoids drift between docs.
- **Manual config validation in validate.md**: `validateConfig()` enforces service account presence — which blocks read-only flows. Document manual 3-var check instead.

## What almost went wrong

The original docs assumed `GOOGLE_SERVICE_ACCOUNT_KEY` was always required. This would mislead any developer trying to run `--validate` in a CI environment without write credentials. The distinction between public (CSV export) and authenticated (Sheets API) reads is critical and was absent from all three reference files.

[web-i18n] did not cover the feature-tab vs fallback-tab key format difference — this is the highest-risk gap for future implementers.
