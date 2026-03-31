# Phase 2: Security Skills — STRIDE+OWASP + Pre-Commit Scan

**Date**: 2026-03-30
**Agent**: epost-fullstack-developer
**Epic**: claudekit-adoption
**Plan**: plans/260329-1414-claudekit-adoption/

## What was implemented

Two security skills adopted from claudekit analysis:

1. `security` — Full threat audit workflow: scope analysis → STRIDE per entry point → OWASP Top 10 classification → dep audit → secret detection → severity ranking → report with remediation. Includes `--fix`, `--scope`, `--deps-only`, `--secrets-only` flags. Reference file covers per-feature checklists (REST API, DB, Auth, File Upload).

2. `security-scan` — Lightweight pre-commit scanner: checks staged files by default, detects 5 categories (secrets, injection, unsafe randomness, dangerous functions, path traversal), redacts secrets in output, supports `--all` and `--json` modes.

## Key decisions and why

- **Decision**: Inlined severity rubric into `security` SKILL.md instead of creating a separate `references/severity-rubric.md`
  **Why**: Content is a 5-row table — too small to justify a reference file. KISS. Phase spec mentioned it as optional.

- **Decision**: `security-scan` gives BLOCK/WARN/PASS verdict levels rather than Critical/High/Medium/Low
  **Why**: Pre-commit context needs binary decisions (block commit or not), not severity gradations. Gradations belong to the full `security` audit.

- **Decision**: Both skills enhance `code-review` (not `audit`)
  **Why**: They complement code review directly. The `audit` skill is higher-level orchestration; these are discipline/methodology skills in the quality tier.

## What almost went wrong

Nothing unexpected. Straightforward knowledge artifact creation — no runtime behavior to verify.
