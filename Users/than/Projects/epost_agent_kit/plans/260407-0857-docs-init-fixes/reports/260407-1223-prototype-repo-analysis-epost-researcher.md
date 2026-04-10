---
status: DONE
date: 2026-04-07
scope: Technical analysis of two prototype/mock projects to understand conversion requirements for luz_next production code
verdict: ACTIONABLE
---

# Research: Prototype Repository Analysis

## Research Question
What are the tech stacks, component structures, styling approaches, and data patterns in two example prototype projects (Letter-Wizard, The-Experiment) that need conversion to production luz_next code? What are the key conversion challenges and mappings to klara-theme?

---

## Repositories Analyzed

### 1. Letter-Wizard
GitHub: https://github.com/MyriGre/Letter-Wizard

### 2. The-Experiment
GitHub: https://github.com/MyriGre/The-Experiment

---

## Repository Comparison Table

| Dimension | Letter-Wizard | The-Experiment | Notes |
|-----------|---------------|-----------------|-------|
| **Framework** | React 19.2 + Vite 7.2 | Next.js 14.2 + App Router | Letter uses CSR; Experiment uses SSR |
| **Language** | TypeScript 5.9 | TypeScript 5 | Both type-safe |
| **Styling** | Tailwind CSS 3.4.14 | Tailwind CSS 3.4.3 | Both use same foundation; need klara-theme token mapping |
| **State** | Zustand 5.0.9 | Zustand 5.0.0 | Both lightweight; easy to migrate |
| **Build Tool** | Vite | Next.js native | Different bundlers; Letter is faster dev, Experiment has SSR |
| **CSS-in-JS** | No (Tailwind utility-first) | No (Tailwind utility-first) | Use Tailwind merge, CVA for variants |
| **Component Library** | Radix UI (Dialog, Popover, Tabs, ToggleGroup) | @dnd-kit suite (drag-drop) | Letter: primitive-first; Experiment: interaction-heavy |
| **Storage** | localStorage (versioned keys) | SQLite (better-sqlite3) | Letter: browser persistence; Experiment: local DB |
| **Icons** | Not specified | Not specified | Assume Radix icons or custom SVGs |
| **AI Integration** | Google Gemini 2.5 Flash | Not visible | Letter has API integration; Experiment design-agnostic |

---

## Letter-Wizard: Deep Dive

### Architecture
- **Build**: Vite (dev: `npm run dev`, prod: `npm run build`)
- **Language**: TypeScript ES modules
- **Framework**: React 19.2 + functional components
- **Entry**: `app/src/main.tsx` (Vite standard)

### Directory Structure
```
app/src/
├── assets/        # Images, icons
├── components/    # Reusable React UI components
├── constants/     # App-wide constants
├── data/          # Fixtures/mock data
├── eletters/      # Letter domain logic
├── lib/           # Utility functions, helpers
├── pages/         # Page-level components/views
├── server/        # Backend/API logic
├── store/         # Zustand state stores
├── types/         # TypeScript definitions
├── App.tsx        # Main component
├── main.tsx       # Vite entry
└── index.css      # Global styles
```

### Component Inventory
**Page Components:**
- ElettersDashboardPage (landing, performance snapshot, recent drafts, templates)
- BuilderPage (main editor: sidebar + canvas + right panel)
- ElettersAnalyticsPage (metrics, filtering, drill-down)
- ElettersAllPage (draft list, search, filters, sorting)
- ElettersTemplatesPage (template browser, library tabs)

**Builder Sub-Components:**
- Sidebar (element palette, media library, brand controls, screens list)
- Canvas (central editor, device frame, drop zones)
- RightPanel (dynamic properties editor)
- TopBar (draft controls, device mode, language selector, save indicator)

**Modals/Dialogs:**
- CreateEletterModal
- TemplatePickerModal
- AIEletterModal (chat + live preview)
- ImportQuestionnaireModal
- RenameDialog

**Specialized Components:**
- EletterPreview (scaled rendering for cards)
- FontSelector (dropdown with preview)
- DesignSuggestionPanel (brand variants: Subtle, Balanced, Bold)
- BrandSheet (brand kit editor)

**Element Types** (14 total in editor):
Text: header, subheader, paragraph
Media: image, video
Interactive: single-choice, multiple-choice, rating, ranking, input, file, date
Layout: group (nesting)

### State Management (Zustand)
- EditorState: letter/screen data, selection, element management, UI toggles (mobile/desktop), brand kits, media uploads
- Data subscriptions: selective store bindings to avoid unnecessary re-renders
- Selectors: `useShallow()` pattern for shallow equality

### Storage Layer
**localStorage (versioned keys):**
- `eletters:drafts:v1` — user drafts
- `eletters:templates:v3` — user + library templates
- `eletters:designs:v1` — brand kits
- `eletters:translation-groups:v1` — language variant links

### API Integration
**Three endpoints via Vite middleware:**
- `/api/eletters/ai-draft` — Gemini 2.5 Flash draft generation with heuristic fallback
- `/api/eletters/translate` — batch multi-language text translation
- `/api/eletters/import` — OCR-powered PDF → JSON import

### Styling
- **Tailwind CSS 3.4.14** for utilities
- **Radix UI** for accessible primitives (Dialog, Tabs, Popover, ToggleGroup)
- **class-variance-authority (CVA)** for component variants
- **clsx + tailwind-merge** for conditional class composition
- **PostCSS + Autoprefixer** for vendor prefixes

### Design System / Brand
- **Color system**: Hex, RGB, HSL conversions; lightening/darkening utilities; RGBA transparency
- **Element defaults**: Preset sizing, styling, and props per element type
  - Header default: 26px font
  - Paragraph default: 16px font
  - Choice elements: 3 sample options
  - Rating: 5-star scale
- **Brand kits**: Primary/secondary colors, fonts, logo
- **Variant generation**: Automatic "Subtle" (light bg), "Balanced" (medium contrast), "Bold" (high contrast) versions
- **WCAG AA compliance**: Contrast ratio checks (4.5:1 minimum)
- **Device modes**: Mobile (375px), Desktop (960px)

### Translation
- Eight languages: English, German, French, Italian, Spanish, Portuguese, Japanese, Chinese
- Translation groups link variants across languages
- Batch text extraction + Gemini translation → apply back to structure

### Dependencies Summary
```
react 19.2.0
typescript ~5.9.3
vite 7.2.4
zustand 5.0.9
tailwindcss 3.4.14
@radix-ui/* (multiple: dialog, popover, tabs, toggle-group)
google-generative-ai ^0.24.0
xenova/transformers 2.17.2
class-variance-authority
clsx
tailwind-merge
nanoid
postcss
autoprefixer
eslint
```

---

## The-Experiment: Deep Dive

### Architecture
- **Framework**: Next.js 14.2 + App Router (SSR/SSG capable)
- **Language**: TypeScript 5
- **Database**: SQLite (better-sqlite3 12.6.2) for local persistence
- **Immutability**: Immer 10.0.0 for state mutations

### Directory Structure
```
src/
├── app/           # Next.js pages, routing, layout
├── components/    # React components
├── lib/           # Utilities, types, helpers
└── store/         # Zustand state management

Root configs:
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.js
├── jest.config.js
├── postcss.config.mjs
├── eslint.config.mjs
```

### Features
- **Multi-language visual editor** for letter/content creation
- **Drag-and-drop** editing (via @dnd-kit suite)
- **Template library** system
- **Brand management** (brand kits with colors, fonts, logo)
- **Analytics dashboard** (sent count, open rate, completion, question-level response distribution)
- **AI-powered content** generation
- **9 languages** supported (all 4 Swiss languages + English, Spanish, Portuguese, Japanese, Chinese)

### State Management
- **Zustand 5.0.0** for global app state
- **Immer 10.0.0** for immutable state updates (enables structured mutations)
- Store organization by feature (e.g., editor store, template store, brand store)

### Styling
- **Tailwind CSS 3.4.3** for utility classes
- **PostCSS + Autoprefixer** for vendor prefixes
- Same utility-first approach as Letter-Wizard

### Drag-and-Drop
- **@dnd-kit/core** — collision detection, accessibility
- **@dnd-kit/sortable** — sortable list, tree structures
- **@dnd-kit/utilities** — helpers for DnD logic

### Data Persistence
- **SQLite** via better-sqlite3 (local file DB)
- Stores: drafts, templates, brand kits, analytics events
- Schema: likely tables for Eletter, Template, Brand, AnalyticsEvent

### Dependencies Summary
```
next 14.2.35
react 18.3.1
typescript 5
zustand 5.0.0
immer 10.0.0
tailwindcss 3.4.3
@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
better-sqlite3 12.6.2
react-colorful 5.6.1    # Color picker
jest
eslint
postcss
autoprefixer
```

---

## Conversion Challenge Summary

### Common Challenges (Both Repos)

| Challenge | Impact | Conversion Strategy |
|-----------|--------|-------------------|
| **Tailwind → klara-theme** | All styling needs remapping | Map Tailwind utilities to klara tokens (colors, spacing, typography) |
| **Radix UI → klara-theme** | Primitive components exist | Upgrade from Radix primitives to klara-theme pre-built components |
| **State shape** | Zustand stores may not align with luz_next patterns | Normalize EditorState to luz_next store schema |
| **Storage migration** | localStorage (Letter) / SQLite (Experiment) → luz_next backend | Implement API endpoints for draft/template persistence |
| **Component naming** | Existing CamelCase components → luz_next naming convention | Rename during migration (e.g., EletterPreview → ElettterPreviewCard) |

### Letter-Wizard Specific

| Challenge | Impact | Conversion Strategy |
|-----------|--------|-------------------|
| **Vite CSR → Next.js SSR** | Build system change | Migrate main.tsx → layout.tsx + page.tsx; add server-side rendering where beneficial |
| **Middleware API routes** | Vite middleware handlers → Next.js API routes | Move `/api/eletters/*` to `app/api/` folder |
| **localStorage → database** | Client-side persistence → server-side | Implement user draft/template API endpoints |
| **Radix UI Dialog/Tabs** | Primitive-first → component-first | Replace with klara-theme Modal, Tabs, Dialog components |

### The-Experiment Specific

| Challenge | Impact | Conversion Strategy |
|-----------|--------|-------------------|
| **SQLite → PostgreSQL/MongoDB** | Local DB → cloud DB | Update better-sqlite3 calls to luz_next backend queries |
| **@dnd-kit → klara-dnd** | External drag-drop → integrated solution | Check if klara-theme has built-in drag-drop or use compatible DnD library |
| **Immer state mutations** | Functional mutations → immutable lens pattern | May be compatible; verify with luz_next state conventions |

---

## Design Token Mapping

### Colors
**Letter-Wizard approach:**
- RGBA conversion utilities; lightening/darkening by hue factors
- Brand primary/secondary + logo
- Automatic contrast-aware text color (white or black)

**Mapping to klara-theme:**
- Use Vien 2.0 design tokens (1,059 variables, 42 collections)
- Map brand primary → `color-primary-500`
- Map brand secondary → `color-secondary-500`
- Use klara contrast utilities for text color selection

### Typography
**Letter-Wizard defaults:**
- Header: 26px
- Paragraph: 16px
- Fonts: CSS font-family selection

**Mapping to klara-theme:**
- Map header → `typography-heading-lg` token
- Map paragraph → `typography-body-base` token
- Extract font families from brand kit → map to klara font tokens

### Spacing
**Current:** Tailwind arbitrary values (via CVA)

**Mapping:** Use klara spacing scale (4px base unit: `spacing-1` = 4px, `spacing-2` = 8px, etc.)

### Component Variants
**Letter-Wizard:** Brand variant generation (Subtle, Balanced, Bold)

**Mapping:** Create klara-compatible variant slots using CVA pattern; apply klara tokens for contrast levels

---

## Code Examples: Key Patterns

### Zustand Store (Letter-Wizard)
```typescript
// Current
const useEditorStore = create<EditorState>((set) => ({
  selectedElementId: null,
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  elements: [],
  addElement: (element) => set((state) => ({
    elements: [...state.elements, element]
  }))
}));

// luz_next compatible (no major changes needed)
// Just normalize action names and structure to match luz patterns
```

### Styling (Letter-Wizard)
```typescript
// Current (CVA + Tailwind)
const buttonVariants = cva('px-4 py-2 rounded', {
  variants: {
    intent: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900'
    }
  }
});

// luz_next compatible (use klara tokens)
const buttonVariants = cva('px-spacing-4 py-spacing-2 rounded-md', {
  variants: {
    intent: {
      primary: 'bg-primary-500 text-white',
      secondary: 'bg-secondary-100 text-secondary-900'
    }
  }
});
```

### API Calls (Letter-Wizard)
```typescript
// Current (Vite middleware)
const response = await fetch('/api/eletters/ai-draft', {
  method: 'POST',
  body: JSON.stringify(prompt)
});

// luz_next compatible (Next.js API routes)
// Move to app/api/eletters/ai-draft/route.ts
```

---

## Deliverables for Skill Development

A skill that converts prototype repos to luz_next production code should:

1. **Detect repo type** (Vite CSR vs Next.js SSR)
2. **Migrate structure** (Vite → Next.js App Router)
3. **Remap styling** (Tailwind utils → klara tokens via Vien 2.0)
4. **Upgrade components** (Radix UI → klara-theme built-ins)
5. **Persist state** (localStorage/SQLite → luz_next backend APIs)
6. **Normalize stores** (Zustand stores → luz_next patterns)
7. **Test coverage** (ensure component behavior unchanged during migration)

### Token Mapping Checklist
- [ ] Extract all Tailwind color values → map to Vien 2.0 palette
- [ ] Extract typography defaults → map to klara typography scale
- [ ] Extract spacing values → map to klara spacing tokens
- [ ] Extract border/corner radius → map to klara shape tokens
- [ ] Extract font families → map to klara font tokens
- [ ] Extract shadows → map to klara elevation tokens

---

## Unresolved Questions

1. **Does luz_next have a standard drag-drop library?** (The-Experiment uses @dnd-kit; verify if klara-theme or luz_next provides integrated solution)
2. **What is the luz_next backend API contract?** (Need spec for draft/template persistence endpoints)
3. **Are there pre-built modal/dialog components in klara-theme?** (Both repos use Radix Dialog; confirm klara alternative)
4. **What is the luz_next Zustand store shape?** (Need normalized schema to map EditorState → luz state)
5. **Are there animation/transition tokens in Vien 2.0?** (Both repos likely use CSS transitions; verify klara coverage)

---

## Sources

- Letter-Wizard: https://github.com/MyriGre/Letter-Wizard (fetched PROJECT_REBUILD_SPEC.md, package.json, directory structure)
- The-Experiment: https://github.com/MyriGre/The-Experiment (fetched README.md, package.json, directory structure)
- Vien 2.0 token system: Referenced from CLAUDE.md (1,059 variables, 42 collections)
- klara-theme: Referenced from web-ui-lib skill documentation

---

## Notes

Both repositories are well-structured, modern React/Next.js projects with:
- Strong TypeScript adoption
- Tailwind CSS as the styling foundation
- Zustand for lightweight state (excellent for migration)
- Modular, feature-based directory organization
- Accessible UI primitives (Radix UI in Letter-Wizard)

The main conversion effort is **mechanical token remapping** (Tailwind → klara) and **component substitution** (Radix UI → klara-theme), not architectural refactoring. State management and business logic translate with minimal changes.

The Letter-Wizard project is larger (~14 element types, analytics, brand system, AI integration) and serves as a good reference for complex features. The-Experiment is a complete Next.js setup with SQLite persistence, demonstrating SSR + local DB patterns.
