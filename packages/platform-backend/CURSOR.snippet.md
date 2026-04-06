## Backend Platform

**Stack**: Java 8 · Jakarta EE 8 · WildFly 26.1 · JAX-RS · Hibernate 5.6 · PostgreSQL + MongoDB · Maven

This rule auto-applies when editing `.java` files in backend service projects.

### Agent Routing

| Intent | Chat command |
|--------|-------------|
| Build / implement / add endpoint | `@epost-fullstack-developer [task]` |
| Fix / debug / trace error | `@epost-debugger [error]` |
| Plan new module / design API | `@epost-planner [topic]` |
| Review staged .java changes | `@epost-code-reviewer Review staged .java changes` |

### Conventions

- Jakarta EE annotations (`@Inject`, `@EJB`, `@Path`) — not Spring
- WAR packaging deployed to WildFly
- `persistence.xml` for JPA/Hibernate configuration
- Maven profiles for SonarQube analysis

### Context Rules

- `.cursor/rules/platform-backend.mdc` auto-applies for `.java` files
- `.cursor/rules/platform-backend.mdc` contains backend-specific patterns and conventions
- Cursor's Task tool may not work — delegate via chat, not programmatic dispatch
