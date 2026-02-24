---
title: Backend Debug
description: (ePost) Debug Java EE issues, WildFly deployment, JPA/Hibernate, and REST API problems
agent: epost-backend-developer
argument-hint: [issue description or error log]
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# Backend Debug

Debug backend-specific issues including Java EE container problems, WildFly deployment, JPA/Hibernate queries, CDI/EJB injection, and REST API errors.

## Process

1. **Analyze** — Read error logs, stack traces, or issue description
2. **Locate** — Find relevant Java files, persistence config, or deployment descriptors
3. **Diagnose** — Identify root cause using systematic debugging methodology
4. **Fix** — Apply targeted fix following Jakarta EE patterns
5. **Verify** — Run Maven tests to confirm fix

## Focus Areas

- WildFly deployment and classloading issues
- JPA/Hibernate query problems and N+1 queries
- CDI/EJB injection failures
- JAX-RS endpoint routing and serialization
- PostgreSQL/MongoDB connection and query issues
- Maven build and dependency conflicts
- Transaction management problems
