# skill-discovery: Remove Lazy-Loader Protocol

**Date**: 2026-04-02
**Agent**: epost-fullstack-developer
**Epic**: kit-rationalization
**Plan**: plans/260402-0949-kit-routing-redesign/

## What was implemented

Rewrote `packages/core/skills/skill-discovery/SKILL.md` from a 175-line 4-step lazy-loader protocol to a 49-line capability catalogue. Removed: the 4-step detection/query/load/apply protocol, all `skill-index.json` runtime routing references, dependency graph resolution (extends/requires), token budget enforcement (max 3 skills / 15 KB), and `tier: core` frontmatter field.

Kept: platform signal table, task-type signal table, a11y variants table. Updated description to "Reference catalogue of available skills by platform and task type."

## Key decisions and why

- **Decision**: Collapse to pure catalogue, no protocol framing
  **Why**: The 4-step protocol was orchestration logic embedded in a reference skill. Skills are passive knowledge; orchestration belongs in agent system prompts and rules files. The catalogue form is more honest about what the file actually provides.

- **Decision**: Keep a11y variant table as a separate section
  **Why**: A11y is the only skill family where the correct answer is always two skills (base + platform variant). Collapsing it into the main table would obscure that.

## What almost went wrong

The platform detection priority list (explicit hint > file extensions > CWD > project markers) was embedded in Step 1 and could have been lost. Verified it's not needed in the catalogue form — that logic belongs in individual agent system prompts, not in a reference file.
