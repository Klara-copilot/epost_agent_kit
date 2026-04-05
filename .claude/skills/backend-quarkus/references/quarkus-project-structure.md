# Quarkus Project Structure

## Standard Directory Layout

```
src/
├── main/
│   ├── java/no/epost/{service}/
│   │   ├── rest/           # JAX-RS resources (@Path, @GET, @POST...)
│   │   ├── service/        # Business logic (@ApplicationScoped)
│   │   ├── repository/     # Data access (PanacheRepository or EntityManager)
│   │   ├── model/          # JPA entities (@Entity)
│   │   ├── dto/            # Request/Response DTOs (prefer Records)
│   │   ├── messaging/      # Pub/Sub publishers and subscribers
│   │   ├── mapper/         # DTO ↔ Entity mapping
│   │   └── exception/      # Custom exceptions + ExceptionMappers
│   └── resources/
│       ├── application.yml # Config (use YAML not properties)
│       ├── META-INF/
│       │   └── resources/  # Static files (OpenAPI spec, etc.)
│       └── db/migration/   # Flyway SQL scripts
└── test/
    └── java/no/epost/{service}/
        ├── rest/            # @QuarkusTest REST endpoint tests
        └── service/         # Unit tests with Mockito
```

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Package | `no.epost.{service}.{layer}` | `no.epost.orders.rest` |
| REST resource | `{Entity}Resource.java` | `OrderResource.java` |
| Service | `{Entity}Service.java` | `OrderService.java` |
| Repository | `{Entity}Repository.java` | `OrderRepository.java` |
| DTO (request) | Record — `{Entity}Request` | `record CreateOrderRequest(...)` |
| DTO (response) | Record — `{Entity}Response` | `record OrderResponse(...)` |
| Flyway script | `V{YYYYMMDD}{seq}__{description}.sql` | `V20240115001__create_orders_table.sql` |

## Config Rules

- **Always `application.yml`** — never `application.properties`
- **Secrets via GCP Secret Manager** extension — never hardcoded values
- **Profile prefixes**: `%dev.`, `%test.`, `%prod.` for environment-specific config

```yaml
# application.yml
quarkus:
  datasource:
    db-kind: postgresql
    jdbc:
      url: ${DB_URL}
  flyway:
    migrate-at-start: true
  opentelemetry:
    enabled: true

"%dev":
  quarkus:
    datasource:
      jdbc:
        url: jdbc:postgresql://localhost:5432/myservice_dev
    flyway:
      migrate-at-start: true

"%test":
  quarkus:
    datasource:
      db-kind: h2
      jdbc:
        url: jdbc:h2:mem:test
```

## Layer Responsibilities

| Layer | Annotation | Responsibility |
|-------|------------|----------------|
| `rest/` | `@Path`, `@RunOnVirtualThread` | HTTP boundary — validate input, return DTO |
| `service/` | `@ApplicationScoped`, `@Transactional` | Business logic — orchestrates repos |
| `repository/` | `@ApplicationScoped` | Data access only — no business logic |
| `model/` | `@Entity` | JPA entities — DB schema in code |
| `dto/` | `record` | Immutable transfer objects — no JPA annotations |
| `messaging/` | `@ApplicationScoped` | Pub/Sub publish + subscribe handlers |
| `exception/` | `@Provider` + `ExceptionMapper<T>` | Map domain exceptions → HTTP responses |

## Minimal Resource Example

```java
@Path("/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RunOnVirtualThread
public class OrderResource {

    @Inject
    OrderService orderService;

    @POST
    @Transactional
    public Response create(@Valid CreateOrderRequest request) {
        OrderResponse order = orderService.create(request);
        return Response.status(Response.Status.CREATED).entity(order).build();
    }

    @GET
    @Path("/{id}")
    public OrderResponse getById(@PathParam("id") UUID id) {
        return orderService.findById(id)
            .orElseThrow(() -> new NotFoundException("Order not found: " + id));
    }
}
```

## Testing

```java
@QuarkusTest
class OrderResourceTest {

    @Test
    void createOrder_returns201() {
        given()
            .contentType(ContentType.JSON)
            .body("""{"amount": "100.00", "currency": "NOK"}""")
        .when()
            .post("/orders")
        .then()
            .statusCode(201)
            .body("id", notNullValue());
    }
}
```
