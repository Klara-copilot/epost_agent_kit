# Changelog: platform-backend

All notable changes to the `platform-backend` package will be documented in this file.

## [Unreleased]

### Changed
- Updated `epost-backend-developer` skill bindings and `memory: project`

## [1.0.0] - 2026-02-08

Initial release.

### Agents

- Added `epost-backend-developer` — Java EE backend specialist (Jakarta EE 8, WildFly 26)

### Skills

- Added `backend/javaee` — Jakarta EE 8, JAX-RS, CDI, EJB patterns
- Added `backend/databases` — PostgreSQL, MongoDB, Hibernate ORM patterns

### Commands

- Added `/backend:cook` — Implement backend features (Java EE, WildFly)
- Added `/backend:test` — Run Maven tests (unit + integration via Arquillian)
