---
name: backend-quarkus
description: (ePost) Implements Quarkus microservice patterns — Java 21, Cloud Run, AlloyDB, Pub/Sub, Flyway. Use when building new backend services with Quarkus, Java 21+, or Cloud Run deployment
user-invocable: false
metadata:
  keywords:
    - quarkus
    - java21
    - cloud-run
    - microservice
    - alloydb
    - flyway
    - pubsub
    - opentelemetry
  agent-affinity:
    - epost-fullstack-developer
    - epost-tester
    - epost-debugger
    - epost-code-reviewer
  platforms:
    - backend
  triggers:
    - quarkus
    - java 21
    - cloud run
    - new service
    - alloydb
    - flyway
---

# Quarkus Microservice Patterns

## CRITICAL: This skill is for NEW services only

**Existing repos use `backend-javaee` (WildFly + Java 8). Do not apply Quarkus patterns to existing repos.**

If you are working on a repo with `pom.xml` using WildFly/Jakarta EE 8 packaging — stop and load `backend-javaee` instead.

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | Quarkus (always latest LTS) |
| Language | Java 21 (LTS) or Java 25 (LTS) |
| Build | Maven |
| API | REST (JAX-RS); gRPC where justified |
| Async messaging | Google Cloud Pub/Sub |
| Relational DB | AlloyDB (PostgreSQL-compatible) |
| Document DB | MongoDB (where use case fits) |
| Schema migrations | Flyway |
| Auth | JWT / OIDC (Keycloak) |
| Observability | GCP Cloud Logging + Cloud Monitoring + OpenTelemetry |
| CI/CD | Cloud Build + Cloud Deploy |
| Container registry | GCP Artifact Registry |
| Compute | Cloud Run (preferred) or GKE |

## Architectural Principles

1. **Stateless services** — no in-process state; use external stores
2. **Single responsibility** — one service owns one bounded context; services don't share databases
3. **Contract-first APIs** — OpenAPI spec before implementation; API contracts are team interfaces
4. **Defense in depth** — validate at every boundary (API input, message payload, DB constraints)
5. **Fail safely** — failing dependency must not cascade; degrade gracefully
6. **Idempotency by default** — every write operation and message handler must be safe to retry
7. **Observability is not optional** — structured logs, metrics, traces from day one
8. **Prefer Quarkus-native solutions** — Quarkus extensions over standalone libraries

## Extension Preference Rule

Always prefer Quarkus extensions over standalone libraries. Extensions are:
- Optimized at build time (smaller JAR, faster startup)
- Integrated with ArC DI
- Participate in dev mode / live reload
- Validated for GraalVM native compilation

See `references/quarkus-extensions.md` for the full extension table.

## Project Structure

See `references/quarkus-project-structure.md` for standard directory layout, naming conventions, and config rules.

## Build Commands

```bash
mvn quarkus:dev                     # Dev mode with live reload
mvn clean package                   # Build JAR
mvn clean package -Pnative          # Build native image
mvn test                            # Unit + @QuarkusTest
mvn verify                          # Full test suite
```

## Sub-Skill Routing

| Intent | Sub-Skill | When |
|--------|-----------|------|
| Database | `backend-databases` | PostgreSQL/AlloyDB, MongoDB patterns |
| Auth tokens | `backend-auth` | Internal JWT token validation |
| REST contract | `backend-rest-standards` | Error DTOs, pagination, status codes |
| Observability | `backend-observability` | Logging, metrics, health probes |
| Idempotency | see `references/idempotency-patterns.md` | Pub/Sub dedup, retry logic |

## Aspects

| Aspect | File | Purpose |
|--------|------|---------|
| Extensions | references/quarkus-extensions.md | Extension table, Java 21 features, reactive guidance |
| Structure | references/quarkus-project-structure.md | Directory layout, naming, config rules |
| Idempotency | references/idempotency-patterns.md | Pub/Sub dedup, retry, DLQ handling |
