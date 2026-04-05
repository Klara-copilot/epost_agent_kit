---
name: backend-code-review-rules
description: "Backend-specific code review rules — JPA, CDI categories"
user-invocable: false
disable-model-invocation: true
---

# Backend Code Review Rules

Jakarta EE / WildFly backend code review rules. Loaded by code-review skill when reviewing `.java` files.

**Scope**: Jakarta EE / WildFly backend services — JPA entities, CDI beans, EJBs, JAX-RS resources.

---

## JPA: Persistence

**Scope**: JPA entities, repositories, Hibernate queries, transaction boundaries.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| JPA-001 | No N+1 lazy load in loop — related data loaded via batch fetch or join fetch | high | `JOIN FETCH` in JPQL or `@BatchSize` on collection | Repository method called inside a loop iterating over entity collection |
| JPA-002 | No unbounded query results — all list queries apply pagination or setMaxResults | high | `query.setMaxResults(n)` or `Pageable` applied | `findAll()` / `getResultList()` on large table with no limit |
| JPA-003 | Entity equality via `@Id` field — equals/hashCode based on identifier, not identity | medium | `equals()`/`hashCode()` use `@Id` field | Uses default `Object.equals` on managed entity (identity-based) |
| JPA-004 | Transaction scope on service boundary only — repositories are not `@Transactional` | high | `@Transactional` on service class only | `@Transactional` on both repository and service, creating nested transaction scope |

---

## CDI: Dependency Injection

**Scope**: CDI beans, scopes, qualifiers, EJB interactions.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| CDI-001 | No scope mismatch — smaller-scoped bean not injected directly into larger-scoped bean | critical | Smaller scope injected via CDI proxy (default) or `@Produces` bridge | `@RequestScoped` bean field-injected into `@ApplicationScoped` without proxy |
| CDI-002 | No circular CDI dependency — bean A does not transitively depend on itself | high | Cycle broken via `@Lazy`, event system, or service refactor | Bean A injects B, B injects A — CDI container fails to resolve at startup |
| CDI-003 | Qualifier present on all ambiguous injection points | high | `@Qualifier` annotation on all injection points where multiple beans of same type exist | Multiple implementations of same interface with no `@Qualifier` to disambiguate |
| CDI-004 | No mixed `@EJB` + `@Inject` on same class — use one DI model consistently | medium | Class uses `@Inject` only or `@EJB` only | Same class mixes `@EJB` and `@Inject` for different dependencies |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| JPA-001–002 | Yes | — |
| JPA-003–004 | — | Yes |
| CDI-001–002 | Yes | — |
| CDI-003–004 | — | Yes |

**Lightweight**: Run on all Java file reviews. **Escalated**: Activate on critical findings, large PRs (10+ files), or explicit `--deep` flag.

## Extending

Add rules following the pattern `{CATEGORY}-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
