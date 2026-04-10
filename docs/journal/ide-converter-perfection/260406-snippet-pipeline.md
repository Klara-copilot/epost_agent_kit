# Phase 3: Snippet Pipeline + Per-Package Snippets

**Date**: 2026-04-06
**Agent**: epost-fullstack-developer
**Epic**: ide-converter-perfection
**Plan**: plans/260405-2049-ide-converter-perfection/

## What was implemented

Created COPILOT.snippet.md and CURSOR.snippet.md for all 8 platform packages (a11y, design-system, domains, kit, platform-android, platform-backend, platform-ios, platform-web). Registered `copilot_snippet` and `cursor_snippet` fields in each package's `package.yaml`. Updated core snippets to trim platform-specific content. Created `snippet-pipeline.md` reference doc. Updated SKILL.md "Current Gap" section to reflect split rules are now implemented.

## Key decisions and why

- **COPILOT.snippet.md shorter than CLAUDE**: Copilot context windows are smaller; routing table + conventions + starter prompts is the right signal density. Skill catalogue and git conventions live in CLAUDE only.
- **CURSOR.snippet.md references specific .mdc file names**: Gives users immediate discovery — they can see exactly which rule applies to which file type without reading docs.
- **core snippets trimmed to routing-only**: Platform-specific content is now owned by each platform package. Core keeps the universal routing table, handoff workflow, and Copilot/Cursor behavioral notes.

## What almost went wrong

- Edit tool requires reading files in the same conversation "batch" — batch read via bash output doesn't satisfy the constraint. Had to read each package.yaml individually before editing. [core skill should note this edge case more explicitly]
