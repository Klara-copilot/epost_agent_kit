# Plan Report: Audit UI-Lib Component Skill (Cross-Platform)

**PLAN-0039** | epost-architect | 2026-03-04

## Plan Directory
`/Users/than/Projects/epost_agent_kit/plans/260304-1718-audit-ui-lib-component/`

## Files Created
- `plan.md` -- Main plan (3 phases, cross-platform)
- `phase-01-core-skill-schema.md` -- Core SKILL.md + audit report JSON schema
- `phase-02-platform-checklists.md` -- Web/iOS/Android checklists + cross-platform consistency
- `phase-03-wire-skill-index.md` -- Register in package.yaml, run init

## Summary

New `audit-ui-component` skill for `packages/design-system/skills/`. Enables epost-muji (senior reviewer persona) to audit UI library component code across web (klara-theme/React), iOS (EpostThemeUI/SwiftUI), Android (epost-theme-compose/Compose).

### Key Design Decisions
- **Platform registry pattern** in SKILL.md -- no hardcoded paths, platform specifics in reference files only
- **Shared audit report JSON schema** -- same structure across platforms, `platform` field distinguishes
- **6-category audit**: tokens, patterns, performance, security, a11y, consistency
- **Mentoring tone**: findings include `mentoring` field explaining WHY, not just WHAT
- **Extends existing skills**: requires `code-review`, enhances `web-ui-lib-dev`, `ios-ui-lib`, `android-ui-lib`

## Implementation Phases

| Phase | Batch | Effort | Description |
|-------|-------|--------|-------------|
| 01 | 1 | 2h | Core SKILL.md + audit report schema |
| 02 | 2 (parallel) | 3h | 4 checklist files (web, ios, android, cross-platform) |
| 03 | 3 | 1h | Wire to package.yaml + init |

**Total effort**: 6h

## Key Dependencies
- `code-review` skill (requires)
- `web-ui-lib-dev`, `ios-ui-lib`, `android-ui-lib` (enhances)
- `packages/design-system/package.yaml` (registration)

## Platform Implications
- Web: klara-theme, forwardRef, CSS vars, ESLint, Jest+RTL
- iOS: EpostThemeUI, SwiftUI Environment, SwiftLint, XCTest
- Android: epost-theme-compose, CompositionLocal, Detekt, Compose UI Test

## Risks
1. Checklist staleness -- mitigated by staleness warnings + RAG cross-check step
2. Scope creep beyond component audit -- mitigated by clear scope in SKILL.md

## Unresolved Questions
1. User mentioned "image as reference from friend" but no image was attached. The plan proceeds with existing skill patterns + Context7 references. If image is provided later, checklists can be adjusted.
2. Should the skill also generate fix suggestions automatically, or only report findings? Current plan: report only, with mentoring suggestions. Auto-fix is a future enhancement.
