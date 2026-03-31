---
phase: 1
title: "Registry + Bundle Manifest"
effort: 5h
depends: []
---

# Phase 1: Registry + Bundle Manifest

Foundation: define bundle schema, extend skill-index, create dependency resolver.

## Tasks

### 1.1 Create `bundles.yaml` in kit repo

**File**: `epost_agent_kit/bundles.yaml` (repo root)

Define 7 role bundles + `full` fallback:

```yaml
version: "1"
roles:
  web-frontend:
    description: "React, Next.js, testing, i18n, auth, a11y"
    skills: [core, web-frontend, web-nextjs, web-i18n, web-auth, web-testing, web-a11y, error-recovery]
    agents: [epost-fullstack-developer, epost-code-reviewer, epost-tester]
    suggested: [design-tokens, web-ui-lib]
  web-backend:
    description: "REST APIs, Jakarta EE, databases"
    skills: [core, web-api-routes, backend-javaee, backend-databases, test, error-recovery]
    agents: [epost-fullstack-developer, epost-debugger]
  web-fullstack:
    extends: [web-frontend, web-backend]
    description: "Full web stack + B2B modules"
    skills: [web-modules, domain-b2b]
    agents: []
  designer:
    description: "Design tokens, Figma, UI library, launchpad"
    skills: [core, design-tokens, figma, ui-lib-dev, launchpad, web-ui-lib, ios-ui-lib, android-ui-lib]
    agents: [epost-muji, epost-fullstack-developer]
  ios-developer:
    description: "Swift 6, SwiftUI, iOS a11y, RAG"
    skills: [core, ios-development, ios-ui-lib, ios-rag, ios-a11y, error-recovery]
    agents: [epost-fullstack-developer, epost-tester, epost-debugger]
  android-developer:
    description: "Kotlin, Jetpack Compose, Android a11y"
    skills: [core, android-development, android-ui-lib, android-a11y, error-recovery, test]
    agents: [epost-fullstack-developer, epost-tester, epost-debugger]
  a11y-specialist:
    description: "Cross-platform WCAG 2.1 AA"
    skills: [core, a11y, ios-a11y, android-a11y, web-a11y, audit]
    agents: [epost-a11y-specialist, epost-code-reviewer]
  kit-author:
    description: "Agent & skill development, kit CLI"
    skills: [core, kit, knowledge-retrieval, knowledge-capture, journal, skill-discovery]
    agents: [epost-project-manager]
```

**Role `extends`**: `web-fullstack` inherits all skills/agents from `web-frontend` + `web-backend`, adds its own. Resolver merges at install time.

### 1.2 Define `.epost.json` schema

**File (CLI repo)**: `src/types/epost-config.ts`

```typescript
interface EpostConfig {
  version: "1";
  installer: string;           // "epost-kit@2.1.0"
  kitVersion: string;          // "2.1.0" — all skills share this version
  role?: string;                // active role bundle name (or null for individual picks)
  skills: string[];             // installed skill names
  agents: string[];             // installed agent names
  updatesMode: "interactive" | "auto" | "manual";
  lastUpdated: string;          // ISO date
}
```

**Note**: No custom bundle definitions in `.epost.json`. Users choose from predefined role bundles or individual skills only. `kitVersion` tracks the kit release all skills are pinned to.

Zod schema for validation. Read/write via `src/domains/config/epost-config.ts` (new file).

### 1.3 Dependency resolver module

**File (CLI repo)**: `src/domains/resolver/index.ts`

Core algorithm:
- Input: list of skill names (from bundle or user selection)
- Read `skill-index.json` to get `connections.extends` and `connections.requires`
- BFS: for each skill, add extends parents + requires deps
- Detect conflicts via `connections.conflicts`
- Topological sort: bases before dependents
- Max depth: 3 hops (prevent circular)
- Output: ordered list of skill names to install

**File (CLI repo)**: `src/domains/resolver/resolver.ts`

```
resolveDependencies(selected: string[], skillIndex: SkillEntry[]): ResolvedResult
  → { skills: string[], order: string[], warnings: string[] }
```

### 1.4 Extend skill-index.json (optional fields)

**File (kit repo)**: `packages/core/scripts/generate-skill-index.cjs`

Add optional fields to generated index entries:
- `size`: number (bytes, computed from SKILL.md + references)

**Versioning**: No per-skill `version` field. All skills share the kit release version stored in `.epost.json` `kitVersion`. Simplifies index generation and avoids per-skill version tracking.

No breaking change — fields are additive.

### 1.5 Profile compatibility aliases

**File (CLI repo)**: `src/domains/resolver/profile-aliases.ts`

```typescript
export const PROFILE_ALIASES: Record<string, string[]> = {
  full: ['web-fullstack', 'designer', 'ios-developer', 'android-developer', 'a11y-specialist', 'kit-author'],
  web: ['web-fullstack'],
  ios: ['ios-developer'],
  android: ['android-developer'],
  backend: ['web-backend'],
  'design-system': ['designer'],
};
```

Maps old `--profile X` to new role names. Shows deprecation warning on use.

## Files Changed

| File | Repo | Action |
|------|------|--------|
| `bundles.yaml` | kit | create |
| `src/types/epost-config.ts` | cli | create |
| `src/domains/config/epost-config.ts` | cli | create |
| `src/domains/resolver/index.ts` | cli | create |
| `src/domains/resolver/resolver.ts` | cli | create |
| `src/domains/resolver/profile-aliases.ts` | cli | create |
| `packages/core/scripts/generate-skill-index.cjs` | kit | modify (add version/size) |

## Validation

- [ ] `bundles.yaml` parses without error (Zod schema)
- [ ] Resolver: `['web-a11y']` → resolves `['a11y', 'web-a11y']` (extends)
- [ ] Resolver: `['design-tokens']` → resolves `['figma', 'design-tokens']` (requires)
- [ ] Resolver: `web-fullstack` extends → merges web-frontend + web-backend skills
- [ ] Profile alias `full` maps to all 6 roles
- [ ] `.epost.json` read/write roundtrips correctly

## Tests

- `tests/domains/resolver/resolver.test.ts` — unit tests for dep resolution, cycle detection, conflict detection
- `tests/domains/config/epost-config.test.ts` — schema validation
