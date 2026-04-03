# Idempotency Patterns

## Why

Quarkus services process Pub/Sub messages and async operations that may be retried due to network failures, timeouts, or consumer restarts. Every write operation and message handler must be safe to run multiple times with the same result.

## Core Pattern

1. Generate idempotency key: `{operationType}:{resourceId}:{requestId}`
   - Example: `payment:invoice-123:req-abc`
2. Check DB/cache — if already processed, return cached result
3. Process the operation
4. Persist the result with TTL matching your SLA

## Pub/Sub Deduplication

Use the Pub/Sub `messageId` as the natural idempotency key. Store processed IDs in DB with TTL.

```java
@ApplicationScoped
public class PaymentMessageHandler {

    @Inject
    IdempotencyRepository idempotency;

    @Inject
    PaymentService paymentService;

    public void handle(PubSubMessage message) {
        String key = "payment:" + message.getMessageId();

        if (idempotency.isProcessed(key)) {
            return;  // Already handled — safe to skip
        }

        try {
            paymentService.process(message.getData());
            idempotency.markProcessed(key, Duration.ofHours(24));
        } catch (TransientException e) {
            throw e;  // Rethrow — Pub/Sub will retry with backoff
        } catch (PermanentException e) {
            idempotency.markFailed(key, e.getMessage());
            // Do NOT rethrow — NACK triggers DLQ routing after max delivery attempts
        }
    }
}
```

## Retry with Exponential Backoff

Use SmallRye Fault Tolerance — do not implement retry loops manually.

```java
@ApplicationScoped
public class ExternalServiceClient {

    @Retry(
        maxRetries = 3,
        delay = 1000,
        delayUnit = ChronoUnit.MILLIS,
        jitter = 200,
        retryOn = TransientException.class,
        abortOn = PermanentException.class
    )
    @ExponentialBackoff
    @Timeout(5000)
    public Result callExternalService(Request request) {
        return httpClient.post(request);
    }
}
```

## Circuit Breaker

Protect against cascading failures when a downstream service is degraded.

```java
@CircuitBreaker(
    requestVolumeThreshold = 10,
    failureRatio = 0.5,
    delay = 5000,
    successThreshold = 2
)
@Fallback(fallbackMethod = "fallback")
public Response callDownstream(Request request) {
    return downstreamClient.call(request);
}

public Response fallback(Request request) {
    // Return degraded response — do not throw
    return Response.degraded();
}
```

## DLQ Handling

| Exception type | Action | Outcome |
|----------------|--------|---------|
| `TransientException` | Rethrow | Pub/Sub retries with backoff |
| `PermanentException` | Catch, log, NACK | Pub/Sub routes to DLQ after max delivery attempts |
| Unknown | Log as error, NACK | Treat as permanent — investigate via DLQ |

DLQ topics are configured in Pub/Sub subscription settings — not in application code. Set max delivery attempts (e.g., 5) and a DLQ topic on the subscription.

## Idempotency Repository Pattern

```java
@ApplicationScoped
public class IdempotencyRepository {

    @Inject
    EntityManager em;

    @Transactional
    public boolean isProcessed(String key) {
        return em.createQuery(
            "SELECT COUNT(e) FROM IdempotencyRecord e WHERE e.key = :key AND e.expiresAt > :now",
            Long.class)
            .setParameter("key", key)
            .setParameter("now", Instant.now())
            .getSingleResult() > 0;
    }

    @Transactional
    public void markProcessed(String key, Duration ttl) {
        IdempotencyRecord record = new IdempotencyRecord(key, Instant.now().plus(ttl));
        em.persist(record);
    }
}
```

Flyway migration for idempotency table:

```sql
-- V20240115002__create_idempotency_records.sql
CREATE TABLE idempotency_records (
    key         VARCHAR(255) PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at   TIMESTAMPTZ NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'PROCESSED'
);

CREATE INDEX idx_idempotency_expires_at ON idempotency_records (expires_at);
```

Schedule a periodic cleanup job to purge expired records:

```java
@ApplicationScoped
public class IdempotencyCleanupJob {

    @Inject
    EntityManager em;

    @Scheduled(every = "1h")
    @Transactional
    void purgeExpired() {
        em.createQuery("DELETE FROM IdempotencyRecord e WHERE e.expiresAt < :now")
          .setParameter("now", Instant.now())
          .executeUpdate();
    }
}
```
