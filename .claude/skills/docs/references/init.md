---
name: docs-init
description: "(ePost) Scan codebase and generate structured KB documentation"
user-invocable: false
disable-model-invocation: true
metadata:
  argument-hint: "[--migrate | scan and generate KB docs]"
  keywords:
    - docs-init
    - documentation
    - generate-docs
    - scaffold-docs
  agent-affinity:
    - epost-docs-manager
  platforms:
    - all
  connections:
    requires: [knowledge]
---

# Docs: Init

Scan codebase and generate structured Knowledge Base documentation following the `knowledge` skill format.

## Usage
```
/docs-init              # Auto-detects existing docs, migrates + gap-fills as needed
/docs-init --migrate    # Force migration mode (same as auto when flat docs detected)
```

## Mode Detection

**Always inspect the filesystem first**, then select mode:

| State | Action |
|-------|--------|
| `docs/index.json` exists with entries | Stop — KB already initialized. Run `/docs-update` instead. |
| Flat docs exist at `docs/*.md` (top-level .md files) | **Smart Init**: migrate flat docs → then gap-fill new docs for uncovered areas |
| KB subdirs exist but empty (no .md files inside) | **Smart Init**: treat as fresh, scan codebase → generate docs |
| No `docs/` directory or empty | **Generation Mode**: scan codebase → generate all docs from scratch |
| `$ARGUMENTS` contains `--migrate` | Same as Smart Init — flag is now optional shorthand |

**Smart Init** is the default for most real-world cases. It combines migration + gap-fill in one pass and never duplicates content.

## Index Update Rule (applies to ALL modes)

After any mode completes:

| Index | When to update | What to update |
|-------|---------------|----------------|
| `docs/index.json` | After generating or migrating any doc file | `entries[]` (all generated/migrated entries), `updatedAt` |
| `reports/index.json` | After writing the task completion report | Append entry per `core/references/index-protocol.md` |

**Never finish without a complete `docs/index.json`.** Every generated or migrated file must have a corresponding entry before you stop.

---

## Smart Init Mode (default when flat docs exist)

Migrate existing flat docs first, then gap-fill with new docs for uncovered areas.

### 1. Read All Existing Flat Docs

Read every `docs/*.md` file at the top level. For each file:
- Extract topics, code references, decision rationale, conventions
- Note what it covers (e.g., auth flow, DB schema, deployment steps)

Use this content as **source material** — don't invent; transform and enrich.

### 2. Migrate to KB Structure

Apply the same mapping as Migration Mode:

| Flat File | Target | Category |
|-----------|--------|----------|
| `codebase-summary.md` | `ARCH-0001-overview.md` | architecture |
| `code-standards.md` | Split into `CONV-NNNN-*.md` | convention |
| `system-architecture.md` | `ARCH-NNNN-system-architecture.md` | architecture |
| `api-routes.md` | `FEAT-NNNN-api-routes.md` | feature |
| `data-models.md` | `ARCH-NNNN-data-models.md` | architecture |
| `deployment-guide.md`, `setup-guide.md` | `GUIDE-NNNN-*.md` | guide |
| Other `.md` | Classify by content | varies |

- Apply KB templates from `knowledge` skill
- Enrich during migration: use codebase scan to fill in missing examples, add `agentHint`, link related entries
- Split files > 800 LOC

### 3. Build Coverage Index

After migrating, build a mental map of what is now covered:
- List all topics, deps, routes, conventions already documented
- This is the **deduplication baseline** — new docs must not re-cover these areas

### 3.5. Select Categories

Read `docs/references/kb-categories.json`. Determine which categories apply to this codebase:

- Always include `core: true` categories (ADR, ARCH, CONV)
- For each `core: false` category, check whether any of its `signals` are present in the codebase
- Include the category if at least one signal is found; skip otherwise

Log the result:
```
Selected: ADR, ARCH, CONV, FEAT, GUIDE
Skipped: PATTERN (no recurring patterns ≥3), FINDING (no existing findings/), API (no REST routes), INFRA (no docker-compose/CI), INTEG (no third-party SDKs)
```

### 4. Scan Codebase for Gaps

Scan code for areas NOT yet covered by migrated docs, referencing **selected categories only**:
- Major deps in package.json/pom.xml without an ADR → generate ADR
- Route groups / feature directories without a FEAT doc → generate FEAT (if FEAT selected)
- Recurring code patterns (≥3 occurrences) not in migrated docs → generate PATTERN (if PATTERN selected)
- Config/lint rules not in migrated docs → generate CONV
- Setup/CI signals not in migrated docs → generate GUIDE (if GUIDE selected)
- REST/GraphQL route files not documented → generate API docs (if API selected)
- Infrastructure files not documented → generate INFRA docs (if INFRA selected)
- Third-party SDK integrations not documented → generate INTEG docs (if INTEG selected)

**Deduplication rule**: Before generating any doc, check if a migrated doc already covers that area. If partial coverage exists, enrich that existing doc instead of creating a new one.

### 5. Extract Dependencies & Business Context

Same as Generation Mode step 4.5 — populate `dependencies` + `business` in index.json.

### 6. Generate index.json

Build `docs/index.json` with all migrated + newly generated entries. Use the same template as Generation Mode step 5.

### 7. Clean Up

- Delete original flat `docs/*.md` files (content is now in KB structure)
- One bulk commit

### 8. Report

```markdown
## Smart Init Complete

### Category Selection
| Category | Status | Signal |
|----------|--------|--------|
| ADR | selected (core) | — |
| ARCH | selected (core) | — |
| CONV | selected (core) | — |
| FEAT | selected | route files detected |
| PATTERN | skipped | no recurring patterns ≥3 |
| FINDING | skipped | no existing findings/ |
| GUIDE | selected | Dockerfile detected |
| API | skipped | no REST routes or @Path annotations |
| INFRA | skipped | no docker-compose/CI config |
| INTEG | skipped | no third-party SDK imports |

### Migrated (from flat docs)
| File | → KB Entry | Category |
|------|-----------|----------|
| docs/codebase-summary.md | ARCH-0001-overview.md | architecture |

### Gap-filled (new from codebase scan)
| Entry | Category | Trigger |
|-------|----------|---------|
| ADR-0002-redux-toolkit.md | decision | package.json dep, no ADR |

### Skipped (already covered by migrated docs)
| Area | Covered by |
|------|-----------|
| Auth flow | FEAT-0001-auth-flow.md (migrated) |

**Total**: N migrated, N gap-filled, N skipped (no duplication)
**Enrichment**: N internal deps, N external deps, business context {present|absent}
**Next**: Run `/docs-update --verify` to validate accuracy
```

---

## Generation Mode

### 1. Scan the Codebase
- Use Glob to explore directory structure
- Use Grep to find key patterns (imports, exports, types, routes)
- Read key files (package.json, pom.xml, tsconfig, configs, Dockerfile, CI configs)
- Identify: framework, language, database, deployment, major deps, modules

### 2. Select Categories

Read `docs/references/kb-categories.json`. Determine which categories apply to this codebase:

- Always include `core: true` categories (ADR, ARCH, CONV)
- For each `core: false` category, check whether any of its `signals` are present in the codebase
- Include the category if at least one signal is found; skip otherwise

Log the result:
```
Selected: ADR, ARCH, CONV, FEAT, GUIDE
Skipped: PATTERN (no recurring patterns ≥3), FINDING (no existing findings/), API (no REST routes), INFRA (no docker-compose/CI), INTEG (no third-party SDKs)
```

### 3. Create KB Directory Structure

Create `docs/` and `docs/index.json`. Then create a subdirectory for each **selected category** only. Do not create directories for skipped categories.

Example (if FEAT and GUIDE selected, others skipped):
```
docs/
├── index.json
├── decisions/
├── architecture/
├── conventions/
├── features/
└── guides/
    └── .gitkeep
```

### 4. Auto-Generate Documents

Check existing KB subdirs first — if any `.md` files already exist, note what they cover and skip those areas (deduplication). Then generate for selected categories only:

| Prefix | Selection | What to Generate |
|--------|-----------|-----------------|
| ADR | always | For each major framework dep (`ADR-NNNN-{dep}.md`) — infer from package.json/pom.xml version, config, usage |
| ARCH | always | `ARCH-0001-overview.md` + subsystem docs for detected subsystems |
| CONV | always | From eslint/prettier/tsconfig/checkstyle configs — `CONV-NNNN-{convention}.md` with Correct/Incorrect examples |
| FEAT | if signals | From route groups, feature directories, module directories — `FEAT-NNNN-{feature}.md` |
| PATTERN | if signals | Recurring code patterns (≥3 occurrences): hooks, HOCs, provider wrappers — `PATTERN-NNNN-{pattern}.md` with actual code examples |
| FINDING | if signals | `findings/.gitkeep` only — populated during debugging, not init |
| GUIDE | if signals | From Dockerfile, CI configs, Makefile, .env.example, README setup — `GUIDE-NNNN-{topic}.md` (commands + environment focus); create `guides/.gitkeep` if selected but no docs needed yet |
| API | if signals | REST/GraphQL endpoint docs from route files, @Path annotations, OpenAPI specs — `API-NNNN-{topic}.md` |
| INFRA | if signals | Dockerfile/CI pipeline/Terraform/K8s docs — `INFRA-NNNN-{topic}.md` |
| INTEG | if signals | External service integration docs (Keycloak, S3, SMTP, third-party SDKs) — `INTEG-NNNN-{service}.md` |

**Evidence-based rule**: Only generate a doc if you found code evidence for it. Skip any row where no evidence exists.
**Deduplication rule**: Before generating any doc, check if an existing KB doc already covers that area. If partial coverage exists, enrich the existing doc instead of creating a new one.

### 4.5. Extract Dependencies & Business Context

Populate index.json enrichment fields by scanning code artifacts. Schema: `knowledge/references/knowledge-base.md`.

#### Dependencies (internal) — other `luz_*` repositories ONLY

Scan for cross-repo dependencies within the luz ecosystem:
- `pom.xml` → `<dependency>` with `luz_*` groupId or artifactId
- `package.json` → `@luz/*` or `luz_*` package names
- REST client base URLs → service-to-service calls pointing to other luz services

Record each as: `{ "repo": "luz_*_slug", "type": "api|library|shared-db", "evidence": "..." }`

> `.repo` MUST be a luz repository slug (e.g. `luz_mail_service`). Never an npm package or maven artifact.

#### Dependencies (external) — npm/maven packages + third-party services

Scan for ALL non-luz dependencies:
- `package.json` → all deps that are NOT `@luz/*` → type: `npm-package`
- `pom.xml` → all deps without `luz_*` groupId → type: `maven-artifact`
- Config files → Keycloak, S3, SMTP, OneAPI endpoints → type: `service`
- SDK imports → third-party client libraries → type: `sdk`

Record each as: `{ "name": "...", "type": "npm-package|maven-artifact|service|sdk", "evidence": "..." }`

**Quick check — internal vs external:**

| Field | Correct | Incorrect |
|-------|---------|-----------|
| `internal[].repo` | `"luz_mail_service"` | `"@nestjs/common"` |
| `internal[].type` | `"api"`, `"library"`, `"shared-db"` | `"framework"`, `"npm-package"` |
| `external[].name` | `"@nestjs/common@10.1.3"` | (should never appear in internal) |
| `external[].type` | `"npm-package"`, `"maven-artifact"`, `"service"`, `"sdk"` | `"api"` (use only for internal) |

> **Validation**: Every `internal` entry MUST have a `.repo` field matching a `luz_*` slug. If you find yourself writing `@org/package` or a maven artifactId into `internal` — stop and move it to `external` instead.

#### Business Context
Infer project business context:
- `domain` — from module name, package structure, README title
- `summary` — one-sentence description from README or package description
- `modules` — from route groups, feature directories, Maven modules
- `users` — from README, onboarding docs, or infer from domain (B2B → business users, B2C → consumers)

Record as: `{ "domain": "...", "summary": "...", "modules": [...], "users": "..." }`

**Rule**: Only record what has code evidence. Skip fields where no signal found.

### 5. Generate index.json

Create `docs/index.json` with all generated entries. Only include categories that were **selected** in Step 2 — omit any that were skipped:

```json
{
  "schemaVersion": "1.0.0",
  "description": "Project documentation registry",
  "updatedAt": "{today YYYY-MM-DD}",
  "categories": {
    "decision": "Architectural choices and reasoning (ADRs)",
    "architecture": "System structure, libs, data flow",
    "convention": "Coding rules and constraints",
    "feature": "Deep-dive guides for specific features",
    "pattern": "Reusable code patterns with examples",
    "finding": "Discovered gotchas and debug insights",
    "guide": "Operational how-to guides for dev setup, integration, and workflows",
    "api": "API endpoint documentation",
    "infra": "Infrastructure and deployment documentation",
    "integration": "External service integration documentation"
  },
  "dependencies": {
    "internal": [{ "repo": "...", "type": "api|library|shared-db", "evidence": "..." }],
    "external": [{ "name": "...", "type": "api|sdk|service", "evidence": "..." }]
  },
  "business": {
    "domain": "...",
    "summary": "...",
    "modules": ["..."],
    "users": "..."
  },
  "entries": [
    {
      "id": "ADR-0001",
      "title": "...",
      "category": "decision",
      "status": "accepted",
      "audience": ["agent", "human"],
      "path": "docs/decisions/ADR-0001-title.md",
      "tags": [],
      "agentHint": "check before ...",
      "related": []
    }
  ]
}
```

Key rules for `agentHint`:
- Start with "check before..." — tells agents *when* to read this doc
- Be specific: "check before choosing routing strategy" not "routing docs"

### 6. Report

```markdown
## Documentation Generated

### Category Selection
| Category | Status | Signal |
|----------|--------|--------|
| ADR | selected (core) | — |
| ARCH | selected (core) | — |
| CONV | selected (core) | — |
| FEAT | selected | route files detected |
| PATTERN | skipped (no signal) | no recurring patterns ≥3 |
| FINDING | skipped (no signal) | no existing findings/ |
| GUIDE | selected | Dockerfile detected |
| API | skipped (no signal) | no REST routes or @Path annotations |
| INFRA | skipped (no signal) | no docker-compose/CI config |
| INTEG | skipped (no signal) | no third-party SDK imports |

### Generated Documents
| Category | Count | Files |
|----------|-------|-------|
| ADR | N | ADR-0001, ADR-0002, ... |
| ARCH | N | ARCH-0001, ... |
| CONV | N | CONV-0001, ... |
| FEAT | N | FEAT-0001, ... |
| GUIDE | N | GUIDE-0001, ... |
| PATTERN | skipped (no signal) | — |
| FINDING | skipped (no signal) | — |
| API | skipped (no signal) | — |
| INFRA | skipped (no signal) | — |
| INTEG | skipped (no signal) | — |

**Total**: N entries in `docs/index.json`
**Enrichment**: N internal deps, N external deps, business context {present|absent}
**Next**: Run `/docs-update --verify` to validate content accuracy
```

## Migration Mode (`--migrate`)

Convert existing flat docs to KB structure.

### 1. Read Existing Flat Docs
Read all files in `docs/*.md` (top-level only, not subdirectories).

### 2. Map Content to KB Categories

| Flat File | Target | Category |
|-----------|--------|----------|
| `codebase-summary.md` | `ARCH-0001-overview.md` | architecture |
| `code-standards.md` | Split into `CONV-NNNN-*.md` entries | convention |
| `system-architecture.md` | `ARCH-0002-system-architecture.md` | architecture |
| `api-routes.md` | `FEAT-NNNN-api-routes.md` | feature |
| `data-models.md` | `ARCH-NNNN-data-models.md` | architecture |
| `deployment-guide.md` | `GUIDE-NNNN-deployment.md` | guide |
| `setup-guide.md`, `getting-started.md` | `GUIDE-NNNN-local-dev.md` | guide |
| `integration-guide.md` | `GUIDE-NNNN-integration.md` | guide |
| `project-overview-pdr.md` | `ARCH-NNNN-project-overview.md` | architecture |
| Other `.md` files | Classify by content → appropriate category | varies |

### 3. Reformat Content
- Apply KB templates from `knowledge` skill
- Add `## Status`, `## Tags` sections where appropriate
- Split large files if > 800 LOC

### 4. Supplement with Codebase Scan
After migrating existing content, scan codebase for gaps:
- Missing ADRs for major deps → generate
- No patterns documented → detect and generate
- No conventions → detect from config

### 5. Create index.json
Build `docs/index.json` with all migrated + newly generated entries.

### 6. Clean Up
- Delete original flat files (they've been migrated)
- One bulk commit with all changes

## Analysis Rules
- Scan EVERYTHING — don't skip directories
- Look for config files (package.json, tsconfig.json, .env.example)
- Check for Docker files, CI configs
- Find test files to understand testing approach
- Examine imports/exports to understand dependencies
- **Evidence-based only** — verify functions/classes/routes exist before documenting
- Keep files under 800 LOC (docs.maxLoc)
