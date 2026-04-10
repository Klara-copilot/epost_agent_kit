---
phase: 1
title: Rewrite SKILL.md with 4-phase pipeline and author analysis-checklist
effort: S
depends: []
---

## Context

Foundation phase. Establishes the 4-phase agentic pipeline (UNDERSTAND → DECIDE → IMPLEMENT → VALIDATE) in SKILL.md and authors the first reference file used in Phase A.

## Files to Create / Modify

**Modify**:
- `packages/platform-web/skills/web-prototype-convert/SKILL.md`

**Create**:
- `packages/platform-web/skills/web-prototype-convert/references/analysis-checklist.md`

## SKILL.md Requirements

### Frontmatter changes
- `user-invocable: true` (enable the skill)
- Remove "disabled" warning paragraph
- Keep existing `name`, `description`, `argument-hint`, `metadata` (connections/triggers)
- Update `description` to reflect 4-phase pipeline trigger phrases

### Body structure (≤ 80 lines total)

```
# Web Prototype Convert

Convert external prototypes into luz_next + klara-theme production code.

## Invocation
/web-prototype-convert <path> [--target module|component]

## 4-Phase Pipeline

### Phase A — UNDERSTAND (intent inference)
- Build semantic mental model of the prototype
- Answer every question in references/analysis-checklist.md
- Output: inventory (framework, components, data, styles, interactions)
- **No code yet.**

### Phase B — DECIDE (reviewable conversion spec)
- Produce a spec in plain language first, technical footnote second
- Structure in THREE sections:
  - ✅ Confident — auto-convert, no review needed
  - 🟡 Judgment call — review requested, multiple-choice options
  - 🔴 Needs input — blocked until user answers (multiple-choice only)
- **STOP and wait for user confirmation before Phase C**

### Phase C — IMPLEMENT (with live knowledge)
- For each component: READ live klara source at `libs/klara-theme/src/lib/components/{name}/{name}.tsx`
- READ stories at `{name}.stories.tsx` for real usage
- component-mapping.md = vocabulary hints; live source = truth
- Match tokens by semantic intent (see token-mapping.md)
- Place files in correct luz_next module structure (see style-migration.md)
- Wire data layer per data-migration.md

### Phase D — VALIDATE (post-implement)
- Verify props against live klara API
- No hardcoded hex/px — all tokens are semantic
- File placement matches luz_next convention
- Data flow connected (Component → Hook → Action → Service → API)

## Reference Files
| File | Phase | Purpose |
|------|-------|---------|
| references/analysis-checklist.md | A | Intent inference questionnaire |
| references/component-mapping.md | B, C | klara semantic vocabulary |
| references/token-mapping.md | B, C | Intent-based token mapping |
| references/style-migration.md | C | luz_next structure + style patterns |
| references/data-migration.md | C | FetchBuilder + RTK dual-store patterns |
```

## analysis-checklist.md Requirements

Single-file questionnaire (≤ 200 lines) organized as sections the agent MUST answer explicitly in Phase A.

### Section 1 — Framework detection
- Is there a `package.json`? → parse `dependencies`
  - React / Next.js (App vs Pages Router) / Vite+React / Vue / Svelte
  - Detect via: `next`, `react`, `vite`, `vue`, `@sveltejs/kit`
- No `package.json` → plain HTML+JS. Scan `<script>`/`<link>` tags for:
  - jQuery (`jquery`), Bootstrap (`bootstrap`), Bulma (`bulma`), Tailwind CDN
- Record: framework, build tool, TS vs JS, styling engine

### Section 2 — Component inventory
- Walk the file tree; identify `.tsx`/`.jsx`/`.vue` files OR DOM sections in plain HTML
- Count UI elements: buttons, inputs, cards, modals, tabs, lists, tables
- Infer component boundaries from: exported components OR semantic HTML regions (`<section>`, `<nav>`, `<header>`)
- Output: `{ totalFiles, components: [{name, role, file}] }`

### Section 3 — Interaction patterns
- What is stateful vs purely presentational?
- Triggers: click → state change, input → validation, hover → reveal, scroll → lazy load
- Form handling: controlled, uncontrolled, react-hook-form, formik?
- Side effects: timers, intervals, intersection observers, resize listeners

### Section 4 — Data inventory
- Hardcoded arrays / JSON literals → list locations
- localStorage / sessionStorage / IndexedDB → note keys
- API calls → record URLs, methods, request/response shapes
- External state libs: Zustand, Redux, Jotai, Recoil, Context

### Section 5 — Visual inventory
- Fonts: `@font-face`, Google Fonts imports, CSS `font-family`
- Colors: scan for hex, rgb, hsl, CSS vars — note frequency
- Spacing scale: inspect Tailwind config OR CSS custom properties OR inline values
- Typography hierarchy: h1–h6 sizes, body, label, caption

### Section 6 — Target classification
Decide module vs component:
- **luz_next module** (`apps/luz-epost/src/app/[locale]/(app)/{module}/`) — if prototype is a full feature/screen/flow
- **klara-theme component** (`libs/klara-theme/src/lib/components/{name}/`) — if prototype is a reusable primitive

### Section 7 — Unknowns log
Write down what you COULD NOT determine from static analysis. These become 🔴 blockers in Phase B.

## Success Criteria

- [ ] SKILL.md rewritten, ≤ 80 lines, `user-invocable: true`, no "disabled" note
- [ ] SKILL.md describes all 4 phases with Phase B's 3-section output contract
- [ ] Phase C explicitly instructs reading live klara source at implementation time
- [ ] `references/analysis-checklist.md` exists, ≤ 200 lines, covers all 7 sections
- [ ] No dangling file references in SKILL.md

## Validation

```bash
wc -l packages/platform-web/skills/web-prototype-convert/SKILL.md
wc -l packages/platform-web/skills/web-prototype-convert/references/analysis-checklist.md
```
Both must be under cap. Then run `kit-verify`.
