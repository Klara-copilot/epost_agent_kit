---
phase: 1
title: "Rewrite section 4.5 dependency subsections"
effort: 20m
depends: []
---

## Scope

Replace `#### Dependencies (internal)` and `#### Dependencies (external)` subsections in section 4.5 of `init.md`. Additive only — existing repos with correct formats remain valid.

## Files to Change

1. `packages/core/skills/docs/references/init.md` — lines 238-253 (source of truth)
2. `.claude/skills/docs/references/init.md` — same edit (mirror)

## Tasks

### 1. Replace `#### Dependencies (internal)` (lines 238-245)

New content:

```markdown
#### Dependencies (internal) — other `luz_*` repositories ONLY

Scan for cross-repo dependencies within the luz ecosystem:
- `pom.xml` → `<dependency>` with `luz_*` groupId or artifactId
- `package.json` → `@luz/*` or `luz_*` package names
- REST client base URLs → service-to-service calls pointing to other luz services

Record each as: `{ "repo": "luz_*_slug", "type": "api|library|shared-db", "evidence": "..." }`

> `.repo` MUST be a luz repository slug (e.g. `luz_mail_service`). Never an npm package or maven artifact.
```

### 2. Replace `#### Dependencies (external)` (lines 247-253)

New content:

```markdown
#### Dependencies (external) — npm/maven packages + third-party services

Scan for ALL non-luz dependencies:
- `package.json` → all deps that are NOT `@luz/*` → type: `npm-package`
- `pom.xml` → all deps without `luz_*` groupId → type: `maven-artifact`
- Config files → Keycloak, S3, SMTP, OneAPI endpoints → type: `service`
- SDK imports → third-party client libraries → type: `sdk`

Record each as: `{ "name": "...", "type": "npm-package|maven-artifact|service|sdk", "evidence": "..." }`
```

### 3. Add Correct vs Incorrect table after external section

```markdown
**Quick check — internal vs external:**

| Field | Correct | Incorrect |
|-------|---------|-----------|
| `internal[].repo` | `"luz_mail_service"` | `"@nestjs/common"` |
| `internal[].type` | `"api"`, `"library"`, `"shared-db"` | `"framework"`, `"npm-package"` |
| `external[].name` | `"@nestjs/common@10.1.3"` | (should never appear in internal) |
| `external[].type` | `"npm-package"`, `"maven-artifact"`, `"service"`, `"sdk"` | `"api"` (use only for internal) |
```

### 4. Add validation rule block

```markdown
> **Validation**: Every `internal` entry MUST have a `.repo` field matching a `luz_*` slug. If you find yourself writing `@org/package` or a maven artifactId into `internal` — stop and move it to `external` instead.
```

### 5. Mirror to `.claude/skills/docs/references/init.md`

Same edit. Files are currently identical per diff check.

## Validation

- [ ] Section 4.5 internal subsection mentions only `luz_*` repos
- [ ] Section 4.5 external subsection covers npm/maven + cloud services
- [ ] Correct/Incorrect table present
- [ ] Validation rule block present
- [ ] Both files identical after edit
- [ ] Smart Init mode (line 122-124) still references "Same as Generation Mode step 4.5" — no change needed
