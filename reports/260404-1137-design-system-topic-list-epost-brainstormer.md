---
status: complete
agent: epost-brainstormer
date: 2026-04-04
slug: design-system-topic-list
---

# Design System Planning — Final Topic List

Pipeline: **Figma (Vien 2.0) → Tokens → Components → Multi-platform delivery**

---

## Stage 1: Figma

### T01. Figma Naming Cleanup

- **What**: Fix 8 known naming inconsistencies (I1–I8) between Vien 2.0 variables and klara-theme code. Includes the "FIeld" typo (24 vars).
- **Why**: Naming drift makes automated token sync impossible. Every downstream topic assumes clean names.
- **Dependencies**: None — first mover.
- **Effort**: S (1-2h) — mechanical rename + verify references
- **Priority**: P0 — blocks token sync pipeline
- **Pipeline**: Figma

### T02. Figma Variable Export Pipeline

- **What**: Build a Figma → JSON variable export that resolves reference chains (up to 11 hops) and external library refs (28.3% remote). Output: platform-partitioned token JSON.
- **Why**: Current export is component-metadata only. No variable sync = manual token maintenance forever. This is THE critical missing link.
- **Dependencies**: T01 (clean names)
- **Effort**: L (1-2 days) — chain resolution logic, remote ref handling, mode composition
- **Priority**: P0 — unlocks all token work
- **Pipeline**: Figma → Tokens

---

## Stage 2: Tokens

### T03. Token Schema & Validation

- **What**: Define the canonical token JSON schema (primitives, semantic, component layers). Add validation that catches missing tokens, broken references, and type mismatches.
- **Why**: Without a schema, each platform interprets token JSON differently. Validation catches drift before it reaches code.
- **Dependencies**: T02 (export pipeline produces the JSON)
- **Effort**: M (3-6h)
- **Priority**: P1
- **Pipeline**: Tokens

### T04. Motion Tokens

- **What**: Define motion tokens: durations (micro: 150ms, transition: 300ms, complex: 400ms), easing curves (ease-out, spring), GPU-compositable property list. Replace hardcoded 3s/2s/1s and linear/ease-in-out.
- **Why**: Motion is currently hardcoded with non-standard durations. Consistent motion = perceived quality + accessibility (prefers-reduced-motion).
- **Dependencies**: T03 (schema to register motion token type)
- **Effort**: M (3-6h)
- **Priority**: P2 — not blocking component work, but needed for polish
- **Pipeline**: Tokens

### T05. Missing State Tokens

- **What**: Add disabled, loading, error, selected, active state tokens. Currently only focus/hover/pressed exist (3 of 8 needed).
- **Why**: Components can't implement full interaction states without these. Blocks any interactive component build.
- **Dependencies**: T03 (schema)
- **Effort**: S (1-2h) — define + add to Figma + export
- **Priority**: P1 — interactive components need these
- **Pipeline**: Tokens

### T06. Z-Index Token System

- **What**: Replace hardcoded z-index constants with a composable token scale (base, dropdown, sticky, modal, toast, tooltip). Make Tailwind-compatible.
- **Why**: Hardcoded z-indexes cause stacking bugs across modules. Tailwind integration = DX win.
- **Dependencies**: T03 (schema)
- **Effort**: S (1-2h)
- **Priority**: P2
- **Pipeline**: Tokens

### T07. Hardcoded Color Extraction

- **What**: Extract 16 hex colors hardcoded in text editor toolbar (and any other inline colors) into semantic tokens.
- **Why**: These bypass theming entirely — dark mode, brand switching all break on hardcoded colors.
- **Dependencies**: T03 (schema), T02 (export pipeline to verify mapping)
- **Effort**: S (1-2h)
- **Priority**: P1 — dark mode correctness depends on this
- **Pipeline**: Tokens

---

## Stage 3: Platform Token Delivery

### T08. Web Token Integration

- **What**: Auto-generate CSS custom properties + Tailwind config from token JSON. Replace manual SCSS token files in klara-theme.
- **Why**: Web has 105 SCSS files with manually maintained tokens. Automation eliminates drift.
- **Dependencies**: T02 (export pipeline), T03 (schema)
- **Effort**: M (3-6h) — codegen + Tailwind plugin + migration of existing SCSS
- **Priority**: P1
- **Pipeline**: Platform (Web)

### T09. iOS Token Integration

- **What**: Auto-generate Swift token constants from token JSON. Wire into ios_theme_ui color system.
- **Why**: iOS has ~5 stubs. Tokens must exist before components can be built.
- **Dependencies**: T02, T03
- **Effort**: M (3-6h)
- **Priority**: P1 — prerequisite for iOS component work
- **Pipeline**: Platform (iOS)

### T10. Android Token Integration

- **What**: Auto-generate Kotlin theme objects from token JSON. Scaffold EpostTheme.kt + Material3 mapping.
- **Why**: Android has 0 components. Tokens are the foundation.
- **Dependencies**: T02, T03
- **Effort**: M (3-6h)
- **Priority**: P1 — prerequisite for Android component work
- **Pipeline**: Platform (Android)

> **Note**: T08/T09/T10 are parallelizable — no cross-dependencies.

---

## Stage 4: Components

### T11. Component Parity Matrix & Prioritization

- **What**: Map web's 79 components to iOS (~5) and Android (0). Prioritize by usage frequency and module criticality. Output: ranked build list per platform.
- **Why**: Can't build 79 components on each platform. Need a data-driven priority list. Module UX profiles (productivity vs dashboard vs creative) inform which components matter most per module type.
- **Dependencies**: T09, T10 (tokens exist on target platforms)
- **Effort**: M (3-6h) — audit + cross-reference with module usage
- **Priority**: P1
- **Pipeline**: Components

### T12. iOS Component Buildout (Top 15)

- **What**: Implement top-15 priority components on iOS using ios_theme_ui + generated tokens. Follow ui-lib-dev pipeline.
- **Why**: iOS gap is the largest blocker to multi-platform parity.
- **Dependencies**: T09 (iOS tokens), T11 (priority list)
- **Effort**: XL (3-5 days)
- **Priority**: P1
- **Pipeline**: Components (iOS)

### T13. Android Component Buildout (Top 15)

- **What**: Implement top-15 priority components on Android using Compose + generated tokens.
- **Why**: Android starts from zero.
- **Dependencies**: T10 (Android tokens), T11 (priority list)
- **Effort**: XL (3-5 days)
- **Priority**: P1
- **Pipeline**: Components (Android)

> **Note**: T12/T13 are parallelizable.

---

## Stage 5: Quality

### T14. Per-Theme Contrast Verification

- **What**: Automated contrast checks (WCAG AA: 4.5:1 text, 3:1 UI) for all 4 theme modes. Generate pass/fail report per token pair.
- **Why**: Dark mode contrast is not verified today — colors are inverted, not independently tuned. Accessibility must be a constraint at token level, not post-hoc.
- **Dependencies**: T02 (need resolved token values per mode)
- **Effort**: M (3-6h)
- **Priority**: P1 — accessibility compliance
- **Pipeline**: Quality

### T15. Storybook Token Showcase

- **What**: Auto-generated Storybook page showing all tokens: colors (with contrast ratios), spacing scale, typography scale, motion previews, z-index visualizer.
- **Why**: Living documentation. Currently no visual token reference exists.
- **Dependencies**: T08 (web tokens integrated)
- **Effort**: M (3-6h)
- **Priority**: P2
- **Pipeline**: Quality

---

## Dependency Graph

```
T01 ──→ T02 ──→ T03 ──┬→ T04 (motion)
                       ├→ T05 (states)      
                       ├→ T06 (z-index)     
                       ├→ T07 (hardcoded colors)
                       ├→ T08 (web) ──→ T15 (storybook)
                       ├→ T09 (iOS) ──┬→ T11 (parity) ──→ T12 (iOS build)
                       └→ T10 (android)┘                ──→ T13 (android build)
         T02 ──→ T14 (contrast)
```

## Summary Table

| ID | Topic | Effort | Priority | Stage | Depends on |
|----|-------|--------|----------|-------|------------|
| T01 | Figma Naming Cleanup | S | P0 | Figma | — |
| T02 | Figma Variable Export Pipeline | L | P0 | Figma→Tokens | T01 |
| T03 | Token Schema & Validation | M | P1 | Tokens | T02 |
| T04 | Motion Tokens | M | P2 | Tokens | T03 |
| T05 | Missing State Tokens | S | P1 | Tokens | T03 |
| T06 | Z-Index Token System | S | P2 | Tokens | T03 |
| T07 | Hardcoded Color Extraction | S | P1 | Tokens | T03, T02 |
| T08 | Web Token Integration | M | P1 | Platform | T02, T03 |
| T09 | iOS Token Integration | M | P1 | Platform | T02, T03 |
| T10 | Android Token Integration | M | P1 | Platform | T02, T03 |
| T11 | Component Parity Matrix | M | P1 | Components | T09, T10 |
| T12 | iOS Component Buildout | XL | P1 | Components | T09, T11 |
| T13 | Android Component Buildout | XL | P1 | Components | T10, T11 |
| T14 | Per-Theme Contrast Verification | M | P1 | Quality | T02 |
| T15 | Storybook Token Showcase | M | P2 | Quality | T08 |

## Merge/Split Recommendations

| Action | Topics | Rationale |
|--------|--------|-----------|
| **MERGE** | T05 + T06 + T07 → "Token Gap Remediation" | Each is S-effort, all depend on T03, all fix token coverage gaps. Single plan, three tasks. |
| **SPLIT** | T02 if chain resolution + remote refs prove complex | Chain resolution (11 hops) and external lib resolution (2,064 refs) may each deserve focused attention. Evaluate after T01. |
| **Keep separate** | T12, T13 | Despite being parallel, different platforms = different skills, codebases, and review cycles. |

## Execution Order (Critical Path)

1. **T01** — Figma naming cleanup (S, P0)
2. **T02** — Variable export pipeline (L, P0)
3. **T03** — Token schema (M, P1) + **T14** — Contrast verification (M, P1) — parallel
4. **T05+T06+T07** merged — Token gap remediation (M, P1)
5. **T08/T09/T10** — Platform token integration — parallel
6. **T11** — Component parity matrix
7. **T12/T13** — Platform component buildout — parallel
8. **T04, T06, T15** — P2 items as capacity allows

Total critical path estimate: ~2 weeks (T01→T02→T03→T08/09/10→T11→T12/13)

## Unresolved Questions

1. **Figma API access**: Does T02 use Figma REST API (Variables endpoint) or Figma plugin export? API is cleaner but requires enterprise plan for Variables API.
2. **Remote library resolution**: Can the 5 external brand libraries be accessed via API, or do they need manual value snapshots?
3. **Token format standard**: Use W3C Design Tokens Community Group format (DTCG) or custom schema? DTCG adds adoption flexibility but more complexity.
4. **Platform token delivery**: Codegen at build time (CI pipeline) or committed artifacts? Committed = simpler, codegen = fresher.
5. **Component priority criteria**: Pure usage frequency, or weighted by module criticality (Inbox > Archive)?
6. **iOS/Android parity target**: Full 79-component parity or "good enough" subset for initial release?
