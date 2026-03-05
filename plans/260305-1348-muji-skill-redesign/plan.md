---
title: "Muji Agent Skill Redesign: Cross-Platform Design System Team"
description: "Redesign epost-muji skills to reflect cross-platform Figma-to-code team with component guidance, token translation, UI audit, and integration consulting."
status: completed
priority: P1
effort: 4h
tags: [muji, design-system, skills, cross-platform, figma, audit]
created: 2026-03-05
updated: 2026-03-05
---

# Muji Agent Skill Redesign

## Problem Statement

Current muji has 4 web-only skills (`web-figma`, `web-figma-variables`, `web-ui-lib`, `web-ui-lib-dev`). Team actually works cross-platform: web, iOS, Android. They translate Figma to platform code, guide other teams on UI integration, resolve design-code conflicts, translate Figma variables to platform-native tokens, and audit/review UI implementations across all platforms.

## Current vs Target

| Capability | Current Skills | Gap |
|-----------|---------------|-----|
| Figma extraction | web-figma | Adequate (MCP is platform-neutral) |
| Figma variables/tokens | web-figma-variables | Needs platform token mapping (iOS/Android) |
| Web component dev | web-ui-lib, web-ui-lib-dev | Adequate |
| iOS component dev | None (relies on skill-discovery ios-ui-lib) | Need ios-ui-lib-dev or merge into unified |
| Android component dev | None (relies on skill-discovery android-ui-lib) | Need android-ui-lib-dev or merge into unified |
| UI audit/review | audit references/ui.md | Adequate (already cross-platform) |
| Integration guidance | Scattered in web-ui-lib | Needs dedicated cross-platform guidance |
| Token translation | web-figma-variables only | Needs iOS/Android token mapping |
| Design-code conflict | Not addressed | New capability |

## Design Decision: Skill Architecture

**Option A**: Keep platform-split skills (web-ui-lib, ios-ui-lib, android-ui-lib) + add dev variants per platform.
**Option B**: Merge into fewer cross-platform skills with platform references.

**Recommendation: Option B** — Fewer skills, platform-specific content in `references/`. Rationale:
- Team thinks cross-platform first
- Reduces skill count (4 current + 2 new vs 6+ platform splits)
- Aligns with consolidation pattern used for cook/fix/debug/plan
- Platform specifics go in reference files loaded on-demand

## New Skill Set (6 skills)

| Skill | Purpose | Replaces |
|-------|---------|----------|
| `figma` | Figma MCP tools, extraction, screenshot validation | `web-figma` (rename, platform-neutral) |
| `design-tokens` | Token architecture, Figma variable translation to web/iOS/Android | `web-figma-variables` (expand scope) |
| `ui-lib` | Component catalog across platforms (web/iOS/Android) | `web-ui-lib` + `ios-ui-lib` + `android-ui-lib` |
| `ui-lib-dev` | Component development pipeline (plan/implement/audit/fix/doc) | `web-ui-lib-dev` (expand to multi-platform) |
| `ui-guidance` | Integration consulting, design-code conflict resolution | NEW |
| `audit` (core) | Already handles `--ui` flag routing to muji | Keep as-is |

## Agent Skill List Update

```yaml
skills: [core, skill-discovery, figma, design-tokens, ui-lib, ui-lib-dev, ui-guidance, audit]
```

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Rename + expand figma and design-tokens skills | 1.5h | pending | [phase-01](./phase-01-figma-and-tokens.md) |
| 2 | Merge ui-lib skills + expand ui-lib-dev | 1.5h | pending | [phase-02](./phase-02-ui-lib-consolidation.md) |
| 3 | Create ui-guidance skill + update agent | 1h | pending | [phase-03](./phase-03-ui-guidance-and-agent.md) |

## Critical Constraints

- All edits in `packages/design-system/` (source of truth)
- `web-figma` references in other skills/agents must be updated
- `skill-index.json` must be regenerated after changes
- Existing `audit/references/ui.md` already handles cross-platform audit — no changes needed

## Success Criteria

- [ ] Muji agent has 6 focused skills covering all 6 team capabilities
- [ ] Platform-specific content in `references/` (web.md, ios.md, android.md per skill)
- [ ] No web-only naming; skills are platform-neutral at top level
- [ ] Token translation covers CSS variables, Swift constants, Kotlin theme objects
- [ ] ui-guidance skill covers integration consulting + design-code conflict resolution
- [ ] skill-index.json updated with new skill names and connections
- [ ] Agent description updated to reflect cross-platform scope
