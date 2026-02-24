---
title: "Fix: Fast"
description: (ePost) Quick fix for simple issues
agent: epost-debugger
argument-hint: [short issue description]
---

# Quick Fix

Direct fast fix — skip auto-detection, apply minimal fix immediately.

<issue>$ARGUMENTS</issue>

## Process

1. **Quick diagnosis** — identify the issue from description
2. **Apply fix** — minimal correct change
3. **Verify** — run relevant checks (typecheck, tests, build)
4. **Add test** — if applicable, add a regression test

## Rules

- Fix root causes, not symptoms
- Keep changes minimal
- Do not ignore failed tests or use fake data
