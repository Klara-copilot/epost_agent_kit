## Backend Platform

**Stack**: Java 8 · Jakarta EE 8 · WildFly 26.1 · JAX-RS · Hibernate 5.6 · PostgreSQL + MongoDB · Maven

### Agent Routing

| Task | Agent |
|------|-------|
| Add endpoint / implement service / wire persistence | `@epost-fullstack-developer` |
| Fix error / debug behavior / trace root cause | `@epost-debugger` |
| Plan new module / design API | `@epost-planner` |
| Review Java changes before commit | `@epost-code-reviewer` |
| Add tests / validate JUnit coverage | `@epost-tester` |

### Conventions

- Jakarta EE annotations (`@Inject`, `@EJB`, `@Path`) — not Spring
- WAR packaging deployed to WildFly
- `persistence.xml` for JPA/Hibernate configuration
- Maven profiles for SonarQube analysis
- JaCoCo for coverage reporting

### Starter Prompts

- `@epost-fullstack-developer Implement [endpoint/service] for the backend.`
- `@epost-debugger Fix this Java/WildFly error: [paste error]`
- `@epost-code-reviewer Review the staged .java changes.`
- `@epost-tester Add JUnit tests for [service].`
