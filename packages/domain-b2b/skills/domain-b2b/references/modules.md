---
name: domain/b2b/modules
description: "B2B feature module structure and conventions"
---

# B2B Module Patterns

## Purpose

Defines the 8 feature modules in the epost B2B platform and their shared conventions.

## Table of Contents

- [The 8 Modules](#the-8-modules)
- [Module File Structure](#module-file-structure)
- [Shared Conventions](#shared-conventions)
- [Module Communication](#module-communication)
- [Related Documents](#related-documents)

## The 8 Modules

| Module | Description | Key Features |
|--------|-------------|-------------|
| monitoring | Dashboard & analytics | Charts, data export, alerts |
| communities | Organization groups | Member management, settings |
| inbox | Message inbox | List, detail, search, filters |
| smart-send | Bulk messaging | Templates, audience targeting, scheduling |
| composer | Message creation | Rich editor, attachments, preview |
| archive | Message archive | Search, retention, compliance |
| contacts | Contact management | Import, groups, validation |
| organization | Org settings | Users, roles, permissions, branding |

## Module File Structure

Each module follows this layout inside the Next.js app:

```
app/(module-name)/
  page.tsx              # Main route
  layout.tsx            # Module layout with sidebar/nav
  components/           # Module-specific components
    ModuleHeader.tsx
    ModuleList.tsx
    ModuleDetail.tsx
  hooks/                # Custom hooks
    useModuleData.ts
  lib/                  # Business logic
    api.ts              # API client functions
    types.ts            # Module types
    utils.ts            # Module utilities
```

## Shared Conventions

- **State**: Redux Toolkit slices per module
- **API**: REST endpoints at `/api/v1/<module>/`
- **Auth**: Token-based via middleware
- **i18n**: Norwegian (nb) primary, English fallback
- **Testing**: Jest + RTL for unit, Playwright for E2E
- **UI**: klara-theme components (refer to knowledge/klara-theme)

## Module Communication

Modules communicate via:

1. Shared Redux store (for user/org context)
2. URL params (for navigation between modules)
3. Event bus (for cross-module notifications)

## Related Documents

- `SKILL.md` — Parent skill index
- `../../../CLAUDE.snippet.md` — Integration snippet
