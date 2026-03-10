# Phase 05: Sync Query Expansion References into RAG Skills

## Context Links
- Parent plan: [plan.md](./plan.md)
- Ref: `epost_web_theme_rag/config/query_expansions.yaml`, `epost_ios_rag/config/query_expansions.yaml`

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Add query expansion reference files to web-rag and ios-rag skills so agents know what the server auto-expands
**Implementation Status**: Complete

## Key Insights

### Web RAG Server Query Expansion (`epost_web_theme_rag`)
- **`src/core/query_expansion.py`** (240 lines): Two-phase synonym expansion (multi-word phrases + word-by-word with punctuation strip), component recognition with canonical injection, version tracking
- **`config/query_expansions.yaml`** (883 lines):
  - 170+ `component_mappings`: btn->button, TextField->text-field, modal->dialog, dropdown->select, etc. Organized by: buttons, form inputs, selection, date/time, navigation, data display, feedback, layout, forms, filters, specialized, CamelCase aliases, hooks, contexts
  - 60+ `synonym groups`: component terms, styling, colors, actions, states, sizes, variants, validation, a11y/ARIA, animation, state management, design tokens, business domains (inbox, compose, campaign, community, analytics), responsive, figma, icons, radix-ui, storybook, dark mode, etc.
  - `discovery_phrases`: "what components are available", "what hooks are available", etc.

### iOS RAG Server Query Expansion (`epost_ios_rag`)
- **`src/core/query_expansion.py`** (151 lines): Word-by-word only (NO phrase matching, NO punctuation strip, NO canonical injection)
- **`config/query_expansions.yaml`** (487 lines):
  - 90+ `component_mappings`: UIKit views (uiview, uibutton, etc.), SwiftUI (View, Text, Button), patterns (delegate, datasource), custom components (PrimaryButton, ChipsView, LetterBox), theme (ColorSystem, Typography, Spacing)
  - 30+ `synonym groups`: Swift language, UIKit components, layout/constraints, design tokens, SwiftUI property wrappers, concurrency, architecture (MVVM, Coordinator, DI), protocol-oriented

### What Agents Don't Know
- Agents generate 3-5 synonym variant queries in HyDE when server already expands synonyms
- Scout filter extraction guesses component names instead of using canonical mappings
- knowledge-retrieval "expand keywords" advice doesn't mention server already does this

## Requirements
### Functional
- Add `references/component-mappings.md` to each RAG skill: categorized summary of canonical names
- Add `references/synonym-groups.md` to each RAG skill: categorized summary of auto-expanded groups
- Files note: "server auto-expands -- use canonical names in `component` filter, skip synonym variants in HyDE"
### Non-Functional
- Keep < 100 lines each (summary, not full dump)
- Reference RAG server config as authoritative source

## Related Code Files
### Create (EXCLUSIVE)
- `packages/platform-web/skills/web-rag/references/component-mappings.md` [OWNED]
- `packages/platform-web/skills/web-rag/references/synonym-groups.md` [OWNED]
- `packages/platform-ios/skills/ios-rag/references/component-mappings.md` [OWNED]
- `packages/platform-ios/skills/ios-rag/references/synonym-groups.md` [OWNED]
### Read-Only
- `epost_web_theme_rag/config/query_expansions.yaml`
- `epost_ios_rag/config/query_expansions.yaml`

## Implementation Steps

1. **Web `component-mappings.md`**: Categorized summary:
   - Buttons: btn, button, button-icon, icon-button, split-button, button-group, button-bar
   - Form inputs: input/textfield->text-field, textarea, number-input->input-number, number-stepper
   - Selection: select/dropdown, autocomplete, multiselect->multiple-select
   - Date/time: datepicker/date-picker, date-range, date-filter-button
   - Navigation: tabs, breadcrumbs, action-menu, context-menu, popover, tooltip
   - Data display: table/datatable->data-table, tree, card, badge, chip, avatar, thumbnail
   - Feedback: notification/alert/toast, loader/spinner, progress-bar, progress-ring, skeleton-loading
   - Layout: accordion, dialog/modal/drawer, stack-container, steps/wizard, column
   - Forms: checkbox, radio, toggle/switch, color-picker, file-upload, image-upload
   - Filters: filter-button, filter-bar, select-filter-button, segmented-filter-button
   - Specialized: text-editor/wysiwyg/quill, chat-tool, email-composer, search-field, document-viewer
   - CamelCase aliases: TextField->text-field, DataTable->data-table, DatePicker->date-picker, etc.
   - Note: "Server recognizes these aliases and injects canonical name. Use canonical in `component` filter."

2. **Web `synonym-groups.md`**: Categorized summary:
   - Component (component, widget, element, ui element)
   - Styling (style, css, scss, theme, tailwind, className)
   - Colors (color, palette, token, colour)
   - Design tokens (klara-theme, scss variable, css variable, ThemeProvider, brand)
   - Actions (click/onClick, change/onChange, submit/onSubmit)
   - States (disabled/inactive, enabled/active, loading/fetching/spinner)
   - Sizes (small/sm, medium/md, large/lg)
   - Accessibility (a11y, aria, screen reader, focus trap, keyboard nav, tabIndex, role)
   - Animation (animate, transition, framer-motion, @keyframes, spring, opacity, fadeIn)
   - State management (redux, useSelector, useDispatch, createSlice, zustand)
   - Business domains (inbox, compose, campaign/smartsend, community, analytics, onboarding, organization, permissions)
   - Responsive (breakpoint, media query, mobile, tablet, desktop)
   - Note: "Server auto-expands ALL of these. Do NOT generate synonym variants in HyDE. Focus on structural/angle variants."

3. **iOS `component-mappings.md`**: Same pattern:
   - UIKit views: uiview, uibutton, uilabel, uitextfield, uitableview, uicollectionview, uiscrollview, uistackview, uiimageview + controller variants
   - SwiftUI: View, Text, Button, Image, List, NavigationView, TabView
   - Patterns: delegate/datasource, IBOutlet/IBAction, cell, header, footer
   - Custom (luz_ios_designui): PrimaryButton, SecondaryButton, ChipsView, LetterBox, ArchiveBoxView, CommunityChatHeader
   - Theme (luz_theme_ui): Theme, ColorSystem, Typography, Spacing, Brand, Component
   - Note: "iOS server does word-by-word matching only (no phrase matching yet). Use exact alias for best results."

4. **iOS `synonym-groups.md`**: Same pattern:
   - Swift language (class/struct/protocol/extension/function)
   - UIKit components (button/uibutton/btn, label/uilabel, view/uiview)
   - Layout (constraint, autolayout, anchor, pin)
   - Design tokens (ColorsAssets, ThemeColor, ThemeTextStyle, ThemeButton, ThemeRadius, ThemeShadowStyle)
   - SwiftUI (@State, @Binding, @ObservedObject, @StateObject, @EnvironmentObject, ObservableObject)
   - Concurrency (async/await/Task/actor, Combine/Publisher, DispatchQueue/GCD)
   - Architecture (MVVM/MVC/MVP/VIPER/Coordinator, DI, clean architecture, repository pattern)
   - Protocol-oriented (conformance, associated type, type erasure, existential)
   - Accessibility (VoiceOver, accessibilityLabel/Hint/Traits/Identifier, dynamic type, UIAccessibility)
   - Animation (UIView.animate, CABasicAnimation, springWithDamping, CGAffineTransform)
   - Gesture (UIGestureRecognizer variants, touchesBegan/Ended)

## Todo List
- [x] Create web component-mappings.md
- [x] Create web synonym-groups.md
- [x] Create iOS component-mappings.md
- [x] Create iOS synonym-groups.md

## Success Criteria
- Reference files exist under both RAG skill directories in `packages/`
- Each file < 100 lines, organized by category
- Each file states server auto-expands and gives guidance on filter usage

## Risk Assessment
**Risks**: Expansion configs change in RAG repos, reference files go stale
**Mitigation**: Files say "source of truth: RAG server config/query_expansions.yaml". Check .expansions-version.

## Security Considerations
None.

## Next Steps
After completion: Phase 06 (update smart-query and retrieval skills)
