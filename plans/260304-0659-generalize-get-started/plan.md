---
title: "Generalize /get-started for any project type"
description: "Remove Java/Maven-specific examples from get-started skill, make all guidance project-agnostic"
status: pending
priority: P1
effort: 1h
branch: master
tags: [skill, onboarding, generalization]
created: 2026-03-04
---

# Generalize /get-started for Any Project Type

## Overview

Remove Java/Maven/epost-backend-specific hardcoded examples from the get-started skill. Replace with generic, project-type-agnostic guidance that works for Node.js, Python, Rust, Swift, Kotlin, Go, etc.

## Current State

Phase 3 (Environment Setup) contains:
- Java-specific tool install logic (mvn, mvnw, openjdk)
- Maven-specific dep resolution commands
- epost-specific env var names (JWT_SERVICE_HOST_PORT, LUZ_DOCS_VIEW_CONTROLLER_HOST_PORT)
- Java-specific build examples (mvn package, docker-compose)
- GCP Artifact Registry reference (epost infra)

Phase 1 (Research) already uses generic markers (package.json/pom.xml/Cargo.toml/Package.swift) -- good.

## Target State

All phases use generic "detect then act" patterns:
- Tool install: detect from project markers, install via brew/system package manager
- Deps: detect package manager from lockfile/manifest, run appropriate install
- Build/start: extract commands from project config (scripts, Makefile, etc.)
- Examples use diverse project types, not just Java

## Platform Scope
- [x] All (platform-agnostic -- that's the point)

## Implementation Phases

1. [Phase 01: Generalize get-started SKILL.md](./phase-01-generalize-skill.md)

## Key Dependencies

- `packages/core/skills/get-started/SKILL.md` (source of truth)

## Success Criteria

- [ ] No Java/Maven-specific hardcoded logic in skill
- [ ] No epost-specific env var names or infra references
- [ ] Phase 3 uses detect-from-markers pattern for all ecosystems
- [ ] Phase 4 examples are diverse (not just Maven/Docker)
- [ ] Skill works unchanged for Node, Python, Rust, Swift, Kotlin, Go, Java projects

## Risk Assessment

Low risk -- text changes only, no structural changes to flow.
