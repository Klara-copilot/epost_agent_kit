---
phase: 3
title: "Update code-review SKILL.md Cascading Detection"
effort: 2h
depends: [1, 2]
---

# Phase 3: Cascading Rule Detection

## Context

- Plan: [plan.md](./plan.md)
- Target: `packages/core/skills/code-review/SKILL.md`
- Depends on: Phase 1 (rule files exist), Phase 2 (REDUX rules exist)

## Overview

Extend the Platform Detection section in code-review/SKILL.md to support cascading ePost-specific rule loading. When platform=web, the caller also checks file paths for ePost patterns and passes additional rule file paths.

## Requirements

### Extend Platform Detection section

After step 3 (Load platform rule files), add step 3b:

```
3b. For web platform, detect ePost-specific patterns and load additional rules:
   - Files in `caller/`, `service/`, or importing FetchBuilder → add `web-api-routes/references/code-review-rules.md`
   - Files in `auth`, `session`, feature-flag logic → add `web-auth/references/code-review-rules.md`
   - Files in `_stores/`, slice files, Redux patterns → REDUX rules already in web-frontend rules
   - Files in module shell (`_ui-models/`, `_services/`, `_hooks/`, `_actions/`) → add `web-modules/references/code-review-rules.md`
   - Files with `useTranslations`, `getTranslations`, `messages/` → add `web-i18n/references/code-review-rules.md`
```

### Update Caller Protocol section

Extend the dispatch prompt template:

```
Platform: {detected platform(s)}
Platform rules: {path to platform code-review-rules.md}
ePost rules: {paths to ePost-specific rule files, if detected}
```

### Update platform-specific rules table

Add ePost rows to the platform-specific rules table:

| Platform | Category | Rules | Scope |
|----------|----------|-------|-------|
| Web (ePost) | FETCH | FETCH-001..006 | FetchBuilder, caller pattern, API constants |
| Web (ePost) | AUTH | AUTH-001..006 | NextAuth, session, feature flags |
| Web (ePost) | REDUX | REDUX-001..006 | Dual-store, slices, selectors |
| Web (ePost) | MOD | MOD-001..005 | B2B module structure, layering |
| Web (ePost) | I18N | I18N-001..005 | next-intl, locale, translations |

### Update Lightweight vs Escalated cross-reference

Add note that ePost rules follow same lightweight/escalated split defined in each rule file.

## Files to Modify

- `packages/core/skills/code-review/SKILL.md` — Platform Detection, Caller Protocol, rules table

## Files to Read (context)

- Current `packages/core/skills/code-review/SKILL.md`
- Phase 1 + Phase 2 output files (verify paths)

## TODO

- [ ] Add step 3b to Platform Detection with file-path pattern table
- [ ] Update Caller Protocol prompt template with `ePost rules:` line
- [ ] Add 5 ePost rows to platform-specific rules table
- [ ] Add lightweight/escalated cross-reference note
- [ ] Verify SKILL.md stays coherent and under 200 lines

## Success Criteria

- Platform Detection has cascading ePost pattern matching
- Caller Protocol includes ePost rules in dispatch template
- Rules table documents all 5 ePost categories with rule ranges
- Existing platform detection (web/backend/ios/android) unchanged
