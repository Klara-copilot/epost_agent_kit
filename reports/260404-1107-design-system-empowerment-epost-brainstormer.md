---
title: "Empower Design-System Package with UI/UX Pro Max Patterns"
status: complete
agent: epost-brainstormer
created: 2026-04-04
scope: packages/design-system/
platforms: [all]
verdict: Approach A recommended
---

# Design-System Empowerment: Adopting UI/UX Pro Max Patterns

## Problem Statement

epost_agent_kit's design-system package has strong foundations (Vien 2.0 with 1,059 variables, 4-layer architecture, 42 collections) but **5 critical gaps** vs. UI/UX Pro Max patterns:

1. **No motion tokens** — animations hardcoded in tailwind preset
2. **No module-specific UX reasoning** — Inbox (productivity) vs Monitoring (dashboard) vs Composer (creative) treated identically
3. **Accessibility at audit-time, not creation-time** — contrast checking is post-hoc via epost-a11y-specialist
4. **No per-mode contrast verification** — 4 theme modes exist but no validation pipeline
5. **No Figma-to-code token sync** — component metadata only, no token export loop

Secondary gaps: z-index disconnected, hardcoded text editor colors (16 hex), only 3 state tokens exposed (focus/hover/pressed vs Figma's 7), no token showcase/Storybook page.

## Evaluated Approaches

### Approach A: Reference-First Enrichment (RECOMMENDED)

Add **references** to existing skills. No new skills. Teach agents what they already do, but better.

| New file | Parent skill | Content |
|----------|-------------|---------|
| `design-tokens/references/motion-tokens.md` | design-tokens | Semantic motion token spec: duration (instant 100ms, micro 150ms, macro 300ms, page 500ms), easing (ease-out for enter, ease-in for exit), GPU-only constraint, prefers-reduced-motion. Maps to web (CSS), iOS (SwiftUI .animation), Android (Compose animateAsState). |
| `design-tokens/references/module-ux-profiles.md` | design-tokens | Per-B2B-module UX profiles. Maps module -> mood/density/motion/color-emphasis. E.g., Inbox=productivity (dense, muted, fast transitions), Monitoring=dashboard (spacious, data-viz palette, auto-refresh animation), Composer=creative (generous whitespace, brand-color-rich). |
| `design-tokens/references/token-validation-rules.md` | design-tokens | Contrast rules baked into token definitions. WCAG AA minimums per token pair (foreground/background). Per-mode (light/dark/brand-neg/brand-pos) contrast matrix. Rules agents apply at token creation, not after audit. |
| `design-tokens/references/z-index-scale.md` | design-tokens | Semantic z-index layers: base(0), dropdown(100), sticky(200), overlay(300), modal(400), toast(500), tooltip(600). Tailwind utility mapping. |
| `ui-lib-dev/references/token-showcase.md` | ui-lib-dev | Storybook token showcase page spec: color swatches, spacing scale, typography samples, motion demos, z-index layers. Scaffold recipe for agents. |
| `figma/references/token-sync-pipeline.md` | figma | Figma variables -> JSON export -> SCSS primitives -> Tailwind config -> CSS custom properties. Verification checklist: count match, name match, value match. |

Also update existing files:
- `design-tokens/SKILL.md` — add motion, z-index, module profiles to aspect table
- `ui-lib-dev/references/audit-standards.md` — add MOTION rule section, Z-INDEX check
- `epost-muji.md` agent — add `domain-b2b` to skills list (module-aware guidance)

**Pros:**
- Zero new skills — stays KISS
- Lowest effort (~6h)
- Immediately usable by epost-muji without workflow changes
- Module UX profiles bridge design-system and domains packages naturally
- References are progressive disclosure — loaded only when relevant

**Cons:**
- No enforcement — agents must choose to load references
- Module UX profiles are advisory, not machine-searchable like UI/UX Pro Max's CSV+BM25
- Motion tokens are spec-only until klara-theme implements them in code

**Trade-offs quantified:**
- Effort: ~6h (6 references + 3 file updates)
- Token cost: ~2KB per reference, loaded on demand = negligible context impact
- Risk: Low — additive only, no existing behavior changes
- Maintenance: Low — references evolve with klara-theme naturally

---

### Approach B: Structured Data + Validation Skill

Add a new `design-validation` skill that enforces token rules programmatically, plus structured JSON data files for module profiles.

| New artifact | Type | Content |
|-------------|------|---------|
| `design-validation/SKILL.md` | New skill | Validates token usage: contrast checking, motion token compliance, z-index ordering, per-mode verification. Runs as pre-audit gate. |
| `design-validation/references/contrast-matrix.md` | Reference | Full WCAG AA contrast pairs for all 4 modes |
| `design-validation/references/mode-test-protocol.md` | Reference | Per-mode visual regression protocol |
| `design-tokens/assets/module-ux-profiles.json` | Data file | Machine-readable module -> UX mapping (like UI/UX Pro Max's CSV). Fields: module, mood, density, motionBudget, colorEmphasis, typographyScale, a11yPriority |
| `design-tokens/assets/motion-tokens.json` | Data file | Structured motion token definitions with platform mappings |
| All Approach A references | References | Same as Approach A |

Also:
- Register `design-validation` in `packages/design-system/package.yaml`
- Add to epost-muji's skills list
- Add to epost-a11y-specialist's skills list

**Pros:**
- Machine-readable data enables programmatic validation
- Module profiles are queryable (grep-friendly JSON)
- Contrast checking becomes a gate, not a suggestion
- Closer to UI/UX Pro Max's data-driven design approach
- Dark mode and brand modes get explicit test protocols

**Cons:**
- New skill = new maintenance surface
- Validation without runtime tooling is still agent-interpreted (no actual contrast calculator)
- Module UX profiles require domain team buy-in to maintain
- ~12h effort — 2x Approach A
- Risk of YAGNI: validation skill may duplicate epost-a11y-specialist's role

**Trade-offs quantified:**
- Effort: ~12h (1 skill + 2 data files + 6 references + 4 file updates)
- Token cost: skill SKILL.md (~1.5KB) + 2 JSON assets + references
- Risk: Medium — new skill needs eval-set, package registration, agent wiring
- Maintenance: Medium — JSON data files need updating when modules change

---

### Approach C: Full Design System Intelligence Layer

Build a comprehensive design intelligence system matching UI/UX Pro Max's combinatorial approach.

| New artifact | Type | Content |
|-------------|------|---------|
| `design-intelligence/SKILL.md` | New skill | Orchestrates design decisions: product-type reasoning, palette selection with built-in contrast, animation system, responsive strategy |
| `design-intelligence/assets/module-profiles.json` | Data | 9 B2B modules + B2C mapped to UX archetypes |
| `design-intelligence/assets/animation-rules.json` | Data | Motion token definitions + anti-patterns + platform mappings |
| `design-intelligence/assets/contrast-pairs.json` | Data | Pre-computed contrast ratios for all token pairs x 4 modes |
| `design-intelligence/references/design-reasoning.md` | Reference | Decision framework: given (module, component, state, platform) -> recommended tokens, motion, density |
| `design-intelligence/references/dark-mode-protocol.md` | Reference | Full dark mode testing: desaturation rules, contrast verification, tonal variant generation |
| `design-intelligence/references/cross-platform-distribution.md` | Reference | Token generation pipeline: Figma -> JSON -> {SCSS/Swift/Kotlin} with CI verification |
| `design-validation/` | New skill | Same as Approach B |
| Figma MCP token sync | Enhancement | Extend figma skill with bidirectional token sync |

Also:
- New `design-intelligence` skill registered
- Muji agent refactored to use intelligence layer as primary routing
- Cross-platform token generation pipeline documented

**Pros:**
- Most complete — closest to UI/UX Pro Max's capabilities
- Data-driven design decisions reduce inconsistency across modules
- Cross-platform token distribution closes the iOS/Android gap
- Pre-computed contrast pairs eliminate post-hoc accessibility failures

**Cons:**
- ~25h effort — 4x Approach A
- Two new skills + significant data file creation
- Requires actual contrast computation (not just rules)
- Cross-platform pipeline requires build tooling outside agent scope
- YAGNI violation: ePost has 9 B2B modules, not 161 product types — the combinatorial approach is overkill
- High maintenance: data files need updating when Vien 2.0 evolves

**Trade-offs quantified:**
- Effort: ~25h (2 skills + 3 data files + 4 references + 5 file updates)
- Token cost: High — intelligence skill would be loaded frequently
- Risk: High — builds infrastructure for complexity that may never materialize
- Maintenance: High — multiple data files, two skills, pipeline tooling

---

## Comparison Matrix

| Dimension | A: References | B: Structured Data | C: Full Intelligence |
|-----------|--------------|-------------------|---------------------|
| Effort | **6h** | 12h | 25h |
| New skills | 0 | 1 | 2 |
| New references | 6 | 8 | 7 |
| New data files | 0 | 2 | 3 |
| Closes motion gap | Spec only | Spec + JSON | Spec + JSON + pipeline |
| Closes contrast gap | Rules (advisory) | Rules (gate) | Pre-computed pairs |
| Module UX profiles | Markdown (advisory) | JSON (queryable) | JSON + reasoning engine |
| Dark mode validation | Mentioned | Protocol defined | Full protocol + data |
| Cross-platform | Documented | Documented | Pipeline spec |
| YAGNI compliance | **High** | Medium | Low |
| KISS compliance | **High** | Medium | Low |
| Maintenance burden | **Low** | Medium | High |

## Recommendation: Approach A, Graduated to B

**Start with Approach A** (reference-first enrichment). It delivers 80% of the value at 25% of the cost.

**Graduate to Approach B** when:
- Teams actively use module UX profiles and need machine-queryable format
- epost-a11y-specialist needs contrast data at token-creation time (not just audit)
- Motion tokens are implemented in klara-theme code (spec becomes enforceable)

**Never build Approach C** unless ePost grows to 20+ distinct product types or cross-platform token generation becomes a weekly pain point. The combinatorial design engine (67 styles x 161 palettes x 57 fonts) solves a problem ePost doesn't have — 9 modules with a unified design system is not the same as 161 product types.

## Second-Order Effects

1. **Module UX profiles create a new coordination surface** between design-system and domains packages. domain-b2b skill may need to reference them.
2. **Adding `domain-b2b` to epost-muji's skills** means muji loads ~2KB more context per invocation. Acceptable — muji rarely hits context limits.
3. **Motion token spec without implementation** creates a "spec-reality gap" — agents will recommend tokens that don't exist in code yet. Mitigate by marking spec as "proposed" until klara-theme ships motion tokens.
4. **Token validation rules may conflict with epost-a11y-specialist's audit**. Mitigate by making validation rules a subset that a11y-specialist can reference, not a parallel system.

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Motion spec adopted but never implemented in klara-theme | Medium | Low | Mark as "proposed"; revisit after 2 sprints |
| Module UX profiles become stale | Medium | Medium | Tie profile updates to domain-b2b skill updates |
| Contrast rules conflict with a11y-specialist | Low | Medium | Reference, don't duplicate — a11y-specialist imports validation rules |
| Token showcase never built in Storybook | Medium | Low | Scaffold recipe is the deliverable; actual page is team's choice |

## Implementation Sketch (Approach A)

```
packages/design-system/
  skills/
    design-tokens/
      references/
        motion-tokens.md          ← NEW: semantic motion system
        module-ux-profiles.md     ← NEW: per-B2B-module UX mapping
        token-validation-rules.md ← NEW: WCAG contrast at creation time
        z-index-scale.md          ← NEW: semantic z-index layers
        variables-architecture.md (existing)
        inconsistencies-improvements.md (existing)
        platform-token-mapping.md (existing)
      SKILL.md                    ← UPDATE: add new references to aspect table
    ui-lib-dev/
      references/
        token-showcase.md         ← NEW: Storybook token showcase spec
        audit-standards.md        ← UPDATE: add MOTION, Z-INDEX rules
    figma/
      references/
        token-sync-pipeline.md    ← NEW: Figma -> SCSS -> Tailwind pipeline
  agents/
    epost-muji.md                 ← UPDATE: add domain-b2b to skills
```

## Unresolved Questions

1. **Who owns module UX profiles long-term?** Design team or domain teams? If domain teams, profiles should live in `packages/domains/` not `packages/design-system/`.
2. **Does klara-theme's tailwind preset accept token-based animation values?** If the preset is locked, motion tokens need a different integration path.
3. **Is there an existing Figma plugin or API for token export?** The `figma` skill uses Figma MCP for component data — unclear if variables API is available via the same channel.
4. **Cross-platform token generation**: iOS and Android references say "forward-looking" for token APIs. Are `ios_theme_ui` and `android_theme_ui` mature enough to consume generated tokens?
5. **Should contrast pairs be computed from the `figma-variables.json` asset?** The 2.3MB JSON has all color values — a script could pre-compute all foreground/background contrast ratios. But is that Approach B scope creep?

## Next Steps

If consensus on Approach A:
- Dispatch `epost-planner` to create implementation plan with 6 reference files + 3 updates
- Estimated 6h across 2-3 phases (tokens references, then ui-lib-dev, then figma)
- No blocking dependencies — can start immediately
