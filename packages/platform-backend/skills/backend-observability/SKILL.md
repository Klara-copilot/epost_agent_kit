---
name: backend-observability
description: (ePost) Enforces structured logging and observability standards for Java backends. Use when working with logging, log levels, slf4j, MDC, health checks, metrics, or tracing — applies to both WildFly/Jakarta EE and Quarkus services.
user-invocable: false
metadata:
  keywords:
    - logging
    - observability
    - slf4j
    - mdc
    - tracing
    - metrics
    - structured-logging
  agent-affinity:
    - epost-fullstack-developer
    - epost-debugger
    - epost-code-reviewer
  platforms:
    - backend
  triggers:
    - logging
    - log
    - observability
    - slf4j
    - mdc
    - health check
    - metrics
---

# Backend Observability Standards

Cross-framework standard. Applies to **all Java backends** (WildFly/Jakarta EE + Quarkus).

## SLF4J Usage

Always use the SLF4J interface — never `java.util.logging`, `log4j` direct API, or `System.out.println`.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
}
```

Use `{}` placeholders — never string concatenation:

```java
// Correct
log.info("User {} logged in from tenant {}", username, tenantId);

// Wrong — allocates string even if log level is disabled
log.info("User " + username + " logged in from tenant " + tenantId);
```

## Log Levels

| Level | When to Use |
|-------|-------------|
| `ERROR` | Operator intervention required — system cannot continue safely |
| `WARN` | Recoverable issue or abnormal state — system continues but something is wrong |
| `INFO` | Key business events: service startup, shutdown, job completed, user actions |
| `DEBUG` | Developer diagnostics only — disable in production |

Do NOT use `INFO` for per-request logging in hot paths — use `DEBUG`.

## MDC (Mapped Diagnostic Context)

### Mandatory Fields

Set these fields at the start of every business operation. Clear them on exit.

| Field | Value |
|-------|-------|
| `traceId` | Distributed trace ID (from incoming request header or generated) |
| `tenantId` | Active tenant UUID from the JWT tenant token |
| `userId` | Authenticated user subject (`sub` claim) |

### Setup Pattern

```java
import org.slf4j.MDC;

public class RequestFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext ctx) {
        MDC.put("traceId", extractOrGenerate(ctx, "X-Trace-Id"));
        MDC.put("tenantId", extractTenantId(ctx));
        MDC.put("userId", extractUserId(ctx));
    }
}

public class RequestResponseFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext req, ContainerResponseContext res) {
        MDC.clear();
    }
}
```

MDC fields automatically appear in all log statements within the request scope. Clear MDC on every exit path including exceptions.

## Exception Handling Rules

Never swallow exceptions silently. Log then rethrow or wrap:

```java
try {
    repository.save(entity);
} catch (PersistenceException e) {
    log.error("Failed to persist entity {}: {}", entity.getId(), e.getMessage(), e);
    throw new ServiceException("Persistence failure", e);
}
```

Always pass the exception as the last argument to `log.error()` — captures the full stack trace.

## Health Probes

Both readiness and liveness probes are mandatory for Kubernetes deployments. Same `HealthCheck` interface for WildFly (MicroProfile Health) and Quarkus (SmallRye Health).

```java
@Readiness   // or @Liveness
@ApplicationScoped
public class DatabaseReadinessCheck implements HealthCheck {
    @Override
    public HealthCheckResponse call() {
        return HealthCheckResponse.named("database").up().build();
    }
}
```

Default endpoints: WildFly `/health/ready`, `/health/live` · Quarkus `/q/health/ready`, `/q/health/live`

## Rules

- No `System.out.println` in any production code path
- No string concatenation in log arguments — always use `{}` placeholders
- No swallowed exceptions — always log stack trace then rethrow or wrap
- MDC fields `traceId`, `tenantId`, `userId` must be set for all business operations
- Always clear MDC in a `finally` block or response filter to prevent thread pool leaks
- Use `log.isDebugEnabled()` guard only when building the log message itself is expensive
- JSON structured logging enabled in production via Logstash encoder (WildFly) or `quarkus.log.console.json=true` (Quarkus)
