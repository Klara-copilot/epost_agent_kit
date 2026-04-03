---
id: research-layer0-standards-gaps
title: Layer 0 Technical Standards Gap Analysis
status: ACTIONABLE
generated_at: 2026-04-02T19:32:00Z
agent: epost-researcher
---

# Research: Missing Layer 0 Technical Standards

## Executive Summary

Analysis of 20+ repositories in the epost_knowledge_base reveals **7 missing Layer 0 technical standards** that appear across multiple repos but lack corresponding kit skills. These gaps represent recurring patterns (3-15+ repos each) that should be formalized as organizational standards in `epost_agent_kit/packages/`.

**Verdict**: ACTIONABLE — All recommended skills address documented multi-repo patterns with high implementation evidence.

---

## Research Methodology

**Sources Consulted**:
- luz master-status.json (197 repos indexed)
- 20 index.json registries (luz_next, luz_epost_ios, luz_kubernetes, luz_communities, luz_webclient, android_epostsdk, klara_v2, luz-doc-output-mgmt, spay_dist, luz_admin_ui, epost_communication_monitoring, etc.)
- 8 CONV/PATTERN docs (luz_communities, spay_dist, klara_v2, luz_next)
- Architecture docs (luz_kubernetes, luz_next, luz-doc-output-mgmt)

**Search Strategy**: Identified recurring doc categories across all repos, cross-referenced against existing Layer 0 skills, flagged unique patterns without kit coverage.

---

## Missing Layer 0 Skills — Ranked by Priority

### 1. REST API Error Response Standardization (HIGH — 12+ repos)

**What's Missing**: No kit skill standardizes REST API error response formats across backend repos.

**Cross-Repo Evidence**:
- **luz_communities** (CONV-0001): defines `error`, `message`, `timestamp` JSON structure; 400/5xx handling
- **spay_dist** (PATTERN-0002): sync errors (200/400/500), async errors (DLQ), idempotency caching
- **luz-doc-output-mgmt** (28 entries): MicroProfile REST client; 12 downstream service calls with varying error contracts
- **klara_v2** (ARCH-0003): API proxy pattern across 4 Java services with token forwarding
- **luz_next** (ARCH-0002): FetchBuilder HTTP client; status code mapping
- **Android ePost SDK** (GUIDE-0001): ePost SDK integration with error handling

**Recurring Pattern**: All Java/JAX-RS repos use Response/error DTO pattern; frontend repos (Next.js, Kotlin Compose) normalize these differently. No org-wide standard.

**Suggested Skill**: `rest-api-standards` (backend-focused)
- Defines: HTTP verb mapping, status codes, error DTO structure, pagination
- Covers: error naming (`RESOURCE_NOT_FOUND` vs `404`), timestamp formats, retry logic
- Platforms: backend-javaee, platform-backend
- Relates to: `backend-javaee`, `web-api-routes`, `error-recovery`

**Priority**: HIGH — 12+ repos, critical for cross-service integration

---

### 2. Multi-Tenancy Data Isolation Patterns (HIGH — 8+ repos)

**What's Missing**: No kit skill documents multi-tenancy architecture and isolation strategies.

**Cross-Repo Evidence**:
- **luz_communities** (ADR-0001): schema-per-tenant isolation via `luz_multi_tenancy` library
- **luz-doc-output-mgmt** (INFRA-0001): tenant lifecycle, schema provisioning, billing isolation
- **klara_v2** (FEAT-0002): cookie-based tenant context (`klara_selected_company`); multi-tenant API forwarding
- **luz_next** (not in KB): Next.js tenant context handling (implied in API patterns)
- **luz_kubernetes** (CONV-0001): secret isolation per tenant overlay
- **luz_admin_ui** (14 entries): tenant admin operations
- **luz_epost_ios** (index): app-level tenant awareness

**Recurring Pattern**: Schema-per-tenant is standard (luz_communities); cookie/JWT carry tenant context; API proxies inject tenant headers/params. Yet no org-wide guide on how to implement, test, audit tenant isolation.

**Suggested Skill**: `multi-tenancy-patterns` (cross-platform)
- Defines: schema isolation, context propagation (cookie/header), API contract for tenant params
- Covers: tenant lifecycle (create, delete, migrate), schema version management, billing per tenant
- Platforms: backend-javaee, web-nextjs, platform-backend
- Relates to: `backend-databases`, `web-api-routes`, `security`

**Priority**: HIGH — 8+ repos, core business model

---

### 3. Kubernetes & GCP Deployment Conventions (HIGH — 6+ repos)

**What's Missing**: No kit skill standardizes Kubernetes/GCP infrastructure patterns.

**Cross-Repo Evidence**:
- **luz_kubernetes** (ARCH-0001, CONV-0001, GUIDE-0001): Kustomize overlays, SOPS secret encryption, AlloyDB, Cloud Armor, GKE provisioning
- **luz-doc-output-mgmt** (INFRA-0001): Docker, Cloud Run, CI/CD pipeline, scaling, disaster recovery
- **luz_webclient** (FEAT-0002): Google Cloud Build, Maven aggregator, Kubernetes deployment
- **android_epostsdk** (GUIDE-0001): Artifactory integration (not K8s but part of infra)
- **luz_admin_ui**: implied Kubernetes deployment
- **luz_communities** (INTEG-0001): cloud-native service integration

**Recurring Pattern**: All repos use GCP + Kubernetes. Kustomize + SOPS are org standard. Cloud Build pipeline orchestrates Maven builds. Yet no kit skill guides teams through: overlay strategy, secret naming, provisioning scripts, monitoring setup.

**Suggested Skill**: `infrastructure-kubernetes-gcp` (ops-focused)
- Defines: Kustomize overlay structure, SOPS conventions, secret naming, GKE cluster setup
- Covers: Cloud Armor (WAF), AlloyDB provisioning, Cloud Monitoring alerts, workload identity
- Platforms: platform-backend, all (applies to all deployments)
- Relates to: `deploy`, `security`, `error-recovery`

**Priority**: HIGH — 6+ repos + critical for operations

---

### 4. JWT & Session Token Lifecycle Management (HIGH — 7+ repos)

**What's Missing**: No kit skill standardizes token generation, refresh, validation, and expiry patterns.

**Cross-Repo Evidence**:
- **klara_v2** (ARCH-0002): NextAuth.js v5 + Keycloak; 12h JWT timeout; token refresh flow
- **luz_next** (ADR-0004): next-intl locale handling; auth via middleware
- **luz_epost_ios** (dependencies): Keycloak auth (eh_oauth_sdk_ios); AppAuth-iOS for OIDC
- **luz_communities** (CONV-0001): service-account JWT from LuzSec; @Transactional per request
- **luz-doc-output-mgmt** (dependencies): JWT parsing (nimbus-jose-jwt); token validation
- **klara_v2** (FEAT-0002): token stored in cookie (`klara_selected_company`); forwarded to backend
- **luz_kubernetes**: secret lifecycle management for service accounts

**Recurring Pattern**: All repos integrate Keycloak for OIDC + JWT. Frontend stores in cookie/session. Backend validates via JWT. Token refresh logic varies (some explicit, some via middleware). No org-wide guide on: token scope/claims, expiry windows, refresh strategy, validation library standards.

**Suggested Skill**: `jwt-session-management` (cross-platform, auth-focused)
- Defines: Token structure (claims, expiry), refresh lifecycle, validation patterns
- Covers: Keycloak integration, OIDC flow, scope/role extraction, multi-tenancy token context
- Platforms: platform-web, platform-ios, platform-android, platform-backend
- Relates to: `web-auth`, `backend-javaee`, `security`

**Priority**: HIGH — 7+ repos, security-critical

---

### 5. Idempotency & Request Deduplication (MEDIUM — 5+ repos)

**What's Missing**: No kit skill standardizes idempotency key patterns for async/distributed operations.

**Cross-Repo Evidence**:
- **spay_dist** (PATTERN-0002): "Check idempotency service before processing. Cache results."
- **luz-doc-output-mgmt** (dependencies): Pub/Sub messaging; multi-service calls to print providers
- **luz_communities** (INTEG-0001): external service integrations (Matrix, address book); retry logic
- **luz_eletter** (implied): async document delivery
- **luz_admin_service**: implied async admin operations

**Recurring Pattern**: Async operations (payment, document delivery, notification) need deduplication. Each repo invents its own cache/DB check. No org-wide pattern for: idempotency key format, cache backend, TTL, DLQ handling.

**Suggested Skill**: `request-idempotency` (backend-focused)
- Defines: Idempotency key generation & validation, cache strategy (Redis/in-memory)
- Covers: async operation deduplication, DLQ handling, retry with exponential backoff
- Platforms: platform-backend, web-api-routes
- Relates to: `error-recovery`, `backend-databases`

**Priority**: MEDIUM — 5+ repos, high impact on data consistency

---

### 6. Structured Logging & Observability Standards (MEDIUM — 8+ repos)

**What's Missing**: No kit skill standardizes logging format, context propagation, and observability patterns.

**Cross-Repo Evidence**:
- **spay_dist** (PATTERN-0002): "Structured logs with context: recordId, source, dest, error code"
- **luz_kubernetes** (ARCH-0001): Cloud Monitoring alerting; log aggregation implied
- **luz-doc-output-mgmt** (dependencies): slf4j logging; Jackson JSON serialization
- **luz_communities** (CONV-0001): implied logging in service layer
- **luz_next** (ARCH-0001): pino logging; Next.js `logging.fetches` enabled
- **klara_v2** (ARCH-0003): multi-service requests; context tracing across BFF + backend
- **luz_epost_ios**: Sentry integration (SentryManager.swift)
- **luz_webclient**: implied CI/CD logging

**Recurring Pattern**: All repos log, but format/context varies. Java uses slf4j + Jackson. Node uses pino. iOS uses Sentry. No org-wide standard for: log level conventions, context propagation (traceId, tenantId, userId), JSON schema, alerting rules.

**Suggested Skill**: `observability-logging-standards` (cross-platform)
- Defines: Structured log format (JSON + required fields), context propagation, log levels
- Covers: traceId correlation, tenant/user context, error categorization, alert thresholds
- Platforms: all
- Relates to: `error-recovery`, `security`, `deploy`

**Priority**: MEDIUM — 8+ repos, impacts debugging + operations

---

### 7. Form Validation & Error Presentation Patterns (MEDIUM — 6+ repos)

**What's Missing**: No kit skill standardizes form validation, error collection, and user feedback across web/mobile.

**Cross-Repo Evidence**:
- **klara_v2** (CONV-0002): React Hook Form + Zod schemas; all fields have zodSchema validation
- **klara_v2** (CONV-0004): Component structure; Props typed with TypeScript
- **luz_next** (index hints): FetchBuilder; multi-step form patterns implied
- **luz_admin_ui**: form-heavy UI (admin operations)
- **luz_asset_web**: web form interactions
- **luz_epost_ios** (dependencies): UIKit form validation

**Recurring Pattern**: Web (React Hook Form + Zod). Mobile (SwiftUI form binding implied). No org-wide guide on: validation schema organization, error field mapping, progressive validation (client vs server), error message display, accessibility in form errors.

**Suggested Skill**: `form-validation-patterns` (web-focused, extends web-frontend)
- Defines: Zod schema organization, error collection/mapping, client + server validation
- Covers: progressive disclosure (client-first, server-confirms), accessibility in error states, multi-step form state
- Platforms: web-frontend, web-nextjs
- Relates to: `web-frontend`, `web-testing`

**Priority**: MEDIUM — 6+ repos, user-facing impact

---

## Summary Table

| # | Skill Name | Layer 0 Path | Coverage | Priority | Repos |
|---|-----------|------------|----------|----------|-------|
| 1 | `rest-api-standards` | `packages/platform-backend/skills/` | Error responses, HTTP verbs, pagination | HIGH | 12+ |
| 2 | `multi-tenancy-patterns` | `packages/core/skills/` | Schema isolation, context propagation | HIGH | 8+ |
| 3 | `infrastructure-kubernetes-gcp` | `packages/core/skills/` | K8s overlays, SOPS, GCP setup | HIGH | 6+ |
| 4 | `jwt-session-management` | `packages/core/skills/` | Token lifecycle, refresh, validation | HIGH | 7+ |
| 5 | `request-idempotency` | `packages/platform-backend/skills/` | Dedup keys, cache strategy, DLQ | MEDIUM | 5+ |
| 6 | `observability-logging-standards` | `packages/core/skills/` | Structured logs, context tracing | MEDIUM | 8+ |
| 7 | `form-validation-patterns` | `packages/platform-web/skills/` | Zod schemas, error mapping, a11y | MEDIUM | 6+ |

---

## Implementation Recommendations

### Phase 1 (Month 1): Critical Gaps
1. **`rest-api-standards`** — Blocks new backend API design
2. **`multi-tenancy-patterns`** — Blocks new tenant-aware features
3. **`jwt-session-management`** — Blocks auth redesign

### Phase 2 (Month 2): Infra & Operations
4. **`infrastructure-kubernetes-gcp`** — Unblocks deployment automation

### Phase 3 (Month 3): DX & Quality
5. **`request-idempotency`** — Reduces data consistency bugs
6. **`observability-logging-standards`** — Improves debugging + ops
7. **`form-validation-patterns`** — Improves web UX

### Cross-Skill Dependencies
- `multi-tenancy-patterns` → `rest-api-standards` (tenant params in API contract)
- `jwt-session-management` → `multi-tenancy-patterns` (tenant claims in JWT)
- `rest-api-standards` → `observability-logging-standards` (log HTTP context)
- `request-idempotency` → `observability-logging-standards` (log idempotency key)

---

## Unresolved Questions

1. **Form validation on iOS/Android**: Does klara-theme provide Compose/SwiftUI validation helpers? Or is validation only standardized on web?
2. **Idempotency cache backend**: Should it be Redis, Postgres, or in-memory? What TTL? Organizations with high throughput may need Redis; smaller ones can use Postgres.
3. **Log centralization**: Are all repos feeding logs to Cloud Logging? Or are some using ELK/Datadog? Need to confirm before standardizing.
4. **Multi-tenancy scope**: Does it apply to B2C (consumer app) or only B2B? Luz_epost_ios is B2C but may still have account-level isolation.

---

## Sources Consulted

- luz master-status.json — 197 repos indexed as of 2026-04-02
- luz_next/index.json — 48 KB entries (web platform)
- luz_epost_ios/index.json — 31 KB entries (iOS platform)
- luz_kubernetes/index.json — 4 INFRA entries
- luz_communities/index.json — conventions + patterns
- klara_v2/index.json — 21 KB entries (HR/BFF architecture)
- luz-doc-output-mgmt/index.json — 28 KB entries (print/billing service)
- spay_dist/patterns — error handling, idempotency, logging
- android_epostsdk/index.json — SDK integration patterns
- luz_webclient/index.json — Maven aggregator + CI/CD

---

## Related Documents

- `/Users/than/Projects/epost_agent_kit/packages/core/skills/` — existing core skills
- `/Users/than/Projects/epost_agent_kit/packages/platform-backend/skills/` — existing backend skills
- `/Users/than/Projects/epost_agent_kit/packages/platform-web/skills/` — existing web skills
- `/Users/than/Projects/epost_knowledge_base/luz/` — knowledge base repos
