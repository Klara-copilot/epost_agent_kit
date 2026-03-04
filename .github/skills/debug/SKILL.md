---
name: debug
description: "(ePost) Debug issues — auto-detects platform"
user-invokable: true
context: fork
agent: epost-debugger
metadata:
  argument-hint: "[issue description or error log]"
  connections:
    requires: [debugging]
---

# Debug — Unified Debug Command

Debug platform-specific issues with automatic platform detection.

## Platform Detection

Detect platform per `skill-discovery` protocol.

## Execution

1. Detect platform
2. Route to platform-specific agent (read-only investigation tools preferred)
3. Analyze error context, gather logs, identify root cause
4. Explain root cause and suggest fix (do NOT auto-apply fix — that's `/fix`)

<issue>$ARGUMENTS</issue>

**IMPORTANT:** Analyze the skills catalog and activate needed skills for the detected platform.
