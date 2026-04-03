---
name: backend-rest-standards
description: (ePost) Enforces org-wide REST API contract standards for Java backends. Use when designing REST endpoints, error responses, pagination, status codes, or API contracts — applies to both WildFly/Jakarta EE and Quarkus services.
user-invocable: false
metadata:
  keywords:
    - rest
    - api
    - error
    - pagination
    - status-code
    - response
    - dto
    - jax-rs
  agent-affinity:
    - epost-fullstack-developer
    - epost-code-reviewer
  platforms:
    - backend
  triggers:
    - REST API
    - error response
    - pagination
    - status code
    - API contract
---

# REST API Contract Standards

Cross-framework standard. Applies to **all Java backends** (WildFly/Jakarta EE + Quarkus).

## HTTP Verb Semantics

| Verb | Meaning | Idempotent |
|------|---------|-----------|
| `GET` | Read resource — no side effects | Yes |
| `POST` | Create resource | No |
| `PUT` | Full update (replace entire resource) | Yes |
| `PATCH` | Partial update (specific fields only) | No |
| `DELETE` | Remove resource | Yes |

Never use `GET` for operations that mutate state.

## Status Code Conventions

| Code | When to Use |
|------|-------------|
| `200 OK` | Successful read, update, or delete |
| `201 Created` | Resource successfully created (`POST`) |
| `400 Bad Request` | Client error — malformed request, missing required field |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Business logic conflict (e.g. duplicate, wrong state) |
| `422 Unprocessable Entity` | Validation failure (structure valid, semantic error) |
| `500 Internal Server Error` | Unexpected server failure — log stack trace |

## Standard Error DTO

All error responses use this format — no exceptions:

```java
public class ErrorDto {
    private String error;      // UPPER_SNAKE_CASE machine code
    private String message;    // Human-readable explanation
    private String timestamp;  // ISO-8601 UTC
}
```

JSON output:
```json
{
  "error": "RESOURCE_NOT_FOUND",
  "message": "User with id 42 was not found.",
  "timestamp": "2026-04-02T10:15:30Z"
}
```

**Rule**: Clients MUST check the `error` field for programmatic handling, not rely on status code alone.
**Rule**: All error codes are `UPPER_SNAKE_CASE` strings — never raw numbers or freeform text.

## Pagination

Use query params `page` (0-indexed) and `size` (default 20, max 100):

```
GET /api/users?page=0&size=20
```

Standard paginated response:
```json
{
  "data": [...],
  "total": 150,
  "page": 0,
  "size": 20
}
```

```java
public class PageDto<T> {
    private List<T> data;
    private long total;
    private int page;
    private int size;
}
```

Never return unbounded lists. If `size` exceeds 100, respond `400 Bad Request`.

## JAX-RS Error Mapping

Use `ExceptionMapper<T>` with `@Provider` — never return raw exception messages:

```java
@Provider
public class ResourceNotFoundExceptionMapper
        implements ExceptionMapper<ResourceNotFoundException> {

    @Override
    public Response toResponse(ResourceNotFoundException ex) {
        ErrorDto error = new ErrorDto(
            "RESOURCE_NOT_FOUND",
            ex.getMessage(),
            Instant.now().toString()
        );
        return Response
            .status(Response.Status.NOT_FOUND)
            .entity(error)
            .type(MediaType.APPLICATION_JSON)
            .build();
    }
}
```

## Rules

- Never expose internal exception messages or stack traces to clients
- Never return `200 OK` for error conditions
- Never use `error` field values that are integers or free-form strings — always `UPPER_SNAKE_CASE`
- `page` is always 0-indexed; document this in API spec
- Validate `size` parameter server-side — reject values above 100
