---
name: multi-tenancy
description: (ePost) Defines the ePost tenant model — COMPANY, PERSON, INDIVIDUAL types, role hierarchy, schema isolation, and context propagation. Use when working with tenant context, company/user roles, schema isolation, or multi-tenant data access
user-invocable: false

metadata:
  agent-affinity:
    - epost-fullstack-developer
    - epost-code-reviewer
    - epost-debugger
  keywords:
    - tenant
    - multi-tenancy
    - company
    - individual
    - schema-isolation
    - luz_multi_tenancy
    - tenant-token
  platforms:
    - all
  triggers:
    - tenant
    - multi-tenancy
    - company tenant
    - schema isolation
    - luz_multi_tenancy
    - tenant context
---

# ePost Multi-Tenancy Domain

## Tenant Types

| Type | Description | Who |
|------|-------------|-----|
| COMPANY | Business tenant | Companies using ePost B2B services |
| PERSON | Personal tenant | User's individual scope within a company |
| INDIVIDUAL | Consumer account | B2C users (mail, documents) |

A single user can have access to multiple tenants (e.g., company owner + employee at different companies). The **active tenant** is determined by `tenantId` in the tenant token.

## Role Hierarchy

Two distinct role scopes — do NOT conflate them:

| Field | Scope | Example values |
|-------|-------|----------------|
| `user_roles` (in token root) | Platform-level — applies across the entire system | `klara_news_admin`, `klara_administration_admin`, `Everybody` |
| `roles` (inside tenant object) | Resource-level — scoped to the specific tenant | `company_administrator`, `employee` |

`user_roles` controls what platform features the user can access.
`roles` inside a tenant controls what the user can do within that tenant.

## Context Propagation Flow

```
Keycloak token (external)
  → BFF: extracts tenant context, builds tenant token
    → Backend: receives via Authorization header (tenant token)
```

The backend **never** receives raw Keycloak tokens. Always expect a tenant token with full tenant context embedded.

## Schema Isolation

Each tenant gets its own PostgreSQL schema (`tenant_{tenantId}`). Isolation is enforced by the `luz_multi_tenancy` library — schema routing happens automatically per request.

See `references/schema-isolation.md` for full DB isolation pattern and lifecycle.

## Aspects

| Aspect | File | Purpose |
|--------|------|---------|
| Token schemas | `references/token-structure.md` | Full user token + tenant token field reference |
| DB isolation | `references/schema-isolation.md` | Schema-per-tenant pattern, Flyway, AlloyDB |

## Related Skills

- `backend-auth` — token validation on the backend
- `domain-b2b` — B2B module context (uses tenant roles for access control)
