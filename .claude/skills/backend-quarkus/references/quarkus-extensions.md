# Quarkus Extension Reference

## Extension Preference Table

| Concern | Extension (`groupId:artifactId`) |
|---------|----------------------------------|
| REST endpoints | `io.quarkus:quarkus-rest` + `quarkus-rest-jackson` |
| REST client | `io.quarkus:quarkus-rest-client-reactive-jackson` |
| Fault tolerance | `io.quarkus:quarkus-smallrye-fault-tolerance` |
| Health checks | `io.quarkus:quarkus-smallrye-health` |
| OpenAPI | `io.quarkus:quarkus-smallrye-openapi` |
| JWT / OIDC | `io.quarkus:quarkus-oidc` or `quarkus-smallrye-jwt` |
| Config (YAML) | `io.quarkus:quarkus-config-yaml` |
| Bean validation | `io.quarkus:quarkus-hibernate-validator` |
| AlloyDB / PostgreSQL | `io.quarkus:quarkus-jdbc-postgresql` + `quarkus-hibernate-orm-panache` |
| Reactive PostgreSQL | `io.quarkus:quarkus-reactive-pg-client` — **only** for Kafka streams or explicit backpressure |
| MongoDB | `io.quarkus:quarkus-mongodb-panache` |
| Flyway | `io.quarkus:quarkus-flyway` |
| OpenTelemetry | `io.quarkus:quarkus-opentelemetry` |
| Micrometer | `io.quarkus:quarkus-micrometer-registry-prometheus` |
| Scheduler | `io.quarkus:quarkus-scheduler` |
| Pub/Sub | `io.quarkiverse.googlecloudservices:quarkus-google-cloud-pubsub` |
| Secret Manager | `io.quarkiverse.googlecloudservices:quarkus-google-cloud-secret-manager` |
| Container image | `io.quarkus:quarkus-container-image-jib` |
| Testing | `io.quarkus:quarkus-junit5` + `quarkus-junit5-mockito` |

**Rule**: Before adding any third-party library, check whether a Quarkus extension exists. If yes, use the extension.

## Java 21 Features to Use

| Feature | When to use |
|---------|-------------|
| **Records** | Immutable DTOs — `record CreateOrderRequest(String id, BigDecimal amount) {}` |
| **Pattern matching switch** | Type dispatch, replacing `instanceof` chains |
| **Virtual Threads** (`@RunOnVirtualThread`) | Blocking I/O handlers — remove thread-pool bottlenecks |
| **Structured Concurrency** | Parallel calls with scoped lifetimes |
| **Text blocks** | Multi-line SQL, JSON templates |
| **Sealed classes** | Closed type hierarchies (e.g., domain events) |

### Virtual Threads Example

```java
@Path("/orders")
@RunOnVirtualThread  // Mount endpoint on virtual thread — replaces reactive for blocking I/O
public class OrderResource {

    @GET
    @Path("/{id}")
    public OrderResponse get(@PathParam("id") UUID id) {
        return orderService.findById(id);  // Blocking DB call — fine on virtual thread
    }
}
```

## When to Use Reactive (Mutiny)

**Use Mutiny (`Uni`, `Multi`) ONLY for:**
- Kafka streams requiring event pipeline composition
- Complex event fan-out / fan-in with explicit backpressure
- Websocket streams

**Do NOT use Mutiny for:**
- Regular DB queries — use Panache blocking + `@RunOnVirtualThread`
- REST calls — use REST client (blocking) + `@RunOnVirtualThread`
- Pub/Sub handlers — use blocking `@ApplicationScoped` bean

Reactive adds complexity without benefit when virtual threads already solve the blocking I/O problem.
