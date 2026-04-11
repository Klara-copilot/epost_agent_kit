---
phase: 1
title: Sanitize skill content (frontmatter, env paths, stub)
effort: 30m
depends: []
---

## Context

Source: `/Users/than/Downloads/ai-multimodal/` (external `.factory`-framework skill).
Target: staging copy at `/tmp/ai-multimodal-staging/` (Phase 2 moves it into `packages/core`).

## Overview

Normalize all non-epost artifacts before installation. Work in staging to keep Downloads untouched and to allow retries.

## Files (ownership — exclusive to Phase 1)

- `/tmp/ai-multimodal-staging/SKILL.md`
- `/tmp/ai-multimodal-staging/references/document-extraction.md` (new stub)
- `/tmp/ai-multimodal-staging/references/audio-processing.md` (review only, update env notes if referenced)
- `/tmp/ai-multimodal-staging/references/image-generation.md` (review only)
- `/tmp/ai-multimodal-staging/references/video-analysis.md` (review only)
- `/tmp/ai-multimodal-staging/references/vision-understanding.md` (review only)
- `/tmp/ai-multimodal-staging/.env.example` (rewrite path hints)

## Tasks

1. Copy `/Users/than/Downloads/ai-multimodal/` → `/tmp/ai-multimodal-staging/` (full recursive copy including scripts/).
2. Rewrite `SKILL.md` frontmatter to:
   ```yaml
   ---
   name: ai-multimodal
   description: <existing description minus Vietnamese fragment OR retained per unresolved Q3>
   user-invocable: true
   context: inline
   ---
   ```
   - Remove `allowed-tools` block.
   - Remove `license: MIT` (move to bottom of body as `## License` footnote if retained).
3. Rewrite env lookup chain in SKILL.md (lines ~98–104) from:
   ```
   1. Process environment
   2. Project root: .env
   3. .factory/.env
   4. .factory/skills/.env
   5. .factory/skills/ai-multimodal/.env
   ```
   to:
   ```
   1. Process environment: export GEMINI_API_KEY="your-key"
   2. Project root: .env
   3. packages/core/skills/ai-multimodal/.env
   ```
4. Grep all reference files + scripts for `.factory` string — rewrite or remove.
5. Create `references/document-extraction.md` stub:
   ```markdown
   # Document Extraction (PDF)

   > **STATUS**: Stub — upstream reference not available in source download.
   > TODO: Port full content from upstream or author from scratch.

   Covers PDF vision processing via Gemini. See SKILL.md "Document Extraction" section for capability overview and `scripts/gemini_batch_process.py --task extract` for CLI usage.
   ```
6. Update `.env.example` comments if they reference `.factory/` paths.
7. Review `scripts/gemini_batch_process.py`, `media_optimizer.py`, `document_converter.py` for any hardcoded `.factory` lookup — patch to match new env chain.

## Validation

- [ ] `grep -r '.factory' /tmp/ai-multimodal-staging/` returns zero matches.
- [ ] `grep -r 'allowed-tools' /tmp/ai-multimodal-staging/SKILL.md` returns zero matches.
- [ ] `user-invocable:` and `context:` fields present in SKILL.md frontmatter.
- [ ] All 5 `references/*.md` files exist.
- [ ] SKILL.md renders without broken reference links.

## Success Criteria

- Staging copy is self-contained and epost-compliant.
- Frontmatter parses as valid YAML.
- No `.factory`-framework residue.
