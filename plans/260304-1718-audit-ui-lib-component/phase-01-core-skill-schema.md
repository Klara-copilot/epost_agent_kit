# Phase 01: Core Skill + Schema

## Context Links
- Parent plan: [plan.md](./plan.md)
- Pattern ref: `packages/design-system/skills/web-ui-lib-dev/references/audit-ui.md`
- Pattern ref: `packages/core/skills/code-review/SKILL.md`
- Pattern ref: `packages/core/skills/subagent-driven-development/references/code-quality-reviewer-prompt.md`

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Create the main `audit-ui-component` SKILL.md with platform registry, audit workflow, and shared report schema.
**Implementation Status**: Pending

## Parallelization Info
- **Execution Batch**: Batch 1
- **Can Run Parallel With**: None (foundation)
- **Blocked By**: None
- **Blocks**: Phase 02, Phase 03
- **Exclusive Files**:
  - `packages/design-system/skills/audit-ui-component/SKILL.md` (Create)
  - `packages/design-system/skills/audit-ui-component/references/audit-report-schema.md` (Create)

## Key Insights

- Existing `audit-ui.md` is good but web-only and Figma-pipeline-coupled. New skill generalizes.
- `code-quality-reviewer-prompt.md` has good severity model (CRITICAL/HIGH/MEDIUM/LOW) -- reuse.
- Platform registry pattern: each platform declares its token access, component patterns, linting tool, test runner. Audit workflow iterates over selected platforms.
- Senior reviewer persona: the skill should frame feedback as mentoring, not just finding bugs.

## Requirements

### Functional
- Skill accepts: component name/path, platform(s) to audit (web|ios|android|all)
- 6-category audit: tokens, patterns, performance, security, a11y, consistency
- Generates structured JSON report per platform
- Cross-platform consistency check when auditing multiple platforms
- Mentoring tone: explain WHY something is wrong, link to conventions

### Non-Functional
- Skill SKILL.md under 120 lines
- No hardcoded file paths, token names, or tool commands
- Platform specifics ONLY in reference files (Phase 02)

## Architecture

```
audit-ui-component/
  SKILL.md                              # Main skill -- workflow + platform registry
  references/
    audit-report-schema.md              # Shared JSON schema for findings
    checklist-web.md                    # Web-specific audit checklist (Phase 02)
    checklist-ios.md                    # iOS-specific audit checklist (Phase 02)
    checklist-android.md                # Android-specific audit checklist (Phase 02)
    cross-platform-consistency.md       # Parity checks across platforms (Phase 02)
```

### Platform Registry (in SKILL.md)

```markdown
| Platform | Token System | Component Pattern | Lint | Test |
|----------|-------------|-------------------|------|------|
| web | CSS vars / SCSS tokens (3-layer) | forwardRef + displayName | ESLint + Stylelint | Jest + RTL |
| ios | SwiftUI Environment (\.epostTheme) | SwiftUI View protocol | SwiftLint | XCTest |
| android | CompositionLocal (EpostTheme.*) | @Composable functions | Detekt | Compose UI Test |
```

### Audit Workflow (6 steps)

1. **Collect** -- Read component code + platform reference checklist
2. **Tokens** -- Verify no hardcoded colors/spacing/typography; all via design tokens
3. **Patterns** -- Check component follows platform conventions (naming, structure, API)
4. **Quality** -- Performance, memory, re-render/recomposition, type safety
5. **Security** -- Input validation, no secrets, safe rendering (XSS/injection)
6. **Consistency** -- If multi-platform: compare API shape, naming, token usage parity

### Audit Report Schema

```json
{
  "component": "EpostButton",
  "platform": "web|ios|android",
  "auditor": "epost-muji",
  "date": "2026-03-04",
  "verdict": "pass|fix-and-reaudit|redesign",
  "summary": { "critical": 0, "high": 1, "medium": 2, "low": 3 },
  "findings": [
    {
      "id": "AUC-001",
      "severity": "critical|high|medium|low",
      "category": "token|pattern|performance|security|a11y|consistency",
      "location": "path/to/file:line",
      "issue": "Hardcoded color #FF0000 instead of theme token",
      "expected": "Use theme.colors.error (web) or EpostTheme.colors.error (android)",
      "suggestion": "Replace with design token reference",
      "mentoring": "Design tokens ensure theming and dark mode work automatically. Hardcoded values break when themes change.",
      "reference": "checklist-web.md#tokens"
    }
  ],
  "crossPlatformNotes": []
}
```

## Related Code Files

### Create (EXCLUSIVE)
- `packages/design-system/skills/audit-ui-component/SKILL.md` -- Main skill [OWNED]
- `packages/design-system/skills/audit-ui-component/references/audit-report-schema.md` -- Schema [OWNED]

### Read-Only (shared)
- `packages/core/skills/code-review/SKILL.md` -- Review pattern reference
- `packages/core/skills/subagent-driven-development/references/code-quality-reviewer-prompt.md` -- Severity model
- `packages/design-system/skills/web-ui-lib-dev/references/audit-ui.md` -- Existing web audit

## Implementation Steps

1. Create `packages/design-system/skills/audit-ui-component/SKILL.md`:
   - Frontmatter: name, description (trigger-only), metadata with agent-affinity [epost-muji, epost-reviewer], platforms [all], connections.requires [code-review], connections.enhances [web-ui-lib-dev, ios-ui-lib, android-ui-lib]
   - Platform registry table
   - 6-step audit workflow
   - Aspect files table pointing to references/
   - Senior reviewer persona section (mentoring tone guidelines)
2. Create `packages/design-system/skills/audit-ui-component/references/audit-report-schema.md`:
   - Full JSON schema with field descriptions
   - Severity definitions (aligned with code-quality-reviewer-prompt.md)
   - Category definitions with examples
   - Verdict criteria (pass: 0 critical+high; fix-and-reaudit: any high; redesign: 3+ critical)

## Todo List
- [ ] Create SKILL.md with platform registry + workflow
- [ ] Create audit-report-schema.md
- [ ] Verify frontmatter follows CSO principles (trigger-only description)

## Success Criteria
- SKILL.md < 120 lines, no hardcoded platform details
- Schema supports all 3 platforms with same structure
- Mentoring field in findings encourages learning

## Risk Assessment
**Risks**: Skill too abstract without platform checklists
**Mitigation**: Phase 02 adds concrete checklists immediately after

## Security Considerations
- Audit skill itself has no security surface
- Security category in checklist catches XSS, injection, secret exposure in audited code
