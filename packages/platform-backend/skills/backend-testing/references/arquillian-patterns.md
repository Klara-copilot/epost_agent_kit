# Arquillian Patterns

Reference for Arquillian integration tests on WildFly 26.1.

---

## Maven Dependencies

### BOM import (in `<dependencyManagement>`)

```xml
<dependency>
    <groupId>org.jboss.arquillian</groupId>
    <artifactId>arquillian-bom</artifactId>
    <version>1.8.0.Final</version>
    <scope>import</scope>
    <type>pom</type>
</dependency>
```

### Container adapter

```xml
<!-- WildFly 26.1 managed container -->
<dependency>
    <groupId>org.wildfly.arquillian</groupId>
    <artifactId>wildfly-arquillian-container-managed</artifactId>
    <version>5.0.0.Alpha8</version>
    <scope>test</scope>
</dependency>

<!-- For remote container (already-running WildFly) -->
<dependency>
    <groupId>org.wildfly.arquillian</groupId>
    <artifactId>wildfly-arquillian-container-remote</artifactId>
    <version>5.0.0.Alpha8</version>
    <scope>test</scope>
</dependency>

<!-- ShrinkWrap (usually pulled transitively, but pin if needed) -->
<dependency>
    <groupId>org.jboss.shrinkwrap</groupId>
    <artifactId>shrinkwrap-api</artifactId>
    <scope>test</scope>
</dependency>

<!-- RestAssured for HTTP assertions over deployed endpoint -->
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
</dependency>
```

---

## arquillian.xml

Place in `src/test/resources/arquillian.xml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<arquillian xmlns="http://jboss.org/schema/arquillian"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://jboss.org/schema/arquillian
                http://jboss.org/schema/arquillian/arquillian_1_0.xsd">

    <defaultProtocol type="Servlet 3.0"/>

    <container qualifier="wildfly-managed" default="true">
        <configuration>
            <!-- Point to a local WildFly installation -->
            <property name="jbossHome">${jboss.home:target/wildfly-26.1.3.Final}</property>
            <!-- Optional: port offset if 8080 conflicts -->
            <property name="managementPort">9990</property>
        </configuration>
    </container>

</arquillian>
```

**CI tip:** Download WildFly as part of the build (`maven-dependency-plugin:unpack`) into `target/` so `jbossHome` always resolves without manual installation.

---

## Managed vs Remote Container

| | Managed | Remote |
|---|---------|--------|
| **WildFly lifecycle** | Arquillian starts/stops it | Must be running before tests |
| **CI suitability** | Preferred — hermetic, no external dependency | Only when WildFly is pre-provisioned (e.g., Docker sidecar) |
| **Dev iteration** | Slower (full boot on first test) | Faster with warm server |
| **arquillian.xml config** | `jbossHome` property required | `managementAddress` / `managementPort` required |
| **Isolation** | High — clean state per suite run | Lower — shared server state between runs |

---

## ShrinkWrap: Micro-Deployment Strategy

Include **only** the classes under test and their direct dependencies. Avoid bundling the whole application — it increases startup time and makes failures harder to diagnose.

### JavaArchive (EJBs, CDI, JPA — no HTTP)

```java
@Deployment
public static JavaArchive createDeployment() {
    return ShrinkWrap.create(JavaArchive.class)
        .addClasses(OrderService.class, OrderRepository.class, Order.class, OrderStatus.class)
        .addAsManifestResource(EmptyAsset.INSTANCE, "beans.xml")              // CDI discovery
        .addAsResource("test-persistence.xml", "META-INF/persistence.xml");   // JPA config
}
```

### WebArchive (JAX-RS endpoints + CDI + JPA)

```java
@Deployment
public static WebArchive createDeployment() {
    return ShrinkWrap.create(WebArchive.class, "test.war")
        .addClasses(OrderResource.class, OrderService.class, OrderRepository.class, Order.class)
        .addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml")
        .addAsResource("test-persistence.xml", "META-INF/persistence.xml")
        .addAsWebInfResource("test-web.xml", "web.xml");  // if JAX-RS app class not used
}
```

### Useful ShrinkWrap methods

| Method | Effect |
|--------|--------|
| `addClasses(A.class, B.class)` | Add specific classes |
| `addPackage(com.example.service)` | Add all classes in a package |
| `addPackages(true, "com.example")` | Add package recursively |
| `addAsManifestResource(file, "name")` | Place file in META-INF/ |
| `addAsResource(file, "META-INF/persistence.xml")` | Place on classpath |
| `addAsWebInfResource(file, "beans.xml")` | Place in WEB-INF/ |

---

## beans.xml Requirement

CDI 2.0 (Jakarta EE 8) defaults to `annotated` discovery mode — beans without scope annotations may not be discovered without `beans.xml`. Always include it in test archives.

```java
// Preferred: empty marker file
.addAsManifestResource(EmptyAsset.INSTANCE, "beans.xml")

// Explicit: all-mode discovery (use when annotation-less beans are needed)
.addAsManifestResource(new StringAsset(
    "<beans xmlns='http://xmlns.jcp.org/xml/ns/javaee' " +
    "bean-discovery-mode='all'/>"), "beans.xml")
```

---

## Injecting in Test Classes

Once deployed, use standard CDI and EJB injection annotations in the test body:

```java
@RunWith(Arquillian.class)
public class PaymentServiceIT {

    @Inject                       // CDI bean
    private PaymentService paymentService;

    @EJB                          // Stateless EJB (via local interface or no-interface view)
    private InvoiceEJB invoiceEJB;

    @PersistenceContext           // Only works if test class itself is managed — see note below
    private EntityManager em;

    @Test
    public void shouldProcessPayment() {
        Payment payment = paymentService.process("order-42", BigDecimal.TEN);
        assertEquals(PaymentStatus.APPROVED, payment.getStatus());
    }
}
```

**Note on `@PersistenceContext` in test class:** The test class itself is not a CDI bean — direct `@PersistenceContext` injection into the test class body does not work the same way as in production beans. Inject via a helper `@Stateless` or `@RequestScoped` bean instead, or access the `EntityManager` through the tested service.

---

## @ArquillianResource for HTTP Tests

```java
@ArquillianResource
private URL baseUrl;  // Injected with the URL of the deployed WAR

@Test
public void shouldReturn404ForUnknownOrder() {
    given()
        .baseUri(baseUrl.toExternalForm())
    .when()
        .get("/api/orders/9999")
    .then()
        .statusCode(404);
}
```

---

## Transaction Rollback Pattern

Roll back database changes after each test to keep tests independent:

```java
@RunWith(Arquillian.class)
@Transactional(TransactionMode.ROLLBACK)      // Rolls back after each test
public class OrderRepositoryIT {

    @Inject
    private OrderRepository repo;

    @Test
    public void shouldFindByStatus() {
        repo.save(new Order("item-1", OrderStatus.PENDING));
        List<Order> orders = repo.findByStatus(OrderStatus.PENDING);
        assertEquals(1, orders.size());
    }
    // DB state rolled back — next test starts clean
}
```

Requires `arquillian-transaction-extension` on the classpath:

```xml
<dependency>
    <groupId>org.jboss.arquillian.extension</groupId>
    <artifactId>arquillian-transaction-jta</artifactId>
    <version>1.0.5</version>
    <scope>test</scope>
</dependency>
```

---

## Startup Optimisation

WildFly managed container startup dominates test suite time. Strategies:

| Strategy | How |
|----------|-----|
| Shared container per suite | Use `@ClassRule` or Arquillian's `@BeforeClass` equivalent (single deployment per class, not per method) |
| Disable unused subsystems | Provide a trimmed `standalone-test.xml` with messaging/clustering disabled |
| Parallel test classes | Configure `maven-failsafe-plugin` with `<parallel>classes</parallel>` — each class gets its own deployment |
| Remote container on CI | Use a Docker-cached WildFly image as a service container — eliminates repeated downloads |
