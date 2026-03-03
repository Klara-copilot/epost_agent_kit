---
title: "Copilot adapter integration + additional packages in init"
description: "Wire copilot adapter into init flow and add post-profile additional package selection"
status: done
priority: P2
effort: 3h
branch: master
tags: [cli, copilot, init, packages]
created: 2026-03-03
---

# Copilot Adapter Integration + Additional Packages in Init

## Overview

Two related enhancements to `epost-kit init`:
1. **Copilot adapter is already implemented** (`copilot-adapter.ts`, `claude-adapter.ts`, `target-adapter.ts`) and wired into init. The `--target` CLI flag is missing -- users must select interactively. Add `--target` flag.
2. **Additional packages step** -- after profile selection resolves packages, let user add more packages beyond the profile's set (not just optional ones).

## Current State

- `CopilotAdapter` class exists at `epost-agent-cli/src/core/copilot-adapter.ts` -- fully implemented
- `target-adapter.ts` factory + `ClaudeAdapter` exist and are wired into init
- Init flow already: selects profiles -> resolves packages -> shows optional -> selects IDE target -> installs
- No `--target` CLI option (only interactive select at line 308)
- No "additional packages" step -- users only see profile packages + profile optional packages
- `loadAllManifests()` returns ALL available packages from `packages/` dir

## Target State

- `epost-kit init --target github-copilot` works non-interactively
- After profile selection + optional packages, new step: "Add additional packages?" showing all available packages NOT already selected
- Additional packages are resolved with dependency tracking (via `resolvePackages`)
- Works for both interactive and `--yes` mode (skip in `--yes`)

## Platform Scope
- [x] CLI (epost-agent-cli)

## Implementation Phases

1. [Phase 01: Add --target CLI flag](./phase-01-target-flag.md)
2. [Phase 02: Additional packages step in init](./phase-02-additional-packages.md)

## Key Dependencies

- Existing `TargetAdapter` interface + factory
- Existing `loadAllManifests()` for listing all packages
- Existing `resolvePackages()` for dependency resolution

## Success Criteria

- [ ] `epost-kit init --target github-copilot --yes` installs to `.github/`
- [ ] Interactive init shows "Add additional packages?" after optional step
- [ ] Selected additional packages are dependency-resolved and installed
- [ ] Existing tests pass
- [ ] `--target` value persists in metadata for future updates

## Risk Assessment

Low risk -- both changes are additive. No existing behavior changes.
