---
title: Adopt external ai-multimodal skill into packages/core
status: active
created: 2026-04-09
updated: 2026-04-09
effort: 1.5h
phases: 4
platforms: [all]
breaking: false
blocks: []
blockedBy: []
tags: [skill-adoption, python, gemini, multimodal, packages-core]
---

## Summary

Adopt the external `ai-multimodal` skill (Google Gemini multimodal processing) from `/Users/than/Downloads/ai-multimodal/` into `packages/core/skills/ai-multimodal/`. The source skill was authored for the `.factory` framework and requires frontmatter compliance fixes, env-path rewrites, a stub for a missing reference file, and Python dependency integration.

## Scope Rationale

- **Problem**: External skill not installed; frontmatter/env paths non-compliant with epost conventions.
- **Why adopt into `packages/core`**: Cross-platform utility (no web/ios/android dependency); mirrors `repomix` placement.
- **Why now**: User request; files staged in Downloads.
- **Simplest version**: Sanitize → install → register → verify. Defer venv automation.
- **Cut at 50%**: Missing `document-extraction.md` becomes a minimal placeholder stub rather than full content rewrite.

## Phases

| # | File | Title | Effort | Depends |
|---|------|-------|--------|---------|
| 1 | [phase-01-sanitize.md](phase-01-sanitize.md) | Sanitize skill content (frontmatter, env paths, stub) | 30m | — |
| 2 | [phase-02-install.md](phase-02-install.md) | Install into `packages/core/skills/ai-multimodal/` and register | 20m | 1 |
| 3 | [phase-03-python-deps.md](phase-03-python-deps.md) | Python deps integration and smoke test | 20m | 2 |
| 4 | [phase-04-verify.md](phase-04-verify.md) | Verify (kit-verify, skill-index regen) | 20m | 3 |

## Constraints

- ALL writes go to `packages/core/skills/ai-multimodal/` — never edit `.claude/` directly.
- Phase 1 operates on a **staging copy** under `/tmp/ai-multimodal-staging/` to avoid mutating Downloads. Phase 2 moves sanitized files into `packages/core/`.
- Frontmatter MUST use standard epost fields: `name`, `description`, `user-invocable`, `context`. Remove `allowed-tools` and `license` (move license note to body if needed).
- Env path lookup chain must be rewritten from `.factory/skills/...` to epost equivalents (project root `.env`, `packages/core/skills/ai-multimodal/.env`).
- Python scripts reference the kit venv at `.claude/skills/.venv/bin/python3` per CLAUDE.md convention — scripts themselves must remain venv-agnostic (use `#!/usr/bin/env python3`); invocation pattern is documented in SKILL.md.
- Do NOT auto-run `pip install` against the kit venv without user confirmation (requirements introduce new deps: `google-genai`, `python-dotenv`, `pillow`).
- `package.yaml` update: append `ai-multimodal` to `provides.skills` (alphabetical position acceptable).
- After Phase 4 passes, run `set-active-plan.cjs` and append entry to `plans/index.json`.

## Success Criteria

- [ ] `packages/core/skills/ai-multimodal/SKILL.md` exists with compliant frontmatter (no `allowed-tools`, has `user-invocable`, `context`).
- [ ] All 5 reference files present: `audio-processing.md`, `image-generation.md`, `video-analysis.md`, `vision-understanding.md`, `document-extraction.md` (stub OK).
- [ ] 3 Python scripts present under `scripts/` with `requirements.txt`.
- [ ] `package.yaml` lists `ai-multimodal` under `provides.skills`.
- [ ] `node .claude/scripts/generate-skill-index.cjs` succeeds and `skill-index.json` contains `ai-multimodal`.
- [ ] `node packages/core/scripts/verify.cjs` passes (no new errors introduced).
- [ ] Manual smoke test: `python3 scripts/gemini_batch_process.py --help` runs (or fails with clear missing-dep error — not syntax error).
- [ ] Plan activated and entry in `plans/index.json`.

## Risks

| Risk | Mitigation |
|------|-----------|
| New Python deps conflict with existing venv | Phase 3 lists deps; user installs manually |
| `generate-skill-index.cjs` rejects frontmatter | Phase 1 normalizes frontmatter to standard shape; Phase 4 regenerates |
| Missing `document-extraction.md` breaks navigation | Phase 1 creates minimal stub with TODO marker |
| `allowed-tools` field removal changes skill behavior | epost skills do not use `allowed-tools`; tool access governed by agent permissions |

## Unresolved Questions

1. Should `document-extraction.md` stub be flagged as a follow-up TODO to port from upstream, or is the SKILL.md body sufficient?
2. Does the kit want an `install.sh` pattern for Python-dep-carrying skills (not currently in any other skill — would set precedent)?
3. Should the Vietnamese fragment in the description be retained or removed for consistency with other epost skill descriptions?
