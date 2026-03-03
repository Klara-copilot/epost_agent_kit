---
name: plan
description: "(ePost) Create implementation plan — auto-detects complexity"
user-invocable: true
context: fork
agent: epost-architect
metadata:
  argument-hint: "[feature or task description]"
  connections:
    requires: [planning]
    enhances: [plan-fast, plan-deep, plan-parallel, plan-validate]
---

# Plan — Unified Planning Command

Create implementation plans with automatic complexity detection.

## Complexity Auto-Detection

1. **Simple** (1 module, clear scope, < 5 files) → delegate to `/plan-fast`
2. **Moderate** (multiple files, some research needed) → delegate to `/plan-deep`
3. **Complex** (multi-module, cross-platform, needs dependency mapping) → delegate to `/plan-parallel`

## Platform Detection

Detect platform per `skill-discovery` protocol. Pass detected platform as context to the selected variant.

## Heuristics

- Single sentence request → `:fast`
- Request mentions "research" or "investigate" → `:deep`
- Request mentions multiple platforms or modules → `:parallel`
- Request mentions "dependencies" or "phases" → `:parallel`
- If unsure → default to `:fast`, escalate if needed

<request>$ARGUMENTS</request>
<platform>{{detected_platform or "none"}}</platform>

**IMPORTANT:** Analyze the skills catalog and activate needed skills.
