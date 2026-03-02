---
name: cook
description: "(ePost) Implement features — auto-detects platform"
user-invocable: true
context: fork
agent: epost-implementer
metadata:
  argument-hint: "[feature description or plan file]"
---

# Cook — Unified Implementation Command

Implement features with automatic platform detection.

## Platform Detection

Detect platform per `skill-discovery` protocol.

## Complexity → Variant

- Single file or clear task → fast (skip plan question)
- Multi-file, one module → fast
- Multi-module or unknowns → parallel
- Has existing plan in ./plans/ → follow plan
- Plan with 3+ independent tasks → consider subagent-driven mode (see `subagent-driven-development` skill)

## Execution

Route to the detected platform agent with feature description and platform context.

<feature>$ARGUMENTS</feature>

**IMPORTANT:** Analyze the skills catalog and activate the skills needed for the detected platform.
