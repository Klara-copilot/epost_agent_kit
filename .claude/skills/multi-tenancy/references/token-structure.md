# Token Structure Reference

## User Token

Represents the authenticated platform user. Issued by Keycloak.

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
| `sub` | string | Username |
| `iss` | string | Issuer (`com.axonivy`) |
| `user_roles` | string[] | Platform-level roles — always present, controls platform feature access |
| `exp` | number | Unix timestamp — token expiry |
| `iat` | number | Unix timestamp — issued at |

## Tenant Token

Represents the user's context within a specific company or personal tenant. Built by the BFF and passed to the backend via the Authorization header.

```json
{
  "sub": "sender@axonivy.io",
  "company-tenant": {
    "companyInfoId": 4327,
    "companyId": 1,
    "companyName": "Woonig",
    "status": "ACTIVATED",
    "statusExpiryDate": null,
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

| Field | Description |
|-------|-------------|
| `sub` | User's email/username |
| `tenantId` | Active tenant UUID — which tenant scope is currently active |
| `user_roles` | Platform-level roles (same as user token) |
| `security_classes` | Security classification tags for fine-grained access control |
| `iss` | Issuer |
| `exp` / `iat` | Expiry / issued-at timestamps |

### Tenant Object Fields (`company-tenant`, `person-tenant`)

| Field | Description |
|-------|-------------|
| `id` | Internal tenant record ID |
| `tenantId` | UUID identifying this specific tenant schema |
| `type` | Tenant type: `COMPANY`, `PERSON`, or `INDIVIDUAL` |
| `username` | User's identifier within this tenant |
| `roles` | Resource-level roles **scoped to this tenant** — e.g., `company_administrator`, `employee` |
| `companyId` | (COMPANY only) Internal company ID |
| `companyInfoId` | (COMPANY only) Company info record ID |
| `companyName` | (COMPANY only) Display name |
| `status` | (COMPANY only) `ACTIVATED`, `SUSPENDED`, etc. |
| `companyType` | (COMPANY only) `BUSINESS` or similar |

## Tenant Types

| Type | Token key | Description |
|------|-----------|-------------|
| COMPANY | `company-tenant` | Business using ePost B2B services |
| PERSON | `person-tenant` | User's individual scope (not a company) |
| INDIVIDUAL | `individual-tenant` | B2C consumer account — receives/sends digital mail |

## Critical Distinction: `user_roles` vs tenant `roles`

```
user_roles (root)        → platform-level, applies everywhere
                           e.g., "can access admin console"

roles (inside tenant)    → resource-level, scoped to one tenant
                           e.g., "company_administrator of Woonig"
```

Never use `user_roles` to check what a user can do within a specific company — check `roles` inside the relevant tenant object instead.
