---
phase: 3
title: Python dependency integration and smoke test
effort: 20m
depends: [2]
---

## Context

The kit's Python venv lives at `.claude/skills/.venv/` (per CLAUDE.md). It is shared across all Python-carrying skills. `ai-multimodal` introduces three new deps: `google-genai`, `python-dotenv`, `pillow`.

No prior skill in `packages/core/` ships a `requirements.txt`, so this phase documents the manual-install convention rather than automating it (would set precedent — surfaced as unresolved Q2).

## Files (ownership — exclusive to Phase 3)

- `packages/core/skills/ai-multimodal/scripts/requirements.txt` (review; keep pinned versions if present)
- `packages/core/skills/ai-multimodal/SKILL.md` (append install-note block only — no other edits)

## Tasks

1. Inspect `scripts/requirements.txt`. If versions are unpinned, leave as-is (upstream choice); if pinned, preserve.
2. Append to `SKILL.md` a `## Installation` section (after `## Quick Start` `### Prerequisites` or as replacement for the existing `Install SDK` block):
   ```markdown
   ### Installation

   This skill requires Python deps installed in the kit venv:

   ```bash
   .claude/skills/.venv/bin/pip install -r packages/core/skills/ai-multimodal/scripts/requirements.txt
   ```

   Invoke scripts using the venv interpreter:

   ```bash
   .claude/skills/.venv/bin/python3 packages/core/skills/ai-multimodal/scripts/gemini_batch_process.py --help
   ```
   ```
3. Request user confirmation before running `pip install` (per `Requires Approval` rules — new dependencies).
4. After user approves, run the pip install command.
5. Smoke test: run `gemini_batch_process.py --help` via the venv python; assert exit 0 and a usage message prints.
6. If smoke test fails with an import error → surface the missing dep to user; do NOT silently patch requirements.txt without approval.

## Validation

- [ ] `requirements.txt` present and readable.
- [ ] `SKILL.md` includes the Installation block with venv-explicit commands.
- [ ] `pip install` completes without errors (after user approval).
- [ ] `python3 gemini_batch_process.py --help` exits 0 and prints usage.
- [ ] `python3 media_optimizer.py --help` exits 0.
- [ ] `python3 document_converter.py --help` exits 0.

## Success Criteria

- Python deps installed in kit venv (user-approved).
- All 3 scripts runnable via `--help` with no syntax errors.
- SKILL.md documents the venv-based invocation pattern.
