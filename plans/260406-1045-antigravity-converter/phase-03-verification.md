---
phase: 3
title: "Verification"
effort: 1h
depends: [1, 2]
---

## Context

- Plan: [plan.md](plan.md)
- CLI repo: `epost-agent-kit-cli/`

## TODO

- [ ] Run `npm test` — must pass (301+ tests, 0 failures)
- [ ] Run `npx tsc --noEmit` — 0 TypeScript errors
- [ ] Run `epost-kit init --target antigravity --yes` in a temp dir
- [ ] Verify `GEMINI.md` at project root — has agent routing table, platform conventions
- [ ] Verify `AGENTS.md` at project root — same content as JetBrains output
- [ ] Verify `.antigravity/agents/*.yaml` — at least one file per epost agent
- [ ] Verify `skills/web-frontend/SKILL.md` — Markdown-only, no `---` frontmatter
- [ ] Verify `.agent/rules/web.md` exists
- [ ] Run: `grep -r '\.claude/' GEMINI.md AGENTS.md .antigravity/ skills/ .agent/` → 0 results
- [ ] Check compatibility report output mentions hooks/commands not supported

## Success Criteria (from plan.md)

1. `epost-kit init --target antigravity` produces `GEMINI.md` + `AGENTS.md` at project root
2. `epost-kit init --target antigravity` produces `.antigravity/agents/*.yaml`
3. `epost-kit init --target antigravity` produces `skills/*/SKILL.md` (YAML stripped)
4. `epost-kit init --target antigravity` produces `.agent/rules/{platform}.md`
5. No `.claude/` path references in any output
6. All tests pass
