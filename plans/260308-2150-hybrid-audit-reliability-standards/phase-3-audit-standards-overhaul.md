---
phase: 3
title: "Audit standards overhaul + ui-guidance merge"
effort: 60m
depends: []
---

# Phase 3: Audit Standards Overhaul + UI Guidance Merge

## Context Links
- [Plan](./plan.md)
- `packages/design-system/skills/ui-lib-dev/references/audit-standards.md` — current 9-section checklist
- `packages/design-system/skills/ui-guidance/SKILL.md` — to be merged
- `packages/design-system/skills/ui-lib-dev/SKILL.md` — receives ui-guidance reference

## Overview

Overhaul `audit-standards.md` per requirements:
1. Section 0 (new): Live KB load gate — load latest standards from `libs/klara-theme/docs/index.json` FIRST
2. Section 5 (A11Y): Add delegation guidance to epost-a11y-specialist
3. Sections 7/8/9 (SEC/PERF/LDRY): Add standalone-component activation gates
4. Section 10 (new): Embedded components — verify embedded/children components are from/accepted by the lib; use RAG for token/component lookup
5. Merge `ui-guidance/SKILL.md` content into `ui-lib-dev/references/guidance.md`

## Files to Modify

- `packages/design-system/skills/ui-lib-dev/references/audit-standards.md` — add sections 0 and 10, update 5, 7, 8, 9
- `packages/design-system/skills/ui-lib-dev/SKILL.md` — add reference to `guidance.md`

## Files to Create

- `packages/design-system/skills/ui-lib-dev/references/guidance.md` — merged content from ui-guidance SKILL.md

## Implementation Steps

### 1. Add Section 0: Live KB Load Gate to `audit-standards.md`

Insert at the very top (before Section 1 Component Structure), as the new authoritative first section:

```markdown
## Section 0: Live KB Load Gate (KBLOAD) — Always First

Before applying any rule below, load the current klara-theme standards from the live KB. This ensures audit checks match the current library version, not cached assumptions.

**Steps:**
1. Read `libs/klara-theme/docs/index.json` (klara-theme KB registry — NOT `docs/index.json` at project root)
2. Load **FEAT-0001** → build `componentCatalog: Set<string>` (current component list)
3. Load task-relevant CONV-* entries → extract current naming conventions, token names, required props
4. If component in scope has a FEAT-* entry: load it → treat documented patterns as conventions, not violations
5. If `index.json` missing: fallback to `Glob libs/klara-theme/docs/**/*.md`, then read directly

**Gate**: Do NOT run STRUCT, PROPS, or TOKEN checks until KB loaded (or degraded-mode logged).

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| KBLOAD-001 | `libs/klara-theme/docs/index.json` read and `componentCatalog` populated | critical | Non-empty catalog built from FEAT-0001 | File missing AND no fallback found — log "KB unavailable" |
| KBLOAD-002 | At least one CONV-* entry loaded for audit scope | high | Relevant CONV entries loaded | No CONV entries loaded — audit proceeds but flag as coverage gap |
| KBLOAD-003 | Component-specific FEAT-* entry loaded (if component in scope) | medium | FEAT entry found and loaded | No FEAT entry — note "no KB entry" as docs gap; do not block audit |
```

### 2. Update Section 5: Accessibility (A11Y) with delegation guidance

Replace the current A11Y section intro with:

```markdown
## Section 5: Accessibility (A11Y)

**Delegation rule**: A11Y findings require WCAG expertise. If running as a standalone audit (not sub-agent), delegate A11Y review to **epost-a11y-specialist** via `/audit --a11y` after collecting violations below. If running as sub-agent (dispatched via Task tool), collect findings in `## A11Y Findings (for escalation)` section — the calling agent handles delegation.

**Collect**: List all A11Y violations with `finding_id`, `rule_id`, `file:line`, `issue`. Do not attempt WCAG remediation inline unless epost-a11y-specialist is unavailable.
```

Keep existing A11Y-001 through A11Y-005 rules unchanged.

### 3. Add standalone-component activation gates to Sections 7, 8, 9

**Section 7 (SEC)** — update activation gate:
```
**Activation gate**: Component imports fetch/axios/localStorage OR props include URL/apiKey/endpoint OR imports AI SDK.
**Standalone-component exception**: If the component is a pure presentational component (no network, no storage, no external API surface), skip SEC entirely — BIZ rules already ensure isolation.
```

**Section 8 (PERF)** — update activation gate:
```
**Activation gate**: 10+ files in scope OR any file >300 LOC.
**Standalone-component exception**: Single isolated component <300 LOC → skip PERF-001 through PERF-003; apply PERF-004 (mock data isolation) always.
```

**Section 9 (LDRY)** — add note:
```
**Scope note**: LDRY applies to the component directory and its immediate dependencies. For a single standalone component with no _utils/ subdirectory, only LDRY-003 (POC maturity) applies. LDRY-001 and LDRY-002 require at least 2 files in scope to be meaningful.
```

### 4. Add Section 10: Embedded Components (EMBED)

Add after Section 9, before Mode Applicability table:

```markdown
## Section 10: Embedded Components (EMBED)

When a component renders other components internally (embedded/children components), verify those embedded components are library-approved — not overriding library internals or using external components that bypass the design system.

**RAG lookup required**: Before running EMBED checks, query RAG for the component's known embedded component set:
1. `ToolSearch("web-rag")` → discover `mcp__web-rag-system__*` tools
2. Call `query` with "{component-name} embedded components tokens used" → surface known patterns
3. If RAG unavailable: Grep `libs/klara-theme/src/lib/components/{component}/` for import statements

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| EMBED-001 | All embedded components are from `klara-theme` or `libs/common/` — no external UI libs (MUI, Ant, etc.) | critical | Only library-internal or lib-approved components embedded | External UI library component embedded inside klara component |
| EMBED-002 | Embedded components used via their public API (props) only — no direct DOM manipulation of embedded component internals | critical | Embedded component API used as documented | `document.querySelector` on embedded component's DOM, or accessing private refs |
| EMBED-003 | Embedded component tokens/variants match current library catalog (verified via RAG/KB) | high | Token names and variant values match FEAT-* entry for embedded component | Hardcoded variant string that no longer exists in embedded component's API |
| EMBED-004 | No overriding embedded component styles via `!important`, direct class injection, or wrapper CSS that targets internal structure | high | Style customization via documented `className`/`style` props only | `.my-wrapper .embedded-component__internal { }` — targets internal structure |
| EMBED-005 | Children slots use types declared by the parent component — no arbitrary JSX trees passed where a specific component type is expected | medium | Children match documented slot types (e.g., `MenuItem[]` for Menu) | Arbitrary JSX passed to a typed slot prop |
```

### 5. Update Mode Applicability table

Add KBLOAD and EMBED rows:

```markdown
| KBLOAD | Y | Y | Always first — blocks TOKEN/STRUCT/PROPS until loaded |
| EMBED | Y | Y | Both modes; RAG lookup required for EMBED-003 |
```

### 6. Create `packages/design-system/skills/ui-lib-dev/references/guidance.md`

Merge ui-guidance content into a reference file under ui-lib-dev:

```markdown
# UI Guidance — Integration Consulting & Conflict Resolution

Reference for epost-muji when providing cross-platform integration guidance to feature teams.
Loaded via ui-lib-dev skill when context is consumer guidance (not audit).

## When to Apply

- Team asks how to integrate a UI component
- Design-code mismatch found during review
- Token usage questions (which token for which purpose)
- Component customization beyond standard variants
- Platform-specific implementation differences

## Guidance Workflow

### 1. Understand Context
- What platform? (web/iOS/Android)
- What component or pattern?
- What's the design spec (Figma link or screenshot)?
- What's the current implementation?

### 2. Diagnose
- Compare implementation against design tokens (load KB: `libs/klara-theme/docs/index.json`)
- Check component API usage against FEAT-* entry
- Identify token misuse (hardcoded values, wrong semantic level)
- Flag accessibility gaps

### 3. Resolve Design-Code Conflicts

| Conflict | Resolution |
|----------|-----------|
| Design uses non-existent token | Map to closest semantic token, flag for design team |
| Design spacing doesn't match scale | Use nearest scale value, document deviation |
| Component doesn't support variant | Extend via composition, not fork |
| Platform limitation prevents exact match | Document acceptable deviation, prioritize intent |
| Dark mode breaks contrast | Use semantic tokens (auto-adjusts), validate contrast ratio |

### 4. Platform-Specific Knowledge

Load platform ui-lib skill via skill-discovery:
- Web: `web-ui-lib` (React/klara-theme)
- iOS: `ios-ui-lib` (SwiftUI/ios_theme_ui)
- Android: `android-ui-lib` (Compose/android_theme_ui)

### 5. Review Checklist (Consumer Guidance)

- [ ] Uses design tokens (no hardcoded colors/spacing/typography)
- [ ] Correct semantic level (not using primitives directly)
- [ ] Component from library (not custom recreation)
- [ ] Responsive behavior matches design
- [ ] Dark mode supported via semantic tokens
- [ ] Accessibility: contrast, touch targets, labels
- [ ] Platform conventions followed (HIG/Material/Web standards)
```

### 7. Update `packages/design-system/skills/ui-lib-dev/SKILL.md`

Add reference to guidance.md in the References section:

```markdown
- `references/guidance.md` — Integration consulting workflow and design-code conflict resolution (replaces ui-guidance skill)
```

### 8. Mark `packages/design-system/skills/ui-guidance/SKILL.md` as deprecated

Update its description to redirect to ui-lib-dev:

```markdown
# DEPRECATED

This skill has been merged into `ui-lib-dev/references/guidance.md`.
Activate `ui-lib-dev` skill instead — guidance content is available as a reference there.
```

## Todo List

- [ ] Add Section 0 (KBLOAD) to `audit-standards.md`
- [ ] Update Section 5 A11Y with delegation guidance
- [ ] Add standalone-component gates to Section 7 (SEC), Section 8 (PERF), Section 9 (LDRY)
- [ ] Add Section 10 (EMBED) with RAG lookup
- [ ] Update Mode Applicability table with KBLOAD + EMBED rows
- [ ] Create `packages/design-system/skills/ui-lib-dev/references/guidance.md`
- [ ] Update `packages/design-system/skills/ui-lib-dev/SKILL.md` to reference guidance.md
- [ ] Deprecate `packages/design-system/skills/ui-guidance/SKILL.md`
- [ ] Run `epost-kit init` to sync `.claude/`

## Success Criteria

- audit-standards.md starts with Section 0 (KBLOAD) live KB load gate
- A11Y section includes delegation instructions for both standalone and sub-agent contexts
- SEC/PERF/LDRY have explicit standalone-component exception gates
- Section 10 (EMBED) present with 5 rules and RAG lookup
- ui-guidance content available in ui-lib-dev/references/guidance.md
