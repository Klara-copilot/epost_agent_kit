# Auth/AuthZ Testing — JAX-RS + Jakarta EE

Patterns for testing authentication (401) and authorization (403) in JAX-RS endpoints running on WildFly 26.1. Covers JWT Bearer injection, `@RolesAllowed`, and Keycloak test realm setup.

---

## 1. JAX-RS Security Model

WildFly secures JAX-RS endpoints via two mechanisms:
- **`@RolesAllowed({"admin", "user"})`** — declarative role check on resource method
- **`@PermitAll` / `@DenyAll`** — explicit open/deny overrides
- **`SecurityContext.isUserInRole(role)`** — programmatic check inside method body

The container returns `401` when no token / invalid token. It returns `403` when token is valid but the caller's roles don't match `@RolesAllowed`.

---

## 2. JWT Token Generation for Tests

Generate test tokens directly — do not hit a live Keycloak instance in unit/integration tests.

### Option A: Nimbus JOSE (lightweight, no Keycloak)

```java
// Dependency: com.nimbusds:nimbus-jose-jwt
public class TestTokenUtil {

    private static final String SECRET = "test-secret-key-min-32-chars-long!!";

    public static String buildToken(String username, String... roles) throws Exception {
        JWSSigner signer = new MACSigner(SECRET.getBytes());
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
            .subject(username)
            .claim("realm_access", Map.of("roles", Arrays.asList(roles)))
            .expirationTime(new Date(System.currentTimeMillis() + 3_600_000)) // 1 hour
            .build();
        SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
        jwt.sign(signer);
        return jwt.serialize();
    }
}

// Usage in test
String userToken = TestTokenUtil.buildToken("alice", "user");
String adminToken = TestTokenUtil.buildToken("bob", "admin", "user");
```

Configure the same secret in `test-standalone.xml` (WildFly Elytron JWT realm) so WildFly accepts it.

### Option B: Keycloak Test Realm (for Arquillian managed container)

Use Keycloak's `admin-client` to create a throwaway realm:

```java
@BeforeClass
public static void setupKeycloak() {
    Keycloak kc = Keycloak.getInstance(
        "http://localhost:8180/auth", "master",
        "admin", "admin", "admin-cli");
    // Create realm, client, users, roles programmatically
    // Tear down in @AfterClass
}
```

Use Option A for speed; reserve Option B for E2E tests that need real Keycloak token exchange.

---

## 3. RestAssured Auth Patterns

Inject Bearer token into every request requiring auth:

```java
// Helper — avoid repeating in every test method
private RequestSpecification asUser(String token) {
    return given()
        .baseUri(baseUrl.toString())
        .header("Authorization", "Bearer " + token)
        .contentType(ContentType.JSON);
}

// 200 — authenticated user accessing own resource
asUser(userToken)
    .when().get("/api/profile")
    .then().statusCode(200)
    .body("username", equalTo("alice"));

// 401 — no token
given().baseUri(baseUrl.toString())
    .when().get("/api/profile")
    .then().statusCode(401);

// 401 — malformed token
given().baseUri(baseUrl.toString())
    .header("Authorization", "Bearer not-a-real-token")
    .when().get("/api/profile")
    .then().statusCode(401);

// 403 — valid token, insufficient role
asUser(userToken)
    .when().delete("/api/admin/users/1")
    .then().statusCode(403);

// 200 — admin role permitted
asUser(adminToken)
    .when().delete("/api/admin/users/1")
    .then().statusCode(200);
```

---

## 4. Expired Token Testing

```java
public static String buildExpiredToken(String username, String... roles) throws Exception {
    JWSSigner signer = new MACSigner(SECRET.getBytes());
    JWTClaimsSet claims = new JWTClaimsSet.Builder()
        .subject(username)
        .claim("realm_access", Map.of("roles", Arrays.asList(roles)))
        .expirationTime(new Date(System.currentTimeMillis() - 1000)) // already expired
        .build();
    SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
    jwt.sign(signer);
    return jwt.serialize();
}

// Test
given().baseUri(baseUrl.toString())
    .header("Authorization", "Bearer " + buildExpiredToken("alice", "user"))
    .when().get("/api/profile")
    .then().statusCode(401);
```

---

## 5. RBAC Edge Case Coverage Table

For every protected endpoint, verify all four combinations:

| Scenario | Expected | Test notes |
|----------|----------|-----------|
| No token | 401 | Container rejects before reaching resource method |
| Expired token | 401 | Token claims present but `exp` in past |
| Valid token, wrong role | 403 | `@RolesAllowed` rejects the caller |
| Valid token, correct role | 2xx | Happy path |

---

## 6. `@RolesAllowed` in Arquillian Deployment

Include the security annotation processing CDI extension in your ShrinkWrap archive or the resource class won't be secured:

```java
@Deployment
public static WebArchive createDeployment() {
    return ShrinkWrap.create(WebArchive.class, "test.war")
        .addClasses(OrderResource.class, OrderService.class, JwtFilter.class)
        .addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml")
        .addAsWebInfResource("test-web.xml", "web.xml"); // declare security-constraint
}
```

`test-web.xml` must declare the same security domain as production, pointing to the Elytron JWT realm configured in `test-standalone.xml`.

---

## 7. Testing SecurityContext Programmatic Checks

When the resource uses `securityContext.isUserInRole()` instead of `@RolesAllowed`:

```java
// Resource under test
@GET
@Path("/sensitive")
public Response sensitiveData(@Context SecurityContext sc) {
    if (!sc.isUserInRole("admin")) {
        return Response.status(403).build();
    }
    return Response.ok(getData()).build();
}

// Weld-JUnit: inject a mock SecurityContext via CDI producer
@ApplicationScoped
@Alternative
@Priority(1)
public class MockSecurityContext implements SecurityContext {
    private String role;

    public void setRole(String role) { this.role = role; }

    @Override
    public boolean isUserInRole(String r) { return r.equals(role); }
    // ... other methods return safe defaults
}
```

Use the Arquillian approach (real HTTP) when testing `@RolesAllowed`; use mock `SecurityContext` only for testing business logic inside the method body.
