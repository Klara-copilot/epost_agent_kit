---
title: "Fix: Logs"
description: (ePost) Fix from log file analysis
agent: epost-debugger
argument-hint: [log file path or description]
---

# Fix From Log Analysis

Direct log-based fix — skip auto-detection, analyze logs immediately.

<issue>$ARGUMENTS</issue>

## Process

1. **Check logs** — read `./logs.txt` (or specified file). If missing, set up log piping: `2>&1 | tee logs.txt`
2. **Analyze** — use `Grep` with `head_limit: 30` to read last 30 lines
3. **Locate issue** — use `epost-researcher` to find the issue in codebase
4. **Create fix plan** — identify files to change and approach
5. **Implement** — apply the fix
6. **Test** — run relevant tests
7. **Review** — verify fix resolves the logged errors
8. **Repeat** — if issues remain in logs, continue fixing

## Rules

- Fix root causes, not symptoms
- Set up permanent log piping if missing
- Check that fix resolves ALL logged errors, not just the first one
