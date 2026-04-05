---
date: 2026-04-04
agent: epost-researcher
plan: /Users/than/Projects/epost_agent_kit/plans/260403-2206-understand-anything-adoption
scope: |
  Deep research into UI/UX Pro Max Skill architecture, design system generation,
  token mapping, component patterns, accessibility implementation, platform support.
  Goal: inform design-system package adoption decisions.
status: ACTIONABLE
---

## Research: UI/UX Pro Max Skill

### Research Question

What architectural patterns, design token systems, component generation strategies, and accessibility implementations does the UI/UX Pro Max Skill employ? How could these patterns inform our design-system package architecture and token/component generation workflows?

---

## Sources Consulted

1. [nextlevelbuilder/ui-ux-pro-max-skill — GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (HIGH)
2. [UI UX Pro Max Skill - Official Website](https://ui-ux-pro-max-skill.nextlevelbuilder.io/) (MEDIUM)
3. [skills.sh UI/UX Pro Max Skill Package](https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max) (MEDIUM)
4. [SKILL.md — Core Capabilities Documentation](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md) (HIGH)
5. [CLAUDE.md — Project Configuration](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/CLAUDE.md) (HIGH)
6. [HelloGitHub Project Summary](https://hellogithub.com/en/repository/nextlevelbuilder/ui-ux-pro-max-skill) (MEDIUM)
7. [DEV Community — Project Analysis](https://dev.to/wonderlab/open-source-project-of-the-day-part-7-uiux-pro-max-skill-ai-design-intelligence-for-building-4bd5) (MEDIUM)

---

## Key Findings

### 1. Architecture & Core System Design

**Multi-Tier Knowledge System:**
- **Data Tier**: 14 CSV databases (canonical source of truth in `/src/ui-ux-pro-max/data/`)
- **Search Tier**: BM25 probabilistic ranking engine using term frequency + document normalization
- **Reasoning Tier**: AI-driven rule application engine that selects optimal design patterns
- **Template Tier**: Platform-specific templates for web, iOS, Android, Flutter, etc.

**Scale of Content:**
- 161 industry-specific reasoning rules (product category → design pattern mapping)
- 67 distinct UI styles (glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, flat design, dark mode, etc.)
- 161 color palettes (aligned to product types, not random)
- 57 curated typography pairings from Google Fonts
- 99 UX guidelines with priority ranking
- 25 chart type recommendations
- 15+ supported technology stacks

**Key Insight**: Design knowledge is structured as domain-specific CSV data + reasoning rules, not hardcoded logic. This allows rapid iteration and human-readable rule expansion.

---

### 2. Design System Generator Engine (Flagship v2.0)

**How It Works:**

User inputs natural language prompt (e.g., "Build a landing page for my SaaS product" or "Beauty spa booking app").

The system performs **5 parallel multi-domain searches**:
1. **Product Type Matching** — Maps user context to 161 categories (SaaS, fintech, healthcare, e-commerce, etc.)
2. **Style Recommendation** — Selects from 67 UI styles using BM25 ranking
3. **Color Palette Selection** — Chooses from 161 palettes aligned to product type
4. **Landing Page Pattern** — Extracts from 24 landing page design patterns
5. **Typography Pairing** — Recommends from 57 Google Fonts combinations

**Reasoning Engine applies decision rules**:
- Matches product type to UI category rules in `ui-reasoning.csv`
- Filters anti-patterns for industry/category
- Applies style priorities using BM25 scoring
- Processes JSON-encoded decision rules (`if_ux_focused: "prioritize-minimalism"`)
- Outputs: complete design system (colors, typography, spacing, component specs, anti-patterns)

**Output Format**: Markdown design system document with YAML frontmatter, master rules + page-specific overrides.

**Key Insight**: The reasoning engine treats design as constraint satisfaction — apply multiple scoring signals (product fit, style consistency, accessibility compliance) and select the best combination. This is **generative, not retrieval-only**.

---

### 3. Design Token System & Architecture

**Semantic Token Strategy:**

The system uses **semantic tokens** (not hex values):
```
Primary, Secondary, Error, Surface, On-Surface
```

This abstraction allows:
- Single-source definition for light/dark variants
- Easy theme switching without component rewrites
- Platform-native token mapping (iOS native colors → Material Design → Tailwind classes)

**Color System Rules:**

| Requirement | Implementation |
|---|---|
| Contrast ratio minimum | 4.5:1 (normal text), 3:1 (large UI) — WCAG AA |
| Dark mode strategy | Desaturated/lighter tonal variants, NOT inverted colors |
| Functional colors | Always pair with icon/text (color-only meaning avoided) |
| Palette alignment | 161 palettes mapped to 161 product types |
| Accessibility check | BM25 ranking filters failing pairs during selection |

**Typography Token Scale:**
- Base size: 16px (prevents iOS auto-zoom)
- Line height: 1.5–1.75 (readability on mobile)
- Line length: 35–60 chars (mobile), 60–75 chars (desktop)
- Type scale: 12, 14, 16, 18, 24, 32 (modular)
- Default letter-spacing respected per platform (iOS vs. Material)

**Spacing System:**
- 4pt/8dp incremental scale (Material Design standard)
- Tabular/monospaced figures for data columns/prices (prevents layout shift)
- Touch targets: 44×44pt minimum (Apple HIG)
- Interaction feedback: visual response within 100ms

**Shadow & Elevation:**
- Consistent elevation scale (1dp–24dp, Material Design)
- Each elevation level tied to functional role (cards, app bars, modals)
- Avoids random shadow values
- Semantic naming (e.g., "card-shadow", "modal-elevation")

**Key Insight**: Tokens are data-driven and platform-adaptive. A single "primary color" token can map to different values across iOS (native color), Android (Material palette), Web (Tailwind class), each respecting platform conventions.

---

### 4. Accessibility Implementation (WCAG 2.1 AA)

**Priority-Based Rule Categories (1–10):**

1. **Accessibility (CRITICAL)** — Contrast ratios, focus states, alt text, keyboard nav
2. **Touch & Interaction (CRITICAL)** — 44×44pt minimum, 8px spacing, loading feedback
3. **Performance (HIGH)** — Image optimization, lazy loading, CLS < 0.1
4. **Style Selection (HIGH)** — Consistency, SVG icons over emoji
5. **Layout & Responsive (HIGH)** — Mobile-first, systematic breakpoints, no horizontal scroll
6. **Typography & Color (MEDIUM)** — Semantic tokens, line-height, accessible pairs
7. **Animation (MEDIUM)** — 150–300ms duration, transform-only, `prefers-reduced-motion` support
8. **Forms & Feedback (MEDIUM)** — Visible labels, error placement, progressive disclosure
9. **Navigation Patterns (HIGH)** — Predictable back behavior, ≤5 bottom nav items, deep linking
10. **Charts & Data (LOW)** — Legends, tooltips, accessible colors, pattern textures

**Specific A11Y Patterns:**

- **Contrast Verification**: Flags failing pairs during palette selection; recommends alternatives
- **Focus Management**: 2–4px visible focus rings on all interactive elements
- **Dynamic Type Support**: iOS respects system text scaling; Android respects text size settings
- **Reduced Motion**: Respects `prefers-reduced-motion` media query (animations disabled if set)
- **Screen Reader Support**: Semantic HTML, `aria-label` guidance, logical reading order, `aria-live` regions
- **Forms**: Visible labels (never placeholder-only), errors below fields with recovery paths, inline validation on blur

**Key Insight**: Accessibility is not an afterthought. It's embedded into the reasoning rules themselves — accessibility violations automatically disqualify design recommendations during the selection phase.

---

### 5. Platform-Specific Patterns & Theming

**Supported Tech Stacks (15+):**
- **Web**: HTML + Tailwind, React, Next.js, shadcn/ui, Vue, Svelte, Astro
- **Mobile**: SwiftUI, Jetpack Compose, React Native, Flutter
- **Backend**: Laravel (Blade, Livewire, Inertia.js)

**Platform Idiom Respect:**

| Dimension | iOS HIG | Material Design | Implementation |
|---|---|---|---|
| Navigation | Tab bar (bottom), sidebar | Top app bar, bottom nav | Never mix at same level |
| Components | Native controls | Material-styled | Use platform primitives |
| Spacing | 8pt grid | 8dp grid | 4pt/8dp scale |
| Touch target | 44×44pt | 48×48dp | Minimum across all |
| Animation | Subtle, spatial | Material motion | Duration 150–300ms |
| Text scaling | Dynamic Type | Text size settings | Respect system settings |

**Dark Mode Strategy:**

The skill emphasizes: "Dark mode uses desaturated/lighter tonal variants, not inverted colors; test contrast separately."

This means:
- Light mode: Primary color used as-is
- Dark mode: Desaturated version (reduce saturation 20–40%), lighten value (increase brightness 10–20%)
- Both modes must meet 4.5:1 contrast independently
- Test dark-only palettes to catch failures early

**Key Insight**: Theming is not a CSS filter. It requires intentional color design per mode, respecting platform conventions (iOS uses semantic colors; Material uses tonal palettes).

---

### 6. Component Generation Patterns

**Master + Overrides Model:**

```
design-system/
├── MASTER.md (global source of truth)
└── pages/
    └── [page-name].md (page-specific deviations)
```

This structure enables:
- Context-aware retrieval (page rules override master when present)
- Consistency enforcement (master rules apply unless explicitly overridden)
- Change tracking (diffs show page-specific customizations)

**Component Guidance:**

- **Primary actions per screen**: Singular, visually prominent (never multiple equal-weight primary buttons)
- **Secondary actions**: Subordinate styling, lower visual priority
- **State management**: Visible feedback for all interactive elements (hover, focus, active, disabled)
- **Progressive disclosure**: Hide advanced options; show on demand
- **Error handling**: Inline validation on blur, visible error messages, recovery paths

**Key Insight**: Components are specified in prose + example tokens, not in code. The skill generates recommendations for token usage, not pre-built component libraries. This allows platform-native implementations (SwiftUI components use SwiftUI idioms; React components use React patterns).

---

### 7. Animation & Interaction Principles

**Duration Guidelines:**
- Micro-interactions: 150–300ms
- Complex transitions: ≤400ms
- Exit animations: 60–70% of entry duration (responsive feel)

**Performance Rules:**
- Only animate `transform` and `opacity` (GPU-accelerated)
- Avoid animating width, height, position (causes reflow/repaint)
- Provide visual feedback within 100ms of tap/click (Apple HIG, Material responsiveness)

**Semantic Animation:**
- Every animation must express cause-effect (not decoration)
- Maintain spatial context via shared element transitions
- Support `prefers-reduced-motion` (disable animations if set)

**Key Insight**: Animation is treated as a language. The system has specific rules for micro-interactions (hover effects), transitions (navigation), and data changes (real-time updates), each with duration/easing guidance.

---

### 8. Form & Feedback Patterns

- **Visible labels** (never placeholder-only; placeholder is hint, not label)
- **Error placement** below field, not inline (improves scanning)
- **Helper text** for complex inputs (explain constraints upfront)
- **Inline validation** on blur (not keystroke; reduces noise)
- **Progressive disclosure** of advanced options
- **Auto-save** for long forms (reduce anxiety)
- **Confirmation dialogs** for destructive actions (prevent accidents)

**Key Insight**: Forms are treated as a critical interaction surface. The system has specific rules for each pattern, derived from UX research and accessibility best practices.

---

### 9. Reasoning Rule Database Structure

**CSV Schema** (10 columns):

| Column | Purpose |
|---|---|
| UI_Category | Product/service type (e.g., "SaaS General", "E-commerce Luxury") |
| Recommended_Pattern | High-level design approach (e.g., "Hero + Features + CTA") |
| Style_Priority | Visual methodology (e.g., "Glassmorphism + Flat") |
| Color_Mood | Palette guidance (e.g., "Trust blue + Accent") |
| Typography_Mood | Font character (e.g., "Modern, Friendly") |
| Key_Effects | Animation/interaction specs (e.g., "Subtle hover (200-250ms)") |
| Decision_Rules | JSON-encoded conditional logic |
| Anti_Patterns | Design mistakes to avoid for category |
| Severity | Impact level (HIGH/MEDIUM) |

**Product Coverage (161 Categories):**
- Tech & SaaS: SaaS General, Micro SaaS, Developer Tools, AI/Chatbot
- Finance: Fintech, Banking, Insurance, Personal Finance
- Healthcare: Medical Clinics, Pharmacy, Dental, Mental Health
- E-commerce: General, Luxury, B2B, Marketplace
- Services: B2B Services, Consulting, Agency
- Creative: Agencies, Portfolios, Galleries
- Emerging: Web3, AI Agents, Biohacking, Spatial Computing

**Key Insight**: The reasoning rules encode domain-specific design knowledge. Each product type has an optimal style + color + typography combination derived from industry analysis. This prevents generic design and ensures category-appropriate aesthetics.

---

### 10. Integration & Deployment

**Installation Methods:**
1. **Claude Marketplace** — One-click install for Claude Code
2. **NPM CLI** — `npm install -g uipro-cli` for global access
3. **Symlink Templates** — Local dev uses symlinks; CLI syncs before publish

**Supported AI Assistants:**
- Claude Code, Cursor, Windsurf, GitHub Copilot, Kiro, Droid, Alibaba, Alibaba DingTalk

**Activation:**
- Automatic for UI/UX requests in supported assistants
- Slash commands available in some platforms
- Python 3.x only prerequisite

**Key Insight**: The skill is designed for distribution. Multiple installation paths allow adoption across different AI assistant ecosystems without vendor lock-in.

---

## Technology Comparison: Design System Approaches

| Aspect | UI/UX Pro Max | Vien (Our Current) | ePost Design System |
|---|---|---|---|
| **Token Source** | CSV databases + reasoning engine | Hardcoded token files | [Defines goal] |
| **Color Strategy** | Semantic tokens + platform mapping | Design system variables | [Should use semantic] |
| **Dark Mode** | Separate tonal variants (tested) | Theme toggle | [Should test separately] |
| **Platform Support** | 15+ stacks (web, iOS, Android, etc.) | Web-focused | [Should extend to mobile] |
| **Component Spec** | Prose rules + token guidance | Figma components | [Should merge both] |
| **Accessibility** | Embedded in reasoning rules | WCAG audit separate | [Should integrate early] |
| **Animation Rules** | Semantic (duration, easing) | CSS-based | [Should formalize] |
| **Scale** | 161 product types → design rules | Single design system | [Should support variants] |
| **Reasoning** | Multi-signal (product fit, style, a11y) | Manual curation | [Should automate selection] |

---

## Best Practices Extracted

### Token Design
- Use semantic tokens (primary, secondary, error, surface), not hex values
- Map tokens to platform primitives (iOS native colors, Material palette, Tailwind)
- Test light/dark variants independently — don't assume inversion works
- Include shadow/elevation scale mapped to functional roles
- Use 4pt/8dp incremental spacing (Material standard)

### Component Specification
- Master + overrides model for consistency + customization
- Specify rules in prose + token examples (platform-native implementation)
- Primary actions singular and prominent per screen
- Visible labels, errors below fields, progressive disclosure
- Deep linking support for all key screens

### Accessibility Integration
- Make it a constraint in design selection (not an afterthought audit)
- Verify contrast ratios during palette selection
- Embed focus states, reduced-motion, screen reader support into component specs
- Test accessibility across platform idioms (iOS HIG vs. Material)

### Animation Principles
- Duration 150–300ms for micro-interactions
- Only animate `transform` and `opacity` (GPU-accelerated)
- Respect `prefers-reduced-motion` media query
- Provide visual feedback within 100ms

### Platform Adaptation
- Respect platform idioms (iOS Tab bar vs. Material Top app bar)
- Never mix navigation patterns at same hierarchy level
- Use platform primitives (native controls > styled alternatives)
- Text scaling must respect system settings (Dynamic Type, text size)

### Color & Typography
- Base font size 16px minimum (prevents iOS auto-zoom)
- Line height 1.5–1.75 (readability)
- Tabular figures for data columns (prevents layout shift)
- Dark mode: desaturated tonal variants, not inverted colors
- Touch targets 44×44pt minimum (Apple HIG)

---

## Architecture Recommendations for ePost Design System

### 1. Adopt Semantic Token Architecture
Replace hardcoded hex values with semantic tokens (primary, secondary, error, surface, on-surface). Map each to platform-native implementations:
- **iOS**: Native colors (UIColor.systemBlue, etc.)
- **Android**: Material palette (colors.xml with tonal variants)
- **Web**: Tailwind CSS classes + CSS variables

### 2. Build Product-Type Reasoning Rules
Create a CSV-based reasoning system mapping ePost domain products (Inbox, Monitoring, Composer, Smart Send, Archive, Contacts, Organization, Smart Letter) to optimal design patterns. Include style priority, color mood, typography personality, key effects, anti-patterns.

### 3. Implement Token Validation Layer
Add contrast checking, focus state validation, and accessibility rule application into design system generation. Make A11Y a constraint, not a post-hoc audit.

### 4. Extend to Mobile Platforms
Port design tokens to iOS (SwiftUI) and Android (Jetpack Compose). Use platform-native primitives (not CSS approximations). Test platform idioms (Tab bar navigation, touch targets, text scaling).

### 5. Separate Light/Dark Mode Testing
Don't assume dark mode works by color inversion. Design separate tonal variants and test contrast independently. Provide guidance for theming across platform conventions.

### 6. Formalize Animation Rules
Document animation semantics (duration, easing, GPU-acceleration rules, reduced-motion support). Create a reference table for micro-interactions, transitions, and state changes.

### 7. Master + Overrides Model
Implement a design system structure where global rules (master) can be overridden per product/page. Use context-aware retrieval to merge rules at render time.

### 8. Multi-Stack Support
Design tokens should map to at least 3 tech stacks: React (Tailwind), Next.js (server components), SwiftUI (native colors), Jetpack Compose (Material tokens). Abstract the token layer so platform-specific implementations can diverge without losing consistency.

---

## Code Examples

### Semantic Color Token (TypeScript)
```typescript
interface ColorToken {
  semantic: 'primary' | 'secondary' | 'error' | 'surface' | 'on-surface';
  lightMode: string;  // hex or CSS var
  darkMode: string;   // tonal variant, tested separately
  wcagContrast: 'aa' | 'aaa' | 'fail';
  platforms: {
    ios: string;      // UIColor reference
    android: string;  // Material color
    web: string;      // Tailwind class
  };
}
```

### Animation Guidance (JSON)
```json
{
  "micro-interaction": {
    "duration": "150-300ms",
    "easing": "cubic-bezier(0.2, 0, 0.1, 1)",
    "properties": ["transform", "opacity"],
    "respectsReducedMotion": true,
    "example": "button hover lift"
  },
  "transition": {
    "duration": "300-400ms",
    "easing": "cubic-bezier(0.4, 0.0, 0.2, 1)",
    "example": "page navigation"
  }
}
```

### Master + Overrides (Markdown)
```markdown
# Design System Master

## Colors
- Primary: #0066FF
- Secondary: #FF6600
- Error: #FF0000

---

## Pages

### Inbox Page
- Error: #CC0000 (darker red for high-contrast email alerts)
```

---

## Trade-Offs & Recommendations

**Recommended Approach**: Adopt a hybrid model combining:
1. **CSV-based reasoning rules** (product type → design pattern mapping)
2. **Semantic token architecture** (platform-native implementations)
3. **Embedded accessibility constraints** (not post-hoc audit)
4. **Master + overrides structure** (consistency + customization)
5. **Multi-platform support** (web, iOS, Android with native idioms)

**Rationale**: This approach scales design consistency across platforms while maintaining platform idioms. The reasoning rule layer enables data-driven design generation (instead of manual curation), and embedding accessibility early prevents expensive compliance retrofits.

**Considerations**:
- CSV reasoning rules require domain expertise to author (product type → design pattern mapping)
- Platform-native implementations require 3x effort (iOS + Android + Web) but pay dividends in user experience quality
- Token validation layer adds complexity upfront but prevents downstream bugs
- Dark mode testing must be separate per platform (iOS native colors differ from Material in tonal mapping)

---

## Consensus vs. Experimental

**Stable/Proven**:
- Semantic token architecture (industry standard across design systems)
- WCAG AA contrast requirements (legally defensible, widely adopted)
- Material Design 8dp/4pt spacing grid (proven at scale across Android)
- Apple HIG platform idiom respect (required for App Store approval)
- Master + overrides pattern (reduces rule duplication)
- Animation transform-only optimization (GPU performance, well-documented)

**Experimental/Emerging**:
- AI-driven reasoning engine for design selection (UI/UX Pro Max pioneering this)
- CSV-based rule databases (good for version control + human readability, but scaling pain)
- Semantic color tokens with platform-native mapping (some design systems still use Figma-only approach)
- Embedded accessibility in design generation (most systems audit post-hoc)

---

## Unresolved Questions

1. **Scaling CSV rules**: How do product-specific reasoning rules evolve as ePost domains change? Should rules be versioned per product release?

2. **Platform priority**: Should we prioritize iOS/Android equally with web, or start web-only and port later?

3. **Token governance**: Who owns token updates? Design team only, or engineer + designer collaboration?

4. **Figma sync**: How should Figma design tokens sync with code tokens? One-way (code → Figma) or bidirectional?

5. **Component library strategy**: Should components be generated from tokens + rules, or authored manually then validated against rules?

6. **Dark mode launch**: Should all platforms support dark mode from v1, or stagger iOS/Android/Web?

7. **Animation performance**: How to validate GPU-acceleration across platforms (iOS CABasicAnimation vs. Android ObjectAnimator vs. CSS transform)?

8. **Product variant handling**: Should each ePost domain product (Inbox, Monitoring, etc.) have its own token variant, or share base + override?

---

## Notes

**Confidence**: HIGH. The research drew from official GitHub repo, SKILL.md documentation, and user-facing interfaces. The architecture is well-documented and mature (v2.0 released).

**Gaps**: The research couldn't access specific Python script implementations (BM25 search, reasoning engine code). These details would help understand scaling limits and customization patterns.

**Alignment with ePost Kit**: UI/UX Pro Max uses skill-based architecture (CSV data + Python scripts), which aligns with ePost's agent + skill model. The reasoning engine concept maps well to ePost's design-driven development approach.

**Next Steps**: 
- Create a prototype reasoning rules CSV for ePost domains
- Map existing Vien tokens to semantic architecture
- Test dark mode variants across platforms
- Prototype token validation layer

---

**Verdict**: ACTIONABLE — Adopt hybrid approach combining semantic tokens + reasoning rules + embedded accessibility. This enables data-driven design generation while maintaining platform native idioms and accessibility compliance.

---

**Report Status**: Complete. Ready for design-system package planning.
