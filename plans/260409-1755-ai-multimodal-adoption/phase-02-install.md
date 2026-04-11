---
phase: 2
title: Install into packages/core/skills/ai-multimodal/ and register
effort: 20m
depends: [1]
---

## Context

Phase 1 produced a sanitized staging copy at `/tmp/ai-multimodal-staging/`. This phase moves it into the kit source tree and registers it in `package.yaml`.

## Files (ownership — exclusive to Phase 2)

- `packages/core/skills/ai-multimodal/` (new directory + all contents)
- `packages/core/package.yaml` (append skill entry)

## Tasks

1. Create `packages/core/skills/ai-multimodal/` directory.
2. Copy staging → target preserving structure:
   ```
   packages/core/skills/ai-multimodal/
     SKILL.md
     .env.example
     references/
       audio-processing.md
       image-generation.md
       video-analysis.md
       vision-understanding.md
       document-extraction.md
     scripts/
       gemini_batch_process.py
       media_optimizer.py
       document_converter.py
       requirements.txt
       tests/
         ...
   ```
3. Verify script files are executable-mode-preserved (`chmod +x` if needed; scripts use `python3` shebang not direct exec).
4. Edit `packages/core/package.yaml`:
   - Under `provides.skills:` append `- ai-multimodal` (keep alphabetical or append at end — match existing ordering).
5. Do NOT touch `.claude/skills/` — it is generated output.

## Validation

- [ ] `ls packages/core/skills/ai-multimodal/SKILL.md` succeeds.
- [ ] `ls packages/core/skills/ai-multimodal/references/` shows 5 files.
- [ ] `ls packages/core/skills/ai-multimodal/scripts/` shows 3 .py + requirements.txt + tests/.
- [ ] `grep ai-multimodal packages/core/package.yaml` returns one match in `provides.skills`.
- [ ] No files written outside `packages/core/skills/ai-multimodal/` except the one `package.yaml` edit.

## Success Criteria

- Skill physically present in `packages/core/skills/`.
- Registered in `package.yaml`.
- Kit is ready for Phase 3 (Python deps) and Phase 4 (verify/regen).
