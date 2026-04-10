# iOS Code Review Rules Expansion — Phase 1

**Date**: 2026-04-07
**Agent**: epost-fullstack-developer
**Epic**: ios-android-code-review-expansion
**Plan**: plans/260406-2347-ios-android-code-review-expansion/

## What was implemented

Expanded iOS code review rules from 6 to 20 across 3 reference files:
- `code-review-rules.md`: SWIFT 3→8, UIKIT 3→6 (14 rules total)
- `code-review-rules-realm.md`: new file, 3 REALM rules
- `code-review-rules-alamofire.md`: new file, 3 ALAMOFIRE rules

All rule rows include concrete Swift code Pass/Fail examples grounded in the luz_epost_ios stack (Alamofire 5.8.1, RealmSwift 10.47, MVVM+Coordinator).

## Key decisions and why

- **Decision**: Split REALM and ALAMOFIRE into separate files rather than adding to main file
  **Why**: Keeps the main file focused on language/UIKit essentials; REALM/Alamofire files load only when those imports are detected, reducing token overhead for projects not using them.

- **Decision**: LW table in each file sums to that file's rule count only
  **Why**: Each file is an independent review unit; the LW tables give reviewers a clear signal without cross-file lookups.

## What almost went wrong

The LW/Escalated table in the original file used `UIKIT-001–003` as LW=Yes, but the phase spec reclassified UIKIT-001 and UIKIT-002 as Escalated only and UIKIT-003 as LW. Applied the new classification correctly per phase spec.
