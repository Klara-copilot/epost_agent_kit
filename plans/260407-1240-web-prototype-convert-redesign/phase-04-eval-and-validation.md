---
phase: 4
title: Eval set and final validation
effort: S
depends: [1, 2, 3]
---

## Context

Final phase. Verifies the skill is discoverable, triggers on documented prompts, all reference files resolve, and `kit-verify` passes. Also tunes the SKILL.md description if eval results flag trigger drift.

## Files to Create / Modify

**Create**:
- `packages/platform-web/skills/web-prototype-convert/eval-set.yaml`

**Modify (only if eval fails)**:
- `packages/platform-web/skills/web-prototype-convert/SKILL.md` (description tuning)

## eval-set.yaml Requirements

Minimal eval set following the kit convention. Each case tests a trigger phrase maps to this skill.

### Required test cases

Positive (should trigger the skill):
- "convert this prototype to our code"
- "migrate this mockup into luz_next"
- "turn this proof of concept into production code"
- "convert this Vite+React prototype to a luz module"
- "take this plain HTML mock and rebuild it in klara-theme"
- "convert this Next.js prototype"

Negative (should NOT trigger this skill):
- "write a new component from scratch" → should route to `web-frontend`
- "review this component" → should route to code-reviewer
- "fix a bug in this existing module" → should route to `fix`
- "update klara-theme Button component" → should route to `ui-lib-dev`

### Format

Follow existing eval-set.yaml files in `packages/platform-web/skills/*/` as template.

## Validation Checklist

Run these checks in order:

**1. File existence and size**
```bash
cd packages/platform-web/skills/web-prototype-convert
wc -l SKILL.md references/*.md
```
- SKILL.md ≤ 80 lines
- Each reference file ≤ 200 lines
- All 5 reference files exist

**2. No dangling links**
Grep SKILL.md for `references/` — every match must correspond to an existing file.

**3. Frontmatter**
- `user-invocable: true`
- `description` starts with `"(ePost) Use when:"` (kit convention)
- No version field

**4. Content sanity checks**
- SKILL.md describes 4 phases (A/B/C/D) with names UNDERSTAND / DECIDE / IMPLEMENT / VALIDATE
- SKILL.md Phase C explicitly says "read live klara source at implementation time"
- SKILL.md Phase B documents the ✅/🟡/🔴 three-section output contract
- analysis-checklist.md covers 7 sections
- component-mapping.md has a "no-match list"
- token-mapping.md has WRONG vs RIGHT examples
- style-migration.md covers Vite+React, Next.js Pages Router, plain HTML+JS restructuring
- data-migration.md covers FetchBuilder, RTK dual-store, Zustand migration

**5. kit-verify**
```bash
node packages/kit/scripts/kit-verify.cjs
```
Must pass with no errors referring to web-prototype-convert.

**6. Eval run**
Run the skill eval harness against eval-set.yaml. All positive cases must trigger; negative cases must not.

## Success Criteria

- [ ] eval-set.yaml exists with ≥ 6 positive and ≥ 4 negative cases
- [ ] All file size caps respected
- [ ] No dangling references in SKILL.md
- [ ] `kit-verify` passes clean
- [ ] Eval runs green (all positive trigger, all negative do not)
- [ ] Description tuned if needed (document any rewrite in the commit message)

## Exit Criteria for the Plan

After Phase 4, the skill is:
- Enabled (`user-invocable: true`)
- Discoverable via kit verify
- Trigger-tested via eval
- Complete: SKILL.md + 5 reference files, all within caps
- Ready to be invoked by name on a real prototype
