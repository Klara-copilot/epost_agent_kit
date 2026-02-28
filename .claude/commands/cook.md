---
title: Cook
description: (ePost) Implement features — auto-detects platform
agent: epost-implementer
argument-hint: [feature description or plan file]
---

# Cook — Unified Implementation Command

Implement features with automatic platform detection.

## Platform Detection

1. Check `$ARGUMENTS` for explicit platform hint:
   - Starts with "ios", "android", "web", "backend" → use that platform
2. If no hint, detect from changed files:
   - `git diff --cached --name-only` + `git diff --name-only`
   - `.tsx/.ts/.jsx/.js/.scss/.css` → web → delegate to epost-web-developer
   - `.swift` → ios → delegate to epost-ios-developer
   - `.kt/.kts` → android → delegate to epost-android-developer
   - `.java` → backend → delegate to epost-backend-developer
3. If mixed platforms → delegate to epost-orchestrator
4. If no changed files → check CWD path for platform signals
5. If still unknown → ask user (max 1 question)

## Complexity → Variant

- Single file or clear task → fast (skip plan question)
- Multi-file, one module → fast
- Multi-module or unknowns → parallel
- Has existing plan in ./plans/ → follow plan

## Execution

Route to the detected platform agent with feature description and platform context.

<feature>$ARGUMENTS</feature>

**IMPORTANT:** Analyze the skills catalog and activate the skills needed for the detected platform.
