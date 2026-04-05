---
name: backend-auth
description: (ePost) Provides internal JWT token architecture for Java backends. Use when working with jwt, token, auth, permission, AccessibleWithoutTenant, PermissionAllowed, tenant context, or Keycloak integration.
user-invocable: false
metadata:
  keywords:
    - jwt
    - token
    - auth
    - tenant
    - permission
    - keycloak
    - user-token
    - tenant-token
  agent-affinity:
    - epost-fullstack-developer
    - epost-code-reviewer
    - epost-debugger
  platforms:
    - backend
  triggers:
    - jwt
    - token
    - auth
    - permission
    - AccessibleWithoutTenant
    - PermissionAllowed
    - tenant token
---

# Internal JWT Token Architecture

## Two Internal Token Types

The platform uses two distinct internal tokens. These are **never exposed to external clients** — external clients use Keycloak tokens only.

| Token | Represents | When Required |
|-------|-----------|---------------|
| **User token** | Platform user identity | Endpoints with `@AccessibleWithoutTenant` |
| **Tenant token** | User's context within a specific tenant | Endpoints with `@PermissionAllowed(...)` |

See `references/token-schemas.md` for full JSON schemas and field explanations.

## JAX-RS Endpoint Annotations

### `@AccessibleWithoutTenant`
Endpoint requires user token only — no tenant context needed.

```java
@GET
@Path("users/{username}/track-login/last")
@AccessibleWithoutTenant
public Long lastLogin(@PathParam("username") String username) {
    // user token available, no tenant required
}
```

### `@PermissionAllowed(PermissionConstant.*)`
Endpoint requires tenant token + a specific permission from the tenant's role set.

```java
@POST
@Path("/customer-epost-matching")
@PermissionAllowed(PermissionConstant.FINANCE_CREATE_CUSTOMER)
public Response saveMatchingResult(...) {
    // tenant token required + FINANCE_CREATE_CUSTOMER permission
}
```

## Token Sources

| Token | Source Repo |
|-------|-------------|
| User token | `jwt_service` |
| Tenant token | `jwt_service` |
| Role/Permission constants | `luzsec_service`, `luz_jwt` |

Tokens are forwarded between internal services via the `Authorization` header.

## Security Rules

- Internal tokens travel in `Authorization` header between services
- Internal tokens are **NEVER** included in API responses to external clients
- External clients authenticate via Keycloak token only
- Never log full token payloads — mask or omit in log output

## Role Model Summary

| Field | Scope | Location |
|-------|-------|----------|
| `user_roles` | Platform-level (always present) | Top-level in both token types |
| `roles` (inside tenant object) | Resource-level, tenant-scoped | Inside `company-tenant` or `person-tenant` |

## Aspects

| Aspect | File | Purpose |
|--------|------|---------|
| Token Schemas | references/token-schemas.md | Full JWT field reference for both token types |
