---
title: Debug
description: (ePost) Debug issues — auto-detects platform
agent: epost-debugger
argument-hint: [issue description or error log]
---

# Debug — Unified Debug Command

Debug platform-specific issues with automatic platform detection.

## Platform Detection

1. Check `$ARGUMENTS` for explicit platform hint
2. If no hint, detect from changed files or error context:
   - `.tsx/.ts/.jsx/.js` → web: Next.js, React, TypeScript, Docker debugging
   - `.swift` → ios: crashes, concurrency, SwiftUI state, log capture via MCP
   - `.kt/.kts` → android: crashes, Compose, Hilt injection, performance
   - `.java` → backend: Java EE, WildFly, JPA/Hibernate, REST API
3. If mixed → delegate to epost-orchestrator
4. If no files → infer from error message keywords

## Execution

1. Detect platform
2. Route to platform-specific agent (read-only investigation tools preferred)
3. Analyze error context, gather logs, identify root cause
4. Explain root cause and suggest fix (do NOT auto-apply fix — that's `/fix`)

<issue>$ARGUMENTS</issue>

**IMPORTANT:** Analyze the skills catalog and activate needed skills for the detected platform.
