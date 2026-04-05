# Plan Templates — Full Reference

Example plan.md, phase files, success criteria, and common constraint patterns.

---

## Example plan.md

```markdown
---
title: "Add user authentication with Keycloak"
status: active
created: 2026-04-03
updated: 2026-04-03
effort: 8h
phases: 3
platforms: [web, backend]
breaking: false
blocks: []
blockedBy: []
---

# Plan: Add User Authentication with Keycloak

## Summary

Integrate NextAuth + Keycloak for web authentication with session management and feature flags.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Backend Auth API | 3h | pending | [phase-1](./phase-1-backend-auth-api.md) |
| 2 | Web NextAuth Integration | 3h | pending | [phase-2](./phase-2-web-nextauth.md) |
| 3 | Session & Feature Flags | 2h | pending | [phase-3](./phase-3-session-flags.md) |

## Success Criteria

- [ ] Users can log in via Keycloak SSO
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect unauthenticated users
- [ ] Feature flags load from user token claims
- [ ] No breaking changes to existing public routes

## Constraints

- Must remain compatible with existing WAR deployment
- No new npm packages without approval
- Session storage: Redis (already available in infra)

## Validation Summary

Q: Will Keycloak work with the existing WildFly session store?
A: Yes — using JWT tokens, no server-side session needed for Keycloak flows.

Q: What happens if Keycloak is down?
A: NextAuth falls back to local session cache for up to 15 minutes.
```

---

## Example Phase File

```markdown
---
phase: 1
title: "Backend Auth API"
effort: 3h
depends: []
---

# Phase 1: Backend Auth API

## Context

- Plan: [plans/260403-1200-auth-keycloak/plan.md](../plan.md)
- Depends on: none
- Blocks: Phase 2 (web needs token validation endpoint)

## Overview

Add Keycloak token validation endpoint to the Jakarta EE backend. Exposes `/api/auth/validate` for the web frontend to verify tokens server-side.

## Requirements

- JAX-RS endpoint at `POST /api/auth/validate`
- Accepts `Authorization: Bearer {token}` header
- Returns `{ valid: boolean, claims: {...} }` JSON
- Validates token signature against Keycloak JWKS endpoint
- CDI-injected `KeycloakClient` service

## Files Owned (Phase 1 ONLY — do not touch other files)

- `src/main/java/com/epost/auth/AuthResource.java` — new JAX-RS endpoint
- `src/main/java/com/epost/auth/KeycloakClient.java` — new CDI service
- `src/main/java/com/epost/auth/TokenClaims.java` — new DTO
- `src/main/resources/META-INF/microprofile-config.properties` — add KEYCLOAK_URL, JWKS_URI

## Tasks

- [ ] Create `TokenClaims` DTO with userId, email, roles, claims fields
- [ ] Implement `KeycloakClient.validateToken(String bearerToken)` — calls JWKS endpoint
- [ ] Create `AuthResource` with `@POST @Path("/validate")` using `@Inject KeycloakClient`
- [ ] Add MicroProfile Config entries for Keycloak URL
- [ ] Write JUnit 4 test: valid token → 200, expired token → 401, malformed → 400

## Validation

```bash
# Test endpoint
curl -X POST http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer {test_token}"
# Expected: {"valid": true, "claims": {...}}
```

## Success Criteria

- [ ] All 3 test cases pass
- [ ] `mvn package -DskipTests` succeeds
- [ ] Endpoint documented in phase report
```

---

## Success Criteria Patterns

### Feature Criteria (functional)
```markdown
- [ ] User can perform {action} and see {result}
- [ ] {Feature} works on {platforms}
- [ ] Error state shows {message} when {condition}
- [ ] Performance: {action} completes in < {N}ms
```

### Non-Regression Criteria
```markdown
- [ ] Existing {feature} still works
- [ ] No breaking changes to {API/interface}
- [ ] All existing tests pass
- [ ] Build succeeds with no new warnings
```

### Infrastructure Criteria
```markdown
- [ ] Docker build succeeds
- [ ] No new environment variables required without defaults
- [ ] Migrations are reversible
```

---

## Common Constraint Patterns

### Dependency Constraints
```markdown
## Constraints

- No new npm/Maven dependencies without approval
- Must use existing {library} — do not introduce alternatives
- Minimum supported version: {platform} {version}
```

### Compatibility Constraints
```markdown
- Must remain backward-compatible with API v{N}
- No breaking changes to existing {public interface}
- Must work with existing {auth/session/cache} infrastructure
```

### Platform Constraints
```markdown
- Web: Next.js App Router only — no Pages Router patterns
- iOS: Swift 6 strict concurrency compliance
- Android: minSdk {N} — no APIs above that level
- Backend: Java 8 compatible — no lambdas with >2 captures
```

### Testing Constraints
```markdown
- All new public methods must have unit tests
- Integration tests must use real database (no mocks for DB layer)
- E2E tests must cover happy path and main error state
```

---

## Plan Lifecycle Scripts

| Action | Script |
|--------|--------|
| Activate plan | `node .claude/scripts/set-active-plan.cjs plans/{slug}` |
| Complete plan | `node .claude/scripts/complete-plan.cjs plans/{slug}` |
| Archive plan | `node .claude/scripts/archive-plan.cjs plans/{slug}` |
| Check active plan | `node .claude/scripts/get-active-plan.cjs` |

**MANDATORY**: After writing all plan files, always run `set-active-plan.cjs` so `/cook` picks it up automatically.

---

## Cross-Plan Dependency Detection

Before writing plan files:
1. Read `plans/index.json` — scan for active/draft plans
2. Check their frontmatter `blocks`/`blockedBy` fields for overlap with new plan scope
3. Scan their phase files for shared file paths
4. If overlap found → surface to user with plan name + conflicting paths → resolve before proceeding
5. Populate `blocks`/`blockedBy` in new plan frontmatter when applicable
