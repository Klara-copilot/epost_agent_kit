# Token Schemas Reference

Full field reference for both internal JWT token types.

## User Token

Represents the authenticated platform user — no tenant context.

```json
{
  "sub": "admin",
  "iss": "com.axonivy",
  "user_roles": ["klara_news_admin", "klara_administration_admin", "Everybody"],
  "exp": 1773357249,
  "iat": 1773314049
}
```

| Field | Type | Description |
|-------|------|-------------|
| `sub` | string | Username / principal identity |
| `iss` | string | Issuer — always `com.axonivy` for internal tokens |
| `user_roles` | string[] | Platform-level roles. `Everybody` is always present. |
| `exp` | number | Expiry — Unix timestamp (seconds) |
| `iat` | number | Issued-at — Unix timestamp (seconds) |

## Tenant Token

Represents the user's context within a specific tenant. Extends user token with tenant-scoped claims.

```json
{
  "sub": "sender@axonivy.io",
  "company-tenant": {
    "companyInfoId": 4327,
    "companyId": 1,
    "companyName": "Woonig",
    "status": "ACTIVATED",
    "companyType": "BUSINESS",
    "id": 7551,
    "roles": ["company_administrator"],
    "tenantId": "6eace38d-dad1-4487-8a30-814bd50ee6b1",
    "username": "sender@axonivy.io",
    "type": "COMPANY"
  },
  "iss": "com.axonivy",
  "tenantId": "6eace38d-dad1-4487-8a30-814bd50ee6b1",
  "user_roles": ["Everybody"],
  "person-tenant": {
    "id": 0,
    "roles": ["company_administrator"],
    "tenantId": "5c893e9a-7676-4b7c-9019-916977f3441a",
    "username": "sender@axonivy.io",
    "type": "PERSON"
  },
  "exp": 1773357437,
  "iat": 1773314237,
  "security_classes": ["abc", "xyz"]
}
```

### Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `sub` | string | User email / principal identity |
| `iss` | string | Issuer — always `com.axonivy` |
| `tenantId` | string | Active tenant UUID (matches `company-tenant.tenantId`) |
| `user_roles` | string[] | Platform-level roles (`Everybody` always present) |
| `security_classes` | string[] | Additional security class tags for fine-grained access |
| `exp` | number | Expiry — Unix timestamp (seconds) |
| `iat` | number | Issued-at — Unix timestamp (seconds) |

### `company-tenant` Object

| Field | Type | Description |
|-------|------|-------------|
| `companyInfoId` | number | Internal company info record ID |
| `companyId` | number | Company entity ID |
| `companyName` | string | Display name of the company |
| `status` | string | Tenant status — `ACTIVATED`, `DEACTIVATED`, `PENDING` |
| `companyType` | string | `BUSINESS` or `INDIVIDUAL` |
| `id` | number | Tenant membership record ID |
| `roles` | string[] | Resource-level roles within this tenant |
| `tenantId` | string | UUID identifying this tenant |
| `username` | string | User's username within this tenant |
| `type` | string | Tenant type — `COMPANY` |

### `person-tenant` Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Person-tenant membership record ID (0 = default) |
| `roles` | string[] | Resource-level roles within the person tenant |
| `tenantId` | string | UUID identifying the person-scoped tenant |
| `username` | string | User's username within the person tenant |
| `type` | string | Tenant type — `PERSON` |

## Tenant Types

| Type | Meaning |
|------|---------|
| `COMPANY` | Business tenant — corporate mail, B2B modules |
| `PERSON` | Personal tenant — individual user context |
| `INDIVIDUAL` | Standalone individual without company association |

## Role Model

| Role Field | Scope | Location | Purpose |
|------------|-------|----------|---------|
| `user_roles` | Platform-level | Top-level in both tokens | Always present, cross-tenant permissions |
| `company-tenant.roles` | Tenant-scoped | Inside `company-tenant` | Permissions within the company context |
| `person-tenant.roles` | Tenant-scoped | Inside `person-tenant` | Permissions within the personal context |

Platform-level `user_roles` apply everywhere. Tenant `roles` apply only within their specific tenant context.

## Getting Tokens

Tokens are issued by the `jwt_service` REST API. Pass user credentials or an existing Keycloak token to exchange for internal tokens. Service-to-service calls forward the `Authorization` header with the internal token.

## Security Rule

Internal tokens flow only between internal services via the `Authorization` header.  
**Never** include token payloads or raw token strings in API responses returned to external clients.  
**Never** log full token contents — mask the `Authorization` header value in request logs.
