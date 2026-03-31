---
phase: 1
title: "Create kb-categories.json registry"
effort: 15m
depends: []
---

# Phase 1: Create kb-categories.json Registry

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/docs/references/` — target directory

## Overview
- Priority: P1
- Status: Pending
- Effort: 15m
- Description: Create a JSON registry of all 10 KB categories with signals for activation

## Requirements

### Functional
- Registry contains all 7 existing categories + 3 new (API, INFRA, INTEG)
- Each entry has: `prefix`, `directory`, `core` (boolean), `signals` (string array)
- `core: true` categories: ADR, ARCH, CONV (always selected)
- `core: false` categories: FEAT, PATTERN, FINDING, GUIDE, API, INFRA, INTEG (signal-gated)

### Non-Functional
- Valid JSON, under 50 lines
- Co-located with init.md at `packages/core/skills/docs/references/kb-categories.json`

## Files to Create
- `packages/core/skills/docs/references/kb-categories.json` — the registry

## Implementation Steps

1. **Create the registry file** with this structure:
   ```json
   {
     "categories": [
       { "prefix": "ADR",     "directory": "decisions",      "core": true,  "signals": [] },
       { "prefix": "ARCH",    "directory": "architecture",   "core": true,  "signals": [] },
       { "prefix": "CONV",    "directory": "conventions",    "core": true,  "signals": ["eslint", "tsconfig", "prettier", "checkstyle"] },
       { "prefix": "FEAT",    "directory": "features",       "core": false, "signals": ["route files", "feature directories", "module directories"] },
       { "prefix": "PATTERN", "directory": "patterns",       "core": false, "signals": ["recurring code pattern >= 3 occurrences", "hooks", "HOCs", "provider wrappers"] },
       { "prefix": "FINDING", "directory": "findings",       "core": false, "signals": ["existing findings/*.md files only"] },
       { "prefix": "GUIDE",   "directory": "guides",         "core": false, "signals": ["Dockerfile", ".env.example", "Makefile", "README setup section"] },
       { "prefix": "API",     "directory": "api",            "core": false, "signals": ["REST route files", "GraphQL schema", "OpenAPI/swagger spec", "JAX-RS @Path annotations"] },
       { "prefix": "INFRA",   "directory": "infra",          "core": false, "signals": ["docker-compose.yml", "CI config (GitHub Actions/.gitlab-ci)", "Terraform", "Kubernetes manifests"] },
       { "prefix": "INTEG",   "directory": "integrations",   "core": false, "signals": ["third-party SDK imports", "external API client classes", "Keycloak/S3/SMTP config", "service base URLs in config"] }
     ]
   }
   ```

## Todo List
- [ ] Create `packages/core/skills/docs/references/kb-categories.json`
- [ ] Validate JSON syntax

## Success Criteria
- File parses as valid JSON
- Contains exactly 10 category entries
- 3 entries have `core: true`, 7 have `core: false`

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| None — additive file creation | Low | N/A |

## Security Considerations
- None identified

## Next Steps
- Phase 2 will reference this registry from init.md
