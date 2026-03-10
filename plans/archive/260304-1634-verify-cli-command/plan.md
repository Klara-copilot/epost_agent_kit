---
updated: 2026-03-09
title: "Enhance epost-kit verify CLI Command"
description: "Add checksum integrity, JSON output, and test coverage to existing verify command"
status: archived
priority: P2
effort: 3h
branch: master
tags: [cli, verify, testing, integrity]
created: 2026-03-04
---

# Enhance epost-kit verify CLI Command

## Overview

The `epost-kit verify` command exists (`src/commands/verify.ts`) with lint + health checks + mermaid graph. Needs: checksum integrity verification of installed files, JSON output mode, and test coverage.

## Current State

- `verify.ts` runs ref validation, skill health checks, generates mermaid graph
- Uses `lint` + `skill-health-checks` core modules
- Has `--strict` and `--dir` flags
- No tests, no JSON output, no installed-file integrity check
- `doctor` checks env health; `verify` checks content correctness -- no overlap needed

## Target State

- Verify checksums of installed files against `.epost-metadata.json`
- `--json` flag for CI pipeline consumption
- `--fix` flag to re-sync drifted files via `epost-kit init`
- Integration + unit tests
- Exit codes: 0=pass, 1=errors, 2=warnings-only (matches doctor pattern)

## Platform Scope
- [x] CLI (TypeScript/Node)

## Implementation Phases

1. [Phase 01: Checksum Integrity Check](./phase-01-checksum-integrity.md)
2. [Phase 02: JSON Output + CI Integration](./phase-02-json-output.md)
3. [Phase 03: Test Coverage](./phase-03-test-coverage.md)

## Key Dependencies

- `core/checksum.ts` -- existing SHA256 utilities
- `.epost-metadata.json` -- installed file registry with checksums
- `core/skill-health-checks.ts`, `core/ref-validator.ts` -- already used

## Success Criteria

- [ ] `epost-kit verify` detects modified/missing installed files
- [ ] `--json` outputs machine-readable results
- [ ] `--strict` exits 1 on warnings
- [ ] Integration tests cover pass/fail/warning scenarios
- [ ] Exit codes match doctor convention (0/1/2)

## Risk Assessment

Low risk. Additive changes to existing command. Checksum check reuses `core/checksum.ts`.
