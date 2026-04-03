---
phase: 3
title: "Create backend-testing skill"
effort: 45 min
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Target: `packages/platform-backend/skills/backend-testing/`
- Register in: `packages/platform-backend/package.yaml`
- Stack: Java 8, Jakarta EE 8, WildFly 26.1, JAX-RS/RESTEasy, CDI, EJB, Hibernate, PostgreSQL, MongoDB, JUnit 4, Mockito, PowerMock, Arquillian, JaCoCo, Maven

## Files to Create

### `SKILL.md`

Frontmatter:
```yaml
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
```

Body sections:
1. **Purpose** — 1-2 lines
2. **Testing Pyramid for Jakarta EE** — Unit (Mockito, fastest) / CDI Integration (Weld-JUnit) / Full Integration (Arquillian) / REST E2E (RestAssured), when to use each layer
3. **Complexity Routing Table** — Plain JUnit + Mockito vs Weld-JUnit vs Arquillian decision matrix
4. **Arquillian Patterns** — @RunWith(Arquillian.class), @Deployment with ShrinkWrap micro-archive, Managed vs Remote container trade-off
5. **Weld-JUnit** — lightweight CDI without full container (~1s startup), @WeldSetup, when EJB annotations need Arquillian instead
6. **JAX-RS Testing with RestAssured** — fluent given/when/then, baseUri setup, pathParam, body assertions
7. **JPA Testing** — H2 in-memory (fast, 80% coverage) → Testcontainers for PostgreSQL-specific queries
8. **Mockito Patterns** — @Mock, @InjectMocks, static mocking with Mockito 3.4+ (mockStatic — no PowerMock needed for new code)
9. **Maven: Surefire vs Failsafe** — *Test.java (Surefire, unit) vs *IT.java (Failsafe, integration), why the split matters
10. **JaCoCo** — basic Maven config, coverage targets (line 70%, branch 60%)
11. **References** section

### `references/arquillian-patterns.md`

Sections:
- Dependency setup (pom.xml BOM + container adapters for WildFly 26.1)
- arquillian.xml configuration (managed vs remote)
- ShrinkWrap: JavaArchive vs WebArchive, addClasses, addAsManifestResource
- beans.xml requirement (CDI 2.0 discovery in test archive)
- @Inject and @EJB in test class body
- @ArquillianResource URL injection for REST tests
- Transaction rollback pattern (@Transactional + @TransactionAttribute on test)
- Performance: managed container startup optimization, @ClassRule sharing

### `references/jacoco-coverage.md`

Sections:
- Maven plugin setup (jacoco-maven-plugin config block)
- Surefire integration (agent appended automatically)
- Failsafe integration (instrument + restore goals)
- Coverage targets: line 70%, branch 60% — enforcement via `check` goal
- Exclusion patterns (generated code, DTOs, enums)
- Aggregate module report (multi-module Maven)
- SonarQube integration (sonar.coverage.jacoco.xmlReportPaths)

## File Ownership

| File | Action |
|---|---|
| `packages/platform-backend/skills/backend-testing/SKILL.md` | CREATE |
| `packages/platform-backend/skills/backend-testing/references/arquillian-patterns.md` | CREATE |
| `packages/platform-backend/skills/backend-testing/references/jacoco-coverage.md` | CREATE |
| `packages/platform-backend/package.yaml` | UPDATE — add `backend-testing` to provides.skills |
