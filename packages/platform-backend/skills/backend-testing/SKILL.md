---
name: backend-testing
description: "Use when writing backend tests — Arquillian WildFly integration, Weld-JUnit CDI unit tests, JAX-RS endpoint tests with RestAssured, JPA/Hibernate with H2, or JaCoCo coverage configuration. Jakarta EE 8 / JUnit 4 patterns."
user-invocable: false
context: inline
metadata:
  keywords: [arquillian, weld, junit, mockito, restassured, jacoco, cdi, ejb, jpa, hibernate]
  platforms: [backend]
  connections:
    extends: [backend-javaee]
    related: [test, scenario]
---

## Purpose

Patterns for testing Jakarta EE 8 backend code on WildFly 26.1 — from fast unit tests to full container integration. Covers tool selection, test structure, coverage configuration, and CI gate separation.

---

## Testing Pyramid for Jakarta EE

```
        [ RestAssured E2E ]          ← REST endpoint assertions (layered over integration)
       [  Arquillian + WildFly  ]    ← Full container: EJBs, JPA, real transactions (~10–30s startup)
      [     Weld-JUnit CDI       ]   ← Lightweight CDI container (~1s startup), no EJB
     [    JUnit 4 + Mockito       ]  ← Pure Java, no container, fastest (<1s total suite)
```

| Tier | Startup | Scope | Use for |
|------|---------|-------|---------|
| JUnit 4 + Mockito | < 1s | No container | Pure logic, service methods, mappers |
| Weld-JUnit | ~1s | CDI container | CDI beans, interceptors, CDI events, qualifiers |
| Arquillian + WildFly | 10–30s | Full container | EJBs, JPA lifecycle, transactions, full WildFly behaviour |
| RestAssured (over Arquillian) | Same as Arquillian | HTTP layer | JAX-RS endpoints, serialisation, HTTP status codes |

---

## Complexity Routing Table

| Scenario | Tool |
|----------|------|
| Pure logic — no container deps | JUnit 4 + Mockito |
| Service with `@Inject` CDI dependencies | Weld-JUnit |
| CDI interceptors / decorators | Weld-JUnit |
| CDI events (`@Observes`) | Weld-JUnit |
| `@Stateless` / `@Stateful` EJBs | Arquillian |
| `@TransactionAttribute` behaviour | Arquillian |
| JPA entity lifecycle (`@PrePersist`, lazy loading) | Arquillian |
| Full JAX-RS endpoint (path params, auth, serialisation) | Arquillian + RestAssured |
| PostgreSQL-specific SQL (JSON operators, window functions) | Arquillian + Testcontainers |

---

## Arquillian Patterns

Arquillian deploys a micro-archive into WildFly for each test class. Keep archives minimal — include only the classes under test and their direct dependencies.

```java
@RunWith(Arquillian.class)
public class OrderServiceIT {

    @Deployment
    public static Archive<?> createDeployment() {
        return ShrinkWrap.create(JavaArchive.class)
            .addClasses(OrderService.class, OrderRepository.class, Order.class)
            .addAsManifestResource(EmptyAsset.INSTANCE, "beans.xml")
            .addAsResource("test-persistence.xml", "META-INF/persistence.xml");
    }

    @Inject
    private OrderService orderService;

    @Test
    public void shouldPersistOrder() {
        Order order = orderService.create("item-1", 3);
        assertNotNull(order.getId());
    }
}
```

**beans.xml is required.** CDI discovery is disabled without it. Use `EmptyAsset.INSTANCE` for an empty marker file.

### Managed vs Remote Container

| Mode | Config | CI | Dev |
|------|--------|----|-----|
| Managed | `jbossHome` in arquillian.xml, WildFly started/stopped per suite | Preferred — reproducible | Slower (full boot each run) |
| Remote | WildFly running externally, Arquillian connects | When WildFly is pre-provisioned | Faster iteration with warm server |

See `references/arquillian-patterns.md` for full Maven BOM, arquillian.xml, and ShrinkWrap recipes.

---

## Weld-JUnit

Weld-JUnit starts a lightweight CDI container without EJBs or JPA — ideal for CDI-only beans.

```java
@RunWith(WeldJUnit4Runner.class)
public class NotificationServiceTest {

    @WeldSetup
    public WeldInitiator weld = WeldInitiator.from(NotificationService.class, EmailGateway.class)
        .activate(RequestScoped.class)
        .build();

    @Inject
    private NotificationService notificationService;

    @Test
    public void shouldSendEmail() {
        notificationService.sendWelcome("user@example.com");
        // assert via injected EmailGateway mock/spy
    }
}
```

**Limitation:** `@Stateless`, `@TransactionAttribute`, `@PersistenceContext` are EJB/JPA constructs — Weld-JUnit ignores them. Use Arquillian for those.

---

## JAX-RS Testing with RestAssured

RestAssured runs over a live HTTP endpoint exposed by Arquillian.

```java
@RunWith(Arquillian.class)
public class OrderResourceIT {

    @Deployment
    public static WebArchive createDeployment() {
        return ShrinkWrap.create(WebArchive.class, "test.war")
            .addClasses(OrderResource.class, OrderService.class)
            .addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml");
    }

    @ArquillianResource
    private URL baseUrl;

    @Test
    public void shouldReturnOrderById() {
        given()
            .baseUri(baseUrl.toString())
            .pathParam("id", 42)
        .when()
            .get("/api/orders/{id}")
        .then()
            .statusCode(200)
            .body("id", equalTo(42))
            .body("status", equalTo("PENDING"));
    }
}
```

`@ArquillianResource URL` injects the deployed application URL automatically.

---

## JPA Testing Layers

| Layer | Speed | Coverage |
|-------|-------|---------|
| H2 in-memory | Fast (~2s) | ~80% — catches JPQL errors, associations, lifecycle hooks |
| Testcontainers (PostgreSQL) | Slower (~15s) | 100% — catches JSON operators, window functions, native queries |

**Default:** Start with H2 via a separate `test-persistence.xml` pointing to `hibernate.dialect=H2Dialect`.

**Upgrade to Testcontainers** when queries use `JSONB`, `ARRAY`, `LATERAL`, or window functions not supported by H2.

```xml
<!-- test-persistence.xml -->
<persistence-unit name="testPU" transaction-type="RESOURCE_LOCAL">
    <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
    <properties>
        <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
        <property name="javax.persistence.jdbc.url" value="jdbc:h2:mem:test;DB_CLOSE_DELAY=-1"/>
        <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
        <property name="hibernate.hbm2ddl.auto" value="create-drop"/>
    </properties>
</persistence-unit>
```

---

## Test Naming Convention

Use `methodUnderTest_stateUnderTest_expectedBehaviour` (underscores as separators, camelCase within each segment):

```java
// ✅ Good
createOrder_withInvalidItem_shouldThrow400()
approveInvoice_whenPaymentFails_shouldReturnFalse()
findUser_withUnknownId_shouldReturnEmpty()

// ❌ Avoid
testApprove()
test1()
shouldWork()
```

---

## AAA Pattern (Arrange-Act-Assert)

Every test method should have three clear phases — avoid blurring them:

```java
@Test
public void approveInvoice_whenPaymentSucceeds_shouldReturnTrue() {
    // Arrange
    Invoice invoice = new Invoice("INV-001", 99.99);
    when(paymentGateway.charge(invoice)).thenReturn(true);

    // Act
    boolean result = invoiceService.approve(invoice);

    // Assert
    assertTrue(result);
    verify(paymentGateway).charge(invoice);
}
```

**Rule:** One logical assertion per test (multiple `assert*` calls are OK if they verify the same outcome). If you need two unrelated assertions, write two tests.

---

## Mockito Patterns

**JUnit 4** uses `@RunWith(MockitoJUnitRunner.class)` (not `@ExtendWith`, which is JUnit 5).

```java
@RunWith(MockitoJUnitRunner.class)
public class InvoiceServiceTest {

    @Mock
    private PaymentGateway paymentGateway;

    @InjectMocks
    private InvoiceService invoiceService;

    @Test
    public void shouldChargeOnInvoiceApproval() {
        when(paymentGateway.charge(any(Invoice.class))).thenReturn(true);

        boolean result = invoiceService.approve(new Invoice("INV-001", 99.99));

        assertTrue(result);
        verify(paymentGateway).charge(any(Invoice.class));
    }
}
```

**Static mocking (Mockito 3.4+):** Prefer `mockStatic` over PowerMock for new code.

```java
try (MockedStatic<DateUtil> mocked = Mockito.mockStatic(DateUtil.class)) {
    mocked.when(DateUtil::today).thenReturn(LocalDate.of(2024, 1, 15));
    // test code that calls DateUtil.today()
}
```

PowerMock remains available for legacy code that cannot be refactored.

### Mocking Decision Table

| Need | Approach |
|------|----------|
| Pure logic, no container | JUnit 4 + `@Mock` / `@InjectMocks` |
| Verify a method was called | `verify(mock).method(args)` (spy or mock) |
| Replace one method on a real object | `Mockito.spy(realObject)` + `doReturn` |
| Replace a static method | `Mockito.mockStatic(Class.class)` (3.4+) |
| Replace a CDI bean in Weld context | CDI `@Alternative` + `@Priority` or `WeldInitiator.addBeans()` |
| Replace an EJB in Arquillian | Cannot mock — redesign to inject interface; use a test `@Alternative` |
| External HTTP call | Mock the JAX-RS `Client` or extract to a gateway interface, then mock |

---

## Auth/AuthZ Testing

Test **401 Unauthenticated** and **403 Forbidden** independently.

```java
// 401 — no token
given().baseUri(baseUrl.toString())
    .when().get("/api/orders")
    .then().statusCode(401);

// 403 — wrong role
given().baseUri(baseUrl.toString())
    .header("Authorization", "Bearer " + userToken)
    .when().delete("/api/admin/orders/1")
    .then().statusCode(403);

// 200 — correct role
given().baseUri(baseUrl.toString())
    .header("Authorization", "Bearer " + adminToken)
    .when().delete("/api/admin/orders/1")
    .then().statusCode(200);
```

See `references/auth-testing.md` for JWT generation, `@RolesAllowed` testing, and Keycloak test realm setup.

---

## Error Path Checklist

For every JAX-RS endpoint, cover these failure cases before marking done:

| HTTP Status | When to test |
|------------|--------------|
| 400 Bad Request | Missing required fields, invalid format, constraint violations |
| 401 Unauthorized | No `Authorization` header, expired token, malformed JWT |
| 403 Forbidden | Valid token but insufficient role (`@RolesAllowed`) |
| 404 Not Found | Resource ID does not exist |
| 409 Conflict | Duplicate key, state conflict (e.g. re-submitting a closed order) |
| 422 Unprocessable | Valid JSON but fails business rule (e.g. quantity < 0) |
| 500 Internal | Simulate downstream failure — verify error response shape, no stack trace leaked |

---

## Maven: Surefire vs Failsafe

| Plugin | Naming convention | Phase | Gate |
|--------|------------------|-------|------|
| `maven-surefire-plugin` | `*Test.java` | `test` | Must pass before integration tests run |
| `maven-failsafe-plugin` | `*IT.java` | `integration-test` + `verify` | Runs after package phase (WAR ready) |

**Why the split matters:** Unit tests (`*Test.java`) run on every compile cycle — fast feedback. Integration tests (`*IT.java`) require a packaged WAR and a running WildFly instance — separated behind CI gates to avoid blocking developers on slow tests.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-failsafe-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>integration-test</goal>
                <goal>verify</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

---

## JaCoCo

Minimum targets: **line coverage 70%**, **branch coverage 60%**.

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <id>prepare-agent</id>
            <goals><goal>prepare-agent</goal></goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>verify</phase>
            <goals><goal>report</goal></goals>
        </execution>
        <execution>
            <id>check</id>
            <phase>verify</phase>
            <goals><goal>check</goal></goals>
            <configuration>
                <rules>
                    <rule>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <minimum>0.70</minimum>
                            </limit>
                            <limit>
                                <counter>BRANCH</counter>
                                <minimum>0.60</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

Exclude DTOs and generated code from coverage — see `references/jacoco-coverage.md` for exclusion patterns and multi-module aggregate configuration.

---

## References

| File | Contents |
|------|---------|
| `references/arquillian-patterns.md` | Maven BOM, arquillian.xml, ShrinkWrap recipes, transaction rollback |
| `references/jacoco-coverage.md` | Full plugin config, exclusions, multi-module aggregate, SonarQube wiring |
| `references/auth-testing.md` | JWT generation, `@RolesAllowed` with Arquillian, Keycloak test realm, RBAC edge cases |
