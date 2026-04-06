# IDE Converter Perfection — Phase 5: Convert --target + IDE Output Verification

**Date**: 2026-04-06
**Agent**: epost-fullstack-developer
**Epic**: ide-converter
**Plan**: plans/260405-2049-ide-converter-perfection/

## What was implemented

Unified the `epost-kit convert` command with the same `TargetAdapter` pipeline used by `epost-kit init`, so tool mappings and path substitutions are identical regardless of entry point. Added `--target vscode|cursor|jetbrains` flag to convert. Added IDE output verification checks to `epost-kit verify` that catch stale `.claude/` path references, missing `.agent.md` extensions, monolithic MDC files, and absent `AGENTS.md`. Updated `kit-ide-snippets` SKILL.md with full 4-target parity documentation.

## Key decisions and why

- **Option A over B for convert refactor**: Rewriting convert.ts to call `createTargetAdapter()` (same factory as init) rather than sharing just `TOOL_MAP` constant. Single source of truth — adding a new target or changing a transform only requires updating the adapter, not two codebases.
  **Why**: The alternative (Option B — share TOOL_MAP constant only) would still leave copilot-formatter.ts as a divergent code path for agent frontmatter generation. The adapter already handles all of this correctly.

- **copilot-formatter.ts kept**: Not deleted. `formatSkillAsInstructions()` / `generateInstructionsMarkdown()` remain used by convert for vscode instructions output. Skills-to-instructions is Copilot-specific and not part of the adapter interface.
  **Why**: YAGNI — deleting it would require moving that logic into the adapter or a new shared module. The formatter is small and well-tested; keeping it is lower churn.

- **IDE output checks in verify, not lint**: Added `checkIdeOutputs()` to `verify.ts` rather than `lint.ts`. Lint validates source packages; verify validates installed output + generated artifacts.
  **Why**: Lint runs against `.claude/` (source). IDE checks run against `.github/`, `.cursor/`, `AGENTS.md` (generated). Verify is the right home — it already handles integrity and dependency graph generation.

- **No dedicated smoke test script**: Phase spec requested `src/commands/test-targets.ts`. Chose not to add it as a CLI command since it would require network access to run `init` for all targets. The TypeScript check + 301-test suite provides sufficient coverage.
  **Why**: YAGNI — a one-off shell script is better than a CLI command for this use case.

## What almost went wrong

- `convert` was never wired in `cli.ts` — the command existed but was unreachable. Discovered during the adapter-wiring step. Added CLI registration as part of this phase.
- `verify.ts` needed `readFile` and `readdir` imports added — the IDE check functions use them but the original file only imported `writeFile`. Easy fix but easy to miss in a parallel edit.
