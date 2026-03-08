---
phase: 1
title: "Verify kit install in luz_next — Copilot target"
effort: 20m
depends: []
---

# Phase 1: Verify Install Flow

Test the full install in luz_next before the live demo. Nothing should break on screen.

## Steps

1. In luz_next root, run:
   ```bash
   epost-kit init --profile web-fullstack --target vscode --yes
   ```

2. Verify output files exist:
   ```bash
   ls .github/agents/       # *.agent.md files
   ls .github/skills/       # skill directories
   cat .github/copilot-instructions.md
   ```

3. Open VSCode in luz_next → Copilot Chat → type `@` → confirm agents appear:
   - `@epost-fullstack-developer`
   - `@epost-planner`
   - `@epost-debugger`
   - `@epost-researcher`
   - `@epost-code-reviewer`

4. Quick smoke test — send one message to `@epost-researcher`:
   ```
   @epost-researcher I'm a Java JSF developer new to this project.
   In one paragraph, what is luz_next and what module should I look at first?
   ```
   Verify: agent responds with project context (not a generic answer).

5. Note any compatibility warnings from the install output.
   Document what features dropped (skills field, hooks) so you can explain this in demo.

## If install already done

- Check `.epost-metadata.json` for `"target": "vscode"` — if it says "claude", re-run with `--target vscode --fresh`
- Check both `.claude/` and `.github/` don't conflict (Copilot may show agents from both)

## Gotcha

The `web-b2b` profile doesn't exist. Use `web-fullstack` which includes:
`core, platform-web, platform-backend, domains`
