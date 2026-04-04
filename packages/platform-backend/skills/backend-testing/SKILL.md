---
name: backend-testing
description: "Use when writing backend tests — Arquillian WildFly integration, Weld-JUnit CDI unit tests, JAX-RS endpoint tests with RestAssured, JPA/Hibernate with H2, or JaCoCo coverage configuration. Jakarta EE 8 / JUnit 4 patterns."
user-invocable: false
context: inline
paths: ["**/*Test.java", "**/*Tests.java", "**/*IT.java", "**/*IntegrationTest.java", "**/src/test/**/*.java"]
metadata:
  keywords: [arquillian, weld, junit, mockito, restassured, jacoco, cdi, ejb, jpa, hibernate]
  platforms: [backend]
  connections:
    extends: [backend-javaee]
    related: [test, scenario]
---

## Purpose

Patterns for testing Jakarta EE 8 backend code on WildFly 26.1 — from fast unit tests to full container integration.

## Testing Pyramid

| Tier | Startup | Scope | Use for |
|------|---------|-------|---------|
| JUnit 4 + Mockito | < 1s | No container | Pure logic, service methods, mappers |
| Weld-JUnit | ~1s | CDI container | CDI beans, interceptors, CDI events |
| Arquillian + WildFly | 10–30s | Full container | EJBs, JPA lifecycle, transactions |
| RestAssured (over Arquillian) | Same | HTTP layer | JAX-RS endpoints, serialisation, HTTP status |

## Complexity Routing Table

| Scenario | Tool |
|----------|------|
| Pure logic — no container deps | JUnit 4 + Mockito |
| Service with `@Inject` CDI dependencies | Weld-JUnit |
| CDI interceptors / decorators / events | Weld-JUnit |
| `@Stateless` / `@Stateful` EJBs | Arquillian |
| `@TransactionAttribute` behaviour | Arquillian |
| JPA entity lifecycle | Arquillian |
| Full JAX-RS endpoint | Arquillian + RestAssured |
| PostgreSQL-specific SQL | Arquillian + Testcontainers |

## Arquillian — Micro-Archive Pattern

Keep archives minimal — only classes under test and direct dependencies.

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

    @Inject private OrderService orderService;

    @Test
    public void shouldPersistOrder() {
        Order order = orderService.create("item-1", 3);
        assertNotNull(order.getId());
    }
}
```

**`beans.xml` is required** — CDI discovery is disabled without it.

See `references/arquillian-patterns.md` for Maven BOM, arquillian.xml, ShrinkWrap recipes, managed vs remote container.

## Test Naming Convention

`methodUnderTest_stateUnderTest_expectedBehaviour`:
```java
createOrder_withInvalidItem_shouldThrow400()
approveInvoice_whenPaymentFails_shouldReturnFalse()
```

## AAA Pattern

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

One logical assertion per test. If you need two unrelated assertions, write two tests.

## Mocking Decision Table

| Need | Approach |
|------|----------|
| Pure logic, no container | JUnit 4 + `@Mock` / `@InjectMocks` |
| Verify a method was called | `verify(mock).method(args)` |
| Replace one method on a real object | `Mockito.spy(realObject)` + `doReturn` |
| Replace a static method | `Mockito.mockStatic(Class.class)` (3.4+) |
| Replace a CDI bean in Weld | `@Alternative` + `@Priority` or `WeldInitiator.addBeans()` |
| Replace an EJB in Arquillian | Cannot mock — use test `@Alternative` |
| External HTTP call | Mock the JAX-RS `Client` or extract to gateway interface |

**JUnit 4 uses `@RunWith(MockitoJUnitRunner.class)`** — not `@ExtendWith` (JUnit 5).

## Auth/AuthZ Testing

Test 401 Unauthenticated and 403 Forbidden independently. See `references/auth-testing.md` for JWT generation, `@RolesAllowed` with Arquillian, and Keycloak test realm setup.

## Error Path Checklist

| Status | When to test |
|--------|--------------|
| 400 | Missing fields, invalid format, constraint violations |
| 401 | No token, expired token, malformed JWT |
| 403 | Valid token, insufficient role |
| 404 | Resource ID does not exist |
| 409 | Duplicate key, state conflict |
| 422 | Valid JSON but fails business rule |
| 500 | Downstream failure — verify response shape, no stack trace leaked |

## Maven: Surefire vs Failsafe

| Plugin | Naming | Phase | Gate |
|--------|--------|-------|------|
| `maven-surefire-plugin` | `*Test.java` | `test` | Fast — every compile cycle |
| `maven-failsafe-plugin` | `*IT.java` | `integration-test` + `verify` | After package phase (WAR ready) |

## JaCoCo

Minimum targets: **line 70%**, **branch 60%**.

See `references/jacoco-coverage.md` for full plugin config, exclusion patterns, multi-module aggregate, and SonarQube wiring.

## References

| File | Contents |
|------|---------|
| `references/arquillian-patterns.md` | Maven BOM, arquillian.xml, ShrinkWrap recipes, transaction rollback |
| `references/jacoco-coverage.md` | Full plugin config, exclusions, multi-module aggregate, SonarQube |
| `references/auth-testing.md` | JWT generation, `@RolesAllowed`, Keycloak test realm, RBAC edge cases |
