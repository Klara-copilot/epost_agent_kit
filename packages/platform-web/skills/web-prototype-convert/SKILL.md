---
name: web-prototype-convert
description: "(ePost) Use when: 'convert prototype', 'migrate mockup', 'turn this into production code', 'convert this HTML/React app to ePost', 'adopt this design into luz_next'. Converts external prototypes into luz_next + klara-theme production code using a 4-phase agentic pipeline."
argument-hint: "<prototype-path> [--target module|component]"
user-invocable: true
metadata:
  keywords: [prototype, convert, migrate, mockup, production, klara-theme, tokens]
  triggers:
    - "convert prototype"
    - "migrate mockup"
    - "turn this into production code"
    - "convert this HTML/React app to ePost"
    - "adopt this design into luz_next"
  platforms: [web]
  connections:
    requires: [web-frontend, web-ui-lib, web-modules]
    enhances: [ui-lib-dev]
---

# Web Prototype Convert

Convert external prototypes into luz_next + klara-theme production code.

## Invocation
`/web-prototype-convert <path> [--target module|component]`

## 4-Phase Pipeline

### Phase A — UNDERSTAND (intent inference)
- Build a semantic mental model of the prototype
- Answer every question in `references/analysis-checklist.md` explicitly
- Output: inventory covering framework, components, data, styles, interactions
- **No code yet.**

### Phase B — DECIDE (reviewable conversion spec)
Produce `conversion-spec.md` in the prototype directory. Structure in THREE sections:
- **✅ Confident** — auto-convert decisions, no review needed
- **🟡 Judgment call** — review requested; present multiple-choice options
- **🔴 Needs input** — blocked; user must answer before Phase C

**Spec format rules:**
- Content: plain language first, technical footnote in parentheses — e.g., "Your pop-up becomes a **Dialog** (klara: Dialog, variant=modal)"
- Questions: bold keyword format — e.g., "Reply **collapsible** or **fixed**"
- Two-pass: auto-decide ✅ first → batch 🟡 → surface 🔴 alongside them
- **STOP and wait for user confirmation before Phase C.**

### Phase C — IMPLEMENT (with live knowledge)
For each component, read live klara source before writing any code.

| Confidence | Read |
|------------|------|
| HIGH | `component-mapping.md` hint only — skip live read |
| MEDIUM | `{name}.stories.tsx` only |
| LOW | `{name}.tsx` + `{name}.stories.tsx` |

Always do a first-encounter live read to validate mapping freshness.
- Live source: `libs/klara-theme/src/lib/components/{name}/`
- `component-mapping.md` = vocabulary hints; live source = truth
- Match tokens by semantic intent (see `token-mapping.md`)
- Place files per luz_next module structure (see `style-migration.md`)
- Wire data layer per `data-migration.md`

### Phase D — VALIDATE (post-implement)
- Verify all props against live klara API
- No hardcoded hex/px values — all tokens must be semantic
- File placement matches luz_next convention
- Data flow: Component → Hook → Action → Service → API

## Reference Files

| File | Phase | Purpose |
|------|-------|---------|
| `references/analysis-checklist.md` | A | Intent inference questionnaire |
| `references/component-mapping.md` | B, C | klara semantic vocabulary |
| `references/token-mapping.md` | B, C | Intent-based token mapping |
| `references/style-migration.md` | C | luz_next structure + style patterns |
| `references/data-migration.md` | C | FetchBuilder + RTK dual-store patterns |
