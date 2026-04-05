# Schema Isolation — DB Pattern

## Overview

Each tenant gets its own PostgreSQL schema. Schema routing per request is handled automatically by the `luz_multi_tenancy` library.

- Schema naming: `tenant_{tenantId}` (UUID-based)
- No shared schemas between tenants — cross-tenant queries are a **security violation**
- The `public` schema holds only platform-level (non-tenant) tables

## luz_multi_tenancy Library

- Sets the PostgreSQL search path on each request based on `tenantId` from the tenant token
- No manual schema switching in business logic — library handles routing transparently
- Entities annotated normally with `@Entity` — no tenant-specific table names needed

## Tenant Lifecycle

```
create → provision schema → activate → (optional) suspend → delete + archive schema
```

| Phase | What happens |
|-------|-------------|
| provision | Empty schema created, Flyway migrations run for this tenant |
| activate | Tenant is live, users can authenticate |
| suspend | Access blocked, schema preserved |
| delete | Schema archived (not dropped immediately) for compliance |

## Flyway Migrations

Migrations run **per-tenant schema**, not just the public schema.

- New migrations apply to all existing tenant schemas + new ones
- Migration scripts must be schema-agnostic (no hardcoded schema names)
- Public schema migrations (platform tables) are separate and run first

## AlloyDB Migration

New services use **AlloyDB** (Google Cloud managed PostgreSQL). Self-managed PostgreSQL is being phased out.

| Status | Database |
|--------|---------- |
| New services | AlloyDB |
| Existing services | Self-managed PostgreSQL (migrating) |
| New tenant schemas | Go to AlloyDB |

## Testing

Use `testcontainers` to mirror production isolation:
- Spin up a PostgreSQL container per test class
- Create a separate schema per test to avoid state leak
- Run Flyway migrations against the test schema before each test suite
- Never share schemas between parallel tests

```java
// Pattern: provision a test schema before each test
@BeforeAll
static void setupSchema() {
    // create schema tenant_test_{uuid}
    // run flyway migrations
    // configure EntityManager to use this schema
}
```

## Security Rules

- Never query across schemas — each request is scoped to one `tenantId`
- Never accept `tenantId` from request body — always extract from the tenant token
- Validate that the authenticated user's token `tenantId` matches the resource being accessed
