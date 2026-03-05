---
plan-id: 260305-1153-docs-init-fixes
title: "Fix /docs --init flag, KB alignment, and web bias"
status: draft
created: 2026-03-05
complexity: simple
estimated-effort: 30min
platforms: [all]
packages: [core]
---

# Fix /docs --init: Flag, KB Alignment, Web Bias

## Problem

Three issues with `/docs` init workflow:

1. **Missing `--init` flag** — User types `/docs --init`, but SKILL.md only has `--migrate`, `--scan`, `--verify`, `--batch`. Auto-detection silently falls through to `references/update.md` (if `docs/index.json` exists) or init (if absent). No explicit `--init` trigger.
2. **KB structure not enforced** — `references/init.md` says "follow knowledge-base skill format" but doesn't import or inline the directory structure/templates from `knowledge-retrieval/references/knowledge-base.md`. Documenter may deviate.
3. **Web/klara-theme bias** — Auto-detection step 3 checks `libs/klara-theme/` and component docs route is klara-specific. Init should produce project-level KB, not web-specific docs.

## Phase 1: Add `--init` Flag + Fix Auto-Detection

**Files**: `packages/core/skills/docs/SKILL.md`

Changes:
- Add `--init` to Step 0 flag list: `If $ARGUMENTS starts with --init: load references/init.md and execute`
- Update `argument-hint` in frontmatter to include `--init`
- Reword auto-detection to clarify: absent `docs/index.json` -> init (generation mode), present -> update. Component detection is a SECONDARY check, not part of init flow.

## Phase 2: Decouple Init from Web/klara-theme

**Files**: `packages/core/skills/docs/references/init.md`

Changes:
- Remove klara-theme/web-specific references from Generation Mode
- Make scanning platform-agnostic: detect ANY project type (check for `package.json`, `pom.xml`, `Package.swift`, `build.gradle.kts`, etc.)
- Keep component docs (`references/component.md`) as a web-specific workflow — but don't route init to it
- Ensure auto-generated ADRs, ARCHs, CONVs, FEATs, PATTERNs are derived from whatever project type is detected

## Phase 3: Tighten KB Structure Alignment

**Files**: `packages/core/skills/docs/references/init.md`

Changes:
- Inline the canonical directory structure from `knowledge-base.md` (already mostly correct, verify exact match)
- Inline the `index.json` schema fields (ensure `agentHint`, `audience`, `related` are documented)
- Add explicit cross-reference: "Follow templates defined in `knowledge-retrieval/references/knowledge-base.md`"
- Ensure document templates reference matches knowledge-base skill templates exactly

## Verification

- [ ] `/docs --init` explicitly triggers init mode
- [ ] `/docs` with no `docs/index.json` still auto-detects init mode
- [ ] Init workflow produces `docs/` structure matching `knowledge-base.md` spec
- [ ] No klara-theme or web-specific content in init workflow
- [ ] Component docs remain accessible via `/docs --batch` (unchanged)

## Files Modified

| File | Change |
|------|--------|
| `packages/core/skills/docs/SKILL.md` | Add `--init` flag, fix argument-hint |
| `packages/core/skills/docs/references/init.md` | Remove web bias, tighten KB alignment |
