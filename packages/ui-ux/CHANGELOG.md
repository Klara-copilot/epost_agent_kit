# Changelog: ui-ux

All notable changes to the `ui-ux` package will be documented in this file.

## [Unreleased]

### Changed
- Updated `epost-muji` skill bindings and `memory: project`

## [1.0.0] - 2026-02-08

Initial release.

### Agents

- Added `epost-muji` — MUJI UI library agent with dual flows: library development (Figma-to-code pipeline) and consumer guidance (component knowledge, integration patterns)

### Skills

- Added `muji/klara-theme` — Web (React) component knowledge from klara-theme
- Added `muji/ios-theme` — iOS (SwiftUI) component knowledge from ios-theme
- Added `muji/android-theme` — Android (Compose) component knowledge from android-theme
- Added `muji/figma-variables` — Design token architecture (semantic, component, raw layers)
- Added `web/klara-theme` — Component development pipeline for klara-theme
- Added `web/figma-integration` — Figma MCP tool patterns for design token extraction

### Commands

- Added `/docs:component` — Document a klara-theme component (Figma data + prop mapping)
- Added `/design:fast` — Quick UI design implementation
