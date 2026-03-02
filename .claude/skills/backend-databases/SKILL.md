---
name: backend-databases
description: "Use when working with PostgreSQL queries, MongoDB documents, or database persistence in the epost backend"
user-invocable: false
metadata:
  keywords:
    - postgresql
    - mongodb
    - database
    - sql
    - query
    - migration
    - connection-pool
  agent-affinity:
    - epost-implementer
    - epost-debugger
  platforms:
    - backend
---

# Database Knowledge

PostgreSQL for transactional data, MongoDB for documents/audit.

See `backend/javaee/persistence-patterns.md` for code patterns.
