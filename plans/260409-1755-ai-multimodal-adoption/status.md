# Plan Status: ai-multimodal-adoption

## Progress

| Phase | Title | Status |
|-------|-------|--------|
| 1 | Sanitize skill content (frontmatter, env paths, stub) | Done |
| 2 | Install into packages/core/skills/ai-multimodal/ and register | Done |
| 3 | Python dependency integration and smoke test | Done (pip install pending user approval) |
| 4 | Verify (kit-verify, skill-index regen, plan activation) | Done |

## Key Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-04-09 | Removed Vietnamese fragment from description | epost skills are English-only; fragment was a triggering note redundant with the full description |
| 2026-04-09 | Removed license/allowed-tools frontmatter fields | Not valid epost skill frontmatter fields; license moved to body footnote |
| 2026-04-09 | Env path lookup: walk-up search for project root .env | More robust than hardcoded path depth; works regardless of invocation CWD |
| 2026-04-09 | Copied to .claude/skills/ manually (not via init) | generate-skill-index.cjs scans .claude/ only; manual copy mimics what init would do |

## Known Issues

- `pip install` for Python deps NOT yet run — requires user approval (google-genai, python-dotenv, pillow, pypdf, python-docx, markdown)
- Smoke test (`--help`) NOT yet run — blocked on pip install
- `skill-quality` warning: description lacks "Use when..." prefix (upstream description style, acceptable for adoption)
- `eval-coverage` warning: no eval-set.json (no other core skill has one either)

## Architecture Reference

- `packages/core/skills/ai-multimodal/` — source of truth
- `.claude/skills/ai-multimodal/` — generated copy (synced manually; will be overwritten on next `epost-kit init`)
